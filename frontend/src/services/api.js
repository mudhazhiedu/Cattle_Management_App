import axios from 'axios';

// Use backend port 5000 in development, /api in production
const base = import.meta.env.DEV ? 'http://localhost:5000/api' : '/api';

const instance = axios.create({
  baseURL: base,
  timeout: 5000
});

export default instance;
