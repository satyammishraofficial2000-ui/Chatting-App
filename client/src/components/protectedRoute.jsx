import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLoggedUser } from './../apiCalls/users';
import { useDispatch } from 'react-redux';
import { hideLoader, showLoader } from '../redux/loaderSlice';

function ProtectedRoute({ children }) {

  const dsipatch = useDispatch();

  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const getloggedInUser = async () => {
     let response = null;
    try {
      dsipatch(showLoader());
       response = await getLoggedUser();
       dsipatch(hideLoader());
      if (response.success) {
        setUser(response.data);
      } else {
        navigate('/login');
      }

    } catch (error) {
       dsipatch(hideLoader());
      navigate('/login');
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
      <p>Name: { user?.firstname + ' ' + user?.lastname}</p>
      <p>Email: { user?.email }</p>
      <br /><br />
       {children}
    </div>
    
);
}

export default ProtectedRoute;