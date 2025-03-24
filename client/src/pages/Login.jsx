import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/Login.css";
import { useAuth } from "../context/auth.jsx";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      const loginSuccess = await login(email, password);
      if (loginSuccess) {
        navigate("/");
      } else {
        setError("Wrong email or password");
      }
    } catch (err) {
      setError(err.message || "Wrong email or password");
    }
  };

  return (
    <div className="login_window">
      <div className="auth-form">
        <h2>Sign in your account</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email address"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
          </div>
          <button type="submit" className="submit-button">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
