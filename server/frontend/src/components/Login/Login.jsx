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
      if (json.firstName) sessionStorage.setItem('firstname', json.firstName);
      if (json.lastName) sessionStorage.setItem('lastname', json.lastName);
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
      <Header />
      
      <main className="container my-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 col-lg-5">
            
            <div className="card login-card">
              <div className="banner" style={{ padding: '2.5rem 2rem', textAlign: 'center', borderBottom: '1px solid #2d3748' }}>
                <h1 className="h3 fw-bold text-white mb-2">Welcome Back</h1>
                <p className="mb-0 small" style={{ color: '#94a3b8' }}>Access your dealership account panel</p>
              </div>
              
              <div className="card-body p-4 p-md-5">
                <form onSubmit={login}>
                  <div className="mb-3">
                    <label className="form-label small text-secondary fw-semibold" style={{ color: '#94a3b8 !important' }}>Username</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Enter username" 
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label small text-secondary fw-semibold" style={{ color: '#94a3b8 !important' }}>Password</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      placeholder="Enter password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)} 
                      required 
                    />
                  </div>
                  <button type="submit" className="btn btn-cyan px-4 py-2 rounded-pill w-100 fw-bold">
                    Login
                  </button>
                </form>

                <div className="text-center mt-4">
                  <span className="small" style={{ color: '#94a3b8' }}>New to the platform? </span>
                  <a href="/register" className="text-cyan text-decoration-none small fw-semibold">Register Now</a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
