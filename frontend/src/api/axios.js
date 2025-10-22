import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    // baseURL: 'http://localhost:5000/api',
    withCredentials: true,
    timeout: 50000,
    headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('token')

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
    }

    return config
})

api.interceptors.response.use(response => {
    return response
}, error => {
    console.log('HTTP Error:', error.response)

    if (error.response) {
        if (error.response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
    }
    return Promise.reject(error.response.data)
})

export default api;
