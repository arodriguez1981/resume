/*
  # Fix payment system

  1. Changes
    - Add unique constraint to prevent duplicate active subscriptions
    - Add function to validate payment status transitions
    - Update RLS policies for better security

  2. Security
    - Enforce proper status transitions
    - Prevent duplicate active subscriptions
    - Ensure users can only modify their own payments
*/

-- Add unique constraint to prevent duplicate active subscriptions
DROP INDEX IF EXISTS unique_active_subscription;
CREATE UNIQUE INDEX unique_active_subscription 
ON user_payments (user_id, plan) 
WHERE status = 'completed';

-- Create function to validate payment status transitions
CREATE OR REPLACE FUNCTION validate_payment_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Only allow pending -> completed transition
  IF NEW.status = 'completed' AND TG_OP = 'UPDATE' THEN
    IF NOT EXISTS (
      SELECT 1 FROM user_payments 
      WHERE id = NEW.id 
      AND status = 'pending'
    ) THEN
      RAISE EXCEPTION 'Invalid payment status transition. Payment must be pending.';
    END IF;
  END IF;

  -- For new payments, only allow pending status
  IF TG_OP = 'INSERT' AND NEW.status != 'pending' THEN
    RAISE EXCEPTION 'New payments must have pending status.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for payment status validation
DROP TRIGGER IF EXISTS validate_payment_status_trigger ON user_payments;
CREATE TRIGGER validate_payment_status_trigger
  BEFORE INSERT OR UPDATE ON user_payments
  FOR EACH ROW
  EXECUTE FUNCTION validate_payment_status();

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own payments" ON user_payments;
DROP POLICY IF EXISTS "Users can insert own payments" ON user_payments;
DROP POLICY IF EXISTS "Users can update own pending payments" ON user_payments;

-- Create updated policies with better security
CREATE POLICY "Users can read own payments"
ON user_payments
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert pending payments"
ON user_payments
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id AND
  status = 'pending' AND
  amount > 0 AND
  plan IN ('premium', 'pro')
);

CREATE POLICY "Users can complete pending payments"
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