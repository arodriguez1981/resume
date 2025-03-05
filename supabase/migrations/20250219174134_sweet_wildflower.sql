/*
  # Clean User Data

  1. Purpose
    - Safely remove all user data while preserving database structure
    - Clean up all user-related tables
    - Maintain referential integrity

  2. Tables Affected
    - user_payments
    - resume_drafts
    - resume_parsing_logs
    - resume_sections
    - resume_keywords
    - social_imports
    - oauth_tokens

  3. Safety Measures
    - Use transactions to ensure atomic operations
    - Preserve table structures and policies
    - Clean only data, not schema
*/

-- Start transaction
BEGIN;

  -- Clean tables in correct order (respecting foreign keys)
  DELETE FROM resume_sections;
  DELETE FROM resume_keywords;
  DELETE FROM resume_parsing_logs;
  DELETE FROM oauth_tokens;
  DELETE FROM social_imports;
  DELETE FROM user_payments;
  DELETE FROM resume_drafts;

  -- Clean storage objects (if any exist)
  DELETE FROM storage.objects 
  WHERE bucket_id = 'resume-uploads';

COMMIT;