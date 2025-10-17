# ReviewBoard - Test Case

![Next.js](https://img.shields.io/badge/Next.js-15.5.5-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38bdf8?style=flat-square&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-6.17.1-2D3748?style=flat-square&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?style=flat-square&logo=postgresql)
![NextAuth.js](https://img.shields.io/badge/NextAuth.js-JWT-black?style=flat-square)

A comprehensive review management system with automated workflows, risk scoring, and role-based access control.

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

<img width="1700" height="825" alt="image" src="https://github.com/user-attachments/assets/c613a098-39cb-4918-ab97-901505543334" />

## Technology Stack

**Frontend:** Next.js 15.5.5, React 19, TypeScript, Tailwind CSS  
**Backend:** Next.js API Routes (REST), NextAuth.js (JWT Authentication)  
**Database:** PostgreSQL with Prisma ORM  
**Infrastructure:** Vercel (Deployment), Supabase (Database Hosting)  
**Automation:** Cron-job.org (Scheduled Tasks)

## Overview

ReviewBoard is an enterprise-grade review management platform designed to streamline item submission, review, and approval workflows.

## APP Preview

### User Perspective

#### Dashboard

<img width="1705" height="655" alt="image" src="https://github.com/user-attachments/assets/c9dbcc20-cd4c-4887-a4bf-8154e0e6fd40" />

#### Items

<img width="1698" height="479" alt="image" src="https://github.com/user-attachments/assets/e3f7996f-f794-41fe-9449-dc716cf3f54b" />

### Reviewer Perspective

#### Dashboard

<img width="1701" height="692" alt="image" src="https://github.com/user-attachments/assets/146f8bba-f9ef-4aaf-b941-4bff3ba5e8f9" />

#### Item Management

<img width="1696" height="548" alt="image" src="https://github.com/user-attachments/assets/8ec5d570-9191-4460-9882-7d50cdfba748" />

### Admin Perspective

#### Dashboard

<img width="1694" height="887" alt="image" src="https://github.com/user-attachments/assets/25b54a64-495f-4494-b3be-e6572ef9d455" />

#### Tag Management

<img width="1700" height="782" alt="image" src="https://github.com/user-attachments/assets/b251d222-b594-4f61-b78d-0c3a398fc8b1" />

#### Rule Management

<img width="1699" height="896" alt="image" src="https://github.com/user-attachments/assets/8b0f6cc5-e76a-4e61-b8dc-334bc2825a1d" />

#### New Rule

<img width="1698" height="884" alt="image" src="https://github.com/user-attachments/assets/873630fc-53ad-43a8-9203-0d5b25c298bf" />

#### Audit Logs

<img width="1701" height="867" alt="image" src="https://github.com/user-attachments/assets/897d7209-82de-4cd3-b468-528796030598" />

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
