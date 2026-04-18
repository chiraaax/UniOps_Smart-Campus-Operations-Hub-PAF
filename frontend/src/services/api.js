import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8086/api', // Your Spring Boot backend port
    withCredentials: true // CRITICAL: This sends the session cookie to Spring Boot
});

export default api;