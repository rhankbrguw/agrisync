import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  buildWorkerReceiptHtml,
  buildWorkerReceiptText,
  buildSupervisorAlertHtml,
  buildSupervisorAlertText,
  buildStatusUpdateHtml,
  buildStatusUpdateText,
} from "./templates.ts";

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const RESEND_FROM = Deno.env.get('RESEND_FROM') || 'notifications@rhankbrguw.xyz';
const RESEND_FROM_NAME = Deno.env.get('RESEND_FROM_NAME') || 'AgriSync';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const APP_URL = Deno.env.get('APP_URL') || 'https://agrisync.rhankbrguw.xyz';

const sendEmail = (to: string, subject: string, html: string, text: string) => {
  return fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: `${RESEND_FROM_NAME} <${RESEND_FROM}>`,
      to: [to],
      subject,
      html,
      text,
    }),
  }).then((res) => res.json());
};

serve(async (req) => {
  try {
    const payload = await req.json();
    const isInsert = payload.type === 'INSERT';
    const isUpdate = payload.type === 'UPDATE';

    if (!isInsert && !isUpdate) return new Response('Not an insert or update', { status: 200 });

    const newRecord = payload.record;
    const oldRecord = payload.old_record || {};
    if (isUpdate && oldRecord.status === newRecord.status) {
      return new Response('Status did not change, skipping', { status: 200 });
    }

    if (!RESEND_API_KEY) throw new Error('Missing RESEND_API_KEY environment variable.');

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    const { data: employee } = await supabase.from('employees').select('email, full_name, company_id').eq('id', newRecord.employee_id).single();
    if (!employee?.email) return new Response('Employee or email not found', { status: 200 });

    const { data: reportDetails } = await supabase.from('field_reports').select('notes, image_url, report_categories(name), zones(name)').eq('id', newRecord.id).single();
    const categoryName = reportDetails?.report_categories?.name || 'Umum';
    const zoneName = reportDetails?.zones?.name || 'Tidak diketahui';
    const notes = reportDetails?.notes || 'Tidak ada catatan.';
    const photoUrl = reportDetails?.image_url ? `${SUPABASE_URL}/storage/v1/object/public/reports_media/${reportDetails.image_url}` : null;

    const emailPromises: Promise<unknown>[] = [];

    if (isInsert) {
      const ctx = { fullName: employee.full_name, categoryName, zoneName, appUrl: APP_URL };
      emailPromises.push(sendEmail(employee.email, '[Tanda Terima] Laporan Anda Diterima', buildWorkerReceiptHtml(ctx), buildWorkerReceiptText(ctx)));

      const { data: supervisors } = await supabase.from('employees').select('email').eq('company_id', employee.company_id).eq('role', 'SUPERVISOR');
      if (supervisors && supervisors.length > 0) {
        const superCtx = { fullName: employee.full_name, categoryName, zoneName, notes, photoUrl, appUrl: APP_URL };
        emailPromises.push(sendEmail(supervisors[0].email, `🚨 Laporan Masuk: ${categoryName} dari ${employee.full_name}`, buildSupervisorAlertHtml(superCtx), buildSupervisorAlertText(superCtx)));
      }
    } else {
      const { data: comments } = await supabase.from('report_comments').select('content, employees(full_name)').eq('report_id', newRecord.id).order('created_at', { ascending: false }).limit(1);
      const latestComment = comments && comments.length > 0 ? comments[0] : null;
      const statusMap: Record<string, string> = { PENDING: 'Menunggu', INVESTIGATING: 'Diproses (Investigasi)', RESOLVED: 'Selesai (Resolved)' };
      const statusText = statusMap[newRecord.status] || newRecord.status;
      const statusColor = newRecord.status === 'RESOLVED' ? '#10B981' : newRecord.status === 'INVESTIGATING' ? '#3B82F6' : '#F59E0B';

      const updateCtx = {
        fullName: employee.full_name,
        categoryName,
        zoneName,
        statusText,
        statusColor,
        supervisorComment: latestComment?.content,
        supervisorName: latestComment?.employees?.full_name,
        appUrl: APP_URL,
      };
      emailPromises.push(sendEmail(employee.email, `Update Laporan: ${statusText}`, buildStatusUpdateHtml(updateCtx), buildStatusUpdateText(updateCtx)));
    }

    const results = await Promise.allSettled(emailPromises);
    return new Response(JSON.stringify({ success: true, dispatched: results.length }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    return new Response(String(err instanceof Error ? err.message : err), { status: 500 });
  }
});
