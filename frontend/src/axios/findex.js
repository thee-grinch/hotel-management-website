import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api', // Replace with your API base URL
  timeout: 5000, // Optional: Set a timeout for requests
})

// Add a request interceptor (optional)
instance.interceptors.request.use(
  (config) => {
    // You can add custom headers or modify the request here
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add a response interceptor (optional)
instance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default instance