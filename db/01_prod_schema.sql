-- =====================================================================================
-- AgriSync — Core Schema (PRODUCTION SAFE)
-- Target: PostgreSQL 15 (Supabase)
-- =====================================================================================
-- WARNING: This script does NOT drop tables. It uses IF NOT EXISTS for tables
-- and OR REPLACE for functions/policies. It is safe to run in production.
-- =====================================================================================

-- ---------------------------------------------------------------------------
-- 1. Tables (Safe creation)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS companies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    workspace_code TEXT UNIQUE NOT NULL DEFAULT UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6)),
    subscription_tier TEXT DEFAULT 'FREE' CONSTRAINT chk_companies_tier CHECK (subscription_tier IN ('FREE', 'PRO', 'ENTERPRISE')),
    max_workers INT DEFAULT 5 CONSTRAINT chk_companies_workers CHECK (max_workers > 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS employees (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    auth_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL CONSTRAINT chk_employees_email_len CHECK (char_length(email) <= 255),
    role TEXT CONSTRAINT chk_employees_role CHECK (role IN ('SUPERVISOR', 'WORKER')),
    full_name TEXT CONSTRAINT chk_employees_name_len CHECK (char_length(full_name) <= 100),
    phone TEXT CONSTRAINT chk_employees_phone_len CHECK (char_length(phone) <= 20),
    bio TEXT CONSTRAINT chk_employees_bio_len CHECK (char_length(bio) <= 150),
    avatar_url TEXT CONSTRAINT chk_employees_avatar_len CHECK (char_length(avatar_url) <= 1000),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_employees_auth_id ON employees(auth_id);
CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email);

CREATE TABLE IF NOT EXISTS zones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL CONSTRAINT chk_zones_name_len CHECK (char_length(name) <= 100),
    hectares NUMERIC CONSTRAINT chk_zones_hectares CHECK (hectares >= 0),
    crop_type TEXT CONSTRAINT chk_zones_crop_len CHECK (char_length(crop_type) <= 100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS report_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL CONSTRAINT chk_categories_name_len CHECK (char_length(name) <= 100),
    severity_level TEXT DEFAULT 'LOW' CONSTRAINT chk_categories_severity CHECK (severity_level IN ('LOW', 'MEDIUM', 'CRITICAL')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS field_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    zone_id UUID REFERENCES zones(id) ON DELETE SET NULL,
    category_id UUID REFERENCES report_categories(id) ON DELETE SET NULL,
    image_url TEXT NOT NULL CONSTRAINT chk_reports_img_len CHECK (char_length(image_url) <= 1000),
    latitude NUMERIC NOT NULL CONSTRAINT chk_reports_lat CHECK (latitude >= -90 AND latitude <= 90),
    longitude NUMERIC NOT NULL CONSTRAINT chk_reports_lng CHECK (longitude >= -180 AND longitude <= 180),
    status TEXT DEFAULT 'PENDING' CONSTRAINT chk_reports_status CHECK (status IN ('PENDING', 'INVESTIGATING', 'RESOLVED')),
    notes TEXT CONSTRAINT chk_reports_notes_len CHECK (char_length(notes) <= 1000),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    synced_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_field_reports_company_id ON field_reports(company_id);
CREATE INDEX IF NOT EXISTS idx_field_reports_status ON field_reports(status);

CREATE TABLE IF NOT EXISTS report_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    report_id UUID REFERENCES field_reports(id) ON DELETE CASCADE,
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    content TEXT NOT NULL CONSTRAINT chk_comments_content_len CHECK (char_length(content) <= 1000),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS access_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    email TEXT NOT NULL CONSTRAINT chk_requests_email_len CHECK (char_length(email) <= 255),
    full_name TEXT CONSTRAINT chk_requests_name_len CHECK (char_length(full_name) <= 100),
    phone TEXT NOT NULL CONSTRAINT chk_requests_phone_len CHECK (char_length(phone) <= 20),
    status TEXT DEFAULT 'PENDING' CONSTRAINT chk_requests_status CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- If constraint exists it won't fail here, we use a separate block if we need to add it safely,
-- but a simple ALTER TABLE ADD CONSTRAINT IF NOT EXISTS is only available for some objects.
-- Safe workaround for constraint:
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'uq_requests_email_per_company') THEN
        ALTER TABLE access_requests ADD CONSTRAINT uq_requests_email_per_company UNIQUE (email, company_id);
    END IF;
END $$;

-- ---------------------------------------------------------------------------
-- 2. Session context helpers (SECURITY DEFINER)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_my_company_id() RETURNS UUID
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
    SELECT company_id FROM employees WHERE auth_id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION get_my_employee_id() RETURNS UUID
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
    SELECT id FROM employees WHERE auth_id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION get_my_role() RETURNS TEXT
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
    SELECT role FROM employees WHERE auth_id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION is_supervisor() RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
    SELECT EXISTS(SELECT 1 FROM employees WHERE auth_id = auth.uid() AND role = 'SUPERVISOR');
$$;

CREATE OR REPLACE FUNCTION has_no_company() RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
    SELECT NOT EXISTS(SELECT 1 FROM employees WHERE auth_id = auth.uid());
$$;

-- ---------------------------------------------------------------------------
-- 3. Triggers & Functions
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION trigger_set_updated_at() RETURNS TRIGGER
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_companies_updated_at ON companies;
CREATE TRIGGER set_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

DROP TRIGGER IF EXISTS set_employees_updated_at ON employees;
CREATE TRIGGER set_employees_updated_at BEFORE UPDATE ON employees FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

DROP TRIGGER IF EXISTS set_reports_updated_at ON field_reports;
CREATE TRIGGER set_reports_updated_at BEFORE UPDATE ON field_reports FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE OR REPLACE FUNCTION protect_created_at() RETURNS TRIGGER
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
    NEW.synced_at := NOW();
    IF NEW.created_at IS NULL THEN
        NEW.created_at := NOW();
    ELSIF NEW.created_at > NOW() + INTERVAL '1 minute' THEN
        NEW.created_at := NOW();
    ELSIF NEW.created_at < NOW() - INTERVAL '30 days' THEN
        NEW.created_at := NOW() - INTERVAL '30 days';
    END IF;
    RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS protect_created_at_field_reports ON field_reports;
CREATE TRIGGER protect_created_at_field_reports BEFORE INSERT ON field_reports FOR EACH ROW EXECUTE FUNCTION protect_created_at();

CREATE OR REPLACE FUNCTION enforce_worker_limit() RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
    current_count INT;
    max_allowed INT;
BEGIN
    IF NEW.company_id IS NULL THEN RETURN NEW; END IF;
    SELECT max_workers INTO max_allowed FROM companies WHERE id = NEW.company_id FOR UPDATE;
    SELECT count(*) INTO current_count FROM employees WHERE company_id = NEW.company_id;
    IF max_allowed IS NOT NULL AND current_count >= max_allowed THEN
        RAISE EXCEPTION 'Worker limit reached (%/%)', current_count, max_allowed;
    END IF;
    RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS enforce_worker_limit_trigger ON employees;
CREATE TRIGGER enforce_worker_limit_trigger BEFORE INSERT ON employees FOR EACH ROW EXECUTE FUNCTION enforce_worker_limit();

CREATE OR REPLACE FUNCTION prevent_employee_escalation() RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
    IF (NEW.role IS DISTINCT FROM OLD.role OR NEW.company_id IS DISTINCT FROM OLD.company_id) THEN
        IF NOT (SELECT role = 'SUPERVISOR' FROM employees WHERE auth_id = auth.uid()) THEN
            RAISE EXCEPTION 'Unauthorized: Only supervisors can escalate roles or reassign companies';
        END IF;
    END IF;
    RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS check_employee_escalation ON employees;
CREATE TRIGGER check_employee_escalation BEFORE UPDATE ON employees FOR EACH ROW EXECUTE FUNCTION prevent_employee_escalation();

-- ---------------------------------------------------------------------------
-- 4. Row level security
-- ---------------------------------------------------------------------------
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE field_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "employees_select_own_company" ON companies;
CREATE POLICY "employees_select_own_company" ON companies FOR SELECT TO authenticated USING (id = get_my_company_id());
DROP POLICY IF EXISTS "new_users_can_create_company" ON companies;
CREATE POLICY "new_users_can_create_company" ON companies FOR INSERT TO authenticated WITH CHECK (has_no_company());

DROP POLICY IF EXISTS "employees_select_same_company" ON employees;
CREATE POLICY "employees_select_same_company" ON employees FOR SELECT TO authenticated USING (company_id = get_my_company_id());
DROP POLICY IF EXISTS "employees_find_unclaimed_by_email" ON employees;
CREATE POLICY "employees_find_unclaimed_by_email" ON employees FOR SELECT TO authenticated USING (lower(email) = lower(auth.jwt()->>'email') AND auth_id IS NULL);
DROP POLICY IF EXISTS "supervisors_or_onboarding_insert" ON employees;
CREATE POLICY "supervisors_or_onboarding_insert" ON employees FOR INSERT TO authenticated WITH CHECK ((is_supervisor() AND company_id = get_my_company_id()) OR (has_no_company() AND auth_id = auth.uid()));
DROP POLICY IF EXISTS "employees_update_own_profile" ON employees;
CREATE POLICY "employees_update_own_profile" ON employees FOR UPDATE TO authenticated USING (auth_id = auth.uid()) WITH CHECK (auth_id = auth.uid());
DROP POLICY IF EXISTS "employees_claim_unclaimed_record" ON employees;
CREATE POLICY "employees_claim_unclaimed_record" ON employees FOR UPDATE TO authenticated USING (lower(email) = lower(auth.jwt()->>'email') AND auth_id IS NULL) WITH CHECK (auth_id = auth.uid());
DROP POLICY IF EXISTS "supervisors_update_employees" ON employees;
CREATE POLICY "supervisors_update_employees" ON employees FOR UPDATE TO authenticated USING (is_supervisor() AND company_id = get_my_company_id()) WITH CHECK (company_id = get_my_company_id());
DROP POLICY IF EXISTS "supervisors_delete_employees" ON employees;
CREATE POLICY "supervisors_delete_employees" ON employees FOR DELETE TO authenticated USING (is_supervisor() AND company_id = get_my_company_id());

DROP POLICY IF EXISTS "employees_select_zones" ON zones;
CREATE POLICY "employees_select_zones" ON zones FOR SELECT TO authenticated USING (company_id = get_my_company_id());
DROP POLICY IF EXISTS "supervisors_insert_zones" ON zones;
CREATE POLICY "supervisors_insert_zones" ON zones FOR INSERT TO authenticated WITH CHECK (is_supervisor() AND company_id = get_my_company_id());
DROP POLICY IF EXISTS "supervisors_update_zones" ON zones;
CREATE POLICY "supervisors_update_zones" ON zones FOR UPDATE TO authenticated USING (is_supervisor() AND company_id = get_my_company_id()) WITH CHECK (company_id = get_my_company_id());
DROP POLICY IF EXISTS "supervisors_delete_zones" ON zones;
CREATE POLICY "supervisors_delete_zones" ON zones FOR DELETE TO authenticated USING (is_supervisor() AND company_id = get_my_company_id());

DROP POLICY IF EXISTS "employees_select_categories" ON report_categories;
CREATE POLICY "employees_select_categories" ON report_categories FOR SELECT TO authenticated USING (company_id = get_my_company_id());
DROP POLICY IF EXISTS "supervisors_insert_categories" ON report_categories;
CREATE POLICY "supervisors_insert_categories" ON report_categories FOR INSERT TO authenticated WITH CHECK (is_supervisor() AND company_id = get_my_company_id());
DROP POLICY IF EXISTS "supervisors_update_categories" ON report_categories;
CREATE POLICY "supervisors_update_categories" ON report_categories FOR UPDATE TO authenticated USING (is_supervisor() AND company_id = get_my_company_id()) WITH CHECK (company_id = get_my_company_id());
DROP POLICY IF EXISTS "supervisors_delete_categories" ON report_categories;
CREATE POLICY "supervisors_delete_categories" ON report_categories FOR DELETE TO authenticated USING (is_supervisor() AND company_id = get_my_company_id());

DROP POLICY IF EXISTS "employees_select_reports" ON field_reports;
CREATE POLICY "employees_select_reports" ON field_reports FOR SELECT TO authenticated USING (company_id = get_my_company_id());
DROP POLICY IF EXISTS "employees_insert_own_reports" ON field_reports;
CREATE POLICY "employees_insert_own_reports" ON field_reports FOR INSERT TO authenticated WITH CHECK (company_id = get_my_company_id() AND employee_id = get_my_employee_id());
DROP POLICY IF EXISTS "supervisors_update_reports" ON field_reports;
CREATE POLICY "supervisors_update_reports" ON field_reports FOR UPDATE TO authenticated USING (is_supervisor() AND company_id = get_my_company_id()) WITH CHECK (company_id = get_my_company_id());
DROP POLICY IF EXISTS "supervisors_delete_reports" ON field_reports;
CREATE POLICY "supervisors_delete_reports" ON field_reports FOR DELETE TO authenticated USING (is_supervisor() AND company_id = get_my_company_id());

DROP POLICY IF EXISTS "employees_select_comments" ON report_comments;
CREATE POLICY "employees_select_comments" ON report_comments FOR SELECT TO authenticated USING (report_id IN (SELECT id FROM field_reports WHERE company_id = get_my_company_id()));
DROP POLICY IF EXISTS "employees_insert_own_comments" ON report_comments;
CREATE POLICY "employees_insert_own_comments" ON report_comments FOR INSERT TO authenticated WITH CHECK (employee_id = get_my_employee_id() AND report_id IN (SELECT id FROM field_reports WHERE company_id = get_my_company_id()));
DROP POLICY IF EXISTS "employees_delete_own_comments" ON report_comments;
CREATE POLICY "employees_delete_own_comments" ON report_comments FOR DELETE TO authenticated USING (employee_id = get_my_employee_id());

DROP POLICY IF EXISTS "authenticated_users_can_request_access" ON access_requests;
CREATE POLICY "authenticated_users_can_request_access" ON access_requests FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "supervisors_select_requests" ON access_requests;
CREATE POLICY "supervisors_select_requests" ON access_requests FOR SELECT TO authenticated USING (is_supervisor() AND company_id = get_my_company_id());
DROP POLICY IF EXISTS "supervisors_update_requests" ON access_requests;
CREATE POLICY "supervisors_update_requests" ON access_requests FOR UPDATE TO authenticated USING (is_supervisor() AND company_id = get_my_company_id()) WITH CHECK (company_id = get_my_company_id());

-- ---------------------------------------------------------------------------
-- 5. RPCs
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION register_company_and_profile(
    p_company_name TEXT,
    p_full_name TEXT,
    p_phone TEXT,
    p_email TEXT
) RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
    v_company_id UUID;
    v_auth_id UUID;
BEGIN
    v_auth_id := auth.uid();
    IF v_auth_id IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
    IF EXISTS (SELECT 1 FROM employees WHERE auth_id = v_auth_id) THEN RAISE EXCEPTION 'User already registered'; END IF;

    INSERT INTO companies (name) VALUES (p_company_name) RETURNING id INTO v_company_id;

    INSERT INTO employees (auth_id, company_id, email, role, full_name, phone)
    VALUES (v_auth_id, v_company_id, p_email, 'SUPERVISOR', p_full_name, p_phone);

    INSERT INTO report_categories (company_id, name, severity_level) VALUES
    (v_company_id, 'Hama & Penyakit', 'CRITICAL'),
    (v_company_id, 'Pertumbuhan', 'LOW'),
    (v_company_id, 'Panen', 'LOW'),
    (v_company_id, 'Irigasi & Pupuk', 'MEDIUM'),
    (v_company_id, 'Lainnya', 'LOW');

    INSERT INTO zones (company_id, name) VALUES
    (v_company_id, 'Blok A (Utara)'), (v_company_id, 'Blok B (Selatan)'),
    (v_company_id, 'Blok C (Timur)'), (v_company_id, 'Blok D (Barat)');

    RETURN jsonb_build_object('success', true, 'company_id', v_company_id);
END;
$$;

CREATE OR REPLACE FUNCTION claim_employee_record() RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
    v_matched_id UUID;
    v_jwt_email TEXT;
BEGIN
    v_jwt_email := auth.jwt()->>'email';
    IF v_jwt_email IS NULL THEN RETURN FALSE; END IF;

    SELECT id INTO v_matched_id FROM employees WHERE lower(email) = lower(v_jwt_email) AND auth_id IS NULL LIMIT 1;

    IF v_matched_id IS NOT NULL THEN
        UPDATE employees SET auth_id = auth.uid() WHERE id = v_matched_id;
        RETURN TRUE;
    END IF;
    RETURN FALSE;
END;
$$;

CREATE OR REPLACE FUNCTION request_workspace_access(
  p_code TEXT,
  p_email TEXT,
  p_full_name TEXT,
  p_phone TEXT
) RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_company_id UUID;
BEGIN
  SELECT id INTO v_company_id FROM companies WHERE workspace_code = p_code;

  IF v_company_id IS NULL THEN
    RAISE EXCEPTION 'Kode Workspace tidak valid atau tidak ditemukan.';
  END IF;

  IF EXISTS (SELECT 1 FROM access_requests WHERE email = p_email AND company_id = v_company_id AND status = 'PENDING') THEN
    RAISE EXCEPTION 'Anda sudah pernah meminta akses ke Workspace ini. Harap tunggu persetujuan.';
  END IF;

  INSERT INTO access_requests (company_id, email, full_name, phone)
  VALUES (v_company_id, p_email, p_full_name, p_phone);

  RETURN TRUE;
END;
$$;

-- ---------------------------------------------------------------------------
-- 6. Storage buckets
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public) VALUES ('reports_media', 'reports_media', true) ON CONFLICT (id) DO UPDATE SET public = true;
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Anyone can view reports media" ON storage.objects;
CREATE POLICY "Anyone can view reports media" ON storage.objects FOR SELECT TO public USING (bucket_id = 'reports_media');
DROP POLICY IF EXISTS "Authenticated users can upload reports media" ON storage.objects;
CREATE POLICY "Authenticated users can upload reports media" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'reports_media' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;
CREATE POLICY "Anyone can view avatars" ON storage.objects FOR SELECT TO public USING (bucket_id = 'avatars');
DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
CREATE POLICY "Authenticated users can upload avatars" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
CREATE POLICY "Users can update their own avatars" ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text)
WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
DROP POLICY IF EXISTS "Users can delete their own avatars" ON storage.objects;
CREATE POLICY "Users can delete their own avatars" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- ---------------------------------------------------------------------------
-- 7. Outbound webhook
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pg_net;

CREATE OR REPLACE FUNCTION public.invoke_report_webhook()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_token TEXT;
BEGIN
  SELECT decrypted_secret INTO v_token
  FROM vault.decrypted_secrets
  WHERE name = 'report_webhook_token'
  LIMIT 1;

  PERFORM net.http_post(
    url := 'https://gbxjpreqlrrlsvpwaazn.supabase.co/functions/v1/report-webhook',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || COALESCE(v_token, '')
    ),
    body := jsonb_build_object(
      'type', TG_OP,
      'table', TG_TABLE_NAME,
      'schema', TG_TABLE_SCHEMA,
      'record', row_to_json(NEW),
      'old_record', row_to_json(OLD)
    )
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS report_email_trigger ON public.field_reports;
CREATE TRIGGER report_email_trigger
AFTER INSERT OR UPDATE ON public.field_reports
FOR EACH ROW EXECUTE FUNCTION public.invoke_report_webhook();

