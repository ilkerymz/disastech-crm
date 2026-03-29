ALTER TABLE accounts ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
ALTER TABLE sales_process_notes
    ADD COLUMN IF NOT EXISTS is_negative_reason BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE contacts
    ADD COLUMN IF NOT EXISTS title VARCHAR(150);
ALTER TABLE sales_processes
    ADD COLUMN IF NOT EXISTS estimated_currency VARCHAR(10) NOT NULL DEFAULT 'TRY';

CREATE TABLE meeting_attendees (
                                   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                                   meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
                                   attendee_type VARCHAR(20) NOT NULL,
                                   user_id UUID REFERENCES users(id),
                                   contact_id UUID REFERENCES contacts(id),
                                   email VARCHAR(150) NOT NULL,
                                   display_name VARCHAR(150) NOT NULL,
                                   is_primary BOOLEAN NOT NULL DEFAULT FALSE,
                                   created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_meeting_attendees_meeting_id ON meeting_attendees(meeting_id);