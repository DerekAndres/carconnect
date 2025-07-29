import { Router, Request, Response } from "express";
import {
  executeQuery,
  executeQuerySingle,
  executeTransaction,
} from "../config/database.js";
import {
  upload,
  processUploadedFile,
  ensureUploadDirectories,
} from "../utils/fileUpload.js";

const router = Router();

// Initialize upload directories
ensureUploadDirectories();

// Interface definitions
interface Vehicle {
  id?: number;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  condition: string;
  description: string;
  user_id: number;
  created_at?: Date;
  updated_at?: Date;
}

interface VehicleWithImages extends Vehicle {
  images: VehicleImage[];
}

interface VehicleImage {
  id: number;
  vehicle_id: number;
  filename: string;
  original_name: string;
  url: string;
  thumbnail_url: string;
  is_primary: boolean;
  display_order: number;
  created_at: Date;
}

// GET /api/vehicles - Get all vehicles with their images
router.get("/", async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      make,
      model,
      year,
      condition,
      minPrice,
      maxPrice,
    } = req.query;

    // Build WHERE clause for filtering
    const filters: string[] = [];
    const params: any[] = [];

    if (make) {
      filters.push("v.make LIKE ?");
      params.push(`%${make}%`);
    }

    if (model) {
      filters.push("v.model LIKE ?");
      params.push(`%${model}%`);
    }

    if (year) {
      filters.push("v.year = ?");
      params.push(parseInt(year as string));
    }

    if (condition) {
      filters.push("v.condition = ?");
      params.push(condition);
    }

    if (minPrice) {
      filters.push("v.price >= ?");
      params.push(parseFloat(minPrice as string));
    }

    if (maxPrice) {
      filters.push("v.price <= ?");
      params.push(parseFloat(maxPrice as string));
    }

    const whereClause =
      filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";

    // Calculate pagination
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
    params.push(parseInt(limit as string), offset);

    // Get vehicles with pagination
    const vehiclesQuery = `
      SELECT v.*, COUNT(*) OVER() as total_count
      FROM vehicles v
      ${whereClause}
      ORDER BY v.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const vehicles = await executeQuery<Vehicle & { total_count: number }>(
      vehiclesQuery,
      params,
    );

    if (vehicles.length === 0) {
      return res.json({
        success: true,
        data: [],
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total: 0,
          totalPages: 0,
        },
      });
    }

    // Get vehicle IDs for image fetching
    const vehicleIds = vehicles.map((v) => v.id);

    // Get all images for these vehicles
    const imagesQuery = `
      SELECT vm.*
      FROM vehicle_media vm
      WHERE vm.vehicle_id IN (${vehicleIds.map(() => "?").join(",")})
      ORDER BY vm.display_order ASC, vm.created_at ASC
    `;

    const images = await executeQuery<VehicleImage>(imagesQuery, vehicleIds);

    // Group images by vehicle_id
    const imagesByVehicle = images.reduce(
      (acc, img) => {
        if (!acc[img.vehicle_id]) {
          acc[img.vehicle_id] = [];
        }
        acc[img.vehicle_id].push(img);
        return acc;
      },
      {} as Record<number, VehicleImage[]>,
    );

    // Combine vehicles with their images
    const vehiclesWithImages: VehicleWithImages[] = vehicles.map((vehicle) => ({
      ...vehicle,
      images: imagesByVehicle[vehicle.id!] || [],
    }));

    const totalCount = vehicles[0].total_count;
    const totalPages = Math.ceil(totalCount / parseInt(limit as string));

    res.json({
      success: true,
      data: vehiclesWithImages,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: totalCount,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching vehicles",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// GET /api/vehicles/:id - Get single vehicle with images
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const vehicleId = parseInt(req.params.id);

    if (isNaN(vehicleId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vehicle ID",
      });
    }

    // Get vehicle
    const vehicle = await executeQuerySingle<Vehicle>(
      "SELECT * FROM vehicles WHERE id = ?",
      [vehicleId],
    );

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    // Get vehicle images
    const images = await executeQuery<VehicleImage>(
      "SELECT * FROM vehicle_media WHERE vehicle_id = ? ORDER BY display_order ASC, created_at ASC",
      [vehicleId],
    );

    const vehicleWithImages: VehicleWithImages = {
      ...vehicle,
      images,
    };

    res.json({
      success: true,
      data: vehicleWithImages,
    });
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching vehicle",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// POST /api/vehicles - Create new vehicle
router.post(
  "/",
  upload.array("images", 10),
  async (req: Request, res: Response) => {
    try {
      const {
        make,
        model,
        year,
        price,
        mileage,
        condition,
        description,
        user_id = 1, // Default user for now
      } = req.body;

      // Validate required fields
      if (!make || !model || !year || !price || !mileage || !condition) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
        });
      }

      // Validate data types
      const yearNum = parseInt(year);
      const priceNum = parseFloat(price);
      const mileageNum = parseInt(mileage);
      const userIdNum = parseInt(user_id);

      if (
        isNaN(yearNum) ||
        isNaN(priceNum) ||
        isNaN(mileageNum) ||
        isNaN(userIdNum)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid data types for numeric fields",
        });
      }

      // Insert vehicle
      const vehicleQuery = `
      INSERT INTO vehicles (make, model, year, price, mileage, condition, description, user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

      const vehicleParams = [
        make,
        model,
        yearNum,
        priceNum,
        mileageNum,
        condition,
        description,
        userIdNum,
      ];

      const queries = [{ query: vehicleQuery, params: vehicleParams }];

      // Process uploaded files
      const files = req.files as Express.Multer.File[];
      const imageQueries: { query: string; params: any[] }[] = [];
      const processedFiles: any[] = [];

      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          try {
            const processedFile = await processUploadedFile(file);
            processedFiles.push(processedFile);

            const imageQuery = `
            INSERT INTO vehicle_media (vehicle_id, filename, original_name, url, thumbnail_url, is_primary, display_order)
            VALUES (LAST_INSERT_ID(), ?, ?, ?, ?, ?, ?)
          `;

            const imageParams = [
              processedFile.filename,
              processedFile.originalName,
              processedFile.url,
              processedFile.thumbnailUrl,
              i === 0, // First image is primary
              i + 1, // Display order
            ];

            imageQueries.push({ query: imageQuery, params: imageParams });
          } catch (fileError) {
            console.error("Error processing file:", fileError);
            // Continue with other files
          }
        }
      }

      // Execute all queries in transaction
      const allQueries = [...queries, ...imageQueries];
      const results = await executeTransaction(allQueries);
      const vehicleId = (results[0] as any).insertId;

      // Fetch the created vehicle with images
      const newVehicle = await executeQuerySingle<Vehicle>(
        "SELECT * FROM vehicles WHERE id = ?",
        [vehicleId],
      );

      const images = await executeQuery<VehicleImage>(
        "SELECT * FROM vehicle_media WHERE vehicle_id = ? ORDER BY display_order ASC",
        [vehicleId],
      );

      const vehicleWithImages: VehicleWithImages = {
        ...newVehicle!,
        images,
      };

      res.status(201).json({
        success: true,
        message: "Vehicle created successfully",
        data: vehicleWithImages,
      });
    } catch (error) {
      console.error("Error creating vehicle:", error);
      res.status(500).json({
        success: false,
        message: "Error creating vehicle",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
);

// PUT /api/vehicles/:id - Update vehicle
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const vehicleId = parseInt(req.params.id);

    if (isNaN(vehicleId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vehicle ID",
      });
    }

    // Check if vehicle exists
    const existingVehicle = await executeQuerySingle<Vehicle>(
      "SELECT * FROM vehicles WHERE id = ?",
      [vehicleId],
    );

    if (!existingVehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    const { make, model, year, price, mileage, condition, description } =
      req.body;

    // Build update query dynamically
    const updates: string[] = [];
    const params: any[] = [];

    if (make !== undefined) {
      updates.push("make = ?");
      params.push(make);
    }
    if (model !== undefined) {
      updates.push("model = ?");
      params.push(model);
    }
    if (year !== undefined) {
      updates.push("year = ?");
      params.push(parseInt(year));
    }
    if (price !== undefined) {
      updates.push("price = ?");
      params.push(parseFloat(price));
    }
    if (mileage !== undefined) {
      updates.push("mileage = ?");
      params.push(parseInt(mileage));
    }
    if (condition !== undefined) {
      updates.push("condition = ?");
      params.push(condition);
    }
    if (description !== undefined) {
      updates.push("description = ?");
      params.push(description);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    updates.push("updated_at = NOW()");
    params.push(vehicleId);

    const updateQuery = `
      UPDATE vehicles 
      SET ${updates.join(", ")}
      WHERE id = ?
    `;

    await executeQuery(updateQuery, params);

    // Fetch updated vehicle with images
    const updatedVehicle = await executeQuerySingle<Vehicle>(
      "SELECT * FROM vehicles WHERE id = ?",
      [vehicleId],
    );

    const images = await executeQuery<VehicleImage>(
      "SELECT * FROM vehicle_media WHERE vehicle_id = ? ORDER BY display_order ASC",
      [vehicleId],
    );

    const vehicleWithImages: VehicleWithImages = {
      ...updatedVehicle!,
      images,
    };

    res.json({
      success: true,
      message: "Vehicle updated successfully",
      data: vehicleWithImages,
    });
  } catch (error) {
    console.error("Error updating vehicle:", error);
    res.status(500).json({
      success: false,
      message: "Error updating vehicle",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// DELETE /api/vehicles/:id - Delete vehicle
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const vehicleId = parseInt(req.params.id);

    if (isNaN(vehicleId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vehicle ID",
      });
    }

    // Check if vehicle exists
    const existingVehicle = await executeQuerySingle<Vehicle>(
      "SELECT * FROM vehicles WHERE id = ?",
      [vehicleId],
    );

    if (!existingVehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    // Get vehicle images to delete files
    const images = await executeQuery<VehicleImage>(
      "SELECT * FROM vehicle_media WHERE vehicle_id = ?",
      [vehicleId],
    );

    // Delete vehicle and images in transaction
    const queries = [
      {
        query: "DELETE FROM vehicle_media WHERE vehicle_id = ?",
        params: [vehicleId],
      },
      { query: "DELETE FROM vehicles WHERE id = ?", params: [vehicleId] },
    ];

    await executeTransaction(queries);

    // Delete physical files
    // Note: In production, you might want to do this asynchronously
    for (const image of images) {
      try {
        const { deleteFiles } = await import("../utils/fileUpload.js");
        await deleteFiles(image.filename);
      } catch (fileError) {
        console.error("Error deleting file:", fileError);
      }
    }

    res.json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting vehicle",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
