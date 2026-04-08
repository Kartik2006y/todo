import { useState, useMemo } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import apiClient from "../api/apiClient";
import AuthShell from "../components/AuthShell";
import useAuth from "../hooks/useAuth";

const validatePassword = (password) => {
  return {
    length: password.length >= 6,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };
};

function RegisterPage({ theme, toggleTheme }) {
  const navigate = useNavigate();
  const { isAuthenticated, saveAuth } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const passwordRequirements = useMemo(() => validatePassword(form.password), [form.password]);
  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isPasswordValid) {
      setError("Password does not meet all requirements");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
      };
      const { data } = await apiClient.post("/auth/register", payload);
      saveAuth(data);
      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to create your account right now."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Build your workspace"
      subtitle="Create an account to start tracking tasks, storing notes, and shipping work with clarity."
      promptText="Already have an account?"
      promptLink="/login"
      promptLabel="Sign in"
      theme={theme}
      toggleTheme={toggleTheme}
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="field-group">
          <label htmlFor="name">Full name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Your full name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

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
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter a strong password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
          />
          {form.password && (
            <div className="password-requirements">
              <div className={`requirement ${passwordRequirements.length ? "met" : ""}`}>
                {passwordRequirements.length ? "✓" : "○"} At least 6 characters
              </div>
              <div className={`requirement ${passwordRequirements.uppercase ? "met" : ""}`}>
                {passwordRequirements.uppercase ? "✓" : "○"} One uppercase letter
              </div>
              <div className={`requirement ${passwordRequirements.number ? "met" : ""}`}>
                {passwordRequirements.number ? "✓" : "○"} One number
              </div>
              <div className={`requirement ${passwordRequirements.special ? "met" : ""}`}>
                {passwordRequirements.special ? "✓" : "○"} One special character
              </div>
            </div>
          )}
        </div>

        <div className="field-group">
          <label htmlFor="confirmPassword">Confirm password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Re-enter password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            minLength={6}
          />
        </div>

        {error ? <p className="form-message error">{error}</p> : null}

        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
}

export default RegisterPage;
