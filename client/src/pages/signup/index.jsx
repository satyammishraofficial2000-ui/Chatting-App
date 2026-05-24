import React from "react";
import {Link} from 'react-router-dom';
import { signupUser, sendOTP, verifyOTP } from './../../apiCalls/auth';
import {toast} from "react-hot-toast";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader} from "../../redux/loaderSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Signup(){
    const  dispatch = useDispatch();
    const [otp, setOtp] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    const [isOtpVerified, setIsOtpVerified] = React.useState(false);
    const [showOtpModal, setShowOtpModal] = React.useState(false);
    const [timer, setTimer] = React.useState(30);
    const [canResend, setCanResend] = React.useState(false);
     const [user,setUser] = React.useState({
     firstname:'',
     lastname:'',
     email:'',
     password:''
     });

     React.useEffect(() => {
            let interval = null;
            if (showOtpModal && timer > 0) {
                interval = setInterval(() => {
                    setTimer((prev) => prev - 1);
                }, 1000);
            } else if (timer === 0) {
                setCanResend(true);
            }
            return () => clearInterval(interval);
        }, [showOtpModal, timer]);


        async function handleSendOTP() {
            if (!user.email) {
                toast.error("Enter email first");
                return;
            }
            try {
                dispatch(showLoader());
                const response = await sendOTP(user.email);
                dispatch(hideLoader());
                if (response.success) {
                    toast.success("OTP sent successfully");
                    setTimer(30);
                    setCanResend(false);
                    setShowOtpModal(true);
                } else {
                    toast.error(response.message);
                }
            } catch (error) {
                dispatch(hideLoader());
                toast.error(error.message);
            }
        }

        async function handleVerifyOTP() {
            if (!otp) {
                toast.error("Enter OTP");
                return;
            }
            try {
                dispatch(showLoader());
                const response = await verifyOTP({
                    email: user.email,
                    otp
                });
                dispatch(hideLoader());
                if (response.success) {
                    setIsOtpVerified(true);
                    setShowOtpModal(false);
                    toast.success("OTP verified successfully");
                } else {
                    toast.error(response.message);
                }
            } catch (error) {
                dispatch(hideLoader());
                toast.error(error.message);
            }
        }

     async function onFormSubmit(event){
            if (!isOtpVerified) {
                toast.error("Please verify OTP first");
                return;
            }
          event.preventDefault();
          if(user.password !== confirmPassword){
                toast.error("Passwords do not match");
                return;
            }
          let response = null;
          try {
            dispatch(showLoader());
            response = await signupUser(user);
            dispatch(hideLoader());
            if(response.success){
                toast.success(response.message);
            }else{
                toast.error(response.message || "Something went wrong ❌");
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
                <h1>Create Account</h1>
            </div>
            <div className="form">
                <form onSubmit={onFormSubmit}>
                    <div className="column">
                        <input type="text" placeholder="First Name"
                              value={user.firstname}
                              onChange={(e) => setUser({...user, firstname:e.target.value})} />
                        <input type="text" placeholder="Last Name"
                              value={user.lastname} 
                              onChange={(e) => setUser({...user, lastname:e.target.value})} />
                    </div>
                        <input type="email" placeholder="Email" 
                            value={user.email}
                            onChange={(e) => setUser({...user, email:e.target.value})} />
                        <button
                            type="button"
                            onClick={handleSendOTP}
                            disabled={isOtpVerified}
                            style={{
                                marginBottom: "20px",
                                opacity: isOtpVerified ? 0.7 : 1,
                                cursor: isOtpVerified ? "default" : "pointer",
                                background: isOtpVerified
                                    ? "linear-gradient(to right,#16A34A,#22C55E)"
                                    : ""
                            }}
                        >
                            {isOtpVerified ? "Verified ✅" : "Verify Email"}
                        </button>

                        <div style={{ position: "relative" }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={user.password}
                                onChange={(e) =>
                                    setUser({ ...user, password: e.target.value })
                                }
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: "absolute",
                                    right: "15px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer",
                                    color: "white"
                                }}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>

                        </div>
                         
                        <div style={{ position: "relative" }}>

                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />

                            <span
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                                style={{
                                    position: "absolute",
                                    right: "15px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer",
                                    color: "white"
                                }}
                            >
                                {
                                    showConfirmPassword
                                        ? <FaEyeSlash />
                                        : <FaEye />
                                }
                            </span>

                        </div>

                    <button disabled={ !isOtpVerified || !user.firstname || !user.lastname || !user.email || !user.password || !confirmPassword }
                        style={{
                            opacity:
                                (
                                    !isOtpVerified ||
                                    !user.firstname ||
                                    !user.lastname ||
                                    !user.email ||
                                    !user.password ||
                                    !confirmPassword
                                )
                                    ? 0.5
                                    : 1,

                            cursor:
                                (
                                    !isOtpVerified ||
                                    !user.firstname ||
                                    !user.lastname ||
                                    !user.email ||
                                    !user.password ||
                                    !confirmPassword
                                )
                                    ? "not-allowed"
                                    : "pointer",

                            filter:
                                (
                                    !isOtpVerified ||
                                    !user.firstname ||
                                    !user.lastname ||
                                    !user.email ||
                                    !user.password ||
                                    !confirmPassword
                                )
                                    ? "blur(0.5px)"
                                    : "none"
                        }}
                    >
                        Sign Up
                    </button>
                </form>
            </div>
            <div className="card_terms">
                <span>Already have an account?
                    <Link to= '/login'>Login Here</Link>
                </span>
            </div>
        </div>

            {
            showOtpModal && (
                <div className="otp-modal-overlay">
                <div className="otp-modal">
                    <h2>Email Verification</h2>
                    <p>
                    Enter the OTP sent to your email
                    </p>
                    <input
                    className="otp-input"
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    />
                    <button
                    className="verify-otp-btn"
                    type="button"
                    onClick={handleVerifyOTP}
                    >
                    Verify OTP
                    </button>

                    <p className="resend-text">
                    {
                        canResend ? (
                        <span
                            className="resend-btn"
                            onClick={handleSendOTP}
                        >
                            Resend OTP
                        </span>
                        ) : (
                        `Resend OTP in ${timer}s`
                        )
                    }
                    </p>

                </div>

                </div>
            )
            }
    </div>

     );
}
export default Signup;