import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ProtectedRoute({children}){
    const navigate = useNavigate();
    useEffect( () => {
    if(localStorage.getItem('token')){
        //

    }else{
        navigate('/login');
    } 
    });
    return(
    <div>
        { children }
    </div>);
    
}
export default ProtectedRoute;