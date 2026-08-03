🎬 Netflix Clone – Full Stack Membership-Based Streaming App
A full-stack Netflix-inspired web application built with Next.js (Serverless) using a Turborepo Monorepo architecture. It features authentication, protected routes, a Razorpay-based membership payment system, and actual streaming functionality for movies, TV series, and anime.

⚠️ Important Notice (Google Sign-In Users)

If you are signing in with Google, the first attempt may sometimes fail.

Why does this happen?

The app is deployed on Vercel (Serverless Platform).

When inactive, the backend goes into sleep mode.

The first request may fail while the server "wakes up."  

✅ Solution
If Google Sign-In fails: Simply try again. It usually works within 2–3 attempts once the backend is active.  

📌 Project Overview  
This project replicates the core Netflix user flow with real, working streaming capabilities:  

User creates an account.  

User completes membership payment.  

User gains access to the homepage.  

Only active members can browse the catalog and watch actual movies, TV shows, and anime.  

The goal of this project was to build a real-world full-stack production-style application with proper architecture, payment flow handling, and third-party media API integrations.

🚀 Features
🍿 Real Streaming: Watch actual movies, TV series, and anime directly on the platform using the NexStream player.

📽️ TMDB Integration: Dynamic catalog fetching real-time metadata, posters, episodes, and media details.

🔐 Email & Password Authentication

🌐 Google OAuth Login

💳 Membership-Based Access System

🏦 Razorpay Test Payment Integration

🔒 Protected Routes

🗄 Prisma ORM + PostgreSQL

🏗 Monorepo using Turborepo

⚡ Serverless Deployment (Vercel)

🎨 Netflix-inspired UI (Tailwind CSS + TypeScript)

🧑‍💻 Tech Stack
Framework: Next.js (App Router / Serverless)

Monorepo: Turborepo

Language: TypeScript

Styling: Tailwind CSS

Database: PostgreSQL

ORM: Prisma

Authentication: NextAuth (Credentials + Google Provider)

Payments: Razorpay (Test Mode)  

Media APIs: TMDB API & NexStream API  

Deployment: Vercel  

🔄 Application Flow  
1️⃣ Sign Up  
User creates an account using:  

Email & Password  

OR Google Sign-In  

After successful signup, the user is redirected to the membership page.
(⚠️ If signing in with Google fails initially, try 2–3 times due to the Vercel cold start issue).  

2️⃣ Membership Payment  
The application uses Razorpay Test Mode for demonstration purposes.
How to Complete Payment:  

Click on "Pay"  

Select any bank  

Choose the "Success" option  

Payment will be marked successful  

Membership status updates in the database

User is redirected to the homepage

(This is a mock/test payment – no real money is charged).

3️⃣ Homepage Access
Only users with membership = true can access the homepage.
If membership is inactive:

User cannot access protected routes.

An error message is displayed on login.  

4️⃣ Watch Content  
Once inside, users can browse categorized rows of Movies, Series, and Anime. Clicking on a title opens a dedicated player route where the NexStream API serves the actual video content based on the TMDB ID.  

🏗 Project Architecture  
This project follows a Monorepo structure using Turborepo:  

Shared database logic

Better scalability

Cleaner separation of concerns

Production-ready structure

⚙️ Prisma & Vercel Challenges
During development, one major challenge was:
❌ Prisma Global Client Issue in Serverless
Vercel serverless functions do not handle global database instances the same way as traditional Node servers. This caused:  

Multiple Prisma client instances  

Potential connection errors  

Deployment issues  

✅ Solution  

Implemented proper Prisma client reuse pattern  

Adjusted configuration for serverless compatibility  

Structured shared database client in the monorepo  

This significantly improved reliability in production.  

🧠 What This Project Demonstrates  
Third-party API integration (TMDB & Streaming servers)  

Full-stack authentication flow  

OAuth integration  

Database relationships & membership logic  

Payment verification flow  

Protected routing  

Serverless deployment challenges  

Monorepo architecture management  

Real-world debugging experience  

🛠 Setup (Local Development)  
Bash
# Install dependencies
npm install

# Run development server
npm run dev
Environment Variables Required:
Create a .env file in the appropriate apps/packages and configure the following:  

DATABASE_URL (PostgreSQL connection string)  

NEXTAUTH_SECRET

GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET

RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET

TMDB_READ_ACCESS_TOKEN (From The Movie Database)

NEXT_PUBLIC_EMBED_API_KEY (For NexStream)

🔔 Final Reminder
If Google Sign-In shows an error:
👉 Try 2–3 times.
The backend may still be waking up on Vercel.
