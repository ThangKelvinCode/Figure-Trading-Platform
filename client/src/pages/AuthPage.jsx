import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/AuthPage.css";
import { useAuth } from "../context/auth.jsx";
import Login from "./Login";
import Register from "./Register";

function AuthPage() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const toggleMode = () => {
    setIsLoginMode((prevMode) => !prevMode);
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
