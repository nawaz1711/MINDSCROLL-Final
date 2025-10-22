import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import postService from '../services/postService';
import commentService from '../services/commentService';
import likeService from '../services/likeService';
import AuthContext from '../context/AuthContext';

const PostDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postRes, commentsRes, likesRes] = await Promise.all([
          postService.getPostById(id),
          commentService.getCommentsByPost(id),
          likeService.getLikesByPost(id),
        ]);
        setPost(postRes.data);
        setComments(commentsRes.data);
        setLikes(likesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleLike = async () => {
    if (!user) return;
    try {
      await likeService.likePost(id);
      // Refresh likes
      const likesRes = await likeService.getLikesByPost(id);
      setLikes(likesRes.data);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleUnlike = async () => {
    if (!user) return;
    try {
      await likeService.unlikePost(id);
      // Refresh likes
      const likesRes = await likeService.getLikesByPost(id);
      setLikes(likesRes.data);
    } catch (error) {
      console.error('Error unliking post:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;
    try {
      await commentService.createComment(id, { content: newComment });
      setNewComment('');
      // Refresh comments
      const commentsRes = await commentService.getCommentsByPost(id);
      setComments(commentsRes.data);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await commentService.deleteComment(commentId);
      // Refresh comments
      const commentsRes = await commentService.getCommentsByPost(id);
      setComments(commentsRes.data);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!post) return <div>Post not found</div>;

  const isLiked = likes.some((like) => like.user._id === user?._id);

  return (
    <div className="post-detail">
      <h1>{post.title}</h1>
      <p>By {post.author.username} on {new Date(post.publishedAt).toLocaleDateString()}</p>
      <div className="post-content">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
      <div className="likes-section">
        <p>Likes: {likes.length}</p>
        {user && (
          <button onClick={isLiked ? handleUnlike : handleLike}>
            {isLiked ? 'Unlike' : 'Like'}
          </button>
        )}
      </div>
      <div className="comments-section">
        <h2>Comments</h2>
        {comments.map((comment) => (
          <div key={comment._id} className="comment">
            <p><strong>{comment.author.username}:</strong> {comment.content}</p>
            {user && user._id === comment.author._id && (
              <button onClick={() => handleDeleteComment(comment._id)}>Delete</button>
            )}
          </div>
        ))}
        {user && (
          <form onSubmit={handleCommentSubmit}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              required
            />
            <button type="submit">Comment</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
