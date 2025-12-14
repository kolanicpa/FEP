# Vercel Deployment Guide for GitHub Repository

This guide covers deploying your FEP Web application to Vercel from the `kolanicpa/FEP` GitHub repository.

## Project Structure

- **Frontend**: React + Vite application (root directory)
- **Backend**: Node.js/Express API (server directory)
- **Database**: Firebase Firestore

## Deployment Overview

You need to create **TWO separate Vercel projects**:
1. Frontend (React app)
2. Backend (API)

---

## 1. Frontend Deployment

### Vercel Project Settings

1. **Import from GitHub**: Select `kolanicpa/FEP` repository
2. **Project Settings**:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave empty or use root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Environment Variables

Add this environment variable in Vercel dashboard:

```
VITE_API_URL=https://your-backend-url.vercel.app/api/v1
```

Replace `your-backend-url` with your actual backend Vercel URL after deploying the backend.

### Configuration File

The frontend `vercel.json` is already configured at the root level.

---

## 2. Backend Deployment

### Vercel Project Settings

1. **Import from GitHub**: Select `kolanicpa/FEP` repository again (separate project)
2. **Project Settings**:
   - **Framework Preset**: Other
   - **Root Directory**: `./server`
   - **Build Command**: (leave empty)
   - **Output Directory**: (leave empty)
   - **Install Command**: `npm install`

### Environment Variables

Add these environment variables in Vercel dashboard:

#### Required Firebase Variables
```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_CLIENT_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/...
```

**Important**: The `FIREBASE_PRIVATE_KEY` must include the quotes and the `\n` characters for line breaks.

#### Required Application Variables
```
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.vercel.app
JWT_SECRET=your-secure-jwt-secret-change-this
JWT_EXPIRES_IN=7d
```

#### Optional Email Variables (if using email service)
```
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM="Theater Tickets <your-email@gmail.com>"
```

### Configuration File

The backend `vercel.json` is already configured at `server/vercel.json`.

---

## 3. How to Get Firebase Credentials

### Method 1: From Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the gear icon → Project Settings
4. Go to **Service Accounts** tab
5. Click **Generate New Private Key**
6. Download the JSON file
7. Extract the values from the JSON and add them to Vercel environment variables

### Method 2: Use Existing Credentials File

If you have `firebase-credentials.json` in `server/src/config/`:

```bash
# From the server directory, run:
node extract-firebase-env.js
```

This will output the environment variables you need to copy to Vercel.

---

## 4. Deployment Steps

### Step 1: Deploy Backend First

1. Create new Vercel project from `kolanicpa/FEP`
2. Set root directory to `./server`
3. Add all environment variables (Firebase + Application)
4. Deploy
5. Copy the deployment URL (e.g., `https://fep-api.vercel.app`)

### Step 2: Deploy Frontend

1. Create another Vercel project from `kolanicpa/FEP`
2. Set root directory to `./` (root)
3. Add environment variable:
   ```
   VITE_API_URL=https://fep-api.vercel.app/api/v1
   ```
   (Use the backend URL from Step 1)
4. Deploy

### Step 3: Update Backend FRONTEND_URL

1. Go to backend Vercel project settings
2. Update the `FRONTEND_URL` environment variable with your frontend URL
3. Redeploy the backend

---

## 5. Verify Deployment

### Backend Health Check
```bash
curl https://your-backend-url.vercel.app/health
```

Should return:
```json
{"status":"ok"}
```

### Frontend
Visit your frontend URL and verify:
- App loads correctly
- Can make API requests to backend
- Firebase integration works

---

## 6. Automatic Deployments

Once set up, Vercel will automatically deploy:
- **Production**: On push to `main` branch
- **Preview**: On pull requests

---

## 7. Troubleshooting

### Backend Returns 500 Error
- Check Firebase environment variables are correct
- Verify `FIREBASE_PRIVATE_KEY` has proper line breaks (`\n`)
- Check Vercel function logs

### Frontend Can't Connect to Backend
- Verify `VITE_API_URL` is correct
- Check CORS settings in backend
- Verify `FRONTEND_URL` in backend matches your frontend domain

### Firebase Connection Issues
- Ensure all Firebase credentials are added
- Check Firebase project is active
- Verify service account has proper permissions

---

## 8. Important Notes

1. **Two Separate Projects**: You must create two Vercel projects from the same GitHub repo
2. **Root Directories**: Frontend uses `./`, Backend uses `./server`
3. **Environment Variables**: Must be set in Vercel dashboard for each project
4. **Private Keys**: Keep Firebase credentials secure, never commit them
5. **CORS**: Backend is configured to accept requests from `FRONTEND_URL`

---

## 9. Local Development

Keep using local development as before:

```bash
# Terminal 1 - Backend
cd server
npm install
npm run dev

# Terminal 2 - Frontend
npm install
npm run dev
```

---

## Summary

- ✅ Frontend: Vite app deployed from root directory
- ✅ Backend: Express API deployed from server directory
- ✅ Database: Firebase Firestore (configured via environment variables)
- ✅ Auto-deploy: Enabled on push to main branch
- ✅ Two projects: One for frontend, one for backend

Your application is now ready for production deployment on Vercel!
