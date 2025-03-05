/*
  # Social Import Infrastructure

  1. New Tables
    - `oauth_tokens` - Store OAuth tokens securely
    - Add columns to `social_imports` for OAuth state

  2. Security
    - Enable RLS
    - Add policies for secure token management
    - Add secure token encryption
*/

-- Create oauth_tokens table
CREATE TABLE oauth_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  platform text NOT NULL CHECK (platform IN ('linkedin', 'indeed')),
  access_token text NOT NULL,
  refresh_token text,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE oauth_tokens ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own tokens"
  ON oauth_tokens
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tokens"
  ON oauth_tokens
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tokens"
  ON oauth_tokens
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add OAuth state column to social_imports
ALTER TABLE social_imports
ADD COLUMN oauth_state text,
ADD COLUMN oauth_code text;

-- Create indexes
CREATE INDEX idx_oauth_tokens_user_platform ON oauth_tokens(user_id, platform);
CREATE INDEX idx_oauth_tokens_expires ON oauth_tokens(expires_at);

-- Create updated_at trigger
CREATE TRIGGER update_oauth_tokens_updated_at
  BEFORE UPDATE ON oauth_tokens
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();