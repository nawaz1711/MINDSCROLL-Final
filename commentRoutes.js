import express from 'express';
import {
  createComment,
  getCommentsByPost,
  deleteComment,
} from './commentController.js';
import { protect } from './authMiddleware.js';

const router = express.Router({ mergeParams: true });

router.route('/').get(getCommentsByPost).post(protect, createComment);

router.route('/:id').delete(protect, deleteComment);

export default router;
