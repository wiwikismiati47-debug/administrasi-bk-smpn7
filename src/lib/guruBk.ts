import { safeGetStorage, safeSetStorage } from './storageManager';

export const STORAGE_KEY_GURU_BK = 'sabda_bk_guru_bk';

export interface GuruBK {
  nama: string;
  nip: string;
}

export const PRESET_GURU_BK: GuruBK[] = [
  { nama: 'WIWIK ISMIATI, S.Pd', nip: '19831116 200904 2 003' },
  { nama: 'EKI FEBRIANI, S.Pd', nip: '19940214 202221 2 014' },
];

export function getActiveGuruBK(): GuruBK {
  try {
    const parsed = safeGetStorage<GuruBK | null>(STORAGE_KEY_GURU_BK, null);
    if (parsed && parsed.nama) {
      return {
        ...parsed,
        nama: parsed.nama.replace(/S\.PD/g, 'S.Pd').replace(/S\.pd/g, 'S.Pd')
      };
    }
  } catch (e) {
    console.error('Error reading Guru BK from storage', e);
  }
  return PRESET_GURU_BK[0];
}

export function setActiveGuruBK(guru: GuruBK) {
  try {
    safeSetStorage(STORAGE_KEY_GURU_BK, guru);
    window.dispatchEvent(new Event('guru-bk-changed'));
  } catch (e) {
    console.error('Error saving Guru BK to storage', e);
  }
}
