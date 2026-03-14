const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/adminAuth');
const {
  getAllMatches,
  getMatchById,
  addMatch,
  updateMatch,
  deleteMatch
} = require('../controllers/adminMatchController');

// All routes require admin authentication
router.use(isAdmin);

router.get('/', getAllMatches);
router.get('/:id', getMatchById);
router.post('/', addMatch);
router.put('/:id', updateMatch);
router.delete('/:id', deleteMatch);

module.exports = router;