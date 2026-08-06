import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AgendaKerja, UndanganOrangTua, HomeVisit, SupabaseConfig } from '../types';

const STORAGE_KEY_CONFIG = 'bk_smpn7_supabase_config';
const STORAGE_KEY_DATA = 'bk_smpn7_agenda_data_local';
const STORAGE_KEY_UNDANGAN = 'bk_smpn7_undangan_data_local';
const STORAGE_KEY_HOME_VISIT = 'bk_smpn7_home_visit_data_local';

export const DEFAULT_TABLE_NAME = 'agenda_kerja_bk';
export const DEFAULT_UNDANGAN_TABLE_NAME = 'undangan_orang_tua';
export const DEFAULT_HOME_VISIT_TABLE_NAME = 'home_visit_bk';

// Get active config from localStorage or import.meta.env
export function getSavedSupabaseConfig(): SupabaseConfig {
  const localConfigStr = localStorage.getItem(STORAGE_KEY_CONFIG);
  if (localConfigStr) {
    try {
      const parsed = JSON.parse(localConfigStr);
      if (parsed.url && parsed.anonKey) {
        return {
          url: parsed.url,
          anonKey: parsed.anonKey,
          tableName: parsed.tableName || DEFAULT_TABLE_NAME,
        };
      }
    } catch {
      // ignore JSON parse error
    }
  }

  const env = (import.meta as unknown as { env?: Record<string, string> }).env || {};
  const envUrl = env.VITE_SUPABASE_URL || '';
  const envKey = env.VITE_SUPABASE_ANON_KEY || '';

  return {
    url: envUrl,
    anonKey: envKey,
    tableName: DEFAULT_TABLE_NAME,
  };
}

export function saveSupabaseConfigToStorage(config: SupabaseConfig) {
  localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
}

let cachedClient: { key: string; client: SupabaseClient } | null = null;

export function getSupabaseClient(config?: SupabaseConfig): SupabaseClient | null {
  const activeConfig = config || getSavedSupabaseConfig();
  if (!activeConfig.url || !activeConfig.anonKey) {
    return null;
  }

  const clientKey = `${activeConfig.url}_${activeConfig.anonKey}`;
  if (cachedClient && cachedClient.key === clientKey) {
    return cachedClient.client;
  }

  try {
    const client = createClient(activeConfig.url, activeConfig.anonKey);
    cachedClient = { key: clientKey, client };
    return client;
  } catch (err) {
    console.error('Gagal inisialisasi Supabase client:', err);
    return null;
  }
}

// Local Storage Helpers - Agenda BK
export function getLocalAgendaList(): AgendaKerja[] {
  const str = localStorage.getItem(STORAGE_KEY_DATA);
  if (!str) {
    // Seed initial demo data for SMPN 7 Pasuruan if empty
    const demoData: AgendaKerja[] = [
      {
        id: 'demo-1',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        hari: 'Senin',
        tanggal: '2026-08-03',
        bulan: 'Agustus',
        tahun: '2026',
        waktu: '07:30 - 08:30 WIB',
        uraian_kegiatan: 'Layanan Bimbingan Klasikal: Pengenalan Lingkungan Sekolah & Etika Pergaulan SMP',
        sasaran: 'Siswa Kelas VII A & VII B',
        link_foto_kegiatan: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800',
        keterangan: 'Terlaksana dengan lancar, siswa antusias mengikuti diskusi.',
      },
      {
        id: 'demo-2',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString(),
        hari: 'Selasa',
        tanggal: '2026-08-04',
        bulan: 'Agustus',
        tahun: '2026',
        waktu: '09:00 - 10:30 WIB',
        uraian_kegiatan: 'Konseling Individual: Pendampingan Kesulitan Belajar dan Kedisiplinan Siswa',
        sasaran: 'Siswa Kelas VIII C (A.n. Budi)',
        link_foto_kegiatan: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800',
        keterangan: 'Dibuatkan kontrak perilaku dan perlu tindak lanjut minggu depan.',
      },
    ];
    localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(demoData));
    return demoData;
  }
  try {
    return JSON.parse(str);
  } catch {
    return [];
  }
}

export function saveLocalAgendaList(data: AgendaKerja[]) {
  localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(data));
}

// Local Storage Helpers - Undangan Orang Tua
export function getLocalUndanganList(): UndanganOrangTua[] {
  const str = localStorage.getItem(STORAGE_KEY_UNDANGAN);
  if (!str) {
    const demoData: UndanganOrangTua[] = [
      {
        id: 'demo-u1',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString(),
        hari: 'Rabu',
        tanggal: '2026-08-05',
        bulan: 'Agustus',
        tahun: '2026',
        waktu: '08:30 WIB',
        kelas: 'VIII A',
        nama_siswa: 'Ahmad Rizky Pratama',
        nama_orang_tua: 'Bapak Santoso',
        pekerjaan_orang_tua: 'Wiraswasta',
        alamat: 'Jl. Pahlawan No. 45, Pasuruan',
        perihal_undangan: 'Konsultasi Perkembangan Belajar & Kedisiplinan Siswa',
        uraian_permasalahan: 'Siswa sering terlambat masuk sekolah lebih dari 3 kali dalam seminggu dan nilai akademik menurun.',
        tindak_lanjut: 'Musyawarah bersama orang tua, penyusunan komitmen belajar rumah, dan pemantauan harian oleh guru BK.',
        link_foto_kegiatan: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800',
        keterangan: 'Orang tua hadir tepat waktu dan menyepakati komitmen pendampingan.',
      }
    ];
    localStorage.setItem(STORAGE_KEY_UNDANGAN, JSON.stringify(demoData));
    return demoData;
  }
  try {
    return JSON.parse(str);
  } catch {
    return [];
  }
}

export function saveLocalUndanganList(data: UndanganOrangTua[]) {
  localStorage.setItem(STORAGE_KEY_UNDANGAN, JSON.stringify(data));
}

// Unified API Functions - Agenda BK
export async function fetchAllAgenda(): Promise<{ data: AgendaKerja[]; isFromSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (client) {
    try {
      const { data, error } = await client
        .from(config.tableName)
        .select('*')
        .order('tanggal', { ascending: false });

      if (!error && data) {
        saveLocalAgendaList(data as AgendaKerja[]);
        return { data: data as AgendaKerja[], isFromSupabase: true };
      } else if (error) {
        console.warn('Supabase fetch agenda query error:', error.message);
        return {
          data: getLocalAgendaList(),
          isFromSupabase: false,
          error: `Supabase: ${error.message}. Menggunakan penyimpanan lokal.`,
        };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Koneksi gagal';
      return { data: getLocalAgendaList(), isFromSupabase: false, error: msg };
    }
  }

  return { data: getLocalAgendaList(), isFromSupabase: false };
}

export async function saveOrUpdateAgenda(
  agenda: Partial<AgendaKerja> & Omit<AgendaKerja, 'id'>
): Promise<{ success: boolean; data?: AgendaKerja; isSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  const now = new Date().toISOString();
  const idToUse = agenda.id || (crypto.randomUUID ? crypto.randomUUID() : `ag-${Date.now()}`);

  const payload: AgendaKerja = {
    ...agenda,
    id: idToUse,
    created_at: agenda.created_at || now,
    updated_at: now,
  };

  if (client) {
    try {
      const { data, error } = await client
        .from(config.tableName)
        .upsert(payload, { onConflict: 'id' })
        .select()
        .single();

      if (!error && data) {
        const currentLocal = getLocalAgendaList();
        const existingIdx = currentLocal.findIndex((item) => item.id === payload.id);
        if (existingIdx >= 0) {
          currentLocal[existingIdx] = data as AgendaKerja;
        } else {
          currentLocal.unshift(data as AgendaKerja);
        }
        saveLocalAgendaList(currentLocal);

        return { success: true, data: data as AgendaKerja, isSupabase: true };
      } else if (error) {
        console.warn('Supabase save agenda error:', error.message);
        saveToLocalAgendaFallback(payload);
        return {
          success: true,
          data: payload,
          isSupabase: false,
          error: `Gagal ke Supabase (${error.message}). Disimpan ke penyimpanan lokal.`,
        };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal terhubung Supabase';
      saveToLocalAgendaFallback(payload);
      return {
        success: true,
        data: payload,
        isSupabase: false,
        error: `${msg}. Disimpan di penyimpanan lokal.`,
      };
    }
  }

  saveToLocalAgendaFallback(payload);
  return { success: true, data: payload, isSupabase: false };
}

function saveToLocalAgendaFallback(item: AgendaKerja) {
  const current = getLocalAgendaList();
  const existingIdx = current.findIndex((i) => i.id === item.id);
  if (existingIdx >= 0) {
    current[existingIdx] = item;
  } else {
    current.unshift(item);
  }
  saveLocalAgendaList(current);
}

export async function deleteAgendaItem(id: string): Promise<{ success: boolean; isSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (client) {
    try {
      const { error } = await client.from(config.tableName).delete().eq('id', id);
      if (!error) {
        const current = getLocalAgendaList().filter((i) => i.id !== id);
        saveLocalAgendaList(current);
        return { success: true, isSupabase: true };
      }
    } catch {
      // ignore
    }
  }

  const current = getLocalAgendaList().filter((i) => i.id !== id);
  saveLocalAgendaList(current);
  return { success: true, isSupabase: false };
}

// Unified API Functions - Undangan Orang Tua Siswa
export async function fetchAllUndangan(): Promise<{ data: UndanganOrangTua[]; isFromSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (client) {
    try {
      const { data, error } = await client
        .from(DEFAULT_UNDANGAN_TABLE_NAME)
        .select('*')
        .order('tanggal', { ascending: false });

      if (!error && data) {
        saveLocalUndanganList(data as UndanganOrangTua[]);
        return { data: data as UndanganOrangTua[], isFromSupabase: true };
      } else if (error) {
        console.warn('Supabase fetch undangan query error:', error.message);
        return {
          data: getLocalUndanganList(),
          isFromSupabase: false,
          error: `Supabase: ${error.message}. Menggunakan penyimpanan lokal.`,
        };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Koneksi gagal';
      return { data: getLocalUndanganList(), isFromSupabase: false, error: msg };
    }
  }

  return { data: getLocalUndanganList(), isFromSupabase: false };
}

export async function saveOrUpdateUndangan(
  undangan: Partial<UndanganOrangTua> & Omit<UndanganOrangTua, 'id'>
): Promise<{ success: boolean; data?: UndanganOrangTua; isSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  const now = new Date().toISOString();
  const idToUse = undangan.id || (crypto.randomUUID ? crypto.randomUUID() : `und-${Date.now()}`);

  const payload: UndanganOrangTua = {
    ...undangan,
    id: idToUse,
    created_at: undangan.created_at || now,
    updated_at: now,
  };

  if (client) {
    try {
      const { data, error } = await client
        .from(DEFAULT_UNDANGAN_TABLE_NAME)
        .upsert(payload, { onConflict: 'id' })
        .select()
        .single();

      if (!error && data) {
        const currentLocal = getLocalUndanganList();
        const existingIdx = currentLocal.findIndex((item) => item.id === payload.id);
        if (existingIdx >= 0) {
          currentLocal[existingIdx] = data as UndanganOrangTua;
        } else {
          currentLocal.unshift(data as UndanganOrangTua);
        }
        saveLocalUndanganList(currentLocal);

        return { success: true, data: data as UndanganOrangTua, isSupabase: true };
      } else if (error) {
        console.warn('Supabase save undangan error:', error.message);
        saveToLocalUndanganFallback(payload);
        return {
          success: true,
          data: payload,
          isSupabase: false,
          error: `Gagal ke Supabase (${error.message}). Disimpan ke penyimpanan lokal.`,
        };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal terhubung Supabase';
      saveToLocalUndanganFallback(payload);
      return {
        success: true,
        data: payload,
        isSupabase: false,
        error: `${msg}. Disimpan di penyimpanan lokal.`,
      };
    }
  }

  saveToLocalUndanganFallback(payload);
  return { success: true, data: payload, isSupabase: false };
}

function saveToLocalUndanganFallback(item: UndanganOrangTua) {
  const current = getLocalUndanganList();
  const existingIdx = current.findIndex((i) => i.id === item.id);
  if (existingIdx >= 0) {
    current[existingIdx] = item;
  } else {
    current.unshift(item);
  }
  saveLocalUndanganList(current);
}

export async function deleteUndanganItem(id: string): Promise<{ success: boolean; isSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (client) {
    try {
      const { error } = await client.from(DEFAULT_UNDANGAN_TABLE_NAME).delete().eq('id', id);
      if (!error) {
        const current = getLocalUndanganList().filter((i) => i.id !== id);
        saveLocalUndanganList(current);
        return { success: true, isSupabase: true };
      }
    } catch {
      // ignore
    }
  }

  const current = getLocalUndanganList().filter((i) => i.id !== id);
  saveLocalUndanganList(current);
  return { success: true, isSupabase: false };
}

// Local Storage Helpers - Home Visit / Kunjungan Rumah
export function getLocalHomeVisitList(): HomeVisit[] {
  const str = localStorage.getItem(STORAGE_KEY_HOME_VISIT);
  if (!str) {
    const demoData: HomeVisit[] = [
      {
        id: 'demo-hv1',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString(),
        hari: 'Kamis',
        tanggal: '2026-08-06',
        bulan: 'Agustus',
        tahun: '2026',
        waktu: '09:00 WIB',
        kelas: 'IX C',
        nama_siswa: 'Rian Adiputra',
        nama_orang_tua: 'Bapak Hartono',
        pekerjaan_orang_tua: 'Pedagang',
        alamat: 'Jl. Bugul Kidul No. 12, Pasuruan',
        perihal_home_visit: 'Kunjungan Rumah Terkait Presensi & Pendampingan Siswa',
        uraian_permasalahan: 'Siswa tidak masuk sekolah tanpa keterangan selama 4 hari berturut-turut.',
        tindak_lanjut: 'Kunjungan rumah langsung bersama Guru BK & Wali Kelas. Orang tua siap mendampingi jam belajar malam dan memastikan presensi sekolah.',
        link_foto_kegiatan: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800',
        keterangan: 'Kunjungan rumah terlaksana baik, orang tua kooperatif.',
      }
    ];
    localStorage.setItem(STORAGE_KEY_HOME_VISIT, JSON.stringify(demoData));
    return demoData;
  }
  try {
    return JSON.parse(str);
  } catch {
    return [];
  }
}

export function saveLocalHomeVisitList(data: HomeVisit[]) {
  localStorage.setItem(STORAGE_KEY_HOME_VISIT, JSON.stringify(data));
}

// Unified API Functions - Home Visit / Kunjungan Rumah
export async function fetchAllHomeVisit(): Promise<{ data: HomeVisit[]; isFromSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (client) {
    try {
      const { data, error } = await client
        .from(DEFAULT_HOME_VISIT_TABLE_NAME)
        .select('*')
        .order('tanggal', { ascending: false });

      if (!error && data) {
        saveLocalHomeVisitList(data as HomeVisit[]);
        return { data: data as HomeVisit[], isFromSupabase: true };
      } else if (error) {
        console.warn('Supabase fetch home visit query error:', error.message);
        return {
          data: getLocalHomeVisitList(),
          isFromSupabase: false,
          error: `Supabase: ${error.message}. Menggunakan penyimpanan lokal.`,
        };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Koneksi gagal';
      return { data: getLocalHomeVisitList(), isFromSupabase: false, error: msg };
    }
  }

  return { data: getLocalHomeVisitList(), isFromSupabase: false };
}

export async function saveOrUpdateHomeVisit(
  homeVisit: Partial<HomeVisit> & Omit<HomeVisit, 'id'>
): Promise<{ success: boolean; data?: HomeVisit; isSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  const now = new Date().toISOString();
  const idToUse = homeVisit.id || (crypto.randomUUID ? crypto.randomUUID() : `hv-${Date.now()}`);

  const payload: HomeVisit = {
    ...homeVisit,
    id: idToUse,
    created_at: homeVisit.created_at || now,
    updated_at: now,
  };

  if (client) {
    try {
      const { data, error } = await client
        .from(DEFAULT_HOME_VISIT_TABLE_NAME)
        .upsert(payload, { onConflict: 'id' })
        .select()
        .single();

      if (!error && data) {
        const currentLocal = getLocalHomeVisitList();
        const existingIdx = currentLocal.findIndex((item) => item.id === payload.id);
        if (existingIdx >= 0) {
          currentLocal[existingIdx] = data as HomeVisit;
        } else {
          currentLocal.unshift(data as HomeVisit);
        }
        saveLocalHomeVisitList(currentLocal);

        return { success: true, data: data as HomeVisit, isSupabase: true };
      } else if (error) {
        console.warn('Supabase save home visit error:', error.message);
        saveToLocalHomeVisitFallback(payload);
        return {
          success: true,
          data: payload,
          isSupabase: false,
          error: `Gagal ke Supabase (${error.message}). Disimpan ke penyimpanan lokal.`,
        };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal terhubung Supabase';
      saveToLocalHomeVisitFallback(payload);
      return {
        success: true,
        data: payload,
        isSupabase: false,
        error: `${msg}. Disimpan di penyimpanan lokal.`,
      };
    }
  }

  saveToLocalHomeVisitFallback(payload);
  return { success: true, data: payload, isSupabase: false };
}

function saveToLocalHomeVisitFallback(item: HomeVisit) {
  const current = getLocalHomeVisitList();
  const existingIdx = current.findIndex((i) => i.id === item.id);
  if (existingIdx >= 0) {
    current[existingIdx] = item;
  } else {
    current.unshift(item);
  }
  saveLocalHomeVisitList(current);
}

export async function deleteHomeVisitItem(id: string): Promise<{ success: boolean; isSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (client) {
    try {
      const { error } = await client.from(DEFAULT_HOME_VISIT_TABLE_NAME).delete().eq('id', id);
      if (!error) {
        const current = getLocalHomeVisitList().filter((i) => i.id !== id);
        saveLocalHomeVisitList(current);
        return { success: true, isSupabase: true };
      }
    } catch {
      // ignore
    }
  }

  const current = getLocalHomeVisitList().filter((i) => i.id !== id);
  saveLocalHomeVisitList(current);
  return { success: true, isSupabase: false };
}

// SQL Script generator for user setup in Supabase SQL Editor
export function getSupabaseSqlSetup(
  tableName: string = DEFAULT_TABLE_NAME,
  undanganTableName: string = DEFAULT_UNDANGAN_TABLE_NAME,
  homeVisitTableName: string = DEFAULT_HOME_VISIT_TABLE_NAME
): string {
  return `-- SQL Script Setup Database Supabase untuk ADMINISTRASI BK SMPN 7 Pasuruan
-- Jalankan seluruh script ini di Supabase Studio -> SQL Editor -> Run

--------------------------------------------------------------------------------
-- 1. TABEL A: AGENDA KERJA BK (${tableName})
--------------------------------------------------------------------------------
create table if not exists public.${tableName} (
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

alter table public.${tableName} enable row level security;

create policy "Akses Baca Publik Agenda BK" on public.${tableName} for select using (true);
create policy "Akses Tambah Publik Agenda BK" on public.${tableName} for insert with check (true);
create policy "Akses Update Publik Agenda BK" on public.${tableName} for update using (true);
create policy "Akses Hapus Publik Agenda BK" on public.${tableName} for delete using (true);

--------------------------------------------------------------------------------
-- 2. TABEL B: UNDANGAN ORANG TUA SISWA (${undanganTableName})
--------------------------------------------------------------------------------
create table if not exists public.${undanganTableName} (
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
  perihal_undangan text not null,
  uraian_permasalahan text default '',
  tindak_lanjut text default '',
  link_foto_kegiatan text default '',
  keterangan text default ''
);

alter table public.${undanganTableName} enable row level security;

create policy "Akses Baca Publik Undangan Ortu" on public.${undanganTableName} for select using (true);
create policy "Akses Tambah Publik Undangan Ortu" on public.${undanganTableName} for insert with check (true);
create policy "Akses Update Publik Undangan Ortu" on public.${undanganTableName} for update using (true);
create policy "Akses Hapus Publik Undangan Ortu" on public.${undanganTableName} for delete using (true);

--------------------------------------------------------------------------------
-- 3. TABEL C: HOME VISIT / KUNJUNGAN RUMAH (${homeVisitTableName})
--------------------------------------------------------------------------------
create table if not exists public.${homeVisitTableName} (
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
  keterangan text default ''
);

alter table public.${homeVisitTableName} enable row level security;

create policy "Akses Baca Publik Home Visit" on public.${homeVisitTableName} for select using (true);
create policy "Akses Tambah Publik Home Visit" on public.${homeVisitTableName} for insert with check (true);
create policy "Akses Update Publik Home Visit" on public.${homeVisitTableName} for update using (true);
create policy "Akses Hapus Publik Home Visit" on public.${homeVisitTableName} for delete using (true);
`;
}

