import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const navItems = [
  { to: '/', label: 'Overview' },
  { to: '/events', label: 'Events' },
  { to: '/register', label: 'Register' },
  { to: '/tickets', label: 'Tickets' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();

  return (
    <aside className="sidebar">
      <div className="brand">
        <svg viewBox="0 0 64 64" fill="none" aria-label="Portal logo" width="42" height="42">
          <rect x="10" y="10" width="44" height="44" rx="12" stroke="currentColor" strokeWidth="4" />
          <path d="M22 32h20M32 22v20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          <circle cx="46" cy="18" r="6" fill="currentColor" />
        </svg>
        <div>
          <strong>Event Portal</strong>
          <p className="muted">Smart registrations</p>
        </div>
      </div>

      <nav>
        {navItems.map(item => (
          <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            {item.label}
          </NavLink>
        ))}
        {user?.role === 'admin' && (
          <NavLink to="/admin" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Admin Dashboard
          </NavLink>
        )}
      </nav>

      <div className="sidebar-footer">
        <div>
          <strong>{user?.name}</strong>
          <p className="muted">{user?.role === 'admin' ? 'Administrator' : 'Participant'}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-secondary" onClick={toggle} aria-label="Toggle theme">
            {theme === 'dark' ? '☀' : '◐'}
          </button>
          <button className="btn btn-secondary" onClick={logout}>Log out</button>
        </div>
      </div>
    </aside>
  );
}