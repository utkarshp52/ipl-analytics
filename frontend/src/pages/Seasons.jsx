import React, { useState, useEffect } from 'react';
import { getAllSeasons } from '../services/api';
import Loader from '../components/Loader';
import './Seasons.css';
import { useNavigate } from 'react-router-dom';

const Seasons = () => {
    const navigate = useNavigate();
    const [seasons, setSeasons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchSeasons();
    }, [fetchSeasons]);

    const fetchSeasons = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getAllSeasons();
            setSeasons(response.data.data);
        } catch (err) {
            console.error('Error fetching seasons:', err);
            setError('Failed to load seasons. Please try again.');
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
                    <button onClick={fetchSeasons} className="retry-btn">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="seasons-header">
                <h1>🏏 IPL Seasons</h1>
                <p>Explore season-wise data and award winners</p>
            </div>

            <div className="seasons-grid">
                {seasons.map((season) => (
                    <div key={season.season_id} className="season-card">
                        <div className="season-year">
                            <h2>{season.year}</h2>
                            <span className="season-badge">Season {season.season_id}</span>
                        </div>

                        <div className="awards-section">
                            <h3>🏆 Awards</h3>

                            <div className="award">
                                <span className="award-label">🏏 Orange Cap</span>
                                <span className="award-winner">{season.orange_cap || 'N/A'}</span>
                            </div>

                            <div className="award">
                                <span className="award-label">🥎 Purple Cap</span>
                                <span className="award-winner">{season.purple_cap || 'N/A'}</span>
                            </div>

                            <div className="award">
                                <span className="award-label">� Player of Series</span>
                                <span className="award-winner">{season.player_of_series || 'N/A'}</span>
                            </div>
                        </div>

                        <button
                            className="view-details-btn"
                            onClick={() => navigate(`/season/${season.year}`)}
                        >
                            View Details
                        </button>
                    </div>
                ))}
            </div>

            {seasons.length === 0 && (
                <div className="no-data">
                    <p>No seasons data available</p>
                </div>
            )}
        </div>
    );
};

export default Seasons;