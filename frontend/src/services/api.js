import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost/devshowcase/backend/api', // Ajustar para URL local
});

export default api;