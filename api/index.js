// This file serves as a Vercel serverless function entry point
// It will import and execute your existing backend code

import { app, server } from '../backend/dist/lib/socket';
import { connectDb } from '../backend/dist/lib/db';

// Connect to MongoDB
connectDb();

// Export the Express app for Vercel serverless functions
export default app;