-- Create payees table for Neon database
CREATE TABLE IF NOT EXISTS payees (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_payees_name ON payees(name);

