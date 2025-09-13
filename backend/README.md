# SolarAfrica Planner Backend

A comprehensive Node.js backend API for the SolarAfrica Planner application with user management, solar calculations, plan storage, and integration capabilities.

## Features

- **Authentication System**: JWT-based auth with refresh tokens
- **Solar Calculation Engine**: Advanced algorithms for system sizing and cost analysis
- **Plan Management**: Create, update, delete, and share solar plans
- **Device Catalog**: Comprehensive database of solar-compatible devices
- **Financial Modeling**: ROI, payback period, and cost breakdown calculations
- **Environmental Impact**: CO₂ reduction and sustainability metrics

## Technology Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + bcrypt
- **Validation**: Zod + express-validator
- **Security**: Helmet, CORS, rate limiting
- **Logging**: Winston

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. **Install dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your database URL and other configuration:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/solar_africa_db"
   JWT_SECRET="your-super-secret-jwt-key"
   JWT_REFRESH_SECRET="your-super-secret-refresh-key"
   FRONTEND_URL="http://localhost:3000"
   ```

3. **Set up the database**:
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push database schema
   npm run db:push
   
   # Seed the database
   npx tsx prisma/seed.ts
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Calculator
- `POST /api/calculator/calculate` - Calculate solar system
- `GET /api/calculator/devices` - Get device catalog
- `GET /api/calculator/sunlight?location=Kenya` - Get sunlight data

### Plans
- `POST /api/plans` - Create solar plan
- `GET /api/plans` - Get user's plans (paginated)
- `GET /api/plans/:id` - Get specific plan
- `PUT /api/plans/:id` - Update plan
- `DELETE /api/plans/:id` - Delete plan
- `POST /api/plans/:id/duplicate` - Duplicate plan
- `POST /api/plans/:id/share` - Share plan
- `GET /api/plans/shared/:token` - View shared plan

### Health Check
- `GET /api/health` - API health status

## Request/Response Format

### Authentication Required
Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Response Format
All API responses follow this structure:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "error": null
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "errors": [ ... ] // For validation errors
}
```

## Example Usage

### Calculate Solar System
```bash
curl -X POST http://localhost:5000/api/calculator/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "category": "HOME",
    "location": "Kenya",
    "sunlightHours": 6.2,
    "devices": [
      {
        "type": "LED Light Bulb",
        "quantity": 6,
        "hoursPerDay": 5,
        "powerConsumption": 10
      },
      {
        "type": "TV",
        "quantity": 1,
        "hoursPerDay": 4,
        "powerConsumption": 100
      }
    ]
  }'
```

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword",
    "name": "John Doe"
  }'
```

### Create Solar Plan
```bash
curl -X POST http://localhost:5000/api/plans \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "name": "My Home Solar Plan",
    "category": "HOME",
    "location": "Kenya",
    "sunlightHours": 6.2,
    "devices": [...]
  }'
```

## Database Schema

The application uses PostgreSQL with Prisma ORM. Key models include:

- **User**: User accounts and authentication
- **SolarPlan**: Solar energy plans with calculations
- **Device**: Devices associated with plans
- **Calculation**: Stored calculation results
- **Quote**: Quote requests from users
- **DeviceCatalog**: Available devices database

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

### Database Commands

```bash
# Reset database (development only)
npx prisma db push --force-reset

# View data in Prisma Studio
npm run db:studio

# Generate new migration
npx prisma migrate dev --name add-new-feature
```

## Deployment

### Environment Variables

Ensure these environment variables are set in production:

```env
NODE_ENV=production
DATABASE_URL=your-production-database-url
JWT_SECRET=your-production-jwt-secret
JWT_REFRESH_SECRET=your-production-refresh-secret
FRONTEND_URL=https://your-frontend-domain.com
```

### Production Setup

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. Set up a reverse proxy (nginx) for SSL and load balancing

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Configured for specific origins
- **Helmet**: Security headers
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Request validation and sanitization
- **Password Hashing**: bcrypt with 12 rounds
- **HTTP-only Cookies**: Secure refresh token storage

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run linting: `npm run lint`
6. Submit a pull request

## License

This project is licensed under the MIT License.