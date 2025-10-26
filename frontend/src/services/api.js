import axios from 'axios';

const base = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const instance = axios.create({
  baseURL: base,
  timeout: 5000
});

export default instance;
