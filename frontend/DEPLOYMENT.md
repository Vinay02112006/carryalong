# CarryAlong Frontend - Production Deployment

## Quick Deploy Options

### Option 1: Vercel (Recommended - Fastest)

1. **Install Vercel CLI** (optional):
```bash
npm install -g vercel
```

2. **Deploy via Vercel Dashboard** (Easiest):
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Import your Git repository
   - Vercel auto-detects Vite
   - Configure:
     - **Framework Preset**: Vite
     - **Root Directory**: frontend
     - **Build Command**: `npm run build`
     - **Output Directory**: dist
   - Add environment variable:
     ```
     VITE_API_URL=https://your-backend-url.railway.app/api
     ```
   - Click "Deploy"

3. **Deploy via CLI**:
```bash
cd frontend
vercel
# Follow prompts
```

### Option 2: Netlify

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your Git repository
4. Configure:
   - **Base directory**: frontend
   - **Build command**: `npm run build`
   - **Publish directory**: frontend/dist
5. Add environment variable:
   ```
   VITE_API_URL=https://your-backend-url.railway.app/api
   ```
6. Deploy

### Option 3: GitHub Pages (Static Only)

Not recommended for this project as it requires API calls to a separate backend.

---

## Environment Configuration

Create production environment file:

```bash
# frontend/.env.production
VITE_API_URL=https://your-backend-url.railway.app/api
```

---

## Build Optimization

The production build is already optimized:
- ✅ Code splitting
- ✅ Minification
- ✅ Tree shaking
- ✅ Asset optimization

Test local production build:
```bash
cd frontend
npm run build
npm run preview
```

---

## Post-Deployment Steps

### 1. Update Backend CORS

Update your backend's FRONTEND_URL environment variable:
```env
FRONTEND_URL=https://your-app.vercel.app
```

### 2. Test the Application

1. Visit your deployed URL
2. Register a new account
3. Test login
4. Create a parcel request
5. Post a travel route
6. Check all pages work

### 3. Custom Domain (Optional)

**On Vercel:**
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

**On Netlify:**
1. Go to Site Settings → Domain Management
2. Add custom domain
3. Configure DNS

---

## Troubleshooting

### API Connection Issues

If you see CORS errors:
1. Verify VITE_API_URL is correct
2. Check backend FRONTEND_URL matches your deployed URL
3. Ensure both URLs use HTTPS

### Build Failures

```bash
# Clear cache and rebuild
rm -rf node_modules
rm package-lock.json
npm install
npm run build
```

### Blank Page After Deploy

1. Check browser console for errors
2. Verify environment variables are set
3. Check base path in vite.config.js

---

## Performance Optimization

### Enable Vercel Analytics (Optional)

```bash
npm install @vercel/analytics
```

Add to `main.jsx`:
```jsx
import { Analytics } from '@vercel/analytics/react';

// ...existing code...
<App />
<Analytics />
```

### Enable Caching Headers

Vercel/Netlify automatically handle this, but you can customize in `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

## Continuous Deployment

### Automatic Deploys

Both Vercel and Netlify support automatic deploys:

1. **Production**: Deploys on push to `main` branch
2. **Preview**: Creates preview for pull requests

### Manual Deploys

**Vercel:**
```bash
vercel --prod
```

**Netlify:**
```bash
netlify deploy --prod
```

---

## Monitoring & Analytics

### Vercel Analytics
- Built-in web vitals tracking
- Real-time performance insights

### Google Analytics (Optional)

1. Create GA4 property
2. Add tracking code to `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## Security Best Practices

✅ Use HTTPS (automatic on Vercel/Netlify)
✅ Set proper environment variables
✅ Enable security headers (automatic)
✅ Keep dependencies updated
✅ Use Content Security Policy (optional)

---

## Rollback Strategy

### Vercel
1. Go to Deployments
2. Click on previous successful deployment
3. Click "Promote to Production"

### Netlify
1. Go to Deploys
2. Find previous deploy
3. Click "Publish deploy"