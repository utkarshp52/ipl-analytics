const { pool } = require('../config/database');

// ============================================
// GET ALL SEASONS
// GET /api/seasons
// ============================================
exports.getAllSeasons = async (req, res, next) => {
  try {
    const query = 'SELECT * FROM season ORDER BY year DESC';
    const [seasons] = await pool.query(query);

    res.status(200).json({
      success: true,
      count: seasons.length,
      data: seasons
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET SEASON BY ID
// GET /api/seasons/:id
// ============================================
exports.getSeasonById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const query = 'SELECT * FROM season WHERE season_id = ?';
    const [seasons] = await pool.query(query, [id]);

    if (seasons.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Season with ID ${id} not found`
      });
    }

    res.status(200).json({
      success: true,
      data: seasons[0]
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET POINTS TABLE FOR A SEASON
// GET /api/seasons/:id/points
// ============================================
exports.getSeasonPoints = async (req, res, next) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        t.team_id,
        t.team_name,
        pt.matches_played,
        pt.wins,
        pt.losses,
        pt.points,
        pt.net_run_rate
      FROM points_table pt
      JOIN team t ON pt.team_id = t.team_id
      WHERE pt.season_id = ?
      ORDER BY pt.points DESC, pt.net_run_rate DESC
    `;

    const [points] = await pool.query(query, [id]);

    if (points.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No points table data found for season ${id}`
      });
    }

    res.status(200).json({
      success: true,
      count: points.length,
      data: points
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET ALL MATCHES FOR A SEASON
// GET /api/seasons/:id/matches
// ============================================
exports.getSeasonMatches = async (req, res, next) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        id AS match_id,
        season,
        city,
        date,
        match_type,
        venue,
        team1,
        team2,
        toss_winner,
        toss_decision,
        winner,
        result,
        result_margin,
        player_of_match,
        super_over
      FROM raw_matches
      WHERE season = ?
      ORDER BY date DESC, id DESC
    `;

    const [matches] = await pool.query(query, [id]);

    res.status(200).json({
      success: true,
      count: matches.length,
      data: matches
    });
  } catch (error) {
    next(error);
  }
};