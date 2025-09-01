// src/Pages/Login/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (
      email === "asliAccountsdexo@2025" &&
      password === "aslidexoinnovation@2025"
    ) {
      setMessage("✅ Login successful! Redirecting...");
      setTimeout(() => navigate("/home"), 1500); // redirect after success
    } else {
      setMessage("❌ Invalid email or password!");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">DEXO Accounts</h2>
        <p className="login-subtitle">Sign in to continue</p>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        {message && <p className="login-message">{message}</p>}
      </div>
    </div>
  );
};

export default Login;
