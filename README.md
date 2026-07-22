# CogniShift — Learning Management System

A full-stack e-learning platform where educators can create and sell courses, and students can browse, purchase, and track progress through them. Built as a MERN-stack application with authentication, payments, and media storage handled by third-party services.

## Features

**Student**
- Browse and search published courses
- Secure checkout via Stripe
- Track enrolled courses and lecture-by-lecture progress
- Rate and review completed courses

**Educator**
- Apply to become an educator directly from the app
- Create courses with a rich-text description editor, chapters, and lectures
- Upload course thumbnails (stored on Cloudinary)
- View enrolled students and course-level analytics

## Tech Stack

| Layer          | Technology                                      |
|----------------|--------------------------------------------------|
| Frontend       | React (Vite), Tailwind CSS, React Router          |
| Backend        | Node.js, Express                                  |
| Database       | MongoDB (Mongoose)                                |
| Authentication | Clerk                                             |
| Payments       | Stripe Checkout                                   |
| Media storage  | Cloudinary                                        |
| Deployment     | Vercel (frontend and backend as separate projects)|

## Project Structure

```
LMS Portal/
├── client/          # React frontend (Vite)
│   └── src/
│       ├── pages/       # student and educator page components
│       ├── components/  # shared UI, per-role navbars/sidebars
│       ├── context/     # global AppContext (auth state, API calls)
│       └── assets/      # images, icons, dummy data
└── server/          # Express backend
    ├── controllers/     # request handlers per resource
    ├── routes/          # route definitions
    ├── models/          # Mongoose schemas (User, Course, Purchase, CourseProgress)
    ├── middlewares/      # Clerk role-based route protection
    └── configs/          # DB, Cloudinary, Multer setup
```

## Roles

Roles are stored on the Clerk user as `publicMetadata.role`:
- **student** — default, no metadata needed
- **educator** — set automatically when a user clicks "Become Educator" in the app

## Deployment

The frontend and backend are deployed as **two separate Vercel projects** from the same repository, with different Root Directory settings (`client` and `server`). Each project needs its own environment variables set in Vercel's dashboard (not uploaded via `.env`), and Clerk/Stripe webhook endpoints must be updated to point at the live backend URL once deployed.

## Payments

Stripe is configured in **test mode**. To simulate a successful purchase, use Stripe's test card:
```
Card number: 4242 4242 4242 4242
Expiry: any future date
CVC: any 3 digits
ZIP: any 5 digits
```
No real money is charged.
