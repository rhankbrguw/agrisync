# AgriSync Ecosystem

Multi-tenant plantation management and field reporting platform. React frontend, Zustand state, Tailwind styling. Supabase backend for PostgreSQL storage, Edge Functions, Auth, and Storage.

---

Clone it, copy `.env.example` to `.env.local`, then run npm install to pull dependencies.

Database: Run the SQL scripts in db/ (specifically `00_reset_dev_only.sql` and `01_prod_schema.sql`) in your Supabase SQL editor to scaffold tables, RLS policies, and vault secrets.

Edge Functions: Deploy the webhook via `npx supabase functions deploy report-webhook --project-ref <your-ref>`. Ensure `RESEND_API_KEY` is set in your Supabase secrets.

Frontend: `npm run dev` to start the Vite server on :5173.

Production: `npm run lint` && `npx tsc -b to verify`, then `npm run build` to output static files to dist/.

---

Requires Node 18+ and Supabase CLI.
