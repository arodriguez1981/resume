-- Add columns for subscription management
ALTER TABLE user_payments 
ADD COLUMN IF NOT EXISTS stripe_subscription_id text,
ADD COLUMN IF NOT EXISTS next_billing_date timestamptz,
ADD COLUMN IF NOT EXISTS cancellation_date timestamptz,
ADD COLUMN IF NOT EXISTS cancellation_reason text,
ADD COLUMN IF NOT EXISTS end_date timestamptz;

-- Create index for subscription ID
CREATE INDEX IF NOT EXISTS idx_user_payments_subscription_id ON user_payments(stripe_subscription_id);

-- Add new status for canceled subscriptions
ALTER TABLE user_payments 
DROP CONSTRAINT IF EXISTS user_payments_status_check;

ALTER TABLE user_payments 
ADD CONSTRAINT user_payments_status_check 
CHECK (status IN ('pending', 'completed', 'failed', 'canceled', 'canceled_at_period_end'));

-- Create function to handle subscription cancellation
CREATE OR REPLACE FUNCTION handle_subscription_cancellation()
RETURNS TRIGGER AS $$
BEGIN
  -- If status is changed to canceled_at_period_end, ensure end_date is set
  IF NEW.status = 'canceled_at_period_end' AND NEW.end_date IS NULL THEN
    RAISE EXCEPTION 'end_date must be set when canceling a subscription';
  END IF;
  
  -- If status is changed to canceled_at_period_end, ensure cancellation_date is set
  IF NEW.status = 'canceled_at_period_end' AND NEW.cancellation_date IS NULL THEN
    NEW.cancellation_date = now();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for subscription cancellation
DROP TRIGGER IF EXISTS subscription_cancellation_trigger ON user_payments;
CREATE TRIGGER subscription_cancellation_trigger
  BEFORE UPDATE ON user_payments
  FOR EACH ROW
  WHEN (NEW.status = 'canceled_at_period_end')
  EXECUTE FUNCTION handle_subscription_cancellation();