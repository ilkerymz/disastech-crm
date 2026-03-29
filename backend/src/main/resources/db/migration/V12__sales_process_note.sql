ALTER TABLE sales_processes
    ADD CONSTRAINT uk_sales_process_account_id UNIQUE (account_id);

CREATE TABLE IF NOT EXISTS sales_process_notes (
                                                   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sales_process_id UUID NOT NULL,
    created_by_user_id UUID NOT NULL,
    note TEXT NOT NULL,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT fk_sales_process_note_process
    FOREIGN KEY (sales_process_id)
    REFERENCES sales_processes (id)
                         ON DELETE CASCADE,
    CONSTRAINT fk_sales_process_note_user
    FOREIGN KEY (created_by_user_id)
    REFERENCES users (id)
    );
