/*
  # Enhance resume parsing capabilities

  1. New Tables
    - `resume_sections` to store parsed sections
    - `resume_keywords` for better keyword extraction
    - `resume_parsing_rules` for custom parsing rules

  2. Changes
    - Add better section detection
    - Improve text extraction
    - Enhanced security measures

  3. Security
    - Enable RLS
    - Add appropriate policies
*/

-- Create resume sections table
CREATE TABLE IF NOT EXISTS resume_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id uuid REFERENCES resume_parsing_logs(id),
  section_type text NOT NULL,
  content text NOT NULL,
  confidence float NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create resume keywords table
CREATE TABLE IF NOT EXISTS resume_keywords (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id uuid REFERENCES resume_parsing_logs(id),
  keyword text NOT NULL,
  category text NOT NULL,
  relevance_score float NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create resume parsing rules table
CREATE TABLE IF NOT EXISTS resume_parsing_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_type text NOT NULL,
  pattern text NOT NULL,
  priority integer NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE resume_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_parsing_rules ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Users can read own resume sections"
  ON resume_sections
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM resume_parsing_logs
      WHERE resume_parsing_logs.id = resume_sections.resume_id
      AND resume_parsing_logs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can read own resume keywords"
  ON resume_keywords
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM resume_parsing_logs
      WHERE resume_parsing_logs.id = resume_keywords.resume_id
      AND resume_parsing_logs.user_id = auth.uid()
    )
  );

-- Add default parsing rules
INSERT INTO resume_parsing_rules (rule_type, pattern, priority) VALUES
  ('section_header', '(?i)(education|academic background|qualifications)', 100),
  ('section_header', '(?i)(experience|employment|work history)', 100),
  ('section_header', '(?i)(skills|technical skills|competencies)', 100),
  ('section_header', '(?i)(summary|profile|objective)', 100),
  ('date', '(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\\s+\\d{4}', 90),
  ('date', '\\d{4}\\s*-\\s*(\\d{4}|Present)', 90),
  ('email', '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', 80),
  ('phone', '(\\+\\d{1,2}\\s?)?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}', 80);