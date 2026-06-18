import React from 'react';
import "../assets/style.css";
import "../assets/bootstrap.min.css";

const Header = () => {
  const logout = async (e) => {
    e.preventDefault(); // Halts immediate browser redirection to ensure API execution finishes
    let logout_url = window.location.origin + "/djangoapp/logout";
    const res = await fetch(logout_url, {
      method: "GET",
    });

    const json = await res.json();
    if (json) {
      let username = sessionStorage.getItem('username');
      sessionStorage.removeItem('username');
      alert("Logging out " + (username || "user") + "...");
      window.location.href = window.location.origin; 
    } else {
      alert("The user could not be logged out.");
    }
  };
    
  let home_page_items = <div></div>;
  let curr_user = sessionStorage.getItem('username');

  if (curr_user !== null && curr_user !== "") {
    home_page_items = (
      <div className="input_panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span className='username' style={{ color: '#e2e8f0', fontWeight: '500' }}>
          {sessionStorage.getItem("username")}
        </span>
        <a 
          className="nav_item" 
          href="#" 
          onClick={(e) => logout(e)}
          style={{
            color: '#00f0ff',
            textDecoration: 'none',
            border: '1px solid #00f0ff',
            padding: '0.375rem 1rem',
            borderRadius: '50px',
            fontSize: '0.9rem',
            fontWeight: '600',
            transition: 'all 0.2s ease'
          }}
        >
          Logout
        </a>
      </div>
    );
  } else {
    home_page_items = (
      <div className="input_panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <a 
          className="nav_item" 
          href="/login"
          style={{
            color: '#e2e8f0',
            textDecoration: 'none',
            border: '1px solid #2d3748',
            padding: '0.375rem 1rem',
            borderRadius: '50px',
            fontSize: '0.9rem',
            fontWeight: '600',
            transition: 'all 0.2s ease'
          }}
        >
          Login
        </a>
        <a 
          className="nav_item" 
          href="/register"
          style={{
            color: '#0f172a',
            backgroundColor: '#00f0ff',
            textDecoration: 'none',
            padding: '0.375rem 1rem',
            borderRadius: '50px',
            fontSize: '0.9rem',
            fontWeight: '600',
            transition: 'all 0.2s ease'
          }}
        >
          Register
        </a>
      </div>
    );
  }
    
  return (
    <div>
      <nav 
        className="navbar navbar-expand-lg navbar-dark" 
        style={{ 
          backgroundColor: "#1c2434", 
          minHeight: "75px",
          borderBottom: "1px solid #2d3748",
          padding: "0.5rem 2rem"
        }}
      >
        <div className="container-fluid">
          <h2 style={{ paddingRight: "5%", color: "#00f0ff", fontWeight: "700", margin: 0 }}>
            Dealerships
          </h2>
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarText" 
            aria-controls="navbarText" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse show" id="navbarText">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0" style={{ display: 'flex', flexDirection: 'row', gap: '1.5rem' }}>
              <li className="nav-item">
                <a className="nav-link active" style={{ fontSize: "larger", color: "#ffffff", padding: "0.5rem" }} aria-current="page" href="/">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" style={{ fontSize: "larger", color: "#94a3b8", padding: "0.5rem" }} href="/about">About Us</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" style={{ fontSize: "larger", color: "#94a3b8", padding: "0.5rem" }} href="/contact">Contact Us</a>
              </li>
            </ul>
            <span className="navbar-text">
              <div className="loginlink" id="loginlogout">
                {home_page_items}
              </div>
            </span>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;