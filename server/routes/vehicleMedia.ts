import { Router, Request, Response } from "express";
import { executeQuery, executeQuerySingle } from "../config/database.js";
import {
  upload,
  processUploadedFile,
  deleteFiles,
} from "../utils/fileUpload.js";

const router = Router();

// Interface definitions
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

// GET /api/vehicles/:vehicleId/media - Get all images for a vehicle
router.get("/:vehicleId/media", async (req: Request, res: Response) => {
  try {
    const vehicleId = parseInt(req.params.vehicleId);

    if (isNaN(vehicleId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vehicle ID",
      });
    }

    // Check if vehicle exists
    const vehicleExists = await executeQuerySingle(
      "SELECT id FROM vehicles WHERE id = ?",
      [vehicleId],
    );

    if (!vehicleExists) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    // Get all media for the vehicle
    const images = await executeQuery<VehicleImage>(
      "SELECT * FROM vehicle_media WHERE vehicle_id = ? ORDER BY display_order ASC, created_at ASC",
      [vehicleId],
    );

    res.json({
      success: true,
      data: images,
    });
  } catch (error) {
    console.error("Error fetching vehicle media:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching vehicle media",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// POST /api/vehicles/:vehicleId/media - Upload images for a vehicle
router.post(
  "/:vehicleId/media",
  upload.array("images", 10),
  async (req: Request, res: Response) => {
    try {
      const vehicleId = parseInt(req.params.vehicleId);

      if (isNaN(vehicleId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid vehicle ID",
        });
      }

      // Check if vehicle exists
      const vehicleExists = await executeQuerySingle(
        "SELECT id FROM vehicles WHERE id = ?",
        [vehicleId],
      );

      if (!vehicleExists) {
        return res.status(404).json({
          success: false,
          message: "Vehicle not found",
        });
      }

      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No files uploaded",
        });
      }

      // Get current maximum display order
      const maxOrderResult = await executeQuerySingle<{ max_order: number }>(
        "SELECT COALESCE(MAX(display_order), 0) as max_order FROM vehicle_media WHERE vehicle_id = ?",
        [vehicleId],
      );

      let nextOrder = (maxOrderResult?.max_order || 0) + 1;

      // Check if vehicle has any primary image
      const primaryExists = await executeQuerySingle(
        "SELECT id FROM vehicle_media WHERE vehicle_id = ? AND is_primary = true LIMIT 1",
        [vehicleId],
      );

      const uploadedImages: VehicleImage[] = [];

      // Process each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        try {
          // Process the uploaded file
          const processedFile = await processUploadedFile(file);

          // Determine if this should be the primary image
          const isPrimary = !primaryExists && i === 0;

          // Insert into database
          const insertQuery = `
          INSERT INTO vehicle_media 
          (vehicle_id, filename, original_name, url, thumbnail_url, is_primary, display_order)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

          const params = [
            vehicleId,
            processedFile.filename,
            processedFile.originalName,
            processedFile.url,
            processedFile.thumbnailUrl,
            isPrimary,
            nextOrder + i,
          ];

          const result = await executeQuery(insertQuery, params);
          const insertId = (result as any).insertId;

          // Get the inserted record
          const newImage = await executeQuerySingle<VehicleImage>(
            "SELECT * FROM vehicle_media WHERE id = ?",
            [insertId],
          );

          if (newImage) {
            uploadedImages.push(newImage);
          }
        } catch (fileError) {
          console.error("Error processing file:", fileError);
          // Continue with other files, but log the error
        }
      }

      if (uploadedImages.length === 0) {
        return res.status(500).json({
          success: false,
          message: "Failed to process any uploaded files",
        });
      }

      res.status(201).json({
        success: true,
        message: `Successfully uploaded ${uploadedImages.length} image(s)`,
        data: uploadedImages,
      });
    } catch (error) {
      console.error("Error uploading vehicle media:", error);
      res.status(500).json({
        success: false,
        message: "Error uploading vehicle media",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
);

// PUT /api/vehicles/:vehicleId/media/:mediaId - Update image metadata
router.put(
  "/:vehicleId/media/:mediaId",
  async (req: Request, res: Response) => {
    try {
      const vehicleId = parseInt(req.params.vehicleId);
      const mediaId = parseInt(req.params.mediaId);

      if (isNaN(vehicleId) || isNaN(mediaId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid vehicle ID or media ID",
        });
      }

      // Check if media exists and belongs to the vehicle
      const existingMedia = await executeQuerySingle<VehicleImage>(
        "SELECT * FROM vehicle_media WHERE id = ? AND vehicle_id = ?",
        [mediaId, vehicleId],
      );

      if (!existingMedia) {
        return res.status(404).json({
          success: false,
          message: "Media not found",
        });
      }

      const { is_primary, display_order } = req.body;

      // Build update query
      const updates: string[] = [];
      const params: any[] = [];

      if (is_primary !== undefined) {
        // If setting as primary, remove primary from other images
        if (is_primary) {
          await executeQuery(
            "UPDATE vehicle_media SET is_primary = false WHERE vehicle_id = ? AND id != ?",
            [vehicleId, mediaId],
          );
        }
        updates.push("is_primary = ?");
        params.push(is_primary);
      }

      if (display_order !== undefined) {
        updates.push("display_order = ?");
        params.push(parseInt(display_order));
      }

      if (updates.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No fields to update",
        });
      }

      params.push(mediaId, vehicleId);

      const updateQuery = `
      UPDATE vehicle_media 
      SET ${updates.join(", ")}
      WHERE id = ? AND vehicle_id = ?
    `;

      await executeQuery(updateQuery, params);

      // Fetch updated media
      const updatedMedia = await executeQuerySingle<VehicleImage>(
        "SELECT * FROM vehicle_media WHERE id = ?",
        [mediaId],
      );

      res.json({
        success: true,
        message: "Media updated successfully",
        data: updatedMedia,
      });
    } catch (error) {
      console.error("Error updating vehicle media:", error);
      res.status(500).json({
        success: false,
        message: "Error updating vehicle media",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
);

// DELETE /api/vehicles/:vehicleId/media/:mediaId - Delete specific image
router.delete(
  "/:vehicleId/media/:mediaId",
  async (req: Request, res: Response) => {
    try {
      const vehicleId = parseInt(req.params.vehicleId);
      const mediaId = parseInt(req.params.mediaId);

      if (isNaN(vehicleId) || isNaN(mediaId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid vehicle ID or media ID",
        });
      }

      // Get media info before deletion
      const mediaToDelete = await executeQuerySingle<VehicleImage>(
        "SELECT * FROM vehicle_media WHERE id = ? AND vehicle_id = ?",
        [mediaId, vehicleId],
      );

      if (!mediaToDelete) {
        return res.status(404).json({
          success: false,
          message: "Media not found",
        });
      }

      // Delete from database
      await executeQuery(
        "DELETE FROM vehicle_media WHERE id = ? AND vehicle_id = ?",
        [mediaId, vehicleId],
      );

      // Delete physical files
      try {
        await deleteFiles(mediaToDelete.filename);
      } catch (fileError) {
        console.error("Error deleting physical files:", fileError);
        // Don't fail the request if file deletion fails
      }

      // If deleted image was primary, set the first remaining image as primary
      if (mediaToDelete.is_primary) {
        const firstImage = await executeQuerySingle<VehicleImage>(
          "SELECT * FROM vehicle_media WHERE vehicle_id = ? ORDER BY display_order ASC, created_at ASC LIMIT 1",
          [vehicleId],
        );

        if (firstImage) {
          await executeQuery(
            "UPDATE vehicle_media SET is_primary = true WHERE id = ?",
            [firstImage.id],
          );
        }
      }

      res.json({
        success: true,
        message: "Media deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting vehicle media:", error);
      res.status(500).json({
        success: false,
        message: "Error deleting vehicle media",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
);

// POST /api/vehicles/:vehicleId/media/reorder - Reorder images
router.post(
  "/:vehicleId/media/reorder",
  async (req: Request, res: Response) => {
    try {
      const vehicleId = parseInt(req.params.vehicleId);

      if (isNaN(vehicleId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid vehicle ID",
        });
      }

      const { imageIds } = req.body;

      if (!Array.isArray(imageIds) || imageIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid image IDs array",
        });
      }

      // Verify all images belong to the vehicle
      const existingImages = await executeQuery<VehicleImage>(
        `SELECT id FROM vehicle_media WHERE vehicle_id = ? AND id IN (${imageIds.map(() => "?").join(",")})`,
        [vehicleId, ...imageIds],
      );

      if (existingImages.length !== imageIds.length) {
        return res.status(400).json({
          success: false,
          message: "Some images do not belong to this vehicle",
        });
      }

      // Update display orders
      const updatePromises = imageIds.map((imageId: number, index: number) => {
        return executeQuery(
          "UPDATE vehicle_media SET display_order = ? WHERE id = ? AND vehicle_id = ?",
          [index + 1, imageId, vehicleId],
        );
      });

      await Promise.all(updatePromises);

      // Get updated images
      const updatedImages = await executeQuery<VehicleImage>(
        "SELECT * FROM vehicle_media WHERE vehicle_id = ? ORDER BY display_order ASC",
        [vehicleId],
      );

      res.json({
        success: true,
        message: "Images reordered successfully",
        data: updatedImages,
      });
    } catch (error) {
      console.error("Error reordering vehicle media:", error);
      res.status(500).json({
        success: false,
        message: "Error reordering vehicle media",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
);

export default router;
