import { axiosInstance, url } from "./index";

//signup user
export const signupUser = async (user) => {
    try {
        const response = await axiosInstance.post(url + '/api/auth/signup', user);
        return response.data;
    } catch (error) {
        return error;
        
    }
}

//login user
export const loginUser = async (user) => {
    try {
         const response = await axiosInstance.post(url + '/api/auth/login',user);
         return response.data;
    } catch (error) {
        return error;
    }
}

// Google Login API call
export const googleLogin = async (user) => {
    try {

        const response = await axiosInstance.post(
            '/api/auth/google-login',
            user
        );

        return response.data;

    } catch (error) {
        return error;
    }
};