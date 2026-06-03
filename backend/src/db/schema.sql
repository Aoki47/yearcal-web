CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  day INTEGER,
  title TEXT NOT NULL,
  memo TEXT,
  color TEXT NOT NULL DEFAULT '#4CAF50',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_events_year ON events(year);
