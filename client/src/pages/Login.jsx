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

    const loginSuccess = await login(email, password);
    if (loginSuccess) {
      navigate("/");
    } else {
      alert("Wrong email or password");
    }
  };

  return (
    <div className="login_window">
      <div className="login_form">
        <h2>Sign in your account</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email address"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
          />
          <button type="submit">Sign in</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
