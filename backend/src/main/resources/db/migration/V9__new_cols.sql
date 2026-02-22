ALTER TABLE meetings
    ADD COLUMN offer_amount NUMERIC(15,2),
ADD COLUMN last_meeting_date DATE,
ADD COLUMN loss_reason VARCHAR(30);