# FreeTutor - Free Tutor Pairing Platform

## Project Overview
FreeTutor is a web platform designed to connect students with special needs to volunteer tutors. The platform facilitates meaningful educational support by matching qualified tutors with students who need assistance.

## Core Objectives
- Provide free tutoring services to students with special needs
- Verify tutor qualifications through document validation
- Validate student needs through document verification
- Create a transparent matching process between students and tutors
- Facilitate communication and connection between matched pairs

## Key Features

### 1. User Registration & Authentication
**Student Registration:**
- Basic information (name, email, contact details)
- Educational level and subjects needed
- Document upload to verify special needs (e.g., IEP, medical documentation, school letters)
- Manual verification process by administrators

**Teacher/Tutor Registration:**
- Basic information (name, email, contact details)
- Educational background and qualifications
- Subjects they can teach
- Availability schedule
- Document upload to verify academic results (transcripts, certifications, degrees)
- Manual verification process by administrators

**Verification Process:**
- Admin dashboard to review uploaded documents
- Approval/rejection workflow
- Status notifications to users

### 2. Tutor Discovery Interface
**Browse Tutors:**
- Grid/list view of verified tutors
- Display key information:
  - Name and photo (optional)
  - Subjects taught
  - Education level
  - Availability
  - Brief bio/introduction
  - Ratings/reviews (future enhancement)

**Search & Filter:**
- Filter by subject
- Filter by availability
- Filter by education level
- Search by name or keywords

### 3. Pairing/Matching Process
**Student Selects Tutor:**
- View detailed tutor profile
- Express interest in connecting
- Send initial message/introduction

**Connection Workflow:**
- Student initiates contact request
- Tutor receives notification
- Tutor can accept/decline request
- Upon acceptance, contact information is shared
- Chat/messaging system for coordination (future enhancement)

## Technical Stack

### Frontend
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **UI Components:** shadcn/ui
- **State Management:** React Context API / Zustand
- **Form Handling:** React Hook Form + Zod validation

### Backend
- **API:** Next.js API Routes
- **Database:** PostgreSQL (via Prisma ORM)
- **Authentication:** NextAuth.js
- **File Storage:** AWS S3 / Cloudinary / Vercel Blob Storage
- **Email Service:** Resend / SendGrid

### Infrastructure
- **Hosting:** Vercel
- **Database Hosting:** Supabase / Neon / Railway
- **Version Control:** Git + GitHub

## Database Schema (Preliminary)

### Users Table
- id (UUID)
- email (unique)
- password_hash
- role (student/tutor/admin)
- verified (boolean)
- created_at
- updated_at

### Student Profiles
- id (UUID)
- user_id (FK)
- full_name
- grade_level
- subjects_needed (array)
- verification_documents (array of URLs)
- verification_status (pending/approved/rejected)
- verification_notes
- special_needs_description

### Tutor Profiles
- id (UUID)
- user_id (FK)
- full_name
- education_level
- subjects_taught (array)
- availability (JSON)
- bio
- verification_documents (array of URLs)
- verification_status (pending/approved/rejected)
- verification_notes

### Connection Requests
- id (UUID)
- student_id (FK)
- tutor_id (FK)
- status (pending/accepted/declined)
- message
- created_at
- updated_at

## Project Phases

### Phase 1: Foundation (Current)
- [ ] Project setup and configuration
- [ ] Basic project structure
- [ ] Documentation

### Phase 2: Authentication & Registration
- [ ] User authentication system
- [ ] Student registration flow
- [ ] Tutor registration flow
- [ ] Document upload functionality
- [ ] Email verification

### Phase 3: Admin Panel
- [ ] Admin authentication
- [ ] Document review interface
- [ ] User approval/rejection workflow
- [ ] User management dashboard

### Phase 4: Tutor Discovery
- [ ] Tutor listing page
- [ ] Tutor profile pages
- [ ] Search and filter functionality
- [ ] Responsive design

### Phase 5: Matching System
- [ ] Connection request functionality
- [ ] Request notifications
- [ ] Accept/decline workflow
- [ ] Contact information sharing

### Phase 6: Enhancement & Polish
- [ ] Email notifications
- [ ] User dashboard improvements
- [ ] Profile editing
- [ ] Testing and bug fixes
- [ ] Performance optimization

## Security Considerations
- Secure document storage with access control
- Data encryption in transit and at rest
- GDPR compliance for user data
- Input validation and sanitization
- Rate limiting on API endpoints
- Secure password hashing (bcrypt)
- Protection of sensitive user information

## Future Enhancements
- In-app messaging system
- Video call integration
- Rating and review system
- Calendar integration for scheduling
- Mobile app (React Native)
- Multi-language support
- Analytics dashboard for admins
- Automated matching suggestions based on needs and availability

## File Structure
```
freetutor/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── (auth)/            # Auth-related routes
│   │   ├── (dashboard)/       # Dashboard routes
│   │   ├── api/               # API routes
│   │   └── layout.tsx
│   ├── components/             # Reusable components
│   │   ├── ui/                # shadcn/ui components
│   │   ├── forms/             # Form components
│   │   └── layouts/           # Layout components
│   ├── lib/                    # Utility functions
│   │   ├── auth.ts
│   │   ├── db.ts
│   │   └── utils.ts
│   ├── types/                  # TypeScript types
│   └── hooks/                  # Custom React hooks
├── prisma/                     # Database schema
├── public/                     # Static assets
└── tests/                      # Test files
```

## Development Guidelines
- Use TypeScript for type safety
- Follow Next.js 14+ App Router conventions
- Implement responsive design (mobile-first)
- Write clean, maintainable code
- Comment complex logic
- Use environment variables for sensitive data
- Regular git commits with clear messages

## Environment Variables
```
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=
EMAIL_SERVER_HOST=
EMAIL_SERVER_PORT=
EMAIL_FROM=
```

## Getting Started
1. Clone repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run database migrations: `npx prisma migrate dev`
5. Start development server: `npm run dev`

## Contributing
This is a solo project for learning and community impact. Future contributors welcome!

---
**Last Updated:** 2025-11-29
**Version:** 1.0.0
