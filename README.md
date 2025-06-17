# DermaTech Care

A comprehensive dermatology care platform with AI diagnostics, telemedicine, and patient management features.

## Features

- 🔐 **Authentication System** - Secure user registration and login
- 🤖 **AI Diagnostics** - Advanced skin condition analysis
- 📱 **Telemedicine** - Virtual consultations with dermatologists
- 📊 **Analytics Dashboard** - Comprehensive health metrics
- 💊 **Pharmacy Integration** - Medication ordering and management
- 🔔 **Notifications** - Real-time updates and reminders

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL (Neon)
- **Authentication**: JWT tokens
- **UI Components**: Radix UI, Lucide React
- **Deployment**: Render

## Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd DermatechCare
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5000`

## Deployment to Render

### Prerequisites
- GitHub account
- Render account
- PostgreSQL database (we're using Neon)

### Step-by-Step Deployment

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy on Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" and select "Web Service"
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` file

3. **Environment Variables**
   The following environment variables will be automatically configured from `render.yaml`:
   - `NODE_ENV=production`
   - `DATABASE_URL` (your Neon PostgreSQL connection string)
   - `JWT_SECRET` (auto-generated)
   - `SESSION_SECRET` (auto-generated)

4. **Deployment Process**
   - Build Command: `npm ci && npm run build`
   - Start Command: `npm start`
   - Health Check: `/health`

### Manual Environment Variable Setup (if needed)

If you need to manually set environment variables in Render:

1. Go to your service dashboard
2. Navigate to "Environment" tab
3. Add the following variables:
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: `your_neon_postgresql_url`
   - `JWT_SECRET`: `your_secure_jwt_secret`
   - `SESSION_SECRET`: `your_secure_session_secret`

## Build Commands

- **Development**: `npm run dev`
- **Build**: `npm run build`
- **Production**: `npm start`
- **Type Check**: `npm run check`
- **Database Push**: `npm run db:push`

## Project Structure

```
DermatechCare/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   └── lib/            # Utility functions
├── server/                 # Express backend
│   ├── routes.ts           # API routes
│   ├── db.ts              # Database configuration
│   ├── storage.ts         # Data access layer
│   └── index.ts           # Server entry point
├── shared/                 # Shared types and schemas
├── render.yaml            # Render deployment configuration
└── package.json           # Dependencies and scripts
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/user` - Get current user

### Health Checks
- `GET /` - Basic status check
- `GET /health` - Detailed health check

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Database Schema

The application uses PostgreSQL with the following main tables:
- `users` - User accounts and profiles
- `appointments` - Medical appointments
- `health_records` - Patient health records
- `ai_diagnoses` - AI diagnostic results
- `pharmacy_orders` - Medication orders
- `notifications` - System notifications

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.