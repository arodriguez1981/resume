/*
  # Add social imports table and functions

  1. New Tables
    - `social_imports`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `platform` (text, either 'linkedin' or 'indeed')
      - `status` (text)
      - `error_message` (text, nullable)
      - `processed_data` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `social_imports` table
    - Add policies for authenticated users
*/

-- Create social_imports table
CREATE TABLE social_imports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  platform text NOT NULL CHECK (platform IN ('linkedin', 'indeed')),
  status text NOT NULL CHECK (status IN ('pending', 'success', 'error')),
  error_message text,
  processed_data jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_social_imports_user_id ON social_imports(user_id);
CREATE INDEX idx_social_imports_platform ON social_imports(platform);
CREATE INDEX idx_social_imports_status ON social_imports(status);

-- Enable RLS
ALTER TABLE social_imports ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can read own social imports"
  ON social_imports
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own social imports"
  ON social_imports
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER update_social_imports_updated_at
  BEFORE UPDATE ON social_imports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();