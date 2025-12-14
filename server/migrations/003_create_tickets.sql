CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  performance_id INTEGER NOT NULL,
  attendee_id INTEGER NOT NULL,
  qr_code_data TEXT NOT NULL,
  qr_code_image TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'valid',
  sent_at TIMESTAMP WITH TIME ZONE,
  scanned_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_performance
    FOREIGN KEY(performance_id)
    REFERENCES performances(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_attendee
    FOREIGN KEY(attendee_id)
    REFERENCES attendees(id)
    ON DELETE CASCADE,

  CONSTRAINT status_check CHECK (status IN ('valid', 'used', 'cancelled')),
  CONSTRAINT unique_attendee_performance UNIQUE(performance_id, attendee_id)
);

CREATE INDEX idx_tickets_performance ON tickets(performance_id);
CREATE INDEX idx_tickets_attendee ON tickets(attendee_id);
CREATE INDEX idx_tickets_status ON tickets(status);
