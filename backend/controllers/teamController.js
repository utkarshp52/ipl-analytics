const { pool } = require('../config/database');

// ============================================
// GET ALL TEAMS
// GET /api/teams
// ============================================
exports.getAllTeams = async (req, res, next) => {
  try {
    const query = 'SELECT * FROM team ORDER BY team_name';
    const [teams] = await pool.query(query);
    
    res.status(200).json({
      success: true,
      count: teams.length,
      data: teams
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET TEAM BY ID
// GET /api/teams/:id
// ============================================
exports.getTeamById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const query = 'SELECT * FROM team WHERE team_id = ?';
    const [teams] = await pool.query(query, [id]);
    
    if (teams.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Team with ID ${id} not found`
      });
    }
    
    res.status(200).json({
      success: true,
      data: teams[0]
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET TEAM HISTORICAL RANKING
// GET /api/teams/:id/history
// ============================================
exports.getTeamHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        s.year,
        h.cumulative_matches_played,
        h.cumulative_wins,
        h.cumulative_win_percentage
      FROM historical_ranking h
      JOIN season s ON h.season_id = s.season_id
      WHERE h.team_id = ?
      ORDER BY s.year ASC
    `;
    
    const [history] = await pool.query(query, [id]);
    
    if (history.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No historical data found for team ID ${id}`
      });
    }
    
    res.status(200).json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET TEAM'S BEST SEASON
// GET /api/teams/:id/best-season
// ============================================
exports.getTeamBestSeason = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        s.year,
        s.season_id,
        pt.wins,
        pt.losses,
        pt.points,
        pt.net_run_rate,
        pt.matches_played
      FROM points_table pt
      JOIN season s ON pt.season_id = s.season_id
      WHERE pt.team_id = ?
      ORDER BY pt.points DESC, pt.net_run_rate DESC
      LIMIT 1
    `;
    
    const [bestSeason] = await pool.query(query, [id]);
    
    if (bestSeason.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No season data found for team ID ${id}`
      });
    }
    
    res.status(200).json({
      success: true,
      data: bestSeason[0]
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET TEAM OVERALL STATS (using overall_ranking table)
// GET /api/teams/:id/stats
// ============================================
exports.getTeamStats = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        t.team_name,
        o.total_matches,
        o.total_wins,
        o.total_losses,
        o.total_points,
        o.win_percentage
      FROM overall_ranking o
      JOIN team t ON o.team_id = t.team_id
      WHERE o.team_id = ?
    `;
    
    const [stats] = await pool.query(query, [id]);
    
    if (stats.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No stats found for team ID ${id}`
      });
    }
    
    res.status(200).json({
      success: true,
      data: stats[0]
    });
  } catch (error) {
    next(error);
  }
};