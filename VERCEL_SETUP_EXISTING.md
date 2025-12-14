# Configure Your Existing Vercel Project with Firebase

Your Vercel app: **https://fepme.vercel.app/**

## Step 1: Add Firebase Environment Variables

### Go to Vercel Dashboard

1. Open: https://vercel.com/dashboard
2. Find your **fepme** project
3. Click on it, then go to: **Settings → Environment Variables**

### Add These 6 Variables

Get all the values by running:
```bash
node server/extract-firebase-env.js
```

Then add each one in Vercel:

| Variable Name | Value | Select |
|---------------|-------|--------|
| `FIREBASE_PROJECT_ID` | `f-e-p-4e3a7` | ✅ Production, Preview, Development |
| `FIREBASE_PRIVATE_KEY_ID` | `d72cbb2efd4a1799a98a7b6ed3eb76e268651bcd` | ✅ Production, Preview, Development |
| `FIREBASE_PRIVATE_KEY` | Copy entire key with `-----BEGIN` and `-----END` lines | ✅ Production, Preview, Development |
| `FIREBASE_CLIENT_EMAIL` | `firebase-adminsdk-fbsvc@f-e-p-4e3a7.iam.gserviceaccount.com` | ✅ Production, Preview, Development |
| `FIREBASE_CLIENT_ID` | `110367504257440813837` | ✅ Production, Preview, Development |
| `FIREBASE_CLIENT_CERT_URL` | `https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40f-e-p-4e3a7.iam.gserviceaccount.com` | ✅ Production, Preview, Development |

**IMPORTANT for FIREBASE_PRIVATE_KEY:**
- Copy the ENTIRE key including the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` lines
- The `\n` characters are correct - keep them!
- It should look like this:
  ```
  -----BEGIN PRIVATE KEY-----
  MIIEvAIBADANBgkqhkiG9w0BAQEFAASCB...
  ...many more lines...
  -----END PRIVATE KEY-----
  ```

### Add CORS Configuration

Add one more variable for CORS:

| Variable Name | Value | Select |
|---------------|-------|--------|
| `FRONTEND_URL` | `https://fepme.vercel.app` | ✅ Production, Preview, Development |

## Step 2: Verify Your Vercel Configuration

### Check if you're deploying the right directory

1. In Vercel Dashboard → Your Project → **Settings → General**
2. Look for "Root Directory"
3. It should be: **`server`** (for backend) or **`.`** (root, for frontend)

### If you have separate projects:

**Backend Project** (API):
- Root Directory: `server`
- Framework: Other
- Build Command: (empty)
- Install Command: `npm install`

**Frontend Project** (UI):
- Root Directory: `.` (root) or leave empty
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

## Step 3: Configure Frontend Environment Variable

If your frontend is on the same domain or a different Vercel project:

### Add to Frontend Project Settings:

| Variable Name | Value |
|---------------|-------|
| `VITE_API_URL` | `https://your-backend-api.vercel.app/api/v1` |

Or if backend and frontend are in one project:
| Variable Name | Value |
|---------------|-------|
| `VITE_API_URL` | `https://fepme.vercel.app/api/v1` |

## Step 4: Redeploy

After adding environment variables:

### Option 1: Redeploy via Dashboard
1. Go to **Deployments** tab
2. Click **"..."** menu on the latest deployment
3. Click **"Redeploy"**
4. Select **"Use existing Build Cache"** ❌ (uncheck - we want fresh build)
5. Click **"Redeploy"**

### Option 2: Redeploy via CLI
```bash
cd server  # or root directory
vercel --prod
```

### Option 3: Git Push
```bash
git add .
git commit -m "Configure Firebase for Vercel"
git push
```
Vercel will automatically deploy on push.

## Step 5: Test Your Deployment

### Test Backend Health
```bash
curl https://fepme.vercel.app/health
```

Expected: `{"status":"ok"}`

### Test Firebase Connection
```bash
curl https://fepme.vercel.app/api/v1/performances
```

Expected: JSON array of performances from Firebase

### Test Frontend
Visit: https://fepme.vercel.app

Try adding a new performance - it should save to Firebase!

## Troubleshooting

### Error: "Firebase credentials not found"

**Check:**
1. All 6 Firebase variables are added in Vercel
2. Variables are selected for Production, Preview, AND Development
3. You redeployed after adding variables

**Fix:**
- Go back to Settings → Environment Variables
- Verify all variables are there
- Click "Redeploy" in Deployments tab

### Error: "Private key error" or "Invalid credentials"

**Check:**
1. `FIREBASE_PRIVATE_KEY` includes `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
2. All `\n` characters are present in the key
3. No extra spaces or line breaks added

**Fix:**
- Delete the `FIREBASE_PRIVATE_KEY` variable
- Run `node server/extract-firebase-env.js` again
- Copy the ENTIRE key output exactly as shown
- Paste it fresh into Vercel

### Error: CORS blocked

**Check:**
1. `FRONTEND_URL` is set in backend environment variables
2. URL matches exactly (no trailing slash)
3. Backend is redeployed after adding the variable

**Fix:**
```bash
# In Vercel backend settings, set:
FRONTEND_URL=https://fepme.vercel.app
```
Then redeploy.

### Deployment succeeds but page shows error

**Check Vercel Function Logs:**
1. Go to Vercel Dashboard → Your Project
2. Click **"Logs"** or **"Functions"** tab
3. Look for error messages
4. Check if Firebase initialization succeeded

Look for this in logs:
```
✅ "Using Firebase credentials from environment variables"
```

If you see:
```
❌ "Using Firebase credentials from file"
```
Then environment variables aren't being detected. Check they're all set.

## Quick Checklist

Before testing, verify:

- ✅ All 6 Firebase environment variables added
- ✅ Variables selected for Production, Preview, Development
- ✅ `FIREBASE_PRIVATE_KEY` includes BEGIN/END lines
- ✅ `FRONTEND_URL` added (for CORS)
- ✅ Redeployed after adding variables
- ✅ Checked deployment logs for errors

## View Logs

To see what's happening in production:

```bash
# Using Vercel CLI
vercel logs your-project-url
```

Or in Dashboard:
1. Go to your project
2. Click "Deployments"
3. Click on a deployment
4. View "Function Logs" or "Build Logs"

## Your URLs

- **Frontend**: https://fepme.vercel.app
- **Backend API**: https://fepme.vercel.app/api/v1 (or separate backend URL if you have one)
- **Health Check**: https://fepme.vercel.app/health
- **Firebase Console**: https://console.firebase.google.com/project/f-e-p-4e3a7

## Next Steps After Deployment

1. ✅ Test all functionality
2. Monitor Firebase usage in console
3. Set up Firestore security rules
4. Configure custom domain (if needed)
5. Enable Vercel Analytics
6. Set up monitoring/alerting

---

**Need the credentials again?**
Run: `node server/extract-firebase-env.js`
