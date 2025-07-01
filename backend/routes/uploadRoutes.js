// backend/routes/uploadRoutes.js
import express from 'express';
import multer from 'multer';
import { uploadToS3 } from '../utils/s3.js';
import { authMiddleware, isAdmin } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  '/upload',
  authMiddleware,
  isAdmin,
  upload.single('file'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
      }

      const { originalname, mimetype, buffer } = req.file;
      const s3result = await uploadToS3(buffer, originalname, mimetype);

      res.status(200).json({
        url: s3result.Location,
        filename: originalname,
        type: mimetype.startsWith('image/') ? 'image' : 'pdf',
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
