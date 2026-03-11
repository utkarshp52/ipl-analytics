const express = require('express');
const router = express.Router();

// Import controller functions
const {
  getOverallRanking,
  getTossImpact,
  getVenueStats,
  getHeadToHead,
  getSeasonAwards,
  getSeasonRanking,
  getVenueDetail,
  getAllVenues
} = require('../controllers/analyticsController');

// ============================================
// ANALYTICS ROUTES
// ============================================

// @route   GET /api/analytics/overall-ranking
// @desc    Get overall team rankings (all-time)
// @access  Public
router.get('/overall-ranking', getOverallRanking);

// @route   GET /api/analytics/toss-impact
// @desc    Get toss impact analysis (bat/field first win %)
// @access  Public
router.get('/toss-impact', getTossImpact);

// @route   GET /api/analytics/venue-stats
// @desc    Get venue statistics (top 20 venues)
// @access  Public
router.get('/venue-stats', getVenueStats);

// @route   GET /api/analytics/head-to-head
// @desc    Get head-to-head stats between two teams
// @query   ?team1=Mumbai&team2=Chennai
// @access  Public
router.get('/head-to-head', getHeadToHead);

// @route   GET /api/analytics/season-awards
// @desc    Get all season awards (Orange Cap, Purple Cap, Player of Series)
// @access  Public
router.get('/season-awards', getSeasonAwards);

// @route   GET /api/analytics/season-ranking/:season_id
// @desc    Get team rankings for a specific season
// @access  Public
router.get('/season-ranking/:season_id', getSeasonRanking);

// @route   GET /api/analytics/venues
// @desc    Get all venues with statistics
// @access  Public
router.get('/venues', getAllVenues);

// @route   GET /api/analytics/venue/:venue_id
// @desc    Get detailed venue information
// @access  Public
router.get('/venue/:venue_id', getVenueDetail);

module.exports = router;