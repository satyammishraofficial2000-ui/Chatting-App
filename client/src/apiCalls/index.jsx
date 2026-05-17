import axios from "axios";

export const url = "https://chatting-app-uc1r.onrender.com";

export const axiosInstance = axios.create({
    baseURL: url,
    headers:{
        authorization: `Bearer ${localStorage.getItem('token')}`
    }
}); 