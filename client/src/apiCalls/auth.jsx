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

// Check if email exists API call
export const checkEmailExists = async (email) => {

    try {

        const response = await axiosInstance.post(
            url + '/api/otp/check-email',
            { email }
        );

        return response.data;

    } catch (error) {

        return error.response.data;

    }

};

// Send OTP API call
export const sendOTP = async (email) => {
    try {

        const response = await axiosInstance.post(
            url + '/api/otp/send-otp',
            { email }
        );

        return response.data;

    } catch (error) {
        return error;
    }
};
// Verify OTP API call
export const verifyOTP = async (data) => {
    try {

        const response = await axiosInstance.post(
            url + '/api/otp/verify-otp',
            data
        );

        return response.data;

    } catch (error) {
        return error;
    }
};