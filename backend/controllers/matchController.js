const { pool } = require('../config/database');

// ============================================
// GET ALL MATCHES (with optional filters)
// GET /api/matches?season=2024&team=Mumbai&limit=50
// ============================================
exports.getAllMatches = async (req, res, next) => {
  try {
    const { season, team, limit = 100 } = req.query;
    
    let query = `
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
      WHERE 1=1
    `;
    
    const params = [];
    
    if (season) {
      query += ' AND season = ?';
      params.push(season);
    }
    
    if (team) {
      query += ' AND (team1 LIKE ? OR team2 LIKE ?)';
      params.push(`%${team}%`, `%${team}%`);
    }
    
    query += ' ORDER BY id DESC LIMIT ?';
    params.push(parseInt(limit));
    
    const [matches] = await pool.query(query, params);
    
    res.status(200).json({
      success: true,
      count: matches.length,
      data: matches
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET MATCH BY ID
// GET /api/matches/:id
// ============================================
exports.getMatchById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const query = 'SELECT * FROM raw_matches WHERE id = ?';
    const [matches] = await pool.query(query, [id]);
    
    if (matches.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Match with ID ${id} not found`
      });
    }
    
    res.status(200).json({
      success: true,
      data: matches[0]
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET ALL SUPER OVER MATCHES
// GET /api/matches/super-overs
// ============================================
exports.getSuperOverMatches = async (req, res, next) => {
  try {
    const query = `
      SELECT 
        id AS match_id,
        season,
        city,
        date,
        venue,
        team1,
        team2,
        winner,
        result_margin,
        player_of_match
      FROM raw_matches
      WHERE super_over = 'Y'
      ORDER BY season DESC, id DESC
    `;
    
    const [matches] = await pool.query(query);
    
    res.status(200).json({
      success: true,
      count: matches.length,
      data: matches
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET ALL FINAL MATCHES
// GET /api/matches/finals
// ============================================
exports.getFinalMatches = async (req, res, next) => {
  try {
    const query = `
      SELECT 
        id AS match_id,
        season,
        city,
        date,
        venue,
        team1,
        team2,
        winner,
        result,
        result_margin,
        player_of_match
      FROM raw_matches
      WHERE match_type = 'Final'
      ORDER BY season DESC
    `;
    
    const [matches] = await pool.query(query);
    
    res.status(200).json({
      success: true,
      count: matches.length,
      data: matches
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET HIGHEST WIN MARGINS
// GET /api/matches/highest-margins
// ============================================
exports.getHighestMargins = async (req, res, next) => {
  try {
    const query = `
      SELECT 
        id AS match_id,
        season,
        team1,
        team2,
        winner,
        result,
        result_margin,
        venue,
        city,
        date
      FROM raw_matches
      WHERE result_margin IS NOT NULL 
        AND result_margin > 0
      ORDER BY result_margin DESC
      LIMIT 10
    `;
    
    const [matches] = await pool.query(query);
    
    res.status(200).json({
      success: true,
      count: matches.length,
      data: matches
    });
  } catch (error) {
    next(error);
  }
};