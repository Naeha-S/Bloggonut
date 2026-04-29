import express from 'express';
import { getCommentsForPost, createComment, deleteComment } from '../controllers/commentController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:postId', getCommentsForPost);
router.post('/:postId', authMiddleware, createComment);
router.delete('/:id', authMiddleware, deleteComment);

export default router;
