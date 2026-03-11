const { pool } = require('../config/database');

// ============================================
// GET OVERALL TEAM RANKING (using overall_ranking_view)
// GET /api/analytics/overall-ranking
// ============================================
exports.getOverallRanking = async (req, res, next) => {
  try {
    const query = 'SELECT * FROM overall_ranking_view ORDER BY total_wins DESC';
    const [rankings] = await pool.query(query);

    res.status(200).json({
      success: true,
      count: rankings.length,
      data: rankings
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET TOSS IMPACT ANALYSIS (using toss_impact_view)
// GET /api/analytics/toss-impact
// ============================================
exports.getTossImpact = async (req, res, next) => {
  try {
    const query = 'SELECT * FROM toss_impact_view';
    const [impact] = await pool.query(query);

    res.status(200).json({
      success: true,
      data: impact
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET VENUE STATISTICS (using venue_analytics_view)
// GET /api/analytics/venue-stats
// ============================================
exports.getVenueStats = async (req, res, next) => {
  try {
    const query = `
      SELECT 
        venue_name,
        city,
        pitch_type,
        total_matches AS matches_hosted,
        avg_target_runs AS avg_score
      FROM venue_analytics
      WHERE total_matches > 0
      ORDER BY total_matches DESC
      LIMIT 20
    `;

    const [venues] = await pool.query(query);

    res.status(200).json({
      success: true,
      count: venues.length,
      data: venues
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET HEAD TO HEAD (using headtohead_view)
// GET /api/analytics/head-to-head?team1=Mumbai&team2=Chennai
// ============================================
exports.getHeadToHead = async (req, res, next) => {
  try {
    const { team1, team2 } = req.query;

    if (!team1 || !team2) {
      return res.status(400).json({
        success: false,
        message: 'Both team1 and team2 query parameters are required (use team names)'
      });
    }

    const query = `
      SELECT 
        COUNT(id) AS total_matches,
        SUM(CASE WHEN winner LIKE ? THEN 1 ELSE 0 END) AS team1_wins,
        SUM(CASE WHEN winner LIKE ? THEN 1 ELSE 0 END) AS team2_wins,
        SUM(CASE WHEN winner IS NULL OR winner = 'NA' OR winner = '' THEN 1 ELSE 0 END) as no_result
      FROM raw_matches 
      WHERE (team1 LIKE ? AND team2 LIKE ?) 
         OR (team1 LIKE ? AND team2 LIKE ?)
    `;

    const [stats] = await pool.query(query, [
      `%${team1}%`, `%${team2}%`,
      `%${team1}%`, `%${team2}%`,
      `%${team2}%`, `%${team1}%`
    ]);

    if (!stats || stats.length === 0 || stats[0].total_matches === 0) {
      return res.status(404).json({
        success: false,
        message: 'No head-to-head data found for these teams'
      });
    }

    // Fetch the last 5 matches between these two teams
    const recentMatchesQuery = `
      SELECT 
        id AS match_id, season, date, venue, city, 
        team1, team2, toss_winner, toss_decision, 
        winner, result, result_margin, target_runs, 
        target_overs, super_over, player_of_match 
      FROM raw_matches 
      WHERE (team1 LIKE ? AND team2 LIKE ?) 
         OR (team1 LIKE ? AND team2 LIKE ?)
      ORDER BY date DESC, id DESC 
      LIMIT 5
    `;

    const [recentMatches] = await pool.query(recentMatchesQuery, [
      `%${team1}%`, `%${team2}%`,
      `%${team2}%`, `%${team1}%`
    ]);

    const responseData = {
      ...stats[0],
      recent_matches: recentMatches
    };

    res.status(200).json({
      success: true,
      data: responseData
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET SEASON AWARDS (using season_awards_view)
// GET /api/analytics/season-awards
// ============================================
exports.getSeasonAwards = async (req, res, next) => {
  try {
    const query = 'SELECT * FROM season_awards_view ORDER BY year DESC';
    const [awards] = await pool.query(query);

    res.status(200).json({
      success: true,
      count: awards.length,
      data: awards
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET SEASON RANKING (using season_ranking_view)
// GET /api/analytics/season-ranking/:season_id
// ============================================
exports.getSeasonRanking = async (req, res, next) => {
  try {
    const { season_id } = req.params;

    const query = 'SELECT * FROM season_ranking_view WHERE season_id = ? ORDER BY points DESC';
    const [ranking] = await pool.query(query, [season_id]);

    res.status(200).json({
      success: true,
      count: ranking.length,
      data: ranking
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET VENUE DETAILS (from venue_stats table)
// GET /api/analytics/venue/:venue_id
// ============================================
exports.getVenueDetail = async (req, res, next) => {
  try {
    const { venue_id } = req.params;

    const query = 'SELECT * FROM venue WHERE venue_id = ?';
    const [venue] = await pool.query(query, [venue_id]);

    if (venue.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Venue with ID ${venue_id} not found`
      });
    }

    res.status(200).json({
      success: true,
      data: venue[0]
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET ALL VENUES
// GET /api/analytics/venues
// ============================================
exports.getAllVenues = async (req, res, next) => {
  try {
    const query = 'SELECT * FROM venue ORDER BY total_matches DESC';
    const [venues] = await pool.query(query);

    res.status(200).json({
      success: true,
      count: venues.length,
      data: venues
    });
  } catch (error) {
    next(error);
  }
};