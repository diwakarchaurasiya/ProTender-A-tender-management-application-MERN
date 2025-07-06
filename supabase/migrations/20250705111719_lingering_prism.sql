/*
  # Initial Schema Setup for ProTender

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `hashed_password` (text)
      - `role` (text, default 'company')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `companies`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `name` (text)
      - `industry` (text)
      - `description` (text)
      - `logo_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `tenders`
      - `id` (uuid, primary key)
      - `company_id` (uuid, foreign key to companies)
      - `title` (text)
      - `description` (text)
      - `deadline` (date)
      - `budget` (decimal)
      - `status` (text, default 'active')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `applications`
      - `id` (uuid, primary key)
      - `tender_id` (uuid, foreign key to tenders)
      - `applicant_company_id` (uuid, foreign key to companies)
      - `proposal` (text)
      - `status` (text, default 'pending')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `goods_services`
      - `id` (uuid, primary key)
      - `company_id` (uuid, foreign key to companies)
      - `title` (text)
      - `description` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for public read access where appropriate
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  hashed_password text NOT NULL,
  role text DEFAULT 'company',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  industry text NOT NULL,
  description text DEFAULT '',
  logo_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tenders table
CREATE TABLE IF NOT EXISTS tenders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  deadline date NOT NULL,
  budget decimal(15,2) DEFAULT 0,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id uuid REFERENCES tenders(id) ON DELETE CASCADE,
  applicant_company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  proposal text NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create goods_services table
CREATE TABLE IF NOT EXISTS goods_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenders ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE goods_services ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Companies policies
CREATE POLICY "Companies are viewable by everyone"
  ON companies
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own company"
  ON companies
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own company"
  ON companies
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Tenders policies
CREATE POLICY "Tenders are viewable by everyone"
  ON tenders
  FOR SELECT
  USING (true);

CREATE POLICY "Company owners can insert tenders"
  ON tenders
  FOR INSERT
  TO authenticated
  WITH CHECK (
    company_id IN (SELECT id FROM companies WHERE user_id = auth.uid())
  );

CREATE POLICY "Company owners can update their own tenders"
  ON tenders
  FOR UPDATE
  TO authenticated
  USING (
    company_id IN (SELECT id FROM companies WHERE user_id = auth.uid())
  );

CREATE POLICY "Company owners can delete their own tenders"
  ON tenders
  FOR DELETE
  TO authenticated
  USING (
    company_id IN (SELECT id FROM companies WHERE user_id = auth.uid())
  );

-- Applications policies
CREATE POLICY "Applications viewable by relevant parties"
  ON applications
  FOR SELECT
  TO authenticated
  USING (
    applicant_company_id IN (SELECT id FROM companies WHERE user_id = auth.uid()) OR
    tender_id IN (SELECT id FROM tenders WHERE company_id IN (SELECT id FROM companies WHERE user_id = auth.uid()))
  );

CREATE POLICY "Companies can insert applications"
  ON applications
  FOR INSERT
  TO authenticated
  WITH CHECK (
    applicant_company_id IN (SELECT id FROM companies WHERE user_id = auth.uid())
  );

CREATE POLICY "Tender owners can update application status"
  ON applications
  FOR UPDATE
  TO authenticated
  USING (
    tender_id IN (SELECT id FROM tenders WHERE company_id IN (SELECT id FROM companies WHERE user_id = auth.uid()))
  );

-- Goods services policies
CREATE POLICY "Goods services are viewable by everyone"
  ON goods_services
  FOR SELECT
  USING (true);

CREATE POLICY "Company owners can manage their goods services"
  ON goods_services
  FOR ALL
  TO authenticated
  USING (
    company_id IN (SELECT id FROM companies WHERE user_id = auth.uid())
  )
  WITH CHECK (
    company_id IN (SELECT id FROM companies WHERE user_id = auth.uid())
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_companies_user_id ON companies(user_id);
CREATE INDEX IF NOT EXISTS idx_tenders_company_id ON tenders(company_id);
CREATE INDEX IF NOT EXISTS idx_tenders_status ON tenders(status);
CREATE INDEX IF NOT EXISTS idx_tenders_deadline ON tenders(deadline);
CREATE INDEX IF NOT EXISTS idx_applications_tender_id ON applications(tender_id);
CREATE INDEX IF NOT EXISTS idx_applications_company_id ON applications(applicant_company_id);
CREATE INDEX IF NOT EXISTS idx_goods_services_company_id ON goods_services(company_id);