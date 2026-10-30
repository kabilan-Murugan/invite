-- Cloudflare D1 Wedding RSVP Database Schema
-- Run with: wrangler d1 execute wedding-db --file=./schema.sql

CREATE TABLE IF NOT EXISTS rsvps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  guests INTEGER NOT NULL DEFAULT 1,
  attending TEXT NOT NULL CHECK(attending IN ('yes', 'no')),
  events TEXT NOT NULL DEFAULT '',
  message TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_rsvps_created_at ON rsvps(created_at);

