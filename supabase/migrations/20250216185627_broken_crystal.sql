/*
  # Fix Social Imports RLS Policies

  1. Changes
    - Drop existing policies
    - Create new policies with proper user_id handling
    - Add policy for updating own imports
    - Add policy for deleting own imports

  2. Security
    - Ensure users can only access their own data
    - Add proper user_id checks for all operations
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own social imports" ON social_imports;
DROP POLICY IF EXISTS "Users can insert own social imports" ON social_imports;

-- Create comprehensive policies
CREATE POLICY "Users can read own social imports"
  ON social_imports
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own social imports"
  ON social_imports
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    status = 'pending'
  );

CREATE POLICY "Users can update own social imports"
  ON social_imports
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own social imports"
  ON social_imports
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add trigger to ensure user_id cannot be changed
CREATE OR REPLACE FUNCTION prevent_user_id_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.user_id != NEW.user_id THEN
    RAISE EXCEPTION 'user_id cannot be changed';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_user_id_change
  BEFORE UPDATE ON social_imports
  FOR EACH ROW
  EXECUTE FUNCTION prevent_user_id_change();