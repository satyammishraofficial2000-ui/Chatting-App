import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Header({socket}) {

    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "dark"
    );

    useEffect(() => {
            if(theme === "light"){
                document.body.classList.add("light-theme");
            }else{
                document.body.classList.remove("light-theme");
            }
        }, [theme]);
        const [showLogoutModal, setShowLogoutModal] = useState(false);


    const { user } = useSelector(state => state.usersReducer);
    const navigate = useNavigate();

    function getFullName() {
    if(!user) return "";
    let fname = user.firstname.at(0).toUpperCase() + user.firstname.slice(1).toLowerCase();
    let lname = user.lastname.at(0).toUpperCase() + user.lastname.slice(1).toLowerCase();
    return fname + " " + lname;
}

function getInitials(){
    if(!user) return "";
    let f = user.firstname.toUpperCase()[0];
    let l = user.lastname.toUpperCase()[0];
    return f + l;
}

const logout = () => {

    localStorage.removeItem("token");

    navigate('/login');
}

    return(
           <>
        <div className="app-header">
            <div className="app-logo">
                <i className="fa fa-comments"></i>
                Quick Chat
            </div>

            <div className="app-user-profile">
                {user?.profilePic && <img src={user?.profilePic} alt="profile-pic" className='logged-user-profile-pic' onClick={() => navigate('/profile')}/>}
                {!user?.profilePic && <div className="logged-user-profile-pic" onClick={() => navigate('/profile')}>
                    {getInitials()}
                </div>}
                <div className="logged-user-name">{getFullName()}</div>
                <button className="theme-toggle-btn"
                        onClick={() => {

                            const newTheme =
                                theme === "dark"
                                ? "light"
                                : "dark";

                            setTheme(newTheme);

                            localStorage.setItem(
                                "theme",
                                newTheme
                            );

                            document.body.className =
                                newTheme === "light"
                                ? "light-theme"
                                : "";
                        }}
                    >
                    </button>

                    <button className="logout-button" onClick={() => setShowLogoutModal(true)}>
                        <i className="fa fa-power-off"></i>
                    </button>
                
            </div>
        </div>

        {
                showLogoutModal && (

                    <div className="logout-modal-overlay">

                        <div className="logout-modal">

                            <div className="logout-warning-icon">
                                <i className="fa fa-sign-out"></i>
                            </div>

                            <h2>Logout?</h2>

                            <p>
                                Are you sure you want to logout
                                from Quick Chat?
                            </p>

                            <div className="logout-modal-buttons">

                                <button
                                    className="cancel-logout-btn"
                                    onClick={() => setShowLogoutModal(false)}
                                >
                                    Cancel
                                </button>

                                <button
                                    className="confirm-logout-btn"
                                    onClick={logout}
                                >
                                    Logout
                                </button>

                            </div>

                        </div>

                    </div>
                )
            }
            </>
    );
}

export default Header;