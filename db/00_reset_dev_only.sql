-- =====================================================================================
-- DANGER: DEVELOPMENT RESET SCRIPT
-- =====================================================================================
-- This script tears down the schema. Please Do NOT run this in production unless
-- you are deliberately trying to wipe out all data.
-- =====================================================================================

DROP TRIGGER IF EXISTS protect_created_at_field_reports ON field_reports;
DROP TRIGGER IF EXISTS enforce_worker_limit_trigger ON employees;
DROP TRIGGER IF EXISTS check_employee_escalation ON employees;
DROP TRIGGER IF EXISTS set_companies_updated_at ON companies;
DROP TRIGGER IF EXISTS set_employees_updated_at ON employees;
DROP TRIGGER IF EXISTS set_reports_updated_at ON field_reports;
DROP TRIGGER IF EXISTS report_email_trigger ON public.field_reports;

DROP FUNCTION IF EXISTS protect_created_at() CASCADE;
DROP FUNCTION IF EXISTS get_my_company_id() CASCADE;
DROP FUNCTION IF EXISTS get_my_employee_id() CASCADE;
DROP FUNCTION IF EXISTS get_my_role() CASCADE;
DROP FUNCTION IF EXISTS is_supervisor() CASCADE;
DROP FUNCTION IF EXISTS has_no_company() CASCADE;
DROP FUNCTION IF EXISTS enforce_worker_limit() CASCADE;
DROP FUNCTION IF EXISTS prevent_employee_escalation() CASCADE;
DROP FUNCTION IF EXISTS trigger_set_updated_at() CASCADE;
DROP FUNCTION IF EXISTS register_company_and_profile(TEXT, TEXT, TEXT, TEXT) CASCADE;
DROP FUNCTION IF EXISTS claim_employee_record() CASCADE;
DROP FUNCTION IF EXISTS public.invoke_report_webhook() CASCADE;
DROP FUNCTION IF EXISTS request_workspace_access(TEXT, TEXT, TEXT, TEXT) CASCADE;

DROP TABLE IF EXISTS access_requests CASCADE;
DROP TABLE IF EXISTS report_comments CASCADE;
DROP TABLE IF EXISTS field_reports CASCADE;
DROP TABLE IF EXISTS report_categories CASCADE;
DROP TABLE IF EXISTS zones CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
