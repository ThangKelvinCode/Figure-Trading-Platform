import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
        navigate("/"); // Điều hướng đã được xử lý trong auth.jsx, nhưng để đảm bảo, ta có thể giữ lại
      } else {
        setError("Email or password is incorrect");
      }
    } catch (err) {
      setError(err.message || "Email or password is incorrect");
    }
  };

  return (
    <div className="login_window">
      <div className="auth-form">
        <h2>Sign in to your account</h2>
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
          <div>
            <Link className="back_button" to="/">
              Back to main page?
            </Link>
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
