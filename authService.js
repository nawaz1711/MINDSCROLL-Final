import axios from 'axios';

// The base URL for our backend API
const API_URL = 'http://localhost:5000/api/users/';

/**
 * Registers a new user.
 * @param {object} userData - The user's registration data (username, email, password).
 * @returns {Promise<object>} The response from the server.
 */
const register = (userData) => {
  return axios.post(API_URL + 'register', userData);
};

/**
 * Logs in a user and stores the user data in localStorage.
 * @param {object} userData - The user's login data (email, password).
 * @returns {Promise<object>} The user data from the server.
 */
const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData);

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

/**
 * Logs out the user by removing the user data from localStorage.
 */
const logout = () => {
  localStorage.removeItem('user');
};

export default { register, login, logout };