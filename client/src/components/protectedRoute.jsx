import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLoggedUser,getAllUsers, } from './../apiCalls/users';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoader, showLoader } from '../redux/loaderSlice';
import { setUser,setAllUsers, setAllChats} from '../redux/usersSlice';
import { getAllChats } from "../apiCalls/chat";
import toast from 'react-hot-toast';

function ProtectedRoute({ children }) {
  
  const { user } = useSelector(state => state.usersReducer);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const getloggedInUser = async () => {
     let response = null;
    try {
      dispatch(showLoader());
       response = await getLoggedUser();
       dispatch(hideLoader());
      if (response.success) {
        //setUser(response.data);
        dispatch(setUser(response.data));
       
      } else {
  
        toast.error(response.message);
        window.location.href = '/login';
      }

    } catch (error) {
       dispatch(hideLoader());
      navigate('/login');
    }
  };

    const getAllUsersFromDb = async () => {
     let response = null;
    try {
      dispatch(showLoader());
       response = await getAllUsers();
       dispatch(hideLoader());

      if (response.success) {
        //setUser(response.data);
        dispatch(setAllUsers(response.data));
       
      } else {
  
        toast.error(response.message);
        window.location.href = '/login';
      }

    } catch (error) {
       dispatch(hideLoader());
      navigate('/login');
    }
  };


  const getCurrentUserChats = async () => {
    try{
      const response = await getAllChats();
      if(response.success){
        dispatch(setAllChats(response.data)); 
      }
    }catch(error){
      console.log(error);
      navigate('/login');
    }
  }



  useEffect(() => {
    if(localStorage.getItem('token')) {
      getloggedInUser();
      getAllUsersFromDb();
      getCurrentUserChats();
    } else {
      navigate('/login');
    }
  }, []);
 

  return ( 
    <div>
        { children }
    </div>
    
 );
}

export default ProtectedRoute;