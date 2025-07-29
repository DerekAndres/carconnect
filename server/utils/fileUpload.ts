import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

// Allowed file types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Upload directories
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const VEHICLES_DIR = path.join(UPLOAD_DIR, 'vehicles');
const THUMBNAILS_DIR = path.join(UPLOAD_DIR, 'thumbnails');

// Ensure upload directories exist
export const ensureUploadDirectories = (): void => {
  const dirs = [UPLOAD_DIR, VEHICLES_DIR, THUMBNAILS_DIR];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
};

// Clean filename
export const cleanFilename = (filename: string): string => {
  // Remove special characters and spaces, keep only alphanumeric and dots
  const cleaned = filename
    .toLowerCase()
    .replace(/[^a-z0-9.]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
  
  // Add UUID to prevent conflicts
  const ext = path.extname(cleaned);
  const name = path.basename(cleaned, ext);
  return `${name}_${uuidv4().substring(0, 8)}${ext}`;
};

// Generate file URL
export const generateFileUrl = (filename: string): string => {
  return `/uploads/vehicles/${filename}`;
};

// Generate thumbnail URL
export const generateThumbnailUrl = (filename: string): string => {
  const ext = path.extname(filename);
  const name = path.basename(filename, ext);
  return `/uploads/thumbnails/${name}_thumb${ext}`;
};

// Validate file type
export const validateFileType = (file: Express.Multer.File): boolean => {
  return ALLOWED_IMAGE_TYPES.includes(file.mimetype);
};

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureUploadDirectories();
    cb(null, VEHICLES_DIR);
  },
  filename: (req, file, cb) => {
    const cleanName = cleanFilename(file.originalname);
    cb(null, cleanName);
  }
});

// Multer file filter
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (validateFileType(file)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`));
  }
};

// Multer configuration
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 10 // Maximum 10 files per upload
  }
});

// Resize and optimize image
export const processImage = async (
  inputPath: string,
  outputPath: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'jpeg' | 'png' | 'webp';
  } = {}
): Promise<void> => {
  const {
    width = 1200,
    height = 800,
    quality = 80,
    format = 'jpeg'
  } = options;

  try {
    await sharp(inputPath)
      .resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .toFormat(format, { quality })
      .toFile(outputPath);
  } catch (error) {
    console.error('Error processing image:', error);
    throw new Error('Image processing failed');
  }
};

// Create thumbnail
export const createThumbnail = async (
  inputPath: string,
  filename: string
): Promise<string> => {
  const ext = path.extname(filename);
  const name = path.basename(filename, ext);
  const thumbnailName = `${name}_thumb.jpg`;
  const thumbnailPath = path.join(THUMBNAILS_DIR, thumbnailName);

  try {
    await sharp(inputPath)
      .resize(300, 200, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 70 })
      .toFile(thumbnailPath);
    
    return thumbnailName;
  } catch (error) {
    console.error('Error creating thumbnail:', error);
    throw new Error('Thumbnail creation failed');
  }
};

// Delete file and thumbnail
export const deleteFiles = async (filename: string): Promise<void> => {
  const filePath = path.join(VEHICLES_DIR, filename);
  const ext = path.extname(filename);
  const name = path.basename(filename, ext);
  const thumbnailPath = path.join(THUMBNAILS_DIR, `${name}_thumb.jpg`);

  try {
    // Delete main file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    // Delete thumbnail
    if (fs.existsSync(thumbnailPath)) {
      fs.unlinkSync(thumbnailPath);
    }
  } catch (error) {
    console.error('Error deleting files:', error);
    throw new Error('File deletion failed');
  }
};

// Get file info
export const getFileInfo = (filename: string): {
  exists: boolean;
  size?: number;
  path?: string;
} => {
  const filePath = path.join(VEHICLES_DIR, filename);
  
  try {
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      return {
        exists: true,
        size: stats.size,
        path: filePath
      };
    }
  } catch (error) {
    console.error('Error getting file info:', error);
  }
  
  return { exists: false };
};

// Process uploaded file
export const processUploadedFile = async (file: Express.Multer.File): Promise<{
  filename: string;
  originalName: string;
  url: string;
  thumbnailUrl: string;
  size: number;
}> => {
  const { filename, originalname, size, path: filePath } = file;

  try {
    // Create thumbnail
    const thumbnailName = await createThumbnail(filePath, filename);
    
    // Optimize main image (optional)
    const optimizedPath = path.join(VEHICLES_DIR, `opt_${filename}`);
    await processImage(filePath, optimizedPath);
    
    // Replace original with optimized version
    fs.unlinkSync(filePath);
    fs.renameSync(optimizedPath, filePath);

    return {
      filename,
      originalName: originalname,
      url: generateFileUrl(filename),
      thumbnailUrl: generateThumbnailUrl(filename),
      size
    };
  } catch (error) {
    // Clean up on error
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (cleanupError) {
      console.error('Error during cleanup:', cleanupError);
    }
    
    throw error;
  }
};

export { VEHICLES_DIR, THUMBNAILS_DIR, UPLOAD_DIR, ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE };
