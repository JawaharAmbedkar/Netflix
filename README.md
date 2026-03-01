🎬 Netflix Clone – Full Stack Membership-Based Streaming App

A full-stack Netflix-inspired web application built with Next.js (Serverless) using a Turborepo Monorepo architecture, featuring authentication, protected routes, and a Razorpay-based membership payment system.

⚠️ Important Notice (Google Sign-In Users)

If you are signing in with Google, the first attempt may sometimes fail.

Why does this happen?

The app is deployed on Vercel (Serverless Platform).

When inactive, the backend goes into sleep mode.

The first request may fail while the server "wakes up."

✅ Solution

If Google Sign-In fails:

Simply try again.

It usually works within 2–3 attempts once the backend is active.

📌 Project Overview

This project replicates the core Netflix user flow:

User creates an account

User completes membership payment

User gains access to the homepage

Only active members can access protected content

The goal of this project was to build a real-world full-stack production-style application with proper architecture and payment flow handling.

🚀 Features

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

Deployment: Vercel

🔄 Application Flow
1️⃣ Sign Up

User creates an account using:

Email & Password
OR

Google Sign-In

After successful signup, the user is redirected to the membership page.

⚠️ If signing in with Google fails initially, try 2–3 times (Vercel cold start issue).

2️⃣ Membership Payment

The application uses Razorpay Test Mode for demonstration purposes.

How to Complete Payment:

Click on "Pay"

Select any bank

Choose the Success option

Payment will be marked successful

Membership status updates in the database

User is redirected to the homepage

This is a mock/test payment – no real money is charged.

3️⃣ Homepage Access

Only users with membership = true can access the homepage.

If membership is inactive:

User cannot access protected routes

An error message is displayed on login

🏗 Project Architecture

This project follows a Monorepo structure using Turborepo:

Shared database logic

Better scalability

Cleaner separation of concerns

Production-ready structure

⚙️ Prisma & Vercel Challenges

During development, one major challenge was:

❌ Prisma Global Client Issue in Serverless

Vercel serverless functions do not handle global database instances the same way as traditional Node servers.

This caused:

Multiple Prisma client instances

Potential connection errors

Deployment issues

✅ Solution

Implemented proper Prisma client reuse pattern

Adjusted configuration for serverless compatibility

Structured shared database client in the monorepo

This significantly improved reliability in production.

🧠 What This Project Demonstrates

Full-stack authentication flow

OAuth integration

Database relationships & membership logic

Payment verification flow

Protected routing

Serverless deployment challenges

Monorepo architecture management

Real-world debugging experience

🛠 Setup (Local Development)
# Install dependencies
npm install

# Run development server
npm run dev

Make sure you configure:

Database URL

NextAuth secret

Google OAuth credentials

Razorpay test keys

🔔 Final Reminder

If Google Sign-In shows an error:

👉 Try 2–3 times.
The backend may still be waking up on Vercel.
