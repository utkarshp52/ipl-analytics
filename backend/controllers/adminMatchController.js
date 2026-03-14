const { pool } = require('../config/database');

// ============================================
// GET ALL MATCHES (with filters)
// GET /api/admin/matches
// ============================================
exports.getAllMatches = async (req, res, next) => {
  try {
    const { season, team, limit = 100 } = req.query;

    let query = 'SELECT * FROM raw_matches WHERE 1=1';
    const params = [];

    if (season) {
      query += ' AND season = ?';
      params.push(season);
    }

    if (team) {
      query += ' AND (team1 LIKE ? OR team2 LIKE ?)';
      params.push(`%${team}%`, `%${team}%`);
    }

    query += ' ORDER BY date DESC LIMIT ?';
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
// GET SINGLE MATCH
// GET /api/admin/matches/:id
// ============================================
exports.getMatchById = async (req, res, next) => {
  try {
    const [matches] = await pool.query(
      'SELECT * FROM raw_matches WHERE id = ?',
      [req.params.id]
    );

    if (matches.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
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
// ADD NEW MATCH
// POST /api/admin/matches
// ============================================
exports.addMatch = async (req, res, next) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const {
      season,
      city,
      date,
      match_type,
      player_of_match,
      venue,
      team1,
      team2,
      toss_winner,
      toss_decision,
      winner,
      result,
      result_margin,
      target_runs,
      target_overs,
      super_over,
      method,
      umpire1,
      umpire2
    } = req.body;

    // Validate required fields
    if (!season || !date || !team1 || !team2 || !venue) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Required fields: season, date, team1, team2, venue'
      });
    }

    // Insert match
    const [result_data] = await connection.query(
      `INSERT INTO raw_matches 
      (season, city, date, match_type, player_of_match, venue, team1, team2, 
       toss_winner, toss_decision, winner, result, result_margin, target_runs, 
       target_overs, super_over, method, umpire1, umpire2)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [season, city, date, match_type, player_of_match, venue, team1, team2,
       toss_winner, toss_decision, winner, result, result_margin, target_runs,
       target_overs, super_over, method, umpire1, umpire2]
    );

    // Recalculate points table for this season
    await recalculatePointsTable(connection, season);

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Match added successfully',
      data: {
        id: result_data.insertId
      }
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

// ============================================
// UPDATE MATCH
// PUT /api/admin/matches/:id
// ============================================
exports.updateMatch = async (req, res, next) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const matchId = req.params.id;

    // Check if match exists
    const [existing] = await connection.query(
      'SELECT season FROM raw_matches WHERE id = ?',
      [matchId]
    );

    if (existing.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    const oldSeason = existing[0].season;

    const {
      season,
      city,
      date,
      match_type,
      player_of_match,
      venue,
      team1,
      team2,
      toss_winner,
      toss_decision,
      winner,
      result,
      result_margin,
      target_runs,
      target_overs,
      super_over,
      method,
      umpire1,
      umpire2
    } = req.body;

    // Update match
    await connection.query(
      `UPDATE raw_matches SET
      season = ?, city = ?, date = ?, match_type = ?, player_of_match = ?,
      venue = ?, team1 = ?, team2 = ?, toss_winner = ?, toss_decision = ?,
      winner = ?, result = ?, result_margin = ?, target_runs = ?, target_overs = ?,
      super_over = ?, method = ?, umpire1 = ?, umpire2 = ?
      WHERE id = ?`,
      [season, city, date, match_type, player_of_match, venue, team1, team2,
       toss_winner, toss_decision, winner, result, result_margin, target_runs,
       target_overs, super_over, method, umpire1, umpire2, matchId]
    );

    // Recalculate points for both old and new season (if changed)
    await recalculatePointsTable(connection, oldSeason);
    if (season !== oldSeason) {
      await recalculatePointsTable(connection, season);
    }

    await connection.commit();

    res.status(200).json({
      success: true,
      message: 'Match updated successfully'
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

// ============================================
// DELETE MATCH
// DELETE /api/admin/matches/:id
// ============================================
exports.deleteMatch = async (req, res, next) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const matchId = req.params.id;
    
    console.log('Attempting to delete match ID:', matchId); // DEBUG

    // Get season before deleting
    const [existing] = await connection.query(
      'SELECT season FROM raw_matches WHERE id = ?',
      [matchId]
    );

    console.log('Match found:', existing.length > 0); // DEBUG

    if (existing.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    const season = existing[0].season;
    console.log('Match season:', season); // DEBUG

    // Delete match
    const [deleteResult] = await connection.query(
      'DELETE FROM raw_matches WHERE id = ?',
      [matchId]
    );

    console.log('Delete result:', deleteResult); // DEBUG

    // Recalculate points table
    await recalculatePointsTable(connection, season);

    await connection.commit();

    console.log('Match deleted successfully'); // DEBUG

    res.status(200).json({
      success: true,
      message: 'Match deleted successfully'
    });
  } catch (error) {
    await connection.rollback();
    console.error('Delete error:', error); // DEBUG
    next(error);
  } finally {
    connection.release();
  }
};

// ============================================
// HELPER: Recalculate Points Table
// ============================================
async function recalculatePointsTable(connection, season) {
  // Delete existing points for this season
  await connection.query(
    'DELETE FROM points_table WHERE season_id = (SELECT season_id FROM season WHERE year = ?)',
    [season]
  );

  // Get all teams that played in this season
  const [teams] = await connection.query(
    `SELECT DISTINCT team_name FROM (
      SELECT team1 as team_name FROM raw_matches WHERE season = ?
      UNION
      SELECT team2 as team_name FROM raw_matches WHERE season = ?
    ) t`,
    [season, season]
  );

  // Get season_id
  const [seasonData] = await connection.query(
    'SELECT season_id FROM season WHERE year = ?',
    [season]
  );

  if (seasonData.length === 0) return;

  const season_id = seasonData[0].season_id;

  // Calculate stats for each team
  for (const teamRow of teams) {
    const team_name = teamRow.team_name;

    // Get team_id
    const [teamData] = await connection.query(
      'SELECT team_id FROM team WHERE team_name = ?',
      [team_name]
    );

    if (teamData.length === 0) continue;

    const team_id = teamData[0].team_id;

    // Count matches played
    const [matchesPlayed] = await connection.query(
      `SELECT COUNT(*) as count FROM raw_matches 
       WHERE season = ? AND (team1 = ? OR team2 = ?)`,
      [season, team_name, team_name]
    );

    // Count wins
    const [wins] = await connection.query(
      'SELECT COUNT(*) as count FROM raw_matches WHERE season = ? AND winner = ?',
      [season, team_name]
    );

    const matches_played = matchesPlayed[0].count;
    const wins_count = wins[0].count;
    const losses = matches_played - wins_count;
    const points = wins_count * 2; // 2 points per win
    const net_run_rate = 0; // Simplified - can calculate actual NRR later

    // Insert into points_table
    await connection.query(
      `INSERT INTO points_table (season_id, team_id, matches_played, wins, losses, points, net_run_rate)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
       matches_played = VALUES(matches_played),
       wins = VALUES(wins),
       losses = VALUES(losses),
       points = VALUES(points),
       net_run_rate = VALUES(net_run_rate)`,
      [season_id, team_id, matches_played, wins_count, losses, points, net_run_rate]
    );
  }
}