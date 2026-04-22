-- ══════════════════════════════════════════════════════════════════
-- Matchtool Actief Werkt - Database Setup
-- ══════════════════════════════════════════════════════════════════
-- Voer dit script uit in Supabase: SQL Editor > New Query > plak > Run
-- ══════════════════════════════════════════════════════════════════

-- Vacatures tabel
CREATE TABLE IF NOT EXISTS vacancies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reference_number TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  contract_type TEXT,
  hours INTEGER DEFAULT 40,
  salary_min TEXT,
  salary_max TEXT,
  category TEXT,
  description TEXT,
  responsibilities JSONB DEFAULT '[]'::jsonb,
  offer JSONB DEFAULT '[]'::jsonb,
  about_employer TEXT,
  requirements_intro TEXT,
  requirements JSONB DEFAULT '[]'::jsonb,
  published BOOLEAN DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_vacancies_slug ON vacancies(slug);
CREATE INDEX IF NOT EXISTS idx_vacancies_reference ON vacancies(reference_number);
CREATE INDEX IF NOT EXISTS idx_vacancies_published ON vacancies(published);

-- Sollicitaties tabel
CREATE TABLE IF NOT EXISTS applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  vacancy_id UUID REFERENCES vacancies(id) ON DELETE SET NULL,
  vacancy_title TEXT,
  vacancy_reference TEXT,
  vacancy_location TEXT,
  first_name TEXT NOT NULL,
  middle_name TEXT,
  last_name TEXT NOT NULL,
  country TEXT,
  postal_code TEXT,
  house_number TEXT,
  date_of_birth TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  motivation TEXT,
  cv_url TEXT,
  cv_filename TEXT
);

CREATE INDEX IF NOT EXISTS idx_applications_vacancy ON applications(vacancy_id);
CREATE INDEX IF NOT EXISTS idx_applications_created ON applications(created_at DESC);

-- Update trigger voor updated_at kolom
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_vacancies_updated_at ON vacancies;
CREATE TRIGGER update_vacancies_updated_at
  BEFORE UPDATE ON vacancies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Row Level Security: publieke vacatures zichtbaar voor iedereen,
-- mutaties alleen via service role key
ALTER TABLE vacancies ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Publieke lees-toegang op gepubliceerde vacatures
DROP POLICY IF EXISTS "Public can view published vacancies" ON vacancies;
CREATE POLICY "Public can view published vacancies"
  ON vacancies FOR SELECT
  USING (published = true);

-- Iedereen kan solliciteren
DROP POLICY IF EXISTS "Anyone can submit applications" ON applications;
CREATE POLICY "Anyone can submit applications"
  ON applications FOR INSERT
  WITH CHECK (true);

-- Storage bucket voor CV uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cvs',
  'cvs',
  false,
  5242880, -- 5 MB
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO NOTHING;

-- Iedereen mag CVs uploaden (nodig voor sollicitatieformulier)
DROP POLICY IF EXISTS "Anyone can upload CVs" ON storage.objects;
CREATE POLICY "Anyone can upload CVs"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'cvs');

-- Alleen service role kan CVs lezen (admin)
DROP POLICY IF EXISTS "Service role can read CVs" ON storage.objects;
CREATE POLICY "Service role can read CVs"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'cvs');
