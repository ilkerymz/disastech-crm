ALTER TABLE meetings DROP COLUMN IF EXISTS sales_status;
ALTER TABLE meetings DROP COLUMN IF EXISTS sales_stage;
ALTER TABLE meetings DROP COLUMN IF EXISTS offer_amount;
ALTER TABLE meetings DROP COLUMN IF EXISTS last_meeting_date;
ALTER TABLE meetings DROP COLUMN IF EXISTS loss_reason;
ALTER TABLE meetings DROP COLUMN IF EXISTS next_action;
DROP TABLE IF EXISTS meeting_notes;
