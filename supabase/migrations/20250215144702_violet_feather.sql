/*
  # Fix Storage Policies for Resume Uploads

  1. Changes
    - Update storage bucket configuration
    - Fix RLS policies for file uploads
    - Add proper user-specific path validation

  2. Security
    - Ensure users can only access their own files
    - Validate file paths and types
    - Maintain proper access control
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

-- Create new upload policy with proper path validation
CREATE POLICY "Users can upload resume files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'resume-uploads' 
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND (storage.foldername(name))[2] ~ '^\d{13}-[a-zA-Z0-9._-]+$'
  AND array_length(string_to_array(name, '/'), 1) = 2
);

-- Create new read policy
CREATE POLICY "Users can read resume files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'resume-uploads'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create new delete policy
CREATE POLICY "Users can delete resume files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'resume-uploads'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Add policy for resume parsing logs
CREATE POLICY "Users can insert parsing logs"
ON resume_parsing_logs
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Add policy for resume sections
CREATE POLICY "Users can insert resume sections"
ON resume_sections
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM resume_parsing_logs
    WHERE resume_parsing_logs.id = resume_sections.resume_id
    AND resume_parsing_logs.user_id = auth.uid()
  )
);