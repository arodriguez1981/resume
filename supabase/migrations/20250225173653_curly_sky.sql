-- Create stripe_customers table
CREATE TABLE IF NOT EXISTS stripe_customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL UNIQUE,
  stripe_customer_id text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_stripe_customers_user_id ON stripe_customers(user_id);
CREATE INDEX idx_stripe_customers_stripe_id ON stripe_customers(stripe_customer_id);

-- Create RLS policies
CREATE POLICY "Users can read own stripe customer"
  ON stripe_customers
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Add stripe-specific columns to user_payments
ALTER TABLE user_payments 
ADD COLUMN IF NOT EXISTS stripe_session_id text UNIQUE,
ADD COLUMN IF NOT EXISTS stripe_payment_intent text UNIQUE;

-- Create updated_at trigger
CREATE TRIGGER update_stripe_customers_updated_at
  BEFORE UPDATE ON stripe_customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();