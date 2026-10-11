
import { useState } from "react";
import API from "../services/api";
import "../App.css";

function Register({ onNavigate, onLogin }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "USER",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await API.post("/auth/register", {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        role: form.role,
      });

      setMessage(
        response.data?.message ||
          "Registration successful! Please log in."
      );

      setForm({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "USER",
      });

      setTimeout(() => {
        onLogin();
      }, 1200);
    } catch (err) {
      console.error("Registration error:", err);

      if (err.response) {
        const status = err.response.status;
        const serverMessage = err.response.data?.message;

        if (status === 409) {
          setError(
            serverMessage ||
              "This email is already registered. Please log in."
          );
        } else if (status === 400) {
          setError(
            serverMessage ||
              "Invalid details. Please check your inputs."
          );
        } else if (status >= 500) {
          setError(
            serverMessage ||
              "Server error. Please try again later."
          );
        } else {
          setError(
            serverMessage ||
              `Registration failed (HTTP ${status}).`
          );
        }
      } else if (err.request) {
        setError(
          "Cannot connect to the server. Make sure Spring Boot is running on port 8080."
        );
      } else {
        setError(
          err.message || "Something went wrong. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <button
        type="button"
        className="back-home"
        onClick={() => onNavigate("home")}
      >
        ← Back to Home
      </button>

      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-logo">LocalServiceFinder</div>

        <h1>Create your account</h1>

        <p className="auth-subtitle">
          Register as a customer or service provider.
        </p>

        <label htmlFor="register-role">Register as</label>
        <select
          id="register-role"
          name="role"
          value={form.role}
          onChange={handleChange}
          required
        >
          <option value="USER">Customer / User</option>
          <option value="WORKER">Worker / Service Provider</option>
        </select>

        <label htmlFor="register-name">Full name</label>
        <input
          id="register-name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter your full name"
          autoComplete="name"
          required
        />

        <label htmlFor="register-email">Email address</label>
        <input
          id="register-email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />

        <label htmlFor="register-phone">Phone number</label>
        <input
          id="register-phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          placeholder="Enter your phone number"
          autoComplete="tel"
        />

        <label htmlFor="register-password">Password</label>
        <input
          id="register-password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="At least 8 characters"
          autoComplete="new-password"
          minLength={8}
          required
        />

        {message && (
          <p className="success-message" role="status">
            {message}
          </p>
        )}

        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}

        <button
          className="auth-submit"
          type="submit"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <p className="auth-switch">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onLogin}
            disabled={loading}
          >
            Login
          </button>
        </p>
      </form>
    </main>
  );
}

export default Register;
