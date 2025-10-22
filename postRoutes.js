import express from 'express';
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} from './postController.js';
import { protect } from './authMiddleware.js';
import commentRoutes from './commentRoutes.js';
import likeRoutes from './likeRoutes.js';

const router = express.Router();

router.route('/').get(getPosts).post(protect, createPost);

router.route('/:id').get(getPostById).put(protect, updatePost).delete(protect, deletePost);

router.use('/:postId/comments', commentRoutes);
router.use('/:postId/likes', likeRoutes);

export default router;
