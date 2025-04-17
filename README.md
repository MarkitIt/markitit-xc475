# MarkitIt

## Introduction

Welcome to MarkitIt, a platform designed to streamline the pop-up shop process for small businesses and vendors. Our mission is to eliminate the hassle of scattered event research, repetitive applications, and unreliable hosts by providing a centralized hub for discovering vetted opportunities, tracking applications, and connecting with a supportive vendor community. With tools for financial planning, event ratings, and automated scheduling, MarkitIt empowers vendors to focus on growing their businesses.

## Contributors:

- Raheeq Ibrahim: CS'25
- Jeremiah Somoine: CE '27
- Arkar Myat: CS '25
- Hoang Anh Vu: CS '27
- Hannah Yu: CFA '27

## Problem Statement

Small businesses rely on pop-up shops for growth but face numerous challenges:

- Scattered Research: Finding events across multiple platforms and social media is inefficient.
- Repetitive Applications: Vendors waste time re-entering the same information repeatedly.
- Unreliable Organizers: Lack of vetting leads to unprofessional events and financial risk.
- Tracking Difficulties: Vendors manually track their applications and schedules, increasing disorganization.
- Financial Uncertainty: Determining whether an event is profitable is often unclear.

## Key Features

1. Centralized Event Discovery: Web scraping and APIs to aggregate upcoming pop-up shops, filtered by relevance (location, vendor type, fees, etc.).
2. Streamlined Applications: Pre-saved vendor profiles to reduce repetitive form-filling.
3. Community Ratings: A vendor-driven rating and review system for organizers and events.
4. Financial Tools: Calculate event profitability by weighing fees, travel costs, and expected sales.
5. Integrated Scheduling: Track approved, denied, and pending applications, with calendar synchronization.
6. Vendor Networking: Build connections and share insights through community features.

## Tech Stack

### Frontend
- Next.js (React Framework) – Provides server-side rendering and static generation.
- Tailwind CSS – Used for styling and responsive design.
### Backend
- Firebase Firestore – NoSQL database for storing event listings, applications, and vendor data.
- Firebase Authentication – Manages user sign-ins with Google OAuth and email/password.
- Firebase Cloud Functions – Handles automated application submissions and API integrations.
### Event Aggregation & Payments
- Eventbrite API & Web Scraping – Fetches pop-up events.
- Stripe – Manages vendor payments and application fees.
### Hosting & Deployment
- Frontend: Vercel (optimized for Next.js)
- Backend: Firebase Cloud Functions

- Frontend: React.js, TypeScript, Tailwind CSS
- Backend, Datebase, and Deloyment: Firebase
- Web Scraping: Puppeteer, Cheerio.js
- APIs: Eventbrite, Eventeny (and more public APIs)

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v16+) – Required for running the frontend and backend.
- Firebase CLI – Used for authentication, database, and cloud functions.
- Git – Version control system for managing the repository.
- Vercel CLI – Used for deploying the frontend.


### Installation

#### Clone the repository:

```
git clone https://github.com/MarkitIt/markitit-xc475.git
cd markitit
```

#### Install dependencies for the backend and frontend:

```
npm install
```


Access the application in your browser at http://localhost:3000.

#### Environment Variables

Create a .env file in the root directory and add the following:

```
NEXT_PUBLIC_FIREBASE_API_KEY= 
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_DATABASE_URL=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

#### Run the development server

```
npm run dev
```
#### Pages Directory 

## Pages Directory

### Authentication
- `/auth/login` - User login and signup page
- `/auth/signup` - New user registration page

### Profile Creation
- `/create-profile` - Initial role selection (Vendor or Host)
  
#### Vendor Profile Creation Flow
- `/create-profile/vendor` - Basic business information
- `/create-profile/vendor/type` - Select vendor type (Food or Market)
- `/create-profile/vendor/category` - Business category selection
- `/create-profile/vendor/product` - Product information
- `/create-profile/vendor/budget` - Budget preferences
- `/create-profile/vendor/preferences` - Event and schedule preferences
- `/create-profile/vendor/media` - Upload logo and product images
- `/create-profile/vendor/optional` - Additional business information
- `/create-profile/vendor/review` - Review and complete profile

#### Host Profile Creation Flow
- `/create-profile/host` - Organization information and event preferences

### Dashboards
- `/vendor-dashboard` - Vendor's main dashboard
  - View applications
  - Manage profile
  - Track events
- `/host-dashboard` - Host's main dashboard
  - Manage events
  - View vendor applications
  - Track event metrics

### Events
- `/search-events` - Browse and search available events
- `/event-profile/[id]` - Individual event details
- `/event-profile/[id]/apply` - Vendor application for an event
- `/my-events` - List of events (for hosts)
- `/my-applications` - List of event applications (for vendors)

### Community
- `/community` - Community feed and interactions
- `/notifications` - User notifications center

### Settings
- `/settings` - User account and profile settings
  - Profile management
  - Account preferences
  - Notification settings

### Additional Pages
- `/` - Home/Landing page
- `/search-events` - Event discovery page

## Contributing
- Clone the repository
- Create a feature branch (git checkout -b feature-name)
- Commit changes (git commit -m "Add feature")
- Push to branch [category]/[short-description]-[your-initials]
-   Examples:
-     feature/add-login-ar
-     bugfix/fix-chart-rendering-js
-     chore/update-readme-js
- Open a Pull Request
-   PR's must have 2 reviewers to merge
