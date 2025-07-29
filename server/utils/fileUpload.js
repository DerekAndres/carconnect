// ========================================
// MANEJADOR DE CARGA DE ARCHIVOS
// Para manejar subida de imágenes y videos
// ========================================

const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp"); // Para optimización de imágenes
const ffmpeg = require("fluent-ffmpeg"); // Para procesamiento de videos

// Configuración de directorios
const UPLOAD_DIR = path.join(__dirname, "../../uploads");
const VEHICLE_IMAGES_DIR = path.join(UPLOAD_DIR, "vehicles/images");
const VEHICLE_VIDEOS_DIR = path.join(UPLOAD_DIR, "vehicles/videos");

// Crear directorios si no existen
[UPLOAD_DIR, VEHICLE_IMAGES_DIR, VEHICLE_VIDEOS_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isVideo = file.mimetype.startsWith("video/");
    const uploadPath = isVideo ? VEHICLE_VIDEOS_DIR : VEHICLE_IMAGES_DIR;
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generar nombre único: timestamp_random_originalname
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, extension);
    const sanitizedBaseName = baseName.replace(/[^a-zA-Z0-9]/g, "_");

    const filename = `${timestamp}_${random}_${sanitizedBaseName}${extension}`;
    cb(null, filename);
  },
});

// Filtros de archivos
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
  const allowedVideoTypes = /mp4|mov|avi|wmv|flv|webm/;

  const extname =
    allowedImageTypes.test(path.extname(file.originalname).toLowerCase()) ||
    allowedVideoTypes.test(path.extname(file.originalname).toLowerCase());

  const mimetype =
    file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/");

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(
      new Error(
        "Solo se permiten archivos de imagen (JPG, PNG, GIF, WebP) y video (MP4, MOV, AVI, WMV, FLV, WebM)",
      ),
    );
  }
};

// Configuración de multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 10, // Máximo 10 archivos por vez
  },
  fileFilter: fileFilter,
});

// Funciones de procesamiento de imágenes
const processImage = async (filePath, options = {}) => {
  try {
    const {
      width = 1200,
      height = 800,
      quality = 85,
      createThumbnail = true,
    } = options;

    const dir = path.dirname(filePath);
    const filename = path.basename(filePath, path.extname(filePath));
    const extension = path.extname(filePath);

    // Procesar imagen principal
    const processedPath = path.join(dir, `${filename}_processed${extension}`);
    await sharp(filePath)
      .resize(width, height, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality })
      .toFile(processedPath);

    // Crear thumbnail
    let thumbnailPath = null;
    if (createThumbnail) {
      thumbnailPath = path.join(dir, `${filename}_thumb${extension}`);
      await sharp(filePath)
        .resize(300, 200, { fit: "cover" })
        .jpeg({ quality: 80 })
        .toFile(thumbnailPath);
    }

    // Obtener metadatos
    const metadata = await sharp(filePath).metadata();

    return {
      originalPath: filePath,
      processedPath,
      thumbnailPath,
      metadata: {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        size: fs.statSync(filePath).size,
      },
    };
  } catch (error) {
    console.error("Error procesando imagen:", error);
    throw error;
  }
};

// Funciones de procesamiento de videos
const processVideo = async (filePath, options = {}) => {
  try {
    const dir = path.dirname(filePath);
    const filename = path.basename(filePath, path.extname(filePath));

    return new Promise((resolve, reject) => {
      // Crear thumbnail del video
      const thumbnailPath = path.join(dir, `${filename}_thumb.jpg`);

      ffmpeg(filePath)
        .screenshots({
          count: 1,
          folder: dir,
          filename: `${filename}_thumb.jpg`,
          timemarks: ["2"], // Tomar screenshot a los 2 segundos
        })
        .on("end", async () => {
          try {
            // Obtener metadatos del video
            ffmpeg.ffprobe(filePath, (err, metadata) => {
              if (err) {
                reject(err);
                return;
              }

              const videoStream = metadata.streams.find(
                (stream) => stream.codec_type === "video",
              );
              const stats = fs.statSync(filePath);

              resolve({
                originalPath: filePath,
                thumbnailPath,
                metadata: {
                  width: videoStream?.width || 0,
                  height: videoStream?.height || 0,
                  duration: metadata.format.duration || 0,
                  format: metadata.format.format_name,
                  size: stats.size,
                },
              });
            });
          } catch (error) {
            reject(error);
          }
        })
        .on("error", reject);
    });
  } catch (error) {
    console.error("Error procesando video:", error);
    throw error;
  }
};

// Middleware para manejar subida de múltiples archivos
const uploadVehicleMedia = upload.array("vehicleMedia", 10);

// Función para procesar archivos subidos
const processUploadedFiles = async (files, vehicleId) => {
  const processedFiles = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const isVideo = file.mimetype.startsWith("video/");

    try {
      let processedData;

      if (isVideo) {
        processedData = await processVideo(file.path);
      } else {
        processedData = await processImage(file.path, {
          createThumbnail: true,
        });
      }

      processedFiles.push({
        originalName: file.originalname,
        filename: file.filename,
        path: file.path,
        size: file.size,
        mimetype: file.mimetype,
        type: isVideo ? "video" : "image",
        vehicleId: vehicleId,
        isPrimary: i === 0, // Primer archivo es principal
        ...processedData,
      });
    } catch (error) {
      console.error(`Error procesando archivo ${file.filename}:`, error);
      // Continuar con otros archivos aunque uno falle
    }
  }

  return processedFiles;
};

// Función para eliminar archivos
const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error eliminando archivo:", error);
    return false;
  }
};

// Función para eliminar archivos de un vehículo
const deleteVehicleFiles = (vehicleFiles) => {
  vehicleFiles.forEach((file) => {
    deleteFile(file.path);
    if (file.processedPath) deleteFile(file.processedPath);
    if (file.thumbnailPath) deleteFile(file.thumbnailPath);
  });
};

// Función para obtener URL pública del archivo
const getFileUrl = (filePath, req) => {
  const relativePath = path.relative(UPLOAD_DIR, filePath);
  return `${req.protocol}://${req.get("host")}/uploads/${relativePath.replace(/\\/g, "/")}`;
};

module.exports = {
  uploadVehicleMedia,
  processUploadedFiles,
  processImage,
  processVideo,
  deleteFile,
  deleteVehicleFiles,
  getFileUrl,
  UPLOAD_DIR,
  VEHICLE_IMAGES_DIR,
  VEHICLE_VIDEOS_DIR,
};

// ========================================
// EJEMPLO DE USO EN RUTA EXPRESS
// ========================================

/*
const express = require('express');
const { uploadVehicleMedia, processUploadedFiles, getFileUrl } = require('./utils/fileUpload');
const router = express.Router();

// Ruta para subir archivos de vehículo
router.post('/vehicles/:id/upload', uploadVehicleMedia, async (req, res) => {
  try {
    const vehicleId = req.params.id;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No se subieron archivos' });
    }

    // Procesar archivos
    const processedFiles = await processUploadedFiles(files, vehicleId);

    // Guardar información en base de datos
    for (const fileData of processedFiles) {
      // INSERT INTO vehicle_media (vehicle_id, file_name, file_path, ...)
      await db.query(`
        INSERT INTO vehicle_media (
          vehicle_id, file_name, file_path, file_type, file_extension,
          file_size, is_primary, width, height
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        vehicleId,
        fileData.filename,
        fileData.path,
        fileData.type,
        path.extname(fileData.filename),
        fileData.size,
        fileData.isPrimary,
        fileData.metadata.width,
        fileData.metadata.height
      ]);
    }

    // Devolver URLs públicas
    const fileUrls = processedFiles.map(file => ({
      ...file,
      url: getFileUrl(file.path, req),
      thumbnailUrl: file.thumbnailPath ? getFileUrl(file.thumbnailPath, req) : null
    }));

    res.json({
      success: true,
      files: fileUrls
    });

  } catch (error) {
    console.error('Error en upload:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
*/
