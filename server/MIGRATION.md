# PostgreSQL to Firebase Migration Guide

This document describes the migration from PostgreSQL to Firebase Firestore.

## Migration Steps

### 1. Prerequisites

- Firebase project created (project ID: `f-e-p-4e3a7`)
- Firebase credentials file placed at `server/src/config/firebase-credentials.json`
- PostgreSQL database with existing data

### 2. Run the Migration Script

```bash
cd server
node migrate-to-firebase.js
```

This will:
- Migrate all performances from PostgreSQL to Firestore
- Migrate all attendees from PostgreSQL to Firestore
- Migrate all tickets from PostgreSQL to Firestore
- Map old PostgreSQL IDs to new Firebase document IDs

### 3. Create Required Firestore Indexes

After migration, create these composite indexes in the Firebase Console:
https://console.firebase.google.com/project/f-e-p-4e3a7/firestore/indexes

Required indexes:
1. **Collection: `attendees`**
   - Field: `email_lowercase` (ASC)

2. **Collection: `tickets`**
   - Fields: `performance_id` (ASC), `created_at` (DESC)

3. **Collection: `tickets`**
   - Fields: `attendee_id` (ASC), `created_at` (DESC)

4. **Collection: `tickets`**
   - Fields: `performance_id` (ASC), `attendee_id` (ASC)

Note: Firestore will prompt you to create these indexes when queries require them.

### 4. Update Environment Configuration

The application now uses Firebase instead of PostgreSQL. You can remove PostgreSQL-related environment variables:

```env
# No longer needed:
# DB_HOST
# DB_PORT
# DB_NAME
# DB_USER
# DB_PASSWORD
```

### 5. Test the Application

```bash
cd server
npm run dev
```

Test all endpoints to ensure Firebase integration works correctly.

## Data Model Changes

### PostgreSQL → Firestore Mapping

**Performances:**
- PostgreSQL: `id` (serial) → Firestore: auto-generated document ID
- All other fields remain the same
- Foreign key relationships replaced with document references

**Attendees:**
- PostgreSQL: `id` (serial) → Firestore: auto-generated document ID
- Added: `email_lowercase` field for case-insensitive queries
- All other fields remain the same

**Tickets:**
- PostgreSQL: `id` (UUID) → Firestore: auto-generated document ID
- `performance_id` and `attendee_id` now reference Firebase document IDs
- Foreign key constraints replaced with application-level validation
- All other fields remain the same

## Key Differences

### Transactions
- Firebase uses Firestore transactions instead of SQL transactions
- Implemented in `decrementAvailableTickets` and `markAsUsed` methods

### Joins
- Firestore doesn't support SQL-style joins
- Implemented using `Promise.all()` for parallel document fetches
- See `ticket.js` model for examples

### Queries
- Case-insensitive email queries use `email_lowercase` field
- Composite queries require Firestore indexes
- Some queries may be slower than PostgreSQL equivalents

## Rollback Plan

If you need to rollback to PostgreSQL:

1. Restore the old model files from git history
2. Update `server/src/server.js` to remove Firebase import
3. Restore PostgreSQL environment variables
4. Restart the server

## Performance Considerations

- Firestore queries may be slower for complex joins
- Consider implementing caching for frequently accessed data
- Monitor Firestore usage in Firebase Console
- Firestore pricing is based on reads, writes, and storage

## Security

- Firebase credentials file is excluded from git (`.gitignore`)
- Ensure Firestore security rules are configured properly
- Consider implementing rate limiting for API endpoints
