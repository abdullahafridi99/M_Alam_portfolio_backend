import express from 'express';
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../controllers/testimonialController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(getTestimonials)
  .post(protect, upload.single('image'), createTestimonial);

router
  .route('/:id')
  .put(protect, upload.single('image'), updateTestimonial)
  .delete(protect, deleteTestimonial);

export default router;
