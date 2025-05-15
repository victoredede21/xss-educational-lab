# XSS Educational Lab

A legal, educational XSS lab with BeEF-style JavaScript hooks and dashboard for cybersecurity education.

## Features

- Dashboard for viewing hooked browsers
- JavaScript hook system
- Command modules for educational demonstrations
- Keystroke logging simulation
- Phishing attack demonstrations
- Token stealing simulations
- Page redirection and iframe injection examples

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up the database (see below)
4. Start the development server: `npm run dev`

## Database Setup

This application uses PostgreSQL for data storage. You need to set the `DATABASE_URL` environment variable with your PostgreSQL connection string.

To create the database schema, run:
```
tsx scripts/push-schema.ts
```

## Deployment on Render

1. Create a new Web Service on Render
2. Connect your repository
3. Configure the following settings:
   - **Environment**: Node
   - **Build Command**: `./render-build.sh`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - `NODE_ENV`: production
     - `DATABASE_URL`: Your PostgreSQL connection string (a Render PostgreSQL instance is recommended)

## Warning

This tool is provided for educational purposes only. Using this code against websites or systems without explicit permission may violate computer crime laws and ethical standards.