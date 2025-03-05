/*
  # Set up storage for resume uploads

  1. Storage Setup
    - Create a new storage bucket for resume uploads
    - Set appropriate security policies

  2. Security
    - Enable RLS for the storage bucket
    - Add policies for authenticated users to upload and read their own files
*/

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('resume-uploads', 'resume-uploads', false);

-- Set bucket configuration
UPDATE storage.buckets
SET file_size_limit = 10485760, -- 10MB
    allowed_mime_types = ARRAY[
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
WHERE id = 'resume-uploads';

-- Create policy to allow authenticated users to upload files
CREATE POLICY "Users can upload resume files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'resume-uploads' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create policy to allow authenticated users to read their own files
CREATE POLICY "Users can read own resume files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'resume-uploads' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create policy to allow authenticated users to delete their own files
CREATE POLICY "Users can delete own resume files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'resume-uploads' AND
  auth.uid()::text = (storage.foldername(name))[1]
);