# IPL Analytics - Backend API

Node.js + Express.js REST API for IPL Analytics System.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ipl_management
DB_PORT=3306
```

3. Start server:
```bash
npm run dev
```

## API Documentation

Base URL: `http://localhost:5000/api`

See main README for complete API endpoint documentation.

## Technologies

- Express.js 4.18+
- MySQL2 3.6+
- CORS
- dotenv