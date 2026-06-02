import express from 'express';
import { restoreNote, moveToTrash } from '../controllers/trashNote.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.patch('/:id/trash', authenticateToken, moveToTrash);
router.patch('/:id/restore', authenticateToken, restoreNote);
export default router;