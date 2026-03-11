const express = require('express');
const router = express.Router();

// Import controller functions
const {
  getAllTeams,
  getTeamById,
  getTeamHistory,
  getTeamBestSeason,
  getTeamStats
} = require('../controllers/teamController');

// ============================================
// TEAM ROUTES
// ============================================

// @route   GET /api/teams
// @desc    Get all teams
// @access  Public
router.get('/', getAllTeams);

// @route   GET /api/teams/:id
// @desc    Get team by ID
// @access  Public
router.get('/:id', getTeamById);

// @route   GET /api/teams/:id/history
// @desc    Get team's historical ranking progression
// @access  Public
router.get('/:id/history', getTeamHistory);

// @route   GET /api/teams/:id/best-season
// @desc    Get team's best performing season
// @access  Public
router.get('/:id/best-season', getTeamBestSeason);

// @route   GET /api/teams/:id/stats
// @desc    Get team's overall statistics
// @access  Public
router.get('/:id/stats', getTeamStats);

module.exports = router;