# FreeTutor - Free Tutor Pairing Platform

## Project Overview
FreeTutor is a web platform designed to connect students with special needs to volunteer tutors. The platform facilitates meaningful educational support by matching qualified tutors with students who need assistance.

## Language & Localization
- **Primary Language:** Traditional Chinese (繁體中文, zh-HK)
- **Brand Name:** FreeTutor (kept in English)
- **UI/Content:** All user interface elements, descriptions, and content are in Traditional Chinese
- **HTML lang attribute:** zh-HK

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
- **Framework:** Next.js 16.0.5 (App Router)
- **Language:** TypeScript 5.9
- **Styling:** TailwindCSS v4.1
- **UI Components:** shadcn/ui (Button, Card, Badge, Input, Form components)
- **Form Handling:** React Hook Form + Zod validation
- **HTTP Client:** Native fetch API

### Backend
- **API:** Next.js API Routes
- **Database:** PostgreSQL via Supabase
- **ORM:** Prisma v7.0.1
- **Authentication:** Supabase Auth
- **File Storage:** Supabase Storage (planned)
- **Email Service:** Supabase Auth (built-in email)

### Infrastructure
- **Hosting:** Vercel (deployment ready)
- **Database Hosting:** Supabase (configured)
- **Version Control:** Git + GitHub
- **Region:** AWS AP-Northeast-1 (Tokyo)

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

### Phase 1: Foundation ✅ (Completed)
- [x] Project setup and configuration
- [x] Basic project structure
- [x] Documentation
- [x] Chinese language localization (zh-HK)
- [x] Professional UI with shadcn/ui components
- [x] Responsive design implementation

### Phase 2: Authentication & Registration ✅ (Completed)
- [x] Supabase authentication integration
- [x] User authentication system
- [x] Student registration flow
- [x] Tutor registration flow with enhanced features
- [x] Document upload functionality with R2 storage
- [x] Email verification (via Supabase Auth)
- [x] API routes for registration
- [x] Form validation with Zod
- [x] Hong Kong curriculum integration
- [x] Dynamic subject selection by grade level
- [x] Multi-exam results support (HKDSE, HKCEE, HKALE, A-Level, GCSE/IGCSE, IB)
- [x] Structured weekly availability system (day-by-day time slots)
- [x] Cloudflare R2 object storage integration
- [x] Organized subject selection (小學/中學/其他)

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

## Change Log

### 2025-11-29 - Initial Setup & Enhanced Registration System

#### Foundation
- Initial project setup with Next.js 16 + TypeScript
- Configured TailwindCSS v4 with shadcn/ui components
- Set up project structure and comprehensive documentation
- Implemented Chinese (zh-HK) localization for entire UI
- Brand name "FreeTutor" kept in English as per requirements

#### UI/UX
- Created professional landing page with gradient design
- Implemented student/tutor registration pages with shadcn/ui components
- Added interactive subject selection with badge components
- Responsive mobile-first design
- Organized subject selection into categories (小學科目, 中學科目, 其他科目)
- Custom availability input component with day-by-day time slot selection
- Multi-exam results input with dynamic subject/grade selection

#### Database & Authentication
- Integrated **Supabase** for database (PostgreSQL) and authentication
- Set up Prisma ORM v7 with proper schema using PostgreSQL adapter
- Database schema includes:
  - `user_profiles` - User roles linked to Supabase Auth
  - `student_profiles` - Student information and verification
  - `tutor_profiles` - Tutor credentials, exam results, and structured availability
  - `connection_requests` - Student-tutor matching system
- Implemented Supabase Auth for secure user registration
- Created API routes for student and tutor registration
- Password-based authentication with email verification support
- Document upload and URL storage system

#### File Storage - Cloudflare R2
- Integrated Cloudflare R2 for document storage (S3-compatible)
- Built R2 utility functions (upload, delete, signed URLs)
- Created file upload API with validation (10MB max, PDF/JPG/PNG only)
- Organized file structure: `tutor/[userId]/` and `student/[userId]/`
- Update documents API to store URLs in database
- Three-step registration process: register → upload → update profile

#### Hong Kong Education System Integration
- Detailed grade levels: 幼稚園 (K1-K3), 小學 (P1-P6), 中學 (S1-S6), 大專
- **小學科目** (11 subjects): 中國語文, 英國語文, 數學, 常識, 科學科, 人文科, 音樂, 視覺藝術, 體育, 電腦, 普通話
- **中學科目** (29 subjects): Core + Electives across all streams
- **其他科目** (3 subjects): 考試準備, 學習技巧, 特殊教育
- Dynamic subject filtering based on selected grade level
- Education levels for tutors: 中學文憑, 副學士學位, 學士學位, 碩士學位, 博士學位, 專業資格證書

#### Multi-Exam Results System
Comprehensive support for Hong Kong open exams:
- **HKDSE** (香港中學文憑): All 35 subjects with 5**, 5*, 5-1, ungraded
- **HKCEE** (香港中學會考): 28 subjects with A-F, U grading
- **HKALE** (香港高級程度會考): 19 AS/AL subjects with A-E, U grading
- **A-Level** (英國高級程度會考): 27 subjects with A*-E, U grading
- **GCSE/IGCSE** (英國普通中學教育文憑): 26 subjects with A*-G, U grading
- **IB** (國際文憑): 29 subjects across 6 groups with 7-1 grading
- Dynamic subject lists and grade options per exam type
- Flexible JSON storage structure supporting multiple exams

#### Structured Availability System
- Weekly availability with individual day configuration
- Multiple time slots per day (HH:MM format)
- Interactive checkbox-based day selection
- Add/remove time slots dynamically
- Validation requiring at least one time slot
- JSON storage for easy querying and matching

#### Features Completed
- ✅ Student registration with document upload to R2
- ✅ Enhanced tutor registration with:
  - Organized subject selection by education level
  - Multi-exam results recording (6 exam types)
  - Structured weekly availability (day-by-day time slots)
  - Document upload with R2 storage
- ✅ Form validation using React Hook Form + Zod
- ✅ Database integration with Supabase PostgreSQL
- ✅ Cloudflare R2 object storage integration
- ✅ File upload validation and processing
- ✅ Responsive design with Tailwind CSS
- ✅ shadcn/ui components (Button, Card, Badge, Input, Form, Checkbox, etc.)

#### Documentation
- `PROJECT_DOCUMENTATION.md` - Main project documentation (this file)
- `README.md` - Getting started guide

#### Technical Stack Enhancements
- **Storage**: Cloudflare R2 (S3-compatible object storage)
- **SDK**: AWS SDK v3 (@aws-sdk/client-s3, @aws-sdk/s3-request-presigner)
- **Database Adapter**: @prisma/adapter-pg for Prisma 7
- **PostgreSQL Driver**: pg (node-postgres)
- **Form Components**: Custom reusable components (ExamResultsInput, AvailabilityInput)

#### Environment Setup
- Configured environment variables for Supabase connection
- Added Cloudflare R2 credentials configuration
- Set up Prisma 7 with PostgreSQL adapter and connection pooling
- Created comprehensive `.env.example` for reference
- Prisma config file for migration URLs

---
**Last Updated:** 2025-11-29
**Version:** 2.0.0
