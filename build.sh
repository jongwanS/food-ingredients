#!/bin/bash

# Build the application
echo "Starting build process..."

# Step 1: Build the frontend with Vite
echo "Building frontend with Vite..."
vite build

# Step 2: Build the backend with esbuild
echo "Building backend with esbuild..."
esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

# Step 3: Prepare for Vercel deployment
echo "Preparing files for Vercel deployment..."

# Copy API handlers for serverless functions
mkdir -p dist/api
cp -r api/* dist/api/

# Copy the redirect page (will be used for fallback)
cp vercel-redirect.html dist/

# Make sure all static assets are correctly placed
echo "Ensuring static assets are in place..."

# Make build.sh executable if not already
chmod +x build.sh

echo "Build completed successfully!"
echo "Files ready for Vercel deployment in the 'dist' directory"