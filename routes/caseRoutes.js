import express from 'express';
import {
  getCases,
  createCase,
  updateCase,
  deleteCase,
} from '../controllers/caseController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(getCases)
  .post(protect, upload.single('image'), createCase);

router
  .route('/:id')
  .put(protect, upload.single('image'), updateCase)
  .delete(protect, deleteCase);

export default router;
