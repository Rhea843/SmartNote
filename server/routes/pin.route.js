import express from 'express';
import { togglePin } from '../controllers/pin.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.patch('/:id/pin', authenticateToken, togglePin);

export default router;