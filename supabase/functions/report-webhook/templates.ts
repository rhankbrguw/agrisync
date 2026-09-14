export interface ReportEmailContext {
  fullName: string;
  categoryName: string;
  zoneName: string;
  notes?: string;
  photoUrl?: string | null;
  statusText?: string;
  statusColor?: string;
  supervisorComment?: string | null;
  supervisorName?: string;
  appUrl?: string;
}

function wrapEmailDocument(title: string, accentColor: string, bodyContent: string): string {
  return `<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><meta http-equiv="X-UA-Compatible" content="IE=edge"/><title>${title}</title></head><body style="margin:0;padding:0;background-color:#F8FAFC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;"><table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#F8FAFC" style="padding:24px 12px;"><tr><td align="center"><table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#FFFFFF;border-radius:12px;border-top:4px solid ${accentColor};box-shadow:0 1px 3px rgba(0,0,0,0.05);overflow:hidden;"><tr><td style="padding:32px 24px;">${bodyContent}</td></tr><tr><td style="padding:16px 24px;background-color:#F1F5F9;border-top:1px solid #E2E8F0;text-align:center;"><p style="margin:0;font-size:12px;color:#64748B;">AgriSync Enterprise &bull; Sistem Otomasi Laporan Perkebunan</p></td></tr></table></td></tr></table></body></html>`;
}

export function buildWorkerReceiptHtml(ctx: ReportEmailContext): string {
  const base = ctx.appUrl || 'https://agrisync.rhankbrguw.xyz';
  const content = `<h2 style="margin:0 0 16px;color:#0F172A;font-size:20px;font-weight:700;">Laporan Diterima &#9989;</h2><p style="margin:0 0 12px;color:#475569;font-size:15px;line-height:1.6;">Halo <strong>${ctx.fullName}</strong>,</p><p style="margin:0 0 20px;color:#475569;font-size:15px;line-height:1.6;">Laporan lapangan Anda telah berhasil masuk ke sistem kami dan sedang menunggu tinjauan Supervisor.</p><div style="background-color:#F1F5F9;padding:16px;border-radius:8px;border:1px solid #E2E8F0;margin-bottom:24px;"><p style="margin:0 0 6px;color:#64748B;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Detail Laporan:</p><p style="margin:0 0 4px;color:#0F172A;font-size:14px;"><strong>Kategori:</strong> ${ctx.categoryName}</p><p style="margin:0;color:#0F172A;font-size:14px;"><strong>Zona:</strong> ${ctx.zoneName}</p></div><table border="0" cellpadding="0" cellspacing="0"><tr><td align="center" bgcolor="#3B82F6" style="border-radius:8px;"><a href="${base}/worker" style="display:inline-block;padding:12px 24px;font-size:14px;color:#FFFFFF;font-weight:700;text-decoration:none;">Buka Riwayat Laporan</a></td></tr></table>`;
  return wrapEmailDocument('Laporan Diterima', '#3B82F6', content);
}

export function buildWorkerReceiptText(ctx: ReportEmailContext): string {
  const base = ctx.appUrl || 'https://agrisync.rhankbrguw.xyz';
  return `Halo ${ctx.fullName},\n\nLaporan lapangan Anda telah berhasil masuk ke sistem dan sedang menunggu tinjauan Supervisor.\n\nDetail Laporan:\n- Kategori: ${ctx.categoryName}\n- Zona: ${ctx.zoneName}\n\nBuka Riwayat: ${base}/worker\n\nSalam,\nTim AgriSync`;
}

export function buildSupervisorAlertHtml(ctx: ReportEmailContext): string {
  const base = ctx.appUrl || 'https://agrisync.rhankbrguw.xyz';
  const photoBlock = ctx.photoUrl ? `<div style="margin-top:12px;"><a href="${ctx.photoUrl}" style="color:#2563EB;font-size:13px;font-weight:600;text-decoration:none;">Lihat Foto Bukti &rarr;</a></div>` : '';
  const content = `<h2 style="margin:0 0 16px;color:#0F172A;font-size:20px;font-weight:700;">Insiden Lapangan Baru &#128680;</h2><p style="margin:0 0 16px;color:#475569;font-size:15px;line-height:1.6;">Pekerja <strong>${ctx.fullName}</strong> melaporkan kendala baru pada sistem.</p><div style="background-color:#FEF2F2;padding:16px;border-radius:8px;border:1px solid #FCA5A5;margin-bottom:24px;"><p style="margin:0 0 6px;color:#991B1B;font-size:14px;"><strong>Kategori:</strong> ${ctx.categoryName}</p><p style="margin:0 0 6px;color:#991B1B;font-size:14px;"><strong>Lokasi:</strong> ${ctx.zoneName}</p><p style="margin:0;color:#7F1D1D;font-size:14px;"><strong>Catatan Pekerja:</strong><br/><em>"${ctx.notes || 'Tidak ada catatan.'}"</em></p>${photoBlock}</div><table border="0" cellpadding="0" cellspacing="0"><tr><td align="center" bgcolor="#10B981" style="border-radius:8px;"><a href="${base}/dashboard" style="display:inline-block;padding:12px 24px;font-size:14px;color:#FFFFFF;font-weight:700;text-decoration:none;">Tindak Lanjuti Sekarang</a></td></tr></table>`;
  return wrapEmailDocument('Insiden Baru', '#EF4444', content);
}

export function buildSupervisorAlertText(ctx: ReportEmailContext): string {
  const base = ctx.appUrl || 'https://agrisync.rhankbrguw.xyz';
  return `Insiden Lapangan Baru!\n\nPekerja ${ctx.fullName} melaporkan kendala:\n- Kategori: ${ctx.categoryName}\n- Lokasi: ${ctx.zoneName}\n- Catatan: "${ctx.notes || 'Tidak ada catatan.'}"\n\nBuka Dasbor: ${base}/dashboard\n\nTim AgriSync`;
}

export function buildStatusUpdateHtml(ctx: ReportEmailContext): string {
  const base = ctx.appUrl || 'https://agrisync.rhankbrguw.xyz';
  const color = ctx.statusColor || '#3B82F6';
  const commentBlock = ctx.supervisorComment ? `<div style="background-color:#F8FAFC;padding:16px;border-left:4px solid ${color};margin-top:20px;border-radius:4px;"><p style="margin:0 0 4px;font-size:11px;color:#64748B;text-transform:uppercase;font-weight:700;">Catatan dari ${ctx.supervisorName || 'Supervisor'}:</p><p style="margin:0;color:#0F172A;font-size:14px;line-height:1.5;font-style:italic;">"${ctx.supervisorComment}"</p></div>` : '';
  const content = `<h2 style="margin:0 0 16px;color:#0F172A;font-size:20px;font-weight:700;">Status Laporan Diperbarui &#128260;</h2><p style="margin:0 0 12px;color:#475569;font-size:15px;line-height:1.6;">Halo <strong>${ctx.fullName}</strong>,</p><p style="margin:0 0 16px;color:#475569;font-size:15px;line-height:1.6;">Laporan Anda untuk masalah <strong>${ctx.categoryName}</strong> di <strong>${ctx.zoneName}</strong> kini berstatus:</p><div style="background-color:${color}15;color:${color};padding:12px;border-radius:8px;font-weight:700;font-size:16px;text-align:center;border:1px solid ${color}30;">${ctx.statusText}</div>${commentBlock}<div style="margin-top:24px;"><table border="0" cellpadding="0" cellspacing="0"><tr><td align="center" bgcolor="${color}" style="border-radius:8px;"><a href="${base}/worker" style="display:inline-block;padding:12px 24px;font-size:14px;color:#FFFFFF;font-weight:700;text-decoration:none;">Buka Aplikasi AgriSync</a></td></tr></table></div>`;
  return wrapEmailDocument(`Status Update: ${ctx.statusText}`, color, content);
}

export function buildStatusUpdateText(ctx: ReportEmailContext): string {
  const base = ctx.appUrl || 'https://agrisync.rhankbrguw.xyz';
  const comment = ctx.supervisorComment ? `\nCatatan Supervisor: "${ctx.supervisorComment}"` : '';
  return `Halo ${ctx.fullName},\n\nStatus laporan untuk ${ctx.categoryName} di ${ctx.zoneName} telah diperbarui menjadi: ${ctx.statusText}.${comment}\n\nBuka Aplikasi: ${base}/worker\n\nTim AgriSync`;
}
