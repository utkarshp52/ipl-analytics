import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = ({ setIsAdmin, theme, toggleTheme }) => {
    const navigate = useNavigate();
    const adminUsername = localStorage.getItem('adminUsername');

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
                localStorage.removeItem('isAdmin');
                localStorage.removeItem('adminUsername');
                setIsAdmin(false);
                navigate('/admin/login');
            }
        } catch (error) {
            navigate('/admin/login');
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
            console.error('Logout failed:', error);
        }
    };

    return (
        <div className="admin-dashboard">
            <div className="admin-sidebar">
                <div className="sidebar-header">
                    <h2>IPL Admin</h2>
                </div>

                <nav className="sidebar-nav">
                    <Link to="/admin/dashboard" className="nav-item active">
                        📊 Dashboard
                    </Link>
                    <Link to="/admin/matches" className="nav-item">
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

            <div className="admin-main">
                <div className="admin-header">
                    <h1>Admin Dashboard</h1>
                    <div className="header-actions">
                        {/* eslint-disable-next-line */}
                        {/* <button
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
                        </button> */}
                        <div className="admin-user">
                            Welcome, <strong>{adminUsername}</strong>
                        </div>
                    </div>
                </div>
                <div className="quick-actions">
                    <h2>Quick Actions</h2>
                    <div className="actions-grid">
                        <Link to="/admin/matches/add" className="action-card">
                            ➕ Add New Match
                        </Link>
                        <Link to="/admin/matches" className="action-card">
                            🏏 View All Matches
                        </Link>
                        <div className="action-card disabled-card">
                            ➕ Add New Team (Soon)
                        </div>
                        <div className="action-card disabled-card">
                            ➕ Add New Season (Soon)
                        </div>
                    </div>
                </div>
                <div className="dashboard-content">
                    <div className="stats-grid">
                        <div className="stat-card">
                            <h3>Total Seasons</h3>
                            <p className="stat-number">16</p>
                        </div>
                        <div className="stat-card">
                            <h3>Total Teams</h3>
                            <p className="stat-number">12</p>
                        </div>
                        <div className="stat-card">
                            <h3>Total Matches</h3>
                            <p className="stat-number">1000+</p>
                        </div>
                        <div className="stat-card">
                            <h3>Total Venues</h3>
                            <p className="stat-number">45</p>
                        </div>
                    </div>

                    <div className="info-box">
                        <h2>🚀 Admin Panel</h2>
                        <p>Welcome to the IPL Analytics Admin Panel. This is Phase 1 - Basic Authentication.</p>
                        <p><strong>What's working:</strong></p>
                        <ul>
                            <li>✅ Secure login/logout</li>
                            <li>✅ Session management</li>
                            <li>✅ Protected routes</li>
                            <li>✅ Add/Edit/Delete Matches</li>
                        </ul>
                        <p><strong>Coming in Phase 2:</strong></p>
                        <ul>

                            <li>⏳ Manage Teams</li>
                            <li>⏳ Manage Seasons</li>
                            <li>⏳ Manage Venues</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;