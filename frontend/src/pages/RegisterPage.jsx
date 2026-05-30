import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { signup, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'participant' });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signup(form);
    if (result?.success) navigate('/');
    else toast.error(result?.message || 'Sign up failed');
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
          <h1>Create account</h1>
          <p>Join the portal to discover and register for events.</p>
        </div>

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label htmlFor="reg-name">Full name</label>
            <input
              id="reg-name"
              name="name"
              type="text"
              className="auth-input"
              placeholder="Anjali Sharma"
              required
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="reg-email">Email address</label>
            <input
              id="reg-email"
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
            <label htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              name="password"
              type="password"
              className="auth-input"
              placeholder="Minimum 6 characters"
              required
              minLength={6}
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="reg-role">Account type</label>
            <select
              id="reg-role"
              name="role"
              className="auth-input"
              value={form.role}
              onChange={handleChange}
            >
              <option value="participant">Participant</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            {loading ? 'Creating account…' : 'Create account →'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </p>

      </div>
    </div>
  );
}

