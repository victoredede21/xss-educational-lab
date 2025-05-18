#!/bin/bash
# Script to run during the build phase when deploying to Render

# Install dependencies
npm install

# Install esbuild-register explicitly for schema setup
npm install -g esbuild-register

# Create database schema
echo "Setting up database schema..."
npx tsx scripts/push-schema.ts

# Build the application
echo "Building application..."
npm run build

# Verify build output exists
if [ ! -f "dist/index.js" ]; then
  echo "Error: Build failed, dist/index.js not created"
  exit 1
fi

echo "Build completed successfully!"