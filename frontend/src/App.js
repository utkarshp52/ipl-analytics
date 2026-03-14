import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Seasons from './pages/Seasons';
import SeasonDetail from './pages/SeasonDetail';
import Teams from './pages/Teams';
import TeamDetail from './pages/TeamDetail';
import Analytics from './pages/Analytics';
import OverallRanking from './pages/OverallRanking';
import HeadToHead from './pages/HeadtoHead';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminMatches from './pages/AdminMatches';
import AdminAddMatch from './pages/AdminAddMatch';
import AdminEditMatch from './pages/AdminEditMatch';
import './App.css';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  // Apply theme on mount and when it changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    // Check if user is logged in as admin
    const adminStatus = localStorage.getItem('isAdmin');
    if (adminStatus === 'true') {
      setIsAdmin(true);
    }
  }, []);

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (!isAdmin) {
      return <Navigate to="/admin/login" replace />;
    }
    return children;
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Admin Routes */}
          <Route
            path="/admin/login"
            element={<AdminLogin setIsAdmin={setIsAdmin} />}
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard setIsAdmin={setIsAdmin} theme={theme} toggleTheme={toggleTheme} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/matches"
            element={
              <ProtectedRoute>
                <AdminMatches setIsAdmin={setIsAdmin} theme={theme} toggleTheme={toggleTheme} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/matches/add"
            element={
              <ProtectedRoute>
                <AdminAddMatch setIsAdmin={setIsAdmin} theme={theme} toggleTheme={toggleTheme} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/matches/edit/:id"
            element={
              <ProtectedRoute>
                <AdminEditMatch setIsAdmin={setIsAdmin} theme={theme} toggleTheme={toggleTheme} />
              </ProtectedRoute>
            }
          />
          {/* Public Routes */}
          <Route path="/*" element={
            <>
              <Navbar theme={theme} toggleTheme={toggleTheme} />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/seasons" element={<Seasons />} />
                  <Route path="/seasons/:id" element={<SeasonDetail />} />
                  <Route path="/teams" element={<Teams />} />
                  <Route path="/teams/:id" element={<TeamDetail />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/ranking" element={<OverallRanking />} />
                  <Route path="/head-to-head" element={<HeadToHead />} />
                </Routes>
              </main>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;