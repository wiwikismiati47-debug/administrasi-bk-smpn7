import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  AgendaKerja,
  FormAgendaData,
  UndanganOrangTua,
  FormUndanganData,
  HomeVisit,
  FormHomeVisitData,
  RekamPermasalahan,
  FormRekamPermasalahanData,
  KonselingIndividu,
  FormKonselingIndividuData,
  KonselingKelompok,
  FormKonselingKelompokData,
  SuratPernyataan,
  FormSuratPernyataanData,
  KonferensiKasus,
  FormKonferensiKasusData,
  Siswa,
  FormSiswaData,
  JurnalBK,
  FormJurnalBKData,
  SupabaseConfig
} from '../types';
import { safeGetStorage, safeSetStorage } from './storageManager';
import { getActiveGuruBK } from './guruBk';

// Permanent Supabase Configuration for SMPN 7 Pasuruan (ADM_BK_SMPN7)
export const PERMANENT_SUPABASE_URL = 'https://kedffsrkxwlnynrnicek.supabase.co';
export const PERMANENT_SUPABASE_ANON_KEY = 'sb_publishable_d_FaCtLsGNP2n2PKuI-1gQ_Lc3E5DJi';

export const DEFAULT_SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  PERMANENT_SUPABASE_URL;

export const DEFAULT_SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  PERMANENT_SUPABASE_ANON_KEY;

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

// Storage Keys (Kept for config persistence)
export const STORAGE_KEY_CONFIG = 'bk_smpn7_supabase_config';
export const STORAGE_KEY_DATA = 'bk_smpn7_agenda_local';
export const STORAGE_KEY_UNDANGAN = 'bk_smpn7_undangan_local';
export const STORAGE_KEY_HOME_VISIT = 'bk_smpn7_home_visit_local';
export const STORAGE_KEY_REKAM_PERMASALAHAN = 'bk_smpn7_rekam_permasalahan_local';
export const STORAGE_KEY_KONSELING_INDIVIDU = 'bk_smpn7_konseling_individu_local';
export const STORAGE_KEY_KONSELING_KELOMPOK = 'bk_smpn7_konseling_kelompok_local';
export const STORAGE_KEY_SURAT_PERNYATAAN = 'bk_smpn7_surat_pernyataan_local';
export const STORAGE_KEY_KONFERENSI_KASUS = 'bk_smpn7_konferensi_kasus_local';
export const STORAGE_KEY_SISWA = 'bk_smpn7_siswa_local';
export const STORAGE_KEY_JURNAL_BK = 'bk_smpn7_jurnal_bk_local';

/**
 * Get Saved Supabase Config - Guaranteed permanent configuration for SMPN 7 Pasuruan
 */
export function getSavedSupabaseConfig(): SupabaseConfig {
  const saved = safeGetStorage<SupabaseConfig | null>(STORAGE_KEY_CONFIG, null);
  if (
    saved &&
    saved.url &&
    saved.anonKey &&
    saved.url.trim().length > 0 &&
    !saved.url.includes('exppqn5tp5jke6oqiby6.supabase.co')
  ) {
    return saved;
  }
  
  // Always fallback to and persist the permanent configuration
  const permanentConfig: SupabaseConfig = {
    url: PERMANENT_SUPABASE_URL,
    anonKey: PERMANENT_SUPABASE_ANON_KEY,
    tableName: DEFAULT_TABLE_NAME
  };
  safeSetStorage(STORAGE_KEY_CONFIG, permanentConfig);
  return permanentConfig;
}

/**
 * Save Supabase Config to local storage
 */
export function saveSupabaseConfigToStorage(config: SupabaseConfig): void {
  safeSetStorage(STORAGE_KEY_CONFIG, config);
}

/**
 * Reset to permanent Supabase config for SMPN 7 Pasuruan
 */
export function resetToPermanentSupabaseConfig(): SupabaseConfig {
  const permanentConfig: SupabaseConfig = {
    url: PERMANENT_SUPABASE_URL,
    anonKey: PERMANENT_SUPABASE_ANON_KEY,
    tableName: DEFAULT_TABLE_NAME
  };
  safeSetStorage(STORAGE_KEY_CONFIG, permanentConfig);
  return permanentConfig;
}

// Cached client
let cachedClient: SupabaseClient | null = null;
let lastClientKey = '';

export function getSupabaseClient(customConfig?: SupabaseConfig): SupabaseClient | null {
  const config = customConfig || getSavedSupabaseConfig();
  const url = (config.url || '').trim();
  const anonKey = (config.anonKey || '').trim();

  if (!url || !anonKey) {
    return null;
  }

  const key = `${url}___${anonKey}`;
  if (cachedClient && lastClientKey === key) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
    lastClientKey = key;
    return cachedClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

/**
 * Test basic connection to Supabase
 */
export async function testSupabaseConnection(customConfig?: SupabaseConfig): Promise<{ success: boolean; message: string }> {
  const config = customConfig || getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (!client) {
    return {
      success: false,
      message: 'Supabase URL dan Anon Key belum dikonfigurasi.'
    };
  }

  try {
    const targetTable = config.tableName || DEFAULT_TABLE_NAME;
    const { error } = await client.from(targetTable).select('id').limit(1);

    if (error) {
      if (error.code === '42P01' || error.message.toLowerCase().includes('does not exist')) {
        return {
          success: false,
          message: `Tabel '${targetTable}' belum dibuat di Supabase. Silakan jalankan script SQL setup.`
        };
      }
      return {
        success: false,
        message: `Koneksi gagal: ${error.message}`
      };
    }

    return {
      success: true,
      message: 'Koneksi ke Supabase Cloud berhasil & data siap disinkronkan secara realtime!'
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Koneksi jaringan gagal';
    return {
      success: false,
      message: `Gagal menghubungi Supabase: ${msg}`
    };
  }
}

/* ==========================================================================
   1. AGENDA KERJA BK (Direct Supabase)
   ========================================================================== */

export async function fetchAllAgenda(): Promise<{ data: AgendaKerja[]; isFromSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (!client) {
    return {
      data: [],
      isFromSupabase: false,
      error: 'Supabase belum terhubung. Konfigurasi URL dan Anon Key Supabase.'
    };
  }

  const primaryTable = config.tableName || DEFAULT_TABLE_NAME;
  try {
    let { data, error } = await client
      .from(primaryTable)
      .select('*')
      .order('tanggal', { ascending: false });

    // Try fallback table name if primary doesn't exist
    if (error && (error.code === '42P01' || error.message.toLowerCase().includes('does not exist'))) {
      const fallbackTable = primaryTable === 'agenda_kerja_bk' ? 'agenda_kerja_guru_bk' : 'agenda_kerja_bk';
      const fallbackRes = await client.from(fallbackTable).select('*').order('tanggal', { ascending: false });
      if (!fallbackRes.error && fallbackRes.data) {
        data = fallbackRes.data;
        error = null;
      }
    }

    if (error) {
      console.error('Supabase fetchAllAgenda error:', error.message);
      return {
        data: [],
        isFromSupabase: false,
        error: `Gagal mengambil data Agenda dari Supabase: ${error.message}`
      };
    }

    return {
      data: (data || []) as AgendaKerja[],
      isFromSupabase: true
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Terjadi gangguan koneksi ke database Cloud';
    return {
      data: [],
      isFromSupabase: false,
      error: msg
    };
  }
}

export async function saveOrUpdateAgenda(
  item: Partial<AgendaKerja> & FormAgendaData,
  existingId?: string
): Promise<{ success: boolean; data?: AgendaKerja; isSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (!client) {
    return {
      success: false,
      isSupabase: false,
      error: 'Database Supabase belum terhubung. Data tidak dapat disimpan.'
    };
  }

  const now = new Date().toISOString();
  const targetId = existingId || item.id || `agenda-${Date.now()}`;
  const targetTable = config.tableName || DEFAULT_TABLE_NAME;

  const payload: any = {
    id: targetId,
    updated_at: now,
    hari: item.hari,
    tanggal: item.tanggal,
    bulan: item.bulan,
    tahun: item.tahun,
    waktu: item.waktu,
    uraian_kegiatan: item.uraian_kegiatan,
    sasaran: item.sasaran,
    link_foto_kegiatan: item.link_foto_kegiatan || '',
    keterangan: item.keterangan || ''
  };

  try {
    const { data, error } = await client
      .from(targetTable)
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.error('Supabase saveOrUpdateAgenda error:', error.message);
      return {
        success: false,
        isSupabase: false,
        error: `Gagal menyimpan ke Supabase (${error.message}). Pastikan tabel '${targetTable}' sudah dibuat.`
      };
    }

    return {
      success: true,
      data: (data || { ...payload, created_at: item.created_at || now }) as AgendaKerja,
      isSupabase: true
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Koneksi ke Supabase terputus';
    return {
      success: false,
      isSupabase: false,
      error: `Error jaringan Supabase: ${msg}`
    };
  }
}

export async function deleteAgendaItem(id: string): Promise<{ success: boolean; isSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (!client) {
    return { success: false, isSupabase: false, error: 'Database Supabase belum terhubung.' };
  }

  const targetTable = config.tableName || DEFAULT_TABLE_NAME;
  try {
    const { error } = await client.from(targetTable).delete().eq('id', id);
    if (error) {
      return { success: false, isSupabase: false, error: error.message };
    }
    return { success: true, isSupabase: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal menghapus data dari Supabase';
    return { success: false, isSupabase: false, error: msg };
  }
}

/* ==========================================================================
   2. UNDANGAN ORANG TUA SISWA (Direct Supabase)
   ========================================================================== */

export async function fetchAllUndangan(): Promise<{ data: UndanganOrangTua[]; isFromSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (!client) {
    return { data: [], isFromSupabase: false, error: 'Supabase belum terhubung.' };
  }

  try {
    const { data, error } = await client
      .from(DEFAULT_UNDANGAN_TABLE_NAME)
      .select('*')
      .order('tanggal', { ascending: false });

    if (error) {
      console.error('Supabase fetchAllUndangan error:', error.message);
      return { data: [], isFromSupabase: false, error: error.message };
    }

    return { data: (data || []) as UndanganOrangTua[], isFromSupabase: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal menghubungi database';
    return { data: [], isFromSupabase: false, error: msg };
  }
}

export async function saveOrUpdateUndangan(
  item: Partial<UndanganOrangTua> & FormUndanganData,
  existingId?: string
): Promise<{ success: boolean; data?: UndanganOrangTua; isSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (!client) {
    return { success: false, isSupabase: false, error: 'Database Supabase belum terhubung.' };
  }

  const now = new Date().toISOString();
  const targetId = existingId || item.id || `undangan-${Date.now()}`;

  const payload: any = {
    id: targetId,
    updated_at: now,
    hari: item.hari,
    tanggal: item.tanggal,
    bulan: item.bulan,
    tahun: item.tahun,
    waktu: item.waktu,
    tempat_pelaksanaan: item.tempat_pelaksanaan || 'SMP Negeri 7 Pasuruan',
    kelas: item.kelas,
    nama_siswa: item.nama_siswa,
    nama_orang_tua: item.nama_orang_tua,
    pekerjaan_orang_tua: item.pekerjaan_orang_tua || '',
    alamat: item.alamat || '',
    perihal_undangan: item.perihal_undangan,
    uraian_permasalahan: item.uraian_permasalahan || '',
    tindak_lanjut: item.tindak_lanjut || '',
    link_foto_kegiatan: item.link_foto_kegiatan || '',
    keterangan: item.keterangan || '',
    nomor_surat: item.nomor_surat || '',
    tanggal_surat: item.tanggal_surat || item.tanggal,
    tempat_surat: item.tempat_surat || 'Pasuruan',
    semester: item.semester || '',
    nama_guru_bk: item.nama_guru_bk || getActiveGuruBK().nama,
    nip_guru_bk: item.nip_guru_bk || getActiveGuruBK().nip,
    nama_kepala_sekolah: item.nama_kepala_sekolah || 'NUR FADILAH, S.Pd,. M.Pd',
    nip_kepala_sekolah: item.nip_kepala_sekolah || '19860410 201001 2 030'
  };

  try {
    const { data, error } = await client
      .from(DEFAULT_UNDANGAN_TABLE_NAME)
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.error('Supabase saveOrUpdateUndangan error:', error.message);
      return { success: false, isSupabase: false, error: `Gagal menyimpan ke Supabase: ${error.message}` };
    }

    return {
      success: true,
      data: (data || { ...payload, created_at: item.created_at || now }) as UndanganOrangTua,
      isSupabase: true
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error koneksi Supabase';
    return { success: false, isSupabase: false, error: msg };
  }
}

export async function deleteUndanganItem(id: string): Promise<{ success: boolean; isSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (!client) return { success: false, isSupabase: false, error: 'Database belum terhubung.' };

  try {
    const { error } = await client.from(DEFAULT_UNDANGAN_TABLE_NAME).delete().eq('id', id);
    if (error) return { success: false, isSupabase: false, error: error.message };
    return { success: true, isSupabase: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal menghapus data';
    return { success: false, isSupabase: false, error: msg };
  }
}

/* ==========================================================================
   3. HOME VISIT / KUNJUNGAN RUMAH (Direct Supabase)
   ========================================================================== */

export async function fetchAllHomeVisit(): Promise<{ data: HomeVisit[]; isFromSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (!client) return { data: [], isFromSupabase: false, error: 'Supabase belum terhubung.' };

  try {
    const { data, error } = await client
      .from(DEFAULT_HOME_VISIT_TABLE_NAME)
      .select('*')
      .order('tanggal', { ascending: false });

    if (error) {
      console.error('Supabase fetchAllHomeVisit error:', error.message);
      return { data: [], isFromSupabase: false, error: error.message };
    }

    return { data: (data || []) as HomeVisit[], isFromSupabase: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal mengambil data Home Visit';
    return { data: [], isFromSupabase: false, error: msg };
  }
}

export async function saveOrUpdateHomeVisit(
  item: Partial<HomeVisit> & FormHomeVisitData,
  existingId?: string
): Promise<{ success: boolean; data?: HomeVisit; isSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (!client) {
    return { success: false, isSupabase: false, error: 'Database Supabase belum terhubung.' };
  }

  const now = new Date().toISOString();
  const targetId = existingId || item.id || `homevisit-${Date.now()}`;

  const payload: any = {
    id: targetId,
    updated_at: now,
    hari: item.hari,
    tanggal: item.tanggal,
    bulan: item.bulan,
    tahun: item.tahun,
    waktu: item.waktu,
    kelas: item.kelas,
    nama_siswa: item.nama_siswa,
    nama_orang_tua: item.nama_orang_tua,
    pekerjaan_orang_tua: item.pekerjaan_orang_tua || '',
    alamat: item.alamat || '',
    perihal_home_visit: item.perihal_home_visit,
    uraian_permasalahan: item.uraian_permasalahan || '',
    tindak_lanjut: item.tindak_lanjut || '',
    link_foto_kegiatan: item.link_foto_kegiatan || '',
    keterangan: item.keterangan || '',
    semester_laporan: item.semester_laporan || '',
    bidang_layanan: item.bidang_layanan || 'Pribadi & Sosial',
    topik_permasalahan: item.topik_permasalahan || '',
    fungsi_layanan: item.fungsi_layanan || 'Pengentasan / Advokasi',
    pihak_terlibat: item.pihak_terlibat || 'Guru BK, Wali Kelas, Orang Tua Siswa',
    tujuan_kegiatan: item.tujuan_kegiatan || '',
    gambaran_ringkas_masalah: item.gambaran_ringkas_masalah || '',
    alamat_kunjungan: item.alamat_kunjungan || item.alamat || '',
    hari_tanggal_lama_kunjungan: item.hari_tanggal_lama_kunjungan || '',
    anggota_keluarga_dikunjungi: item.anggota_keluarga_dikunjungi || item.nama_orang_tua || '',
    rencana_evaluasi: item.rencana_evaluasi || '',
    catatan_khusus: item.catatan_khusus || '',
    nama_guru_bk: item.nama_guru_bk || getActiveGuruBK().nama,
    nip_guru_bk: item.nip_guru_bk || getActiveGuruBK().nip,
    nama_kepala_sekolah: item.nama_kepala_sekolah || 'NUR FADILAH, S.Pd,. M.Pd',
    nip_kepala_sekolah: item.nip_kepala_sekolah || '19860410 201001 2 030',
    tanggal_surat: item.tanggal_surat || item.tanggal,
    tempat_surat: item.tempat_surat || 'Pasuruan',
    nomor_surat_tugas: item.nomor_surat_tugas || '',
    petugas_1: item.petugas_1 || getActiveGuruBK().nama,
    petugas_2: item.petugas_2 || '',
    jabatan_petugas_1: item.jabatan_petugas_1 || 'Guru BK',
    jabatan_petugas_2: item.jabatan_petugas_2 || 'Wali Kelas',
    nis_siswa: item.nis_siswa || '',
    tanggal_surat_tugas: item.tanggal_surat_tugas || item.tanggal,
    petugas_penerima_kunjungan: item.petugas_penerima_kunjungan || item.nama_orang_tua || '',
    tanggal_pernyataan_ortu: item.tanggal_pernyataan_ortu || item.tanggal
  };

  try {
    const { data, error } = await client
      .from(DEFAULT_HOME_VISIT_TABLE_NAME)
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.error('Supabase saveOrUpdateHomeVisit error:', error.message);
      return { success: false, isSupabase: false, error: `Gagal menyimpan ke Supabase: ${error.message}` };
    }

    return {
      success: true,
      data: (data || { ...payload, created_at: item.created_at || now }) as HomeVisit,
      isSupabase: true
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error koneksi Supabase';
    return { success: false, isSupabase: false, error: msg };
  }
}

export async function deleteHomeVisitItem(id: string): Promise<{ success: boolean; isSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (!client) return { success: false, isSupabase: false, error: 'Database belum terhubung.' };

  try {
    const { error } = await client.from(DEFAULT_HOME_VISIT_TABLE_NAME).delete().eq('id', id);
    if (error) return { success: false, isSupabase: false, error: error.message };
    return { success: true, isSupabase: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal menghapus data';
    return { success: false, isSupabase: false, error: msg };
  }
}

/* ==========================================================================
   4. REKAM PERMASALAHAN SISWA (Direct Supabase)
   ========================================================================== */

export async function fetchAllRekamPermasalahan(): Promise<{ data: RekamPermasalahan[]; isFromSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (!client) return { data: [], isFromSupabase: false, error: 'Supabase belum terhubung.' };

  try {
    const { data, error } = await client
      .from(DEFAULT_REKAM_PERMASALAHAN_TABLE_NAME)
      .select('*')
      .order('tanggal', { ascending: false });

    if (error) {
      console.error('Supabase fetchAllRekamPermasalahan error:', error.message);
      return { data: [], isFromSupabase: false, error: error.message };
    }

    return { data: (data || []) as RekamPermasalahan[], isFromSupabase: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal mengambil data Rekam Permasalahan';
    return { data: [], isFromSupabase: false, error: msg };
  }
}

export async function saveOrUpdateRekamPermasalahan(
  item: Partial<RekamPermasalahan> & FormRekamPermasalahanData,
  existingId?: string
): Promise<{ success: boolean; data?: RekamPermasalahan; isSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (!client) {
    return { success: false, isSupabase: false, error: 'Database Supabase belum terhubung.' };
  }

  const now = new Date().toISOString();
  const targetId = existingId || item.id || `rekam-${Date.now()}`;

  const payload: any = {
    id: targetId,
    updated_at: now,
    hari: item.hari,
    tanggal: item.tanggal,
    bulan: item.bulan,
    tahun: item.tahun,
    waktu: item.waktu,
    kelas: item.kelas,
    nama_siswa: item.nama_siswa,
    nama_orang_tua: item.nama_orang_tua || '',
    pekerjaan_orang_tua: item.pekerjaan_orang_tua || '',
    alamat: item.alamat || '',
    ringkasan_uraian_permasalahan: item.ringkasan_uraian_permasalahan || '',
    upaya_konselor_walikelas: item.upaya_konselor_walikelas || '',
    hasil_dan_kesimpulan: item.hasil_dan_kesimpulan || '',
    link_foto_kegiatan: item.link_foto_kegiatan || '',
    keterangan: item.keterangan || '',
    nama_guru_bk: item.nama_guru_bk || getActiveGuruBK().nama,
    nip_guru_bk: item.nip_guru_bk || getActiveGuruBK().nip,
    nama_kepala_sekolah: item.nama_kepala_sekolah || 'NUR FADILAH, S.Pd,. M.Pd',
    nip_kepala_sekolah: item.nip_kepala_sekolah || '19860410 201001 2 030',
    tanggal_surat: item.tanggal_surat || item.tanggal,
    tempat_surat: item.tempat_surat || 'Pasuruan'
  };

  try {
    const { data, error } = await client
      .from(DEFAULT_REKAM_PERMASALAHAN_TABLE_NAME)
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.error('Supabase saveOrUpdateRekamPermasalahan error:', error.message);
      return { success: false, isSupabase: false, error: `Gagal menyimpan ke Supabase: ${error.message}` };
    }

    return {
      success: true,
      data: (data || { ...payload, created_at: item.created_at || now }) as RekamPermasalahan,
      isSupabase: true
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error koneksi Supabase';
    return { success: false, isSupabase: false, error: msg };
  }
}

export async function deleteRekamPermasalahanItem(id: string): Promise<{ success: boolean; isSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (!client) return { success: false, isSupabase: false, error: 'Database belum terhubung.' };

  try {
    const { error } = await client.from(DEFAULT_REKAM_PERMASALAHAN_TABLE_NAME).delete().eq('id', id);
    if (error) return { success: false, isSupabase: false, error: error.message };
    return { success: true, isSupabase: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal menghapus data';
    return { success: false, isSupabase: false, error: msg };
  }
}

/* ==========================================================================
   5. RENCANA KONSELING INDIVIDU (Direct Supabase)
   ========================================================================== */

export async function fetchAllKonselingIndividu(): Promise<{ data: KonselingIndividu[]; isFromSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (!client) return { data: [], isFromSupabase: false, error: 'Supabase belum terhubung.' };

  try {
    const { data, error } = await client
      .from(DEFAULT_KONSELING_INDIVIDU_TABLE_NAME)
      .select('*')
      .order('tanggal', { ascending: false });

    if (error) {
      console.error('Supabase fetchAllKonselingIndividu error:', error.message);
      return { data: [], isFromSupabase: false, error: error.message };
    }

    return { data: (data || []) as KonselingIndividu[], isFromSupabase: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal mengambil data Konseling Individu';
    return { data: [], isFromSupabase: false, error: msg };
  }
}

export async function saveOrUpdateKonselingIndividu(
  item: Partial<KonselingIndividu> & FormKonselingIndividuData,
  existingId?: string
): Promise<{ success: boolean; data?: KonselingIndividu; isSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (!client) {
    return { success: false, isSupabase: false, error: 'Database Supabase belum terhubung.' };
  }

  const now = new Date().toISOString();
  const targetId = existingId || item.id || `konseling-ind-${Date.now()}`;

  const payload: any = {
    id: targetId,
    updated_at: now,
    hari: item.hari,
    tanggal: item.tanggal,
    bulan: item.bulan,
    tahun: item.tahun,
    waktu: item.waktu,
    kelas: item.kelas,
    nama_siswa: item.nama_siswa,
    topik_permasalahan: item.topik_permasalahan || '',
    media_yang_diperlukan: item.media_yang_diperlukan || '',
    ringkasan_uraian_permasalahan: item.ringkasan_uraian_permasalahan || '',
    pendekatan_dan_teknik_konseling: item.pendekatan_dan_teknik_konseling || '',
    hasil_yang_dicapai: item.hasil_yang_dicapai || '',
    link_foto_kegiatan: item.link_foto_kegiatan || '',
    keterangan: item.keterangan || '',
    nama_guru_bk: item.nama_guru_bk || getActiveGuruBK().nama,
    nip_guru_bk: item.nip_guru_bk || getActiveGuruBK().nip,
    nama_kepala_sekolah: item.nama_kepala_sekolah || 'NUR FADILAH, S.Pd,. M.Pd',
    nip_kepala_sekolah: item.nip_kepala_sekolah || '19860410 201001 2 030'
  };

  try {
    const { data, error } = await client
      .from(DEFAULT_KONSELING_INDIVIDU_TABLE_NAME)
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.error('Supabase saveOrUpdateKonselingIndividu error:', error.message);
      return { success: false, isSupabase: false, error: `Gagal menyimpan ke Supabase: ${error.message}` };
    }

    return {
      success: true,
      data: (data || { ...payload, created_at: item.created_at || now }) as KonselingIndividu,
      isSupabase: true
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error koneksi Supabase';
    return { success: false, isSupabase: false, error: msg };
  }
}

export async function deleteKonselingIndividuItem(id: string): Promise<{ success: boolean; isSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (!client) return { success: false, isSupabase: false, error: 'Database belum terhubung.' };

  try {
    const { error } = await client.from(DEFAULT_KONSELING_INDIVIDU_TABLE_NAME).delete().eq('id', id);
    if (error) return { success: false, isSupabase: false, error: error.message };
    return { success: true, isSupabase: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal menghapus data';
    return { success: false, isSupabase: false, error: msg };
  }
}

/* ==========================================================================
   6. RENCANA KONSELING KELOMPOK (Direct Supabase)
   ========================================================================== */

export async function fetchAllKonselingKelompok(): Promise<{ data: KonselingKelompok[]; isFromSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (!client) return { data: [], isFromSupabase: false, error: 'Supabase belum terhubung.' };

  try {
    const { data, error } = await client
      .from(DEFAULT_KONSELING_KELOMPOK_TABLE_NAME)
      .select('*')
      .order('tanggal', { ascending: false });

    if (error) {
      console.error('Supabase fetchAllKonselingKelompok error:', error.message);
      return { data: [], isFromSupabase: false, error: error.message };
    }

    return { data: (data || []) as KonselingKelompok[], isFromSupabase: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal mengambil data Konseling Kelompok';
    return { data: [], isFromSupabase: false, error: msg };
  }
}

export async function saveOrUpdateKonselingKelompok(
  item: Partial<KonselingKelompok> & FormKonselingKelompokData,
  existingId?: string
): Promise<{ success: boolean; data?: KonselingKelompok; isSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (!client) {
    return { success: false, isSupabase: false, error: 'Database Supabase belum terhubung.' };
  }

  const now = new Date().toISOString();
  const targetId = existingId || item.id || `konseling-kel-${Date.now()}`;

  const payload: any = {
    id: targetId,
    updated_at: now,
    hari: item.hari,
    tanggal: item.tanggal,
    bulan: item.bulan,
    tahun: item.tahun,
    waktu: item.waktu,
    kelas: item.kelas,
    nama_siswa: item.nama_siswa,
    topik_permasalahan: item.topik_permasalahan || '',
    media_yang_diperlukan: item.media_yang_diperlukan || '',
    ringkasan_uraian_permasalahan: item.ringkasan_uraian_permasalahan || '',
    pendekatan_dan_teknik_konseling: item.pendekatan_dan_teknik_konseling || '',
    hasil_yang_dicapai: item.hasil_yang_dicapai || '',
    link_foto_kegiatan: item.link_foto_kegiatan || '',
    keterangan: item.keterangan || '',
    nama_guru_bk: item.nama_guru_bk || getActiveGuruBK().nama,
    nip_guru_bk: item.nip_guru_bk || getActiveGuruBK().nip,
    nama_kepala_sekolah: item.nama_kepala_sekolah || 'NUR FADILAH, S.Pd,. M.Pd',
    nip_kepala_sekolah: item.nip_kepala_sekolah || '19860410 201001 2 030'
  };

  try {
    const { data, error } = await client
      .from(DEFAULT_KONSELING_KELOMPOK_TABLE_NAME)
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.error('Supabase saveOrUpdateKonselingKelompok error:', error.message);
      return { success: false, isSupabase: false, error: `Gagal menyimpan ke Supabase: ${error.message}` };
    }

    return {
      success: true,
      data: (data || { ...payload, created_at: item.created_at || now }) as KonselingKelompok,
      isSupabase: true
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error koneksi Supabase';
    return { success: false, isSupabase: false, error: msg };
  }
}

export async function deleteKonselingKelompokItem(id: string): Promise<{ success: boolean; isSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (!client) return { success: false, isSupabase: false, error: 'Database belum terhubung.' };

  try {
    const { error } = await client.from(DEFAULT_KONSELING_KELOMPOK_TABLE_NAME).delete().eq('id', id);
    if (error) return { success: false, isSupabase: false, error: error.message };
    return { success: true, isSupabase: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal menghapus data';
    return { success: false, isSupabase: false, error: msg };
  }
}

/* ==========================================================================
   7. SURAT PERNYATAAN SISWA / ORTU (Direct Supabase)
   ========================================================================== */

export async function fetchAllSuratPernyataan(): Promise<{ data: SuratPernyataan[]; isFromSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (!client) return { data: [], isFromSupabase: false, error: 'Supabase belum terhubung.' };

  try {
    const { data, error } = await client
      .from(DEFAULT_SURAT_PERNYATAAN_TABLE_NAME)
      .select('*')
      .order('tanggal_surat', { ascending: false });

    if (error) {
      console.error('Supabase fetchAllSuratPernyataan error:', error.message);
      return { data: [], isFromSupabase: false, error: error.message };
    }

    return { data: (data || []) as SuratPernyataan[], isFromSupabase: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal mengambil data Surat Pernyataan';
    return { data: [], isFromSupabase: false, error: msg };
  }
}

export async function saveOrUpdateSuratPernyataan(
  item: Partial<SuratPernyataan> & FormSuratPernyataanData,
  existingId?: string
): Promise<{ success: boolean; data?: SuratPernyataan; isSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (!client) {
    return { success: false, isSupabase: false, error: 'Database Supabase belum terhubung.' };
  }

  const now = new Date().toISOString();
  const targetId = existingId || item.id || `sp-${Date.now()}`;

  const payload: any = {
    id: targetId,
    updated_at: now,
    jenis_sp: item.jenis_sp,
    nama_siswa: item.nama_siswa,
    kelas: item.kelas || '',
    nama_siswa_2: item.nama_siswa_2 || '',
    kelas_2: item.kelas_2 || '',
    hari_tanggal_kejadian: item.hari_tanggal_kejadian || '',
    tahun_ajaran: item.tahun_ajaran || '2026-2027',
    jabatan_pengetahu: item.jabatan_pengetahu || 'Guru BK / Wali Kelas',
    nama_orang_tua: item.nama_orang_tua || '',
    pekerjaan_orang_tua: item.pekerjaan_orang_tua || '',
    alamat_orang_tua: item.alamat_orang_tua || '',
    hubungan_keluarga: item.hubungan_keluarga || '',
    peraturan_diketahui: item.peraturan_diketahui || '',
    alasan_pengunduran: item.alasan_pengunduran || '',
    tanggal_surat: item.tanggal_surat || new Date().toISOString().split('T')[0],
    tempat_surat: item.tempat_surat || 'Pasuruan',
    keterangan: item.keterangan || '',
    nama_guru_bk: item.nama_guru_bk || getActiveGuruBK().nama,
    nip_guru_bk: item.nip_guru_bk || getActiveGuruBK().nip,
    nama_kepala_sekolah: item.nama_kepala_sekolah || 'NUR FADILAH, S.Pd,. M.Pd',
    nip_kepala_sekolah: item.nip_kepala_sekolah || '19860410 201001 2 030'
  };

  try {
    const { data, error } = await client
      .from(DEFAULT_SURAT_PERNYATAAN_TABLE_NAME)
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.error('Supabase saveOrUpdateSuratPernyataan error:', error.message);
      return { success: false, isSupabase: false, error: `Gagal menyimpan ke Supabase: ${error.message}` };
    }

    return {
      success: true,
      data: (data || { ...payload, created_at: item.created_at || now }) as SuratPernyataan,
      isSupabase: true
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error koneksi Supabase';
    return { success: false, isSupabase: false, error: msg };
  }
}

export async function deleteSuratPernyataanItem(id: string): Promise<{ success: boolean; isSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (!client) return { success: false, isSupabase: false, error: 'Database belum terhubung.' };

  try {
    const { error } = await client.from(DEFAULT_SURAT_PERNYATAAN_TABLE_NAME).delete().eq('id', id);
    if (error) return { success: false, isSupabase: false, error: error.message };
    return { success: true, isSupabase: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal menghapus data';
    return { success: false, isSupabase: false, error: msg };
  }
}

/* ==========================================================================
   8. KONFERENSI KASUS SISWA (Direct Supabase)
   ========================================================================== */

export async function fetchAllKonferensiKasus(): Promise<{ data: KonferensiKasus[]; isFromSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (!client) return { data: [], isFromSupabase: false, error: 'Supabase belum terhubung.' };

  try {
    const { data, error } = await client
      .from(DEFAULT_KONFERENSI_KASUS_TABLE_NAME)
      .select('*')
      .order('tanggal_surat', { ascending: false });

    if (error) {
      console.error('Supabase fetchAllKonferensiKasus error:', error.message);
      return { data: [], isFromSupabase: false, error: error.message };
    }

    return { data: (data || []) as KonferensiKasus[], isFromSupabase: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal mengambil data Konferensi Kasus';
    return { data: [], isFromSupabase: false, error: msg };
  }
}

export async function saveOrUpdateKonferensiKasus(
  item: Partial<KonferensiKasus> & FormKonferensiKasusData,
  existingId?: string
): Promise<{ success: boolean; data?: KonferensiKasus; isSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (!client) {
    return { success: false, isSupabase: false, error: 'Database Supabase belum terhubung.' };
  }

  const now = new Date().toISOString();
  const targetId = existingId || item.id || `kk-${Date.now()}`;

  const payload: any = {
    id: targetId,
    updated_at: now,
    nama_konseli: item.nama_konseli,
    kelas_ta: item.kelas_ta || '',
    jenis_masalah: item.jenis_masalah || '',
    hari_tgl_jam: item.hari_tgl_jam || '',
    pemandu_konferensi: item.pemandu_konferensi || 'Guru Pembimbing / Konselor',
    pemandu_nama: item.pemandu_nama || getActiveGuruBK().nama,
    pemandu_jabatan: item.pemandu_jabatan || 'Guru BK',
    data_ingin_diperoleh: item.data_ingin_diperoleh || '',
    uraian_kegiatan_inti: item.uraian_kegiatan_inti || '',
    data_diperoleh_simpulan: item.data_diperoleh_simpulan || '',
    keterpenuhan_kebutuhan_data: item.keterpenuhan_kebutuhan_data || 'Memadai',
    rujukan_pelayanan: item.rujukan_pelayanan || 'Konseling Lanjutan',
    rapat_nama_sekolah: item.rapat_nama_sekolah || 'SMP Negeri 7 Pasuruan',
    rapat_alamat: item.rapat_alamat || 'Kota Pasuruan',
    rapat_tempat: item.rapat_tempat || 'Ruang BK SMPN 7 Pasuruan',
    rapat_ketua: item.rapat_ketua || getActiveGuruBK().nama,
    rapat_jumlah_hadir: item.rapat_jumlah_hadir || '5',
    rapat_dimulai_pukul: item.rapat_dimulai_pukul || '08.00 WIB',
    rapat_diakhiri_pukul: item.rapat_diakhiri_pukul || '09.30 WIB',
    rapat_hasil_pertemuan: item.rapat_hasil_pertemuan || '',
    daftar_hadir_peserta_singkat: item.daftar_hadir_peserta_singkat || '',
    daftar_hadir_rows: item.daftar_hadir_rows || '[]',
    tanggal_surat: item.tanggal_surat || new Date().toISOString().split('T')[0],
    tempat_surat: item.tempat_surat || 'Pasuruan',
    nama_guru_bk: item.nama_guru_bk || getActiveGuruBK().nama,
    nip_guru_bk: item.nip_guru_bk || getActiveGuruBK().nip,
    nama_kepala_sekolah: item.nama_kepala_sekolah || 'NUR FADILAH, S.Pd,. M.Pd',
    nip_kepala_sekolah: item.nip_kepala_sekolah || '19860410 201001 2 030',
    keterangan: item.keterangan || ''
  };

  try {
    const { data, error } = await client
      .from(DEFAULT_KONFERENSI_KASUS_TABLE_NAME)
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.error('Supabase saveOrUpdateKonferensiKasus error:', error.message);
      return { success: false, isSupabase: false, error: `Gagal menyimpan ke Supabase: ${error.message}` };
    }

    return {
      success: true,
      data: (data || { ...payload, created_at: item.created_at || now }) as KonferensiKasus,
      isSupabase: true
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error koneksi Supabase';
    return { success: false, isSupabase: false, error: msg };
  }
}

export async function deleteKonferensiKasusItem(id: string): Promise<{ success: boolean; isSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (!client) return { success: false, isSupabase: false, error: 'Database belum terhubung.' };

  try {
    const { error } = await client.from(DEFAULT_KONFERENSI_KASUS_TABLE_NAME).delete().eq('id', id);
    if (error) return { success: false, isSupabase: false, error: error.message };
    return { success: true, isSupabase: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal menghapus data';
    return { success: false, isSupabase: false, error: msg };
  }
}

/* ==========================================================================
   9. DATA MANAGEMENT SISWA (Direct Supabase - Multi Table & Multi Column Resolver)
   ========================================================================== */

export const SISWA_TABLE_CANDIDATES = [
  'siswa_BK',
  'siswa_bk',
  'Siswa_BK',
  'Siswa_bk',
  'siswa',
  'Siswa',
  'data_siswa',
  'Data_Siswa'
];

let cachedActiveSiswaTable: string | null = null;

export function getActiveSiswaTableName(): string {
  return cachedActiveSiswaTable || 'siswa_BK';
}

export function setActiveSiswaTableName(name: string) {
  cachedActiveSiswaTable = name;
}

/**
 * Robust mapper for student record from Supabase table
 * Handles any casing, alternative column naming, or missing columns
 */
export function mapSupabaseRowToSiswa(row: any, index: number = 0): Siswa {
  if (!row || typeof row !== 'object') {
    return {
      id: `siswa-${Date.now()}-${index}`,
      nama_siswa: '',
      kelas: '',
      nis: '',
      jenis_kelamin: 'Laki-laki',
      keterangan: ''
    };
  }

  // 1. Extract ID
  const id =
    row.id ||
    row.ID ||
    row.Id ||
    row.uuid ||
    row.UUID ||
    `siswa-${Date.now()}-${index}`;

  // 2. Extract Nama Siswa (Case-insensitive & various column aliases)
  const nama_siswa =
    row.nama_siswa ||
    row.nama ||
    row.nama_lengkap ||
    row.nama_murid ||
    row.nama_peserta_didik ||
    row.Nama_Siswa ||
    row.Nama ||
    row.Nama_Lengkap ||
    row.NAMA_SISWA ||
    row.NAMA ||
    row.name ||
    row.Name ||
    row.student_name ||
    row.Student_Name ||
    '';

  // 3. Extract Kelas (Handles '8-A', 'VIII A', '8A', 'rombel', etc.)
  const kelas =
    row.kelas ||
    row.Kelas ||
    row.KELAS ||
    row.rombel ||
    row.Rombel ||
    row.ROMBEL ||
    row.kelas_rombel ||
    row.class ||
    row.Class ||
    row.tingkat_kelas ||
    '';

  // 4. Extract NIS / NISN
  const nis =
    row.nis ||
    row.NIS ||
    row.nisn ||
    row.NISN ||
    row.no_induk ||
    row.nomor_induk ||
    row.No_Induk ||
    row.nis_siswa ||
    '';

  // 5. Extract & Normalize Jenis Kelamin
  const rawJk =
    row.jenis_kelamin ||
    row.Jenis_Kelamin ||
    row.JENIS_KELAMIN ||
    row.jk ||
    row.JK ||
    row.gender ||
    row.Gender ||
    row.l_p ||
    row.L_P ||
    row.sex ||
    '';

  let jenis_kelamin = 'Laki-laki';
  const cleanJk = String(rawJk).trim().toUpperCase();
  if (
    cleanJk === 'P' ||
    cleanJk.startsWith('PEREMPUAN') ||
    cleanJk.startsWith('FEMALE') ||
    cleanJk === 'W'
  ) {
    jenis_kelamin = 'Perempuan';
  } else if (
    cleanJk === 'L' ||
    cleanJk.startsWith('LAKI') ||
    cleanJk.startsWith('MALE') ||
    cleanJk === 'PRIA'
  ) {
    jenis_kelamin = 'Laki-laki';
  } else if (cleanJk) {
    jenis_kelamin = String(rawJk).trim();
  }

  // 6. Extract Keterangan / Notes / Alamat
  const keterangan =
    row.keterangan ||
    row.Keterangan ||
    row.KETERANGAN ||
    row.ket ||
    row.Ket ||
    row.catatan ||
    row.notes ||
    row.alamat ||
    row.nama_orang_tua ||
    '';

  return {
    id: String(id),
    created_at: row.created_at || row.createdAt || new Date().toISOString(),
    updated_at: row.updated_at || row.updatedAt || new Date().toISOString(),
    nama_siswa: String(nama_siswa).trim(),
    kelas: String(kelas).trim(),
    nis: String(nis).trim(),
    jenis_kelamin,
    keterangan: keterangan ? String(keterangan).trim() : ''
  };
}

export async function fetchSiswaList(): Promise<{ data: Siswa[]; isFromSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (!client) return { data: [], isFromSupabase: false, error: 'Supabase belum terhubung.' };

  // Candidates in priority order
  const candidateTables = [
    'siswa_BK',
    'siswa_bk',
    'Siswa_BK',
    'Siswa_bk',
    'siswa',
    'Siswa',
    'data_siswa'
  ];

  let lastErrorMessage = '';

  for (const tableName of candidateTables) {
    try {
      const { data, error } = await client
        .from(tableName)
        .select('*');

      if (!error && Array.isArray(data)) {
        setActiveSiswaTableName(tableName);
        
        const mappedData = data
          .map((row, idx) => mapSupabaseRowToSiswa(row, idx))
          .filter((s) => s.nama_siswa.length > 0 || s.nis.length > 0)
          .sort((a, b) => {
            const classCompare = (a.kelas || '').localeCompare(b.kelas || '', undefined, { numeric: true });
            if (classCompare !== 0) return classCompare;
            return (a.nama_siswa || '').localeCompare(b.nama_siswa || '');
          });

        return { data: mappedData, isFromSupabase: true };
      } else if (error) {
        lastErrorMessage = error.message;
      }
    } catch (err) {
      lastErrorMessage = err instanceof Error ? err.message : 'Error query table ' + tableName;
    }
  }

  return {
    data: [],
    isFromSupabase: false,
    error: lastErrorMessage || 'Tabel data siswa (siswa_BK / siswa_bk) tidak dapat diakses di Supabase.'
  };
}

export async function saveOrUpdateSiswa(
  item: Partial<Siswa> & FormSiswaData,
  existingId?: string
): Promise<{ success: boolean; data?: Siswa; isSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (!client) {
    return { success: false, isSupabase: false, error: 'Database Supabase belum terhubung.' };
  }

  const now = new Date().toISOString();
  const targetId = existingId || item.id || `siswa-${Date.now()}`;

  const payload: any = {
    id: targetId,
    updated_at: now,
    nama_siswa: item.nama_siswa,
    kelas: item.kelas,
    nis: item.nis,
    jenis_kelamin: item.jenis_kelamin,
    keterangan: item.keterangan || ''
  };

  const targetTables = [
    getActiveSiswaTableName(),
    'siswa_BK',
    'siswa_bk',
    'Siswa_BK',
    'siswa'
  ];

  const uniqueTables = Array.from(new Set(targetTables));

  for (const tableName of uniqueTables) {
    try {
      const { data, error } = await client
        .from(tableName)
        .upsert(payload, { onConflict: 'id' })
        .select()
        .single();

      if (!error) {
        setActiveSiswaTableName(tableName);
        return {
          success: true,
          data: (data ? mapSupabaseRowToSiswa(data) : { ...payload, created_at: item.created_at || now }) as Siswa,
          isSupabase: true
        };
      }
    } catch {
      // try next candidate
    }
  }

  return { success: false, isSupabase: false, error: 'Gagal menyimpan data siswa ke tabel siswa_BK di Supabase' };
}

export async function bulkSaveOrUpdateSiswa(
  students: Omit<Siswa, 'id' | 'created_at' | 'updated_at'>[]
): Promise<{ success: boolean; count: number; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (!client) {
    return { success: false, count: 0, error: 'Database Supabase belum terhubung.' };
  }

  const now = new Date().toISOString();
  const payloadRows = students.map((s, idx) => ({
    id: `siswa-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 7)}`,
    created_at: now,
    updated_at: now,
    nama_siswa: s.nama_siswa,
    kelas: s.kelas,
    nis: s.nis,
    jenis_kelamin: s.jenis_kelamin,
    keterangan: s.keterangan || ''
  }));

  const targetTables = [
    getActiveSiswaTableName(),
    'siswa_BK',
    'siswa_bk',
    'Siswa_BK',
    'siswa'
  ];

  const uniqueTables = Array.from(new Set(targetTables));

  for (const tableName of uniqueTables) {
    try {
      const { error } = await client.from(tableName).upsert(payloadRows, { onConflict: 'id' });
      if (!error) {
        setActiveSiswaTableName(tableName);
        return { success: true, count: payloadRows.length };
      }
    } catch {
      // try next
    }
  }

  return { success: false, count: 0, error: 'Gagal import massal siswa ke tabel siswa_BK di Supabase' };
}

export async function deleteSiswaItem(id: string): Promise<{ success: boolean; isSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (!client) return { success: false, isSupabase: false, error: 'Database belum terhubung.' };

  const targetTables = [
    getActiveSiswaTableName(),
    'siswa_BK',
    'siswa_bk',
    'Siswa_BK',
    'siswa'
  ];

  const uniqueTables = Array.from(new Set(targetTables));

  for (const tableName of uniqueTables) {
    try {
      const { error } = await client.from(tableName).delete().eq('id', id);
      if (!error) {
        setActiveSiswaTableName(tableName);
        return { success: true, isSupabase: true };
      }
    } catch {
      // try next
    }
  }

  return { success: false, isSupabase: false, error: 'Gagal menghapus data siswa dari Supabase' };
}

/* ==========================================================================
   10. JURNAL LAYANAN BK (Direct Supabase)
   ========================================================================== */

export async function fetchAllJurnalBK(): Promise<{ data: JurnalBK[]; isFromSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (!client) return { data: [], isFromSupabase: false, error: 'Supabase belum terhubung.' };

  try {
    const { data, error } = await client
      .from(DEFAULT_JURNAL_BK_TABLE_NAME)
      .select('*')
      .order('tanggal', { ascending: false });

    if (error) {
      console.error('Supabase fetchAllJurnalBK error:', error.message);
      return { data: [], isFromSupabase: false, error: error.message };
    }

    const formattedData: JurnalBK[] = (data || []).map((row: any) => {
      let siswaParsed: string[] = [];
      try {
        if (row.siswa_tidak_mengikuti_json) {
          siswaParsed = typeof row.siswa_tidak_mengikuti_json === 'string'
            ? JSON.parse(row.siswa_tidak_mengikuti_json)
            : row.siswa_tidak_mengikuti_json;
        }
      } catch {
        siswaParsed = [];
      }

      return {
        ...row,
        siswa_tidak_mengikuti: Array.isArray(siswaParsed) ? siswaParsed : []
      };
    });

    return { data: formattedData, isFromSupabase: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal mengambil data Jurnal BK';
    return { data: [], isFromSupabase: false, error: msg };
  }
}

export async function saveOrUpdateJurnalBK(
  item: Partial<JurnalBK> & FormJurnalBKData,
  existingId?: string
): Promise<{ success: boolean; data?: JurnalBK; isSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (!client) {
    return { success: false, isSupabase: false, error: 'Database Supabase belum terhubung.' };
  }

  const now = new Date().toISOString();
  const targetId = existingId || item.id || `jurnal-${Date.now()}`;

  const payloadRow: any = {
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

  try {
    const { data, error } = await client
      .from(DEFAULT_JURNAL_BK_TABLE_NAME)
      .upsert(payloadRow, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.error('Supabase saveOrUpdateJurnalBK error:', error.message);
      return { success: false, isSupabase: false, error: `Gagal menyimpan ke Supabase: ${error.message}` };
    }

    const formattedObject: JurnalBK = {
      ...item,
      id: targetId,
      created_at: item.created_at || now,
      updated_at: now
    };

    return {
      success: true,
      data: formattedObject,
      isSupabase: true
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error koneksi Supabase';
    return { success: false, isSupabase: false, error: msg };
  }
}

export async function deleteJurnalBKItem(id: string): Promise<{ success: boolean; isSupabase: boolean; error?: string }> {
  const config = getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (!client) return { success: false, isSupabase: false, error: 'Database belum terhubung.' };

  try {
    const { error } = await client.from(DEFAULT_JURNAL_BK_TABLE_NAME).delete().eq('id', id);
    if (error) return { success: false, isSupabase: false, error: error.message };
    return { success: true, isSupabase: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal menghapus data Jurnal BK';
    return { success: false, isSupabase: false, error: msg };
  }
}

/* ==========================================================================
   SQL Script Generator & Multi-Table Diagnostic Tool
   ========================================================================== */

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
-- 1. TABEL TANDA TANGAN (signatures_bk)
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

alter table public.signatures_bk enable row level security;
drop policy if exists "Akses Baca Publik Signatures" on public.signatures_bk;
drop policy if exists "Akses Tambah Publik Signatures" on public.signatures_bk;
drop policy if exists "Akses Update Publik Signatures" on public.signatures_bk;
drop policy if exists "Akses Hapus Publik Signatures" on public.signatures_bk;

create policy "Akses Baca Publik Signatures" on public.signatures_bk for select using (true);
create policy "Akses Tambah Publik Signatures" on public.signatures_bk for insert with check (true);
create policy "Akses Update Publik Signatures" on public.signatures_bk for update using (true);
create policy "Akses Hapus Publik Signatures" on public.signatures_bk for delete using (true);

--------------------------------------------------------------------------------
-- 2. TABEL A: AGENDA KERJA BK (${tableName})
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
drop policy if exists "Akses Baca Publik Agenda BK" on public.${tableName};
drop policy if exists "Akses Tambah Publik Agenda BK" on public.${tableName};
drop policy if exists "Akses Update Publik Agenda BK" on public.${tableName};
drop policy if exists "Akses Hapus Publik Agenda BK" on public.${tableName};

create policy "Akses Baca Publik Agenda BK" on public.${tableName} for select using (true);
create policy "Akses Tambah Publik Agenda BK" on public.${tableName} for insert with check (true);
create policy "Akses Update Publik Agenda BK" on public.${tableName} for update using (true);
create policy "Akses Hapus Publik Agenda BK" on public.${tableName} for delete using (true);

--------------------------------------------------------------------------------
-- 3. TABEL B: UNDANGAN ORANG TUA SISWA (${undanganTableName})
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
drop policy if exists "Akses Baca Publik Undangan Ortu" on public.${undanganTableName};
drop policy if exists "Akses Tambah Publik Undangan Ortu" on public.${undanganTableName};
drop policy if exists "Akses Update Publik Undangan Ortu" on public.${undanganTableName};
drop policy if exists "Akses Hapus Publik Undangan Ortu" on public.${undanganTableName};

create policy "Akses Baca Publik Undangan Ortu" on public.${undanganTableName} for select using (true);
create policy "Akses Tambah Publik Undangan Ortu" on public.${undanganTableName} for insert with check (true);
create policy "Akses Update Publik Undangan Ortu" on public.${undanganTableName} for update using (true);
create policy "Akses Hapus Publik Undangan Ortu" on public.${undanganTableName} for delete using (true);

--------------------------------------------------------------------------------
-- 4. TABEL C: HOME VISIT / KUNJUNGAN RUMAH (${homeVisitTableName})
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
drop policy if exists "Akses Baca Publik Home Visit" on public.${homeVisitTableName};
drop policy if exists "Akses Tambah Publik Home Visit" on public.${homeVisitTableName};
drop policy if exists "Akses Update Publik Home Visit" on public.${homeVisitTableName};
drop policy if exists "Akses Hapus Publik Home Visit" on public.${homeVisitTableName};

create policy "Akses Baca Publik Home Visit" on public.${homeVisitTableName} for select using (true);
create policy "Akses Tambah Publik Home Visit" on public.${homeVisitTableName} for insert with check (true);
create policy "Akses Update Publik Home Visit" on public.${homeVisitTableName} for update using (true);
create policy "Akses Hapus Publik Home Visit" on public.${homeVisitTableName} for delete using (true);

--------------------------------------------------------------------------------
-- 5. TABEL D: REKAM PERMASALAHAN SISWA (${rekamPermasalahanTableName})
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
drop policy if exists "Akses Baca Publik Rekam Permasalahan" on public.${rekamPermasalahanTableName};
drop policy if exists "Akses Tambah Publik Rekam Permasalahan" on public.${rekamPermasalahanTableName};
drop policy if exists "Akses Update Publik Rekam Permasalahan" on public.${rekamPermasalahanTableName};
drop policy if exists "Akses Hapus Publik Rekam Permasalahan" on public.${rekamPermasalahanTableName};

create policy "Akses Baca Publik Rekam Permasalahan" on public.${rekamPermasalahanTableName} for select using (true);
create policy "Akses Tambah Publik Rekam Permasalahan" on public.${rekamPermasalahanTableName} for insert with check (true);
create policy "Akses Update Publik Rekam Permasalahan" on public.${rekamPermasalahanTableName} for update using (true);
create policy "Akses Hapus Publik Rekam Permasalahan" on public.${rekamPermasalahanTableName} for delete using (true);

--------------------------------------------------------------------------------
-- 6. TABEL E: RENCANA KONSELING INDIVIDU (${konselingIndividuTableName})
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
drop policy if exists "Akses Baca Publik Konseling Individu" on public.${konselingIndividuTableName};
drop policy if exists "Akses Tambah Publik Konseling Individu" on public.${konselingIndividuTableName};
drop policy if exists "Akses Update Publik Konseling Individu" on public.${konselingIndividuTableName};
drop policy if exists "Akses Hapus Publik Konseling Individu" on public.${konselingIndividuTableName};

create policy "Akses Baca Publik Konseling Individu" on public.${konselingIndividuTableName} for select using (true);
create policy "Akses Tambah Publik Konseling Individu" on public.${konselingIndividuTableName} for insert with check (true);
create policy "Akses Update Publik Konseling Individu" on public.${konselingIndividuTableName} for update using (true);
create policy "Akses Hapus Publik Konseling Individu" on public.${konselingIndividuTableName} for delete using (true);

--------------------------------------------------------------------------------
-- 7. TABEL F: RENCANA KONSELING KELOMPOK (${konselingKelompokTableName})
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
drop policy if exists "Akses Baca Publik Konseling Kelompok" on public.${konselingKelompokTableName};
drop policy if exists "Akses Tambah Publik Konseling Kelompok" on public.${konselingKelompokTableName};
drop policy if exists "Akses Update Publik Konseling Kelompok" on public.${konselingKelompokTableName};
drop policy if exists "Akses Hapus Publik Konseling Kelompok" on public.${konselingKelompokTableName};

create policy "Akses Baca Publik Konseling Kelompok" on public.${konselingKelompokTableName} for select using (true);
create policy "Akses Tambah Publik Konseling Kelompok" on public.${konselingKelompokTableName} for insert with check (true);
create policy "Akses Update Publik Konseling Kelompok" on public.${konselingKelompokTableName} for update using (true);
create policy "Akses Hapus Publik Konseling Kelompok" on public.${konselingKelompokTableName} for delete using (true);

--------------------------------------------------------------------------------
-- 8. TABEL G: SURAT PERNYATAAN SISWA / ORANG TUA (${suratPernyataanTableName})
--------------------------------------------------------------------------------
create table if not exists public.${suratPernyataanTableName} (
  id text primary key default gen_random_uuid()::text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  jenis_sp text not null,
  nama_siswa text not null,
  kelas text default '',
  nama_siswa_2 text default '',
  kelas_2 text default '',
  hari_tanggal_kejadian text default '',
  tahun_ajaran text default '2026-2027',
  jabatan_pengetahu text default 'Guru BK / Wali Kelas',
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
drop policy if exists "Akses Baca Publik Surat Pernyataan" on public.${suratPernyataanTableName};
drop policy if exists "Akses Tambah Publik Surat Pernyataan" on public.${suratPernyataanTableName};
drop policy if exists "Akses Update Publik Surat Pernyataan" on public.${suratPernyataanTableName};
drop policy if exists "Akses Hapus Publik Surat Pernyataan" on public.${suratPernyataanTableName};

create policy "Akses Baca Publik Surat Pernyataan" on public.${suratPernyataanTableName} for select using (true);
create policy "Akses Tambah Publik Surat Pernyataan" on public.${suratPernyataanTableName} for insert with check (true);
create policy "Akses Update Publik Surat Pernyataan" on public.${suratPernyataanTableName} for update using (true);
create policy "Akses Hapus Publik Surat Pernyataan" on public.${suratPernyataanTableName} for delete using (true);

--------------------------------------------------------------------------------
-- 9. TABEL H: KONFERENSI KASUS SISWA (${konferensiKasusTableName})
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
drop policy if exists "Akses Baca Publik Konferensi Kasus" on public.${konferensiKasusTableName};
drop policy if exists "Akses Tambah Publik Konferensi Kasus" on public.${konferensiKasusTableName};
drop policy if exists "Akses Update Publik Konferensi Kasus" on public.${konferensiKasusTableName};
drop policy if exists "Akses Hapus Publik Konferensi Kasus" on public.${konferensiKasusTableName};

create policy "Akses Baca Publik Konferensi Kasus" on public.${konferensiKasusTableName} for select using (true);
create policy "Akses Tambah Publik Konferensi Kasus" on public.${konferensiKasusTableName} for insert with check (true);
create policy "Akses Update Publik Konferensi Kasus" on public.${konferensiKasusTableName} for update using (true);
create policy "Akses Hapus Publik Konferensi Kasus" on public.${konferensiKasusTableName} for delete using (true);

--------------------------------------------------------------------------------
-- 10. TABEL I: DATA MANAGEMENT SISWA (${siswaTableName})
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
drop policy if exists "Akses Baca Publik Jurnal BK" on public.${jurnalBKTableName};
drop policy if exists "Akses Tambah Publik Jurnal BK" on public.${jurnalBKTableName};
drop policy if exists "Akses Update Publik Jurnal BK" on public.${jurnalBKTableName};
drop policy if exists "Akses Hapus Publik Jurnal BK" on public.${jurnalBKTableName};

create policy "Akses Baca Publik Jurnal BK" on public.${jurnalBKTableName} for select using (true);
create policy "Akses Tambah Publik Jurnal BK" on public.${jurnalBKTableName} for insert with check (true);
create policy "Akses Update Publik Jurnal BK" on public.${jurnalBKTableName} for update using (true);
create policy "Akses Hapus Publik Jurnal BK" on public.${jurnalBKTableName} for delete using (true);

--------------------------------------------------------------------------------
-- MIGRATION SAFE: Tambahkan kolom baru jika tabel sudah pernah dibuat sebelumnya
--------------------------------------------------------------------------------
alter table public.${tableName} add column if not exists link_foto_kegiatan text default '';

alter table public.${undanganTableName} add column if not exists link_foto_kegiatan text default '';
alter table public.${undanganTableName} add column if not exists nomor_surat text default '';
alter table public.${undanganTableName} add column if not exists tanggal_surat text default '';
alter table public.${undanganTableName} add column if not exists tempat_surat text default 'Pasuruan';
alter table public.${undanganTableName} add column if not exists semester text default '';
alter table public.${undanganTableName} add column if not exists nama_guru_bk text default '';
alter table public.${undanganTableName} add column if not exists nip_guru_bk text default '';
alter table public.${undanganTableName} add column if not exists nama_kepala_sekolah text default '';
alter table public.${undanganTableName} add column if not exists nip_kepala_sekolah text default '';

alter table public.${homeVisitTableName} add column if not exists link_foto_kegiatan text default '';
alter table public.${homeVisitTableName} add column if not exists nomor_surat_tugas text default '';
alter table public.${homeVisitTableName} add column if not exists petugas_1 text default '';
alter table public.${homeVisitTableName} add column if not exists petugas_2 text default '';
alter table public.${homeVisitTableName} add column if not exists jabatan_petugas_1 text default '';
alter table public.${homeVisitTableName} add column if not exists jabatan_petugas_2 text default '';
alter table public.${homeVisitTableName} add column if not exists nis_siswa text default '';
alter table public.${homeVisitTableName} add column if not exists tanggal_surat_tugas text default '';
alter table public.${homeVisitTableName} add column if not exists petugas_penerima_kunjungan text default '';
alter table public.${homeVisitTableName} add column if not exists tanggal_pernyataan_ortu text default '';
alter table public.${homeVisitTableName} add column if not exists nama_guru_bk text default '';
alter table public.${homeVisitTableName} add column if not exists nip_guru_bk text default '';
alter table public.${homeVisitTableName} add column if not exists nama_kepala_sekolah text default '';
alter table public.${homeVisitTableName} add column if not exists nip_kepala_sekolah text default '';
alter table public.${homeVisitTableName} add column if not exists tanggal_surat text default '';
alter table public.${homeVisitTableName} add column if not exists tempat_surat text default 'Pasuruan';

alter table public.${rekamPermasalahanTableName} add column if not exists link_foto_kegiatan text default '';
alter table public.${rekamPermasalahanTableName} add column if not exists nama_guru_bk text default '';
alter table public.${rekamPermasalahanTableName} add column if not exists nip_guru_bk text default '';
alter table public.${rekamPermasalahanTableName} add column if not exists nama_kepala_sekolah text default '';
alter table public.${rekamPermasalahanTableName} add column if not exists nip_kepala_sekolah text default '';
alter table public.${rekamPermasalahanTableName} add column if not exists tanggal_surat text default '';
alter table public.${rekamPermasalahanTableName} add column if not exists tempat_surat text default 'Pasuruan';

alter table public.${konselingIndividuTableName} add column if not exists link_foto_kegiatan text default '';
alter table public.${konselingIndividuTableName} add column if not exists nama_guru_bk text default '';
alter table public.${konselingIndividuTableName} add column if not exists nip_guru_bk text default '';
alter table public.${konselingIndividuTableName} add column if not exists nama_kepala_sekolah text default '';
alter table public.${konselingIndividuTableName} add column if not exists nip_kepala_sekolah text default '';

alter table public.${konselingKelompokTableName} add column if not exists link_foto_kegiatan text default '';
alter table public.${konselingKelompokTableName} add column if not exists nama_guru_bk text default '';
alter table public.${konselingKelompokTableName} add column if not exists nip_guru_bk text default '';
alter table public.${konselingKelompokTableName} add column if not exists nama_kepala_sekolah text default '';
alter table public.${konselingKelompokTableName} add column if not exists nip_kepala_sekolah text default '';

alter table public.${suratPernyataanTableName} add column if not exists nama_siswa_2 text default '';
alter table public.${suratPernyataanTableName} add column if not exists kelas_2 text default '';
alter table public.${suratPernyataanTableName} add column if not exists hari_tanggal_kejadian text default '';
alter table public.${suratPernyataanTableName} add column if not exists tahun_ajaran text default '2026-2027';
alter table public.${suratPernyataanTableName} add column if not exists jabatan_pengetahu text default 'Guru BK / Wali Kelas';
alter table public.${suratPernyataanTableName} add column if not exists nama_guru_bk text default '';
alter table public.${suratPernyataanTableName} add column if not exists nip_guru_bk text default '';
alter table public.${suratPernyataanTableName} add column if not exists nama_kepala_sekolah text default '';
alter table public.${suratPernyataanTableName} add column if not exists nip_kepala_sekolah text default '';

alter table public.${konferensiKasusTableName} add column if not exists daftar_hadir_rows text default '[]';
alter table public.${konferensiKasusTableName} add column if not exists nama_guru_bk text default '';
alter table public.${konferensiKasusTableName} add column if not exists nip_guru_bk text default '';
alter table public.${konferensiKasusTableName} add column if not exists nama_kepala_sekolah text default '';
alter table public.${konferensiKasusTableName} add column if not exists nip_kepala_sekolah text default '';

alter table public.${jurnalBKTableName} add column if not exists siswa_tidak_mengikuti_json text default '[]';
alter table public.${jurnalBKTableName} add column if not exists link_foto_kegiatan text default '';
alter table public.${jurnalBKTableName} add column if not exists nama_guru_bk text default '';
alter table public.${jurnalBKTableName} add column if not exists nip_guru_bk text default '';
alter table public.${jurnalBKTableName} add column if not exists nama_kepala_sekolah text default '';
alter table public.${jurnalBKTableName} add column if not exists nip_kepala_sekolah text default '';

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
create index if not exists idx_signatures_bk_record on public.signatures_bk(record_id);
`;
}

export interface SupabaseTableTestResult {
  title: string;
  tableName: string;
  exists: boolean;
  error?: string;
}

export async function testAllSupabaseTables(customConfig?: SupabaseConfig): Promise<{
  connected: boolean;
  totalTables: number;
  existingCount: number;
  missingCount: number;
  missingTableNames: string[];
  tables: SupabaseTableTestResult[];
  error?: string;
}> {
  const config = customConfig || getSavedSupabaseConfig();
  const client = getSupabaseClient(config);

  if (!client) {
    return {
      connected: false,
      totalTables: 0,
      existingCount: 0,
      missingCount: 0,
      missingTableNames: [],
      tables: [],
      error: 'Supabase URL atau Anon Key belum dikonfigurasi.'
    };
  }

  const tableList = [
    { title: 'Agenda Kerja BK', tableName: config.tableName || DEFAULT_TABLE_NAME },
    { title: 'Undangan Orang Tua Siswa', tableName: DEFAULT_UNDANGAN_TABLE_NAME },
    { title: 'Home Visit / Kunjungan Rumah', tableName: DEFAULT_HOME_VISIT_TABLE_NAME },
    { title: 'Rekam Permasalahan Siswa', tableName: DEFAULT_REKAM_PERMASALAHAN_TABLE_NAME },
    { title: 'Rencana Konseling Individu', tableName: DEFAULT_KONSELING_INDIVIDU_TABLE_NAME },
    { title: 'Rencana Konseling Kelompok', tableName: DEFAULT_KONSELING_KELOMPOK_TABLE_NAME },
    { title: 'Surat Pernyataan Siswa', tableName: DEFAULT_SURAT_PERNYATAAN_TABLE_NAME },
    { title: 'Konferensi Kasus Siswa', tableName: DEFAULT_KONFERENSI_KASUS_TABLE_NAME },
    { title: 'Data Manajemen Siswa', tableName: DEFAULT_SISWA_TABLE_NAME },
    { title: 'Jurnal Layanan BK', tableName: DEFAULT_JURNAL_BK_TABLE_NAME },
    { title: 'Tanda Tangan Digital (Signatures)', tableName: DEFAULT_SIGNATURES_TABLE_NAME },
  ];

  const results: SupabaseTableTestResult[] = [];

  for (const item of tableList) {
    try {
      let isFound = false;
      let lastErrMsg = '';
      let detectedTableName = item.tableName;

      if (item.title === 'Data Manajemen Siswa') {
        const candidateSiswaTables = [
          item.tableName,
          'siswa_BK',
          'Siswa_BK',
          'siswa',
          'Siswa',
          'data_siswa'
        ];
        const uniqueCandidates = Array.from(new Set(candidateSiswaTables));
        for (const candidate of uniqueCandidates) {
          const { error } = await client.from(candidate).select('*').limit(1);
          if (!error) {
            isFound = true;
            detectedTableName = candidate;
            break;
          } else {
            lastErrMsg = error.message;
          }
        }
      } else {
        const { error } = await client
          .from(item.tableName)
          .select('*')
          .limit(1);

        if (!error) {
          isFound = true;
        } else {
          lastErrMsg = error.message;
        }
      }

      if (isFound) {
        results.push({
          title: item.title,
          tableName: detectedTableName,
          exists: true
        });
      } else {
        results.push({
          title: item.title,
          tableName: item.tableName,
          exists: false,
          error: lastErrMsg
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal terhubung';
      results.push({
        title: item.title,
        tableName: item.tableName,
        exists: false,
        error: msg
      });
    }
  }

  const existingCount = results.filter(t => t.exists).length;
  const missing = results.filter(t => !t.exists);

  return {
    connected: existingCount > 0,
    totalTables: results.length,
    existingCount,
    missingCount: missing.length,
    missingTableNames: missing.map(m => m.title),
    tables: results
  };
}
