// ========================================
// API ENDPOINTS PARA MEDIOS DE VEHÍCULOS
// Manejo de subida, edición y eliminación de archivos
// ========================================

const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');
const {
  uploadVehicleMedia,
  processUploadedFiles,
  getFileUrl,
  deleteFile,
  deleteVehicleFiles
} = require('../utils/fileUpload');

const router = express.Router();

// Configuración de base de datos (ajustar según tu configuración)
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'car_connect_db',
  port: process.env.DB_PORT || 3306
};

// Crear conexión a base de datos
const getDbConnection = async () => {
  return await mysql.createConnection(dbConfig);
};

// ========================================
// RUTAS DE MEDIOS DE VEHÍCULOS
// ========================================

// Subir archivos para un vehículo
router.post('/vehicles/:vehicleId/media', uploadVehicleMedia, async (req, res) => {
  let connection;
  
  try {
    const vehicleId = parseInt(req.params.vehicleId);
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'No se subieron archivos' 
      });
    }

    // Validar que el vehículo existe
    connection = await getDbConnection();
    const [vehicleRows] = await connection.execute(
      'SELECT id FROM vehicles WHERE id = ?',
      [vehicleId]
    );

    if (vehicleRows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Vehículo no encontrado'
      });
    }

    // Procesar archivos subidos
    const processedFiles = await processUploadedFiles(files, vehicleId);

    // Verificar si ya existe una imagen principal
    const [existingPrimary] = await connection.execute(
      'SELECT id FROM vehicle_media WHERE vehicle_id = ? AND is_primary = TRUE',
      [vehicleId]
    );

    // Insertar archivos en base de datos
    const insertedFiles = [];
    
    for (let i = 0; i < processedFiles.length; i++) {
      const fileData = processedFiles[i];
      
      // Si es el primer archivo y no hay imagen principal, marcarlo como principal
      const isPrimary = (i === 0 && existingPrimary.length === 0) || fileData.isPrimary;
      
      // Si este archivo será principal, quitar primary de otros
      if (isPrimary) {
        await connection.execute(
          'UPDATE vehicle_media SET is_primary = FALSE WHERE vehicle_id = ?',
          [vehicleId]
        );
      }

      const [result] = await connection.execute(`
        INSERT INTO vehicle_media (
          vehicle_id, file_name, file_path, file_type, file_extension,
          file_size, is_primary, width, height, duration, display_order
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        vehicleId,
        fileData.filename,
        fileData.path,
        fileData.type,
        path.extname(fileData.filename),
        fileData.size,
        isPrimary,
        fileData.metadata?.width || null,
        fileData.metadata?.height || null,
        fileData.metadata?.duration || null,
        i
      ]);

      insertedFiles.push({
        id: result.insertId,
        fileName: fileData.filename,
        fileType: fileData.type,
        isPrimary: isPrimary,
        url: getFileUrl(fileData.path, req),
        thumbnailUrl: fileData.thumbnailPath ? getFileUrl(fileData.thumbnailPath, req) : null,
        metadata: fileData.metadata
      });
    }

    res.json({
      success: true,
      message: `${insertedFiles.length} archivo(s) subido(s) exitosamente`,
      files: insertedFiles
    });

  } catch (error) {
    console.error('Error subiendo archivos:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor: ' + error.message
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

// Obtener medios de un vehículo
router.get('/vehicles/:vehicleId/media', async (req, res) => {
  let connection;
  
  try {
    const vehicleId = parseInt(req.params.vehicleId);
    
    connection = await getDbConnection();
    const [mediaRows] = await connection.execute(`
      SELECT 
        id, file_name, file_path, file_type, file_extension,
        file_size, is_primary, width, height, duration,
        display_order, uploaded_at
      FROM vehicle_media 
      WHERE vehicle_id = ? 
      ORDER BY is_primary DESC, display_order ASC, uploaded_at ASC
    `, [vehicleId]);

    const mediaFiles = mediaRows.map(media => ({
      id: media.id,
      fileName: media.file_name,
      fileType: media.file_type,
      fileExtension: media.file_extension,
      fileSize: media.file_size,
      isPrimary: media.is_primary,
      width: media.width,
      height: media.height,
      duration: media.duration,
      displayOrder: media.display_order,
      uploadedAt: media.uploaded_at,
      url: getFileUrl(media.file_path, req),
      // Generar thumbnail URL basado en la ruta del archivo
      thumbnailUrl: media.file_type === 'image' 
        ? getFileUrl(media.file_path.replace(/(\.[^.]+)$/, '_thumb$1'), req)
        : getFileUrl(media.file_path.replace(/(\.[^.]+)$/, '_thumb.jpg'), req)
    }));

    res.json({
      success: true,
      vehicleId: vehicleId,
      totalFiles: mediaFiles.length,
      files: mediaFiles
    });

  } catch (error) {
    console.error('Error obteniendo medios:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

// Establecer imagen principal
router.patch('/vehicles/:vehicleId/media/:mediaId/primary', async (req, res) => {
  let connection;
  
  try {
    const vehicleId = parseInt(req.params.vehicleId);
    const mediaId = parseInt(req.params.mediaId);
    
    connection = await getDbConnection();
    
    // Verificar que el medio pertenece al vehículo
    const [mediaRows] = await connection.execute(
      'SELECT id FROM vehicle_media WHERE id = ? AND vehicle_id = ?',
      [mediaId, vehicleId]
    );

    if (mediaRows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Archivo no encontrado'
      });
    }

    // Quitar primary de todos los archivos del vehículo
    await connection.execute(
      'UPDATE vehicle_media SET is_primary = FALSE WHERE vehicle_id = ?',
      [vehicleId]
    );

    // Establecer el archivo como primary
    await connection.execute(
      'UPDATE vehicle_media SET is_primary = TRUE WHERE id = ?',
      [mediaId]
    );

    res.json({
      success: true,
      message: 'Imagen principal actualizada'
    });

  } catch (error) {
    console.error('Error estableciendo imagen principal:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

// Eliminar archivo de medio
router.delete('/vehicles/:vehicleId/media/:mediaId', async (req, res) => {
  let connection;
  
  try {
    const vehicleId = parseInt(req.params.vehicleId);
    const mediaId = parseInt(req.params.mediaId);
    
    connection = await getDbConnection();
    
    // Obtener información del archivo antes de eliminarlo
    const [mediaRows] = await connection.execute(
      'SELECT file_path, is_primary FROM vehicle_media WHERE id = ? AND vehicle_id = ?',
      [mediaId, vehicleId]
    );

    if (mediaRows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Archivo no encontrado'
      });
    }

    const media = mediaRows[0];
    
    // Eliminar archivo físico
    deleteFile(media.file_path);
    
    // Eliminar archivos relacionados (thumbnail, processed)
    const dir = path.dirname(media.file_path);
    const filename = path.basename(media.file_path, path.extname(media.file_path));
    const ext = path.extname(media.file_path);
    
    deleteFile(path.join(dir, `${filename}_thumb${ext}`));
    deleteFile(path.join(dir, `${filename}_thumb.jpg`));
    deleteFile(path.join(dir, `${filename}_processed${ext}`));

    // Eliminar registro de base de datos
    await connection.execute(
      'DELETE FROM vehicle_media WHERE id = ?',
      [mediaId]
    );

    // Si era imagen principal, establecer otra como principal
    if (media.is_primary) {
      const [remainingMedia] = await connection.execute(
        'SELECT id FROM vehicle_media WHERE vehicle_id = ? ORDER BY uploaded_at ASC LIMIT 1',
        [vehicleId]
      );

      if (remainingMedia.length > 0) {
        await connection.execute(
          'UPDATE vehicle_media SET is_primary = TRUE WHERE id = ?',
          [remainingMedia[0].id]
        );
      }
    }

    res.json({
      success: true,
      message: 'Archivo eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando archivo:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

// Actualizar orden de archivos
router.patch('/vehicles/:vehicleId/media/reorder', async (req, res) => {
  let connection;
  
  try {
    const vehicleId = parseInt(req.params.vehicleId);
    const { mediaOrder } = req.body; // Array de IDs en el nuevo orden
    
    if (!Array.isArray(mediaOrder)) {
      return res.status(400).json({
        success: false,
        error: 'mediaOrder debe ser un array'
      });
    }

    connection = await getDbConnection();
    
    // Actualizar el display_order de cada archivo
    for (let i = 0; i < mediaOrder.length; i++) {
      await connection.execute(
        'UPDATE vehicle_media SET display_order = ? WHERE id = ? AND vehicle_id = ?',
        [i, mediaOrder[i], vehicleId]
      );
    }

    res.json({
      success: true,
      message: 'Orden de archivos actualizado'
    });

  } catch (error) {
    console.error('Error reordenando archivos:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

module.exports = router;

// ========================================
// EJEMPLO DE INTEGRACIÓN EN APP PRINCIPAL
// ========================================

/*
// En tu app.js o server.js principal:

const express = require('express');
const path = require('path');
const vehicleMediaRoutes = require('./routes/vehicleMedia');

const app = express();

// Middleware para servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas de API
app.use('/api', vehicleMediaRoutes);

// Ejemplo de uso desde el frontend:

// Subir archivos:
const formData = new FormData();
mediaFiles.forEach(media => {
  if (media.file) {
    formData.append('vehicleMedia', media.file);
  }
});

fetch(`/api/vehicles/${vehicleId}/media`, {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => {
  if (data.success) {
    console.log('Archivos subidos:', data.files);
  }
});

// Obtener archivos:
fetch(`/api/vehicles/${vehicleId}/media`)
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log('Archivos del vehículo:', data.files);
    }
  });

*/
