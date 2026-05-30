import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(form.email, form.password);
    if (result?.success) navigate('/');
    else toast.error(result?.message || 'Login failed');
  };

  return (
    <div className="auth-page">
      <div className="auth-box">

        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <svg viewBox="0 0 48 48" width="28" height="28" fill="none" aria-hidden="true">
              <rect x="6" y="6" width="36" height="36" rx="10" stroke="currentColor" strokeWidth="3.5"/>
              <path d="M16 24h16M24 16v16" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"/>
              <circle cx="37" cy="11" r="5" fill="currentColor"/>
            </svg>
          </div>
          <div className="auth-logo-text">
            <span className="auth-logo-name">Event Portal</span>
            <span className="auth-logo-sub">Smart registrations</span>
          </div>
        </div>

        {/* Heading */}
        <div className="auth-header">
          <h1>Welcome back</h1>
          <p>Sign in to your account to continue.</p>
        </div>

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label htmlFor="login-email">Email address</label>
            <input
              id="login-email"
              name="email"
              type="email"
              className="auth-input"
              placeholder="you@example.com"
              autoComplete="email"
              required
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              name="password"
              type="password"
              className="auth-input"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              minLength={6}
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign in →'}
          </button>
        </form>

        <p className="auth-switch">
          No account yet?{' '}
          <Link to="/signup">Create one</Link>
        </p>

      </div>
    </div>
  );
}