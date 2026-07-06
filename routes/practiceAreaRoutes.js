import express from 'express';
import {
  getPracticeAreas,
  getPracticeAreaBySlug,
  createPracticeArea,
  updatePracticeArea,
  deletePracticeArea,
} from '../controllers/practiceAreaController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(getPracticeAreas)
  .post(protect, upload.single('image'), createPracticeArea);

router
  .route('/:id')
  .put(protect, upload.single('image'), updatePracticeArea)
  .delete(protect, deletePracticeArea);

router.get('/slug/:slug', getPracticeAreaBySlug);

export default router;
