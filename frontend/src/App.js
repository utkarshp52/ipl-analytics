import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Seasons from './pages/Seasons';
import Teams from './pages/Teams';
import Analytics from './pages/Analytics';
import OverallRanking from './pages/OverallRanking';
import './App.css';
import SeasonDetail from './pages/SeasonDetail';
import TeamDetail from './pages/TeamDetail';
import HeadtoHead from './pages/HeadtoHead';

function App() {
  // Theme Management
  const [theme, setTheme] = React.useState(() => {
    return localStorage.getItem('ipl-theme') || 'dark';
  });

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ipl-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <Router>
      <div className="App">
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/seasons" element={<Seasons />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/ranking" element={<OverallRanking />} />
            <Route path="/season/:id" element={<SeasonDetail />} />
            <Route path="/teams/:id" element={<TeamDetail />} />
            <Route path="/head-to-head" element={<HeadtoHead />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;