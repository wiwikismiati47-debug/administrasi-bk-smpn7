import { AppLink } from '../types';

const STORAGE_KEY_APP_LINKS = 'bk_smpn7_dashboard_app_links';

export const INITIAL_DEFAULT_LINKS: AppLink[] = [
  {
    id: 'link-internal-agenda-bk',
    title: 'Agenda Kerja BK SMPN 7',
    url: 'internal:agenda_bk',
    iconName: 'BookOpen',
    category: 'Administrasi Utama',
    description: 'Form & Tabel Agenda Kerja BK SMPN 7 Pasuruan (Terhubung Supabase)',
    isInternal: true,
    badge: 'UTAMA',
    colorGradient: 'from-blue-600 via-indigo-600 to-blue-800',
  },
  {
    id: 'link-internal-undangan-ortu',
    title: 'Undangan Orang Tua Siswa',
    url: 'internal:undangan_ortu',
    iconName: 'Users',
    category: 'Administrasi Utama',
    description: 'Form & Tabel Undangan Orang Tua Siswa BK SMPN 7 Pasuruan (Terhubung Supabase)',
    isInternal: true,
    badge: 'FORM B',
    colorGradient: 'from-purple-600 via-pink-600 to-rose-800',
  },
  {
    id: 'link-internal-home-visit',
    title: 'Home Visit / Kunjungan Rumah',
    url: 'internal:home_visit',
    iconName: 'Home',
    category: 'Administrasi Utama',
    description: 'Form & Tabel Home Visit / Kunjungan Rumah BK SMPN 7 Pasuruan (Terhubung Supabase)',
    isInternal: true,
    badge: 'FORM C',
    colorGradient: 'from-amber-600 via-orange-600 to-amber-800',
  },
  {
    id: 'link-internal-rekam-permasalahan',
    title: 'Rekam Permasalahan Siswa',
    url: 'internal:rekam_permasalahan',
    iconName: 'FileSpreadsheet',
    category: 'Administrasi Utama',
    description: 'Form & Tabel Rekam Permasalahan Siswa BK SMPN 7 Pasuruan (Terhubung Supabase)',
    isInternal: true,
    badge: 'FORM D',
    colorGradient: 'from-emerald-600 via-teal-600 to-emerald-800',
  },
  {
    id: 'link-internal-konseling-individu',
    title: 'Rencana Konseling Individu',
    url: 'internal:konseling_individu',
    iconName: 'UserCheck',
    category: 'Administrasi Utama',
    description: 'Form & Tabel Rencana Konseling Individu BK SMPN 7 Pasuruan (Terhubung Supabase)',
    isInternal: true,
    badge: 'FORM E',
    colorGradient: 'from-indigo-600 via-violet-600 to-indigo-800',
  },
  {
    id: 'link-internal-konseling-kelompok',
    title: 'Rencana Konseling Kelompok',
    url: 'internal:konseling_kelompok',
    iconName: 'UserPlus',
    category: 'Administrasi Utama',
    description: 'Form & Tabel Rencana Konseling Kelompok BK SMPN 7 Pasuruan (Terhubung Supabase)',
    isInternal: true,
    badge: 'FORM F',
    colorGradient: 'from-pink-600 via-rose-600 to-red-800',
  },
  {
    id: 'link-internal-surat-pernyataan',
    title: 'Surat Pernyataan Siswa',
    url: 'internal:surat_pernyataan',
    iconName: 'FileCheck2',
    category: 'Administrasi Utama',
    description: 'Form & Tabel Surat Pernyataan Siswa & Orang Tua (SP 1, SP 2, SP 3, Ortu 1, Ortu 2, Pengunduran Diri)',
    isInternal: true,
    badge: 'FORM G',
    colorGradient: 'from-amber-600 via-orange-600 to-red-800',
  },
  {
    id: 'link-internal-konferensi-kasus',
    title: 'Konferensi Kasus Siswa',
    url: 'internal:konferensi_kasus',
    iconName: 'ClipboardList',
    category: 'Administrasi Utama',
    description: 'Form & Cetak Notula, Notulen Rapat, dan Daftar Hadir Konferensi Kasus Siswa (Terhubung Supabase)',
    isInternal: true,
    badge: 'FORM H',
    colorGradient: 'from-rose-600 via-red-600 to-orange-800',
  },
  {
    id: 'link-internal-jurnal-bk',
    title: 'Jurnal Layanan BK',
    url: 'internal:jurnal_bk',
    iconName: 'BookOpen',
    category: 'Administrasi Utama',
    description: 'Jurnal Harian Layanan BK (Materi, Bidang, Jenis, Fungsi, Hasil BMB3 & Siswa Tidak Mengikuti)',
    isInternal: true,
    badge: 'JURNAL',
    colorGradient: 'from-emerald-600 via-teal-600 to-indigo-800',
  },
  {
    id: 'link-internal-siswa',
    title: 'Management Siswa',
    url: 'internal:siswa',
    iconName: 'GraduationCap',
    category: 'Administrasi Utama',
    description: 'Manajemen Data Siswa (NO, Nama, Kelas, NIS, Jenis Kelamin). Form publik, simpan Supabase, update otomatis bila NIS sudah ada.',
    isInternal: true,
    badge: 'SISWA',
    colorGradient: 'from-cyan-600 via-teal-600 to-blue-800',
  },
];

export function getSavedAppLinks(): AppLink[] {
  const dataStr = localStorage.getItem(STORAGE_KEY_APP_LINKS);
  if (!dataStr) {
    saveAppLinksToStorage(INITIAL_DEFAULT_LINKS);
    return INITIAL_DEFAULT_LINKS;
  }
  try {
    let parsed = JSON.parse(dataStr);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Exclude removed default links
      const removedIds = new Set(['link-drive-bk', 'link-kemdikbud-smp', 'link-canva-bk', 'link-supabase-console']);
      parsed = parsed.filter((item: AppLink) => !removedIds.has(item.id));

      const existingMap = new Map<string, AppLink>(parsed.map((item: AppLink) => [item.id, item]));
      let updated = false;

      // Ensure all INITIAL_DEFAULT_LINKS are present and up to date
      const mergedDefaults = INITIAL_DEFAULT_LINKS.map((defaultLink) => {
        const existing = existingMap.get(defaultLink.id);
        if (!existing) {
          updated = true;
          return defaultLink;
        }
        if (defaultLink.isInternal) {
          if (
            existing.title !== defaultLink.title ||
            existing.url !== defaultLink.url ||
            existing.badge !== defaultLink.badge ||
            existing.iconName !== defaultLink.iconName ||
            existing.category !== defaultLink.category
          ) {
            updated = true;
            return { ...existing, ...defaultLink };
          }
        }
        return existing;
      });

      // Retain custom user-added non-default links
      const defaultIds = new Set(INITIAL_DEFAULT_LINKS.map((d) => d.id));
      const customLinks = parsed.filter((item: AppLink) => !defaultIds.has(item.id));

      const result = [...mergedDefaults, ...customLinks];

      if (updated || result.length !== parsed.length) {
        saveAppLinksToStorage(result);
      }
      return result;
    }
  } catch {
    // fallback
  }
  return INITIAL_DEFAULT_LINKS;
}

export function resetDefaultAppLinks(): AppLink[] {
  saveAppLinksToStorage(INITIAL_DEFAULT_LINKS);
  return INITIAL_DEFAULT_LINKS;
}

export function saveAppLinksToStorage(links: AppLink[]): void {
  localStorage.setItem(STORAGE_KEY_APP_LINKS, JSON.stringify(links));
}

export function exportLinksBackupJSON(links: AppLink[]): void {
  const exportData = {
    app: 'SABDA BK SPANJU SMPN 7 PASURUAN - DASHBOARD LINKS BACKUP',
    version: '1.0',
    exportDate: new Date().toISOString(),
    totalLinks: links.length,
    links: links,
  };

  const jsonString = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `Backup_Menu_BK_SMPN7_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function parseLinksBackupJSON(jsonStr: string): AppLink[] | null {
  try {
    const parsed = JSON.parse(jsonStr);
    if (parsed && Array.isArray(parsed.links)) {
      return parsed.links as AppLink[];
    } else if (Array.isArray(parsed)) {
      return parsed as AppLink[];
    }
  } catch {
    return null;
  }
  return null;
}
