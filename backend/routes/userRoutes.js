import express from 'express';
import { getUserProfile, createOrUpdateProfile, getAuthorProfile } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile/:userId', getUserProfile);
router.put('/profile', authMiddleware, createOrUpdateProfile);
router.get('/author/:authorName', getAuthorProfile);

export default router;
