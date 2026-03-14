import React, { useState, useEffect } from 'react';
import { getTossImpact, getVenueStats } from '../services/api';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { motion } from 'framer-motion';
import Loader from '../components/Loader';
import { getVenueDetails } from '../services/api';
import './Analytics.css';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Analytics = () => {
    const [tossData, setTossData] = useState(null);
    const [venueData, setVenueData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [venueStats, setVenueStats] = useState([]);
    const [selectedVenue, setSelectedVenue] = useState(null);
    const [venueLoading, setVenueLoading] = useState(false);//sd
    const [venueError, setVenueError] = useState(null);//sd

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            setError(null);

            const [tossResponse, venueStatsResponse, venueDetailsResponse] = await Promise.all([
                getTossImpact(),
                getVenueStats(),
                getVenueDetails()
            ]);

            setTossData(tossResponse.data.data);
            setVenueData(venueStatsResponse.data.data.slice(0, 10)); // Top 10 venues
            setVenueStats(venueDetailsResponse.data.data.slice(0, 2));
        } catch (err) {
            console.error('Error fetching analytics:', err);
            setError('Failed to load analytics. Please try again.');
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
                    <button onClick={fetchAnalytics} className="retry-btn">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Toss Impact Chart Data
    const tossChartData = {
        labels: tossData?.map(d => d.toss_decision?.toLowerCase() === 'bat' ? 'Bat First' : 'Field First') || [],
        datasets: [
            {
                label: 'Win Percentage',
                data: tossData?.map(d => parseFloat(d.toss_win_percentage)) || [],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.6)',   // accent-primary equivalent
                    'rgba(16, 185, 129, 0.6)',  // accent-secondary equivalent
                ],
                borderColor: [
                    '#3B82F6',
                    '#10B981',
                ],
                borderWidth: 2,
                borderRadius: 4,
            },
        ],
    };

    // Venue Chart Data
    const venueChartData = {
        labels: venueData.map(v => v.venue_name || v.venue || 'Unknown'),
        datasets: [
            {
                label: 'Matches Hosted',
                data: venueData.map(v => v.matches_hosted || v.total_matches || 0),
                backgroundColor: 'rgba(59, 130, 246, 0.6)',
                borderColor: '#3B82F6',
                borderWidth: 2,
                borderRadius: 4,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        color: '#9CA3AF',
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#F3F4F6',
                    font: { family: "'Inter', sans-serif" }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                titleColor: '#F3F4F6',
                bodyColor: '#D1D5DB',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
            }
        },
        scales: {
            x: {
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#9CA3AF', font: { family: "'Rajdhani', sans-serif" } }
            },
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#9CA3AF', font: { family: "'Rajdhani', sans-serif" } }
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
            <motion.div
                className="analytics-header"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
            >
                <h1>📊 Analytics Dashboard</h1>
                <p>Statistical insights and trends</p>
            </motion.div>

            {/* Toss Impact Section */}
            <motion.div
                className="analytics-section"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <h2>🎯 Toss Impact Analysis</h2>
                <p className="section-description">
                    Win percentage when batting or fielding first after winning toss
                </p>

                <div className="chart-container">
                    <Bar data={tossChartData} options={chartOptions} />
                </div>

                <div className="toss-stats">
                    {tossData?.map((item, index) => (
                        <div key={index} className="stat-box">
                            <h3>{item.toss_decision?.toLowerCase() === 'bat' ? '🏏 Bat First' : '⚾ Field First'}</h3>
                            <div className="stat-number">{parseFloat(item.toss_win_percentage).toFixed(1)}%</div>
                            <p>{item.total_matches} total matches</p>
                            <p>{item.toss_win_matches} wins after toss</p>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Venue Statistics Section */}
            <motion.div
                className="analytics-section"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <h2>🏟️ Top Venues by Matches Hosted</h2>
                <p className="section-description">
                    Most popular IPL venues
                </p>

                <div className="chart-container">
                    <Bar data={venueChartData} options={chartOptions} />
                </div>
            </motion.div>
            {/* Venue Details Section - NEW */}
            <motion.div
                className="analytics-section"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <h2>🏟️ Detailed Venue Analytics</h2>
                <div className="venue-details-grid">
                    {venueStats.slice(0, 10).map((venue) => (
                        <div key={venue.venue_id} className="venue-detail-card">
                            <div className="venue-header">
                                <h3>{venue.venue_name}</h3>
                                <span className={`pitch-badge ${venue.pitch_type?.toLowerCase()}`}>
                                    {venue.pitch_type || 'Unknown'}
                                </span>
                            </div>

                            <div className="venue-location">
                                <span>📍 {venue.city}, {venue.state}</span>
                                {venue.country && <span className="country-tag">{venue.country}</span>}
                            </div>

                            <div className="venue-stats-mini">
                                <div className="stat-mini-item">
                                    <span className="stat-label">Capacity</span>
                                    <span className="stat-value">
                                        {venue.capacity ? venue.capacity.toLocaleString() : 'N/A'}
                                    </span>
                                </div>
                                <div className="stat-mini-item">
                                    <span className="stat-label">Matches</span>
                                    <span className="stat-value">{venue.total_matches}</span>
                                </div>
                                <div className="stat-mini-item">
                                    <span className="stat-label">Seasons</span>
                                    <span className="stat-value">{venue.seasons_hosted || 0}</span>
                                </div>
                            </div>

                            <div className="venue-avg-score">
                                <span className="score-label">Average Target Score</span>
                                <span className="score-value">
                                    {venue.avg_target_runs ? Math.round(venue.avg_target_runs) : 'N/A'}
                                </span>
                            </div>

                            <div className="venue-win-stats">
                                <div className="win-stat">
                                    <span className="win-label">Bat First Wins</span>
                                    <div className="win-bar">
                                        <div
                                            className="win-bar-fill bat-first"
                                            style={{ width: `${venue.batting_first_win_percentage || 0}%` }}
                                        >
                                            {venue.batting_first_win_percentage || 0}%
                                        </div>
                                    </div>
                                </div>
                                <div className="win-stat">
                                    <span className="win-label">Chasing Wins</span>
                                    <div className="win-bar">
                                        <div
                                            className="win-bar-fill chasing"
                                            style={{ width: `${venue.chasing_win_percentage || 0}%` }}
                                        >
                                            {venue.chasing_win_percentage || 0}%
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {venue.seasons_list && (
                                <div className="seasons-hosted">
                                    <span className="seasons-label">Seasons:</span>
                                    <span className="seasons-value">{venue.seasons_list}</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Analytics;