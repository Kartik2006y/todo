import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

import apiClient from "../api/apiClient";
import AuthShell from "../components/AuthShell";
import useAuth from "../hooks/useAuth";

function LoginPage({ theme, toggleTheme }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, saveAuth } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await apiClient.post("/auth/login", form);
      saveAuth(data);
      const redirectPath = location.state?.from?.pathname || "/dashboard";
      navigate(redirectPath, { replace: true });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to sign in with these credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to manage your tasks, notes, and daily priorities from one dashboard."
      promptText="New here?"
      promptLink="/register"
      promptLabel="Register"
      theme={theme}
      toggleTheme={toggleTheme}
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="field-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field-group">
          <div className="label-row">
            <label htmlFor="password">Password</label>
            {/* <Link to="/register">Create access</Link> */}
          </div>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        {error ? <p className="form-message error">{error}</p> : null}

        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </AuthShell>
  );
}

export default LoginPage;
