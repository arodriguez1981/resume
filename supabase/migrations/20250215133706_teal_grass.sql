/*
  # Create user payments table

  1. New Tables
    - `user_payments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `amount` (integer)
      - `status` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `user_payments` table
    - Add policy for authenticated users to read their own payments
*/

CREATE TABLE IF NOT EXISTS user_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  amount integer NOT NULL,
  status text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own payments"
  ON user_payments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payments"
  ON user_payments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);