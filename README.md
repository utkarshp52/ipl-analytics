# 🏏 IPL Match-Level Analytics System

A comprehensive full-stack web application for analyzing Indian Premier League (IPL) cricket match data, featuring historical rankings, team statistics, and advanced analytics.

![IPL Analytics](https://img.shields.io/badge/IPL-Analytics-blue)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-16+-green)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange)

## ER Diagram

![IPL Management ER Diagram](Screenshots/IPL%20Management%20ER%20Diagram%20.png)


## 🌟 Features

- **Season Analytics**: View season-wise performance, points tables, and award winners
- **Team Statistics**: Overall rankings, historical performance trends, and best seasons
- **Match Insights**: Detailed match data with super over tracking and venue analysis
- **Advanced Analytics**: 
  - Toss impact analysis (bat vs field first)
  - Venue performance statistics
  - Head-to-head team comparisons
  - Historical win percentage progression
- **Interactive Visualizations**: Charts powered by Chart.js
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

## 🛠️ Technology Stack

### Frontend
- **React** 18.2.0
- **React Router DOM** 6.x
- **Axios** for API calls
- **Chart.js** & **react-chartjs-2** for data visualization
- **CSS3** with custom responsive design

### Backend
- **Node.js** with **Express.js** framework
- **MySQL2** for database connectivity
- **CORS** enabled
- **dotenv** for environment management

### Database
- **MySQL 8.0**
- **8 normalized tables** (3NF compliance)
- **6 database views** for optimized analytics
- **Foreign key constraints** for referential integrity

## 📊 Database Schema

### Core Tables
- `season` - IPL season information and awards
- `team` - Team details and home grounds
- `raw_matches` - Complete match-level data
- `points_table` - Season-wise team standings
- `historical_ranking` - Cumulative performance tracking
- `overall_ranking` - All-time team statistics
- `venue` - Stadium information with pitch characteristics
- `venue_analytics_view` - Aggregated venue statistics

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/utkarshp52/ipl-analytics.git
cd ipl-analytics
```

2. **Database Setup**
```bash
# Import the database
mysql -u root -p < database/ipl_analytics.sql

# Or manually create database and import your data
mysql -u root -p
CREATE DATABASE ipl_management;
USE ipl_management;
source database/ipl_analytics.sql;
```

3. **Backend Setup**
```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Edit .env with your database credentials
nano .env
```

**Backend `.env` file:**
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ipl_management
DB_PORT=3306
```
```bash
# Start backend server
npm run dev
```

Backend will run on `http://localhost:5000`

4. **Frontend Setup**
```bash
cd frontend
npm install

# Start frontend
npm start
```

Frontend will run on `http://localhost:3000`

## 📡 API Endpoints

### Season Endpoints
- `GET /api/seasons` - Get all seasons
- `GET /api/seasons/:id` - Get season by ID
- `GET /api/seasons/:id/points` - Get points table
- `GET /api/seasons/:id/matches` - Get season matches

### Team Endpoints
- `GET /api/teams` - Get all teams
- `GET /api/teams/:id` - Get team by ID
- `GET /api/teams/:id/history` - Get historical performance
- `GET /api/teams/:id/best-season` - Get best season
- `GET /api/teams/:id/stats` - Get overall stats

### Match Endpoints
- `GET /api/matches` - Get all matches (with filters)
- `GET /api/matches/:id` - Get match by ID
- `GET /api/matches/super-overs` - Get super over matches
- `GET /api/matches/finals` - Get final matches
- `GET /api/matches/highest-margins` - Get highest win margins

### Analytics Endpoints
- `GET /api/analytics/overall-ranking` - Overall team rankings
- `GET /api/analytics/toss-impact` - Toss impact analysis
- `GET /api/analytics/venue-stats` - Venue statistics
- `GET /api/analytics/head-to-head?team1=X&team2=Y` - H2H comparison
- `GET /api/analytics/season-awards` - Season awards
- `GET /api/analytics/venues` - All venues

**Total: 24 API endpoints**

## 🎯 Key Features Breakdown

### 1. Season Analytics
- View all IPL seasons chronologically
- Awards display (Orange Cap, Purple Cap, Player of Series)
- Points table with team rankings
- Complete match list per season

### 2. Team Performance
- All-time rankings by total wins
- Historical win percentage progression (line chart)
- Best performing season highlight
- Cumulative statistics tracking

### 3. Match Insights
- Filter matches by season, team, or limit
- Super over match tracking
- Final matches showcase
- Highest victory margins

### 4. Advanced Analytics
- **Toss Impact**: Win percentage when batting/fielding first
- **Venue Analysis**: Matches hosted, pitch types, average scores
- **Head-to-Head**: Direct team comparison with interactive selection
- **Historical Trends**: Win percentage evolution over seasons

## 📸 Screenshots
![Home Page](/Screenshots/image.png)
![Seasons Page ](/Screenshots/image-1.png)
![Teams Page](/Screenshots/image-2.png)
![Analyics Page](/Screenshots/image-3.png)
![Head to Head Page](/Screenshots/image-4.png)
- Home Page
- Overall Rankings
- Team Detail with Historical Chart
- Analytics Dashboard
- Head-to-Head Comparison

## 🗂️ Project Structure
```
ipl-analytics/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── seasonController.js
│   │   ├── teamController.js
│   │   ├── matchController.js
│   │   └── analyticsController.js
│   ├── routes/
│   │   ├── seasons.js
│   │   ├── teams.js
│   │   ├── matches.js
│   │   └── analytics.js
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── .env
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Loader.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Seasons.jsx
│   │   │   ├── SeasonDetail.jsx
│   │   │   ├── Teams.jsx
│   │   │   ├── TeamDetail.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── OverallRanking.jsx
│   │   │   └── HeadToHead.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   │   └── teamLogos.js
│   │   ├── styles/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── database/
│   └── ipl_analytics.sql
└── README.md
```

## 🔧 SQL Techniques Used

- **JOIN Operations**: Complex multi-table joins
- **Aggregate Functions**: SUM, COUNT, AVG, ROUND
- **Window Functions**: RANK() OVER for rankings
- **CASE Statements**: Conditional logic for analytics
- **GROUP BY & HAVING**: Data aggregation
- **Subqueries**: Nested queries for complex analytics
- **Views**: Pre-computed analytics for performance
- **Foreign Keys**: Referential integrity

## 📝 Database Normalization

The database follows **Third Normal Form (3NF)**:
- No repeating groups
- No partial dependencies
- No transitive dependencies
- Proper primary and foreign key relationships

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



## 👥 Authors

- **Utkarsh Patkotwar** - *Initial work* - [YourGitHub](https://github.com/utkarshp52)

## 🙏 Acknowledgments

- IPL data sources
- React community
- Express.js documentation
- Chart.js for visualization library
- Wikipedia for team logos

## 📧 Contact

Your Name - Utkarsh Patkotwar (utkarshpatkotwar@gmail.com)

Project Link: [https://github.com/utkarshp52/ipl-analytics](https://github.com/utkarshp52/ipl-analytics)

---

⭐ **If you found this project helpful, please give it a star!** ⭐