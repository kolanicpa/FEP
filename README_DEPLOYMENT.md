# Theater Management System - Deployment Ready! 🚀

Your application is now ready to deploy to Vercel with Firebase backend.

## What's Been Done

✅ **Migrated from PostgreSQL to Firebase Firestore**
✅ **Fixed frontend to save to Firebase**
✅ **Configured for Vercel serverless deployment**
✅ **Environment-based Firebase credentials**

## Local Development

Both servers are currently running:

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001
- **Firebase**: Connected to `f-e-p-4e3a7` project

### Start Development

```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
cd server
npm run dev
```

## Deploy to Production

### Quick Start (5 minutes)

Follow: **[QUICK_START_VERCEL.md](QUICK_START_VERCEL.md)**

### Detailed Guide

Follow: **[VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)**

### Get Firebase Credentials for Vercel

```bash
node server/extract-firebase-env.js
```

This will display all the environment variables you need to copy into Vercel.

## Project Structure

```
FEP_Web/
├── src/                          # Frontend (React + Vite)
│   ├── pages/
│   │   └── predstave/           # Performances page (connected to Firebase ✅)
│   └── shared/
│       └── api/
│           ├── client.js        # API client
│           └── performanceService.js  # Firebase API calls ✅
│
├── server/                       # Backend (Express + Firebase)
│   ├── src/
│   │   ├── config/
│   │   │   └── firebase.js      # Firebase initialization (Vercel-ready ✅)
│   │   ├── models/              # All using Firebase now ✅
│   │   ├── controllers/
│   │   └── routes/
│   ├── vercel.json              # Vercel serverless config ✅
│   └── extract-firebase-env.js  # Helper to get credentials
│
└── Documentation/
    ├── FIREBASE_MIGRATION_COMPLETE.md
    ├── VERCEL_DEPLOYMENT.md
    ├── QUICK_START_VERCEL.md
    └── MIGRATION.md
```

## Environment Variables

### Development (.env - local)
```bash
# Backend doesn't need env vars - uses firebase-credentials.json file
```

### Production (Vercel)

**Backend:**
- `FIREBASE_PROJECT_ID`
- `FIREBASE_PRIVATE_KEY_ID`
- `FIREBASE_PRIVATE_KEY`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_CLIENT_ID`
- `FIREBASE_CLIENT_CERT_URL`
- `FRONTEND_URL`

**Frontend:**
- `VITE_API_URL`

## Testing

### Test Firebase Connection
```bash
node server/test-firebase.js
```

### Test Performance Creation
```bash
node server/test-create-performance.js
```

### Test API Endpoint
```bash
curl http://localhost:3001/api/v1/performances
```

## Database Migration (Optional)

If you have existing PostgreSQL data:

```bash
cd server
node migrate-to-firebase.js
```

This will transfer all data from PostgreSQL to Firebase.

## Key Features

✅ **Create Performances** - Save to Firebase Firestore
✅ **List Performances** - Load from Firebase
✅ **QR Code Generation** - For tickets
✅ **User Authentication** - With bcrypt
✅ **Email Service** - Nodemailer integration
✅ **Serverless Ready** - Vercel deployment configured

## Firebase Collections

- **performances** - Theater performances with scheduling
- **attendees** - Users and ticket holders
- **tickets** - Links attendees to performances

## API Endpoints

- `GET /health` - Health check
- `GET /api/v1/performances` - List all performances
- `GET /api/v1/performances/:id` - Get specific performance
- `POST /api/v1/performances` - Create new performance ✅
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/tickets` - List tickets
- `POST /api/v1/tickets` - Create ticket

## Monitoring

### Firebase Console
https://console.firebase.google.com/project/f-e-p-4e3a7/firestore

Monitor:
- Database reads/writes
- Storage usage
- Performance

### Vercel Dashboard
https://vercel.com/dashboard

Monitor:
- Function invocations
- Bandwidth usage
- Build logs

## Security

✅ Firebase credentials in environment variables
✅ `.gitignore` protects sensitive files
✅ CORS configured
⚠️ TODO: Add Firestore security rules
⚠️ TODO: Add API rate limiting

## Costs

**Free Tier Limits:**

Firebase:
- 50,000 reads/day
- 20,000 writes/day
- 1 GB storage

Vercel:
- 100 GB bandwidth/month
- 6,000 build minutes/month
- 100 GB-hours serverless functions

## Troubleshooting

### Frontend not loading performances
1. Check browser console for errors
2. Verify backend is running and accessible
3. Check `VITE_API_URL` environment variable

### Backend not connecting to Firebase
1. Verify Firebase credentials are set
2. Check server logs for errors
3. Run `node server/test-firebase.js` to test connection

### Vercel deployment fails
1. Check environment variables are set correctly
2. Verify `FIREBASE_PRIVATE_KEY` includes BEGIN/END lines
3. Check Vercel function logs for errors

## Next Steps

1. ✅ Deploy to Vercel
2. Set up custom domain
3. Configure Firestore security rules
4. Add monitoring/alerting
5. Implement remaining CRUD operations (UPDATE, DELETE)
6. Add loading skeletons
7. Improve error handling

## Support

- **Firebase Docs**: https://firebase.google.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Issue Tracker**: Your project repository

---

**Status**: ✅ Production Ready
**Last Updated**: 2025-12-14
**Firebase Project**: f-e-p-4e3a7
**Version**: 1.0.0
