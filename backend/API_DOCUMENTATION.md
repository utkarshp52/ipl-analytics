# 🏏 IPL Analytics API - Complete Documentation

## 📋 Table of Contents
1. [Overview](#overview)
2. [Base URL](#base-url)
3. [Technology Stack](#technology-stack)
4. [Database Schema](#database-schema)
5. [API Endpoints](#api-endpoints)
   - [Health & Root](#health--root)
   - [Season Endpoints](#season-endpoints)
   - [Team Endpoints](#team-endpoints)
   - [Match Endpoints](#match-endpoints)
   - [Analytics Endpoints](#analytics-endpoints)
6. [Response Format](#response-format)
7. [Error Handling](#error-handling)
8. [Testing with Hoppscotch](#testing-with-hoppscotch)

---

## 📌 Overview

The IPL Analytics API provides comprehensive access to Indian Premier League match data, team statistics, historical rankings, and advanced analytics. Built with Node.js and Express, it connects to a MySQL database containing normalized IPL data following 3NF principles.

**Version:** 1.0.0  
**Author:** [Your Name]  
**Database:** ipl_management  
**Total Endpoints:** 22

---

## 🌐 Base URL
```
Local Development: http://localhost:5000/api
```

---

## 💻 Technology Stack

### Backend
- **Runtime:** Node.js v16+
- **Framework:** Express.js v4.18+
- **Database Driver:** mysql2 v3.6+
- **CORS:** Enabled for all origins
- **Environment Management:** dotenv

### Database
- **DBMS:** MySQL 8.0
- **Tables:** 8 (season, team, raw_matches, points_table, historical_ranking, overall_ranking, venue, venue_stats)
- **Views:** 6 (overall_ranking_view, toss_impact_view, headtohead_view, season_awards_view, season_ranking_view, venue_analytics_view)
- **Normalization:** Third Normal Form (3NF)

---

## 🗄️ Database Schema

### Core Tables

**1. season**
- `season_id` (PK, INT)
- `year` (INT, UNIQUE)
- `orange_cap` (VARCHAR)
- `purple_cap` (VARCHAR)
- `player_of_series` (VARCHAR)

**2. team**
- `team_id` (PK, INT)
- `team_name` (VARCHAR, UNIQUE)
- `home_ground` (VARCHAR)

**3. raw_matches**
- `id` (PK, INT)
- `season` (INT)
- `city` (VARCHAR)
- `date` (DATE)
- `match_type` (VARCHAR)
- `venue` (VARCHAR)
- `team1` (VARCHAR)
- `team2` (VARCHAR)
- `toss_winner` (VARCHAR)
- `toss_decision` (VARCHAR)
- `winner` (VARCHAR)
- `result` (VARCHAR)
- `result_margin` (INT)
- `player_of_match` (VARCHAR)
- `super_over` (VARCHAR)
- And more...

**4. points_table**
- `season_id` (PK, FK, INT)
- `team_id` (PK, FK, INT)
- `matches_played` (INT)
- `wins` (INT)
- `losses` (INT)
- `points` (INT)
- `net_run_rate` (DECIMAL)

**5. historical_ranking**
- `team_id` (PK, FK, INT)
- `season_id` (PK, FK, INT)
- `cumulative_matches_played` (INT)
- `cumulative_wins` (INT)
- `cumulative_win_percentage` (DECIMAL)

**6. overall_ranking**
- `team_id` (FK, INT)
- `total_matches` (DECIMAL)
- `total_wins` (DECIMAL)
- `total_losses` (DECIMAL)
- `total_points` (DECIMAL)
- `win_percentage` (DECIMAL)

**7. venue**
- `venue_id` (PK, INT, AUTO_INCREMENT)
- `venue_name` (VARCHAR)
- `city` (VARCHAR)
- `state` (VARCHAR)
- `country` (VARCHAR)
- `capacity` (INT)
- `pitch_type` (ENUM: 'Flat', 'Seaming', 'Spinning')
- `total_matches` (INT)
- `avg_target_runs` (DECIMAL)

---

## 📡 API Endpoints

### Health & Root

#### 1. Root Endpoint
```
GET /
```

**Description:** API documentation and available endpoints overview

**Response:**
```json
{
  "message": "Welcome to IPL Analytics API",
  "version": "1.0.0",
  "database": "ipl_management",
  "endpoints": { ... },
  "totalEndpoints": 22
}
```

**Hoppscotch Setup:**
- Method: `GET`
- URL: `http://localhost:5000/`

---

#### 2. Health Check
```
GET /api/health
```

**Description:** Check if API server is running

**Response:**
```json
{
  "status": "OK",
  "message": "IPL Analytics API is running",
  "timestamp": "2024-03-09T10:30:00.000Z",
  "database": "ipl_management"
}
```

**Hoppscotch Setup:**
- Method: `GET`
- URL: `http://localhost:5000/api/health`

---

### Season Endpoints

#### 3. Get All Seasons
```
GET /api/seasons
```

**Description:** Retrieve all IPL seasons with award winners

**Response:**
```json
{
  "success": true,
  "count": 16,
  "data": [
    {
      "season_id": 1,
      "year": 2008,
      "orange_cap": "Shaun Marsh",
      "purple_cap": "Sohail Tanvir",
      "player_of_series": "Shane Watson"
    },
    ...
  ]
}
```

**Hoppscotch Setup:**
- Method: `GET`
- URL: `http://localhost:5000/api/seasons`

---

#### 4. Get Season by ID
```
GET /api/seasons/:id
```

**Description:** Retrieve specific season details

**Path Parameters:**
- `id` (required) - Season ID (integer)

**Example Request:**
```
GET /api/seasons/1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "season_id": 1,
    "year": 2008,
    "orange_cap": "Shaun Marsh",
    "purple_cap": "Sohail Tanvir",
    "player_of_series": "Shane Watson"
  }
}
```

**Hoppscotch Setup:**
- Method: `GET`
- URL: `http://localhost:5000/api/seasons/1`

**Error Response (404):**
```json
{
  "success": false,
  "message": "Season with ID 999 not found"
}
```

---

#### 5. Get Season Points Table
```
GET /api/seasons/:id/points
```

**Description:** Get points table (team standings) for a specific season

**Path Parameters:**
- `id` (required) - Season ID

**Example Request:**
```
GET /api/seasons/1/points
```

**Response:**
```json
{
  "success": true,
  "count": 8,
  "data": [
    {
      "team_id": 1,
      "team_name": "Mumbai Indians",
      "matches_played": 14,
      "wins": 10,
      "losses": 4,
      "points": 20,
      "net_run_rate": 0.85
    },
    ...
  ]
}
```

**Hoppscotch Setup:**
- Method: `GET`
- URL: `http://localhost:5000/api/seasons/1/points`

---

#### 6. Get Season Matches
```
GET /api/seasons/:id/matches
```

**Description:** Get all matches played in a specific season

**Path Parameters:**
- `id` (required) - Season ID

**Example Request:**
```
GET /api/seasons/1/matches
```

**Response:**
```json
{
  "success": true,
  "count": 59,
  "data": [
    {
      "match_id": 1,
      "season": 2008,
      "city": "Bangalore",
      "date": "2008-04-18",
      "match_type": "League",
      "venue": "M Chinnaswamy Stadium",
      "team1": "Kolkata Knight Riders",
      "team2": "Royal Challengers Bangalore",
      "toss_winner": "Royal Challengers Bangalore",
      "toss_decision": "field",
      "winner": "Kolkata Knight Riders",
      "result": "runs",
      "result_margin": 140,
      "player_of_match": "Brendon McCullum",
      "super_over": "N"
    },
    ...
  ]
}
```

**Hoppscotch Setup:**
- Method: `GET`
- URL: `http://localhost:5000/api/seasons/1/matches`

---

### Team Endpoints

#### 7. Get All Teams
```
GET /api/teams
```

**Description:** Retrieve all IPL teams

**Response:**
```json
{
  "success": true,
  "count": 15,
  "data": [
    {
      "team_id": 1,
      "team_name": "Mumbai Indians",
      "home_ground": "Wankhede Stadium"
    },
    ...
  ]
}
```

**Hoppscotch Setup:**
- Method: `GET`
- URL: `http://localhost:5000/api/teams`

---

#### 8. Get Team by ID
```
GET /api/teams/:id
```

**Description:** Get specific team details

**Path Parameters:**
- `id` (required) - Team ID

**Example Request:**
```
GET /api/teams/1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "team_id": 1,
    "team_name": "Mumbai Indians",
    "home_ground": "Wankhede Stadium"
  }
}
```

**Hoppscotch Setup:**
- Method: `GET`
- URL: `http://localhost:5000/api/teams/1`

---

#### 9. Get Team Historical Ranking
```
GET /api/teams/:id/history
```

**Description:** Get team's performance progression over all seasons

**Path Parameters:**
- `id` (required) - Team ID

**Example Request:**
```
GET /api/teams/1/history
```

**Response:**
```json
{
  "success": true,
  "count": 15,
  "data": [
    {
      "year": 2008,
      "cumulative_matches_played": 14,
      "cumulative_wins": 7,
      "cumulative_win_percentage": 50.00
    },
    {
      "year": 2009,
      "cumulative_matches_played": 28,
      "cumulative_wins": 12,
      "cumulative_win_percentage": 42.86
    },
    ...
  ]
}
```

**Hoppscotch Setup:**
- Method: `GET`
- URL: `http://localhost:5000/api/teams/1/history`

**Use Case:** Display line chart of team performance over time

---

#### 10. Get Team's Best Season
```
GET /api/teams/:id/best-season
```

**Description:** Get the best performing season for a team

**Path Parameters:**
- `id` (required) - Team ID

**Example Request:**
```
GET /api/teams/1/best-season
```

**Response:**
```json
{
  "success": true,
  "data": {
    "year": 2019,
    "season_id": 12,
    "wins": 11,
    "losses": 3,
    "points": 22,
    "net_run_rate": 0.42,
    "matches_played": 14
  }
}
```

**Hoppscotch Setup:**
- Method: `GET`
- URL: `http://localhost:5000/api/teams/1/best-season`

---

#### 11. Get Team Overall Stats
```
GET /api/teams/:id/stats
```

**Description:** Get team's all-time statistics

**Path Parameters:**
- `id` (required) - Team ID

**Example Request:**
```
GET /api/teams/1/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "team_name": "Mumbai Indians",
    "total_matches": 220,
    "total_wins": 130,
    "total_losses": 88,
    "total_points": 262,
    "win_percentage": 59.09
  }
}
```

**Hoppscotch Setup:**
- Method: `GET`
- URL: `http://localhost:5000/api/teams/1/stats`

---

### Match Endpoints

#### 12. Get All Matches
```
GET /api/matches
```

**Description:** Get all matches with optional filters

**Query Parameters:**
- `season` (optional) - Filter by season year (e.g., 2024)
- `team` (optional) - Filter by team name (e.g., "Mumbai")
- `limit` (optional) - Number of results (default: 100, max: 100)

**Example Requests:**
```
GET /api/matches
GET /api/matches?season=2024
GET /api/matches?team=Mumbai&limit=20
GET /api/matches?season=2023&team=Chennai&limit=10
```

**Response:**
```json
{
  "success": true,
  "count": 100,
  "data": [
    {
      "match_id": 1250,
      "season": 2024,
      "city": "Mumbai",
      "date": "2024-05-26",
      "match_type": "Final",
      "venue": "Wankhede Stadium",
      "team1": "Mumbai Indians",
      "team2": "Chennai Super Kings",
      "toss_winner": "Chennai Super Kings",
      "toss_decision": "bat",
      "winner": "Mumbai Indians",
      "result": "runs",
      "result_margin": 41,
      "player_of_match": "Rohit Sharma",
      "super_over": "N"
    },
    ...
  ]
}
```

**Hoppscotch Setup:**
- Method: `GET`
- URL: `http://localhost:5000/api/matches`
- Params Tab:
  - `season`: `2024`
  - `team`: `Mumbai`
  - `limit`: `20`

---

#### 13. Get Match by ID
```
GET /api/matches/:id
```

**Description:** Get detailed information about a specific match

**Path Parameters:**
- `id` (required) - Match ID

**Example Request:**
```
GET /api/matches/1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "season": 2008,
    "city": "Bangalore",
    "date": "2008-04-18",
    "match_type": "League",
    "player_of_match": "Brendon McCullum",
    "venue": "M Chinnaswamy Stadium",
    "team1": "Kolkata Knight Riders",
    "team2": "Royal Challengers Bangalore",
    "toss_winner": "Royal Challengers Bangalore",
    "toss_decision": "field",
    "winner": "Kolkata Knight Riders",
    "result": "runs",
    "result_margin": 140,
    "target_runs": null,
    "target_overs": null,
    "super_over": "N",
    "method": null,
    "umpire1": "Asad Rauf",
    "umpire2": "RE Koertzen"
  }
}
```

**Hoppscotch Setup:**
- Method: `GET`
- URL: `http://localhost:5000/api/matches/1`

---

#### 14. Get Super Over Matches
```
GET /api/matches/super-overs
```

**Description:** Get all matches that went to super over

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "match_id": 980,
      "season": 2019,
      "city": "Hyderabad",
      "date": "2019-05-08",
      "venue": "Rajiv Gandhi International Stadium",
      "team1": "Sunrisers Hyderabad",
      "team2": "Delhi Capitals",
      "winner": "Delhi Capitals",
      "result_margin": 0,
      "player_of_match": "Kagiso Rabada"
    },
    ...
  ]
}
```

**Hoppscotch Setup:**
- Method: `GET`
- URL: `http://localhost:5000/api/matches/super-overs`

---

#### 15. Get Final Matches
```
GET /api/matches/finals
```

**Description:** Get all IPL final matches

**Response:**
```json
{
  "success": true,
  "count": 16,
  "data": [
    {
      "match_id": 59,
      "season": 2008,
      "city": "Mumbai",
      "date": "2008-06-01",
      "venue": "DY Patil Stadium",
      "team1": "Rajasthan Royals",
      "team2": "Chennai Super Kings",
      "winner": "Rajasthan Royals",
      "result": "runs",
      "result_margin": 3,
      "player_of_match": "Yusuf Pathan"
    },
    ...
  ]
}
```

**Hoppscotch Setup:**
- Method: `GET`
- URL: `http://localhost:5000/api/matches/finals`

---

#### 16. Get Highest Win Margins
```
GET /api/matches/highest-margins
```

**Description:** Get top 10 matches with highest win margins

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "match_id": 1,
      "season": 2008,
      "team1": "Kolkata Knight Riders",
      "team2": "Royal Challengers Bangalore",
      "winner": "Kolkata Knight Riders",
      "result": "runs",
      "result_margin": 140,
      "venue": "M Chinnaswamy Stadium",
      "city": "Bangalore",
      "date": "2008-04-18"
    },
    ...
  ]
}
```

**Hoppscotch Setup:**
- Method: `GET`
- URL: `http://localhost:5000/api/matches/highest-margins`

---

### Analytics Endpoints

#### 17. Get Overall Team Ranking
```
GET /api/analytics/overall-ranking
```

**Description:** Get all-time team rankings based on total wins

**Uses:** Database view `overall_ranking_view`

**Response:**
```json
{
  "success": true,
  "count": 15,
  "data": [
    {
      "team_id": 1,
      "team_name": "Mumbai Indians",
      "total_matches": 220,
      "total_wins": 130,
      "total_losses": 88,
      "total_points": 262,
      "win_percentage": 59.09
    },
    ...
  ]
}
```

**Hoppscotch Setup:**
- Method: `GET`
- URL: `http://localhost:5000/api/analytics/overall-ranking`

**Use Case:** Display leaderboard, compare team performances

---

#### 18. Get Toss Impact Analysis
```
GET /api/analytics/toss-impact
```

**Description:** Analyze impact of toss decision on match outcome

**Uses:** Database view `toss_impact_view`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "toss_decision": "bat",
      "total_matches": 550,
      "toss_winner_won": 285,
      "win_percentage": 51.82
    },
    {
      "toss_decision": "field",
      "total_matches": 500,
      "toss_winner_won": 270,
      "win_percentage": 54.00
    }
  ]
}
```

**Hoppscotch Setup:**
- Method: `GET`
- URL: `http://localhost:5000/api/analytics/toss-impact`

**Use Case:** Bar chart comparing bat vs field first success rates

---

#### 19. Get Venue Statistics
```
GET /api/analytics/venue-stats
```

**Description:** Get top 20 venues by matches hosted with statistics

**Uses:** Database view `venue_analytics_view`

**Response:**
```json
{
  "success": true,
  "count": 20,
  "data": [
    {
      "venue_name": "Wankhede Stadium",
      "city": "Mumbai",
      "matches_hosted": 85,
      "avg_margin": 25.5,
      "super_over_matches": 2
    },
    ...
  ]
}
```

**Hoppscotch Setup:**
- Method: `GET`
- URL: `http://localhost:5000/api/analytics/venue-stats`

**Use Case:** Venue performance comparison, home advantage analysis

---

#### 20. Get Head to Head Stats
```
GET /api/analytics/head-to-head
```

**Description:** Get head-to-head statistics between two teams

**Query Parameters:**
- `team1` (required) - First team name (partial match allowed)
- `team2` (required) - Second team name (partial match allowed)

**Uses:** Database view `headtohead_view`

**Example Request:**
```
GET /api/analytics/head-to-head?team1=Mumbai&team2=Chennai
```

**Response:**
```json
{
  "success": true,
  "data": {
    "team1": "Mumbai Indians",
    "team2": "Chennai Super Kings",
    "total_matches": 35,
    "team1_wins": 20,
    "team2_wins": 15,
    "no_result": 0
  }
}
```

**Hoppscotch Setup:**
- Method: `GET`
- URL: `http://localhost:5000/api/analytics/head-to-head`
- Params Tab:
  - `team1`: `Mumbai`
  - `team2`: `Chennai`

**Error Response (400):**
```json
{
  "success": false,
  "message": "Both team1 and team2 query parameters are required (use team names)"
}
```

---

#### 21. Get Season Awards
```
GET /api/analytics/season-awards
```

**Description:** Get all season awards (Orange Cap, Purple Cap, Player of Series)

**Uses:** Database view `season_awards_view`

**Response:**
```json
{
  "success": true,
  "count": 16,
  "data": [
    {
      "year": 2024,
      "orange_cap": "Virat Kohli",
      "purple_cap": "Harshal Patel",
      "player_of_series": "Jos Buttler"
    },
    ...
  ]
}
```

**Hoppscotch Setup:**
- Method: `GET`
- URL: `http://localhost:5000/api/analytics/season-awards`

---

#### 22. Get Season Ranking
```
GET /api/analytics/season-ranking/:season_id
```

**Description:** Get team rankings for a specific season

**Path Parameters:**
- `season_id` (required) - Season ID

**Uses:** Database view `season_ranking_view`

**Example Request:**
```
GET /api/analytics/season-ranking/1
```

**Response:**
```json
{
  "success": true,
  "count": 8,
  "data": [
    {
      "season_id": 1,
      "team_id": 1,
      "team_name": "Mumbai Indians",
      "points": 20,
      "wins": 10,
      "net_run_rate": 0.85
    },
    ...
  ]
}
```

**Hoppscotch Setup:**
- Method: `GET`
- URL: `http://localhost:5000/api/analytics/season-ranking/1`

---

#### 23. Get All Venues
```
GET /api/analytics/venues
```

**Description:** Get all venues with detailed statistics

**Response:**
```json
{
  "success": true,
  "count": 45,
  "data": [
    {
      "venue_id": 1,
      "venue_name": "Wankhede Stadium",
      "city": "Mumbai",
      "state": "Maharashtra",
      "country": "India",
      "capacity": 33108,
      "pitch_type": "Flat",
      "total_matches": 85,
      "avg_target_runs": 175.50
    },
    ...
  ]
}
```

**Hoppscotch Setup:**
- Method: `GET`
- URL: `http://localhost:5000/api/analytics/venues`

---

#### 24. Get Venue Details
```
GET /api/analytics/venue/:venue_id
```

**Description:** Get detailed information about a specific venue

**Path Parameters:**
- `venue_id` (required) - Venue ID

**Example Request:**
```
GET /api/analytics/venue/1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "venue_id": 1,
    "venue_name": "Wankhede Stadium",
    "city": "Mumbai",
    "state": "Maharashtra",
    "country": "India",
    "capacity": 33108,
    "pitch_type": "Flat",
    "total_matches": 85,
    "avg_target_runs": 175.50
  }
}
```

**Hoppscotch Setup:**
- Method: `GET`
- URL: `http://localhost:5000/api/analytics/venue/1`

---

## 📤 Response Format

### Success Response Structure
```json
{
  "success": true,
  "count": <number>,      // Optional: for list endpoints
  "data": <object|array>  // Actual data
}
```

### Error Response Structure
```json
{
  "success": false,
  "error": "<error message>",
  "stack": "<stack trace>"  // Only in development mode
}
```

---

## ⚠️ Error Handling

### HTTP Status Codes

| Status Code | Meaning | When it occurs |
|-------------|---------|----------------|
| 200 | OK | Request successful |
| 400 | Bad Request | Missing required parameters |
| 404 | Not Found | Resource doesn't exist |
| 500 | Internal Server Error | Database or server error |

### Common Error Scenarios

**404 - Resource Not Found:**
```json
{
  "success": false,
  "message": "Season with ID 999 not found"
}
```

**400 - Missing Parameters:**
```json
{
  "success": false,
  "message": "Both team1 and team2 query parameters are required"
}
```

**500 - Server Error:**
```json
{
  "success": false,
  "error": "Database connection failed",
  "stack": "Error: connect ECONNREFUSED..."  // Dev mode only
}
```

---

## 🧪 Testing with Hoppscotch

### Quick Start Guide

1. **Open Hoppscotch:** Visit https://hoppscotch.io/

2. **Set Base URL:**
   - Click on "Environment" (top right)
   - Create new environment: "IPL Analytics Local"
   - Add variable:
     - Key: `baseURL`
     - Value: `http://localhost:5000`

3. **Create Request Collection:**
   - Click "Collections" → "New Collection"
   - Name: "IPL Analytics API"

4. **Add Requests:**
   For each endpoint, create a new request:
   - Method: GET
   - URL: `<<baseURL>>/api/seasons`
   - Click "Send"

### Sample Hoppscotch Collection Structure
```
📁 IPL Analytics API
  📁 Health & Root
    ↳ GET Root (/)
    ↳ GET Health Check (/api/health)
  
  📁 Seasons
    ↳ GET All Seasons
    ↳ GET Season by ID
    ↳ GET Season Points Table
    ↳ GET Season Matches
  
  📁 Teams
    ↳ GET All Teams
    ↳ GET Team by ID
    ↳ GET Team History
    ↳ GET Team Best Season
    ↳ GET Team Stats
  
  📁 Matches
    ↳ GET All Matches
    ↳ GET Match by ID
    ↳ GET Super Over Matches
    ↳ GET Final Matches
    ↳ GET Highest Margins
  
  📁 Analytics
    ↳ GET Overall Ranking
    ↳ GET Toss Impact
    ↳ GET Venue Stats
    ↳ GET Head to Head
    ↳ GET Season Awards
    ↳ GET Season Ranking
    ↳ GET All Venues
    ↳ GET Venue Detail
```

### Testing Workflow in Hoppscotch

**Step 1: Test Health Endpoint**
```
GET http://localhost:5000/api/health
Expected: 200 OK with status message
```

**Step 2: Test Basic GET Endpoints**
```
GET http://localhost:5000/api/seasons
GET http://localhost:5000/api/teams
GET http://localhost:5000/api/matches?limit=10
```

**Step 3: Test Parametric Endpoints**
```
GET http://localhost:5000/api/seasons/1
GET http://localhost:5000/api/teams/1
GET http://localhost:5000/api/matches/1
```

**Step 4: Test Query Parameters**
```
GET http://localhost:5000/api/matches?season=2024&limit=20
GET http://localhost:5000/api/analytics/head-to-head?team1=Mumbai&team2=Chennai
```

**Step 5: Test Analytics Endpoints**
```
GET http://localhost:5000/api/analytics/overall-ranking
GET http://localhost:5000/api/analytics/toss-impact
GET http://localhost:5000/api/analytics/venue-stats
```

### Export Hoppscotch Collection

1. Select your collection
2. Click three-dot menu (⋮)
3. Click "Export"
4. Choose format: JSON
5. Save as `IPL_Analytics_Hoppscotch_Collection.json`
6. Include in project submission

---

## 📊 SQL Queries Used

### Complex Queries Implemented

**1. Overall Ranking (Window Function):**
```sql
SELECT 
  t.team_id,
  t.team_name,
  SUM(pt.wins) AS total_wins,
  RANK() OVER (ORDER BY SUM(pt.wins) DESC) AS overall_rank
FROM team t
JOIN points_table pt ON t.team_id = pt.team_id
GROUP BY t.team_id, t.team_name
ORDER BY total_wins DESC;
```

**2. Toss Impact (CASE Statement):**
```sql
SELECT 
  toss_decision,
  COUNT(*) AS total_matches,
  SUM(CASE WHEN toss_winner_id = winner_team_id THEN 1 ELSE 0 END) AS toss_winner_won,
  ROUND(SUM(CASE WHEN toss_winner_id = winner_team_id THEN 1 ELSE 0 END) / COUNT(*) * 100, 2) AS win_percentage
FROM matches
GROUP BY toss_decision;
```

**3. Historical Ranking (JOIN + Aggregation):**
```sql
SELECT 
  s.year,
  h.cumulative_matches_played,
  h.cumulative_wins,
  h.cumulative_win_percentage
FROM historical_ranking h
JOIN season s ON h.season_id = s.season_id
WHERE h.team_id = ?
ORDER BY s.year ASC;
```

---

## 📝 Notes

### Database Views
This API leverages pre-created MySQL views for optimized analytics:
- `overall_ranking_view` - Cached all-time team rankings
- `toss_impact_view` - Pre-computed toss statistics
- `headtohead_view` - Pre-computed H2H matchups
- `season_awards_view` - Formatted award winners
- `season_ranking_view` - Season-specific rankings
- `venue_analytics_view` - Venue performance metrics

### Performance Considerations
- Connection pooling enabled (max 10 connections)
- All endpoints use parameterized queries (SQL injection prevention)
- Results limited to 100 records by default for list endpoints
- Database indexes on foreign keys for faster JOINs

### CORS Configuration
- CORS enabled for all origins
- Safe for frontend integration from any domain
- Suitable for local development and deployment

---

## 🚀 Deployment Considerations

### Environment Variables Required
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ipl_management
DB_PORT=3306
NODE_ENV=production
```

### Production Recommendations
1. Use environment-specific `.env` files
2. Enable HTTPS
3. Implement rate limiting
4. Add authentication for write operations
5. Use process manager (PM2)
6. Set up monitoring (Winston logger)
7. Database connection retry logic

---

## 📞 Support

For issues or questions:
- Check server logs: `npm run dev`
- Verify database connection
- Ensure all environment variables are set
- Test with Hoppscotch before frontend integration

---

## 📄 License

MIT License - Academic Project

---

**Documentation Version:** 1.0.0  
**Last Updated:** March 2026  
**Author:** [Your Name]  
**Project:** IPL Match-Level Analytics & Historical Ranking System