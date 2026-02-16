/**
 * Media Upload Service
 * Handles file uploads to cloud storage (AWS S3 or local storage)
 */

import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '52428800'); // 50MB default
const ALLOWED_MIMES = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  video: ['video/mp4', 'video/quicktime', 'video/x-msvideo'],
  audio: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm'],
  document: ['application/pdf', 'application/msword'],
};

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

/**
 * Configure multer for file uploads
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const fileType = getFileType(file.mimetype);
    const typeDir = path.join(UPLOAD_DIR, fileType);

    // Create directory if it doesn't exist
    if (!fs.existsSync(typeDir)) {
      fs.mkdirSync(typeDir, { recursive: true });
    }

    cb(null, typeDir);
  },
  filename: (req, file, cb) => {
    const uniqueId = uuidv4();
    const ext = path.extname(file.originalname);
    const filename = `${uniqueId}${ext}`;
    cb(null, filename);
  },
});

/**
 * File filter for multer
 */
const fileFilter = (req, file, cb) => {
  const fileType = getFileType(file.mimetype);

  if (!fileType) {
    return cb(new Error('Invalid file type'));
  }

  const allowedMimes = ALLOWED_MIMES[fileType] || [];
  if (!allowedMimes.includes(file.mimetype)) {
    return cb(new Error(`Invalid ${fileType} format`));
  }

  cb(null, true);
};

/**
 * Create multer upload middleware
 */
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

/**
 * Determine file type from MIME type
 */
function getFileType(mimetype) {
  if (mimetype.startsWith('image/')) return 'images';
  if (mimetype.startsWith('video/')) return 'videos';
  if (mimetype.startsWith('audio/')) return 'audio';
  if (mimetype.includes('pdf') || mimetype.includes('document'))
    return 'documents';
  return null;
}

/**
 * Process uploaded file
 */
export const processUploadedFile = (file) => {
  if (!file) {
    throw new Error('No file uploaded');
  }

  const fileType = getFileType(file.mimetype);
  const fileUrl = `/uploads/${fileType}/${file.filename}`;

  return {
    id: uuidv4(),
    filename: file.originalname,
    storagePath: file.path,
    fileUrl,
    mimetype: file.mimetype,
    size: file.size,
    uploadedAt: new Date().toISOString(),
    type: fileType,
  };
};

/**
 * Delete uploaded file
 */
export const deleteUploadedFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

/**
 * Get file metadata
 */
export const getFileMetadata = (filePath) => {
  try {
    const stats = fs.statSync(filePath);
    return {
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
    };
  } catch (error) {
    console.error('Error getting file metadata:', error);
    throw error;
  }
};

/**
 * Validate file before processing
 */
export const validateFile = (file) => {
  if (!file) {
    throw new Error('No file provided');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `File size exceeds maximum limit of ${MAX_FILE_SIZE / 1024 / 1024}MB`
    );
  }

  const fileType = getFileType(file.mimetype);
  if (!fileType) {
    throw new Error('Unsupported file type');
  }

  return true;
};

export default {
  upload,
  processUploadedFile,
  deleteUploadedFile,
  getFileMetadata,
  validateFile,
};
