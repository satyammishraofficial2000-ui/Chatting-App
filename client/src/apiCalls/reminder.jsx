import { axiosInstance } from "./index";

export const createReminder = async (payload) => {
  try {

    const response = await axiosInstance.post(
      "/api/reminder/create",
      payload
    );

    return response.data;

  } catch (error) {

    return {
      success: false,
      message: error.message
    };

  }
};