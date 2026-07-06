import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(getSettings)
  .put(
    protect,
    upload.fields([
      { name: 'heroImage', maxCount: 1 },
      { name: 'cvUrl', maxCount: 1 },
    ]),
    updateSettings
  );

export default router;
