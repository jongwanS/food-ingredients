#!/bin/bash

# Build the application
npm run build

# For Vercel deployment, ensure the Vercel.json configuration works
# with the output directory structure
mkdir -p dist/api
cp -r api/* dist/api/

# Make sure the index.html is in the correct location
# (Vite typically puts it at the root of the dist folder)
cp dist/index.html dist/

echo "Build completed successfully!"