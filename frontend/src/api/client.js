import axios from 'axios';

let logoutHandler = null;

export const setLogoutHandler = (handler) => {
  logoutHandler = handler;
};

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  withCredentials: true,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error('Network error – please check your connection');
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    switch (status) {
      case 401: {
        if (logoutHandler) {
          logoutHandler();
        } else {
          window.location.href = '/login';
        }
        break;
      }
      case 403:
        console.error('Access denied – insufficient permissions');
        break;
      case 429:
        console.error('Too many requests – please slow down');
        break;
      case 500:
        console.error('Internal server error – please try again later');
        break;
      default:
        console.error(`API error (${status}):`, data);
        break;
    }

    error.message = data?.message || error.message;
    return Promise.reject(error);
  }
);

export default client;