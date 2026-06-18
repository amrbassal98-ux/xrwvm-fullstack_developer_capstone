import React, { useState } from 'react';
import "./Login.css";
import Header from '../Header/Header';

const Login = ({ onClose }) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(true);

  let login_url = window.location.origin + "/djangoapp/login";

  const login = async (e) => {
    e.preventDefault();
    const res = await fetch(login_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "userName": userName,
        "password": password
      }),
    });

    const json = await res.json();
    if (json.status !== null && json.status === "Authenticated") {
      sessionStorage.setItem('username', json.userName);
      setOpen(false);
    } else {
      alert("The user could not be authenticated.");
    }
  };

  if (!open) {
    window.location.href = "/";
  }

  return (
    <div className="login-page-wrapper">
      {/* Structural Global Top Navigation Component */}
      <Header />
      
      <div className="login-container">
        <div className="login-card">
          <h2 className="login-header">Welcome Back</h2>
          <p className="login-subtitle">Access your dealership account panel</p>
          
          <form onSubmit={login}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Enter username" 
                value={userName}
                onChange={(e) => setUserName(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="Enter password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            <button type="submit" className="btn-submit">Login</button>
          </form>

          <div className="login-footer">
            <span className="text-muted">New to the platform? </span>
            <a href="/register" className="register-link">Register Now</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;