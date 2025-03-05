/*
  # Fix storage policies for resume uploads

  1. Changes
    - Update storage bucket configuration
    - Fix RLS policies for resume uploads
    - Add user-specific folder structure

  2. Security
    - Ensure proper access control
    - Restrict file types and sizes
    - Enable user isolation
*/

-- Update storage bucket configuration
UPDATE storage.buckets
SET public = true,
    file_size_limit = 10485760, -- 10MB
    allowed_mime_types = ARRAY[
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
WHERE id = 'resume-uploads';

-- Drop existing policies
DROP POLICY IF EXISTS "Users can upload resume files" ON storage.objects;
DROP POLICY IF EXISTS "Users can read resume files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete resume files" ON storage.objects;

-- Create new policies with user-specific paths
CREATE POLICY "Users can upload resume files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'resume-uploads' AND
  (storage.foldername(name))[1] = auth.uid()::text AND
  (storage.foldername(name))[2] ~ '^\d{13}-[a-zA-Z0-9._-]+$'
);

CREATE POLICY "Users can read resume files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'resume-uploads' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete resume files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'resume-uploads' AND
  (storage.foldername(name))[1] = auth.uid()::text
);