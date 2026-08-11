import { getActiveGuruBK } from './guruBk';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AgendaKerja, UndanganOrangTua, HomeVisit, RekamPermasalahan, KonselingIndividu, KonselingKelompok, SuratPernyataan, SupabaseConfig, KonferensiKasus, Siswa, JurnalBK, FormJurnalBKData } from '../types';

const STORAGE_KEY_CONFIG = 'bk_smpn7_supabase_config';
const STORAGE_KEY_DATA = 'bk_smpn7_agenda_data_local';
const STORAGE_KEY_UNDANGAN = 'bk_smpn7_undangan_data_local';
const STORAGE_KEY_HOME_VISIT = 'bk_smpn7_home_visit_data_local';
const STORAGE_KEY_REKAM_PERMASALAHAN = 'bk_smpn7_rekam_permasalahan_data_local';
const STORAGE_KEY_KONSELING_INDIVIDU = 'bk_smpn7_konseling_individu_data_local';
const STORAGE_KEY_KONSELING_KELOMPOK = 'bk_smpn7_konseling_kelompok_data_local';
const STORAGE_KEY_SURAT_PERNYATAAN = 'bk_smpn7_surat_pernyataan_data_local';
const STORAGE_KEY_KONFERENSI_KASUS = 'bk_smpn7_konferensi_kasus_data_local';
const STORAGE_KEY_SISWA = 'bk_smpn7_siswa_data_local';
const STORAGE_KEY_JURNAL_BK = 'bk_smpn7_jurnal_bk_data_local';

export const DEFAULT_TABLE_NAME = 'agenda_kerja_bk';
export const DEFAULT_UNDANGAN_TABLE_NAME = 'undangan_orang_tua';
export const DEFAULT_HOME_VISIT_TABLE_NAME = 'home_visit_bk';
export const DEFAULT_REKAM_PERMASALAHAN_TABLE_NAME = 'rekam_permasalahan_siswa';
export const DEFAULT_KONSELING_INDIVIDU_TABLE_NAME = 'rencana_konseling_individu';
export const DEFAULT_KONSELING_KELOMPOK_TABLE_NAME = 'rencana_konseling_kelompok';
export const DEFAULT_SURAT_PERNYATAAN_TABLE_NAME = 'surat_pernyataan_siswa';
export const DEFAULT_KONFERENSI_KASUS_TABLE_NAME = 'konferensi_kasus_siswa';
export const DEFAULT_SISWA_TABLE_NAME = 'siswa_bk';
export const DEFAULT_JURNAL_BK_TABLE_NAME = 'jurnal_bk_siswa';
export const DEFAULT_SIGNATURES_TABLE_NAME = 'signatures_bk';

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
  const envUrl = env.VITE_SUPABASE_URL || 'https://kedffsrkxwlnynrnicek.supabase.co';
  const envKey = env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_d_FaCtLsGNP2n2PKuI-1gQ_Lc3E5DJi';

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

// Local Storage Helpers - Rekam Permasalahan Siswa
export function getLocalRekamPermasalahanList(): RekamPermasalahan[] {
  const str = localStorage.getItem(STORAGE_KEY_REKAM_PERMASALAHAN);
  if (!str) {
    const demoData: RekamPermasalahan[] = [
      {
        id: 'demo-rp1',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString(),
        hari: 'Kamis',
        tanggal: '2026-08-06',
        bulan: 'Agustus',
        tahun: '2026',
        waktu: '08:00 WIB',
        kelas: 'VIII B',
        nama_siswa: 'Dion Saputra',
        nama_orang_tua: 'Bapak Mulyono',
        pekerjaan_orang_tua: 'Karyawan Swasta',
        alamat: 'Jl. Panglima Sudirman No. 88, Pasuruan',
        ringkasan_uraian_permasalahan: 'Siswa mengalami penurunan motivasi belajar dan beberapa kali tidak mengumpulkan tugas mata pelajaran Matematika & IPA.',
        upaya_konselor_walikelas: 'Konseling individual oleh Guru BK, diskusi intensif dengan Wali Kelas VIII B, serta pemanggilan orang tua untuk koordinasi jam belajar rumah.',
        hasil_dan_kesimpulan: 'Siswa berkomitmen membuat jadwal belajar mandiri di rumah dan wali kelas serta orang tua melakukan pemantauan berkala. Hasil evaluasi awal menunjukkan respons positif.',
        link_foto_kegiatan: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800',
        keterangan: 'Proses pendampingan berjalan lancar, dijadwalkan evaluasi lanjutan bulan depan.',
      }
    ];
    localStorage.setItem(STORAGE_KEY_REKAM_PERMASALAHAN, JSON.stringify(demoData));
    return demoData;
  }
  try {
    return JSON.parse(str);
  } catch {
    return [];
  }
}

export function saveLocalRekamPermasalahanList(data: RekamPermasalahan[]) {
  localStorage.setItem(STORAGE_KEY_REKAM_PERMASALAHAN, JSON.stringify(data));
}

// Local Storage Helpers - Konseling Individu
export function getLocalKonselingIndividuList(): KonselingIndividu[] {
  const str = localStorage.getItem(STORAGE_KEY_KONSELING_INDIVIDU);
  if (!str) {
    const demoData: KonselingIndividu[] = [
      {
        id: 'demo-ki1',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString(),
        hari: 'Kamis',
        tanggal: '2026-08-06',
        bulan: 'Agustus',
        tahun: '2026',
        waktu: '08:30 WIB',
        kelas: 'VIII A',
        nama_siswa: 'Ahmad Rizky Pratama',
        topik_permasalahan: 'Kesulitan Pengelolaan Waktu Belajar dan Kecanduan Game Online',
        media_yang_diperlukan: 'Format Jadwal Harian, Lembar Kontrak Perilaku (Behavioral Contract)',
        ringkasan_uraian_permasalahan: 'Siswa sering tidur larut malam karena bermain game online sehingga sering mengantuk di kelas dan prestasi belajar menurun.',
        pendekatan_dan_teknik_konseling: 'Pendekatan Behavioral dengan Teknik Kontrak Perilaku (Behavioral Contracting) & Manajemen Diri (Self Management)',
        hasil_yang_dicapai: 'Siswa menyepakati jadwal batasan bermain game maksimal 1 jam per hari dan menyusun target belajar harian.',
        link_foto_kegiatan: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800',
        keterangan: 'Siswa kooperatif, akan dilakukan pemantauan berkala minggu depan.'
      }
    ];
    localStorage.setItem(STORAGE_KEY_KONSELING_INDIVIDU, JSON.stringify(demoData));
    return demoData;
  }
  try {
    return JSON.parse(str);
  } catch {
    return [];
  }
}

export function saveLocalKonselingIndividuList(data: KonselingIndividu[]) {
  localStorage.setItem(STORAGE_KEY_KONSELING_INDIVIDU, JSON.stringify(data));
}

// Local Storage Helpers - Konseling Kelompok
export function getLocalKonselingKelompokList(): KonselingKelompok[] {
  const str = localStorage.getItem(STORAGE_KEY_KONSELING_KELOMPOK);
  if (!str) {
    const demoData: KonselingKelompok[] = [
      {
        id: 'demo-kk1',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString(),
        hari: 'Jumat',
        tanggal: '2026-08-07',
        bulan: 'Agustus',
        tahun: '2026',
        waktu: '09:00 WIB',
        kelas: 'VII C',
        nama_siswa: '1. Budi Santoso, 2. Citra Dewi, 3. Eko Prasetyo, 4. Farhan Maulana',
        topik_permasalahan: 'Peningkatan Sikap Asertif dan Kedisiplinan Kehadiran Sekolah',
        media_yang_diperlukan: 'Kartu Peran (Role Play Cards), Modul Sikap Asertif, Flipchart',
        ringkasan_uraian_permasalahan: 'Anggota kelompok memiliki kecenderungan kurang disiplin masuk kelas tepat waktu dan mudah terpengaruh ajakan membolos.',
        pendekatan_dan_teknik_konseling: 'Pendekatan Kelompok dengan Teknik Simulation Game / Role Playing & Diskusi Kelompok Interaktif',
        hasil_yang_dicapai: 'Anggota kelompok menyadari dampak perilaku kurang disiplin, saling mendukung untuk mengingatkan kehadiran, dan melatih komunikasi asertif.',
        link_foto_kegiatan: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800',
        keterangan: 'Dinamika kelompok berjalan aktif, direncanakan sesi tindak lanjut 2 minggu ke depan.'
      }
    ];
    localStorage.setItem(STORAGE_KEY_KONSELING_KELOMPOK, JSON.stringify(demoData));
    return demoData;
  }
  try {
    return JSON.parse(str);
  } catch {
    return [];
  }
}

export function saveLocalKonselingKelompokList(data: KonselingKelompok[]) {
  localStorage.setItem(STORAGE_KEY_KONSELING_KELOMPOK, JSON.stringify(data));
}

// Unified API Functions - Rekam Permasalahan Siswa
export async function fetchAllRekamPermasalahan(): Promise<{ data: RekamPermasalahan[]; isFromSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (client) {
    try {
      const { data, error } = await client
        .from(DEFAULT_REKAM_PERMASALAHAN_TABLE_NAME)
        .select('*')
        .order('tanggal', { ascending: false });

      if (!error && data) {
        saveLocalRekamPermasalahanList(data as RekamPermasalahan[]);
        return { data: data as RekamPermasalahan[], isFromSupabase: true };
      } else if (error) {
        console.warn('Supabase fetch rekam permasalahan error:', error.message);
        return {
          data: getLocalRekamPermasalahanList(),
          isFromSupabase: false,
          error: `Supabase: ${error.message}. Menggunakan penyimpanan lokal.`,
        };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Koneksi gagal';
      return { data: getLocalRekamPermasalahanList(), isFromSupabase: false, error: msg };
    }
  }

  return { data: getLocalRekamPermasalahanList(), isFromSupabase: false };
}

export async function saveOrUpdateRekamPermasalahan(
  item: Partial<RekamPermasalahan> & Omit<RekamPermasalahan, 'id'>
): Promise<{ success: boolean; data?: RekamPermasalahan; isSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  const now = new Date().toISOString();
  const idToUse = item.id || (crypto.randomUUID ? crypto.randomUUID() : `rp-${Date.now()}`);

  const payload: RekamPermasalahan = {
    ...item,
    id: idToUse,
    created_at: item.created_at || now,
    updated_at: now,
  };

  if (client) {
    try {
      const { data, error } = await client
        .from(DEFAULT_REKAM_PERMASALAHAN_TABLE_NAME)
        .upsert(payload, { onConflict: 'id' })
        .select()
        .single();

      if (!error && data) {
        const currentLocal = getLocalRekamPermasalahanList();
        const existingIdx = currentLocal.findIndex((i) => i.id === payload.id);
        if (existingIdx >= 0) {
          currentLocal[existingIdx] = data as RekamPermasalahan;
        } else {
          currentLocal.unshift(data as RekamPermasalahan);
        }
        saveLocalRekamPermasalahanList(currentLocal);

        return { success: true, data: data as RekamPermasalahan, isSupabase: true };
      } else if (error) {
        console.warn('Supabase save rekam permasalahan error:', error.message);
        saveToLocalRekamPermasalahanFallback(payload);
        return {
          success: true,
          data: payload,
          isSupabase: false,
          error: `Gagal ke Supabase (${error.message}). Disimpan ke penyimpanan lokal.`,
        };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal terhubung Supabase';
      saveToLocalRekamPermasalahanFallback(payload);
      return {
        success: true,
        data: payload,
        isSupabase: false,
        error: `${msg}. Disimpan di penyimpanan lokal.`,
      };
    }
  }

  saveToLocalRekamPermasalahanFallback(payload);
  return { success: true, data: payload, isSupabase: false };
}

function saveToLocalRekamPermasalahanFallback(item: RekamPermasalahan) {
  const current = getLocalRekamPermasalahanList();
  const existingIdx = current.findIndex((i) => i.id === item.id);
  if (existingIdx >= 0) {
    current[existingIdx] = item;
  } else {
    current.unshift(item);
  }
  saveLocalRekamPermasalahanList(current);
}

export async function deleteRekamPermasalahanItem(id: string): Promise<{ success: boolean; isSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (client) {
    try {
      const { error } = await client.from(DEFAULT_REKAM_PERMASALAHAN_TABLE_NAME).delete().eq('id', id);
      if (!error) {
        const current = getLocalRekamPermasalahanList().filter((i) => i.id !== id);
        saveLocalRekamPermasalahanList(current);
        return { success: true, isSupabase: true };
      }
    } catch {
      // ignore
    }
  }

  const current = getLocalRekamPermasalahanList().filter((i) => i.id !== id);
  saveLocalRekamPermasalahanList(current);
  return { success: true, isSupabase: false };
}

// Unified API Functions - Konseling Individu
export async function fetchAllKonselingIndividu(): Promise<{ data: KonselingIndividu[]; isFromSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (client) {
    try {
      const { data, error } = await client
        .from(DEFAULT_KONSELING_INDIVIDU_TABLE_NAME)
        .select('*')
        .order('tanggal', { ascending: false });

      if (!error && data) {
        saveLocalKonselingIndividuList(data as KonselingIndividu[]);
        return { data: data as KonselingIndividu[], isFromSupabase: true };
      } else if (error) {
        console.warn('Supabase fetch konseling individu error:', error.message);
        return {
          data: getLocalKonselingIndividuList(),
          isFromSupabase: false,
          error: `Supabase: ${error.message}. Menggunakan penyimpanan lokal.`,
        };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Koneksi gagal';
      return { data: getLocalKonselingIndividuList(), isFromSupabase: false, error: msg };
    }
  }

  return { data: getLocalKonselingIndividuList(), isFromSupabase: false };
}

export async function saveOrUpdateKonselingIndividu(
  item: Partial<KonselingIndividu> & Omit<KonselingIndividu, 'id'>
): Promise<{ success: boolean; data?: KonselingIndividu; isSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  const now = new Date().toISOString();
  const idToUse = item.id || (crypto.randomUUID ? crypto.randomUUID() : `ki-${Date.now()}`);

  const payload: KonselingIndividu = {
    ...item,
    id: idToUse,
    created_at: item.created_at || now,
    updated_at: now,
  };

  if (client) {
    try {
      const { data, error } = await client
        .from(DEFAULT_KONSELING_INDIVIDU_TABLE_NAME)
        .upsert(payload, { onConflict: 'id' })
        .select()
        .single();

      if (!error && data) {
        const currentLocal = getLocalKonselingIndividuList();
        const existingIdx = currentLocal.findIndex((i) => i.id === payload.id);
        if (existingIdx >= 0) {
          currentLocal[existingIdx] = data as KonselingIndividu;
        } else {
          currentLocal.unshift(data as KonselingIndividu);
        }
        saveLocalKonselingIndividuList(currentLocal);

        return { success: true, data: data as KonselingIndividu, isSupabase: true };
      } else if (error) {
        console.warn('Supabase save konseling individu error:', error.message);
        saveToLocalKonselingIndividuFallback(payload);
        return {
          success: true,
          data: payload,
          isSupabase: false,
          error: `Gagal ke Supabase (${error.message}). Disimpan ke penyimpanan lokal.`,
        };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal terhubung Supabase';
      saveToLocalKonselingIndividuFallback(payload);
      return {
        success: true,
        data: payload,
        isSupabase: false,
        error: `${msg}. Disimpan di penyimpanan lokal.`,
      };
    }
  }

  saveToLocalKonselingIndividuFallback(payload);
  return { success: true, data: payload, isSupabase: false };
}

function saveToLocalKonselingIndividuFallback(item: KonselingIndividu) {
  const current = getLocalKonselingIndividuList();
  const existingIdx = current.findIndex((i) => i.id === item.id);
  if (existingIdx >= 0) {
    current[existingIdx] = item;
  } else {
    current.unshift(item);
  }
  saveLocalKonselingIndividuList(current);
}

export async function deleteKonselingIndividuItem(id: string): Promise<{ success: boolean; isSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (client) {
    try {
      const { error } = await client.from(DEFAULT_KONSELING_INDIVIDU_TABLE_NAME).delete().eq('id', id);
      if (!error) {
        const current = getLocalKonselingIndividuList().filter((i) => i.id !== id);
        saveLocalKonselingIndividuList(current);
        return { success: true, isSupabase: true };
      }
    } catch {
      // ignore
    }
  }

  const current = getLocalKonselingIndividuList().filter((i) => i.id !== id);
  saveLocalKonselingIndividuList(current);
  return { success: true, isSupabase: false };
}

// Unified API Functions - Konseling Kelompok
export async function fetchAllKonselingKelompok(): Promise<{ data: KonselingKelompok[]; isFromSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (client) {
    try {
      const { data, error } = await client
        .from(DEFAULT_KONSELING_KELOMPOK_TABLE_NAME)
        .select('*')
        .order('tanggal', { ascending: false });

      if (!error && data) {
        saveLocalKonselingKelompokList(data as KonselingKelompok[]);
        return { data: data as KonselingKelompok[], isFromSupabase: true };
      } else if (error) {
        console.warn('Supabase fetch konseling kelompok error:', error.message);
        return {
          data: getLocalKonselingKelompokList(),
          isFromSupabase: false,
          error: `Supabase: ${error.message}. Menggunakan penyimpanan lokal.`,
        };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Koneksi gagal';
      return { data: getLocalKonselingKelompokList(), isFromSupabase: false, error: msg };
    }
  }

  return { data: getLocalKonselingKelompokList(), isFromSupabase: false };
}

export async function saveOrUpdateKonselingKelompok(
  item: Partial<KonselingKelompok> & Omit<KonselingKelompok, 'id'>
): Promise<{ success: boolean; data?: KonselingKelompok; isSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  const now = new Date().toISOString();
  const idToUse = item.id || (crypto.randomUUID ? crypto.randomUUID() : `kk-${Date.now()}`);

  const payload: KonselingKelompok = {
    ...item,
    id: idToUse,
    created_at: item.created_at || now,
    updated_at: now,
  };

  if (client) {
    try {
      const { data, error } = await client
        .from(DEFAULT_KONSELING_KELOMPOK_TABLE_NAME)
        .upsert(payload, { onConflict: 'id' })
        .select()
        .single();

      if (!error && data) {
        const currentLocal = getLocalKonselingKelompokList();
        const existingIdx = currentLocal.findIndex((i) => i.id === payload.id);
        if (existingIdx >= 0) {
          currentLocal[existingIdx] = data as KonselingKelompok;
        } else {
          currentLocal.unshift(data as KonselingKelompok);
        }
        saveLocalKonselingKelompokList(currentLocal);

        return { success: true, data: data as KonselingKelompok, isSupabase: true };
      } else if (error) {
        console.warn('Supabase save konseling kelompok error:', error.message);
        saveToLocalKonselingKelompokFallback(payload);
        return {
          success: true,
          data: payload,
          isSupabase: false,
          error: `Gagal ke Supabase (${error.message}). Disimpan ke penyimpanan lokal.`,
        };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal terhubung Supabase';
      saveToLocalKonselingKelompokFallback(payload);
      return {
        success: true,
        data: payload,
        isSupabase: false,
        error: `${msg}. Disimpan di penyimpanan lokal.`,
      };
    }
  }

  saveToLocalKonselingKelompokFallback(payload);
  return { success: true, data: payload, isSupabase: false };
}

function saveToLocalKonselingKelompokFallback(item: KonselingKelompok) {
  const current = getLocalKonselingKelompokList();
  const existingIdx = current.findIndex((i) => i.id === item.id);
  if (existingIdx >= 0) {
    current[existingIdx] = item;
  } else {
    current.unshift(item);
  }
  saveLocalKonselingKelompokList(current);
}

export async function deleteKonselingKelompokItem(id: string): Promise<{ success: boolean; isSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (client) {
    try {
      const { error } = await client.from(DEFAULT_KONSELING_KELOMPOK_TABLE_NAME).delete().eq('id', id);
      if (!error) {
        const current = getLocalKonselingKelompokList().filter((i) => i.id !== id);
        saveLocalKonselingKelompokList(current);
        return { success: true, isSupabase: true };
      }
    } catch {
      // ignore
    }
  }

  const current = getLocalKonselingKelompokList().filter((i) => i.id !== id);
  saveLocalKonselingKelompokList(current);
  return { success: true, isSupabase: false };
}

// Local Storage Helpers - Surat Pernyataan Siswa
export function getLocalSuratPernyataanList(): SuratPernyataan[] {
  const str = localStorage.getItem(STORAGE_KEY_SURAT_PERNYATAAN);
  if (!str) {
    const demoData: SuratPernyataan[] = [
      {
        id: 'demo-sp1',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString(),
        jenis_sp: 'SP_1',
        nama_siswa: 'Ahmad Rizky Pratama',
        kelas: 'VIII A',
        nama_orang_tua: 'Bapak Santoso',
        pekerjaan_orang_tua: 'Wiraswasta',
        alamat_orang_tua: 'Jl. Pahlawan No. 45, Pasuruan',
        hubungan_keluarga: 'Orang Tua / Wali',
        peraturan_diketahui:
          '1. Hadir di sekolah Tepat Waktu\n2. Tidak Absen lagi mulai terhitung Surat Perjanjian ini dibuat\n3. Mengerjakan semua Tugas tertulis /praktek dari Bapak /Ibu Guru Mata Pelajaran yang belum Tuntas',
        alasan_pengunduran: '',
        tanggal_surat: '2026-08-06',
        tempat_surat: 'Pasuruan',
        keterangan: 'Penerbitan Surat Peringatan 1 (SP 1) Pembinaan Kedisiplinan Siswa.',
      },
      {
        id: 'demo-sp-ortu1',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString(),
        jenis_sp: 'SP_ORTU_1',
        nama_siswa: 'Budi Santoso',
        kelas: 'VIII B',
        nama_orang_tua: 'Bapak Suparno',
        pekerjaan_orang_tua: 'PNS',
        alamat_orang_tua: 'Jl. Veteran No. 12, Pasuruan',
        hubungan_keluarga: 'Orang Tua Kandung',
        peraturan_diketahui:
          'Apabila dikemudian hari nanti di kelas VIII sikap anak saya masih tetap /tidak berubah sehingga mempengaruhi nilai akademis dan non akademis menjadi rendah, sehingga anak saya tidak naik kelas atau mengulang di kelas VIII, maka saya sebagai orang tua tidak akan menuntut kepada pihak sekolah.',
        alasan_pengunduran: '',
        tanggal_surat: '2026-08-06',
        tempat_surat: 'Pasuruan',
        keterangan: 'Surat Pernyataan Orang Tua / Wali Siswa terkait komitmen disiplin.',
      },
    ];
    localStorage.setItem(STORAGE_KEY_SURAT_PERNYATAAN, JSON.stringify(demoData));
    return demoData;
  }
  try {
    return JSON.parse(str);
  } catch {
    return [];
  }
}

export function saveLocalSuratPernyataanList(data: SuratPernyataan[]) {
  localStorage.setItem(STORAGE_KEY_SURAT_PERNYATAAN, JSON.stringify(data));
}

// Unified API Functions - Surat Pernyataan Siswa
export async function fetchAllSuratPernyataan(): Promise<{ data: SuratPernyataan[]; isFromSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (client) {
    try {
      const { data, error } = await client
        .from(DEFAULT_SURAT_PERNYATAAN_TABLE_NAME)
        .select('*')
        .order('tanggal_surat', { ascending: false });

      if (!error && data) {
        saveLocalSuratPernyataanList(data as SuratPernyataan[]);
        return { data: data as SuratPernyataan[], isFromSupabase: true };
      } else if (error) {
        console.warn('Supabase fetch surat pernyataan error:', error.message);
        return {
          data: getLocalSuratPernyataanList(),
          isFromSupabase: false,
          error: `Supabase: ${error.message}. Menggunakan penyimpanan lokal.`,
        };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Koneksi gagal';
      return { data: getLocalSuratPernyataanList(), isFromSupabase: false, error: msg };
    }
  }

  return { data: getLocalSuratPernyataanList(), isFromSupabase: false };
}

export async function saveOrUpdateSuratPernyataan(
  item: Partial<SuratPernyataan> & Omit<SuratPernyataan, 'id'>
): Promise<{ success: boolean; data?: SuratPernyataan; isSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  const now = new Date().toISOString();
  const idToUse = item.id || (crypto.randomUUID ? crypto.randomUUID() : `sp-${Date.now()}`);

  const payload: SuratPernyataan = {
    ...item,
    id: idToUse,
    created_at: item.created_at || now,
    updated_at: now,
  };

  if (client) {
    try {
      const { data, error } = await client
        .from(DEFAULT_SURAT_PERNYATAAN_TABLE_NAME)
        .upsert(payload, { onConflict: 'id' })
        .select()
        .single();

      if (!error && data) {
        const currentLocal = getLocalSuratPernyataanList();
        const existingIdx = currentLocal.findIndex((i) => i.id === payload.id);
        if (existingIdx >= 0) {
          currentLocal[existingIdx] = data as SuratPernyataan;
        } else {
          currentLocal.unshift(data as SuratPernyataan);
        }
        saveLocalSuratPernyataanList(currentLocal);

        return { success: true, data: data as SuratPernyataan, isSupabase: true };
      } else if (error) {
        console.warn('Supabase save surat pernyataan error:', error.message);
        saveToLocalSuratPernyataanFallback(payload);
        return {
          success: true,
          data: payload,
          isSupabase: false,
          error: `Gagal ke Supabase (${error.message}). Disimpan ke penyimpanan lokal.`,
        };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal terhubung Supabase';
      saveToLocalSuratPernyataanFallback(payload);
      return {
        success: true,
        data: payload,
        isSupabase: false,
        error: `${msg}. Disimpan di penyimpanan lokal.`,
      };
    }
  }

  saveToLocalSuratPernyataanFallback(payload);
  return { success: true, data: payload, isSupabase: false };
}

function saveToLocalSuratPernyataanFallback(item: SuratPernyataan) {
  const current = getLocalSuratPernyataanList();
  const existingIdx = current.findIndex((i) => i.id === item.id);
  if (existingIdx >= 0) {
    current[existingIdx] = item;
  } else {
    current.unshift(item);
  }
  saveLocalSuratPernyataanList(current);
}

export async function deleteSuratPernyataanItem(id: string): Promise<{ success: boolean; isSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (client) {
    try {
      const { error } = await client.from(DEFAULT_SURAT_PERNYATAAN_TABLE_NAME).delete().eq('id', id);
      if (!error) {
        const current = getLocalSuratPernyataanList().filter((i) => i.id !== id);
        saveLocalSuratPernyataanList(current);
        return { success: true, isSupabase: true };
      }
    } catch {
      // ignore
    }
  }

  const current = getLocalSuratPernyataanList().filter((i) => i.id !== id);
  saveLocalSuratPernyataanList(current);
  return { success: true, isSupabase: false };
}

// Local Storage Helpers - Konferensi Kasus Siswa
export function getLocalKonferensiKasusList(): KonferensiKasus[] {
  const str = localStorage.getItem(STORAGE_KEY_KONFERENSI_KASUS);
  if (!str) {
    const demoData: KonferensiKasus[] = [
      {
        id: 'demo-kk1',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString(),
        nama_konseli: 'Syahnaz (IXE)',
        kelas_ta: '9E / 2016-2017',
        jenis_masalah: 'Berkelahi karena salah paham',
        hari_tgl_jam: 'Kamis, 8 September 2016 Jam 10.30 wib',
        pemandu_konferensi: 'Konselor Sekolah',
        pemandu_nama: 'Wiwik Ismiati, S.Pd',
        pemandu_jabatan: 'Konselor',
        data_ingin_diperoleh: 'Identifikasi permasalahan siswa',
        uraian_kegiatan_inti: 'Untuk mengetahui tentang kejadian yang sebenarnya dari siswa yang terlibat permasalahan tersebut di sekolah, baik dari pihak sekolah dengan siswa yang berseteru. Dan mencari solusi yang terbaik diantara siswa dengan teman-temannya.',
        data_diperoleh_simpulan: 'Dari informasi yang terkumpul bahwa Syahnaz terlibat perseteruan karena membela sahabatnya yaitu Aminah. Karena membela sahabatnya maka Syahnaz yang di bully oleh anak-anak kelas 7C. Karena merasa tersinggung dengan perlakuan siswa kelas 7C maka Syahnaz tidak terima dan terjadi perkelahian sampai akan melempar batu. Ketika mereka berseteru dan ditemukan penyelesaiannya maka persoalan bisa dengan mudah terselesaikan.',
        keterpenuhan_kebutuhan_data: 'terpenuhi',
        rujukan_pelayanan: 'Guru Mata Pelajaran, Wali Kelas, Konselor Sekolah',
        rapat_nama_sekolah: 'UPT SMPN 7 PASURUAN',
        rapat_alamat: 'Jl. Simpang Slamet Riadi No.2 Sebani Gadingrejo',
        rapat_tempat: 'UPT SMPN 7 PASURUAN',
        rapat_ketua: 'Konselor',
        rapat_jumlah_hadir: '9 orang',
        rapat_dimulai_pukul: '10.30 WIB',
        rapat_diakhiri_pukul: '11.00 WIB',
        rapat_hasil_pertemuan: 'A. Dari identifikasi permasalahan siswa, didapatkan permasalahan tersebut timbul karena anak kelas 7C yang bermasalah sering mengolok-olok Aminah.\nB. Dari peristiwa tersebut temannya Aminah tidak terima dan terjadi pertengkaran/adu mulut dengan Syahnaz.\nC. Syahnaz yang membela Aminah akhirnya kena tampar oleh M. Badru dan tidak terima sehingga membawa batu bata mau dilemparkan.\nD. Setelah terjadi konferensi kasus, maka masing-masing pihak mau menerima keputusan bersama dan saling memaafkan. Akhirnya permasalahan selesai dengan saling memaafkan dan untuk kelas 7C semua panggilan orang tua untuk selanjutnya diberi pengarahan.',
        daftar_hadir_peserta_singkat: '1. Konselor, 2. M. Badru T (VIIC), 3. M. Usman (VIIC), 4. M. Amyak (VIIC), 5. M. Nabil (VIIC), 6. Aminah Husain (VIIIB), 7. Syahnaz (IXE)',
        daftar_hadir_rows: JSON.stringify([
          { no: 1, nama: 'Ibu Citra Dwi W', jabatan: 'Konselor', kelas: '-', asal_sekolah: 'UPT SMPN 7 Pas', ttd: 'Ada' },
          { no: 2, nama: 'Ibu Wiwik Ismiati', jabatan: 'Konselor', kelas: '-', asal_sekolah: 'UPT SMPN 7 Pas', ttd: 'Ada' },
          { no: 3, nama: 'Ibu Eki', jabatan: 'Konselor', kelas: '-', asal_sekolah: 'UPT SMPN 7 Pas', ttd: 'Ada' },
          { no: 4, nama: 'M. Badru', jabatan: 'Siswa', kelas: '7C', asal_sekolah: '-', ttd: 'Ada' },
          { no: 5, nama: 'M. Usman', jabatan: 'Siswa', kelas: '7C', asal_sekolah: '-', ttd: 'Ada' },
          { no: 6, nama: 'M. Amyak', jabatan: 'Siswa', kelas: '7C', asal_sekolah: '-', ttd: 'Ada' },
          { no: 7, nama: 'M. Nabil', jabatan: 'Siswa', kelas: '7C', asal_sekolah: '-', ttd: 'Ada' },
          { no: 8, nama: 'Syahnaz', jabatan: 'Siswa', kelas: '9E', asal_sekolah: '-', ttd: 'Ada' },
          { no: 9, nama: 'Aminah', jabatan: 'Siswa', kelas: '8B', asal_sekolah: '-', ttd: 'Ada' },
          { no: 10, nama: 'Naval R.', jabatan: 'Siswa', kelas: '7C', asal_sekolah: 'UPT SMPN 7 Pas', ttd: 'Ada' }
        ]),
        tanggal_surat: '2026-08-06',
        tempat_surat: 'Pasuruan',
        nama_guru_bk: getActiveGuruBK().nama,
        nip_guru_bk: getActiveGuruBK().nip,
        nama_kepala_sekolah: 'NUR FADILAH, S.Pd,. M.Pd',
        nip_kepala_sekolah: '19860410 201001 2 030',
        keterangan: 'Konferensi kasus perselisihan kelas 9E dengan kelas 7C.'
      }
    ];
    localStorage.setItem(STORAGE_KEY_KONFERENSI_KASUS, JSON.stringify(demoData));
    return demoData;
  }
  try {
    return JSON.parse(str);
  } catch {
    return [];
  }
}

export function saveLocalKonferensiKasusList(data: KonferensiKasus[]) {
  localStorage.setItem(STORAGE_KEY_KONFERENSI_KASUS, JSON.stringify(data));
}

// Unified API Functions - Konferensi Kasus Siswa
export async function fetchAllKonferensiKasus(): Promise<{ data: KonferensiKasus[]; isFromSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (client) {
    try {
      const { data, error } = await client
        .from(DEFAULT_KONFERENSI_KASUS_TABLE_NAME)
        .select('*')
        .order('tanggal_surat', { ascending: false });

      if (!error && data) {
        saveLocalKonferensiKasusList(data as KonferensiKasus[]);
        return { data: data as KonferensiKasus[], isFromSupabase: true };
      } else if (error) {
        console.warn('Supabase fetch konferensi kasus error:', error.message);
        return {
          data: getLocalKonferensiKasusList(),
          isFromSupabase: false,
          error: `Supabase: ${error.message}. Menggunakan penyimpanan lokal.`,
        };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Koneksi gagal';
      return { data: getLocalKonferensiKasusList(), isFromSupabase: false, error: msg };
    }
  }

  return { data: getLocalKonferensiKasusList(), isFromSupabase: false };
}

export async function saveOrUpdateKonferensiKasus(
  item: Partial<KonferensiKasus> & Omit<KonferensiKasus, 'id'>
): Promise<{ success: boolean; data?: KonferensiKasus; isSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  const now = new Date().toISOString();
  const idToUse = item.id || (crypto.randomUUID ? crypto.randomUUID() : `kk-${Date.now()}`);

  const payload: KonferensiKasus = {
    ...item,
    id: idToUse,
    created_at: item.created_at || now,
    updated_at: now,
  };

  if (client) {
    try {
      const { data, error } = await client
        .from(DEFAULT_KONFERENSI_KASUS_TABLE_NAME)
        .upsert(payload, { onConflict: 'id' })
        .select()
        .single();

      if (!error && data) {
        const currentLocal = getLocalKonferensiKasusList();
        const existingIdx = currentLocal.findIndex((i) => i.id === payload.id);
        if (existingIdx >= 0) {
          currentLocal[existingIdx] = data as KonferensiKasus;
        } else {
          currentLocal.unshift(data as KonferensiKasus);
        }
        saveLocalKonferensiKasusList(currentLocal);

        return { success: true, data: data as KonferensiKasus, isSupabase: true };
      } else if (error) {
        console.warn('Supabase save konferensi kasus error:', error.message);
        saveToLocalKonferensiKasusFallback(payload);
        return {
          success: true,
          data: payload,
          isSupabase: false,
          error: `Gagal ke Supabase (${error.message}). Disimpan ke penyimpanan lokal.`,
        };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal terhubung Supabase';
      saveToLocalKonferensiKasusFallback(payload);
      return {
        success: true,
        data: payload,
        isSupabase: false,
        error: `${msg}. Disimpan di penyimpanan lokal.`,
      };
    }
  }

  saveToLocalKonferensiKasusFallback(payload);
  return { success: true, data: payload, isSupabase: false };
}

function saveToLocalKonferensiKasusFallback(item: KonferensiKasus) {
  const current = getLocalKonferensiKasusList();
  const existingIdx = current.findIndex((i) => i.id === item.id);
  if (existingIdx >= 0) {
    current[existingIdx] = item;
  } else {
    current.unshift(item);
  }
  saveLocalKonferensiKasusList(current);
}

export async function deleteKonferensiKasusItem(id: string): Promise<{ success: boolean; isSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (client) {
    try {
      const { error } = await client.from(DEFAULT_KONFERENSI_KASUS_TABLE_NAME).delete().eq('id', id);
      if (!error) {
        const current = getLocalKonferensiKasusList().filter((i) => i.id !== id);
        saveLocalKonferensiKasusList(current);
        return { success: true, isSupabase: true };
      }
    } catch {
      // ignore
    }
  }

  const current = getLocalKonferensiKasusList().filter((i) => i.id !== id);
  saveLocalKonferensiKasusList(current);
  return { success: true, isSupabase: false };
}

// Local Storage Helpers - Siswa
export function getLocalSiswaList(): Siswa[] {
  const str = localStorage.getItem(STORAGE_KEY_SISWA);
  if (!str) {
    const demoData: Siswa[] = [
      {
        id: 'demo-s1',
        created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
        updated_at: new Date(Date.now() - 86400000 * 5).toISOString(),
        nama_siswa: 'Ahmad Rizky Pratama',
        kelas: 'VIII A',
        nis: '12345',
        jenis_kelamin: 'Laki-laki',
        keterangan: 'Siswa aktif'
      },
      {
        id: 'demo-s2',
        created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
        updated_at: new Date(Date.now() - 86400000 * 4).toISOString(),
        nama_siswa: 'Siti Aminah',
        kelas: 'VIII A',
        nis: '12346',
        jenis_kelamin: 'Perempuan',
        keterangan: 'Siswa aktif'
      },
      {
        id: 'demo-s3',
        created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
        updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
        nama_siswa: 'Rian Adiputra',
        kelas: 'IX C',
        nis: '12347',
        jenis_kelamin: 'Laki-laki',
        keterangan: 'Pernah bimbingan kedisiplinan'
      }
    ];
    localStorage.setItem(STORAGE_KEY_SISWA, JSON.stringify(demoData));
    return demoData;
  }
  try {
    return JSON.parse(str);
  } catch {
    return [];
  }
}

export function saveLocalSiswaList(data: Siswa[]) {
  localStorage.setItem(STORAGE_KEY_SISWA, JSON.stringify(data));
}

export async function fetchSiswaList(): Promise<{ data: Siswa[]; isFromSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (client) {
    try {
      const { data, error } = await client
        .from(DEFAULT_SISWA_TABLE_NAME)
        .select('*')
        .order('nama_siswa', { ascending: true });

      if (!error && data) {
        saveLocalSiswaList(data as Siswa[]);
        return { data: data as Siswa[], isFromSupabase: true };
      } else if (error) {
        console.warn('Supabase fetch siswa error:', error.message);
        return {
          data: getLocalSiswaList(),
          isFromSupabase: false,
          error: `Supabase: ${error.message}. Menggunakan penyimpanan lokal.`,
        };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Koneksi gagal';
      return { data: getLocalSiswaList(), isFromSupabase: false, error: msg };
    }
  }

  return { data: getLocalSiswaList(), isFromSupabase: false };
}

export async function saveOrUpdateSiswa(
  siswa: Partial<Siswa> & Omit<Siswa, 'id'>
): Promise<{ success: boolean; data?: Siswa; isSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  const now = new Date().toISOString();
  const currentLocal = getLocalSiswaList();
  
  // Find by NIS for upserting behavior
  const matchedSiswaByNis = currentLocal.find(s => s.nis && s.nis.trim() === siswa.nis.trim());
  const idToUse = siswa.id || matchedSiswaByNis?.id || (crypto.randomUUID ? crypto.randomUUID() : `sis-${Date.now()}`);

  const payload: Siswa = {
    ...siswa,
    id: idToUse,
    created_at: siswa.created_at || matchedSiswaByNis?.created_at || now,
    updated_at: now,
  };

  if (client) {
    try {
      const { data, error } = await client
        .from(DEFAULT_SISWA_TABLE_NAME)
        .upsert(payload, { onConflict: 'id' })
        .select()
        .single();

      if (!error && data) {
        const existingIdx = currentLocal.findIndex((i) => i.id === payload.id);
        if (existingIdx >= 0) {
          currentLocal[existingIdx] = data as Siswa;
        } else {
          currentLocal.push(data as Siswa);
        }
        saveLocalSiswaList(currentLocal);

        return { success: true, data: data as Siswa, isSupabase: true };
      } else if (error) {
        console.warn('Supabase save siswa error:', error.message);
        saveToLocalSiswaFallback(payload);
        return {
          success: true,
          data: payload,
          isSupabase: false,
          error: `Gagal ke Supabase (${error.message}). Disimpan ke penyimpanan lokal.`,
        };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal terhubung Supabase';
      saveToLocalSiswaFallback(payload);
      return {
        success: true,
        data: payload,
        isSupabase: false,
        error: `${msg}. Disimpan di penyimpanan lokal.`,
      };
    }
  }

  saveToLocalSiswaFallback(payload);
  return { success: true, data: payload, isSupabase: false };
}

function saveToLocalSiswaFallback(item: Siswa) {
  const current = getLocalSiswaList();
  const existingIdx = current.findIndex((i) => i.id === item.id);
  if (existingIdx >= 0) {
    current[existingIdx] = item;
  } else {
    current.push(item);
  }
  saveLocalSiswaList(current);
}

export async function bulkSaveOrUpdateSiswa(
  students: Omit<Siswa, 'id' | 'created_at' | 'updated_at'>[]
): Promise<{ success: boolean; count: number; isSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);
  const now = new Date().toISOString();

  // Get current state
  let currentList: Siswa[] = [];
  let isSupabase = false;

  if (client) {
    try {
      const { data, error } = await client
        .from(DEFAULT_SISWA_TABLE_NAME)
        .select('*');
      if (!error && data) {
        currentList = data as Siswa[];
        isSupabase = true;
      } else {
        console.warn('Gagal fetch siswa untuk bulk import, menggunakan local:', error?.message);
        currentList = getLocalSiswaList();
      }
    } catch (err) {
      console.warn('Exception fetch siswa untuk bulk import, menggunakan local:', err);
      currentList = getLocalSiswaList();
    }
  } else {
    currentList = getLocalSiswaList();
  }

  // Map existing students by NIS (case-insensitive, trimmed)
  const existingByNisMap = new Map<string, Siswa>();
  currentList.forEach(s => {
    if (s.nis) {
      existingByNisMap.set(s.nis.trim().toLowerCase(), s);
    }
  });

  // De-duplicate the incoming students array by NIS (case-insensitive, trimmed) to avoid database conflicts
  const uniqueStudentsMap = new Map<string, Omit<Siswa, 'id' | 'created_at' | 'updated_at'>>();
  students.forEach(s => {
    if (s.nis) {
      uniqueStudentsMap.set(s.nis.trim().toLowerCase(), s);
    }
  });
  const uniqueStudents = Array.from(uniqueStudentsMap.values());

  // Prepare payloads using the deduplicated students
  const payloads: Siswa[] = uniqueStudents.map((s, index) => {
    const key = s.nis.trim().toLowerCase();
    const existing = existingByNisMap.get(key);
    
    const idToUse = existing?.id || (
      crypto && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `sis-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 11)}`
    );
    const created_at = existing?.created_at || now;

    return {
      id: idToUse,
      created_at,
      updated_at: now,
      nama_siswa: s.nama_siswa,
      kelas: s.kelas,
      nis: s.nis,
      jenis_kelamin: s.jenis_kelamin,
      keterangan: s.keterangan
    };
  });

  if (client && isSupabase) {
    try {
      // Bulk upsert into Supabase based on 'nis' column
      const { error } = await client
        .from(DEFAULT_SISWA_TABLE_NAME)
        .upsert(payloads, { onConflict: 'nis' });

      if (error) {
        throw new Error(error.message);
      }

      // If successful, update our local cache by merging
      const mergedList = [...currentList];
      payloads.forEach(p => {
        const idx = mergedList.findIndex(item => item.id === p.id || (item.nis && p.nis && item.nis.trim().toLowerCase() === p.nis.trim().toLowerCase()));
        if (idx !== -1) {
          mergedList[idx] = p;
        } else {
          mergedList.push(p);
        }
      });
      saveLocalSiswaList(mergedList);

      return { success: true, count: payloads.length, isSupabase: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan koneksi';
      
      // Fallback to local
      const mergedList = [...currentList];
      payloads.forEach(p => {
        const idx = mergedList.findIndex(item => item.id === p.id || (item.nis && p.nis && item.nis.trim().toLowerCase() === p.nis.trim().toLowerCase()));
        if (idx !== -1) {
          mergedList[idx] = p;
        } else {
          mergedList.push(p);
        }
      });
      saveLocalSiswaList(mergedList);

      return { 
        success: true, 
        count: payloads.length, 
        isSupabase: false, 
        error: `Supabase: ${msg}. Data berhasil disimpan ke penyimpanan lokal.` 
      };
    }
  }

  // Local storage only
  const mergedList = [...currentList];
  payloads.forEach(p => {
    const idx = mergedList.findIndex(item => item.id === p.id || (item.nis && p.nis && item.nis.trim().toLowerCase() === p.nis.trim().toLowerCase()));
    if (idx !== -1) {
      mergedList[idx] = p;
    } else {
      mergedList.push(p);
    }
  });
  saveLocalSiswaList(mergedList);

  return { success: true, count: payloads.length, isSupabase: false };
}

export async function deleteSiswaItem(id: string): Promise<{ success: boolean; isSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (client) {
    try {
      const { error } = await client.from(DEFAULT_SISWA_TABLE_NAME).delete().eq('id', id);
      if (!error) {
        const current = getLocalSiswaList().filter((i) => i.id !== id);
        saveLocalSiswaList(current);
        return { success: true, isSupabase: true };
      }
    } catch {
      // ignore
    }
  }

  const current = getLocalSiswaList().filter((i) => i.id !== id);
  saveLocalSiswaList(current);
  return { success: true, isSupabase: false };
}

// Local Storage Helpers - Jurnal BK
export function getLocalJurnalBKList(): JurnalBK[] {
  const str = localStorage.getItem(STORAGE_KEY_JURNAL_BK);
  if (!str) {
    const demoData: JurnalBK[] = [
      {
        id: 'demo-jurnal-1',
        created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
        updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
        hari: 'Senin',
        tanggal: '2026-08-03',
        bulan: 'Agustus',
        tahun: '2026',
        jam_ke: '1 - 2',
        kelas: 'VIII A',
        sasaran_peserta: 'Siswa Kelas VIII A',
        materi_layanan: 'Pengelolaan Emosi dan Kedisiplinan Belajar Mandiri',
        bidang_layanan: 'Pribadi',
        jenis_layanan: 'Bimbingan Klasikal / Lintas Kelas',
        fungsi_layanan: 'Pemahaman: Membantu konseli memahami diri dan lingkungannya.',
        hasil_layanan_bmb3: 'B: Siswa memahami dampak emosi negatif. M: Siswa merasa termotivasi mengontrol emosi. B: Siswa bersikap sopan. T: Siswa membuat jurnal refleksi harian. B: Siswa bertanggung jawab menjalankan komitmen kelas.',
        siswa_tidak_mengikuti: [
          { nama_siswa: 'Ahmad Rizky', alasan: 'Sakit (Izin Orang Tua)', tindak_lanjut: 'Layanan susulan modul ringkasan & bimbingan individual' }
        ],
        link_foto_kegiatan: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800',
        keterangan: 'Layanan berjalan lancar dan interaktif.',
        nama_guru_bk: getActiveGuruBK().nama,
        nip_guru_bk: getActiveGuruBK().nip,
        nama_kepala_sekolah: 'NUR FADILAH, S.Pd,. M.Pd',
        nip_kepala_sekolah: '19860410 201001 2 030',
        tanggal_surat: '2026-08-03',
        tempat_surat: 'Pasuruan'
      }
    ];
    localStorage.setItem(STORAGE_KEY_JURNAL_BK, JSON.stringify(demoData));
    return demoData;
  }
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveLocalJurnalBKList(data: JurnalBK[]) {
  localStorage.setItem(STORAGE_KEY_JURNAL_BK, JSON.stringify(data));
}

export async function fetchAllJurnalBK(): Promise<{ data: JurnalBK[]; isFromSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (client) {
    try {
      const { data, error } = await client
        .from(DEFAULT_JURNAL_BK_TABLE_NAME)
        .select('*')
        .order('tanggal', { ascending: false });

      if (!error && data) {
        const mappedList: JurnalBK[] = data.map((row: any) => {
          let siswaAbsenList = [];
          if (row.siswa_tidak_mengikuti_json) {
            try {
              siswaAbsenList = typeof row.siswa_tidak_mengikuti_json === 'string'
                ? JSON.parse(row.siswa_tidak_mengikuti_json)
                : row.siswa_tidak_mengikuti_json;
            } catch {
              siswaAbsenList = [];
            }
          }
          return {
            id: row.id,
            created_at: row.created_at,
            updated_at: row.updated_at,
            hari: row.hari || '',
            tanggal: row.tanggal || '',
            bulan: row.bulan || '',
            tahun: row.tahun || '',
            jam_ke: row.jam_ke || '',
            materi_layanan: row.materi_layanan || '',
            bidang_layanan: row.bidang_layanan || 'Pribadi',
            jenis_layanan: row.jenis_layanan || 'Bimbingan Klasikal / Lintas Kelas',
            fungsi_layanan: row.fungsi_layanan || '',
            hasil_layanan_bmb3: row.hasil_layanan_bmb3 || '',
            siswa_tidak_mengikuti: Array.isArray(siswaAbsenList) ? siswaAbsenList : [],
            kelas: row.kelas || '',
            sasaran_peserta: row.sasaran_peserta || '',
            link_foto_kegiatan: row.link_foto_kegiatan || '',
            keterangan: row.keterangan || '',
            nama_guru_bk: row.nama_guru_bk || '',
            nip_guru_bk: row.nip_guru_bk || '',
            nama_kepala_sekolah: row.nama_kepala_sekolah || '',
            nip_kepala_sekolah: row.nip_kepala_sekolah || '',
            tanggal_surat: row.tanggal_surat || '',
            tempat_surat: row.tempat_surat || 'Pasuruan'
          };
        });

        saveLocalJurnalBKList(mappedList);
        return { data: mappedList, isFromSupabase: true };
      }
    } catch (err: any) {
      console.warn('Gagal fetch Jurnal BK dari Supabase, fallback Local Storage:', err);
    }
  }

  return { data: getLocalJurnalBKList(), isFromSupabase: false };
}

export async function saveOrUpdateJurnalBK(
  item: Partial<JurnalBK> & FormJurnalBKData,
  existingId?: string
): Promise<{ success: boolean; data?: JurnalBK; isSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  const now = new Date().toISOString();
  const targetId = existingId || item.id || `jurnal-${Date.now()}`;

  const payloadRow = {
    id: targetId,
    updated_at: now,
    hari: item.hari,
    tanggal: item.tanggal,
    bulan: item.bulan,
    tahun: item.tahun,
    jam_ke: item.jam_ke || '',
    materi_layanan: item.materi_layanan,
    bidang_layanan: item.bidang_layanan,
    jenis_layanan: item.jenis_layanan,
    fungsi_layanan: item.fungsi_layanan,
    hasil_layanan_bmb3: item.hasil_layanan_bmb3 || '',
    siswa_tidak_mengikuti_json: JSON.stringify(item.siswa_tidak_mengikuti || []),
    kelas: item.kelas || '',
    sasaran_peserta: item.sasaran_peserta || '',
    link_foto_kegiatan: item.link_foto_kegiatan || '',
    keterangan: item.keterangan || '',
    nama_guru_bk: item.nama_guru_bk || getActiveGuruBK().nama,
    nip_guru_bk: item.nip_guru_bk || getActiveGuruBK().nip,
    nama_kepala_sekolah: item.nama_kepala_sekolah || 'NUR FADILAH, S.Pd,. M.Pd',
    nip_kepala_sekolah: item.nip_kepala_sekolah || '19860410 201001 2 030',
    tanggal_surat: item.tanggal_surat || item.tanggal,
    tempat_surat: item.tempat_surat || 'Pasuruan'
  };

  const formattedObject: JurnalBK = {
    ...item,
    id: targetId,
    created_at: item.created_at || now,
    updated_at: now
  };

  if (client) {
    try {
      const { data, error } = await client
        .from(DEFAULT_JURNAL_BK_TABLE_NAME)
        .upsert(payloadRow, { onConflict: 'id' })
        .select()
        .single();

      if (!error && data) {
        const current = getLocalJurnalBKList();
        const idx = current.findIndex((i) => i.id === targetId);
        if (idx >= 0) {
          current[idx] = formattedObject;
        } else {
          current.unshift(formattedObject);
        }
        saveLocalJurnalBKList(current);
        return { success: true, data: formattedObject, isSupabase: true };
      } else if (error) {
        console.warn('Supabase upsert error Jurnal BK:', error.message);
      }
    } catch (err: any) {
      console.warn('Catch error saving Jurnal BK to Supabase:', err);
    }
  }

  // Fallback to local storage
  const current = getLocalJurnalBKList();
  const idx = current.findIndex((i) => i.id === targetId);
  if (idx >= 0) {
    current[idx] = formattedObject;
  } else {
    current.unshift(formattedObject);
  }
  saveLocalJurnalBKList(current);

  return { success: true, data: formattedObject, isSupabase: false };
}

export async function deleteJurnalBKItem(id: string): Promise<{ success: boolean; isSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (client) {
    try {
      const { error } = await client.from(DEFAULT_JURNAL_BK_TABLE_NAME).delete().eq('id', id);
      if (!error) {
        const current = getLocalJurnalBKList().filter((i) => i.id !== id);
        saveLocalJurnalBKList(current);
        return { success: true, isSupabase: true };
      }
    } catch {
      // ignore
    }
  }

  const current = getLocalJurnalBKList().filter((i) => i.id !== id);
  saveLocalJurnalBKList(current);
  return { success: true, isSupabase: false };
}

// SQL Script generator for user setup in Supabase SQL Editor
export function getSupabaseSqlSetup(
  tableName: string = DEFAULT_TABLE_NAME,
  undanganTableName: string = DEFAULT_UNDANGAN_TABLE_NAME,
  homeVisitTableName: string = DEFAULT_HOME_VISIT_TABLE_NAME,
  rekamPermasalahanTableName: string = DEFAULT_REKAM_PERMASALAHAN_TABLE_NAME,
  konselingIndividuTableName: string = DEFAULT_KONSELING_INDIVIDU_TABLE_NAME,
  konselingKelompokTableName: string = DEFAULT_KONSELING_KELOMPOK_TABLE_NAME,
  suratPernyataanTableName: string = DEFAULT_SURAT_PERNYATAAN_TABLE_NAME,
  konferensiKasusTableName: string = DEFAULT_KONFERENSI_KASUS_TABLE_NAME,
  siswaTableName: string = DEFAULT_SISWA_TABLE_NAME,
  jurnalBKTableName: string = DEFAULT_JURNAL_BK_TABLE_NAME
): string {
  return `-- SQL Script Setup Database Supabase untuk ADMINISTRASI BK SMPN 7 Pasuruan (ADM_BK_SMPN7)
-- Jalankan seluruh script ini di Supabase Studio -> SQL Editor -> Run

--------------------------------------------------------------------------------
--------------------------------------------------------------------------------
-- 10. TABEL TANDA TANGAN (signatures_bk)
--------------------------------------------------------------------------------
create table if not exists public.signatures_bk (
  id text primary key default gen_random_uuid()::text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  record_id text not null,
  role text not null,
  signature_data text not null,
  unique(record_id, role)
);

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

-- Drop policy jika sudah ada agar re-runnable (tidak error)
drop policy if exists "Akses Baca Publik Agenda BK" on public.${tableName};
drop policy if exists "Akses Tambah Publik Agenda BK" on public.${tableName};
drop policy if exists "Akses Update Publik Agenda BK" on public.${tableName};
drop policy if exists "Akses Hapus Publik Agenda BK" on public.${tableName};

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
  nama_guru_bk text default '',
  nip_guru_bk text default '',
  nama_kepala_sekolah text default '',
  nip_kepala_sekolah text default ''
);

alter table public.${undanganTableName} enable row level security;

-- Drop policy jika sudah ada agar re-runnable (tidak error)
drop policy if exists "Akses Baca Publik Undangan Ortu" on public.${undanganTableName};
drop policy if exists "Akses Tambah Publik Undangan Ortu" on public.${undanganTableName};
drop policy if exists "Akses Update Publik Undangan Ortu" on public.${undanganTableName};
drop policy if exists "Akses Hapus Publik Undangan Ortu" on public.${undanganTableName};

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
  keterangan text default '',
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
  nama_guru_bk text default '',
  nip_guru_bk text default '',
  nama_kepala_sekolah text default '',
  nip_kepala_sekolah text default '',
  tanggal_surat text default '',
  tempat_surat text default 'Pasuruan',
  nomor_surat_tugas text default '',
  petugas_1 text default '',
  petugas_2 text default '',
  jabatan_petugas_1 text default '',
  jabatan_petugas_2 text default '',
  nis_siswa text default '',
  tanggal_surat_tugas text default '',
  petugas_penerima_kunjungan text default '',
  tanggal_pernyataan_ortu text default ''
);

alter table public.${homeVisitTableName} enable row level security;

-- Drop policy jika sudah ada agar re-runnable (tidak error)
drop policy if exists "Akses Baca Publik Home Visit" on public.${homeVisitTableName};
drop policy if exists "Akses Tambah Publik Home Visit" on public.${homeVisitTableName};
drop policy if exists "Akses Update Publik Home Visit" on public.${homeVisitTableName};
drop policy if exists "Akses Hapus Publik Home Visit" on public.${homeVisitTableName};

create policy "Akses Baca Publik Home Visit" on public.${homeVisitTableName} for select using (true);
create policy "Akses Tambah Publik Home Visit" on public.${homeVisitTableName} for insert with check (true);
create policy "Akses Update Publik Home Visit" on public.${homeVisitTableName} for update using (true);
create policy "Akses Hapus Publik Home Visit" on public.${homeVisitTableName} for delete using (true);

--------------------------------------------------------------------------------
-- 4. TABEL D: REKAM PERMASALAHAN SISWA (${rekamPermasalahanTableName})
--------------------------------------------------------------------------------
create table if not exists public.${rekamPermasalahanTableName} (
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
  nama_guru_bk text default '',
  nip_guru_bk text default '',
  nama_kepala_sekolah text default '',
  nip_kepala_sekolah text default '',
  tanggal_surat text default '',
  tempat_surat text default 'Pasuruan'
);

alter table public.${rekamPermasalahanTableName} enable row level security;

-- Drop policy jika sudah ada agar re-runnable (tidak error)
drop policy if exists "Akses Baca Publik Rekam Permasalahan" on public.${rekamPermasalahanTableName};
drop policy if exists "Akses Tambah Publik Rekam Permasalahan" on public.${rekamPermasalahanTableName};
drop policy if exists "Akses Update Publik Rekam Permasalahan" on public.${rekamPermasalahanTableName};
drop policy if exists "Akses Hapus Publik Rekam Permasalahan" on public.${rekamPermasalahanTableName};

create policy "Akses Baca Publik Rekam Permasalahan" on public.${rekamPermasalahanTableName} for select using (true);
create policy "Akses Tambah Publik Rekam Permasalahan" on public.${rekamPermasalahanTableName} for insert with check (true);
create policy "Akses Update Publik Rekam Permasalahan" on public.${rekamPermasalahanTableName} for update using (true);
create policy "Akses Hapus Publik Rekam Permasalahan" on public.${rekamPermasalahanTableName} for delete using (true);

--------------------------------------------------------------------------------
-- 5. TABEL E: RENCANA KONSELING INDIVIDU (${konselingIndividuTableName})
--------------------------------------------------------------------------------
create table if not exists public.${konselingIndividuTableName} (
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
  nama_guru_bk text default '',
  nip_guru_bk text default '',
  nama_kepala_sekolah text default '',
  nip_kepala_sekolah text default ''
);

alter table public.${konselingIndividuTableName} enable row level security;

-- Drop policy jika sudah ada agar re-runnable (tidak error)
drop policy if exists "Akses Baca Publik Konseling Individu" on public.${konselingIndividuTableName};
drop policy if exists "Akses Tambah Publik Konseling Individu" on public.${konselingIndividuTableName};
drop policy if exists "Akses Update Publik Konseling Individu" on public.${konselingIndividuTableName};
drop policy if exists "Akses Hapus Publik Konseling Individu" on public.${konselingIndividuTableName};

create policy "Akses Baca Publik Konseling Individu" on public.${konselingIndividuTableName} for select using (true);
create policy "Akses Tambah Publik Konseling Individu" on public.${konselingIndividuTableName} for insert with check (true);
create policy "Akses Update Publik Konseling Individu" on public.${konselingIndividuTableName} for update using (true);
create policy "Akses Hapus Publik Konseling Individu" on public.${konselingIndividuTableName} for delete using (true);

--------------------------------------------------------------------------------
-- 6. TABEL F: RENCANA KONSELING KELOMPOK (${konselingKelompokTableName})
--------------------------------------------------------------------------------
create table if not exists public.${konselingKelompokTableName} (
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
  nama_guru_bk text default '',
  nip_guru_bk text default '',
  nama_kepala_sekolah text default '',
  nip_kepala_sekolah text default ''
);

alter table public.${konselingKelompokTableName} enable row level security;

-- Drop policy jika sudah ada agar re-runnable (tidak error)
drop policy if exists "Akses Baca Publik Konseling Kelompok" on public.${konselingKelompokTableName};
drop policy if exists "Akses Tambah Publik Konseling Kelompok" on public.${konselingKelompokTableName};
drop policy if exists "Akses Update Publik Konseling Kelompok" on public.${konselingKelompokTableName};
drop policy if exists "Akses Hapus Publik Konseling Kelompok" on public.${konselingKelompokTableName};

create policy "Akses Baca Publik Konseling Kelompok" on public.${konselingKelompokTableName} for select using (true);
create policy "Akses Tambah Publik Konseling Kelompok" on public.${konselingKelompokTableName} for insert with check (true);
create policy "Akses Update Publik Konseling Kelompok" on public.${konselingKelompokTableName} for update using (true);
create policy "Akses Hapus Publik Konseling Kelompok" on public.${konselingKelompokTableName} for delete using (true);

--------------------------------------------------------------------------------
-- 7. TABEL G: SURAT PERNYATAAN SISWA / ORANG TUA (${suratPernyataanTableName})
--------------------------------------------------------------------------------
create table if not exists public.${suratPernyataanTableName} (
  id text primary key default gen_random_uuid()::text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  jenis_sp text not null,
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
  nama_guru_bk text default '',
  nip_guru_bk text default '',
  nama_kepala_sekolah text default '',
  nip_kepala_sekolah text default ''
);

alter table public.${suratPernyataanTableName} enable row level security;

-- Drop policy jika sudah ada agar re-runnable (tidak error)
drop policy if exists "Akses Baca Publik Surat Pernyataan" on public.${suratPernyataanTableName};
drop policy if exists "Akses Tambah Publik Surat Pernyataan" on public.${suratPernyataanTableName};
drop policy if exists "Akses Update Publik Surat Pernyataan" on public.${suratPernyataanTableName};
drop policy if exists "Akses Hapus Publik Surat Pernyataan" on public.${suratPernyataanTableName};

create policy "Akses Baca Publik Surat Pernyataan" on public.${suratPernyataanTableName} for select using (true);
create policy "Akses Tambah Publik Surat Pernyataan" on public.${suratPernyataanTableName} for insert with check (true);
create policy "Akses Update Publik Surat Pernyataan" on public.${suratPernyataanTableName} for update using (true);
create policy "Akses Hapus Publik Surat Pernyataan" on public.${suratPernyataanTableName} for delete using (true);

--------------------------------------------------------------------------------
-- 8. TABEL H: KONFERENSI KASUS SISWA (${konferensiKasusTableName})
--------------------------------------------------------------------------------
create table if not exists public.${konferensiKasusTableName} (
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
  rapat_nama_sekolah text default '',
  rapat_alamat text default '',
  rapat_tempat text default '',
  rapat_ketua text default '',
  rapat_jumlah_hadir text default '',
  rapat_dimulai_pukul text default '',
  rapat_diakhiri_pukul text default '',
  rapat_hasil_pertemuan text default '',
  daftar_hadir_peserta_singkat text default '',
  daftar_hadir_rows text default '[]',
  tanggal_surat date default current_date,
  tempat_surat text default 'Pasuruan',
  nama_guru_bk text default '',
  nip_guru_bk text default '',
  nama_kepala_sekolah text default '',
  nip_kepala_sekolah text default '',
  keterangan text default ''
);

alter table public.${konferensiKasusTableName} enable row level security;

-- Drop policy jika sudah ada agar re-runnable (tidak error)
drop policy if exists "Akses Baca Publik Konferensi Kasus" on public.${konferensiKasusTableName};
drop policy if exists "Akses Tambah Publik Konferensi Kasus" on public.${konferensiKasusTableName};
drop policy if exists "Akses Update Publik Konferensi Kasus" on public.${konferensiKasusTableName};
drop policy if exists "Akses Hapus Publik Konferensi Kasus" on public.${konferensiKasusTableName};

create policy "Akses Baca Publik Konferensi Kasus" on public.${konferensiKasusTableName} for select using (true);
create policy "Akses Tambah Publik Konferensi Kasus" on public.${konferensiKasusTableName} for insert with check (true);
create policy "Akses Update Publik Konferensi Kasus" on public.${konferensiKasusTableName} for update using (true);
create policy "Akses Hapus Publik Konferensi Kasus" on public.${konferensiKasusTableName} for delete using (true);

--------------------------------------------------------------------------------
-- 9. TABEL I: DATA MANAGEMENT SISWA (${siswaTableName})
--------------------------------------------------------------------------------
create table if not exists public.${siswaTableName} (
  id text primary key default gen_random_uuid()::text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  nama_siswa text not null,
  kelas text not null,
  nis text not null,
  jenis_kelamin text not null,
  keterangan text default ''
);

alter table public.${siswaTableName} enable row level security;

-- Drop policy jika sudah ada agar re-runnable (tidak error)
drop policy if exists "Akses Baca Publik Siswa" on public.${siswaTableName};
drop policy if exists "Akses Tambah Publik Siswa" on public.${siswaTableName};
drop policy if exists "Akses Update Publik Siswa" on public.${siswaTableName};
drop policy if exists "Akses Hapus Publik Siswa" on public.${siswaTableName};

create policy "Akses Baca Publik Siswa" on public.${siswaTableName} for select using (true);
create policy "Akses Tambah Publik Siswa" on public.${siswaTableName} for insert with check (true);
create policy "Akses Update Publik Siswa" on public.${siswaTableName} for update using (true);
create policy "Akses Hapus Publik Siswa" on public.${siswaTableName} for delete using (true);

--------------------------------------------------------------------------------
-- 11. TABEL JURNAL LAYANAN BK (${jurnalBKTableName})
--------------------------------------------------------------------------------
create table if not exists public.${jurnalBKTableName} (
  id text primary key default gen_random_uuid()::text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  hari text not null,
  tanggal date not null,
  bulan text not null,
  tahun text not null,
  jam_ke text default '',
  materi_layanan text not null,
  bidang_layanan text not null,
  jenis_layanan text not null,
  fungsi_layanan text not null,
  hasil_layanan_bmb3 text default '',
  siswa_tidak_mengikuti_json text default '[]',
  kelas text default '',
  sasaran_peserta text default '',
  link_foto_kegiatan text default '',
  keterangan text default '',
  nama_guru_bk text default '',
  nip_guru_bk text default '',
  nama_kepala_sekolah text default '',
  nip_kepala_sekolah text default '',
  tanggal_surat text default '',
  tempat_surat text default 'Pasuruan'
);

alter table public.${jurnalBKTableName} enable row level security;

-- Drop policy jika sudah ada agar re-runnable (tidak error)
drop policy if exists "Akses Baca Publik Jurnal BK" on public.${jurnalBKTableName};
drop policy if exists "Akses Tambah Publik Jurnal BK" on public.${jurnalBKTableName};
drop policy if exists "Akses Update Publik Jurnal BK" on public.${jurnalBKTableName};
drop policy if exists "Akses Hapus Publik Jurnal BK" on public.${jurnalBKTableName};

create policy "Akses Baca Publik Jurnal BK" on public.${jurnalBKTableName} for select using (true);
create policy "Akses Tambah Publik Jurnal BK" on public.${jurnalBKTableName} for insert with check (true);
create policy "Akses Update Publik Jurnal BK" on public.${jurnalBKTableName} for update using (true);
create policy "Akses Hapus Publik Jurnal BK" on public.${jurnalBKTableName} for delete using (true);

-- Indexes for performance
create index if not exists idx_${tableName}_tanggal on public.${tableName}(tanggal);
create index if not exists idx_${undanganTableName}_siswa on public.${undanganTableName}(nama_siswa);
create index if not exists idx_${homeVisitTableName}_siswa on public.${homeVisitTableName}(nama_siswa);
create index if not exists idx_${rekamPermasalahanTableName}_siswa on public.${rekamPermasalahanTableName}(nama_siswa);
create index if not exists idx_${konselingIndividuTableName}_siswa on public.${konselingIndividuTableName}(nama_siswa);
create index if not exists idx_${konselingKelompokTableName}_kelas on public.${konselingKelompokTableName}(kelas);
create index if not exists idx_${suratPernyataanTableName}_siswa on public.${suratPernyataanTableName}(nama_siswa);
create index if not exists idx_${konferensiKasusTableName}_konseli on public.${konferensiKasusTableName}(nama_konseli);
create index if not exists idx_${siswaTableName}_kelas on public.${siswaTableName}(kelas);
create index if not exists idx_${jurnalBKTableName}_tanggal on public.${jurnalBKTableName}(tanggal);
`;
}

