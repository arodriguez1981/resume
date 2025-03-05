/*
  # Fix payment system and add plan column

  1. Changes
    - Add plan column to user_payments table
    - Add updated_at column
    - Add indexes for better performance
    - Update RLS policies
  
  2. Security
    - Enable RLS
    - Add policies for payment management
*/

-- Add plan column and updated_at
ALTER TABLE user_payments 
ADD COLUMN IF NOT EXISTS plan text NOT NULL CHECK (plan IN ('premium', 'pro')),
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_user_payments_user_id ON user_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_payments_status ON user_payments(status);
CREATE INDEX IF NOT EXISTS idx_user_payments_plan ON user_payments(plan);

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own payments" ON user_payments;
DROP POLICY IF EXISTS "Users can insert own payments" ON user_payments;

-- Create comprehensive policies
CREATE POLICY "Users can read own payments"
ON user_payments
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payments"
ON user_payments
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id AND
  status = 'pending'
);

CREATE POLICY "Users can update own pending payments"
ON user_payments
FOR UPDATE
TO authenticated
USING (
  auth.uid() = user_id AND
  status = 'pending'
)
WITH CHECK (
  auth.uid() = user_id AND
  status = 'completed'
);

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_user_payments_updated_at ON user_payments;
CREATE TRIGGER update_user_payments_updated_at
  BEFORE UPDATE ON user_payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();