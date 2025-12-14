#!/bin/bash

# Theater App - Database Setup Script
# This script creates the database, user, and runs migrations

echo "🎭 Theater App - Database Setup"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if psql is installed
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ PostgreSQL (psql) is not installed or not in PATH${NC}"
    echo ""
    echo "Please install PostgreSQL first:"
    echo "  Option 1: Download from https://postgresapp.com/ (Easiest)"
    echo "  Option 2: Download from https://www.postgresql.org/download/macosx/"
    echo "  Option 3: brew install postgresql@15"
    echo ""
    exit 1
fi

echo -e "${GREEN}✓ PostgreSQL found${NC}"
echo ""

# Prompt for database password
echo -e "${YELLOW}Enter a password for the 'theater_admin' database user:${NC}"
read -s DB_PASSWORD
echo ""

# Create database and user
echo "Creating database and user..."
echo ""

psql postgres << EOF
-- Create database
CREATE DATABASE theater_db;

-- Create user with password
CREATE USER theater_admin WITH PASSWORD '$DB_PASSWORD';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE theater_db TO theater_admin;

-- Exit
\q
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Database and user created${NC}"
else
    echo -e "${RED}❌ Failed to create database. You may need to run this with postgres superuser privileges.${NC}"
    echo "Try: sudo -u postgres psql postgres"
    exit 1
fi

# Connect to database and grant schema privileges (for PostgreSQL 15+)
echo ""
echo "Granting schema privileges..."
psql -U theater_admin -d theater_db << EOF
GRANT ALL ON SCHEMA public TO theater_admin;
\q
EOF

# Run migrations
echo ""
echo "Running database migrations..."
echo ""

echo "→ Creating performances table..."
psql -U theater_admin -d theater_db -f migrations/001_create_performances.sql

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Performances table created${NC}"
else
    echo -e "${RED}❌ Failed to create performances table${NC}"
    exit 1
fi

echo ""
echo "→ Creating attendees table..."
psql -U theater_admin -d theater_db -f migrations/002_create_attendees.sql

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Attendees table created${NC}"
else
    echo -e "${RED}❌ Failed to create attendees table${NC}"
    exit 1
fi

echo ""
echo "→ Creating tickets table..."
psql -U theater_admin -d theater_db -f migrations/003_create_tickets.sql

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Tickets table created${NC}"
else
    echo -e "${RED}❌ Failed to create tickets table${NC}"
    exit 1
fi

# Verify setup
echo ""
echo "Verifying database setup..."
TABLES=$(psql -U theater_admin -d theater_db -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE';")

if [ "$TABLES" -ge 3 ]; then
    echo -e "${GREEN}✓ All tables created successfully${NC}"

    # Show sample data
    echo ""
    echo "Sample performances data:"
    psql -U theater_admin -d theater_db -c "SELECT id, name, status, start_date, satnica, total_tickets, available_tickets FROM performances;"
else
    echo -e "${RED}❌ Some tables are missing${NC}"
    exit 1
fi

# Update .env file
echo ""
echo "Updating .env file..."

if [ -f .env ]; then
    # Update DB_PASSWORD in .env
    sed -i.bak "s/DB_PASSWORD=.*/DB_PASSWORD=$DB_PASSWORD/" .env
    echo -e "${GREEN}✓ .env file updated${NC}"
else
    echo -e "${YELLOW}⚠ .env file not found. Please update DB_PASSWORD manually.${NC}"
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Database setup complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Database details:"
echo "  Host: localhost"
echo "  Port: 5432"
echo "  Database: theater_db"
echo "  User: theater_admin"
echo "  Password: $DB_PASSWORD"
echo ""
echo "Next steps:"
echo "  1. Configure email in server/.env (see SETUP_GUIDE.md)"
echo "  2. Run: npm run dev (to start backend server)"
echo ""
