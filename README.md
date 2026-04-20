# Uni Ops

Uni Ops is a full-stack smart campus management system with a Spring Boot backend and a React + Vite frontend. It provides a foundation for modules like bookings, facilities, incidents, notifications, and users, with a simple health endpoint to verify system connectivity.

## Highlights
- Backend: Spring Boot 3.5.x, Java 17+, JPA, Security, OAuth2 Client
- Frontend: React 18, Vite 8, Tailwind CSS 4, React Router
- Dev-friendly: H2 in-memory database for local runs, Vite proxy to backend

## Repository Structure
```
backend/   # Spring Boot application
frontend/  # React + Vite application
```

## Prerequisites
- Java 17+ (Java 21+ works)
- Node.js 18+ and npm
- Maven (or use the Maven wrapper)

## Quick Start (Recommended)
### 1) Start the backend
```
cd backend
./mvnw.cmd spring-boot:run
```
The backend runs on `http://localhost:8086`.

### 2) Start the frontend
```
cd frontend
npm install
npm run dev
```
The frontend runs on `http://localhost:5173`.

### 3) Verify health
```
http://localhost:8086/api/health
```
Expected response:
```
{"status":"OK","message":"Backend is running"}
```

## Configuration
Backend config is in `backend/src/main/resources/application.properties`.
Key defaults:
- `server.port=8086`
- H2 in-memory DB enabled (no external DB required for dev)

## Frontend Scripts
From `frontend/`:
- `npm run dev` - Start Vite dev server
- `npm run build` - Production build
- `npm run preview` - Preview production build
- `npm run lint` - Lint code

## Backend Commands
From `backend/`:
- `./mvnw.cmd spring-boot:run` - Start Spring Boot
- `./mvnw.cmd test` - Run tests
- `./mvnw.cmd package` - Build jar

## Development Notes
- Vite proxies `/api` to the backend (`http://localhost:8086`).
- The health endpoint is implemented at `/api/health`.
- H2 Console is available at `/h2-console` when backend is running.

## Troubleshooting
- Port in use: change backend port in `application.properties` and update Vite proxy in `frontend/vite.config.js`.
- CSS build errors: ensure `@tailwindcss/postcss` is installed and `postcss.config.js` uses it.
- 404 at `http://localhost:5173`: confirm `frontend/index.html` exists and Vite is running.

## Roadmap Ideas
- Add module routes for bookings, facilities, incidents, users
- Add authentication and role-based access control
- Integrate MySQL for production

## License
Add your license information here.