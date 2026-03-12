import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTeamById, getTeamStats, getTeamHistory, getTeamBestSeason } from '../services/api';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import Loader from '../components/Loader';
import TeamLogo from '../components/TeamLogo';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import './TeamDetail.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TeamDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [team, setTeam] = useState(null);
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [bestSeason, setBestSeason] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  fetchTeamData();
}, [fetchTeamData]);

  const fetchTeamData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [teamRes, statsRes, historyRes, bestSeasonRes] = await Promise.all([
        getTeamById(id),
        getTeamStats(id),
        getTeamHistory(id),
        getTeamBestSeason(id)
      ]);

      setTeam(teamRes.data.data);
      setStats(statsRes.data.data);
      setHistory(historyRes.data.data);
      setBestSeason(bestSeasonRes.data.data);
    } catch (err) {
      console.error('Error fetching team data:', err);
      setError('Failed to load team details. Please try again.');
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
          <button onClick={() => navigate('/teams')} className="retry-btn">
            Back to Teams
          </button>
        </div>
      </div>
    );
  }

  // Chart data for historical performance
  const chartData = {
    labels: history.map(h => h.year),
    datasets: [
      {
        label: 'Win Percentage',
        data: history.map(h => h.cumulative_win_percentage),
        borderColor: '#3B82F6', // accent-primary
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        pointBackgroundColor: '#10B981', // accent-secondary
        pointBorderColor: 'rgba(255,255,255,0.5)',
        pointBorderWidth: 2,
        pointRadius: 4,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    color: '#9CA3AF', // text-secondary
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#F3F4F6', // text-primary
          font: {
            family: "'Inter', sans-serif"
          }
        }
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#F3F4F6',
        bodyColor: '#D1D5DB',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 10,
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: '#9CA3AF',
          font: { family: "'Rajdhani', sans-serif" }
        }
      },
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: '#9CA3AF',
          font: { family: "'Rajdhani', sans-serif" },
          callback: function (value) {
            return value + '%';
          }
        }
      },
    },
  };

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button onClick={() => navigate('/teams')} className="back-btn" style={{ background: 'transparent', border: '1px solid var(--surface-border)', color: 'var(--text-secondary)', padding: '0.5rem 1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', cursor: 'pointer', fontFamily: "'Rajdhani', sans-serif", fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>
        <ArrowLeft size={18} /> Back to Teams
      </button>

      {/* Team Header */}
      <motion.div
        className="team-detail-header"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="team-logo-wrapper">
          <TeamLogo teamName={team?.team_name} size="large" />
        </div>
        <h1>{team?.team_name}</h1>
        <p className="home-ground">🏟️ {team?.home_ground || 'N/A'}</p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        className="stats-grid"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="stat-card">
          <h3>Total Matches</h3>
          <div className="stat-value">{stats?.total_matches || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Total Wins</h3>
          <div className="stat-value wins">{stats?.total_wins || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Win Percentage</h3>
          <div className="stat-value">{stats?.win_percentage || 0}%</div>
        </div>
        <div className="stat-card">
          <h3>Total Points</h3>
          <div className="stat-value">{stats?.total_points || 0}</div>
        </div>
      </motion.div>

      {/* Best Season */}
      {bestSeason && (
        <motion.div
          className="best-season-section"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2>🏆 Best Season</h2>
          <div className="best-season-card">
            <div className="season-year-large">{bestSeason.year}</div>
            <div className="season-stats">
              <div className="season-stat">
                <span className="label">Matches</span>
                <span className="value">{bestSeason.matches_played}</span>
              </div>
              <div className="season-stat">
                <span className="label">Wins</span>
                <span className="value">{bestSeason.wins}</span>
              </div>
              <div className="season-stat">
                <span className="label">Points</span>
                <span className="value">{bestSeason.points}</span>
              </div>
              <div className="season-stat">
                <span className="label">NRR</span>
                <span className="value">{bestSeason.net_run_rate}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Historical Performance Chart */}
      <motion.div
        className="chart-section"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h2>📈 Historical Performance</h2>
        <div className="chart-container-large">
          <Line data={chartData} options={chartOptions} />
        </div>
      </motion.div>

      {/* Year-by-Year Stats Table */}
      <motion.div
        className="history-section"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h2>📊 Season-by-Season Performance</h2>
        <div className="history-table-container">
          <table className="history-table">
            <thead>
              <tr>
                <th>Year</th>
                <th>Cumulative Matches</th>
                <th>Cumulative Wins</th>
                <th>Win %</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, index) => (
                <motion.tr
                  key={h.year}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + (index * 0.05) }}
                >
                  <td className="year-cell">{h.year}</td>
                  <td>{h.cumulative_matches_played}</td>
                  <td className="wins-cell">{h.cumulative_wins}</td>
                  <td className="percentage-cell">{h.cumulative_win_percentage}%</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TeamDetail;