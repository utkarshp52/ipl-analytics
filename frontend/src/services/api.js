import axios from 'axios';

// Base URL for API
const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================
// SEASON APIs
// ============================================
export const getAllSeasons = () => api.get('/seasons');
export const getSeasonById = (id) => api.get(`/seasons/${id}`);
export const getSeasonPoints = (id) => api.get(`/seasons/${id}/points`);
export const getSeasonMatches = (id) => api.get(`/seasons/${id}/matches`);

// ============================================
// TEAM APIs
// ============================================
export const getAllTeams = () => api.get('/teams');
export const getTeamById = (id) => api.get(`/teams/${id}`);
export const getTeamHistory = (id) => api.get(`/teams/${id}/history`);
export const getTeamBestSeason = (id) => api.get(`/teams/${id}/best-season`);
export const getTeamStats = (id) => api.get(`/teams/${id}/stats`);

// ============================================
// MATCH APIs
// ============================================
export const getAllMatches = (params) => api.get('/matches', { params });
export const getMatchById = (id) => api.get(`/matches/${id}`);
export const getSuperOverMatches = () => api.get('/matches/super-overs');
export const getFinalMatches = () => api.get('/matches/finals');
export const getHighestMargins = () => api.get('/matches/highest-margins');

// ============================================
// ANALYTICS APIs
// ============================================
export const getOverallRanking = () => api.get('/analytics/overall-ranking');
export const getTossImpact = () => api.get('/analytics/toss-impact');
export const getVenueStats = () => api.get('/analytics/venue-stats');
export const getHeadToHead = (team1, team2) => 
  api.get(`/analytics/head-to-head?team1=${team1}&team2=${team2}`);
export const getSeasonAwards = () => api.get('/analytics/season-awards');
export const getSeasonRanking = (seasonId) => api.get(`/analytics/season-ranking/${seasonId}`);
export const getAllVenues = () => api.get('/analytics/venues');
export const getVenueDetail = (venueId) => api.get(`/analytics/venue/${venueId}`);

export default api;