import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLoggedUser } from './../apiCalls/users';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoader, showLoader } from '../redux/loaderSlice';
import { setUser } from '../redux/usersSlice';
import toast from 'react-hot-toast';

function ProtectedRoute({ children }) {
  
  const { user } = useSelector(state => state.usersReducer);
  const dsipatch = useDispatch();

  const navigate = useNavigate();

  const getloggedInUser = async () => {
     let response = null;
    try {
      dsipatch(showLoader());
       response = await getLoggedUser();
       dsipatch(hideLoader());
      if (response.success) {
        //setUser(response.data);
        dsipatch(setUser(response.data));
       
      } else {
  
        toast.error(response.message);
        window.location.href = '/login';
      }

    } catch (error) {
       dsipatch(hideLoader());
      //navigate('/login');
    }
  };

  useEffect(() => {
    if(localStorage.getItem('token')) {
      getloggedInUser();
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