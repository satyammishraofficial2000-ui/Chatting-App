import { useDispatch, useSelector } from 'react-redux';

function Header(){
    const { user } = useSelector(state => state.usersReducer);
    console.log(user);

    function getFullName() {
    if(!user) return "";
    let fname = user.firstname.toLowerCase();
    let lname = user.lastname.toLowerCase();
    return fname + " " + lname;
}

function getInitials(){
    if(!user) return "";
    let f = user.firstname.toUpperCase()[0];
    let l = user.lastname.toUpperCase()[0];
    return f + l;
}

    return(
        <div className="app-header">
            <div className="app-logo">
                <i className="fa fa-comments"></i>
                Quick Chat
            </div>

            <div className="app-user-profile">
                <div className="logged-user-name">{getFullName()}</div>
                <div className="logged-user-profile-pic">{getInitials()}</div>
            </div>
        </div>
    );
}

export default Header;