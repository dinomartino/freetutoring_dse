# FreeTutor - Free Tutor Pairing Platform

A web platform designed to connect students with special needs to qualified volunteer tutors.

## Overview

FreeTutor facilitates meaningful educational support by matching verified tutors with students who need assistance. The platform includes document verification, user profiles, and a connection/pairing system.

## Features

- **Student & Tutor Registration** - Separate registration flows with document verification
- **Document Verification** - Manual admin review of academic credentials and student needs documentation
- **Tutor Discovery** - Browse and search verified tutors with filtering capabilities
- **Connection System** - Students can connect with tutors for lessons
- **Responsive Design** - Mobile-first approach using TailwindCSS

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS v4
- **UI Components:** React
- **Package Manager:** npm

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/dinomartino/freetutoring_dse.git
cd freetutor
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```
Edit `.env` with your configuration

4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
freetutor/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── (auth)/            # Auth-related routes
│   │   ├── (dashboard)/       # Dashboard routes
│   │   ├── api/               # API routes
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/             # Reusable components
│   │   ├── ui/                # UI components
│   │   ├── forms/             # Form components
│   │   └── layouts/           # Layout components
│   ├── lib/                    # Utility functions
│   ├── types/                  # TypeScript types
│   └── hooks/                  # Custom React hooks
├── public/                     # Static assets
└── PROJECT_DOCUMENTATION.md    # Detailed project documentation
```

## Documentation

For detailed project documentation, architecture decisions, and development roadmap, see [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md).

## Development Phases

- [x] Phase 1: Foundation - Project setup and configuration
- [ ] Phase 2: Authentication & Registration
- [ ] Phase 3: Admin Panel
- [ ] Phase 4: Tutor Discovery
- [ ] Phase 5: Matching System
- [ ] Phase 6: Enhancement & Polish

## Contributing

This is currently a solo project. Contributions may be accepted in the future.

## License

ISC
