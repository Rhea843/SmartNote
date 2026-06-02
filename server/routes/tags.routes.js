import express from 'express';
import { createTag, getTags } from '../controllers/tags.controller.js';
import { addTagToNote, removeTagFromNote, getNotesByTag } from '../controllers/noteTags.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', authenticateToken, createTag);
router.get('/', authenticateToken, getTags);

export default router;