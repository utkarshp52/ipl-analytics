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

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            setError(null);

            const [tossResponse, venueResponse] = await Promise.all([
                getTossImpact(),
                getVenueStats()
            ]);

            setTossData(tossResponse.data.data);
            setVenueData(venueResponse.data.data.slice(0, 10)); // Top 10 venues
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
        </motion.div>
    );
};

export default Analytics;