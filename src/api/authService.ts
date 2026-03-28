import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
// Why do we need content-type: application/json? what is this for? how does axios.create work? 

// Interceptor: Automatically attach token to every request
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); //
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; //
    }
    return config;
});

export const authService = {
    // Login method
    async login(email: string, password:string) {
        const response = await apiClient.post(`${API_URL}/api/Auth/login`, { email, password });
        if (response.data.token){ //how are we able to access data.token?
            localStorage.setItem('token', response.data.token); // what does setItem do? is localStorage enough for a scalable website? can it support many users?
        }

        console.log("Token received.")
        return response.data;
    },

    // Register method matching the dotnet model
    async register(userData: {
        fullName: string;
        email: string;
        password: string;
        address: string;
        birthDate: string;
    }) {
        const response = await apiClient.post('/api/Auth/register', userData);
        return response.data;
    },

    // for log out
    logout() {
        localStorage.removeItem('token');
        console.log("token removed, logged out.")
    },

    getToken(){
        return localStorage.getItem('token');
    }
};
