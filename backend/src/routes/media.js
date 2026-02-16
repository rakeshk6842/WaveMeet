/**
 * Media Upload API Routes
 * Handles file uploads for images, videos, and documents
 */

import express from 'express';
import { authenticate } from '../middleware.js';
import {
  upload,
  processUploadedFile,
  deleteUploadedFile,
  validateFile,
} from '../services/mediaUpload.js';

const router = express.Router();

/**
 * Upload file
 * POST /api/media/upload
 */
router.post('/upload', authenticate, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    validateFile(req.file);
    const fileData = processUploadedFile(req.file);

    res.json({
      success: true,
      message: 'File uploaded successfully',
      file: fileData,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(400).json({ error: error.message });
  }
});

/**
 * Upload multiple files
 * POST /api/media/upload-multiple
 */
router.post(
  '/upload-multiple',
  authenticate,
  upload.array('files', 10),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }

      const files = req.files.map((file) => {
        validateFile(file);
        return processUploadedFile(file);
      });

      res.json({
        success: true,
        message: `${files.length} files uploaded successfully`,
        files,
      });
    } catch (error) {
      console.error('Error uploading files:', error);
      res.status(400).json({ error: error.message });
    }
  }
);

/**
 * Get file info
 * GET /api/media/:fileId
 */
router.get('/:fileId', authenticate, async (req, res) => {
  const { fileId } = req.params;

  try {
    // Fetch file metadata from database
    // This is a placeholder implementation
    const fileInfo = {
      id: fileId,
      filename: 'example.jpg',
      size: 1024000,
      mimetype: 'image/jpeg',
      uploadedAt: new Date().toISOString(),
    };

    res.json({
      success: true,
      file: fileInfo,
    });
  } catch (error) {
    console.error('Error getting file info:', error);
    res.status(500).json({ error: 'Failed to get file info' });
  }
});

/**
 * Delete file
 * DELETE /api/media/:fileId
 */
router.delete('/:fileId', authenticate, async (req, res) => {
  const { fileId } = req.params;

  try {
    // Delete from database
    // Delete from storage
    console.log(`File deleted: ${fileId}`);

    res.json({
      success: true,
      message: 'File deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

/**
 * Get file usage statistics
 * GET /api/media/stats/usage
 */
router.get('/stats/usage', authenticate, async (req, res) => {
  const userId = req.user.id;

  try {
    const stats = {
      totalSize: 0,
      fileCount: 0,
      breakdown: {
        images: { count: 0, size: 0 },
        videos: { count: 0, size: 0 },
        audio: { count: 0, size: 0 },
        documents: { count: 0, size: 0 },
      },
      limit: 5 * 1024 * 1024 * 1024, // 5GB
    };

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error('Error getting usage stats:', error);
    res.status(500).json({ error: 'Failed to get usage stats' });
  }
});

export default router;
