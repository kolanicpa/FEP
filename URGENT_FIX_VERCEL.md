# 🚨 URGENT: Fix Your Vercel Backend

## The Problem

Your backend is trying to connect to PostgreSQL instead of Firebase because the Firebase environment variables are **NOT SET** in Vercel.

Error: `connect ECONNREFUSED 127.0.0.1:5432`

This means your `fep-api` Vercel project doesn't have the Firebase credentials.

## The Solution (5 Minutes)

### Step 1: Get Your Firebase Credentials

Run this command:
```bash
node server/extract-firebase-env.js
```

Copy the output - you'll need it!

### Step 2: Add Environment Variables to Vercel

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard

2. **Find your `fep-api` project** and click on it

3. **Go to Settings → Environment Variables**

4. **Add these 6 variables ONE BY ONE**:

   For each variable:
   - Click "Add New"
   - Enter the Name
   - Paste the Value (from the script output)
   - Select: ✅ Production, ✅ Preview, ✅ Development
   - Click "Save"

   **Variables to add:**

   | Name | Get Value From |
   |------|----------------|
   | `FIREBASE_PROJECT_ID` | Script output |
   | `FIREBASE_PRIVATE_KEY_ID` | Script output |
   | `FIREBASE_PRIVATE_KEY` | Script output (ENTIRE key with BEGIN/END) |
   | `FIREBASE_CLIENT_EMAIL` | Script output |
   | `FIREBASE_CLIENT_ID` | Script output |
   | `FIREBASE_CLIENT_CERT_URL` | Script output |

5. **Add one more variable**:

   | Name | Value |
   |------|-------|
   | `FRONTEND_URL` | `https://fepme.vercel.app` |

### Step 3: Redeploy Backend

After adding ALL 7 variables:

**Option A: Redeploy via Dashboard**
1. Go to the **Deployments** tab
2. Find the latest deployment
3. Click the "..." menu
4. Click **"Redeploy"**
5. ⚠️ **UNCHECK** "Use existing Build Cache"
6. Click "Redeploy"

**Option B: Redeploy via CLI**
```bash
cd server
vercel --prod
```

### Step 4: Wait & Test

Wait for deployment to complete (1-2 minutes), then test:

```bash
curl https://fep-api.vercel.app/api/v1/performances
```

**Expected Result:**
```json
{"performances":[]}
```
or an array of performances if you have data.

**NOT:**
```json
{"error":{"message":"connect ECONNREFUSED 127.0.0.1:5432"}}
```

## Visual Guide: Adding Environment Variables in Vercel

```
1. Dashboard → Your Project (fep-api)
   ↓
2. Settings (top menu)
   ↓
3. Environment Variables (left sidebar)
   ↓
4. Click "Add New"
   ↓
5. Fill in:
   - Name: FIREBASE_PROJECT_ID
   - Value: f-e-p-4e3a7
   - Select: Production ✅ Preview ✅ Development ✅
   ↓
6. Click "Save"
   ↓
7. Repeat for all 7 variables
```

## Common Mistakes to Avoid

❌ **DON'T**: Add variables only to Production
✅ **DO**: Select Production, Preview, AND Development

❌ **DON'T**: Copy only part of FIREBASE_PRIVATE_KEY
✅ **DO**: Copy the ENTIRE key including:
```
-----BEGIN PRIVATE KEY-----
[all the content]
-----END PRIVATE KEY-----
```

❌ **DON'T**: Remove the `\n` characters from the private key
✅ **DO**: Keep them - they're correct!

❌ **DON'T**: Forget to redeploy after adding variables
✅ **DO**: Redeploy with a fresh build (no cache)

## Verify Environment Variables Are Set

After adding variables, you can verify in Vercel:

1. Go to Settings → Environment Variables
2. You should see 7 variables listed:
   - FIREBASE_PROJECT_ID
   - FIREBASE_PRIVATE_KEY_ID
   - FIREBASE_PRIVATE_KEY
   - FIREBASE_CLIENT_EMAIL
   - FIREBASE_CLIENT_ID
   - FIREBASE_CLIENT_CERT_URL
   - FRONTEND_URL

## Check Deployment Logs

After redeploying:

1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **"View Function Logs"**
4. Look for: `"Using Firebase credentials from environment variables"`

If you see: `"Using Firebase credentials from file"` or an error about credentials not found, the environment variables aren't being picked up.

## Test Commands

After redeploying with environment variables:

```bash
# Should work ✅
curl https://fep-api.vercel.app/health

# Should also work ✅
curl https://fep-api.vercel.app/api/v1/performances

# Should NOT see this error ❌
# {"error":{"message":"connect ECONNREFUSED 127.0.0.1:5432"}}
```

## Quick Reference

**Get credentials:**
```bash
node server/extract-firebase-env.js
```

**Your backend URL:**
https://fep-api.vercel.app

**Your Vercel dashboard:**
https://vercel.com/dashboard

**Firebase Console:**
https://console.firebase.google.com/project/f-e-p-4e3a7

---

**Status**: Backend is deployed but needs Firebase environment variables!
**Time to fix**: 5 minutes
**Next**: Add the 7 environment variables in Vercel Dashboard
