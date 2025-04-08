import express from 'express';
import { addAvailability, getAvailability } from '../controllers/availability.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, addAvailability);
router.get('/:professorId', authMiddleware, getAvailability);

export default router;