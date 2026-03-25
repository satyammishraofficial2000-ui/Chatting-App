import React from "react";
import {Link} from 'react-router-dom';

function Login(){
     const [user, setUser] = React.useState({
          email: '',
          password: ''
     });

     function onFormSubmit(event){
          event.preventDefault();
          console.log(user);
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