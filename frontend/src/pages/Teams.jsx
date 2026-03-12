import React, { useState, useEffect } from 'react';
import { getAllTeams } from '../services/api';
import Loader from '../components/Loader';
import TeamLogo from '../components/TeamLogo';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin } from 'lucide-react';
import './Teams.css';

const Teams = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllTeams();
      setTeams(response.data.data);
    } catch (err) {
      console.error('Error fetching teams:', err);
      setError('Failed to load teams. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter teams based on search
  const filteredTeams = teams.filter(team =>
    team.team_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="page-container">
        <div className="error-message">
          <h2>⚠️ {error}</h2>
          <button onClick={fetchTeams} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="teams-header">
        <h1>🏆 IPL Teams</h1>
        <p>All {teams.length} IPL franchises</p>
      </div>

      <div className="search-container glass-panel">
        <Search className="search-icon" size={20} />
        <input
          type="text"
          placeholder="Search franchises..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <motion.div
        className="teams-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {filteredTeams.map((team, index) => (
          <motion.div
            key={team.team_id}
            className="team-card glass-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -5 }}
          >
            <div className="team-icon-wrapper">
              <TeamLogo teamName={team.team_name} size="large" />
            </div>

            <h3 className="team-name rajdhani">{team.team_name}</h3>

            <div className="team-info">
              <div className="info-item">
                <MapPin size={16} className="info-icon" />
                <span className="info-value">{team.home_ground || 'Venue Unknown'}</span>
              </div>
            </div>

            <button
              className="team-details-btn"
              onClick={() => navigate(`/teams/${team.team_id}`)}
            >
              View Statistics
            </button>
          </motion.div>
        ))}
      </motion.div>

      {filteredTeams.length === 0 && (
        <div className="no-data">
          <p>No teams found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
};

export default Teams;