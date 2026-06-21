import React from 'react';

const Header = () => {
  const logout = async (e) => {
    e.preventDefault();
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

  let curr_user = sessionStorage.getItem('username');
  let isLoggedIn = curr_user !== null && curr_user !== "";

  return (
    <div>
      <nav
        className="navbar navbar-expand-lg navbar-dark py-3"
        style={{ backgroundColor: '#1c2434', borderBottom: '1px solid #2d3748', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
      >
        <div className="container-fluid px-4">
          <h2 className="mb-0 me-5 fw-bold" style={{ color: '#00f0ff' }}>Dealerships</h2>
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
          <div className="collapse navbar-collapse" id="navbarText">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-2">
              <li className="nav-item">
                <a className="nav-link active fs-5 fw-semibold" style={{ color: '#00f0ff' }} aria-current="page" href="/">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link fs-5" style={{ color: '#94a3b8' }} href="/about">About Us</a>
              </li>
              <li className="nav-item">
                <a className="nav-link fs-5" style={{ color: '#94a3b8' }} href="/contact">Contact Us</a>
              </li>
            </ul>
            <div className="d-flex align-items-center" id="loginlogout">
              {isLoggedIn ? (
                <>
                  <span className="text-white fw-bold me-3">{curr_user}</span>
                  <button
                    className="btn btn-outline-light btn-sm rounded-pill px-3 fw-semibold"
                    onClick={(e) => logout(e)}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <a className="btn btn-outline-light btn-sm rounded-pill px-3 me-2 fw-semibold" href="/login">Login</a>
                  <a className="btn btn-light btn-sm rounded-pill px-3 fw-semibold" style={{ backgroundColor: '#e2e8f0' }} href="/register">Register</a>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
