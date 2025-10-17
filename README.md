# ReviewBoard

A comprehensive review management system with automated workflows, risk scoring, and role-based access control.

## Technology Stack

![Next.js](https://img.shields.io/badge/Next.js-15.5.5-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38bdf8?style=flat-square&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-6.17.1-2D3748?style=flat-square&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?style=flat-square&logo=postgresql)
![NextAuth.js](https://img.shields.io/badge/NextAuth.js-JWT-black?style=flat-square)

**Frontend:** Next.js 15.5.5, React 19, TypeScript, Tailwind CSS  
**Backend:** Next.js API Routes (REST), NextAuth.js (JWT Authentication)  
**Database:** PostgreSQL with Prisma ORM  
**Infrastructure:** Vercel (Deployment), Supabase (Database Hosting)  
**Automation:** Cron-job.org (Scheduled Tasks)

## Overview

ReviewBoard is an enterprise-grade review management platform designed to streamline item submission, review, and approval workflows.

## APP Preview

### From User Role

### From Reviewer Role

### From Admin Role

## Key Features

### Authentication & Authorization

- **Secure Authentication**: Email/password and OAuth (GitHub) support via NextAuth.js
- **JWT Sessions**: Stateless authentication with JWT tokens
- **Email Verification**: Account verification system for new users
- **Role-Based Access Control**: Three distinct user roles (User, Reviewer, Admin)

### Item Management

- **Create & Submit**: Users can create items with title, description, amount, and tags
- **Automated Risk Scoring**: Real-time risk calculation based on configurable rules
- **Tag System**: Categorize items with color-coded tags
- **Status Tracking**: Four-stage workflow (NEW → IN_REVIEW → APPROVED/REJECTED)
- **Item Filtering**: Filter by status, tags, risk level, and search by title

### Automated Workflows

- **Status Auto-Progression**: Items automatically move from NEW to IN_REVIEW after 30 minutes
- **Scheduled Execution**: Cron job runs every 10 minutes via external service
- **System Audit Logging**: All automated changes are logged with special designation
- **Bearer Token Authentication**: Secure cron endpoint with CRON_SECRET

### Risk Scoring System

- **Amount-Based Rules**: Calculate risk scores based on transaction amounts
- **Tag-Based Rules**: Assign risk scores to specific tags
- **Dynamic Calculation**: Risk scores automatically calculated on item creation/update
- **Visual Indicators**: Color-coded risk levels (Low: 0-30, Medium: 31-70, High: 71-100)

### Review System

- **Reviewer Dashboard**: Dedicated interface for reviewing pending items
- **Bulk Actions**: Approve or reject items with comments
- **Audit Trail**: All status changes tracked with user information
- **Statistics**: Real-time metrics for items by status and user activity

### Administrative Controls

- **User Management**: Create, update, delete users and assign roles
- **Rule Configuration**: Define and manage amount and tag-based scoring rules
- **Tag Management**: Create, update, and organize tags with colors
- **Audit Log Viewer**: Comprehensive audit trail with filtering and pagination
- **System Information**: Detailed documentation of tech stack and workflows

### Audit & Compliance

- **Complete Audit Trail**: Every action logged with timestamp and user
- **Action Types**: CREATED, STATUS_CHANGED, STATUS_CHANGED_BY_SYSTEM, UPDATED
- **Pagination**: Efficient browsing of large audit log datasets
- **Filtering**: Filter by action type, user, item, and date range
- **System vs Manual**: Clear distinction between automated and manual changes

## User Roles & Permissions

### User (Standard)

Users represent the primary actors who submit items for review.

**Permissions:**

- Create new items with tags and amounts
- View and edit their own items
- Track item status through the workflow
- View personal statistics and metrics

**Access Restrictions:**

- Cannot view other users' items
- Cannot approve or reject items
- Cannot access admin or reviewer dashboards

### Reviewer

Reviewers are responsible for evaluating submitted items and making approval decisions.

**Permissions:**

- View all submitted items across the system
- Approve or reject items with comments
- Access reviewer dashboard with statistics
- Filter and search through all items
- View detailed item information and risk scores

**Access Restrictions:**

- Cannot manage system configuration
- Cannot create or modify rules
- Cannot manage users or tags

### Administrator

Administrators have full system access and management capabilities.

**Permissions:**

- All reviewer permissions
- User management (create, update, delete, role assignment)
- Rule configuration (amount rules, tag rules)
- Tag management (create, update, delete, color customization)
- Audit log access (view all system activity)
- System information access
- Access to all administrative dashboards

## Database Schema

### Core Models

- **User**: Authentication and profile information with role assignment
- **Item**: Submitted items with status tracking and risk scores
- **Tag**: Categorization system with color coding
- **Rule**: Risk scoring configuration (amount-based and tag-based)
- **AuditLog**: Complete activity history with action types
- **Account**: OAuth provider connections
- **Session**: NextAuth.js session management
- **VerificationToken**: Email verification tokens

### Key Relationships

- Users can have multiple Items (one-to-many)
- Items can have multiple Tags (many-to-many)
- Items have multiple AuditLogs (one-to-many)
- AuditLogs reference both User and Item (many-to-one)

## Setup & Installation

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- SMTP server for email verification
- GitHub OAuth application (optional)

### Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database?pgbouncer=true"
DIRECT_URL="postgresql://user:password@host:port/database"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# OAuth (Optional)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Email (SMTP)
EMAIL_SERVER=smtp://[your-gmail].com:[your-google-app-password]@smtp.gmail.com:587
EMAIL_FROM=your-gmail

# Cron Job
CRON_SECRET=your-cron-secret-key
```

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd reviewboard
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up database**

   ```bash
   npx prisma generate
   npm prisma migrate --name initial
   ```

4. **Run development server**

   ```bash
   npm run dev
   ```

## Deployment

### Vercel Deployment

1. Push code to GitHub repository
2. Import project in Vercel dashboard
3. Configure environment variables in Vercel settings
4. Deploy automatically on push to main branch

### Cron Job Configuration

1. Create account at [cron-job.org](https://console.cron-job.org/)
2. Create new cron job with endpoint: `https://your-domain.com/api/crons/item-status-scheduler`
3. Set schedule to `*/10 * * * *` (every 10 minutes)
4. Add header: `Authorization: Bearer CRON_SECRET`

## Security Features

- **Authentication**: Secure JWT-based sessions with NextAuth.js
- **Password Hashing**: Bcrypt encryption for stored passwords
- **Email Verification**: Prevents unauthorized account creation
- **Role-Based Access**: Strict permission enforcement on API routes
- **Cron Security**: Bearer token authentication for automated endpoints
- **SQL Injection Protection**: Prisma ORM parameterized queries
- **CSRF Protection**: Built-in NextAuth.js CSRF tokens

## Performance Optimizations

- **Server-Side Rendering**: Fast initial page loads with Next.js SSR
- **Pagination**: Efficient data loading for large datasets
- **Database Indexing**: Optimized queries on frequently accessed columns
- **Connection Pooling**: PgBouncer for efficient database connections
- **API Caching**: Strategic use of caching for static data

## Audit & Compliance

The system maintains a complete audit trail of all actions:

- **User Actions**: Every create, update, and delete operation
- **Status Changes**: Manual and automated status transitions
- **System Events**: Automated processes and cron job executions
- **User Attribution**: All actions linked to responsible user or system
- **Timestamps**: Precise timing for all events
- **Filtering**: Advanced search and filter capabilities
