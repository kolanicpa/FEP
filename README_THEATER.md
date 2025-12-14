# Theater Attendee Management System

A full-stack application for managing theater attendees and sending tickets with QR codes via email.

## ✨ Features

- **Admin Page:** Manage attendees for theater performances
- **Email Tickets:** Automatically send tickets with QR codes via email
- **Performance Management:** Track available tickets for each show
- **Duplicate Prevention:** One ticket per attendee per performance
- **Beautiful Emails:** Dark-themed HTML emails with embedded QR codes

---

## 🚀 Quick Start

### 1. Install PostgreSQL

**⭐ Easiest Method - Postgres.app:**

1. Download: **https://postgresapp.com/**
2. Move to Applications and open
3. Click "Initialize"
4. Add to PATH:
```bash
export PATH="/Applications/Postgres.app/Contents/Versions/latest/bin:$PATH"
```

Verify: `psql --version`

### 2. Setup Database

```bash
cd server
./setup-database.sh
```

### 3. Configure Email (Gmail)

1. Enable 2FA: https://myaccount.google.com/security
2. Generate app password: https://myaccount.google.com/apppasswords
3. Update `server/.env`:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
```

### 4. Start Servers

```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
npm run dev
```

### 5. Test

Open: **http://localhost:5173/posetnici**

---

## 📚 Full Documentation

- **QUICK_START.md** - 5-minute setup guide
- **SETUP_GUIDE.md** - Detailed instructions & troubleshooting
- **server/setup-database.sh** - Automated database setup

---

## 🏗️ Tech Stack

- **Backend:** Node.js + Express + PostgreSQL + Nodemailer
- **Frontend:** React 19 + Vite + TanStack Router
- **Features:** QR code generation, Email sending, Ticket management

---

## ✅ Success Checklist

- [ ] PostgreSQL installed
- [ ] Database setup complete (run setup-database.sh)
- [ ] Email credentials configured
- [ ] Backend running on port 3001
- [ ] Frontend running on port 5173
- [ ] Can send test ticket

---

**See QUICK_START.md for complete setup instructions!**
