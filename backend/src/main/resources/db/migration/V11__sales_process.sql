-- V11__sales_process.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS sales_processes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL,
    sales_stage VARCHAR(50),
    sales_status VARCHAR(50),
    estimated_amount NUMERIC(18,2),
    last_meeting_date DATE,
    next_action VARCHAR(255),
    next_action_date DATE,
    current_note TEXT,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT fk_sales_process_account
      FOREIGN KEY (account_id)
      REFERENCES accounts (id)
      ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sales_process_account_id
  ON sales_processes (account_id);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS sales_process_update_updated_at ON sales_processes;
CREATE TRIGGER sales_process_update_updated_at
BEFORE UPDATE ON sales_processes
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
