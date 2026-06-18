import React, { useState } from "react";
import "./Register.css";
import Header from "../Header/Header";
import user_icon from "../assets/person.png";
import email_icon from "../assets/email.png";
import password_icon from "../assets/password.png";
import close_icon from "../assets/close.png";

const Register = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setlastName] = useState("");

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
    <div className="login-page-wrapper">
      <Header />
      <div className="login-container">
        <div className="register_container">
          <div className="register_header">
            <span className="text">SignUp</span>
            <a href="/" onClick={(e) => { e.preventDefault(); gohome(); }}>
              <img className="close_icon_img" src={close_icon} alt="Close" />
            </a>
          </div>
          <div className="register_subtitle">Create a new dealership account</div>
          <div className="divider"></div>

          <form onSubmit={register}>
            <div className="input_row">
              <label className="input_label">Username</label>
              <div className="input_wrapper">
                <img src={user_icon} className="img_icon" alt='Username' />
                <input 
                  type="text" 
                  name="username" 
                  placeholder="Username" 
                  className="input_field" 
                  onChange={(e) => setUserName(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div className="input_row">
              <label className="input_label">First Name</label>
              <div className="input_wrapper">
                <img src={user_icon} className="img_icon" alt='First Name' />
                <input 
                  type="text" 
                  name="first_name" 
                  placeholder="First Name" 
                  className="input_field" 
                  onChange={(e) => setFirstName(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div className="input_row">
              <label className="input_label">Last Name</label>
              <div className="input_wrapper">
                <img src={user_icon} className="img_icon" alt='Last Name' />
                <input 
                  type="text" 
                  name="last_name" 
                  placeholder="Last Name" 
                  className="input_field" 
                  onChange={(e) => setlastName(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div className="input_row">
              <label className="input_label">Email</label>
              <div className="input_wrapper">
                <img src={email_icon} className="img_icon" alt='Email' />
                <input 
                  type="email" 
                  name="email" 
                  placeholder="Email" 
                  className="input_field" 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div className="input_row">
              <label className="input_label">Password</label>
              <div className="input_wrapper">
                <img src={password_icon} className="img_icon" alt='Password' />
                <input 
                  name="psw" 
                  type="password" 
                  placeholder="Password" 
                  className="input_field" 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div className="submit_panel">
              <input className="submit" type="submit" value="Register" />
            </div>

            <div className="login_redirect">
              <span>Already have an account? </span>
              <a href="/login" className="login_link_accent">Login Here</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;