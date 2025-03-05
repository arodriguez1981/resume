/*
  # Fix RLS policies for resume uploads

  1. Changes
    - Add missing RLS policies for resume_drafts table
    - Update storage bucket policies for resume uploads
    - Add function to handle file path validation

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Ensure proper file path validation
*/

-- Create a function to validate file paths
CREATE OR REPLACE FUNCTION storage.is_valid_path(path text)
RETURNS boolean AS $$
BEGIN
  -- Check if path follows the pattern: timestamp-filename
  RETURN path ~ '^\d{13}-[a-zA-Z0-9_-]+\.[a-zA-Z0-9]+$';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update storage bucket policies
DROP POLICY IF EXISTS "Users can upload resume files" ON storage.objects;
DROP POLICY IF EXISTS "Users can read own resume files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own resume files" ON storage.objects;

CREATE POLICY "Users can upload resume files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'resume-uploads' AND
  storage.is_valid_path(name)
);

CREATE POLICY "Users can read resume files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'resume-uploads' AND
  storage.is_valid_path(name)
);

CREATE POLICY "Users can delete resume files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'resume-uploads' AND
  storage.is_valid_path(name)
);

-- Ensure resume_drafts table has proper RLS
ALTER TABLE resume_drafts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own drafts" ON resume_drafts;

CREATE POLICY "Users can manage own drafts"
ON resume_drafts
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Update storage bucket configuration
UPDATE storage.buckets
SET public = true
WHERE id = 'resume-uploads';