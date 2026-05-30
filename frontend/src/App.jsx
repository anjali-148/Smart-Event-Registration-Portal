import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OverviewPage from './pages/OverviewPage';
import EventsPage from './pages/EventsPage';
import RegistrationPage from './pages/RegistrationPage';
import TicketsPage from './pages/TicketsPage';
import AdminPage from './pages/AdminPage';
import { useAuth } from './context/AuthContext';
import './App.css'

export default function App() {
  const { user } = useAuth();

  return (
    <div className="app-shell">
      {user && <Sidebar />}
      <main className="main-content">
        <Routes>
          <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" replace />} />
          <Route path="/signup" element={!user ? <RegisterPage /> : <Navigate to="/" replace />} />

          <Route path="/" element={<ProtectedRoute><OverviewPage /></ProtectedRoute>} />
          <Route path="/events" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
          <Route path="/register" element={<ProtectedRoute><RegistrationPage /></ProtectedRoute>} />
          <Route path="/tickets" element={<ProtectedRoute><TicketsPage /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />

          <Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />
        </Routes>
      </main>
    </div>
  );
}