const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID ||
  '689833331699-h2ls70uu6jl7h7dlhb3rvl1gqbtrkrqg.apps.googleusercontent.com';
const ENABLE_GOOGLE_AUTH = process.env.REACT_APP_ENABLE_GOOGLE_AUTH === 'true';

export { API_BASE_URL, GOOGLE_CLIENT_ID, ENABLE_GOOGLE_AUTH };
