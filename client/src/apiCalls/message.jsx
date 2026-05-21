
import { axiosInstance , url} from "./axiosInstance";

export const createNewMessage = async (message) => {
  try {
    const response = await axiosInstance.post(url +
      "/api/message/new-message",
      message
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getAllMessages = async (chatId) => {
  try {
    const response = await axiosInstance.get(url +
      `/api/message/get-all-messages/${chatId}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

// New API call for translating message
export const translateMessage = async (text, targetLanguage) => {
  try {

    const response = await axiosInstance.post(url +
      "/api/message/translate-message",
      {
        text,
        targetLanguage
      }
    );

    return response.data;

  } catch (error) {
    return error;
  }
};

// New API call for deleting message
export const deleteMessage = async (payload) => {

    try {

        const response = await axiosInstance.post(
            url + "/api/message/delete-message",
            payload
        );

        return response.data;

    } catch (error) {

        return error.response.data;
    }
};