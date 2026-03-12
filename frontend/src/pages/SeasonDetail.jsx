import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSeasonById, getSeasonPoints, getSeasonMatches } from '../services/api';
import Loader from '../components/Loader';
import './SeasonDetail.css';

const SeasonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [season, setSeason] = useState(null);
  const [pointsTable, setPointsTable] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('points'); // 'points' or 'matches'

  useEffect(() => {
    fetchSeasonData();
  }, [id]);

  const fetchSeasonData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [seasonRes, pointsRes, matchesRes] = await Promise.all([
        getSeasonById(id),
        getSeasonPoints(id),
        getSeasonMatches(id)
      ]);

      setSeason(seasonRes.data.data);
      setPointsTable(pointsRes.data.data);
      setMatches(matchesRes.data.data);
    } catch (err) {
      console.error('Error fetching season data:', err);
      setError('Failed to load season details. Please try again.');
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
          <button onClick={() => navigate('/seasons')} className="retry-btn">
            Back to Seasons
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <button onClick={() => navigate('/seasons')} className="back-btn">
        ← Back to Seasons
      </button>

      {/* Season Header */}
      <div className="season-detail-header">
        <h1>IPL {season?.year}</h1>
        <div className="awards-grid">
          <div className="award-box">
            <span className="award-icon">🏏</span>
            <h3>Orange Cap</h3>
            <p>{season?.orange_cap || 'N/A'}</p>
          </div>
          <div className="award-box">
            <span className="award-icon">🥎</span>
            <h3>Purple Cap</h3>
            <p>{season?.purple_cap || 'N/A'}</p>
          </div>
          <div className="award-box">
            <span className="award-icon">�</span>
            <h3>Player of Series</h3>
            <p>{season?.player_of_series || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'points' ? 'active' : ''}`}
          onClick={() => setActiveTab('points')}
        >
          📊 Points Table
        </button>
        <button 
          className={`tab ${activeTab === 'matches' ? 'active' : ''}`}
          onClick={() => setActiveTab('matches')}
        >
          🏏 Matches ({matches.length})
        </button>
      </div>

      {/* Points Table Tab */}
      {activeTab === 'points' && (
        <div className="tab-content">
          <div className="points-table-container">
            <table className="points-table">
              <thead>
                <tr>
                  <th>Position</th>
                  <th>Team</th>
                  <th>Played</th>
                  <th>Won</th>
                  <th>Lost</th>
                  <th>Points</th>
                  <th>NRR</th>
                </tr>
              </thead>
              <tbody>
                {pointsTable.map((team, index) => (
                  <tr key={team.team_id} className={index === 0 ? 'winner' : ''}>
                    <td className="position">
                      {index === 0 ? '🏆' : index + 1}
                    </td>
                    <td className="team-name">{team.team_name}</td>
                    <td>{team.matches_played}</td>
                    <td className="wins">{team.wins}</td>
                    <td>{team.losses}</td>
                    <td className="points">{team.points}</td>
                    <td className={team.net_run_rate >= 0 ? 'positive' : 'negative'}>
                      {team.net_run_rate >= 0 ? '+' : ''}{team.net_run_rate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Matches Tab */}
      {activeTab === 'matches' && (
        <div className="tab-content">
          <div className="matches-grid">
            {matches.map((match) => (
              <div key={match.match_id} className="match-card">
                <div className="match-header">
                  <span className="match-type">{match.match_type}</span>
                  <span className="match-date">{new Date(match.date).toLocaleDateString()}</span>
                </div>
                
                <div className="match-teams">
                  <div className={`team ${match.winner === match.team1 ? 'winner-team' : ''}`}>
                    <span className="team-name">{match.team1}</span>
                    {match.winner === match.team1 && <span className="winner-badge">✓</span>}
                  </div>
                  
                  <div className="vs">VS</div>
                  
                  <div className={`team ${match.winner === match.team2 ? 'winner-team' : ''}`}>
                    <span className="team-name">{match.team2}</span>
                    {match.winner === match.team2 && <span className="winner-badge">✓</span>}
                  </div>
                </div>

                <div className="match-info">
                  <p className="venue">📍 {match.venue}, {match.city}</p>
                  {match.result_margin && (
                    <p className="result">
                      Won by {match.result_margin} {match.result === 'runs' ? 'runs' : 'wickets'}
                    </p>
                  )}
                  {match.super_over === 'Y' && (
                    <span className="super-over-badge">⚡ SUPER OVER</span>
                  )}
                </div>

                {match.player_of_match && (
                  <div className="player-of-match">
                    🌟 {match.player_of_match}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SeasonDetail;