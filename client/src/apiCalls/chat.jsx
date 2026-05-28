import { axiosInstance,url } from "./index";

export const getAllChats = async (userId) => {
    try {
        const response = await axiosInstance.get(url + '/api/chat/get-all-chats');
        return response.data;
    }catch (error) {
        return error;
    }
}

export const createNewChat = async (data) => {

    try {

        const response = await axiosInstance.post(

            url + '/api/chat/create-new-chat',

            data

        );

        return response.data;

    } catch (error) {

        return error.response.data;

    }

}

export const clearUnreadMessages = async (chatId) => {
    try {
        const response = await axiosInstance.post('/api/chat/clear-unread-message', { chatId });
        return response.data;
    }catch (error) {
        return error;
    }
}

export const deleteChatForMe = async (chatId) => {

    try {

        const response = await axiosInstance.post(
            url + "/api/chat/delete-chat-for-me",
            { chatId }
        );

        return response.data;

    } catch (error) {

        return error.response.data;

    }

};