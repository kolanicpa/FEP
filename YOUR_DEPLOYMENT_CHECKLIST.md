# Your Deployment Checklist

## Your Vercel Projects

1. **Frontend**: https://fepme.vercel.app (already deployed ✅)
2. **Backend API**: https://fep-api.vercel.app (you just created this ✅)

## What You Need to Do Now

### Step 1: Add Firebase Environment Variables to Backend (fep-api)

Go to: https://vercel.com/dashboard → **fep-api** → Settings → Environment Variables

Run this command to get the values:
```bash
node server/extract-firebase-env.js
```

Add these **6 variables** (select Production, Preview, AND Development for each):

| Variable Name | Value |
|---------------|-------|
| `FIREBASE_PROJECT_ID` | `f-e-p-4e3a7` |
| `FIREBASE_PRIVATE_KEY_ID` | Copy from script output |
| `FIREBASE_PRIVATE_KEY` | Copy ENTIRE key from script (with BEGIN/END lines) |
| `FIREBASE_CLIENT_EMAIL` | Copy from script output |
| `FIREBASE_CLIENT_ID` | Copy from script output |
| `FIREBASE_CLIENT_CERT_URL` | Copy from script output |

**Plus one more variable:**

| Variable Name | Value |
|---------------|-------|
| `FRONTEND_URL` | `https://fepme.vercel.app` |

**Total: 7 environment variables**

### Step 2: Add API URL to Frontend (fepme)

Go to: https://vercel.com/dashboard → **fepme** → Settings → Environment Variables

Add this **1 variable** (select Production, Preview, AND Development):

| Variable Name | Value |
|---------------|-------|
| `VITE_API_URL` | `https://fep-api.vercel.app/api/v1` |

### Step 3: Redeploy Both Projects

After adding environment variables:

**Option A: Redeploy via Dashboard**
1. Go to each project → Deployments tab
2. Click the "..." menu on the latest deployment
3. Click "Redeploy"

**Option B: Automatic Redeploy**
Your push to GitHub should trigger automatic redeployment of both projects.

### Step 4: Test Your Deployment

**Test Backend Health:**
```bash
curl https://fep-api.vercel.app/health
```
Expected: `{"status":"ok"}`

**Test Backend API:**
```bash
curl https://fep-api.vercel.app/api/v1/performances
```
Expected: JSON array of performances from Firebase

**Test Frontend:**
Visit: https://fepme.vercel.app
- Try adding a new performance
- It should save to Firebase!

## Quick Status Check

### Before You're Done:

- ⬜ Added 7 environment variables to **fep-api** backend project
- ⬜ Added 1 environment variable to **fepme** frontend project
- ⬜ Redeployed backend (or wait for auto-deploy)
- ⬜ Redeployed frontend (or wait for auto-deploy)
- ⬜ Tested backend health endpoint
- ⬜ Tested frontend - can add performances

### After Everything Works:

- ✅ Backend API responding at https://fep-api.vercel.app
- ✅ Frontend working at https://fepme.vercel.app
- ✅ Data saving to Firebase
- ✅ CORS configured correctly

## Troubleshooting

### Backend shows "Firebase credentials not found"

**Fix:**
1. Verify all 6 Firebase variables are added in Vercel
2. Check they're selected for Production, Preview, AND Development
3. Redeploy the backend

### Frontend shows CORS error

**Fix:**
1. Make sure `FRONTEND_URL=https://fepme.vercel.app` is set in backend
2. Redeploy backend after adding it

### Backend shows "Private key error"

**Fix:**
1. Make sure `FIREBASE_PRIVATE_KEY` includes the full key with:
   - `-----BEGIN PRIVATE KEY-----`
   - The key content
   - `-----END PRIVATE KEY-----`
2. Keep the `\n` characters - they're needed!

## View Logs

To check if everything is working:

1. Go to Vercel Dashboard → **fep-api**
2. Click "Deployments"
3. Click on the latest deployment
4. View "Function Logs"

Look for:
✅ `"Using Firebase credentials from environment variables"`

If you see:
❌ `"Using Firebase credentials from file"`
Then environment variables aren't being detected.

## Get Firebase Credentials Again

```bash
node server/extract-firebase-env.js
```

## Your URLs

- **Frontend**: https://fepme.vercel.app
- **Backend API**: https://fep-api.vercel.app
- **Backend Health**: https://fep-api.vercel.app/health
- **Performances API**: https://fep-api.vercel.app/api/v1/performances
- **Firebase Console**: https://console.firebase.google.com/project/f-e-p-4e3a7
- **Vercel Dashboard**: https://vercel.com/dashboard

## Local .env.production Created

I've created a `.env.production` file in your root directory with:
```
VITE_API_URL=https://fep-api.vercel.app/api/v1
```

This will be used when building your frontend locally. However, you still need to add this to Vercel environment variables.

---

**Estimated Time to Complete**: 5-10 minutes
