import axios from "axios";

export const url = "https://quick-chat-app-qviu.onrender.com";
console.log("API URL:", url);
export const axiosInstance = axios.create({
    baseURL: url,
    headers:{
        authorization: `Bearer ${localStorage.getItem('token')}`
    }
});

