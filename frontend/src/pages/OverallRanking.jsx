import React, { useState, useEffect } from 'react';
import { getOverallRanking } from '../services/api';
import Loader from '../components/Loader';
import TeamLogo from '../components/TeamLogo';
import { motion } from 'framer-motion';
import './OverallRanking.css';

const OverallRanking = () => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRankings();
  }, []);

  const fetchRankings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getOverallRanking();
      setRankings(response.data.data);
    } catch (err) {
      console.error('Error fetching rankings:', err);
      setError('Failed to load rankings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="page-container">
        <div className="error-message">
          <h2>⚠️ {error}</h2>
          <button onClick={fetchRankings} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="ranking-header"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <h1>🏆 Overall Team Rankings</h1>
        <p>All-time IPL performance rankings based on total wins</p>
      </motion.div>

      <motion.div
        className="ranking-table-container"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <table className="ranking-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Team</th>
              <th>Matches</th>
              <th>Wins</th>
              <th>Losses</th>
              <th>Win %</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {rankings.map((team, index) => (
              <motion.tr
                key={team.team_id}
                className={index < 3 ? 'top-team' : ''}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + (index * 0.05) }}
              >
                <td className="rank-cell">
                  {index === 0 && '🥇'}
                  {index === 1 && '🥈'}
                  {index === 2 && '🥉'}
                  {index > 2 && (index + 1)}
                </td>
                <td className="team-name">
                  <div className="team-cell-content">
                    <TeamLogo teamName={team.team_name} size="small" />
                    <span>{team.team_name}</span>
                  </div>
                </td>
                <td>{team.total_matches}</td>
                <td className="wins">{team.total_wins}</td>
                <td>{team.total_losses}</td>
                <td className="win-percentage">{team.win_percentage}%</td>
                <td>{team.total_points}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      <motion.div
        className="stats-summary"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="stat-card">
          <h3>{rankings.length}</h3>
          <p>Total Teams</p>
        </div>
        <div className="stat-card">
          <h3>{rankings[0]?.team_name || 'N/A'}</h3>
          <p>Top Team</p>
        </div>
        <div className="stat-card">
          <h3>{rankings[0]?.win_percentage || 0}%</h3>
          <p>Best Win Rate</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OverallRanking;