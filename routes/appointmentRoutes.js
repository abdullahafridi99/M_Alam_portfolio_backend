import express from 'express';
import {
  bookAppointment,
  getAppointments,
  updateAppointmentStatus,
  deleteAppointment,
} from '../controllers/appointmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .post(bookAppointment)
  .get(protect, getAppointments);

router
  .route('/:id')
  .put(protect, updateAppointmentStatus)
  .delete(protect, deleteAppointment);

export default router;
