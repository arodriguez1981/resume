/*
  # Fix resume drafts table

  1. Changes
    - Add unique constraint on user_id
    - Add proper indexes
    - Update RLS policies
    - Add updated_at trigger

  2. Security
    - Enable RLS
    - Add policies for user access
*/

-- Drop existing table if it exists
DROP TABLE IF EXISTS resume_drafts;

-- Create resume drafts table with proper constraints
CREATE TABLE resume_drafts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL UNIQUE,
  data jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE resume_drafts ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_resume_drafts_user_id ON resume_drafts(user_id);
CREATE INDEX idx_resume_drafts_updated_at ON resume_drafts(updated_at);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_resume_drafts_updated_at ON resume_drafts;
CREATE TRIGGER update_resume_drafts_updated_at
  BEFORE UPDATE ON resume_drafts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies
DROP POLICY IF EXISTS "Users can manage own drafts" ON resume_drafts;

CREATE POLICY "Users can read own drafts"
  ON resume_drafts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own drafts"
  ON resume_drafts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own drafts"
  ON resume_drafts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);