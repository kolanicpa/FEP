# Fix Your Vercel Deployment - Step by Step

Your site **https://fepme.vercel.app/** is live but the backend API is not working.

## The Problem

The API endpoints (`/health`, `/api/v1/performances`) are returning 404 Not Found.

This means either:
1. Only the frontend is deployed (not the backend)
2. The backend is in a different Vercel project
3. The routing is not configured correctly

## Solution: Two Deployment Options

### Option A: Separate Projects (Recommended)

Deploy frontend and backend as two separate Vercel projects.

**Advantages:**
- Cleaner separation
- Independent scaling
- Easier debugging

#### Step 1: Deploy Backend (New Project)

1. **Go to Vercel Dashboard**: https://vercel.com/new

2. **Import the same repository** (or upload just the `server` folder)

3. **Configure the backend project**:
   - Project Name: `fepme-api` (or any name you want)
   - Framework Preset: **Other**
   - Root Directory: **`server`** ⚠️ IMPORTANT
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
   - Install Command: `npm install`

4. **Add Environment Variables** (6 Firebase + 1 CORS):

   Run this to get the values:
   ```bash
   node server/extract-firebase-env.js
   ```

   Add these in Settings → Environment Variables:
   - `FIREBASE_PROJECT_ID` = `f-e-p-4e3a7`
   - `FIREBASE_PRIVATE_KEY_ID` = (from script)
   - `FIREBASE_PRIVATE_KEY` = (entire key from script)
   - `FIREBASE_CLIENT_EMAIL` = (from script)
   - `FIREBASE_CLIENT_ID` = (from script)
   - `FIREBASE_CLIENT_CERT_URL` = (from script)
   - `FRONTEND_URL` = `https://fepme.vercel.app`

   Select **Production, Preview, AND Development** for each!

5. **Deploy**

6. **Note the backend URL**: e.g., `https://fepme-api.vercel.app`

#### Step 2: Update Frontend to Use Backend API

1. **Go to your frontend project settings** (fepme):
   - Settings → Environment Variables

2. **Add this variable**:
   - `VITE_API_URL` = `https://fepme-api.vercel.app/api/v1`

   Replace with your actual backend URL from Step 1.

3. **Redeploy frontend**

4. **Test**: https://fepme.vercel.app should now work!

---

### Option B: Monorepo (Single Project)

Deploy both frontend and backend from the same Vercel project.

This is more complex and requires a custom Vercel configuration.

#### Step 1: Update vercel.json in Root

Create or update `/Users/nikolapanic/Desktop/FEP_Web/vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "server/src/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server/src/server.js"
    },
    {
      "src": "/health",
      "dest": "server/src/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

#### Step 2: Add Firebase Environment Variables

Same as Option A - add all 6 Firebase variables to your `fepme` project.

#### Step 3: Add Frontend Environment Variable

Add to `fepme` project:
- `VITE_API_URL` = `https://fepme.vercel.app/api/v1`

#### Step 4: Redeploy

```bash
git add vercel.json
git commit -m "Configure Vercel for full-stack deployment"
git push
```

---

## Recommended Approach: Option A (Separate Projects)

**Why?**
- ✅ Simpler configuration
- ✅ Easier to debug
- ✅ Better separation of concerns
- ✅ Independent scaling

**Quick Setup:**

1. Create new Vercel project for backend
2. Set Root Directory to `server`
3. Add 6 Firebase environment variables
4. Add `FRONTEND_URL` = `https://fepme.vercel.app`
5. Deploy
6. Update frontend's `VITE_API_URL` to point to backend
7. Redeploy frontend

## Testing After Deployment

### Test Backend Health:
```bash
curl https://your-backend-url.vercel.app/health
```
Should return: `{"status":"ok"}`

### Test Backend API:
```bash
curl https://your-backend-url.vercel.app/api/v1/performances
```
Should return: JSON array of performances

### Test Frontend:
Visit `https://fepme.vercel.app` and try adding a performance.

## Current Setup Summary

**What you have now:**
- ✅ Frontend deployed at: https://fepme.vercel.app
- ❌ Backend: NOT working (404 errors)

**What you need:**
1. Deploy backend separately (Option A)
   OR
2. Configure monorepo routing (Option B)

**Recommended:** Use Option A - it's much simpler!

## Quick Start (Option A)

1. **Deploy Backend**:
   ```bash
   cd server
   vercel --name fepme-api
   ```

2. **Add Firebase env vars** in Vercel Dashboard for the new project

3. **Update frontend** env var:
   ```
   VITE_API_URL=https://fepme-api.vercel.app/api/v1
   ```

4. **Redeploy frontend**:
   ```bash
   vercel --prod
   ```

5. **Test**: Visit https://fepme.vercel.app

---

**Need the Firebase credentials?**
Run: `node server/extract-firebase-env.js`
