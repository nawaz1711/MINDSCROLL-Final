import Like from './Like.js';

/**
 * @desc    Like a post
 * @route   POST /api/posts/:postId/like
 * @access  Private
 */
const likePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user._id;

  const existingLike = await Like.findOne({ user: userId, post: postId });

  if (existingLike) {
    return res.status(400).json({ message: 'Post already liked' });
  }

  const like = new Like({
    user: userId,
    post: postId,
  });

  const createdLike = await like.save();
  res.status(201).json(createdLike);
};

/**
 * @desc    Unlike a post
 * @route   DELETE /api/posts/:postId/like
 * @access  Private
 */
const unlikePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user._id;

  const like = await Like.findOneAndDelete({ user: userId, post: postId });

  if (like) {
    res.json({ message: 'Like removed' });
  } else {
    res.status(404).json({ message: 'Like not found' });
  }
};

/**
 * @desc    Get likes for a post
 * @route   GET /api/posts/:postId/likes
 * @access  Public
 */
const getLikesByPost = async (req, res) => {
  const { postId } = req.params;
  const likes = await Like.find({ post: postId }).populate('user', 'username');
  res.json(likes);
};

export { likePost, unlikePost, getLikesByPost };
