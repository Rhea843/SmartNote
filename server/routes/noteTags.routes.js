import express from 'express';
import { addTagToNote, removeTagFromNote, getNotesByTag } from '../controllers/noteTags.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/:noteId/tags', authenticateToken, addTagToNote);
router.delete('/:noteId/tags/:tagId', authenticateToken, removeTagFromNote);
router.get('/tag/:tagId', authenticateToken, getNotesByTag);

export default router;