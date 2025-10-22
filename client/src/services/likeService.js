import axios from 'axios';

const API_URL = 'http://localhost:5000/api/posts/';

// Get likes for a post
const getLikesByPost = (postId) => {
  return axios.get(`${API_URL}${postId}/likes`);
};

// Like a post (protected)
const likePost = (postId) => {
  const token = JSON.parse(localStorage.getItem('user'))?.token;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axios.post(`${API_URL}${postId}/likes`, {}, config);
};

// Unlike a post (protected)
const unlikePost = (postId) => {
  const token = JSON.parse(localStorage.getItem('user'))?.token;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axios.delete(`${API_URL}${postId}/likes`, config);
};

export default { getLikesByPost, likePost, unlikePost };
