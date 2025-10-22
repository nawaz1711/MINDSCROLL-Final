import Comment from './Comment.js';

/**
 * @desc    Create a new comment
 * @route   POST /api/posts/:postId/comments
 * @access  Private
 */
const createComment = async (req, res) => {
  const { content } = req.body;
  const { postId } = req.params;

  if (!content) {
    return res.status(400).json({ message: 'Content is required' });
  }

  const comment = new Comment({
    content,
    post: postId,
    author: req.user._id,
  });

  const createdComment = await comment.save();
  res.status(201).json(createdComment);
};

/**
 * @desc    Get all comments for a post
 * @route   GET /api/posts/:postId/comments
 * @access  Public
 */
const getCommentsByPost = async (req, res) => {
  const { postId } = req.params;
  const comments = await Comment.find({ post: postId }).populate('author', 'username');
  res.json(comments);
};

/**
 * @desc    Delete a comment
 * @route   DELETE /api/comments/:id
 * @access  Private
 */
const deleteComment = async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (comment) {
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment removed' });
  } else {
    res.status(404).json({ message: 'Comment not found' });
  }
};

export { createComment, getCommentsByPost, deleteComment };
