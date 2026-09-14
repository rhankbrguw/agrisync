export interface DocItem {
  id: string;
  title: string;
  category: string;
  summary: string;
  badge?: string;
  content: {
    overview: string;
    highlights: string[];
    codeBlock?: { language: string; title: string; code: string };
    notes?: string;
  };
}

export const DOCS_CATEGORIES = [
  { id: 'getting-started', label: 'Memulai' },
  { id: 'architecture', label: 'Arsitektur & Offline' },
  { id: 'security', label: 'Keamanan & RLS' },
  { id: 'integrations', label: 'Integrasi & Webhook' },
] as const;

export const DOCS_DATA: DocItem[] = [
  {
    id: 'intro',
    title: 'Pengenalan Platform AgriSync',
    category: 'getting-started',
    summary: 'Arsitektur dasar platform pelaporan lapangan dan manajemen perkebunan multi-tenant.',
    badge: 'Core',
    content: {
      overview: 'AgriSync dirancang untuk mengatasi kendala konektivitas di perkebunan remote dengan memadukan PWA lokal dan sinkronisasi otomatis ke Supabase.',
      highlights: [
        'PWA dengan kapabilitas offline murni via IndexedDB (Dexie.js)',
        'Multi-tenancy terisolasi menggunakan PostgreSQL 15 Row Level Security (RLS)',
        'Pipeline insiden otomatis dengan notifikasi instan berbasis Edge Functions',
        'Dasbor pengawasan peta GIS interaktif untuk Supervisor'
      ],
      codeBlock: {
        language: 'bash',
        title: 'Quickstart Development',
        code: `# Clone repository & instal dependensi\ngit clone https://github.com/your-org/agrisync.git\ncd agrisync && npm install\ncp .env.example .env.local && npm run dev`
      },
      notes: 'Pastikan izin Geolocation (GPS) dan Kamera telah diaktifkan pada peramban seluler.'
    }
  },
  {
    id: 'offline-sync',
    title: 'Mekanisme Offline-First & Sync Engine',
    category: 'architecture',
    summary: 'Bagaimana data transaksi disimpan secara lokal dan disinkronkan tanpa resiko duplikasi.',
    badge: 'Offline-First',
    content: {
      overview: 'Saat pekerja mengambil foto di pelosok, transaksi langsung dicatat ke antrean Dexie.js lokal dengan timestamp ISO akurat.',
      highlights: [
        'Promise-locking mencegah sinkronisasi paralel ganda saat sinyal berfluktuasi',
        'Validasi schema lokal dengan Zod sebelum payload dikirim ke jaringan',
        'Rollback otomatis: jika simpan DB gagal, media yang diunggah dibersihkan',
        'Fallback foreign-key toleran jika data zona atau kategori lokal usang'
      ],
      codeBlock: {
        language: 'typescript',
        title: 'Sync Engine Contract',
        code: `export const syncOfflineData = async (): Promise<number> => {\n  const pending = await db.reports_queue.toArray();\n  for (const report of pending) {\n    const path = await uploadReportImage(report.imageBlob, user.id);\n    await supabase.from(TABLES.FIELD_REPORTS).insert([{ ...report, image_url: path }]);\n    await db.reports_queue.delete(report.id!);\n  }\n  return pending.length;\n};`
      },
      notes: 'Retry counter dibatasi maksimal 3 kali sebelum antrean dievaluasi.'
    }
  },
  {
    id: 'rls-security',
    title: 'Keamanan Multi-Tenant & RLS',
    category: 'security',
    summary: 'Pemisahan data antar perkebunan di level engine database PostgreSQL.',
    badge: 'Security',
    content: {
      overview: 'Setiap baris data dilindungi oleh PostgreSQL Row Level Security (RLS) policies.',
      highlights: [
        'Pekerja hanya dapat melihat dan mengirim data milik perusahaannya sendiri',
        'Supervisor memiliki hak moderasi status insiden dalam perusahaannya',
        'Trigger anti-escalation mencegah eskalasi peran sepihak dari klien',
        'Trigger enforce worker limit memastikan batasan kuota pegawai ditaati'
      ],
      codeBlock: {
        language: 'sql',
        title: 'PostgreSQL RLS Policy Sample',
        code: `CREATE POLICY "employees_select_reports" ON field_reports FOR SELECT TO authenticated USING (company_id = get_my_company_id());\nCREATE POLICY "supervisors_update_reports" ON field_reports FOR UPDATE TO authenticated USING (is_supervisor() AND company_id = get_my_company_id());`
      },
      notes: 'Fungsi get_my_company_id() menggunakan deklarasi STABLE SECURITY DEFINER.'
    }
  },
  {
    id: 'webhooks-integration',
    title: 'Edge Functions & Webhook Notifikasi',
    category: 'integrations',
    summary: 'Pengiriman email asinkron dan integrasi payment gateway Midtrans SNAP.',
    badge: 'Integrasi',
    content: {
      overview: 'Arsitektur asinkron memanfaatkan pg_net dan Supabase Vault untuk memicu Edge Functions tanpa membebani transaksi database utama.',
      highlights: [
        'Trigger laporan memanggil report-webhook untuk dispatch email otomatis via Resend',
        'Verifikasi signature HMAC SHA-512 pada webhook Midtrans untuk upgrade paket Pro',
        'Secret token tersimpan aman di Supabase Vault'
      ],
      codeBlock: {
        language: 'typescript',
        title: 'Midtrans Webhook HMAC Verification',
        code: `const payload = \`\${order_id}\${status_code}\${gross_amount}\${serverKey}\`;\nconst hashBuffer = await crypto.subtle.digest('SHA-512', new TextEncoder().encode(payload));\nconst hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');\nif (hashHex !== signature_key) return new Response('Invalid signature', { status: 403 });`
      },
      notes: 'Edge function berjalan di Deno runtime berlatensi rendah di multi-region edge.'
    }
  }
];

