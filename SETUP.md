# SolarAfrica Planner - Setup Guide

This guide will help you set up both the frontend (Next.js) and backend (Node.js) for the SolarAfrica Planner application.

## Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

## Quick Start

### 1. Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/solar_africa_db"
   JWT_SECRET="your-super-secret-jwt-key-change-in-production"
   JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-in-production"
   FRONTEND_URL="http://localhost:3000"
   PORT=5000
   ```

4. **Set up the database**:
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push database schema (creates tables)
   npm run db:push
   
   # Seed the database with device catalog
   npx tsx prisma/seed.ts
   ```

5. **Start the backend server**:
   ```bash
   npm run dev
   ```
   
   Backend will be running at `http://localhost:5000`

### 2. Frontend Setup

1. **Navigate to root directory** (if you were in backend):
   ```bash
   cd ..
   ```

2. **Install frontend dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
   ```

4. **Start the frontend server**:
   ```bash
   npm run dev
   ```
   
   Frontend will be running at `http://localhost:3000`

## Verification

1. **Check Backend Health**:
   Visit `http://localhost:5000/api/health` - you should see a JSON response with success: true

2. **Check Frontend**:
   Visit `http://localhost:3000` - you should see the SolarAfrica Planner landing page

3. **Test Registration**:
   - Go to `http://localhost:3000/auth?mode=signup`
   - Create a new account
   - You should be redirected to the dashboard

4. **Test Calculator**:
   - Go to `http://localhost:3000/calculator`
   - Complete the 4-step solar planning process
   - View your calculated results with charts

## Available Features

### ✅ Completed Features

#### Frontend
- **Landing Page**: Hero section with African sunset theme
- **Authentication**: Login/signup with email and password
- **Calculator**: 4-step solar planning wizard
  - Category selection (Home/Business/Farm)
  - Device selection with multi-select capability
  - Review inputs step
  - Results with interactive charts and tabs
- **Dashboard**: View and manage saved solar plans
- **About Page**: Mission and company information
- **FAQ & Contact**: Support pages
- **Responsive Design**: Mobile-first with Tailwind CSS

#### Backend
- **Authentication API**: JWT-based with refresh tokens
- **Solar Calculation Engine**: Advanced algorithms for system sizing
- **Plan Management**: CRUD operations for solar plans
- **Device Catalog**: Database of solar-compatible devices
- **Financial Modeling**: ROI, payback, cost breakdown calculations
- **Environmental Impact**: CO₂ reduction calculations
- **Data Validation**: Comprehensive input validation
- **Security**: Rate limiting, CORS, helmet protection

### 🔧 API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login  
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

#### Calculator
- `POST /api/calculator/calculate` - Calculate solar system
- `GET /api/calculator/devices` - Get device catalog
- `GET /api/calculator/sunlight?location=Kenya` - Get sunlight data

#### Plans  
- `POST /api/plans` - Create solar plan
- `GET /api/plans` - Get user's plans
- `GET /api/plans/:id` - Get specific plan
- `PUT /api/plans/:id` - Update plan
- `DELETE /api/plans/:id` - Delete plan

## Development Commands

### Backend Commands
```bash
cd backend

# Development
npm run dev              # Start with hot reload
npm run build           # Build TypeScript
npm start              # Start production server

# Database
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema changes
npm run db:studio      # Open Prisma Studio
npm run db:migrate     # Create migration

# Utilities
npm run lint           # Run ESLint
npm test              # Run tests
```

### Frontend Commands
```bash
# Development  
npm run dev            # Start Next.js dev server
npm run build         # Build for production
npm start            # Start production server

# Utilities
npm run lint          # Run ESLint
```

## Database Schema

Key tables:
- **users**: User accounts and preferences
- **solar_plans**: Solar energy plans with calculations  
- **devices**: Devices associated with plans
- **calculations**: Stored calculation results
- **device_catalog**: Available devices database
- **refresh_tokens**: JWT refresh token storage

## Technology Stack

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Lucide React** for icons

### Backend
- **Node.js** with TypeScript
- **Express.js** web framework
- **PostgreSQL** with Prisma ORM
- **JWT** authentication
- **bcrypt** password hashing
- **Winston** logging

## Production Deployment

### Backend Deployment
1. Set production environment variables
2. Run database migrations: `npm run db:migrate`
3. Build the application: `npm run build`
4. Start with PM2 or similar process manager

### Frontend Deployment
1. Update API URL in environment variables
2. Build the application: `npm run build`
3. Deploy to Vercel, Netlify, or similar platform

## Troubleshooting

### Common Issues

1. **Database Connection Failed**:
   - Check PostgreSQL is running
   - Verify DATABASE_URL in `.env`
   - Ensure database exists

2. **CORS Errors**:
   - Check FRONTEND_URL matches your frontend URL
   - Verify API URL in frontend `.env.local`

3. **Authentication Issues**:
   - Clear browser localStorage
   - Check JWT secrets are set
   - Verify cookies are enabled

4. **Port Already in Use**:
   - Kill process on port 5000: `lsof -ti:5000 | xargs kill -9`
   - Change PORT in backend `.env`

### Support

For issues:
1. Check the browser console for errors
2. Check backend logs for API errors
3. Verify environment variables are set correctly
4. Ensure all dependencies are installed

## Next Steps

The application is now fully functional with:
- ✅ Complete authentication system
- ✅ Advanced solar calculation engine  
- ✅ Plan management and storage
- ✅ Interactive charts and visualizations
- ✅ Responsive design for all devices
- ✅ Secure API with validation

You can now register users, create solar plans, view detailed calculations, and manage saved plans through the dashboard!