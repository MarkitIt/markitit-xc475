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

- Frontend: React.js, TypeScript, Tailwind CSS
- Backend, Datebase, and Deloyment: Firebase
- Web Scraping: Puppeteer, Cheerio.js
- APIs: Eventbrite, Eventeny (and more public APIs)

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v16+)
- Firebase
- Git

### Installation

#### Clone the repository:

```
git clone https://github.com/raheeqi/markitit.git
cd markitit
```

#### Install dependencies for the backend and frontend:

```
cd backend
npm install
cd ../frontend
npm install
```

#### Start the backend server:

```
cd backend
npm run dev
```

#### Start the frontend application:

```
cd ../frontend
npm run dev
```

Access the application in your browser at http://localhost:3000.

#### Environment Variables

Create a .env file in the backend directory and add the following:

```
MONGO_URI=your_mongo_db_connection_string
EVENTBRITE_API_KEY=your_eventbrite_api_key
```

Create a .env file in the frontend directory and add the following:

```
REACT_APP_BACKEND_URL=http://localhost:5000
```
