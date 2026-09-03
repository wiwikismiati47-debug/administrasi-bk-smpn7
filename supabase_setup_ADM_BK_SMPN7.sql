-- ==============================================================================
-- SQL DATABASE SETUP SCRIPT FOR ADMINISTRASI BK SMPN 7 PASURUAN (ADM_BK_SMPN7)
-- ==============================================================================
--
-- Nama Server / Project Supabase: ADM_BK_SMPN7
-- Password Database: Wiwik47SMPN7
--
-- PETUNJUK PENGGUNAAN:
-- 1. Buka Supabase Dashboard Anda di https://supabase.com
-- 2. Pilih project "ADM_BK_SMPN7"
-- 3. Di menu sidebar kiri, klik "SQL Editor"
-- 4. Buat query baru (New Query)
-- 5. Tempel (Paste) seluruh script SQL di bawah ini dan tekan tombol "RUN" (Kirim)
-- 6. Semua tabel akan terbuat lengkap dengan relasi, kebijakan keamanan (RLS) terbuka,
--    dan data demonstrasi awal (seeding data) untuk BK SMP Negeri 7 Pasuruan.
--
-- ==============================================================================

--------------------------------------------------------------------------------
-- PEMBERSIHAN (OPSIONAL) - Hapus tabel jika sudah ada agar bersih
--------------------------------------------------------------------------------
-- drop table if exists public.siswa_bk cascade;
-- drop table if exists public.konferensi_kasus_siswa cascade;
-- drop table if exists public.surat_pernyataan_siswa cascade;
-- drop table if exists public.rencana_konseling_kelompok cascade;
-- drop table if exists public.rencana_konseling_individu cascade;
-- drop table if exists public.rekam_permasalahan_siswa cascade;
-- drop table if exists public.home_visit_bk cascade;
-- drop table if exists public.undangan_orang_tua cascade;
-- drop table if exists public.agenda_kerja_bk cascade;

--------------------------------------------------------------------------------
-- 1. TABEL: SISWA BK (siswa_bk)
--------------------------------------------------------------------------------
create table if not exists public.siswa_bk (
  id text primary key default gen_random_uuid()::text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  nama_siswa text not null,
  kelas text not null,
  nis text not null unique,
  jenis_kelamin text not null, -- 'Laki-laki' | 'Perempuan'
  keterangan text default ''
);

-- Mengaktifkan Row Level Security (RLS)
alter table public.siswa_bk enable row level security;

-- Membuat Kebijakan RLS (Akses Publik Tanpa Login Sesuai Kebutuhan)
drop policy if exists "Akses Baca Publik Siswa" on public.siswa_bk;
drop policy if exists "Akses Tambah Publik Siswa" on public.siswa_bk;
drop policy if exists "Akses Update Publik Siswa" on public.siswa_bk;
drop policy if exists "Akses Hapus Publik Siswa" on public.siswa_bk;

create policy "Akses Baca Publik Siswa" on public.siswa_bk for select using (true);
create policy "Akses Tambah Publik Siswa" on public.siswa_bk for insert with check (true);
create policy "Akses Update Publik Siswa" on public.siswa_bk for update using (true);
create policy "Akses Hapus Publik Siswa" on public.siswa_bk for delete using (true);


--------------------------------------------------------------------------------
-- 2. TABEL: AGENDA KERJA BK (agenda_kerja_bk)
--------------------------------------------------------------------------------
create table if not exists public.agenda_kerja_bk (
  id text primary key default gen_random_uuid()::text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  hari text not null,
  tanggal date not null,
  bulan text not null,
  tahun text not null,
  waktu text not null,
  uraian_kegiatan text not null,
  sasaran text not null,
  link_foto_kegiatan text default '',
  keterangan text default ''
);

-- Mengaktifkan Row Level Security (RLS)
alter table public.agenda_kerja_bk enable row level security;

-- Membuat Kebijakan RLS
drop policy if exists "Akses Baca Publik Agenda" on public.agenda_kerja_bk;
drop policy if exists "Akses Tambah Publik Agenda" on public.agenda_kerja_bk;
drop policy if exists "Akses Update Publik Agenda" on public.agenda_kerja_bk;
drop policy if exists "Akses Hapus Publik Agenda" on public.agenda_kerja_bk;

create policy "Akses Baca Publik Agenda" on public.agenda_kerja_bk for select using (true);
create policy "Akses Tambah Publik Agenda" on public.agenda_kerja_bk for insert with check (true);
create policy "Akses Update Publik Agenda" on public.agenda_kerja_bk for update using (true);
create policy "Akses Hapus Publik Agenda" on public.agenda_kerja_bk for delete using (true);


--------------------------------------------------------------------------------
-- 3. TABEL: UNDANGAN ORANG TUA SISWA (undangan_orang_tua)
--------------------------------------------------------------------------------
create table if not exists public.undangan_orang_tua (
  id text primary key default gen_random_uuid()::text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  hari text not null,
  tanggal date not null,
  bulan text not null,
  tahun text not null,
  waktu text not null,
  tempat_pelaksanaan text default 'SMP Negeri 7 Pasuruan',
  kelas text not null,
  nama_siswa text not null,
  nama_orang_tua text not null,
  pekerjaan_orang_tua text default '',
  alamat text default '',
  perihal_undangan text not null,
  uraian_permasalahan text default '',
  tindak_lanjut text default '',
  link_foto_kegiatan text default '',
  keterangan text default '',
  nomor_surat text default '',
  tanggal_surat text default '',
  tempat_surat text default 'Pasuruan',
  semester text default '',
  nama_guru_bk text default 'WIWIK ISMIATI, S.Pd',
  nip_guru_bk text default '19831116 200904 2 003',
  nama_kepala_sekolah text default 'Drs. H. AGUNG ARDI TIGO',
  nip_kepala_sekolah text default '19621212 198712 1 002'
);

-- Mengaktifkan Row Level Security (RLS)
alter table public.undangan_orang_tua enable row level security;

-- Membuat Kebijakan RLS
drop policy if exists "Akses Baca Publik Undangan" on public.undangan_orang_tua;
drop policy if exists "Akses Tambah Publik Undangan" on public.undangan_orang_tua;
drop policy if exists "Akses Update Publik Undangan" on public.undangan_orang_tua;
drop policy if exists "Akses Hapus Publik Undangan" on public.undangan_orang_tua;

create policy "Akses Baca Publik Undangan" on public.undangan_orang_tua for select using (true);
create policy "Akses Tambah Publik Undangan" on public.undangan_orang_tua for insert with check (true);
create policy "Akses Update Publik Undangan" on public.undangan_orang_tua for update using (true);
create policy "Akses Hapus Publik Undangan" on public.undangan_orang_tua for delete using (true);


--------------------------------------------------------------------------------
-- 4. TABEL: HOME VISIT / KUNJUNGAN RUMAH (home_visit_bk)
--------------------------------------------------------------------------------
create table if not exists public.home_visit_bk (
  id text primary key default gen_random_uuid()::text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  hari text not null,
  tanggal date not null,
  bulan text not null,
  tahun text not null,
  waktu text not null,
  kelas text not null,
  nama_siswa text not null,
  nama_orang_tua text not null,
  pekerjaan_orang_tua text default '',
  alamat text default '',
  perihal_home_visit text not null,
  uraian_permasalahan text default '',
  tindak_lanjut text default '',
  link_foto_kegiatan text default '',
  keterangan text default '',
  
  -- 14 Field Laporan Resmi & Administrasi Kunjungan Rumah
  semester_laporan text default '',
  bidang_layanan text default '',
  topik_permasalahan text default '',
  fungsi_layanan text default '',
  pihak_terlibat text default '',
  tujuan_kegiatan text default '',
  gambaran_ringkas_masalah text default '',
  alamat_kunjungan text default '',
  hari_tanggal_lama_kunjungan text default '',
  anggota_keluarga_dikunjungi text default '',
  rencana_evaluasi text default '',
  catatan_khusus text default '',
  nama_guru_bk text default 'WIWIK ISMIATI, S.Pd',
  nip_guru_bk text default '19831116 200904 2 003',
  nama_kepala_sekolah text default 'Drs. H. AGUNG ARDI TIGO',
  nip_kepala_sekolah text default '19621212 198712 1 002',
  tanggal_surat text default '',
  tempat_surat text default 'Pasuruan',
  
  -- Surat Tugas Kunjungan Rumah fields
  nomor_surat_tugas text default '',
  petugas_1 text default 'WIWIK ISMIATI, S.Pd',
  petugas_2 text default '',
  jabatan_petugas_1 text default 'Guru BK / Konselor',
  jabatan_petugas_2 text default 'Wali Kelas',
  nis_siswa text default '',
  
  -- Surat Kesediaan Menerima Kunjungan Orang Tua fields
  tanggal_surat_tugas text default '',
  petugas_penerima_kunjungan text default '',
  tanggal_pernyataan_ortu text default ''
);

-- Mengaktifkan Row Level Security (RLS)
alter table public.home_visit_bk enable row level security;

-- Membuat Kebijakan RLS
drop policy if exists "Akses Baca Publik Home Visit" on public.home_visit_bk;
drop policy if exists "Akses Tambah Publik Home Visit" on public.home_visit_bk;
drop policy if exists "Akses Update Publik Home Visit" on public.home_visit_bk;
drop policy if exists "Akses Hapus Publik Home Visit" on public.home_visit_bk;

create policy "Akses Baca Publik Home Visit" on public.home_visit_bk for select using (true);
create policy "Akses Tambah Publik Home Visit" on public.home_visit_bk for insert with check (true);
create policy "Akses Update Publik Home Visit" on public.home_visit_bk for update using (true);
create policy "Akses Hapus Publik Home Visit" on public.home_visit_bk for delete using (true);


--------------------------------------------------------------------------------
-- 5. TABEL: REKAM PERMASALAHAN SISWA (rekam_permasalahan_siswa)
--------------------------------------------------------------------------------
create table if not exists public.rekam_permasalahan_siswa (
  id text primary key default gen_random_uuid()::text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  hari text not null,
  tanggal date not null,
  bulan text not null,
  tahun text not null,
  waktu text not null,
  kelas text not null,
  nama_siswa text not null,
  nama_orang_tua text default '',
  pekerjaan_orang_tua text default '',
  alamat text default '',
  ringkasan_uraian_permasalahan text default '',
  upaya_konselor_walikelas text default '',
  hasil_dan_kesimpulan text default '',
  link_foto_kegiatan text default '',
  keterangan text default '',
  nama_guru_bk text default 'WIWIK ISMIATI, S.Pd',
  nip_guru_bk text default '19831116 200904 2 003',
  nama_kepala_sekolah text default 'Drs. H. AGUNG ARDI TIGO',
  nip_kepala_sekolah text default '19621212 198712 1 002',
  tanggal_surat text default '',
  tempat_surat text default 'Pasuruan'
);

-- Mengaktifkan Row Level Security (RLS)
alter table public.rekam_permasalahan_siswa enable row level security;

-- Membuat Kebijakan RLS
drop policy if exists "Akses Baca Publik Masalah" on public.rekam_permasalahan_siswa;
drop policy if exists "Akses Tambah Publik Masalah" on public.rekam_permasalahan_siswa;
drop policy if exists "Akses Update Publik Masalah" on public.rekam_permasalahan_siswa;
drop policy if exists "Akses Hapus Publik Masalah" on public.rekam_permasalahan_siswa;

create policy "Akses Baca Publik Masalah" on public.rekam_permasalahan_siswa for select using (true);
create policy "Akses Tambah Publik Masalah" on public.rekam_permasalahan_siswa for insert with check (true);
create policy "Akses Update Publik Masalah" on public.rekam_permasalahan_siswa for update using (true);
create policy "Akses Hapus Publik Masalah" on public.rekam_permasalahan_siswa for delete using (true);


--------------------------------------------------------------------------------
-- 6. TABEL: RENCANA KONSELING INDIVIDU (rencana_konseling_individu)
--------------------------------------------------------------------------------
create table if not exists public.rencana_konseling_individu (
  id text primary key default gen_random_uuid()::text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  hari text not null,
  tanggal date not null,
  bulan text not null,
  tahun text not null,
  waktu text not null,
  kelas text not null,
  nama_siswa text not null,
  topik_permasalahan text default '',
  media_yang_diperlukan text default '',
  ringkasan_uraian_permasalahan text default '',
  pendekatan_dan_teknik_konseling text default '',
  hasil_yang_dicapai text default '',
  link_foto_kegiatan text default '',
  keterangan text default '',
  nama_guru_bk text default 'WIWIK ISMIATI, S.Pd',
  nip_guru_bk text default '19831116 200904 2 003',
  nama_kepala_sekolah text default 'Drs. H. AGUNG ARDI TIGO',
  nip_kepala_sekolah text default '19621212 198712 1 002'
);

-- Mengaktifkan Row Level Security (RLS)
alter table public.rencana_konseling_individu enable row level security;

-- Membuat Kebijakan RLS
drop policy if exists "Akses Baca Publik Konseling Ind" on public.rencana_konseling_individu;
drop policy if exists "Akses Tambah Publik Konseling Ind" on public.rencana_konseling_individu;
drop policy if exists "Akses Update Publik Konseling Ind" on public.rencana_konseling_individu;
drop policy if exists "Akses Hapus Publik Konseling Ind" on public.rencana_konseling_individu;

create policy "Akses Baca Publik Konseling Ind" on public.rencana_konseling_individu for select using (true);
create policy "Akses Tambah Publik Konseling Ind" on public.rencana_konseling_individu for insert with check (true);
create policy "Akses Update Publik Konseling Ind" on public.rencana_konseling_individu for update using (true);
create policy "Akses Hapus Publik Konseling Ind" on public.rencana_konseling_individu for delete using (true);


--------------------------------------------------------------------------------
-- 7. TABEL: RENCANA KONSELING KELOMPOK (rencana_konseling_kelompok)
--------------------------------------------------------------------------------
create table if not exists public.rencana_konseling_kelompok (
  id text primary key default gen_random_uuid()::text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  hari text not null,
  tanggal date not null,
  bulan text not null,
  tahun text not null,
  waktu text not null,
  kelas text not null,
  nama_siswa text not null, -- Daftar / Nama-nama Siswa Anggota Kelompok
  topik_permasalahan text default '',
  media_yang_diperlukan text default '',
  ringkasan_uraian_permasalahan text default '',
  pendekatan_dan_teknik_konseling text default '',
  hasil_yang_dicapai text default '',
  link_foto_kegiatan text default '',
  keterangan text default '',
  nama_guru_bk text default 'WIWIK ISMIATI, S.Pd',
  nip_guru_bk text default '19831116 200904 2 003',
  nama_kepala_sekolah text default 'Drs. H. AGUNG ARDI TIGO',
  nip_kepala_sekolah text default '19621212 198712 1 002'
);

-- Mengaktifkan Row Level Security (RLS)
alter table public.rencana_konseling_kelompok enable row level security;

-- Membuat Kebijakan RLS
drop policy if exists "Akses Baca Publik Konseling Kel" on public.rencana_konseling_kelompok;
drop policy if exists "Akses Tambah Publik Konseling Kel" on public.rencana_konseling_kelompok;
drop policy if exists "Akses Update Publik Konseling Kel" on public.rencana_konseling_kelompok;
drop policy if exists "Akses Hapus Publik Konseling Kel" on public.rencana_konseling_kelompok;

create policy "Akses Baca Publik Konseling Kel" on public.rencana_konseling_kelompok for select using (true);
create policy "Akses Tambah Publik Konseling Kel" on public.rencana_konseling_kelompok for insert with check (true);
create policy "Akses Update Publik Konseling Kel" on public.rencana_konseling_kelompok for update using (true);
create policy "Akses Hapus Publik Konseling Kel" on public.rencana_konseling_kelompok for delete using (true);


--------------------------------------------------------------------------------
-- 8. TABEL: SURAT PERNYATAAN SISWA / ORANG TUA (surat_pernyataan_siswa)
--------------------------------------------------------------------------------
create table if not exists public.surat_pernyataan_siswa (
  id text primary key default gen_random_uuid()::text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  jenis_sp text not null, -- 'SP_1' | 'SP_2' | 'SP_3' | 'SP_ORTU_1' | 'SP_ORTU_2' | 'SP_PENGUNDURAN_DIRI'
  nama_siswa text not null,
  kelas text default '',
  nama_orang_tua text default '',
  pekerjaan_orang_tua text default '',
  alamat_orang_tua text default '',
  hubungan_keluarga text default '',
  peraturan_diketahui text default '',
  alasan_pengunduran text default '',
  tanggal_surat date default current_date,
  tempat_surat text default 'Pasuruan',
  keterangan text default '',
  nama_guru_bk text default 'WIWIK ISMIATI, S.Pd',
  nip_guru_bk text default '19831116 200904 2 003',
  nama_kepala_sekolah text default 'Drs. H. AGUNG ARDI TIGO',
  nip_kepala_sekolah text default '19621212 198712 1 002'
);

-- Mengaktifkan Row Level Security (RLS)
alter table public.surat_pernyataan_siswa enable row level security;

-- Membuat Kebijakan RLS
drop policy if exists "Akses Baca Publik Surat Pernyataan" on public.surat_pernyataan_siswa;
drop policy if exists "Akses Tambah Publik Surat Pernyataan" on public.surat_pernyataan_siswa;
drop policy if exists "Akses Update Publik Surat Pernyataan" on public.surat_pernyataan_siswa;
drop policy if exists "Akses Hapus Publik Surat Pernyataan" on public.surat_pernyataan_siswa;

create policy "Akses Baca Publik Surat Pernyataan" on public.surat_pernyataan_siswa for select using (true);
create policy "Akses Tambah Publik Surat Pernyataan" on public.surat_pernyataan_siswa for insert with check (true);
create policy "Akses Update Publik Surat Pernyataan" on public.surat_pernyataan_siswa for update using (true);
create policy "Akses Hapus Publik Surat Pernyataan" on public.surat_pernyataan_siswa for delete using (true);


--------------------------------------------------------------------------------
-- 9. TABEL: KONFERENSI KASUS SISWA (konferensi_kasus_siswa)
--------------------------------------------------------------------------------
create table if not exists public.konferensi_kasus_siswa (
  id text primary key default gen_random_uuid()::text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  nama_konseli text not null,
  kelas_ta text default '',
  jenis_masalah text default '',
  hari_tgl_jam text default '',
  pemandu_konferensi text default '',
  pemandu_nama text default '',
  pemandu_jabatan text default '',
  data_ingin_diperoleh text default '',
  uraian_kegiatan_inti text default '',
  data_diperoleh_simpulan text default '',
  keterpenuhan_kebutuhan_data text default '',
  rujukan_pelayanan text default '',
  rapat_nama_sekolah text default 'UPT SMPN 7 PASURUAN',
  rapat_alamat text default 'Jl. Simpang Slamet Riadi No.2 Sebani Gadingrejo',
  rapat_tempat text default 'UPT SMPN 7 PASURUAN',
  rapat_ketua text default '',
  rapat_jumlah_hadir text default '',
  rapat_dimulai_pukul text default '',
  rapat_diakhiri_pukul text default '',
  rapat_hasil_pertemuan text default '',
  daftar_hadir_peserta_singkat text default '',
  daftar_hadir_rows text default '[]',
  tanggal_surat date default current_date,
  tempat_surat text default 'Pasuruan',
  nama_guru_bk text default 'WIWIK ISMIATI, S.Pd',
  nip_guru_bk text default '19831116 200904 2 003',
  nama_kepala_sekolah text default 'Drs. H. AGUNG ARDI TIGO',
  nip_kepala_sekolah text default '19621212 198712 1 002',
  keterangan text default ''
);

-- Mengaktifkan Row Level Security (RLS)
alter table public.konferensi_kasus_siswa enable row level security;

-- Membuat Kebijakan RLS
drop policy if exists "Akses Baca Publik Konferensi" on public.konferensi_kasus_siswa;
drop policy if exists "Akses Tambah Publik Konferensi" on public.konferensi_kasus_siswa;
drop policy if exists "Akses Update Publik Konferensi" on public.konferensi_kasus_siswa;
drop policy if exists "Akses Hapus Publik Konferensi" on public.konferensi_kasus_siswa;

create policy "Akses Baca Publik Konferensi" on public.konferensi_kasus_siswa for select using (true);
create policy "Akses Tambah Publik Konferensi" on public.konferensi_kasus_siswa for insert with check (true);
create policy "Akses Update Publik Konferensi" on public.konferensi_kasus_siswa for update using (true);
create policy "Akses Hapus Publik Konferensi" on public.konferensi_kasus_siswa for delete using (true);


--------------------------------------------------------------------------------
-- 10. TABEL: SISWA ATS (Anak Tidak Sekolah) (siswa_ats_bk)
--------------------------------------------------------------------------------
create table if not exists public.siswa_ats_bk (
  id text primary key default gen_random_uuid()::text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  hari text not null,
  tanggal date not null,
  tahun_ajaran text default '2025/2026',
  waktu text not null,
  nama_siswa text not null,
  kategori_ats text not null, -- 'DO (Drop Out)' | 'LTM (Layanan Tidak Melanjutkan)'
  kelas text not null,
  alamat text default '',
  alasan_ats text not null,
  alasan_manual text default '',
  foto_kunjungan_1 text default '',
  foto_bukti_fisik_2 text default '',
  tempat_laporan text default 'Pasuruan',
  tanggal_laporan date default current_date,
  nama_guru_kunjungan text default 'WIWIK ISMIATI, S.Pd',
  nip_guru_kunjungan text default '19831116 200904 2 003',
  nama_kepala_sekolah text default 'NUR FADILAH, S.Pd,. M.Pd',
  nip_kepala_sekolah text default '19860410 201001 2 030',
  keterangan text default ''
);

-- Mengaktifkan Row Level Security (RLS)
alter table public.siswa_ats_bk enable row level security;

-- Membuat Kebijakan RLS
drop policy if exists "Akses Baca Publik Siswa ATS" on public.siswa_ats_bk;
drop policy if exists "Akses Tambah Publik Siswa ATS" on public.siswa_ats_bk;
drop policy if exists "Akses Update Publik Siswa ATS" on public.siswa_ats_bk;
drop policy if exists "Akses Hapus Publik Siswa ATS" on public.siswa_ats_bk;

create policy "Akses Baca Publik Siswa ATS" on public.siswa_ats_bk for select using (true);
create policy "Akses Tambah Publik Siswa ATS" on public.siswa_ats_bk for insert with check (true);
create policy "Akses Update Publik Siswa ATS" on public.siswa_ats_bk for update using (true);
create policy "Akses Hapus Publik Siswa ATS" on public.siswa_ats_bk for delete using (true);


-- ==============================================================================
-- SEEDING DATA: MEMASUKKAN DATA DEMO AWAL SPESIFIK UNTUK SMPN 7 PASURUAN
-- ==============================================================================

--------------------------------------------------------------------------------
-- Seeding Tabel: siswa_bk
--------------------------------------------------------------------------------
insert into public.siswa_bk (id, nama_siswa, kelas, nis, jenis_kelamin, keterangan)
values 
  ('s-1', 'Ahmad Rizky Pratama', 'VIII A', '12345', 'Laki-laki', 'Siswa aktif'),
  ('s-2', 'Siti Aminah', 'VIII A', '12346', 'Perempuan', 'Siswa aktif'),
  ('s-3', 'Rian Adiputra', 'IX C', '12347', 'Laki-laki', 'Siswa aktif'),
  ('s-4', 'Dion Saputra', 'VIII B', '12348', 'Laki-laki', 'Siswa aktif'),
  ('s-5', 'Syahnaz', 'IX E', '12349', 'Perempuan', 'Siswa aktif')
on conflict (nis) do nothing;

--------------------------------------------------------------------------------
-- Seeding Tabel: agenda_kerja_bk
--------------------------------------------------------------------------------
insert into public.agenda_kerja_bk (id, hari, tanggal, bulan, tahun, waktu, uraian_kegiatan, sasaran, link_foto_kegiatan, keterangan)
values 
  ('ag-1', 'Senin', '2026-08-03', 'Agustus', '2026', '07:30 - 08:30 WIB', 'Layanan Bimbingan Klasikal: Pengenalan Lingkungan Sekolah & Etika Pergaulan SMP', 'Siswa Kelas VII A & VII B', 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800', 'Terlaksana dengan lancar, siswa antusias mengikuti diskusi.'),
  ('ag-2', 'Selasa', '2026-08-04', 'Agustus', '2026', '09:00 - 10:30 WIB', 'Konseling Individual: Pendampingan Kesulitan Belajar dan Kedisiplinan Siswa', 'Siswa Kelas VIII C (A.n. Budi)', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800', 'Dibuatkan kontrak perilaku dan perlu tindak lanjut minggu depan.')
on conflict (id) do nothing;

--------------------------------------------------------------------------------
-- Seeding Tabel: undangan_orang_tua
--------------------------------------------------------------------------------
insert into public.undangan_orang_tua (id, hari, tanggal, bulan, tahun, waktu, kelas, nama_siswa, nama_orang_tua, pekerjaan_orang_tua, alamat, perihal_undangan, uraian_permasalahan, tindak_lanjut, link_foto_kegiatan, keterangan, nomor_surat, tanggal_surat, tempat_surat, semester, nama_guru_bk, nip_guru_bk, nama_kepala_sekolah, nip_kepala_sekolah)
values 
  ('und-1', 'Rabu', '2026-08-05', 'Agustus', '2026', '08:30 WIB', 'VIII A', 'Ahmad Rizky Pratama', 'Bapak Santoso', 'Wiraswasta', 'Jl. Pahlawan No. 45, Pasuruan', 'Konsultasi Perkembangan Belajar & Kedisiplinan Siswa', 'Siswa sering terlambat masuk sekolah lebih dari 3 kali dalam seminggu dan nilai akademik menurun.', 'Musyawarah bersama orang tua, penyusunan komitmen belajar rumah, dan pemantauan harian oleh guru BK.', 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800', 'Orang tua hadir tepat waktu dan menyepakati komitmen pendampingan.', '001/BK-SMPN7/VIII/2026', '5 Agustus 2026', 'Pasuruan', 'Semester Ganjil 2026/2027', 'WIWIK ISMIATI, S.Pd', '19831116 200904 2 003', 'Drs. H. AGUNG ARDI TIGO', '19621212 198712 1 002')
on conflict (id) do nothing;

--------------------------------------------------------------------------------
-- Seeding Tabel: home_visit_bk
--------------------------------------------------------------------------------
insert into public.home_visit_bk (id, hari, tanggal, bulan, tahun, waktu, kelas, nama_siswa, nama_orang_tua, pekerjaan_orang_tua, alamat, perihal_home_visit, uraian_permasalahan, tindak_lanjut, link_foto_kegiatan, keterangan, semester_laporan, bidang_layanan, topik_permasalahan, fungsi_layanan, pihak_terlibat, tujuan_kegiatan, gambaran_ringkas_masalah, alamat_kunjungan, hari_tanggal_lama_kunjungan, anggota_keluarga_dikunjungi, rencana_evaluasi, catatan_khusus, nama_guru_bk, nip_guru_bk, nama_kepala_sekolah, nip_kepala_sekolah, tanggal_surat, tempat_surat)
values 
  ('hv-1', 'Kamis', '2026-08-06', 'Agustus', '2026', '09:00 WIB', 'IX C', 'Rian Adiputra', 'Bapak Hartono', 'Pedagang', 'Jl. Bugul Kidul No. 12, Pasuruan', 'Kunjungan Rumah Terkait Presensi & Pendampingan Siswa', 'Siswa tidak masuk sekolah tanpa keterangan selama 4 hari berturut-turut.', 'Kunjungan rumah langsung bersama Guru BK & Wali Kelas. Orang tua siap mendampingi jam belajar malam dan memastikan presensi sekolah.', 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800', 'Kunjungan rumah terlaksana baik, orang tua kooperatif.', 'Semester Ganjil 2026/2027', 'Pribadi-Sosial', 'Presensi Rendah', 'Pemahaman dan Pengetasan', 'Wali Kelas, Orang Tua, Guru BK', 'Mencari tahu penyebab siswa tidak masuk sekolah 4 hari berturut-turut', 'Siswa bermain game sampai pagi sehingga kesiangan', 'Jl. Bugul Kidul No. 12, Pasuruan', 'Kamis, 6 Agustus 2026 / 1 Jam', 'Bapak Hartono & Ibu', 'Pemantauan presensi harian di sekolah selama 2 minggu', 'Siswa bersedia bangun pagi', 'WIWIK ISMIATI, S.Pd', '19831116 200904 2 003', 'Drs. H. AGUNG ARDI TIGO', '19621212 198712 1 002', '6 Agustus 2026', 'Pasuruan')
on conflict (id) do nothing;

--------------------------------------------------------------------------------
-- Seeding Tabel: rekam_permasalahan_siswa
--------------------------------------------------------------------------------
insert into public.rekam_permasalahan_siswa (id, hari, tanggal, bulan, tahun, waktu, kelas, nama_siswa, nama_orang_tua, pekerjaan_orang_tua, alamat, ringkasan_uraian_permasalahan, upaya_konselor_walikelas, hasil_dan_kesimpulan, link_foto_kegiatan, keterangan, nama_guru_bk, nip_guru_bk, nama_kepala_sekolah, nip_kepala_sekolah, tanggal_surat, tempat_surat)
values 
  ('rp-1', 'Kamis', '2026-08-06', 'Agustus', '2026', '08:00 WIB', 'VIII B', 'Dion Saputra', 'Bapak Mulyono', 'Karyawan Swasta', 'Jl. Panglima Sudirman No. 88, Pasuruan', 'Siswa mengalami penurunan motivasi belajar dan beberapa kali tidak mengumpulkan tugas mata pelajaran Matematika & IPA.', 'Konseling individual oleh Guru BK, diskusi intensif dengan Wali Kelas VIII B, serta pemanggilan orang tua untuk koordinasi jam belajar rumah.', 'Siswa berkomitmen membuat jadwal belajar mandiri di rumah dan wali kelas serta orang tua melakukan pemantauan berkala. Hasil evaluasi awal menunjukkan respons positif.', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800', 'Proses pendampingan berjalan lancar, dijadwalkan evaluasi lanjutan bulan depan.', 'WIWIK ISMIATI, S.Pd', '19831116 200904 2 003', 'Drs. H. AGUNG ARDI TIGO', '19621212 198712 1 002', '6 Agustus 2026', 'Pasuruan')
on conflict (id) do nothing;

--------------------------------------------------------------------------------
-- Seeding Tabel: rencana_konseling_individu
--------------------------------------------------------------------------------
insert into public.rencana_konseling_individu (id, hari, tanggal, bulan, tahun, waktu, kelas, nama_siswa, topik_permasalahan, media_yang_diperlukan, ringkasan_uraian_permasalahan, pendekatan_dan_teknik_konseling, hasil_yang_dicapai, link_foto_kegiatan, keterangan, nama_guru_bk, nip_guru_bk, nama_kepala_sekolah, nip_kepala_sekolah)
values 
  ('ki-1', 'Kamis', '2026-08-06', 'Agustus', '2026', '08:30 WIB', 'VIII A', 'Ahmad Rizky Pratama', 'Kesulitan Pengelolaan Waktu Belajar dan Kecanduan Game Online', 'Format Jadwal Harian, Lembar Kontrak Perilaku (Behavioral Contract)', 'Siswa sering tidur larut malam karena bermain game online sehingga sering mengantuk di kelas dan prestasi belajar menurun.', 'Pendekatan Behavioral dengan Teknik Kontrak Perilaku (Behavioral Contracting) & Manajemen Diri (Self Management)', 'Siswa menyepakati jadwal batasan bermain game maksimal 1 jam per hari dan menyusun target belajar harian.', 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800', 'Siswa kooperatif, akan dilakukan pemantauan berkala minggu depan.', 'WIWIK ISMIATI, S.Pd', '19831116 200904 2 003', 'Drs. H. AGUNG ARDI TIGO', '19621212 198712 1 002')
on conflict (id) do nothing;

--------------------------------------------------------------------------------
-- Seeding Tabel: rencana_konseling_kelompok
--------------------------------------------------------------------------------
insert into public.rencana_konseling_kelompok (id, hari, tanggal, bulan, tahun, waktu, kelas, nama_siswa, topik_permasalahan, media_yang_diperlukan, ringkasan_uraian_permasalahan, pendekatan_dan_teknik_konseling, hasil_yang_dicapai, link_foto_kegiatan, keterangan, nama_guru_bk, nip_guru_bk, nama_kepala_sekolah, nip_kepala_sekolah)
values 
  ('kk-1', 'Jumat', '2026-08-07', 'Agustus', '2026', '09:00 WIB', 'VII C', '1. Budi Santoso, 2. Citra Dewi, 3. Eko Prasetyo, 4. Farhan Maulana', 'Peningkatan Sikap Asertif dan Kedisiplinan Kehadiran Sekolah', 'Kartu Peran (Role Play Cards), Modul Sikap Asertif, Flipchart', 'Anggota kelompok memiliki kecenderungan kurang disiplin masuk kelas tepat waktu dan mudah terpengaruh ajakan membolos.', 'Pendekatan Kelompok dengan Teknik Simulation Game / Role Playing & Diskusi Kelompok Interaktif', 'Anggota kelompok menyadari dampak perilaku kurang disiplin, saling mendukung untuk mengingatkan kehadiran, dan melatih komunikasi asertif.', 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800', 'Dinamika kelompok berjalan aktif, direncanakan sesi tindak lanjut 2 minggu ke depan.', 'WIWIK ISMIATI, S.Pd', '19831116 200904 2 003', 'Drs. H. AGUNG ARDI TIGO', '19621212 198712 1 002')
on conflict (id) do nothing;

--------------------------------------------------------------------------------
-- Seeding Tabel: surat_pernyataan_siswa
--------------------------------------------------------------------------------
insert into public.surat_pernyataan_siswa (id, jenis_sp, nama_siswa, kelas, nama_orang_tua, pekerjaan_orang_tua, alamat_orang_tua, hubungan_keluarga, peraturan_diketahui, alasan_pengunduran, tanggal_surat, tempat_surat, keterangan, nama_guru_bk, nip_guru_bk, nama_kepala_sekolah, nip_kepala_sekolah)
values 
  ('sp-1', 'SP_1', 'Ahmad Rizky Pratama', 'VIII A', 'Bapak Santoso', 'Wiraswasta', 'Jl. Pahlawan No. 45, Pasuruan', 'Orang Tua / Wali', '1. Hadir di sekolah Tepat Waktu\n2. Tidak Absen lagi mulai terhitung Surat Perjanjian ini dibuat\n3. Mengerjakan semua Tugas tertulis /praktek dari Bapak /Ibu Guru Mata Pelajaran yang belum Tuntas', '', '2026-08-06', 'Pasuruan', 'Penerbitan Surat Peringatan 1 (SP 1) Pembinaan Kedisiplinan Siswa.', 'WIWIK ISMIATI, S.Pd', '19831116 200904 2 003', 'Drs. H. AGUNG ARDI TIGO', '19621212 198712 1 002')
on conflict (id) do nothing;

--------------------------------------------------------------------------------
-- Seeding Tabel: konferensi_kasus_siswa
--------------------------------------------------------------------------------
insert into public.konferensi_kasus_siswa (id, nama_konseli, kelas_ta, jenis_masalah, hari_tgl_jam, pemandu_konferensi, pemandu_nama, pemandu_jabatan, data_ingin_diperoleh, uraian_kegiatan_inti, data_diperoleh_simpulan, keterpenuhan_kebutuhan_data, rujukan_pelayanan, rapat_nama_sekolah, rapat_alamat, rapat_tempat, rapat_ketua, rapat_jumlah_hadir, rapat_dimulai_pukul, rapat_diakhiri_pukul, rapat_hasil_pertemuan, daftar_hadir_peserta_singkat, daftar_hadir_rows, tanggal_surat, tempat_surat, nama_guru_bk, nip_guru_bk, nama_kepala_sekolah, nip_kepala_sekolah, keterangan)
values 
  ('kkk-1', 'Syahnaz (IXE)', '9E / 2016-2017', 'Berkelahi karena salah paham', 'Kamis, 8 September 2016 Jam 10.30 wib', 'Konselor Sekolah', 'Wiwik Ismiati, S.Pd', 'Konselor', 'Identifikasi permasalahan siswa', 'Untuk mengetahui tentang kejadian yang sebenarnya dari siswa yang terlibat permasalahan tersebut di sekolah, baik dari pihak sekolah dengan siswa yang berseteru. Dan mencari solusi yang terbaik diantara siswa dengan teman-temannya.', 'Dari informasi yang terkumpul bahwa Syahnaz terlibat perseteruan karena membela sahabatnya yaitu Aminah. Karena membela sahabatnya maka Syahnaz yang di bully oleh anak-anak kelas 7C. Karena merasa tersinggung dengan perlakuan siswa kelas 7C maka Syahnaz tidak terima dan terjadi perkelahian sampai akan melempar batu. Ketika mereka berseteru dan ditemukan penyelesaiannya maka persoalan bisa dengan mudah terselesaikan.', 'terpenuhi', 'Guru Mata Pelajaran, Wali Kelas, Konselor Sekolah', 'UPT SMPN 7 PASURUAN', 'Jl. Simpang Slamet Riadi No.2 Sebani Gadingrejo', 'UPT SMPN 7 PASURUAN', 'Konselor', '9 orang', '10.30 WIB', '11.00 WIB', 'A. Dari identifikasi permasalahan siswa, didapatkan permasalahan tersebut timbul karena anak kelas 7C yang bermasalah sering mengolok-olok Aminah.\nB. Dari peristiwa tersebut temannya Aminah tidak terima dan terjadi pertengkaran/adu mulut dengan Syahnaz.\nC. Syahnaz yang membela Aminah akhirnya kena tampar oleh M. Badru dan tidak terima sehingga membawa batu bata mau dilemparkan.\nD. Setelah terjadi konferensi kasus, maka masing-masing pihak mau menerima keputusan bersama dan saling memaafkan. Akhirnya permasalahan selesai dengan saling memaafkan.', '1. Konselor, 2. M. Badru T (VIIC), 3. M. Usman (VIIC), 4. M. Amyak (VIIC)', '[{"no":1,"nama":"Ibu Citra Dwi W","jabatan":"Konselor","kelas":"-","asal_sekolah":"UPT SMPN 7 Pas","ttd":"Ada"},{"no":2,"nama":"Ibu Wiwik Ismiati","jabatan":"Konselor","kelas":"-","asal_sekolah":"UPT SMPN 7 Pas","ttd":"Ada"}]', '2026-08-06', 'Pasuruan', 'WIWIK ISMIATI, S.Pd', '19831116 200904 2 003', 'Drs. H. AGUNG ARDI TIGO', '19621212 198712 1 002', 'Konferensi kasus perselisihan kelas 9E dengan kelas 7C.')
on conflict (id) do nothing;

--------------------------------------------------------------------------------
-- Seeding Tabel: siswa_ats_bk
--------------------------------------------------------------------------------
insert into public.siswa_ats_bk (id, hari, tanggal, tahun_ajaran, waktu, nama_siswa, kategori_ats, kelas, alamat, alasan_ats, alasan_manual, foto_kunjungan_1, foto_bukti_fisik_2, tempat_laporan, tanggal_laporan, nama_guru_kunjungan, nip_guru_kunjungan, nama_kepala_sekolah, nip_kepala_sekolah, keterangan)
values 
  ('ats-1', 'Senin', '2026-08-10', '2025/2026', '09:00 WIB', 'Rian Adiputra', 'DO (Drop Out)', 'IX C', 'Jl. Bugul Kidul No. 12, Pasuruan', 'Ekonomi', 'Anak harus bekerja membantu keuangan keluarga berjualan keliling.', 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800', 'Pasuruan', '2026-08-10', 'WIWIK ISMIATI, S.Pd', '19831116 200904 2 003', 'NUR FADILAH, S.Pd,. M.Pd', '19860410 201001 2 030', 'Kunjungan ATS pertama terlaksana dengan baik.')
on conflict (id) do nothing;


-- ==============================================================================
-- MEMBUAT INDEX UNTUK KECEPATAN PENCARIAN (PERFORMANCE INDEXES)
-- ==============================================================================
create index if not exists idx_siswa_kelas on public.siswa_bk(kelas);
create index if not exists idx_agenda_tanggal on public.agenda_kerja_bk(tanggal);
create index if not exists idx_undangan_siswa on public.undangan_orang_tua(nama_siswa);
create index if not exists idx_home_visit_siswa on public.home_visit_bk(nama_siswa);
create index if not exists idx_rekam_masalah_siswa on public.rekam_permasalahan_siswa(nama_siswa);
create index if not exists idx_konseling_ind_siswa on public.rencana_konseling_individu(nama_siswa);
create index if not exists idx_konseling_kel_kelas on public.rencana_konseling_kelompok(kelas);
create index if not exists idx_sp_siswa on public.surat_pernyataan_siswa(nama_siswa);
create index if not exists idx_konferensi_konseli on public.konferensi_kasus_siswa(nama_konseli);
create index if not exists idx_siswa_ats_nama on public.siswa_ats_bk(nama_siswa);

-- SCRIPT SELESAI
-- ==============================================================================
