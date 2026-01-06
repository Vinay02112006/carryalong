# CarryAlong - Deployment Guide

## Frontend Deployment

### Netlify
1. **Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 18 or higher

2. **Files Added:**
   - `public/_redirects` - Handles SPA routing
   - `netlify.toml` - Build configuration

3. **Environment Variables:**
   ```
   VITE_API_URL=https://your-backend-url.vercel.app
   ```

### Vercel
1. **Build Settings:**
   - Framework Preset: Vite
   - Build command: `npm run build`
   - Output directory: `dist`

2. **Files Added:**
   - `vercel.json` - SPA routing configuration

3. **Environment Variables:**
   ```
   VITE_API_URL=https://your-backend-url.vercel.app
   ```

## Backend Deployment

### Vercel (Recommended for Node.js)
1. **Deploy the backend folder separately**
2. **Files Added:**
   - `backend/vercel.json` - Serverless function configuration

3. **Environment Variables (Required):**
   ```
   NODE_ENV=production
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   FRONTEND_URL=https://your-frontend-url.netlify.app
   STRIPE_SECRET_KEY=your_stripe_secret (optional)
   ```

### Railway/Render (Alternative)
These platforms better support long-running Node.js apps with Socket.io.

**Railway:**
- Connect GitHub repo
- Select backend folder
- Add environment variables
- Deploy

**Render:**
- Create new Web Service
- Connect repository (backend folder)
- Environment: Node
- Build: `npm install`
- Start: `npm start`

## Important Notes:

⚠️ **Two Separate Deployments Required:**
- Frontend (Netlify/Vercel) - Static React app
- Backend (Vercel/Railway/Render) - Node.js API server

⚠️ **Update API URL:**
After deploying backend, update frontend's `VITE_API_URL` environment variable.

⚠️ **Socket.io Consideration:**
Vercel Serverless functions have limitations for WebSocket connections. For real-time chat to work properly, consider deploying backend to Railway or Render instead.

## Quick Deploy Links:
- Netlify: https://app.netlify.com/drop
- Vercel: https://vercel.com/new
- Railway: https://railway.app
- Render: https://render.com
