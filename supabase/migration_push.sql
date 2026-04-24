CREATE TABLE IF NOT EXISTS admin_push_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id TEXT NOT NULL,
    subscription JSONB NOT NULL,
    endpoint TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE admin_push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin only push access" ON admin_push_subscriptions
    USING (true)
    WITH CHECK (true);
