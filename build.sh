#!/bin/bash

# Exit on error
set -e

echo "🔨 Building backend..."
cd backend
npm install
npm run build
cd ..

echo "🔨 Building frontend..."
cd frontend
npm install
npm run build
cd ..

echo "📦 Copying frontend to backend/dist/frontend..."
# Create the directory if it doesn't exist
mkdir -p backend/dist/frontend

# Copy the frontend build to the backend/dist folder
cp -r frontend/dist/* backend/dist/frontend/

echo "✅ Build completed successfully!"