# Theater Attendee Management System - Setup Guide

## Prerequisites Installation

### Step 1: Install PostgreSQL

**Option A: Using Homebrew (Recommended)**

If you have Homebrew installed:
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Option B: Official PostgreSQL Installer**

1. Download from: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
2. Choose macOS version (latest 15.x)
3. Run the installer
4. During installation:
   - Set a password for `postgres` user (remember this!)
   - Port: 5432
   - Locale: Default
5. After installation, add PostgreSQL to your PATH:
   ```bash
   export PATH="/Library/PostgreSQL/15/bin:$PATH"
   ```
   Add this line to your `~/.zshrc` or `~/.bash_profile` to make it permanent.

**Option C: Postgres.app (Easiest for Mac)**

1. Download from: https://postgresapp.com/
2. Move to Applications folder
3. Open Postgres.app
4. Click "Initialize" to create a new server
5. Add to PATH:
   ```bash
   export PATH="/Applications/Postgres.app/Contents/Versions/latest/bin:$PATH"
   ```

### Step 2: Verify PostgreSQL Installation

```bash
psql --version
# Should output: psql (PostgreSQL) 15.x
```

---

## Database Setup

### Step 1: Create Database and User

```bash
# Connect to PostgreSQL as superuser
psql postgres

# In the psql prompt, run:
CREATE DATABASE theater_db;
CREATE USER theater_admin WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE theater_db TO theater_admin;

# If using PostgreSQL 15+, also grant schema privileges:
\c theater_db
GRANT ALL ON SCHEMA public TO theater_admin;

# Exit psql
\q
```

### Step 2: Run Database Migrations

Navigate to your project directory and run migrations:

```bash
cd /Users/nikolapanic/Desktop/FEP_Web

# Run each migration file
psql -U theater_admin -d theater_db -f server/migrations/001_create_performances.sql
psql -U theater_admin -d theater_db -f server/migrations/002_create_attendees.sql
psql -U theater_admin -d theater_db -f server/migrations/003_create_tickets.sql
```

**Note:** You'll be prompted for the password you set for `theater_admin`.

### Step 3: Verify Database Tables

```bash
psql -U theater_admin -d theater_db

# In psql, list all tables:
\dt

# Should show:
# - performances
# - attendees
# - tickets

# View sample data:
SELECT * FROM performances;

# Exit
\q
```

---

## Email Configuration (Gmail)

### Step 1: Enable 2-Factor Authentication

1. Go to your Google Account: https://myaccount.google.com/
2. Security → 2-Step Verification
3. Enable 2-Step Verification if not already enabled

### Step 2: Generate App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Select app: "Mail"
3. Select device: "Other (Custom name)" → Enter "Theater App"
4. Click "Generate"
5. **Copy the 16-character password** (you'll need this next)

### Step 3: Update Backend .env File

Edit `/Users/nikolapanic/Desktop/FEP_Web/server/.env`:

```env
PORT=3001
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=theater_db
DB_USER=theater_admin
DB_PASSWORD=your_secure_password    # Password you set in Step 1

EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com     # Your Gmail address
EMAIL_PASSWORD=abcd efgh ijkl mnop  # The 16-char app password from Step 2
EMAIL_FROM="Theater Tickets <your-email@gmail.com>"

FRONTEND_URL=http://localhost:5173
```

**Important:** Replace:
- `DB_PASSWORD` with your PostgreSQL password
- `EMAIL_USER` with your Gmail address
- `EMAIL_PASSWORD` with the 16-character app password (with or without spaces)
- `EMAIL_FROM` with your desired sender name and email

---

## Install Dependencies

### Backend Dependencies

```bash
cd /Users/nikolapanic/Desktop/FEP_Web/server
npm install
```

This will install:
- express (web framework)
- pg (PostgreSQL client)
- nodemailer (email sending)
- qrcode (QR code generation)
- cors, helmet (security)
- dotenv (environment variables)
- express-validator (input validation)

### Frontend Dependencies (if not already installed)

```bash
cd /Users/nikolapanic/Desktop/FEP_Web
npm install
```

---

## Start the Application

### Terminal 1: Start Backend Server

```bash
cd /Users/nikolapanic/Desktop/FEP_Web/server
npm run dev
```

**Expected output:**
```
Server running on http://localhost:3001
Email service ready
```

**If you see "Email config error":** Check your Gmail credentials in `.env`

**If you see "Database error":** Verify PostgreSQL is running and credentials are correct

### Terminal 2: Start Frontend Server

```bash
cd /Users/nikolapanic/Desktop/FEP_Web
npm run dev
```

**Expected output:**
```
VITE v7.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

---

## Access the Application

1. Open browser: http://localhost:5173
2. Navigate to the attendee management page: http://localhost:5173/posetnici

You should see:
- "Upravljanje poseticima" heading
- Performance dropdown
- Email input field

---

## Testing the Complete Flow

### Test 1: Send a Test Ticket

1. Navigate to: http://localhost:5173/posetnici
2. Select a performance from dropdown (e.g., "Hamlet")
3. Enter your email address
4. Click "Pošalji ulaznica"
5. Check your email inbox for the ticket with QR code

**Expected result:**
- Success message: "Ulaznica uspešno poslata na [your-email]"
- Email received with:
  - Performance details (name, date, time, category)
  - QR code image
  - Ticket ID

### Test 2: View Tickets Table

After sending a ticket:
- The tickets table should appear below the form
- Shows: email, ticket ID, status, creation date

### Test 3: Check Available Tickets

- After creating a ticket, the available count should decrease
- Example: "Hamlet" starts with 320, after 1 ticket → 319 available

### Test 4: Duplicate Prevention

Try sending another ticket to the same email for the same performance:
- Should show error: "Ticket already exists for this attendee"

---

## Troubleshooting

### Backend won't start

**Error: "Cannot find module 'express'"**
```bash
cd server
npm install
```

**Error: "Database connection failed"**
- Check PostgreSQL is running
- Verify credentials in `server/.env`
- Test connection: `psql -U theater_admin -d theater_db`

**Error: "Email config error"**
- Verify Gmail credentials in `server/.env`
- Check that 2FA is enabled
- Regenerate app password if needed

### Frontend Issues

**Error: "API request failed"**
- Make sure backend is running on port 3001
- Check browser console for specific error
- Verify `VITE_API_URL` in frontend `.env`

**Error: "Failed to load performances"**
- Backend not running or not accessible
- Check backend logs for errors
- Test API directly: http://localhost:3001/api/v1/performances

### Email Not Received

**Check Gmail Spam/Junk folder**

**Test email credentials:**
```bash
cd server
node -e "
import('nodemailer').then(nm => {
  const transporter = nm.default.createTransporter({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-app-password'
    }
  });
  transporter.verify((error, success) => {
    if (error) console.error('Email error:', error);
    else console.log('Email configured correctly!');
  });
});
"
```

### Database Issues

**Error: "relation does not exist"**
- Migrations not run correctly
- Re-run migration files in order (001, 002, 003)

**Error: "permission denied"**
- User doesn't have proper privileges
- Re-run GRANT commands from database setup

---

## API Endpoints Reference

### Performances
- `GET /api/v1/performances` - List all performances
- `GET /api/v1/performances/:id` - Get single performance

### Tickets
- `POST /api/v1/tickets` - Create ticket and send email
  ```json
  {
    "performanceId": 1,
    "email": "attendee@example.com"
  }
  ```
- `GET /api/v1/tickets/performance/:performanceId` - Get tickets for performance

### Health Check
- `GET /health` - Server health check

---

## Next Steps

Once everything is working:

1. **Test with different performances**
2. **Add navigation link** to the posetnici page in your app's navigation
3. **Production setup:**
   - Use PostgreSQL on a hosting service (Heroku, Railway, Render)
   - Switch to SendGrid for email (better deliverability)
   - Deploy backend and frontend separately

---

## Quick Reference

**Database commands:**
```bash
# Connect to database
psql -U theater_admin -d theater_db

# View tables
\dt

# View performances
SELECT * FROM performances;

# View tickets
SELECT * FROM tickets;

# Exit
\q
```

**Server commands:**
```bash
# Backend
cd server && npm run dev

# Frontend
npm run dev
```

**File locations:**
- Backend config: `/server/.env`
- Frontend config: `/.env`
- Migrations: `/server/migrations/`
- New page: `/src/pages/posetnici/ui/PoseticiniPage.jsx`
- Route: `/src/routes/posetnici.jsx`
