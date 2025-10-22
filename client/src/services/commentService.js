import axios from 'axios';

const API_URL = 'http://localhost:5000/api/posts/';

// Get comments for a post
const getCommentsByPost = (postId) => {
  return axios.get(`${API_URL}${postId}/comments`);
};

// Create a comment (protected)
const createComment = (postId, commentData) => {
  const token = JSON.parse(localStorage.getItem('user'))?.token;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axios.post(`${API_URL}${postId}/comments`, commentData, config);
};

// Delete a comment (protected)
const deleteComment = (id) => {
  const token = JSON.parse(localStorage.getItem('user'))?.token;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axios.delete(`http://localhost:5000/api/comments/${id}`, config);
};

export default { getCommentsByPost, createComment, deleteComment };
