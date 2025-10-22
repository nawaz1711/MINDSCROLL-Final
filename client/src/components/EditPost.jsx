import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import postService from '../services/postService';
import AuthContext from '../context/AuthContext';

const EditPost = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    status: 'Draft',
    tags: '',
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await postService.getPostById(id);
        const post = response.data;
        if (post.author._id !== user?._id) {
          navigate('/');
          return;
        }
        setFormData({
          title: post.title,
          content: post.content,
          status: post.status,
          tags: post.tags.join(', '),
        });
      } catch (error) {
        console.error('Error fetching post:', error);
        navigate('/');
      } finally {
        setFetchLoading(false);
      }
    };
    if (user) fetchPost();
  }, [id, user, navigate]);

  if (!user) {
    navigate('/login');
    return null;
  }

  if (fetchLoading) return <div>Loading...</div>;

  const { title, content, status, tags } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const postData = {
        title,
        content,
        status,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      };
      await postService.updatePost(id, postData);
      navigate(`/post/${id}`);
    } catch (error) {
      console.error('Error updating post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-post">
      <h1>Edit Post</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            value={title}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content (Markdown)</label>
          <textarea
            name="content"
            value={content}
            onChange={onChange}
            rows="10"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select name="status" value={status} onChange={onChange}>
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="tags">Tags (comma separated)</label>
          <input
            type="text"
            name="tags"
            value={tags}
            onChange={onChange}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Post'}
        </button>
      </form>
    </div>
  );
};

export default EditPost;
