# DriveFleet — Premium Car Rental Platform

🚗 **Live Site:** https://drivefleet.vercel.app

## Features

- **Secure JWT Authentication** — Firebase auth with JWT tokens stored in HTTPOnly cookies. Supports Email/Password and Google OAuth login.
- **Full Car Management (CRUD)** — Add, update, and delete car listings with image preview, type selection, availability toggle, and owner-only access control.
- **Smart Booking System** — Book any available car with date range picker, driver option, special notes, and automatic total price calculation using `$inc` for booking count.
- **Search & Filter** — Real-time search by car name using MongoDB `$regex`, filter by car type using `$in` operator, and sort by price or date.
- **Dark / Light Theme Toggle** — Full dark mode with localStorage persistence across sessions.
- **Responsive Design** — Fully mobile, tablet, and desktop responsive with CSS Grid and Flexbox.
- **Protected Routes** — Private pages (Add Car, My Cars, My Bookings) stay accessible on reload without redirecting logged-in users to login.

## Tech Stack
React 18 · Vite · React Router v6 · Firebase Auth · Axios · React Hot Toast · React Icons

## Setup
```bash
npm install
cp .env.example .env   # fill in Firebase config
npm run dev
```
