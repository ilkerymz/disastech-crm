ALTER TABLE meetings
    ADD COLUMN subject VARCHAR(255),
ADD COLUMN outcome VARCHAR(50),
ADD COLUMN next_action VARCHAR(255),
ADD COLUMN next_action_date DATE;
