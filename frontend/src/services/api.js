import axios from 'axios'

/**
 * Pre-configured Axios instance for all backend API calls.
 *
 * - baseURL constructed from VITE_API_URL environment variable
 * - withCredentials: true — sends the HttpOnly session cookie with every request
 *
 * VITE_API_URL is set per environment:
 *   .env.development → http://localhost:3000/api
 *   .env.production  → https://backend-kappa-seven-14.vercel.app/api
 */
const rawUrl = import.meta.env.VITE_API_URL || ''
const baseURL = rawUrl.replace(/\/+$/, '') // strip trailing slashes

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

export default api
