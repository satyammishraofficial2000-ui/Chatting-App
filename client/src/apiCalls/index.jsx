import axios from "axios";

export const url = "http://localhost:3000";

export const axiosInstance = axios.create({
    baseURL: url,
    headers:{
        authorization: `Bearer ${localStorage.getItem('token')}`
    }
}); 