import React, { useState } from "react";
import "./Register.css";
import Header from "../Header/Header";

const Register = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const gohome = () => {
    window.location.href = window.location.origin;
  };

  const register = async (e) => {
    e.preventDefault();

    let register_url = window.location.origin + "/djangoapp/register";

    const res = await fetch(register_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "userName": userName,
        "password": password,
        "firstName": firstName,
        "lastName": lastName,
        "email": email
      }),
    });

    const json = await res.json();
    if (json.status) {
      sessionStorage.setItem('username', json.userName);
      sessionStorage.setItem('firstname', json.firstName);
      sessionStorage.setItem('lastname', json.lastName);
      window.location.href = window.location.origin;
    } else if (json.error === "Already Registered") {
      alert("The user with same username is already registered");
      window.location.href = window.location.origin;
    }
  };

  return (
    <div className="register-page-wrapper">
      <Header />
      
      <main className="container my-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            
            <div className="card register-card">
              <div className="banner" style={{ padding: '2.5rem 2rem', textAlign: 'center', borderBottom: '1px solid #2d3748' }}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h1 className="h3 fw-bold text-white mb-0">SignUp</h1>
                  <a href="/" onClick={(e) => { e.preventDefault(); gohome(); }} className="text-white text-decoration-none">
                    <span className="fs-4">&times;</span>
                  </a>
                </div>
                <p className="mb-0 small" style={{ color: '#94a3b8' }}>Create a new dealership account</p>
              </div>
              
              <div className="card-body p-4 p-md-5">
                <form onSubmit={register}>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label small text-secondary fw-semibold" style={{ color: '#94a3b8 !important' }}>Username</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Username" 
                        onChange={(e) => setUserName(e.target.value)} 
                        required 
                      />
                    </div>
                    
                    <div className="col-12 col-sm-6">
                      <label className="form-label small text-secondary fw-semibold" style={{ color: '#94a3b8 !important' }}>First Name</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="First Name" 
                        onChange={(e) => setFirstName(e.target.value)} 
                        required 
                      />
                    </div>
                    
                    <div className="col-12 col-sm-6">
                      <label className="form-label small text-secondary fw-semibold" style={{ color: '#94a3b8 !important' }}>Last Name</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Last Name" 
                        onChange={(e) => setLastName(e.target.value)} 
                        required 
                      />
                    </div>
                    
                    <div className="col-12">
                      <label className="form-label small text-secondary fw-semibold" style={{ color: '#94a3b8 !important' }}>Email</label>
                      <input 
                        type="email" 
                        className="form-control" 
                        placeholder="Email" 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                      />
                    </div>
                    
                    <div className="col-12">
                      <label className="form-label small text-secondary fw-semibold" style={{ color: '#94a3b8 !important' }}>Password</label>
                      <input 
                        type="password" 
                        className="form-control" 
                        placeholder="Password" 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                      />
                    </div>
                    
                    <div className="col-12 pt-2">
                      <button type="submit" className="btn btn-cyan px-4 py-2 rounded-pill w-100 fw-bold">
                        Register
                      </button>
                    </div>
                  </div>
                </form>

                <div className="text-center mt-4">
                  <span className="small" style={{ color: '#94a3b8' }}>Already have an account? </span>
                  <a href="/login" className="text-cyan text-decoration-none small fw-semibold">Login Here</a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
