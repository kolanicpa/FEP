CREATE TABLE performances (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Aktivna',
  start_date DATE NOT NULL,
  satnica TIME NOT NULL,
  category VARCHAR(100),
  total_tickets INTEGER NOT NULL DEFAULT 0,
  available_tickets INTEGER NOT NULL DEFAULT 0,
  qr_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT status_check CHECK (status IN ('Aktivna', 'Pauzirana'))
);

CREATE INDEX idx_performances_status ON performances(status);
CREATE INDEX idx_performances_start_date ON performances(start_date);

-- Seed initial data from frontend
INSERT INTO performances (id, name, status, start_date, satnica, category, total_tickets, available_tickets)
VALUES
  (1, 'Hamlet', 'Aktivna', '2024-03-12', '19:30', 'Tragedija', 320, 320),
  (2, 'The Cherry Orchard', 'Pauzirana', '2024-05-08', '20:00', 'Drama', 280, 280),
  (3, 'Waiting for Godot', 'Aktivna', '2024-06-20', '18:30', 'Drama', 140, 140),
  (4, 'A Streetcar Named Desire', 'Pauzirana', '2024-07-02', '21:00', 'Klasik', 200, 200);

SELECT setval('performances_id_seq', (SELECT MAX(id) FROM performances));
