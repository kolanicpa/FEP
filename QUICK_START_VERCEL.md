# Quick Start: Deploy to Vercel in 5 Steps

## Step 1: Get Your Firebase Credentials

Run this command to see all your credentials:
```bash
node server/extract-firebase-env.js
```

Copy the output - you'll need it for Vercel!

## Step 2: Deploy Backend

### Option A: Vercel Dashboard (Easiest)

1. Go to https://vercel.com/new
2. Import your Git repository (or upload `server` folder)
3. Configure:
   - **Root Directory**: `server`
   - **Framework Preset**: Other
4. Click "Deploy"

### Option B: Vercel CLI

```bash
cd server
vercel
```

## Step 3: Add Environment Variables to Backend

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add these 6 variables (copy from the script output):

1. `FIREBASE_PROJECT_ID` = `f-e-p-4e3a7`
2. `FIREBASE_PRIVATE_KEY_ID` = `[from script]`
3. `FIREBASE_PRIVATE_KEY` = `[entire key with -----BEGIN and -----END]`
4. `FIREBASE_CLIENT_EMAIL` = `[from script]`
5. `FIREBASE_CLIENT_ID` = `[from script]`
6. `FIREBASE_CLIENT_CERT_URL` = `[from script]`

**Important**: Select "Production", "Preview", AND "Development" for each variable!

## Step 4: Redeploy Backend

After adding environment variables:
- Click "Redeploy" in Vercel Dashboard
- Or run: `vercel --prod`

## Step 5: Deploy Frontend

1. Create `.env.production` in root folder:
   ```
   VITE_API_URL=https://your-backend.vercel.app/api/v1
   ```
   Replace `your-backend` with your actual backend URL from Step 2.

2. Deploy frontend:
   ```bash
   vercel
   ```

3. Add environment variable in Vercel Dashboard:
   - `VITE_API_URL` = `https://your-backend.vercel.app/api/v1`

## Step 6: Configure CORS

Add one more environment variable to your **backend** in Vercel:
- `FRONTEND_URL` = `https://your-frontend.vercel.app`

Replace `your-frontend` with your actual frontend URL.

Redeploy backend again.

## ✅ Test Your Deployment

1. **Backend health check**:
   ```bash
   curl https://your-backend.vercel.app/health
   ```
   Should return: `{"status":"ok"}`

2. **Visit your frontend**:
   ```
   https://your-frontend.vercel.app
   ```

3. **Try adding a performance** - it should save to Firebase!

## Common Issues

### "Firebase credentials not found"
- ✅ Verify all 6 Firebase environment variables are set
- ✅ Make sure they're set for Production, Preview, AND Development
- ✅ Redeploy after adding variables

### CORS error
- ✅ Set `FRONTEND_URL` in backend environment variables
- ✅ Make sure it matches your frontend URL exactly
- ✅ No trailing slash in the URL

### Private key error
- ✅ Copy the ENTIRE private key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
- ✅ Keep the `\n` characters - they're needed!

## URLs You'll Need

- **Your Backend**: Check Vercel Dashboard after deployment
- **Your Frontend**: Check Vercel Dashboard after deployment
- **Firebase Console**: https://console.firebase.google.com/project/f-e-p-4e3a7
- **Vercel Dashboard**: https://vercel.com/dashboard

## Need More Details?

See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for the complete guide.
