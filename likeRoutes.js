import express from 'express';
import {
  likePost,
  unlikePost,
  getLikesByPost,
} from './likeController.js';
import { protect } from './authMiddleware.js';

const router = express.Router({ mergeParams: true });

router.route('/').get(getLikesByPost).post(protect, likePost).delete(protect, unlikePost);

export default router;
