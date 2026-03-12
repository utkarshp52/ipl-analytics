import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { ChevronRight, Trophy, Target, BarChart3, MapPin } from 'lucide-react';
import { getAllSeasons, getOverallRanking, getFinalMatches } from '../services/api';
import TeamLogo from '../components/TeamLogo';
import './Home.css';

const Home = () => {
    const [latestSeason, setLatestSeason] = useState(null);
    const [topTeams, setTopTeams] = useState([]);
    const [recentFinals, setRecentFinals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHomeData();
    }, [fetchHomeData]);

    const fetchHomeData = async () => {
        try {
            const [seasonsRes, rankingsRes, finalsRes] = await Promise.all([
                getAllSeasons(),
                getOverallRanking(),
                getFinalMatches()
            ]);

            setLatestSeason(seasonsRes.data.data[0]);
            setTopTeams(rankingsRes.data.data.slice(0, 3));
            setRecentFinals(finalsRes.data.data.slice(0, 3));
        } catch (err) {
            console.error('Error fetching home data:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="home loading-state">
                <div className="loader"></div>
            </div>
        );
    }

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    // const itemVariants = {
    //     hidden: { y: 20, opacity: 0 },
    //     visible: { y: 0, opacity: 1 }
    // };

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="hero-title"
                    >
                        THE ULTIMATE <br /> IPL DASHBOARD
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="hero-subtitle"
                    >
                        Comprehensive match data, historical stats, and predictive analytics for the world's biggest cricket league.
                    </motion.p>

                    {latestSeason && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="latest-season-badge glass-panel"
                        >
                            <span>LIVE DATA: IPL {latestSeason.year}</span>
                        </motion.div>
                    )}

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="hero-actions"
                    >
                        <Link to="/seasons" className="hero-btn primary auto-glow">
                            Explore Seasons <ChevronRight size={18} />
                        </Link>
                        <Link to="/head-to-head" className="hero-btn secondary">
                            Compare Teams
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Quick Navigation Features */}
            <section className="features-wrapper">
                <motion.div
                    className="features"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <Link to="/seasons" className="feature-card glass-panel">
                        <BarChart3 className="feature-icon" size={36} />
                        <h3>Season Analytics</h3>
                        <p>Deep dive into year-by-year team performance and player awards.</p>
                    </Link>

                    <Link to="/ranking" className="feature-card glass-panel featured">
                        <Trophy className="feature-icon gold" size={36} />
                        <h3>Team Rankings</h3>
                        <p>View the definitive all-time leaderboard of IPL franchises.</p>
                    </Link>

                    <Link to="/analytics" className="feature-card glass-panel">
                        <Target className="feature-icon" size={36} />
                        <h3>Match Insights</h3>
                        <p>Advanced metrics unearthing toss impacts and venue supremacy.</p>
                    </Link>
                </motion.div>
            </section>

            <div className="dashboard-grid">
                {/* Top Teams Section */}
                <section className="home-section top-teams">
                    <div className="section-header">
                        <h2>🥇 DOMINANT FRANCHISES</h2>
                        <Link to="/ranking" className="view-all-link">Full Rankings <ChevronRight size={16} /></Link>
                    </div>

                    <div className="top-teams-cards">
                        {topTeams.map((team, index) => (
                            <Tilt
                                key={team.team_id}
                                tiltMaxAngleX={10}
                                tiltMaxAngleY={10}
                                scale={1.02}
                                transitionSpeed={2500}
                                className={`team-tilt-wrapper rank-${index + 1}`}
                            >
                                <div className="premium-team-card glass-panel">
                                    <div className="card-glare"></div>
                                    <div className="rank-indicator">
                                        {index === 0 && '🥇'}
                                        {index === 1 && '🥈'}
                                        {index === 2 && '🥉'}
                                    </div>
                                    <div className="card-logo-wrapper">
                                        <TeamLogo teamName={team.team_name} size="large" />
                                    </div>
                                    <h3>{team.team_name}</h3>

                                    <div className="team-stats-grid">
                                        <div className="stat-box">
                                            <span className="stat-number">{team.total_wins}</span>
                                            <span className="stat-label">WINS</span>
                                        </div>
                                        <div className="stat-divider"></div>
                                        <div className="stat-box">
                                            <span className="stat-number">{team.win_percentage}%</span>
                                            <span className="stat-label">WIN RATE</span>
                                        </div>
                                    </div>

                                    <Link to={`/teams/${team.team_id}`} className="card-action-btn">
                                        Team Stats
                                    </Link>
                                </div>
                            </Tilt>
                        ))}
                    </div>
                </section>

                {/* Sidebar Info */}
                <div className="home-sidebar">
                    {/* Recent Finals */}
                    <section className="home-section recent-finals glass-panel">
                        <h2>🏆 RECENT FINALS</h2>
                        <div className="finals-timeline">
                            {recentFinals.map((final) => (
                                <div key={final.match_id} className="timeline-item">
                                    <div className="timeline-year">{final.season}</div>
                                    <div className="timeline-content">
                                        <div className="matchup-row">
                                            <span className={`team-name ${final.winner === final.team1 ? 'winner' : ''}`}>{final.team1}</span>
                                            <span className="vs">VS</span>
                                            <span className={`team-name ${final.winner === final.team2 ? 'winner' : ''}`}>{final.team2}</span>
                                        </div>
                                        <div className="venue-row">
                                            <MapPin size={12} /> {final.venue}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Quick Stats Grid */}
                    <section className="home-section quick-stats-sidebar">
                        <div className="stat-cube glass-panel">
                            <span className="rajdhani stat-number">1000+</span>
                            <span className="stat-label">Matches Played</span>
                        </div>
                        <div className="stat-cube glass-panel">
                            <span className="rajdhani stat-number">16</span>
                            <span className="stat-label">Epic Seasons</span>
                        </div>
                        <div className="stat-cube glass-panel">
                            <span className="rajdhani stat-number">15</span>
                            <span className="stat-label">Franchises</span>
                        </div>
                        <div className="stat-cube glass-panel">
                            <span className="rajdhani stat-number">40+</span>
                            <span className="stat-label">Venues</span>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Home;