import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import postService from '../services/postService';

const samplePosts = [
  {
    _id: 'sample1',
    title: 'Welcome to MindScroll',
    content: 'This is your personalized blogging and knowledge-sharing platform. Start sharing your thoughts, ideas, and insights with the community. Create your first post to get started!',
    author: { username: 'MindScroll Team' },
    publishedAt: new Date().toISOString(),
  },
  {
    _id: 'sample2',
    title: 'How to Create Engaging Posts',
    content: 'Writing great posts involves clear titles, engaging content, and proper formatting. Use markdown to add headings, lists, and links. Remember to publish your drafts when ready.',
    author: { username: 'MindScroll Team' },
    publishedAt: new Date().toISOString(),
  },
  {
    _id: 'sample3',
    title: 'Connect with Like-Minded People',
    content: 'MindScroll is about building a community. Comment on posts, like content you enjoy, and engage with other users. Your interactions help foster meaningful discussions.',
    author: { username: 'MindScroll Team' },
    publishedAt: new Date().toISOString(),
  },
];

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await postService.getPosts();
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const displayPosts = posts.length > 0 ? posts : samplePosts;

  if (loading) return <div>Loading...</div>;

  return (
    <div className="home">
      <h1>Welcome to MindScroll</h1>
      {posts.length === 0 && <p style={{ textAlign: 'center', marginBottom: '2rem' }}>No posts yet. Here are some examples to get you started!</p>}
      <div className="posts-list">
        {displayPosts.map((post) => (
          <div key={post._id} className="post-card">
            <h2>
              {post._id.startsWith('sample') ? post.title : <Link to={`/post/${post._id}`}>{post.title}</Link>}
            </h2>
            <p>By {post.author.username} on {new Date(post.publishedAt).toLocaleDateString()}</p>
            <p>{post.content.substring(0, 200)}...</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
