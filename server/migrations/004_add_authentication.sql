-- Add password field to attendees table for authentication
ALTER TABLE attendees
ADD COLUMN password_hash VARCHAR(255),
ADD COLUMN role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'staff', 'admin'));

-- Add index for faster role-based queries
CREATE INDEX idx_attendees_role ON attendees(role);

-- Update existing attendees to have default role
UPDATE attendees SET role = 'user' WHERE role IS NULL;
