-- V4__add_meeting_mail_columns.sql

ALTER TABLE meetings
    ADD COLUMN mail_status VARCHAR(30) NOT NULL DEFAULT 'NOT_SENT';

ALTER TABLE meetings
    ADD COLUMN mail_sent_at TIMESTAMP;

ALTER TABLE meetings
    ADD COLUMN mail_sent_by_user_id UUID;
