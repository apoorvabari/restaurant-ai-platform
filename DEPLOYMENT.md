# Restaurant AI Platform - Deployment Guide

## Overview
This repository contains a Restaurant Management System with:
- **Frontend**: React + Vite application with Redux, Auth0 authentication
- **Backend**: Spring Boot Java application with MySQL database, WebSocket support

## Prerequisites
- Node.js (v20 or higher)
- Java 21
- Maven 3.6+
- MySQL 8.0+
- Git

## Local Development Setup

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env
```

Edit `.env` file and set:
```
VITE_API_BASE_URL=http://localhost:8080/api
```

4. **Run development server:**
```bash
npm run dev
```

Frontend will be available at: `http://localhost:5173`

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend/com.apoorva.restaurant
```

2. **Set up MySQL database:**
```sql
CREATE DATABASE IF NOT EXISTS restaurant_db;
```

3. **Set up environment variables:**
```bash
cp .env.example .env
```

Edit `.env` file and set:
```
DB_URL=jdbc:mysql://localhost:3306/restaurant_db?createDatabaseIfNotExist=true
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
PORT=8080
JWT_SECRET=your-secret-key-min-256-bits
JWT_EXPIRATION=86400000
```

4. **Build and run:**
```bash
mvn clean install
mvn spring-boot:run
```

Backend will be available at: `http://localhost:8080`

API Documentation: `http://localhost:8080/swagger-ui.html`

## Production Deployment

### Frontend Deployment (GitHub Pages)

**Already configured!** The frontend is set up for automatic deployment to GitHub Pages.

1. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Set Source to "GitHub Actions"
   - Save

2. **Automatic deployment:**
   - Push to `frontend` branch triggers automatic deployment
   - Site will be available at: `https://apoorvabari.github.io/restaurant-ai-platform/`

3. **Environment variables for production:**
   - Set `VITE_API_BASE_URL` to your deployed backend URL
   - Example: `https://your-backend.onrender.com/api`

### Backend Deployment (Render - Free)

**Configuration files already created!** Use Render.yaml for deployment.

1. **Create a Render account:**
   - Go to https://render.com
   - Sign up (free tier available)

2. **Deploy using Render.yaml:**
   - Connect your GitHub repository
   - Render will automatically detect the render.yaml file
   - It will create:
     - Web service for the Spring Boot app
     - PostgreSQL database (free tier)

3. **Environment variables:**
   - Render will automatically set database connection variables
   - Generate a secure JWT_SECRET
   - Set JWT_EXPIRATION to 86400000

4. **Backend URL:**
   - After deployment, Render will provide a URL like: `https://restaurant-backend.onrender.com`
   - Use this URL for frontend's `VITE_API_BASE_URL`

## Alternative Backend Deployment Options

### Railway (Free)
1. Create account at https://railway.app
2. Connect GitHub repository
3. Railway will detect the Spring Boot app
4. Add PostgreSQL database
5. Set environment variables

### Fly.io (Free tier available)
1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Login: `fly auth login`
3. Deploy: `fly launch`
4. Set environment variables via dashboard

## Running the Full Application

### Option 1: Local Development
1. Start MySQL database
2. Start backend (port 8080)
3. Start frontend (port 5173)
4. Access at: `http://localhost:5173`

### Option 2: Production
1. Deploy backend to Render/Railway
2. Deploy frontend to GitHub Pages
3. Update frontend environment variable with backend URL
4. Access at: `https://apoorvabari.github.io/restaurant-ai-platform/`

## Common Issues

### Frontend Issues
- **CORS errors**: Ensure backend allows CORS from your frontend domain
- **API connection failures**: Check `VITE_API_BASE_URL` is correct
- **Build failures**: Run `npm run build` locally to test

### Backend Issues
- **Database connection**: Verify MySQL is running and credentials are correct
- **Port conflicts**: Change `server.port` in application.properties if needed
- **JWT errors**: Ensure JWT_SECRET is set and is at least 256 bits

## Security Notes

- **Never commit** `.env` files or sensitive credentials
- **Change** default JWT_SECRET in production
- **Use** strong database passwords
- **Enable** HTTPS in production
- **Configure** CORS properly for production domains

## Support

For issues or questions:
- Check GitHub Issues: https://github.com/apoorvabari/restaurant-ai-platform/issues
- Review API documentation at `/swagger-ui.html` when backend is running
- Check browser console for frontend errors
- Check backend logs for server errors
