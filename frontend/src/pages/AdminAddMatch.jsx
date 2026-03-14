import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import axios from 'axios';
import './AdminMatchForm.css';

const AdminAddMatch = ({ setIsAdmin, theme, toggleTheme }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    season: '',
    city: '',
    date: '',
    match_type: 'League',
    player_of_match: '',
    venue: '',
    team1: '',
    team2: '',
    toss_winner: '',
    toss_decision: 'bat',
    winner: '',
    result: 'runs',
    result_margin: '',
    target_runs: '',
    target_overs: '',
    super_over: 'N',
    method: '',
    umpire1: '',
    umpire2: ''
  });

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/api/admin/check',
        { withCredentials: true }
      );
      if (!response.data.isAuthenticated) {
        navigate('/admin/login');
      }
    } catch (error) {
      navigate('/admin/login');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post(
        'http://localhost:5000/api/admin/matches',
        formData,
        { withCredentials: true }
      );

      alert('Match added successfully! Points table updated.');
      navigate('/admin/matches');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add match');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        'http://localhost:5000/api/admin/logout',
        {},
        { withCredentials: true }
      );
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('adminUsername');
      setIsAdmin(false);
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout failed');
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <h2>🏏 IPL Admin</h2>
        </div>
        <nav className="sidebar-nav">
          <Link to="/admin/dashboard" className="nav-item">
            📊 Dashboard
          </Link>
          <Link to="/admin/matches" className="nav-item active">
            🏏 Matches
          </Link>
          <div className="nav-item disabled">
            🏆 Teams (Coming Soon)
          </div>
          <div className="nav-item disabled">
            📅 Seasons (Coming Soon)
          </div>
          <Link to="/" className="nav-item">
            🌐 View Public Site
          </Link>
        </nav>
        <button onClick={handleLogout} className="logout-btn">
          🚪 Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        <div className="admin-header">
          <h1>Add New Match</h1>
          <div className="header-actions">
            <button
                className="theme-toggle-btn"
                onClick={toggleTheme}
                aria-label="Toggle theme"
            >
                <motion.div
                    initial={false}
                    animate={{ rotate: theme === 'dark' ? 0 : 180 }}
                    transition={{ duration: 0.3 }}
                >
                    {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                </motion.div>
            </button>
            <button onClick={() => navigate('/admin/matches')} className="back-btn">
              ← Back to Matches
            </button>
          </div>
        </div>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit} className="match-form">
          {/* Basic Information */}
          <div className="form-section">
            <h3>📋 Basic Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Season *</label>
                <input
                  type="number"
                  name="season"
                  value={formData.season}
                  onChange={handleChange}
                  placeholder="e.g., 2024"
                  required
                />
              </div>
              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Mumbai"
                />
              </div>
              <div className="form-group">
                <label>Match Type</label>
                <select name="match_type" value={formData.match_type} onChange={handleChange}>
                  <option value="League">League</option>
                  <option value="Qualifier 1">Qualifier 1</option>
                  <option value="Qualifier 2">Qualifier 2</option>
                  <option value="Eliminator">Eliminator</option>
                  <option value="Final">Final</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Venue *</label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                placeholder="Wankhede Stadium"
                required
              />
            </div>
          </div>

          {/* Teams */}
          <div className="form-section">
            <h3>🏆 Teams</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Team 1 *</label>
                <input
                  type="text"
                  name="team1"
                  value={formData.team1}
                  onChange={handleChange}
                  placeholder="Mumbai Indians"
                  required
                />
              </div>
              <div className="form-group">
                <label>Team 2 *</label>
                <input
                  type="text"
                  name="team2"
                  value={formData.team2}
                  onChange={handleChange}
                  placeholder="Chennai Super Kings"
                  required
                />
              </div>
            </div>
          </div>

          {/* Toss */}
          <div className="form-section">
            <h3>🪙 Toss</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Toss Winner</label>
                <input
                  type="text"
                  name="toss_winner"
                  value={formData.toss_winner}
                  onChange={handleChange}
                  placeholder="Same as Team 1 or Team 2"
                />
              </div>
              <div className="form-group">
                <label>Toss Decision</label>
                <select name="toss_decision" value={formData.toss_decision} onChange={handleChange}>
                  <option value="bat">Bat</option>
                  <option value="field">Field</option>
                </select>
              </div>
            </div>
          </div>

          {/* Result */}
          <div className="form-section">
            <h3>🏅 Result</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Winner</label>
                <input
                  type="text"
                  name="winner"
                  value={formData.winner}
                  onChange={handleChange}
                  placeholder="Same as Team 1 or Team 2"
                />
              </div>
              <div className="form-group">
                <label>Result Type</label>
                <select name="result" value={formData.result} onChange={handleChange}>
                  <option value="runs">Runs</option>
                  <option value="wickets">Wickets</option>
                  <option value="no result">No Result</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Result Margin</label>
                <input
                  type="number"
                  name="result_margin"
                  value={formData.result_margin}
                  onChange={handleChange}
                  placeholder="e.g., 5 (runs or wickets)"
                />
              </div>
              <div className="form-group">
                <label>Super Over</label>
                <select name="super_over" value={formData.super_over} onChange={handleChange}>
                  <option value="N">No</option>
                  <option value="Y">Yes</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Target Runs</label>
                <input
                  type="number"
                  name="target_runs"
                  value={formData.target_runs}
                  onChange={handleChange}
                  placeholder="Optional"
                />
              </div>
              <div className="form-group">
                <label>Target Overs</label>
                <input
                  type="number"
                  step="0.1"
                  name="target_overs"
                  value={formData.target_overs}
                  onChange={handleChange}
                  placeholder="Optional"
                />
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="form-section">
            <h3>ℹ️ Additional Information</h3>
            <div className="form-group">
              <label>Player of the Match</label>
              <input
                type="text"
                name="player_of_match"
                value={formData.player_of_match}
                onChange={handleChange}
                placeholder="Player Name"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Umpire 1</label>
                <input
                  type="text"
                  name="umpire1"
                  value={formData.umpire1}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Umpire 2</label>
                <input
                  type="text"
                  name="umpire2"
                  value={formData.umpire2}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Method</label>
              <input
                type="text"
                name="method"
                value={formData.method}
                onChange={handleChange}
                placeholder="e.g., D/L method, Super Over"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Adding Match...' : '✅ Add Match'}
            </button>
            <button type="button" onClick={() => navigate('/admin/matches')} className="cancel-btn">
              ❌ Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddMatch;