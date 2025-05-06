# Chat App - Monorepo Deployment on Vercel

This repository contains a full-stack chat application with both frontend and backend deployed as a monorepo on Vercel.

## Deployment Instructions

### Prerequisites
- A Vercel account
- MongoDB database (Atlas recommended)
- Cloudinary account for image uploads

### Environment Variables
When deploying to Vercel, add these environment variables in the Vercel dashboard:

- `MONGODB_URL` - Your MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token generation
- `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Your Cloudinary API key  
- `CLOUDINARY_API_SECRET` - Your Cloudinary API secret
- `NODE_ENV` - Set to "production"
- `PORT` - Optional, Vercel will provide this

### Deployment Steps

1. Push this repository to GitHub
2. Connect your GitHub repository to Vercel
3. Configure the project:
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `./backend/dist`
   - Install Command: `npm install`
4. Add the environment variables listed above
5. Deploy!

## Important Notes

### WebSockets on Vercel
Vercel has some limitations with WebSockets on their free tier. You should be aware that:

- For production use, you might need to upgrade to Vercel Pro for full WebSocket support
- In some cases, you may need to modify your Socket.IO code to better handle reconnections
- The application is configured to fall back to polling if WebSockets aren't available

### Serverless Functions
Since Vercel uses serverless functions:

- Be aware of the cold start times for your backend
- Serverless functions have a timeout limit (~10 seconds)
- User socket connections will be lost between function invocations
