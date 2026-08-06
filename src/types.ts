export interface AgendaKerja {
  id: string;
  created_at?: string;
  updated_at?: string;
  hari: string; // e.g. "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"
  tanggal: string; // YYYY-MM-DD
  bulan: string; // e.g. "Januari", "Agustus"
  tahun: string; // e.g. "2026"
  waktu: string; // e.g. "08:00 - 09:30 WIB"
  uraian_kegiatan: string; // Detail / Uraian kegiatan BK
  sasaran: string; // e.g. "Siswa Kelas VII A", "Orang Tua/Wali"
  link_foto_kegiatan: string; // URL / Link foto
  keterangan: string; // Notes / Status
}

export type FormAgendaData = Omit<AgendaKerja, 'id' | 'created_at' | 'updated_at'>;

export interface UndanganOrangTua {
  id: string;
  created_at?: string;
  updated_at?: string;
  hari: string; // e.g. "Senin", "Selasa"
  tanggal: string; // YYYY-MM-DD
  bulan: string; // e.g. "Agustus"
  tahun: string; // e.g. "2026"
  waktu: string; // e.g. "08:30 WIB"
  tempat_pelaksanaan?: string; // e.g. "SMP Negeri 7 Pasuruan" or "Ruang BK"
  kelas: string; // e.g. "VIII A"
  nama_siswa: string;
  nama_orang_tua: string;
  pekerjaan_orang_tua: string;
  alamat: string;
  perihal_undangan: string;
  uraian_permasalahan: string; // URAIAN PERMASALAHAN SISWA
  tindak_lanjut: string;
  link_foto_kegiatan: string;
  keterangan: string;
  nomor_surat?: string; // Optional custom nomor surat
  tanggal_surat?: string; // Tanggal Pembuatan Surat (e.g. Pasuruan, 6 Agustus 2026)
  tempat_surat?: string; // Tempat Pembuatan Surat (e.g. Pasuruan)
  semester?: string; // Optional custom semester e.g. "SEMESTER 1 (GANJIL) TAHUN PELAJARAN 2025-2026"
  nama_guru_bk?: string;
  nip_guru_bk?: string;
  nama_kepala_sekolah?: string;
  nip_kepala_sekolah?: string;
}

export type FormUndanganData = Omit<UndanganOrangTua, 'id' | 'created_at' | 'updated_at'>;

export interface HomeVisit {
  id: string;
  created_at?: string;
  updated_at?: string;
  hari: string; // e.g. "Senin", "Selasa"
  tanggal: string; // YYYY-MM-DD
  bulan: string; // e.g. "Agustus"
  tahun: string; // e.g. "2026"
  waktu: string; // e.g. "09:00 WIB" (JAM)
  kelas: string; // e.g. "VIII B"
  nama_siswa: string;
  nama_orang_tua: string;
  pekerjaan_orang_tua: string;
  alamat: string;
  perihal_home_visit: string; // PERIHAL HOME VISIT/KUNJUNGAN RUMAH
  uraian_permasalahan: string; // URAIAN PERMASALAHAN SISWA
  tindak_lanjut: string; // TINDAK LANJUT
  link_foto_kegiatan: string; // LINK FOTO KEGIATAN
  keterangan: string; // KETERANGAN
  nama_guru_bk?: string;
  nip_guru_bk?: string;
  nama_kepala_sekolah?: string;
  nip_kepala_sekolah?: string;
  tanggal_surat?: string;
  tempat_surat?: string;
  // Surat Tugas Kunjungan Rumah fields
  nomor_surat_tugas?: string;
  petugas_1?: string;
  petugas_2?: string;
  jabatan_petugas_1?: string;
  jabatan_petugas_2?: string;
  nis_siswa?: string;
  // Surat Kesediaan Menerima Kunjungan Orang Tua fields
  tanggal_surat_tugas?: string;
  petugas_penerima_kunjungan?: string;
  tanggal_pernyataan_ortu?: string;
}

export type FormHomeVisitData = Omit<HomeVisit, 'id' | 'created_at' | 'updated_at'>;

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  tableName: string;
}

export interface AppLink {
  id: string;
  title: string;
  url: string; // URL or 'internal:agenda_bk' or 'internal:undangan_ortu'
  iconName?: string;
  category?: string;
  description?: string;
  isInternal?: boolean;
  badge?: string;
  colorGradient?: string;
}


