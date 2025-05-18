# Deployment Guide

This document explains how to upload your XSS Educational Lab to GitHub and deploy it on Render.com.

## 1. Upload to GitHub

### Using the Initialization Script

1. Run the initialization script:
   ```bash
   ./github-init.sh
   ```

2. Follow the on-screen instructions to create a GitHub repository

3. Connect your local repository to GitHub:
   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/xss-educational-lab.git
   git push -u origin main
   ```

### Manual Process

If you prefer to do this manually:

1. Initialize the Git repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: XSS Educational Lab"
   git branch -M main
   ```

2. Create a new repository on GitHub

3. Connect and push:
   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/xss-educational-lab.git
   git push -u origin main
   ```

## 2. Deploy to Render.com

1. Create a Render account at [render.com](https://render.com) if you don't have one

2. In the Render dashboard, click "New" and select "Web Service"

3. Connect your GitHub repository

4. Configure the following settings:
   - **Name**: `xss-educational-lab` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `./render-build.sh`
   - **Start Command**: `npm start`

5. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: (Get this from your Render PostgreSQL instance)

6. Click "Create Web Service"

### Creating a Database on Render

1. In the Render dashboard, click "New" and select "PostgreSQL"

2. Configure your database:
   - **Name**: `xss-lab-db` (or your preferred name)
   - **Database**: `xss_lab`
   - **User**: Leave default

3. Click "Create Database"

4. After the database is created, find and copy the "Internal Database URL"

5. Use this URL as the `DATABASE_URL` environment variable in your web service

## 3. Accessing Your Application

Once deployed, your application will be available at:
```
https://[your-app-name].onrender.com
```

## 4. Important Security Considerations

1. This application is for educational purposes only
2. Do not use it against websites without explicit permission
3. Ensure your Render instance has appropriate access controls
4. Consider enabling Render's built-in authentication for the admin dashboard