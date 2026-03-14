const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');

// Load env vars
dotenv.config();

const { testConnection } = require('./config/database');

// Initializing express application
const app = express();

// Body parser middleware
app.use(express.json());

// Enable CORS
// app.use(cors());

// ... existing code ...

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Add this session configuration
app.use(session({
  secret: 'ipl-analytics-secret-key-2024', // Change this to a secure random string
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ... rest of your code ...
// Import routes
const seasonRoutes = require('./routes/seasons');
const teamRoutes = require('./routes/teams');
const matchRoutes = require('./routes/matches');
const analyticsRoutes = require('./routes/analytics');
const adminAuthRoutes = require('./routes/adminAuth');
const adminMatchRoutes = require('./routes/adminMatches');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
// const adminAuth = require('../middleware/adminAuth');

// Mount routes
app.use('/api/seasons', seasonRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminAuthRoutes);
app.use('/api/admin/matches', adminMatchRoutes);

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


// Start server
const startServer = async () => {
  try {
    await testConnection();
    app.listen(PORT, () => {
      console.log('=================================');
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 API URL: http://localhost:${PORT}/api`);
      console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
      console.log('=================================');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Export for Vercel serverless
module.exports = app;