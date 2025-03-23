import React, { useState } from "react";
import "../assets/css/AuthPage.css"; // Import the updated CSS for this page
import Login from "./Login"; // Import your existing Login component
import Register from "./Register"; // Import your existing Register component

function AuthPage() {
  const [isLoginMode, setIsLoginMode] = useState(true); // State to toggle between login and register

  const toggleMode = () => {
    setIsLoginMode((prevMode) => !prevMode); // Toggle between login and register modes
  };

  return (
    <div className="auth-page">
      <div className="auth_form">
        <div
          className={`banner ${
            isLoginMode ? "slide-to-left" : "slide-to-right"
          }`}
        >
          <h2>{isLoginMode ? "Welcome Back!" : "Hello New Friend!"}</h2>
          <button onClick={toggleMode} className="toggle-button">
            {isLoginMode ? "Create Account" : "Sign In"}
          </button>
        </div>
        <div
          className={`form-container ${
            isLoginMode ? "form-login" : "form-register"
          }`}
        >
          {isLoginMode ? <Login /> : <Register />}
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
