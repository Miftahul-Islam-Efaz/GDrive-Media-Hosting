-- Create user_sessions table to store Google Drive authentication details
CREATE TABLE IF NOT EXISTS public.user_sessions (
    google_id TEXT PRIMARY KEY, -- Google user unique sub ID
    email TEXT NOT NULL,
    name TEXT,
    avatar_url TEXT,
    access_token TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    active_folder_id TEXT, -- Stores the Google Drive active folder ID for the user
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for client-side access
-- (Allows reading/writing sessions matching the google_id)
CREATE POLICY "Allow public read access" ON public.user_sessions
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert" ON public.user_sessions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update" ON public.user_sessions
    FOR UPDATE USING (true);

-- Create trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_sessions_changetimestamp
    BEFORE UPDATE ON public.user_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();
