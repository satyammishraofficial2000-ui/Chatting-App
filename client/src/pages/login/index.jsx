import React from "react";
import {Link} from 'react-router-dom';
import { loginUser } from "../../apiCalls/auth";
import {toast} from "react-hot-toast";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../../redux/loaderSlice";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { googleLogin } from "../../apiCalls/auth";
import { checkEmailExists } from "../../apiCalls/auth";
import axios from "axios";

function Login(){
    const dispatch = useDispatch();
    const [showForgotModal, setShowForgotModal] = React.useState(false);
    const [forgotEmail, setForgotEmail] = React.useState("");
    const [forgotStep, setForgotStep] = React.useState(0);
    const [forgotOtp, setForgotOtp] = React.useState("");
    const [newPassword, setNewPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    
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
                <div
            style={{
                textAlign: "right",
                marginTop: "10px",
                marginBottom: "10px"
            }}
            >
            <span
            onClick={() => setShowForgotModal(true)}
            style={{
                color: "#8B5CF6",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500"
            }}
            >
            Forgot Password?
            </span>
            </div>
        <div className="card_terms"> 
            <span>Don't have an account yet?
                <Link to="/signup" >Signup Here</Link>
            </span>
        </div>
        </div>
        {
        showForgotModal && (

            <div className="otp-modal-overlay">

            <div className="otp-modal">

            <h2>
            {
                forgotStep === 0
                ? "Forgot Password"
                : forgotStep === 1
                ? "Verify OTP"
                : "Create New Password"
            }
            </h2>

            <p>
            {
                forgotStep === 0
                ? "Enter your registered email"
                : forgotStep === 1
                ? "Enter the OTP sent to your email"
                : "Create your new secure password"
            }
            </p>
                    {
                    forgotStep === 0 && (
                        <>

                        <input
                            type="email"
                            placeholder="Enter Email"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            style={{
                            width: "100%",
                            padding: "14px",
                            borderRadius: "14px",
                            border: "1px solid rgba(255,255,255,0.1)",
                            background: "#1F2937",
                            color: "white",
                            outline: "none",
                            fontSize: "16px"
                            }}
                        />

                        <button
                            className="verify-otp-btn"
                            onClick={async () => {

                            if(!forgotEmail){
                                toast.error("Please enter email");
                                return;
                            }

                            const response = await checkEmailExists(forgotEmail);

                            if(response.success){

                                toast.success("Account verified");

                                setForgotStep(1);

                                await axios.post(
                                "https://quick-chat-app-qviu.onrender.com/api/otp/send-otp",
                                {
                                    email: forgotEmail
                                }
                                );

                            } else {

                                toast.error(response.message);

                            }

                            }}
                        >
                            Verify Email
                        </button>

                        </>
                    )
                    }

                    {
                    forgotStep === 1 && (
                        <>

                        <input
                            type="text"
                            placeholder="Enter OTP"
                            value={forgotOtp}
                            onChange={(e) => setForgotOtp(e.target.value)}
                            style={{
                            width: "100%",
                            padding: "14px",
                            borderRadius: "14px",
                            border: "1px solid rgba(255,255,255,0.1)",
                            background: "#1F2937",
                            color: "white",
                            outline: "none",
                            fontSize: "18px",
                            textAlign: "center",
                            letterSpacing: "6px"
                            }}
                        />

                        <button
                            className="verify-otp-btn"
                            onClick={async () => {

                                try {

                                    if(!forgotOtp){
                                        toast.error("Please enter OTP");
                                        return;
                                    }

                                    const response = await axios.post(
                                        "https://quick-chat-app-qviu.onrender.com/api/otp/verify-otp",
                                        {
                                            email: forgotEmail,
                                            otp: forgotOtp
                                        }
                                    );

                                    if(response.data.success){

                                        toast.success("OTP verified");

                                        setForgotStep(2);

                                    }

                                } catch (error) {

                                    toast.error(
                                        error.response.data.message
                                    );

                                }

                            }}
                        >
                            Verify OTP
                        </button>

                        </>
                    )
                    }

                    {
                    forgotStep === 2 && (
                        <>

                        <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            style={{
                            width: "100%",
                            padding: "14px",
                            borderRadius: "14px",
                            border: "1px solid rgba(255,255,255,0.1)",
                            background: "#1F2937",
                            color: "white",
                            outline: "none",
                            fontSize: "16px",
                            marginBottom: "12px"
                            }}
                        />

                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            style={{
                            width: "100%",
                            padding: "14px",
                            borderRadius: "14px",
                            border: "1px solid rgba(255,255,255,0.1)",
                            background: "#1F2937",
                            color: "white",
                            outline: "none",
                            fontSize: "16px"
                            }}
                        />

                        <button
                            className="verify-otp-btn"
                            onClick={async () => {

                            if(!newPassword || !confirmPassword){
                                toast.error("Please fill all fields");
                                return;
                            }

                            if(newPassword !== confirmPassword){
                                toast.error("Passwords do not match");
                                return;
                            }

                            const response = await axios.post(
                                "https://quick-chat-app-qviu.onrender.com/api/auth/reset-password",
                                {
                                email: forgotEmail,
                                password: newPassword
                                }
                            );

                            if(response.data.success){

                                toast.success("Password updated successfully");

                                setShowForgotModal(false);

                                setForgotStep(0);

                                setForgotEmail("");
                                setForgotOtp("");
                                setNewPassword("");
                                setConfirmPassword("");

                            } else {

                                toast.error(response.data.message);

                            }

                            }}
                        >
                            Reset Password
                        </button>

                        </>
                    )
                    }

                <button
                className="verify-otp-btn"
                style={{
                    marginTop: "10px",
                    background: "#374151"
                }}
                onClick={() => setShowForgotModal(false)}
                >
                Cancel
                </button>

            </div>

            </div>

        )
        }
    </div>
     );
}
export default Login;