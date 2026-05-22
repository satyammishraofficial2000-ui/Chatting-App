import React from "react";
import {Link} from 'react-router-dom';
import { loginUser } from "../../apiCalls/auth";
import {toast} from "react-hot-toast";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../../redux/loaderSlice";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { googleLogin } from "../../apiCalls/auth";


function Login(){
    const dispatch = useDispatch();
     const [user, setUser] = React.useState({
          email: '',
          password: ''
     });

    async function onFormSubmit(event){
          event.preventDefault();
          let response = null;
          try {
            dispatch(showLoader());
             response = await loginUser(user);
             console.log(response);
             dispatch(hideLoader());
            if(response.success){
                toast.success(response.message);
                localStorage.setItem('token',response.token);
                window.location.href = "/";
            }else{
                toast.error(response.message);
            }

          } catch (error) {
            dispatch(hideLoader());
            toast.error(error.message);
          }
     }
     return (
          <div className="container">
        <div className="container-back-img"></div>
        <div className="container-back-color"></div>
        <div className="card">
        <div className="card_title">
            <h1>Login Here</h1>
        </div>
        <div className="form">
        <form onSubmit={onFormSubmit}>
            <input type="email" placeholder="Email"
            value = {user.email}
            onChange={ (e) => setUser({...user, email:e.target.value}) } />
            <input type="password" placeholder="Password"
            value = {user.password}
            onChange={ (e) => setUser({...user, password:e.target.value}) }  />
            <button>Login</button>

                <div style={{ marginTop: "15px" }}>
                        <GoogleLogin
                            onSuccess={async (credentialResponse) => {

                            const userInfo = jwtDecode(
                                credentialResponse.credential
                            );

                            const response = await googleLogin({
                                firstname: userInfo.given_name,
                                lastname: userInfo.family_name || "",
                                email: userInfo.email,
                                profilePic: userInfo.picture
                            });

                            if(response.success){

                                localStorage.setItem(
                                "token",
                                response.token
                                );

                                window.location.href = "/";

                            } else {

                                toast.error(response.message);

                            }

                            }}
                            onError={() => {
                            console.log("Google Login Failed");
                            }}
                        />
                        </div>
        </form>
        </div>
        <div className="card_terms"> 
            <span>Don't have an account yet?
                <Link to="/signup" >Signup Here</Link>
            </span>
        </div>
        </div>
    </div>
     );
}
export default Login;