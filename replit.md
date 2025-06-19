# DermaTech Care

## Overview

DermaTech Care is a comprehensive dermatology platform that combines AI-powered diagnostics, telemedicine, pharmacy integration, and patient management. The application provides a complete healthcare ecosystem with advanced features like blockchain security, ABHA integration, and multi-modal communication including AR/VR capabilities.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with custom medical-themed color palette
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Authentication**: JWT-based authentication with biometric support

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for type safety
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT tokens with session storage
- **Password Security**: bcrypt for password hashing
- **File Uploads**: Support for medical images and documents

### Database Design
- **ORM**: Drizzle with PostgreSQL
- **Schema**: Comprehensive medical data model including:
  - User management with ABHA ID integration
  - Appointment scheduling system
  - Health records and AI diagnosis storage
  - Pharmacy inventory and order management
  - Blockchain transaction tracking
  - Analytics and performance metrics

## Key Components

### Authentication System
- Multi-factor authentication with OTP support
- Biometric authentication capabilities (WebAuthn ready)
- ABHA (Ayushman Bharat Health Account) integration
- Role-based access control (Patient, Doctor, Admin, Pharmacy)

### AI Diagnostics Module
- Advanced skin condition analysis
- Image processing and ML model integration
- Confidence scoring and risk assessment
- Doctor review workflow for critical cases

### Telemedicine Platform
- Video consultation capabilities
- AR/VR session support for immersive consultations
- Real-time communication tools
- Session recording and playback features

### Pharmacy Integration
- 2000+ pharmacy partner network
- Real-time inventory management
- Prescription verification system
- Order tracking and delivery management

### Analytics Dashboard
- Patient demographics and trends
- Appointment analytics
- AI model performance metrics
- Financial and operational insights

## Data Flow

1. **User Registration/Login**: Users authenticate through traditional login or ABHA integration
2. **Health Data Collection**: Patients upload medical images and health information
3. **AI Processing**: Images are processed by ML models for initial diagnosis
4. **Doctor Review**: AI results are reviewed by qualified dermatologists
5. **Treatment Planning**: Doctors create treatment plans and prescriptions
6. **Pharmacy Integration**: Prescriptions are sent to partner pharmacies
7. **Follow-up Care**: Patients receive ongoing monitoring and support

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Neon PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI component primitives
- **bcrypt**: Password hashing
- **jsonwebtoken**: JWT token management

### Development Tools
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler
- **cross-env**: Cross-platform environment variables
- **drizzle-kit**: Database migration and schema management

### UI and Styling
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **clsx**: Conditional className utility
- **lucide-react**: Icon library

## Deployment Strategy

### Production Deployment
- **Platform**: Render.com with automatic deployments
- **Database**: Neon PostgreSQL (serverless)
- **Build Process**: 
  - Frontend: Vite build to `dist/public`
  - Backend: esbuild compilation to `dist/index.js`
- **Environment Variables**:
  - `DATABASE_URL`: Neon PostgreSQL connection string
  - `JWT_SECRET`: Auto-generated secure token
  - `SESSION_SECRET`: Auto-generated session secret
  - `NODE_ENV`: Set to production

### Development Environment
- **Hot Reload**: Vite dev server with HMR
- **Database**: Shared Neon PostgreSQL instance
- **Port**: 5000 for unified development server
- **Build Monitoring**: Real-time error overlay and logging

### Health Monitoring
- Health check endpoints at `/health` and `/api/health`
- Comprehensive error logging and monitoring
- Performance metrics tracking

## Changelog

- June 19, 2025: Migration to Replit environment completed
  - Database connectivity established with Neon PostgreSQL
  - All routing and navigation configured
  - AI diagnostics page accessible at /ai-diagnostics
- June 19, 2025: Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.