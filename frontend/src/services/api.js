import axios from 'axios'

/**
 * Pre-configured Axios instance for all backend API calls.
 *
 * - baseURL from VITE_API_URL environment variable
 * - withCredentials: true — sends the HttpOnly session cookie with every request
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

export default api
