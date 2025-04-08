import express from 'express';
import { bookAppointment, cancelAppointment, getMyAppointments } from '../controllers/appointment.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, bookAppointment);
router.get('/', authMiddleware, getMyAppointments);
router.delete('/:id', authMiddleware, cancelAppointment);

export default router;