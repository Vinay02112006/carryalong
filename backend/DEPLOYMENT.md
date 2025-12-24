# CarryAlong Backend - Production Deployment

## Quick Deploy Options

### Option 1: Railway (Recommended - Easiest)

1. **Install Railway CLI** (optional):
```bash
npm install -g @railway/cli
```

2. **Deploy via Railway Dashboard**:
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway will auto-detect Node.js
   - Add environment variables (see below)

3. **Environment Variables to Add**:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secure_random_string_at_least_32_characters_long
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### Option 2: Render

1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: carryalong-api
   - **Root Directory**: backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. Add Environment Variables (same as above)

### Option 3: Heroku

1. **Install Heroku CLI**:
```bash
brew install heroku/brew/heroku
```

2. **Login and Create App**:
```bash
heroku login
cd backend
heroku create carryalong-api
```

3. **Set Environment Variables**:
```bash
heroku config:set MONGODB_URI="your_mongodb_atlas_uri"
heroku config:set JWT_SECRET="your_secret_key"
heroku config:set NODE_ENV=production
heroku config:set FRONTEND_URL="https://your-frontend.vercel.app"
```

4. **Deploy**:
```bash
git push heroku main
```

---

## MongoDB Atlas Setup (Required for All Options)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (Free tier - M0)
4. Click "Connect" → "Connect your application"
5. Copy the connection string, it looks like:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/carryalong?retryWrites=true&w=majority
```
6. Replace `<password>` with your actual password
7. Add your IP address to whitelist (or use 0.0.0.0/0 for all IPs in production)

---

## Post-Deployment Testing

Test your deployed API:

```bash
# Health check
curl https://your-api-url.railway.app/api/health

# Register test user
curl -X POST https://your-api-url.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "phone": "9876543210",
    "governmentId": "TEST123456"
  }'
```

---

## Troubleshooting

### MongoDB Connection Issues
- Verify connection string is correct
- Check IP whitelist in MongoDB Atlas
- Ensure password doesn't contain special characters (use URL encoding)

### Port Issues
- Railway/Render automatically assign PORT - our code handles this
- Don't hardcode PORT in production

### CORS Issues
- Update FRONTEND_URL in environment variables
- Restart the service after changing env vars

---

## Security Checklist for Production

✅ Use strong JWT_SECRET (minimum 32 characters)
✅ Set NODE_ENV=production
✅ Use MongoDB Atlas with authentication
✅ Configure CORS with specific frontend URL
✅ Enable IP whitelisting in MongoDB Atlas
✅ Use HTTPS (automatic on Railway/Render/Vercel)
✅ Never commit .env file to git
✅ Regularly rotate JWT secret

---

## Monitoring

### Railway
- View logs in Railway dashboard
- Set up log drains if needed

### Render
- View logs in Render dashboard
- Enable auto-deploy on git push

### Heroku
```bash
heroku logs --tail
```
