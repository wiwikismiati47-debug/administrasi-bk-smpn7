import { AppLink } from '../types';

const STORAGE_KEY_APP_LINKS = 'bk_smpn7_dashboard_app_links';

export const INITIAL_DEFAULT_LINKS: AppLink[] = [
  {
    id: 'link-internal-agenda-bk',
    title: 'A. Agenda Kerja BK SMPN 7',
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
    title: 'B. Undangan Orang Tua Siswa',
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
    title: 'C. Home Visit / Kunjungan Rumah',
    url: 'internal:home_visit',
    iconName: 'Home',
    category: 'Administrasi Utama',
    description: 'Form & Tabel Home Visit / Kunjungan Rumah BK SMPN 7 Pasuruan (Terhubung Supabase)',
    isInternal: true,
    badge: 'FORM C',
    colorGradient: 'from-amber-600 via-orange-600 to-amber-800',
  },
  {
    id: 'link-supabase-console',
    title: 'Console Supabase Database',
    url: 'https://supabase.com/dashboard',
    iconName: 'Database',
    category: 'Database & Cloud',
    description: 'Akses dashboard database cloud Supabase untuk pemantauan data BK',
    isInternal: false,
    badge: 'CLOUD',
    colorGradient: 'from-emerald-600 via-teal-600 to-emerald-800',
  },
  {
    id: 'link-drive-bk',
    title: 'Google Drive Dokumen BK',
    url: 'https://drive.google.com',
    iconName: 'FolderKanban',
    category: 'Penyimpanan Berkas',
    description: 'Folder penyimpanan sertifikat, foto kegiatan, dan laporan fisik BK',
    isInternal: false,
    badge: 'DRIVE',
    colorGradient: 'from-amber-500 via-orange-500 to-amber-700',
  },
  {
    id: 'link-kemdikbud-smp',
    title: 'Portal Rapor Pendidikan SMP',
    url: 'https://raporpendidikan.kemdikbud.go.id',
    iconName: 'GraduationCap',
    category: 'Kedinasan',
    description: 'Evaluasi & Rapor Pendidikan SMP Kemdikbudristek',
    isInternal: false,
    badge: 'KEMDIKBUD',
    colorGradient: 'from-sky-600 via-blue-600 to-indigo-800',
  },
  {
    id: 'link-canva-bk',
    title: 'Canva Design Poster BK',
    url: 'https://www.canva.com',
    iconName: 'Palette',
    category: 'Media Layanan',
    description: 'Pembuatan media bimbingan klasikal, poster, dan infografis siswa',
    isInternal: false,
    badge: 'MEDIA',
    colorGradient: 'from-fuchsia-600 via-purple-600 to-violet-800',
  },
];

export function getSavedAppLinks(): AppLink[] {
  const dataStr = localStorage.getItem(STORAGE_KEY_APP_LINKS);
  if (!dataStr) {
    saveAppLinksToStorage(INITIAL_DEFAULT_LINKS);
    return INITIAL_DEFAULT_LINKS;
  }
  try {
    const parsed = JSON.parse(dataStr);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const existingIds = new Set(parsed.map((item: AppLink) => item.id));
      let updated = false;

      const result = [...parsed];

      // Ensure all INITIAL_DEFAULT_LINKS exist (especially internal links like B. Undangan Orang Tua)
      INITIAL_DEFAULT_LINKS.forEach((defaultLink, defaultIdx) => {
        if (!existingIds.has(defaultLink.id)) {
          if (defaultIdx < result.length) {
            result.splice(defaultIdx, 0, defaultLink);
          } else {
            result.push(defaultLink);
          }
          updated = true;
        }
      });

      if (updated) {
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
    app: 'ADMINISTRASI BK SMPN 7 PASURAN - DASHBOARD LINKS BACKUP',
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
