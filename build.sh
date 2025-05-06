#!/bin/bash

# Exit on error
set -e

echo "🔨 Building backend..."
cd backend
npm install
npm run build
cd ..

# Only proceed if backend build was successful
if [ $? -eq 0 ]; then
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

  # Ensure index.html exists
  if [ -f backend/dist/frontend/index.html ]; then
    echo "✅ Frontend index.html successfully copied"
  else
    echo "❌ Failed to copy frontend/dist/index.html"
    exit 1
  fi

  # Check if assets were copied
  if [ -d backend/dist/frontend/assets ]; then
    echo "✅ Frontend assets successfully copied"
  else
    echo "❌ Failed to copy frontend assets"
    exit 1
  fi

  echo "✅ Build completed successfully!"
else
  echo "❌ Backend build failed!"
  exit 1
fi