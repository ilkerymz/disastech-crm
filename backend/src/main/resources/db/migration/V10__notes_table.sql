CREATE TABLE meeting_notes (
                               id UUID PRIMARY KEY,
                               meeting_id UUID NOT NULL REFERENCES meetings(id),
                               created_by_user_id UUID NOT NULL REFERENCES users(id),
                               note TEXT NOT NULL,
                               created_at TIMESTAMP NOT NULL,
                               deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_meeting_notes_meeting_created
    ON meeting_notes(meeting_id, created_at DESC);

CREATE INDEX idx_meeting_notes_meeting_not_deleted
    ON meeting_notes(meeting_id, deleted);
