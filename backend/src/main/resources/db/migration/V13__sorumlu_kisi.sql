ALTER TABLE accounts
    ADD COLUMN IF NOT EXISTS responsible_user_id UUID;

ALTER TABLE accounts
DROP CONSTRAINT IF EXISTS fk_accounts_responsible_user;

ALTER TABLE accounts
    ADD CONSTRAINT fk_accounts_responsible_user
        FOREIGN KEY (responsible_user_id)
            REFERENCES users (id);
