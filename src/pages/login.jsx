
import { useState } from "react";
import API from "../services/api";
import "../App.css";

function Login({ onNavigate, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await API.post("/auth/login", {
        email,
        password,
      });

      onLoginSuccess(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <button className="back-home" onClick={() => onNavigate("home")}>
        ← Back to Home
      </button>

      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-logo">LocalServiceFinder</div>
        <h1>Welcome back</h1>
        <p className="auth-subtitle">
          Login to continue to your account.
        </p>

        <label htmlFor="login-email">Email address</label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />

        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />

        {error && <p className="error-message">{error}</p>}

        <button className="auth-submit" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="auth-switch">
          Don't have an account?{" "}
          <button type="button" onClick={() => onNavigate("register")}>
            Register
          </button>
        </p>
      </form>
    </main>
  );
}

export default Login;
