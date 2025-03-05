/*
  # Create resume drafts table

  1. New Tables
    - `resume_drafts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `data` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `resume_drafts` table
    - Add policies for authenticated users to manage their drafts
*/

CREATE TABLE IF NOT EXISTS resume_drafts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  data jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE resume_drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own drafts"
  ON resume_drafts
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);