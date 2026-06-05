# DriveFleet — Complete Setup Guide

## Quick Start (works WITHOUT Firebase)

### Step 1 — Server
```bash
cd server
npm install
```
Create `server/.env`:
```
PORT=5000
MONGODB_URI=mongodb+srv://USER:PASS@cluster.mongodb.net/drivefleet
JWT_SECRET=any_long_random_string_here
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```
```bash
npm run dev
# Server runs on http://localhost:5000
```

### Step 2 — Client
```bash
cd client
npm install
```
Create `client/.env` (minimum — works without Firebase):
```
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=placeholder
VITE_FIREBASE_AUTH_DOMAIN=placeholder.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=placeholder
VITE_FIREBASE_STORAGE_BUCKET=placeholder.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=000000
VITE_FIREBASE_APP_ID=1:000000:web:placeholder
```
```bash
npm run dev
# Opens at http://localhost:5173
```

> ⚡ With placeholder values, the app runs in **Demo Mode**.
> Login/Register work using localStorage — any email + password works.
> To get real Google auth, replace with your actual Firebase config.

---

## MongoDB Atlas Setup
1. Go to https://cloud.mongodb.com → Create free cluster
2. Database Access → Add user (note username/password)
3. Network Access → Add IP → 0.0.0.0/0
4. Connect → Drivers → Copy connection string
5. Replace `USER:PASS` and cluster URL in `server/.env`

## Seed Sample Cars
In MongoDB Atlas → Browse Collections → `drivefleet.cars` → Insert Documents:
```json
[
  {"carName":"Toyota RAV4 2023","dailyRentPrice":85,"carType":"SUV","imageURL":"https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600","seatCapacity":5,"pickupLocation":"Dhaka Airport","description":"Spacious and reliable SUV perfect for family trips. Equipped with modern safety features and ample cargo space.","availabilityStatus":"available","bookingCount":0,"ownerEmail":"demo@drivefleet.com","createdAt":{"$date":"2025-01-01T00:00:00Z"}},
  {"carName":"BMW 5 Series 2022","dailyRentPrice":150,"carType":"Luxury","imageURL":"https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600","seatCapacity":5,"pickupLocation":"Gulshan, Dhaka","description":"Experience ultimate driving pleasure with this premium BMW. Leather seats, panoramic roof, powerful performance.","availabilityStatus":"available","bookingCount":0,"ownerEmail":"demo@drivefleet.com","createdAt":{"$date":"2025-01-02T00:00:00Z"}},
  {"carName":"Honda Civic 2023","dailyRentPrice":55,"carType":"Sedan","imageURL":"https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600","seatCapacity":5,"pickupLocation":"Dhanmondi, Dhaka","description":"Fuel-efficient and comfortable sedan ideal for city driving. Great mileage and smooth handling.","availabilityStatus":"available","bookingCount":0,"ownerEmail":"demo@drivefleet.com","createdAt":{"$date":"2025-01-03T00:00:00Z"}},
  {"carName":"Tesla Model 3 2023","dailyRentPrice":120,"carType":"Electric","imageURL":"https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600","seatCapacity":5,"pickupLocation":"Uttara, Dhaka","description":"All-electric luxury sedan with autopilot features. Zero emissions and incredible acceleration.","availabilityStatus":"available","bookingCount":0,"ownerEmail":"demo@drivefleet.com","createdAt":{"$date":"2025-01-04T00:00:00Z"}},
  {"carName":"Toyota Hiace 2022","dailyRentPrice":95,"carType":"Van","imageURL":"https://images.unsplash.com/photo-1566008885218-90abf9200ddb?w=600","seatCapacity":12,"pickupLocation":"Mirpur, Dhaka","description":"Spacious van perfect for group travel and corporate events. Comfortable seating for up to 12 passengers.","availabilityStatus":"available","bookingCount":0,"ownerEmail":"demo@drivefleet.com","createdAt":{"$date":"2025-01-05T00:00:00Z"}},
  {"carName":"Hyundai i10 2023","dailyRentPrice":40,"carType":"Hatchback","imageURL":"https://images.unsplash.com/photo-1612544448445-b8232cff3b6c?w=600","seatCapacity":4,"pickupLocation":"Motijheel, Dhaka","description":"Compact and economical hatchback ideal for city commuting. Easy to park and very fuel-efficient.","availabilityStatus":"available","bookingCount":0,"ownerEmail":"demo@drivefleet.com","createdAt":{"$date":"2025-01-06T00:00:00Z"}}
]
```

## Firebase Setup (for real auth)
1. Go to https://console.firebase.google.com
2. Create project → Add Web App
3. Authentication → Sign-in methods → Enable Email/Password + Google
4. Copy config values to `client/.env`

## Deploy
- **Server** → Render.com (Web Service, set env vars)
- **Client** → Vercel.com (import GitHub repo, set env vars)
- Add Vercel domain to Firebase → Authentication → Authorized domains

## GitHub Commits (Client — 15+)
1. `init: vite react project setup`
2. `feat: add AuthContext with Firebase and demo mode fallback`
3. `feat: add ThemeContext with dark/light toggle`
4. `feat: build Navbar with mobile menu and user dropdown`
5. `feat: build Footer with social links`
6. `feat: create Home page hero section`
7. `feat: add available cars section with dynamic data`
8. `feat: add Why Choose Us and Testimonials sections`
9. `feat: build ExploreCars with search ($regex) and filter ($in)`
10. `feat: create CarDetails page with booking modal`
11. `feat: build AddCar form with image preview`
12. `feat: build MyCars page with edit and delete modals`
13. `feat: build MyBookings page with cancel booking`
14. `feat: add Login page with Google auth`
15. `feat: add Register with password validation`
16. `feat: add PrivateRoute and 404 page`
17. `feat: responsive CSS with dark mode`
18. `fix: private route reload without redirect`
19. `feat: add CTA section and demo mode banner`
20. `chore: add README and deployment config`

## GitHub Commits (Server — 8+)
1. `init: express server with cors and dotenv`
2. `feat: connect MongoDB Atlas`
3. `feat: JWT middleware with HTTPOnly cookie`
4. `feat: POST /jwt and POST /logout auth routes`
5. `feat: cars CRUD with owner verification`
6. `feat: search with $regex and filter with $in`
7. `feat: bookings with $inc booking count`
8. `feat: my-cars and my-bookings private routes`
9. `fix: CORS credentials for production`
