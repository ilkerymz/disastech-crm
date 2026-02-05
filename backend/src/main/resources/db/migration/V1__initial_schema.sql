CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
                       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                       full_name VARCHAR(150) NOT NULL,
                       email VARCHAR(150) UNIQUE NOT NULL,
                       role VARCHAR(50) NOT NULL,
                       active BOOLEAN DEFAULT TRUE,
                       created_at TIMESTAMP DEFAULT NOW(),
                       updated_at TIMESTAMP
);

CREATE TABLE accounts (
                          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                          name VARCHAR(200) UNIQUE NOT NULL,
                          industry VARCHAR(100),
                          active BOOLEAN DEFAULT TRUE,
                          created_at TIMESTAMP DEFAULT NOW(),
                          updated_at TIMESTAMP
);

CREATE TABLE contacts (
                          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                          account_id UUID NOT NULL REFERENCES accounts(id),
                          full_name VARCHAR(150) NOT NULL,
                          email VARCHAR(150) NOT NULL,
                          created_at TIMESTAMP DEFAULT NOW(),
                          updated_at TIMESTAMP,
                          UNIQUE(account_id, email)
);

CREATE TABLE meetings (
                          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                          account_id UUID NOT NULL REFERENCES accounts(id),
                          contact_id UUID REFERENCES contacts(id),
                          owner_user_id UUID NOT NULL REFERENCES users(id),
                          meeting_start TIMESTAMP NOT NULL,
                          meeting_end TIMESTAMP NOT NULL,
                          status VARCHAR(50) NOT NULL,
                          notes TEXT,
                          google_event_id VARCHAR(200) UNIQUE,
                          google_calendar_id VARCHAR(200),
                          deleted BOOLEAN DEFAULT FALSE,
                          created_at TIMESTAMP DEFAULT NOW(),
                          updated_at TIMESTAMP
);

CREATE TABLE google_oauth_tokens (
                                     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                                     user_id UUID NOT NULL REFERENCES users(id),
                                     access_token TEXT NOT NULL,
                                     refresh_token TEXT NOT NULL,
                                     expiry_time TIMESTAMP NOT NULL,
                                     created_at TIMESTAMP DEFAULT NOW(),
                                     updated_at TIMESTAMP
);
