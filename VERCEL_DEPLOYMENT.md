# Deploying to Vercel with Firebase

This guide shows you how to deploy your theater management system to Vercel with Firebase backend.

## Prerequisites

1. Vercel account (sign up at https://vercel.com)
2. Firebase project already set up (✅ You have: f-e-p-4e3a7)
3. Your Firebase credentials file

## Step 1: Prepare Firebase Credentials

Your Firebase credentials are in: `/Users/nikolapanic/Downloads/f-e-p-4e3a7-firebase-adminsdk-fbsvc-d72cbb2efd.json`

You'll need these values from that file:
- `project_id`
- `private_key_id`
- `private_key`
- `client_email`
- `client_id`
- `client_x509_cert_url`

## Step 2: Deploy Backend to Vercel

### Option A: Deploy via Vercel CLI

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from server directory**:
   ```bash
   cd server
   vercel
   ```

4. **Set environment variables** (when prompted or after deployment):
   ```bash
   vercel env add FIREBASE_PROJECT_ID
   # Enter: f-e-p-4e3a7

   vercel env add FIREBASE_PRIVATE_KEY_ID
   # Enter: d72cbb2efd4a1799a98a7b6ed3eb76e268651bcd

   vercel env add FIREBASE_PRIVATE_KEY
   # Paste the entire private key INCLUDING the -----BEGIN/END----- lines

   vercel env add FIREBASE_CLIENT_EMAIL
   # Enter: firebase-adminsdk-fbsvc@f-e-p-4e3a7.iam.gserviceaccount.com

   vercel env add FIREBASE_CLIENT_ID
   # Enter: 110367504257440813837

   vercel env add FIREBASE_CLIENT_CERT_URL
   # Enter: https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40f-e-p-4e3a7.iam.gserviceaccount.com
   ```

### Option B: Deploy via Vercel Dashboard

1. **Go to Vercel Dashboard**: https://vercel.com/new

2. **Import your GitHub repository** (or upload the `server` folder)

3. **Configure Project**:
   - Framework Preset: `Other`
   - Root Directory: `server`
   - Build Command: (leave empty)
   - Output Directory: (leave empty)

4. **Add Environment Variables** in Vercel Dashboard:

   Go to: Project Settings → Environment Variables

   Add these variables (for Production, Preview, and Development):

   | Name | Value |
   |------|-------|
   | `FIREBASE_PROJECT_ID` | `f-e-p-4e3a7` |
   | `FIREBASE_PRIVATE_KEY_ID` | `d72cbb2efd4a1799a98a7b6ed3eb76e268651bcd` |
   | `FIREBASE_PRIVATE_KEY` | Copy the entire `private_key` from your Firebase JSON file (including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`) |
   | `FIREBASE_CLIENT_EMAIL` | `firebase-adminsdk-fbsvc@f-e-p-4e3a7.iam.gserviceaccount.com` |
   | `FIREBASE_CLIENT_ID` | `110367504257440813837` |
   | `FIREBASE_CLIENT_CERT_URL` | `https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40f-e-p-4e3a7.iam.gserviceaccount.com` |

   **IMPORTANT**: When adding `FIREBASE_PRIVATE_KEY`, make sure to:
   - Include the entire key with `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
   - The `\n` characters in the key are fine - the code will handle them

5. **Deploy**: Click "Deploy"

## Step 3: Deploy Frontend to Vercel

1. **Update frontend API URL**:

   Create a `.env.production` file in the root directory:
   ```bash
   VITE_API_URL=https://your-backend-app.vercel.app/api/v1
   ```

   Replace `your-backend-app` with your actual Vercel backend URL.

2. **Deploy Frontend**:
   ```bash
   vercel
   ```

   Or use the Vercel Dashboard to import the root directory.

3. **Configure Frontend Project** in Vercel:
   - Framework Preset: `Vite`
   - Root Directory: `.` (root)
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Add Environment Variable**:
   - `VITE_API_URL`: `https://your-backend-app.vercel.app/api/v1`

## Step 4: Configure CORS

Update `server/src/server.js` to allow your frontend domain:

The code already has:
```javascript
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'
```

Add this environment variable in Vercel backend settings:
- `FRONTEND_URL`: `https://your-frontend-app.vercel.app`

## Step 5: Test Your Deployment

1. **Test Backend Health**:
   ```bash
   curl https://your-backend-app.vercel.app/health
   ```

   Should return: `{"status":"ok"}`

2. **Test Firebase Connection**:
   ```bash
   curl https://your-backend-app.vercel.app/api/v1/performances
   ```

   Should return your performances from Firebase.

3. **Test Frontend**:
   - Visit `https://your-frontend-app.vercel.app`
   - Try adding a new performance
   - Verify it's saved to Firebase

## Quick Reference: Environment Variables

### Backend (Vercel)

```env
FIREBASE_PROJECT_ID=f-e-p-4e3a7
FIREBASE_PRIVATE_KEY_ID=d72cbb2efd4a1799a98a7b6ed3eb76e268651bcd
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n[your key here]\n-----END PRIVATE KEY-----\n
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@f-e-p-4e3a7.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=110367504257440813837
FIREBASE_CLIENT_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40f-e-p-4e3a7.iam.gserviceaccount.com
FRONTEND_URL=https://your-frontend-app.vercel.app
NODE_ENV=production
```

### Frontend (Vercel)

```env
VITE_API_URL=https://your-backend-app.vercel.app/api/v1
```

## Troubleshooting

### Issue: "Firebase credentials not found"

**Solution**: Verify all Firebase environment variables are set correctly in Vercel dashboard.

### Issue: "CORS error"

**Solution**:
1. Make sure `FRONTEND_URL` is set in backend environment variables
2. Check that it matches your frontend domain exactly (no trailing slash)

### Issue: "Private key error"

**Solution**:
1. Make sure you copied the entire private key including `-----BEGIN` and `-----END` lines
2. The `\n` newline characters should be in the key
3. Try wrapping the value in quotes in Vercel dashboard

### Issue: "Function timeout"

**Solution**:
1. Vercel serverless functions have a timeout limit
2. For Hobby plan: 10 seconds
3. For Pro plan: 60 seconds
4. Optimize slow Firebase queries

## Monitoring

1. **Vercel Logs**: Check function logs in Vercel dashboard under "Deployments"
2. **Firebase Console**: Monitor Firestore usage at https://console.firebase.google.com/project/f-e-p-4e3a7
3. **Analytics**: Enable Vercel Analytics for traffic monitoring

## Cost Considerations

**Vercel Free Tier Limits**:
- 100 GB bandwidth
- 6,000 build minutes
- Serverless functions: 100 GB-hours

**Firebase Free Tier Limits**:
- 50,000 reads/day
- 20,000 writes/day
- 20,000 deletes/day
- 1 GB storage

Monitor usage in both dashboards to avoid unexpected charges.

## Security Checklist

- ✅ Firebase credentials stored in environment variables (not in code)
- ✅ `.gitignore` prevents committing credentials
- ✅ CORS configured to allow only your frontend domain
- ✅ Environment variables set for production only
- ⚠️ TODO: Add rate limiting for API endpoints
- ⚠️ TODO: Configure Firestore security rules

## Next Steps

1. Set up custom domain in Vercel
2. Configure Firestore security rules
3. Add monitoring/alerting
4. Set up CI/CD pipeline
5. Add SSL certificate (automatic with Vercel)

---

**Need Help?**

- Vercel Docs: https://vercel.com/docs
- Firebase Docs: https://firebase.google.com/docs
- Your Firebase Console: https://console.firebase.google.com/project/f-e-p-4e3a7
