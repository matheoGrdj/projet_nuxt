-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Forums table
CREATE TABLE forums (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Topics table
CREATE TABLE topics (
    id SERIAL PRIMARY KEY,
    forum_id INTEGER NOT NULL REFERENCES forums(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_message_user_id UUID NOT NULL REFERENCES users(id)
);

-- Messages table
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    topic_id INTEGER NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_initial_message BOOLEAN NOT NULL DEFAULT false
);

-- Indexes for better performance
CREATE INDEX idx_topics_forum_id ON topics(forum_id);
CREATE INDEX idx_topics_last_message_at ON topics(last_message_at DESC);
CREATE INDEX idx_messages_topic_id ON messages(topic_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- Trigger to update the last_message information in topics
CREATE OR REPLACE FUNCTION update_topic_last_message() RETURNS TRIGGER AS $$
BEGIN
    UPDATE topics 
    SET last_message_at = NEW.created_at,
        last_message_user_id = NEW.user_id
    WHERE id = NEW.topic_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_topic_last_message
    AFTER INSERT ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_topic_last_message();

-- Insert default admin user (password: 'admin')
INSERT INTO users (id, username, password_hash, role) VALUES ('00000000-0000-0000-0000-000000000000', 'admin', 'admin', 'admin');