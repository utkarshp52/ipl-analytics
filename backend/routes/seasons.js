const express = require('express');
const router = express.Router();

// Import controller functions
const {
  getAllSeasons,
  getSeasonById,
  getSeasonPoints,
  getSeasonMatches
} = require('../controllers/seasonController');

// ============================================
// SEASON ROUTES
// ============================================

// @route   GET /api/seasons
// @desc    Get all seasons
// @access  Public
router.get('/', getAllSeasons);

// @route   GET /api/seasons/:id
// @desc    Get season by ID
// @access  Public
router.get('/:id', getSeasonById);

// @route   GET /api/seasons/:id/points
// @desc    Get points table for a season
// @access  Public
router.get('/:id/points', getSeasonPoints);

// @route   GET /api/seasons/:id/matches
// @desc    Get all matches in a season
// @access  Public
router.get('/:id/matches', getSeasonMatches);

module.exports = router;