import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/Register.css";
import { useAuth } from "../context/auth.jsx";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const success = await register(username, email, password);
      if (success) {
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <div className="register_window">
      <div className="auth-form">
        <h2>Create your account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              name="username"
              type="text"
              required
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              name="email"
              type="email"
              required
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              name="password"
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              name="confirmPassword"
              type="password"
              required
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {error && (
            <p className="error-message" style={{ color: "red" }}>
              {error}
            </p>
          )}
          <button type="submit" className="submit-button">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
