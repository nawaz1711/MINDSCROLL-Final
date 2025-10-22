import Post from './Post.js';

/**
 * @desc    Create a new post
 * @route   POST /api/posts
 * @access  Private
 */
const createPost = async (req, res) => {
  const { title, content, status, tags } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  const post = new Post({
    title,
    content,
    status,
    tags,
    author: req.user._id, // From the 'protect' middleware
  });

  const createdPost = await post.save();
  res.status(201).json(createdPost);
};

/**
 * @desc    Get all published posts
 * @route   GET /api/posts
 * @access  Public
 */
const getPosts = async (req, res) => {
  const posts = await Post.find({ status: 'Published' }).populate('author', 'username');
  res.json(posts);
};

/**
 * @desc    Get a single post by ID
 * @route   GET /api/posts/:id
 * @access  Public
 */
const getPostById = async (req, res) => {
  const post = await Post.findById(req.params.id).populate('author', 'username');

  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ message: 'Post not found' });
  }
};

/**
 * @desc    Update a post
 * @route   PUT /api/posts/:id
 * @access  Private
 */
const updatePost = async (req, res) => {
  const { title, content, status, tags } = req.body;

  const post = await Post.findById(req.params.id);

  if (post) {
    // Check if the logged-in user is the author of the post
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.status = status || post.status;
    post.tags = tags || post.tags;

    const updatedPost = await post.save();
    res.json(updatedPost);
  } else {
    res.status(404).json({ message: 'Post not found' });
  }
};

/**
 * @desc    Delete a post
 * @route   DELETE /api/posts/:id
 * @access  Private
 */
const deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (post) {
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await post.deleteOne();
    res.json({ message: 'Post removed' });
  } else {
    res.status(404).json({ message: 'Post not found' });
  }
};

export { createPost, getPosts, getPostById, updatePost, deletePost };