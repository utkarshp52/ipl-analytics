import React, { useState, useEffect } from 'react';
import { getAllTeams, getHeadToHead } from '../services/api';
import Loader from '../components/Loader';
import TeamLogo from '../components/TeamLogo';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Swords, Trophy, Activity } from 'lucide-react';
import './HeadtoHead.css';

const HeadtoHead = () => {
  const [teams, setTeams] = useState([]);
  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');
  const [h2hData, setH2hData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const [expandedMatch, setExpandedMatch] = useState(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await getAllTeams();
      setTeams(response.data.data);
    } catch (err) {
      console.error('Error fetching teams:', err);
      setError('Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = async () => {
    if (!team1 || !team2) {
      alert('Please select both teams');
      return;
    }

    if (team1 === team2) {
      alert('Please select different teams');
      return;
    }

    try {
      setSearching(true);
      setError(null);

      // Get team names from IDs
      const team1Name = teams.find(t => t.team_id === parseInt(team1))?.team_name;
      const team2Name = teams.find(t => t.team_id === parseInt(team2))?.team_name;

      const response = await getHeadToHead(team1Name, team2Name);
      setH2hData(response.data.data);
    } catch (err) {
      console.error('Error fetching H2H:', err);
      setError('No head-to-head data found for these teams');
      setH2hData(null);
    } finally {
      setSearching(false);
    }
  };

  const handleReset = () => {
    setTeam1('');
    setTeam2('');
    setH2hData(null);
    setError(null);
  };

  if (loading) return <Loader />;

  const team1Data = teams.find(t => t.team_id === parseInt(team1));
  const team2Data = teams.find(t => t.team_id === parseInt(team2));

  // Calculate percentages
  const team1Wins = parseInt(h2hData?.team1_wins || 0, 10);
  const team2Wins = parseInt(h2hData?.team2_wins || 0, 10);
  const totalMatches = parseInt(h2hData?.total_matches || 0, 10);
  const team1Percentage = totalMatches > 0 ? ((team1Wins / totalMatches) * 100).toFixed(1) : 0;
  const team2Percentage = totalMatches > 0 ? ((team2Wins / totalMatches) * 100).toFixed(1) : 0;

  return (
    <div className="page-container">
      <div className="h2h-header">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Swords className="header-icon" /> Head-to-Head Showdown
        </motion.h1>
        <p>Analyze historically epic rivalries</p>
      </div>

      {/* Team Selector */}
      <motion.div
        className="team-selector-container glass-panel"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="team-select-box">
          <label>Select Team 1</label>
          <select
            value={team1}
            onChange={(e) => setTeam1(e.target.value)}
            className="team-select"
          >
            <option value="">-- Choose Team --</option>
            {teams.map(team => (
              <option key={team.team_id} value={team.team_id}>
                {team.team_name}
              </option>
            ))}
          </select>
          {team1Data && (
            <div className="selected-team-preview">
              <TeamLogo teamName={team1Data.team_name} size="small" />
              <span>{team1Data.team_name}</span>
            </div>
          )}
        </div>

        <div className="vs-divider">VS</div>

        <div className="team-select-box">
          <label>Select Team 2</label>
          <select
            value={team2}
            onChange={(e) => setTeam2(e.target.value)}
            className="team-select"
          >
            <option value="">-- Choose Team --</option>
            {teams.map(team => (
              <option key={team.team_id} value={team.team_id}>
                {team.team_name}
              </option>
            ))}
          </select>
          {team2Data && (
            <div className="selected-team-preview">
              <TeamLogo teamName={team2Data.team_name} size="small" />
              <span>{team2Data.team_name}</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Action Buttons */}
      < div className="action-buttons" >
        <button
          onClick={handleCompare}
          disabled={!team1 || !team2 || searching}
          className="compare-btn"
        >
          {searching ? 'Comparing...' : 'Compare Teams'}
        </button>
        <button onClick={handleReset} className="reset-btn">
          Reset
        </button>
      </div >

      {/* Error Message */}
      {
        error && (
          <div className="error-box">
            ⚠️ {error}
          </div>
        )
      }

      {/* Results */}
      <AnimatePresence mode="wait">
        {h2hData && !error && (
          <motion.div
            key={`${team1}-${team2}`}
            className="h2h-results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {/* Score Board */}
            <div className="scoreboard glass-panel">
              <div className={`team-score ${team1Wins > team2Wins ? 'winning' : ''}`}>
                <TeamLogo teamName={team1Data?.team_name} size="large" className="h2h-logo-large" />
                <h2>{team1Data?.team_name}</h2>
                <div className="score">{team1Wins}</div>
                <div className="wins-label">Wins</div>
              </div>

              <div className="score-divider">
                <div className="total-matches">
                  <span className="total-number">{totalMatches}</span>
                  <span className="total-label">Total Matches</span>
                </div>
              </div>

              <div className={`team-score ${team2Wins > team1Wins ? 'winning' : ''}`}>
                <TeamLogo teamName={team2Data?.team_name} size="large" className="h2h-logo-large" />
                <h2>{team2Data?.team_name}</h2>
                <div className="score">{team2Wins}</div>
                <div className="wins-label">Wins</div>
              </div>
            </div>

            {/* Win Percentage Bar */}
            <div className="percentage-section glass-panel">
              <h3>Win Percentage</h3>
              <div className="percentage-bar-container">
                <div className="percentage-labels">
                  <span>{team1Data?.team_name}</span>
                  <span>{team2Data?.team_name}</span>
                </div>
                <div className="percentage-bar">
                  <div
                    className="team1-bar"
                    style={{ width: `${team1Percentage}%` }}
                  >
                    {team1Percentage}%
                  </div>
                  <div
                    className="team2-bar"
                    style={{ width: `${team2Percentage}%` }}
                  >
                    {team2Percentage}%
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Stats */}
            <div className="detailed-stats glass-panel">
              <div className="stat-row">
                <div className="stat-item">
                  <span className="stat-label">Total Matches</span>
                  <span className="stat-value">{totalMatches}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">{team1Data?.team_name} Wins</span>
                  <span className="stat-value highlight-team1">{team1Wins}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">{team2Data?.team_name} Wins</span>
                  <span className="stat-value highlight-team2">{team2Wins}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">No Result</span>
                  <span className="stat-value">{h2hData.no_result || 0}</span>
                </div>
              </div>
            </div>

            {/* Winner Declaration */}
            <motion.div
              className="winner-declaration-wrapper"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              {team1Wins !== team2Wins && (
                <div className="winner-declaration glass-panel gradient-border">
                  <h3><Trophy size={24} className="trophy-icon" /> {team1Wins > team2Wins ? team1Data?.team_name : team2Data?.team_name}</h3>
                  <p>Dominates this rivalry with {Math.max(team1Wins, team2Wins)} wins!</p>
                </div>
              )}

              {team1Wins === team2Wins && (
                <div className="winner-declaration tied glass-panel">
                  <h3>🤝 Perfectly Balanced</h3>
                  <p>Both teams have equal wins in this rivalry!</p>
                </div>
              )}
            </motion.div>

            {/* Recent Encounters Section */}
            {h2hData.recent_matches && h2hData.recent_matches.length > 0 && (
              <div className="recent-encounters-section">
                <h3>Recent Encounters</h3>
                <div className="recent-matches-list">
                  {h2hData.recent_matches.map((match) => (
                    <div
                      key={match.match_id}
                      className={`recent-match-card ${expandedMatch === match.match_id ? 'expanded' : ''}`}
                      onClick={() => setExpandedMatch(expandedMatch === match.match_id ? null : match.match_id)}
                    >
                      <div className="match-card-header">
                        <div className="match-date-venue">
                          <span className="match-season">Season {match.season}</span>
                          <span className="match-date">{new Date(match.date).toLocaleDateString()}</span>
                          <span className="match-venue">{match.venue}, {match.city}</span>
                        </div>
                        <div className="match-score-summary">
                          <span className={match.winner === match.team1 ? 'winner-text' : ''}>{match.team1}</span>
                          <span className="vs-text">vs</span>
                          <span className={match.winner === match.team2 ? 'winner-text' : ''}>{match.team2}</span>
                        </div>
                        <div className="match-result-summary">
                          <strong>Winner: {match.winner}</strong>
                          <span className="margin-text">({match.result} by {match.result_margin})</span>
                        </div>
                        <div className="expand-indicator">
                          {expandedMatch === match.match_id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                      </div>

                      <AnimatePresence>
                        {expandedMatch === match.match_id && (
                          <motion.div
                            className="match-card-details"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="detail-row">
                              <span className="detail-label">Toss:</span>
                              <span className="detail-value">{match.toss_winner} won and decided to {match.toss_decision}</span>
                            </div>
                            {match.target_runs > 0 && (
                              <div className="detail-row">
                                <span className="detail-label">Target:</span>
                                <span className="detail-value">{match.target_runs} runs in {match.target_overs} overs</span>
                              </div>
                            )}
                            <div className="detail-row">
                              <span className="detail-label">Player of the Match:</span>
                              <span className="detail-value">🏆 {match.player_of_match}</span>
                            </div>
                            {match.super_over === 'Y' && (
                              <div className="detail-row super-over-row">
                                <span className="detail-value">🔥 Match ended in a Super Over!</span>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* No Data State */}
      {
        !h2hData && !error && team1 && team2 && !searching && (
          <div className="no-data-state">
            <p>Click "Compare Teams" to see head-to-head statistics</p>
          </div>
        )
      }
    </div >
  );
};

export default HeadtoHead;