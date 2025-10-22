import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import postService from '../services/postService';
import AuthContext from '../context/AuthContext';

const CreatePost = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    status: 'Draft',
    tags: '',
  });
  const [loading, setLoading] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

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
      await postService.createPost(postData);
      navigate('/');
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post">
      <h1>Create New Post</h1>
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
          {loading ? 'Creating...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
