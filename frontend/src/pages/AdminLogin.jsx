import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './AdminLogin.css';

const AdminLogin = ({ setIsAdmin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/admin/login',
        { username, password },
        { withCredentials: true }
      );

      if (response.data.success) {
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('adminUsername', response.data.admin.username);
        setIsAdmin(true);
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <Link to="/" className="back-home-btn">
        ← Back to Home
      </Link>
      <div className="admin-login-box">
        <div className="admin-login-header">
          <h1>🏏 IPL Analytics</h1>
          <h2>Admin Login</h2>
        </div>

        <form onSubmit={handleLogin} className="admin-login-form">
          {error && <div className="error-alert">⚠️ {error}</div>}

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="admin-login-footer">
          <p>Default: admin / admin123</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;