import axios from 'axios';

const base = '/api';

const instance = axios.create({
  baseURL: base,
  timeout: 5000
});

export default instance;
