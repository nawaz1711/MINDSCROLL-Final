import axios from 'axios';

const API_URL = 'http://localhost:5000/api/posts/';

// Get all published posts
const getPosts = () => {
  return axios.get(API_URL);
};

// Get a single post by ID
const getPostById = (id) => {
  return axios.get(API_URL + id);
};

// Create a new post (protected)
const createPost = (postData) => {
  const token = JSON.parse(localStorage.getItem('user'))?.token;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axios.post(API_URL, postData, config);
};

// Update a post (protected)
const updatePost = (id, postData) => {
  const token = JSON.parse(localStorage.getItem('user'))?.token;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axios.put(API_URL + id, postData, config);
};

// Delete a post (protected)
const deletePost = (id) => {
  const token = JSON.parse(localStorage.getItem('user'))?.token;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axios.delete(API_URL + id, config);
};

export default { getPosts, getPostById, createPost, updatePost, deletePost };
