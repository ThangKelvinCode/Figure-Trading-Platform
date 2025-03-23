// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "../assets/css/Register.css";
// import { useAuth } from "../context/auth.jsx";

// function Register() {
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [error, setError] = useState("");
//   const { register } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     // Client-side validation
//     if (!username || !email || !password || !confirmPassword) {
//       setError("All fields are required");
//       return;
//     }

//     if (password !== confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }

//     try {
//       const success = await register(username, email, password, confirmPassword);
//       if (success) {
//         navigate("/");
//       }
//     } catch (err) {
//       setError(err.message || "Registration failed");
//     }
//   };

//   const handleBackToHome = () => {
//     navigate("/");
//   };

//   return (
//     <div className="register_window">
//       <div className="register_form">
//         <h2>Create your account</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="input-group">
//             <input
//               name="username"
//               type="text"
//               required
//               placeholder="Username"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//             />
//           </div>
//           <div className="input-group">
//             <input
//               name="email"
//               type="email"
//               required
//               placeholder="Email address"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>
//           <div className="input-group">
//             <input
//               name="password"
//               type="password"
//               required
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>
//           <div className="input-group">
//             <input
//               name="confirmPassword"
//               type="password"
//               required
//               placeholder="Confirm Password"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//             />
//           </div>
//           {error && <p style={{ color: "red" }}>{error}</p>}
//           <Link className="navi_login" to="/login">
//             Already have an account?
//           </Link>
//           <button type="submit" className="form-button">
//             Register
//           </button>
//           <button
//             type="button"
//             className="form-button"
//             onClick={handleBackToHome}
//           >
//             Back to Home
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Register;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/Register.css";
import { useAuth } from "../context/auth.jsx";function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

if (password !== confirmPassword) {
  setError("Password do not match");
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

  };  return (
    <div className="register_window">
      <div className="register_form">
        <h2>Create your account</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              name="username"
              type="text"
              required
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-group">
            <input
              name="email"
              type="email"
              required
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <input
              name="password"
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
            />
          </div>
          <div className="input-group">
            <input
              name="confirmPassword"
              type="password"
              required
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setconfirmPassword(e.target.value)}
            />
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}export default Register;

