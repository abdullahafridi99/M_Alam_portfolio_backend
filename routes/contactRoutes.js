import express from 'express';
import {
  submitContact,
  getContacts,
  markContactRead,
  deleteContact,
} from '../controllers/contactController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .post(submitContact)
  .get(protect, getContacts);

router.put('/:id/read', protect, markContactRead);
router.delete('/:id', protect, deleteContact);

export default router;
