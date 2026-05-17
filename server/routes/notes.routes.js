import express from 'express';
import {
  createNote,
  getNotes,
  updateNote,
  deleteNote
}  from '../controllers/notes.controller.js';

import {authenticateToken} from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', authenticateToken, createNote);
router.get('/', authenticateToken, getNotes);
router.put('/:id', authenticateToken, updateNote);
router.delete('/:id', authenticateToken, deleteNote);

export default router;