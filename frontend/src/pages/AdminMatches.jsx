import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import axios from 'axios';
import './AdminMatches.css';

const AdminMatches = ({ setIsAdmin, theme, toggleTheme }) => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [seasonFilter, setSeasonFilter] = useState('');
  const [teamFilter, setTeamFilter] = useState('');

  useEffect(() => {
    checkAuth();
    fetchMatches();
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

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        'http://localhost:5000/api/admin/matches',
        {
          params: {
            season: seasonFilter,
            team: teamFilter,
            limit: 100
          },
          withCredentials: true
        }
      );
      setMatches(response.data.data);
    } catch (err) {
      setError('Failed to fetch matches');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    fetchMatches();
  };

  const handleDelete = async (id) => {
    // Confirmation dialog
    const confirmDelete = window.confirm(
      '⚠️ Are you sure you want to delete this match?\n\n' +
      'This action will:\n' +
      '• Permanently delete the match\n' +
      '• Recalculate the points table\n' +
      '• Cannot be undone\n\n' +
      'Click OK to confirm deletion.'
    );

    if (!confirmDelete) {
      return; // User cancelled
    }

    try {
      // Show loading state
      console.log('Deleting match ID:', id);

      const response = await axios.delete(
        `http://localhost:5000/api/admin/matches/${id}`,
        { withCredentials: true }
      );

      console.log('Delete response:', response.data);

      // Show success message
      if (response.data.success) {
        alert('✅ Match deleted successfully! Points table updated.');
        // Refresh the matches list
        fetchMatches();
      }
    } catch (err) {
      console.error('Delete error:', err);

      // Show detailed error
      const errorMessage = err.response?.data?.message || err.message || 'Unknown error';
      alert(`❌ Failed to delete match:\n${errorMessage}`);
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
          <h1>Matches Management</h1>
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
            <button
              onClick={() => navigate('/admin/matches/add')}
              className="add-btn"
            >
              ➕ Add New Match
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <input
            type="text"
            placeholder="Filter by season (e.g., 2024)"
            value={seasonFilter}
            onChange={(e) => setSeasonFilter(e.target.value)}
            className="filter-input"
          />
          <input
            type="text"
            placeholder="Filter by team name"
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
            className="filter-input"
          />
          <button onClick={handleFilter} className="filter-btn">
            🔍 Apply Filters
          </button>
          <button
            onClick={() => {
              setSeasonFilter('');
              setTeamFilter('');
              fetchMatches();
            }}
            className="clear-btn"
          >
            ✖️ Clear
          </button>
        </div>

        {/* Matches Table */}
        {loading ? (
          <div className="loading">Loading matches...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <div className="table-container">
            <table className="matches-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Season</th>
                  <th>Date</th>
                  <th>Team 1</th>
                  <th>Team 2</th>
                  <th>Winner</th>
                  <th>Venue</th>
                  <th>Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {matches.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center' }}>
                      No matches found
                    </td>
                  </tr>
                ) : (
                  matches.map((match) => (
                    <tr key={match.id}>
                      <td>{match.id}</td>  {/* Make sure this line exists */}
                      <td>{match.season}</td>
                      <td>{new Date(match.date).toLocaleDateString()}</td>
                      <td>{match.team1}</td>
                      <td>{match.team2}</td>
                      <td className="winner-cell">{match.winner || 'N/A'}</td>
                      <td>{match.venue}</td>
                      <td>{match.match_type || 'League'}</td>
                      <td className="actions-cell">
                        <button
                          onClick={() => navigate(`/admin/matches/edit/${match.id}`)}
                          className="edit-btn-small"
                          title="Edit Match"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(match.id)}
                          className="delete-btn-small"
                          title="Delete Match"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMatches;