const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Initializing express application
const app = express();

// Body parser middleware
app.use(express.json());

// Enable CORS
app.use(cors());

// Import routes
const seasonRoutes = require('./routes/seasons');
const teamRoutes = require('./routes/teams');
const matchRoutes = require('./routes/matches');
const analyticsRoutes = require('./routes/analytics');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

// Mount routes
app.use('/api/seasons', seasonRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'IPL Analytics API is running',
    timestamp: new Date().toISOString(),
    database: process.env.DB_NAME || 'ipl_management'
  });
});

// Root route - API documentation
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to IPL Analytics API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      documentation: {
        seasons: {
          all: '/api/seasons',
          byId: '/api/seasons/:id',
          points: '/api/seasons/:id/points',
          matches: '/api/seasons/:id/matches'
        },
        teams: {
          all: '/api/teams',
          byId: '/api/teams/:id',
          history: '/api/teams/:id/history',
          bestSeason: '/api/teams/:id/best-season',
          stats: '/api/teams/:id/stats'
        },
        matches: {
          all: '/api/matches',
          byId: '/api/matches/:id',
          superOvers: '/api/matches/super-overs',
          finals: '/api/matches/finals',
          highestMargins: '/api/matches/highest-margins'
        },
        analytics: {
          overallRanking: '/api/analytics/overall-ranking',
          tossImpact: '/api/analytics/toss-impact',
          venueStats: '/api/analytics/venue-stats',
          headToHead: '/api/analytics/head-to-head?team1=Mumbai&team2=Chennai',
          seasonAwards: '/api/analytics/season-awards',
          seasonRanking: '/api/analytics/season-ranking/:season_id',
          venues: '/api/analytics/venues',
          venueDetail: '/api/analytics/venue/:venue_id'
        }
      }
    },
    totalEndpoints: 22
  });
});

// Handle 404 Route Not Found
app.use((req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});