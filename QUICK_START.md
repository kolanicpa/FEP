# Quick Start Guide - Theater Attendee Management

## 🚀 Get Started in 5 Steps

### Step 1: Install PostgreSQL

**Easiest Method - Postgres.app:**
1. Download: https://postgresapp.com/
2. Move to Applications folder
3. Open and click "Initialize"
4. Done! ✅

**Alternative - Official Installer:**
https://www.postgresql.org/download/macosx/

After installation, add to PATH:
```bash
# For Postgres.app
export PATH="/Applications/Postgres.app/Contents/Versions/latest/bin:$PATH"

# For official installer
export PATH="/Library/PostgreSQL/15/bin:$PATH"
```

Verify installation:
```bash
psql --version
```

---

### Step 2: Set Up Database

**Option A: Use the setup script (automatic):**
```bash
cd /Users/nikolapanic/Desktop/FEP_Web/server
./setup-database.sh
```

The script will:
- Create `theater_db` database
- Create `theater_admin` user
- Run all migrations
- Seed initial performance data
- Update your `.env` file

**Option B: Manual setup:**
```bash
# Connect to PostgreSQL
psql postgres

# Run these commands:
CREATE DATABASE theater_db;
CREATE USER theater_admin WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE theater_db TO theater_admin;
\c theater_db
GRANT ALL ON SCHEMA public TO theater_admin;
\q

# Run migrations
cd /Users/nikolapanic/Desktop/FEP_Web/server
psql -U theater_admin -d theater_db -f migrations/001_create_performances.sql
psql -U theater_admin -d theater_db -f migrations/002_create_attendees.sql
psql -U theater_admin -d theater_db -f migrations/003_create_tickets.sql
```

---

### Step 3: Configure Email (Gmail)

1. **Enable 2FA on your Google Account:**
   https://myaccount.google.com/security

2. **Generate App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other"
   - Name it "Theater App"
   - Copy the 16-character password

3. **Update server/.env file:**
   ```env
   DB_PASSWORD=your_database_password
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=xxxx xxxx xxxx xxxx  # 16-char app password
   EMAIL_FROM="Theater Tickets <your-email@gmail.com>"
   ```

---

### Step 4: Start the Servers

**Terminal 1 - Backend:**
```bash
cd /Users/nikolapanic/Desktop/FEP_Web/server
npm run dev
```

Expected output:
```
Server running on http://localhost:3001
Email service ready
```

**Terminal 2 - Frontend:**
```bash
cd /Users/nikolapanic/Desktop/FEP_Web
npm run dev
```

Expected output:
```
  ➜  Local:   http://localhost:5173/
```

---

### Step 5: Test the Application

1. Open browser: **http://localhost:5173/posetnici**

2. You should see:
   - "Upravljanje poseticima" heading
   - Performance dropdown
   - Email input field

3. **Send a test ticket:**
   - Select "Hamlet" from dropdown
   - Enter your email address
   - Click "Pošalji ulaznica"
   - Check your email!

---

## 📧 Expected Email

You should receive an email with:
- **Subject:** "Vaša ulaznica za predstavu: Hamlet"
- **Content:**
  - Performance name, date, time, category
  - QR code image (300x300px)
  - Ticket ID (UUID)
  - Dark-themed design matching your app

---

## 🔧 Troubleshooting

### Backend won't start

**"Cannot find module"**
```bash
cd server && npm install
```

**"Database connection failed"**
- Check PostgreSQL is running
- Verify password in `server/.env`
- Test: `psql -U theater_admin -d theater_db`

**"Email config error"**
- Check Gmail credentials in `server/.env`
- Verify 2FA is enabled
- Regenerate app password

### Frontend Issues

**"API request failed"**
- Make sure backend is running (port 3001)
- Check browser console
- Test: http://localhost:3001/api/v1/performances

### Email not received

- Check Spam/Junk folder
- Verify app password is correct (no extra spaces)
- Check backend logs for email errors

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `server/.env` | Backend configuration (database, email) |
| `.env` | Frontend API URL |
| `server/setup-database.sh` | Automated database setup |
| `SETUP_GUIDE.md` | Detailed setup instructions |

---

## 🎯 Quick Commands

```bash
# Check database
psql -U theater_admin -d theater_db

# View tables
\dt

# View performances
SELECT * FROM performances;

# View tickets
SELECT * FROM tickets;

# Exit psql
\q

# Start backend
cd server && npm run dev

# Start frontend
cd .. && npm run dev
```

---

## ✅ Success Checklist

- [ ] PostgreSQL installed and running
- [ ] Database `theater_db` created
- [ ] Tables created (performances, attendees, tickets)
- [ ] Sample data visible (4 performances)
- [ ] Gmail app password generated
- [ ] `server/.env` updated with email credentials
- [ ] Backend starts without errors (port 3001)
- [ ] Frontend starts without errors (port 5173)
- [ ] Can access http://localhost:5173/posetnici
- [ ] Can select performance from dropdown
- [ ] Can send test ticket
- [ ] Email received with QR code

---

## 🆘 Need Help?

See `SETUP_GUIDE.md` for detailed instructions and troubleshooting.

**Test API directly:**
- Health check: http://localhost:3001/health
- Performances: http://localhost:3001/api/v1/performances

**Backend logs:**
Check the terminal where backend is running for detailed error messages.
