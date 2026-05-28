import express from 'express';
import { toggleArchive } from '../controllers/archive.controller.js'
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.patch('/:id/archive', authenticateToken, toggleArchive);

export default router;