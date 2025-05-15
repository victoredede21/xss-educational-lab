#!/bin/bash
# Script to run during the build phase when deploying to Render

# Install dependencies
npm install

# Create database schema
echo "Setting up database schema..."
node -r esbuild-register scripts/push-schema.ts

# Build the application
echo "Building application..."
npm run build

echo "Build completed successfully!"