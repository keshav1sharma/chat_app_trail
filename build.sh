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

  echo "✅ Build completed successfully!"
else
  echo "❌ Backend build failed!"
  exit 1
fi