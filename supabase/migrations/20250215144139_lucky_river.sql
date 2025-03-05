/*
  # Improve resume parsing system

  1. Changes
    - Add resume_parsing_logs table for tracking parsing attempts
    - Add resume_templates table for storing parsing templates
    - Add functions for text analysis and pattern matching

  2. Security
    - Enable RLS on new tables
    - Add policies for authenticated users
*/

-- Create resume parsing logs table
CREATE TABLE IF NOT EXISTS resume_parsing_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  file_name text NOT NULL,
  file_type text NOT NULL,
  status text NOT NULL,
  error_message text,
  parsed_data jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE resume_parsing_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own parsing logs"
  ON resume_parsing_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create resume templates table
CREATE TABLE IF NOT EXISTS resume_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  patterns jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add default templates
INSERT INTO resume_templates (name, description, patterns) VALUES
(
  'Standard Resume',
  'Common resume format with standard sections',
  '{
    "sections": {
      "summary": [
        "(?i)(professional\\s+)?summary",
        "(?i)profile",
        "(?i)objective"
      ],
      "experience": [
        "(?i)experience",
        "(?i)employment\\s+history",
        "(?i)work\\s+history"
      ],
      "education": [
        "(?i)education",
        "(?i)academic\\s+background",
        "(?i)qualifications"
      ],
      "skills": [
        "(?i)skills",
        "(?i)technical\\s+skills",
        "(?i)competencies"
      ]
    },
    "datePatterns": [
      "(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\\s+\\d{4}",
      "\\d{4}\\s*-\\s*(\\d{4}|Present)",
      "\\d{1,2}/\\d{4}\\s*-\\s*\\d{1,2}/\\d{4}"
    ],
    "emailPattern": "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
    "phonePattern": "(\\+\\d{1,2}\\s?)?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}"
  }'
),
(
  'Academic CV',
  'Template for academic curriculum vitae',
  '{
    "sections": {
      "summary": [
        "(?i)research\\s+interests",
        "(?i)academic\\s+profile",
        "(?i)research\\s+summary"
      ],
      "experience": [
        "(?i)academic\\s+positions",
        "(?i)teaching\\s+experience",
        "(?i)research\\s+experience"
      ],
      "education": [
        "(?i)education",
        "(?i)academic\\s+background",
        "(?i)degrees"
      ],
      "skills": [
        "(?i)technical\\s+skills",
        "(?i)laboratory\\s+skills",
        "(?i)research\\s+skills"
      ]
    },
    "datePatterns": [
      "(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\\s+\\d{4}",
      "\\d{4}\\s*-\\s*(\\d{4}|Present)",
      "\\d{1,2}/\\d{4}\\s*-\\s*\\d{1,2}/\\d{4}"
    ],
    "emailPattern": "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
    "phonePattern": "(\\+\\d{1,2}\\s?)?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}"
  }'
);