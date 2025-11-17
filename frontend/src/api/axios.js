import axios from 'axios';

// Set base URL based on environment
const baseURL = import.meta.env.PROD 
  ? '' // Empty string to use relative URLs in production
  : 'http://localhost:3001';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;