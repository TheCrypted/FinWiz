
# FinWiz: Global Financial Analysis Platform

FinWiz is a comprehensive platform for analyzing global financial, educational, and developmental data. The application provides interactive visualizations and analysis tools for exploring economic indicators across countries.

Live Demo: [https://thecrypted.github.io/FinWiz/](https://thecrypted.github.io/FinWiz/)

## Installation and Setup

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL
- MongoDB
- npm or yarn

### Client Setup (Vite + React)
```
cd client
npm install
npm run dev
```

The client will run on `http://localhost:5173`

### Server Setup (Node + Express)
```
cd server
npm install
npm run dev
```

The server will run on `http://localhost:3000`

### Environment Variables
Create `.env` files in both client and server directories:

Server `.env`:
```
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_NAME=your_database_name
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

Client `.env`:
```
VITE_API_URL=http://localhost:3000
```

## Backend Configuration

The backend endpoint configuration is managed through a `src/backend.json` file located in the client directory:

```
/client
  /src
      backend.json
  package.json
```

This file contains the API endpoint URL that the frontend uses to communicate with the backend server. When deploying to a new environment or changing the backend location, you'll need to modify this file to point to the new backend endpoint.

default `backend.json`:
```json
{
  "HOST_AWS": "23.20.245.201",
  "PORT_AWS": "443"
}
```

**Note**: For local development, this should be changed too `http://localhost:3000`, while for production it should point to your deployed backend URL.

## Usage Guide

### Homepage Navigation
- Access the interactive world map
- Click on any country to select it
- Use bottom navigation links [IMF Indicator, Education Indicator] for detailed views

### Detailed Views
- Navigate through IMF and Education indicator pages
- Use footer links for additional features
- View comprehensive statistics and visualizations

### Authentication
- Click signin button
- Login credentials for testing:
  - Username: Aman
  - Password: test1234
- Access portfolio features after login

### Portfolio Management
- Click top search section
- Enter stock ticker symbol
- Select stock from results
- Enter volume in popup
- Press "Enter" to add to portfolio

### Country Rankings
- Click countries in top rankings
- Use "Rank By Indicator" for custom rankings
- Enter custom search terms
- Sort and filter rankings

## Features

### Core Features
- Interactive global heatmap
- Country-specific dashboards
- Dynamic graphing tools
- Stock portfolio simulation
- Ranking and analysis tools
- Predictive analytics

### Technical Features
- JWT-based authentication
- Hybrid SQL/NoSQL database architecture
- Real-time web scraping
- SSL certification
- GitHub Actions CI/CD pipeline
- AWS EC2 deployment

## Architecture

### Frontend
- React with Vite
- Material-UI components
- D3.js for visualizations
- Redux for state management

### Backend
- Node.js with Express
- PostgreSQL for primary data
- MongoDB for cache storage
- JWT authentication
- RESTful API design
