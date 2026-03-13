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

    // Compute points table dynamically from raw_matches (league matches only)
    // This gives accurate results instead of relying on the pre-stored points_table
    const query = `
      SELECT 
        t.team_id,
        t.team_name,
        COUNT(*) AS matches_played,
        SUM(CASE WHEN rm.winner = t.team_name THEN 1 ELSE 0 END) AS wins,
        SUM(CASE 
          WHEN rm.winner IS NOT NULL AND rm.winner != '' AND rm.winner != 'NA' AND rm.winner != t.team_name 
          THEN 1 ELSE 0 
        END) AS losses,
        SUM(CASE 
          WHEN rm.winner IS NULL OR rm.winner = '' OR rm.winner = 'NA' 
          THEN 1 ELSE 0 
        END) AS no_result,
        SUM(CASE WHEN rm.winner = t.team_name THEN 1 ELSE 0 END) * 2 
          + SUM(CASE WHEN rm.winner IS NULL OR rm.winner = '' OR rm.winner = 'NA' THEN 1 ELSE 0 END) AS points
      FROM team t
      INNER JOIN raw_matches rm 
        ON (rm.team1 = t.team_name OR rm.team2 = t.team_name)
      WHERE rm.season = ? AND rm.match_type = 'League'
      GROUP BY t.team_id, t.team_name
      ORDER BY points DESC, wins DESC
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