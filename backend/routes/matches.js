const express = require('express');
const router = express.Router();

// Import controller functions
const {
  getAllMatches,
  getMatchById,
  getSuperOverMatches,
  getFinalMatches,
  getHighestMargins
} = require('../controllers/matchController');

// ============================================
// MATCH ROUTES
// ============================================
// IMPORTANT: Specific routes MUST come before parametric routes
// Otherwise /super-overs will be treated as /:id

// @route   GET /api/matches/super-overs
// @desc    Get all super over matches
// @access  Public
router.get('/super-overs', getSuperOverMatches);

// @route   GET /api/matches/finals
// @desc    Get all final matches
// @access  Public
router.get('/finals', getFinalMatches);

// @route   GET /api/matches/highest-margins
// @desc    Get top 10 matches by win margin
// @access  Public
router.get('/highest-margins', getHighestMargins);

// @route   GET /api/matches/:id
// @desc    Get match by ID
// @access  Public
router.get('/:id', getMatchById);

// @route   GET /api/matches
// @desc    Get all matches (with optional filters)
// @query   ?season=2024&team=Mumbai&limit=50
// @access  Public
router.get('/', getAllMatches);

module.exports = router;