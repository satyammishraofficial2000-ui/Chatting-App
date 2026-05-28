import { axiosInstance, url } from "./index";


// CREATE
export const createYouItem = async(payload)=>{

    try{

        const response = await axiosInstance.post(

            url + "/api/you/create-you-item",
            payload

        );

        return response.data;

    }catch(error){

        return error.response.data;

    }

};


// GET
export const getYouItems = async()=>{

    try{

        const response = await axiosInstance.get(

            url + "/api/you/get-you-items"

        );

        return response.data;

    }catch(error){

        return error.response.data;

    }

};


// TOGGLE
export const toggleYouTask = async(itemId)=>{

    try{

        const response = await axiosInstance.post(

            url + "/api/you/toggle-you-task",
            { itemId }

        );

        return response.data;

    }catch(error){

        return error.response.data;

    }

};

export const deleteYouItem = async(itemId) => {

    try{

        const response = await axiosInstance.post(
            "/api/you/delete-you-item",
            { itemId }
        );

        return response.data;

    }catch(error){

        return error.response.data;

    }

};