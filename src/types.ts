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
  // 14 Field Laporan Kunjungan Rumah Resmi (Sesuai Lampiran User)
  semester_laporan?: string;
  bidang_layanan?: string;
  topik_permasalahan?: string;
  fungsi_layanan?: string;
  pihak_terlibat?: string;
  tujuan_kegiatan?: string;
  gambaran_ringkas_masalah?: string;
  alamat_kunjungan?: string;
  hari_tanggal_lama_kunjungan?: string;
  anggota_keluarga_dikunjungi?: string;
  rencana_evaluasi?: string;
  catatan_khusus?: string;
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

export interface RekamPermasalahan {
  id: string;
  created_at?: string;
  updated_at?: string;
  hari: string; // e.g. "Senin", "Selasa"
  tanggal: string; // YYYY-MM-DD
  bulan: string; // e.g. "Agustus"
  tahun: string; // e.g. "2026"
  waktu: string; // e.g. "08:00 WIB"
  kelas: string; // e.g. "VIII A"
  nama_siswa: string;
  nama_orang_tua: string;
  pekerjaan_orang_tua: string;
  alamat: string;
  ringkasan_uraian_permasalahan: string; // RINGKASAN URAIAN PERMASALAHAN SISWA
  upaya_konselor_walikelas: string; // UPAYA YANG SUDAH DILAKUKAN OLEH KONSELOR, WALI KELAS
  hasil_dan_kesimpulan: string; // HASIL DAN KESIMPULAN
  link_foto_kegiatan: string; // LINK FOTO KEGIATAN
  keterangan: string; // KETERANGAN
  nama_guru_bk?: string;
  nip_guru_bk?: string;
  nama_kepala_sekolah?: string;
  nip_kepala_sekolah?: string;
  tanggal_surat?: string;
  tempat_surat?: string;
}

export type FormRekamPermasalahanData = Omit<RekamPermasalahan, 'id' | 'created_at' | 'updated_at'>;

export interface KonselingIndividu {
  id: string;
  created_at?: string;
  updated_at?: string;
  hari: string; // e.g. "Senin", "Selasa"
  tanggal: string; // YYYY-MM-DD
  bulan: string; // e.g. "Agustus"
  tahun: string; // e.g. "2026"
  waktu: string; // e.g. "08:00 WIB"
  kelas: string; // e.g. "VIII A"
  nama_siswa: string;
  topik_permasalahan: string; // Topik Permasalahan
  media_yang_diperlukan: string; // Media yang diperlukan
  ringkasan_uraian_permasalahan: string; // RINGKASAN URAIAN PERMASALAHAN SISWA
  pendekatan_dan_teknik_konseling: string; // Pendekatan dan teknik konseling
  hasil_yang_dicapai: string; // Hasil yang dicapai
  link_foto_kegiatan: string; // LINK FOTO KEGIATAN
  keterangan: string; // KETERANGAN
  nama_guru_bk?: string;
  nip_guru_bk?: string;
  nama_kepala_sekolah?: string;
  nip_kepala_sekolah?: string;
}

export type FormKonselingIndividuData = Omit<KonselingIndividu, 'id' | 'created_at' | 'updated_at'>;

export interface KonselingKelompok {
  id: string;
  created_at?: string;
  updated_at?: string;
  hari: string; // e.g. "Senin", "Selasa"
  tanggal: string; // YYYY-MM-DD
  bulan: string; // e.g. "Agustus"
  tahun: string; // e.g. "2026"
  waktu: string; // e.g. "08:00 WIB"
  kelas: string; // e.g. "VIII A"
  nama_siswa: string; // Daftar / Nama-nama Siswa Anggota Kelompok
  topik_permasalahan: string; // Topik Permasalahan
  media_yang_diperlukan: string; // Media yang diperlukan
  ringkasan_uraian_permasalahan: string; // RINGKASAN URAIAN PERMASALAHAN SISWA
  pendekatan_dan_teknik_konseling: string; // Pendekatan dan teknik konseling
  hasil_yang_dicapai: string; // Hasil yang dicapai
  link_foto_kegiatan: string; // LINK FOTO KEGIATAN
  keterangan: string; // KETERANGAN
  nama_guru_bk?: string;
  nip_guru_bk?: string;
  nama_kepala_sekolah?: string;
  nip_kepala_sekolah?: string;
}

export type FormKonselingKelompokData = Omit<KonselingKelompok, 'id' | 'created_at' | 'updated_at'>;

export type JenisSuratPernyataan =
  | 'SP_1'
  | 'SP_2'
  | 'SP_3'
  | 'SP_ORTU_1'
  | 'SP_ORTU_2'
  | 'SP_PENGUNDURAN_DIRI'
  | 'SP_DAMAI';

export interface SuratPernyataan {
  id: string;
  created_at?: string;
  updated_at?: string;
  jenis_sp: JenisSuratPernyataan;
  nama_siswa: string;
  kelas: string;
  nama_siswa_2?: string;
  kelas_2?: string;
  hari_tanggal_kejadian?: string;
  tahun_ajaran?: string;
  jabatan_pengetahu?: string;
  nama_orang_tua: string;
  pekerjaan_orang_tua: string;
  alamat_orang_tua: string;
  hubungan_keluarga: string;
  peraturan_diketahui: string;
  alasan_pengunduran: string;
  tanggal_surat: string;
  tempat_surat: string;
  keterangan: string;
  nama_guru_bk?: string;
  nip_guru_bk?: string;
  nama_kepala_sekolah?: string;
  nip_kepala_sekolah?: string;
}

export type FormSuratPernyataanData = Omit<SuratPernyataan, 'id' | 'created_at' | 'updated_at'>;

export interface DaftarHadirRow {
  no: number;
  nama: string;
  jabatan: string;
  kelas: string;
  asal_sekolah: string;
  ttd: string;
}

export interface KonferensiKasus {
  id: string;
  created_at?: string;
  updated_at?: string;
  nama_konseli: string;
  kelas_ta: string;
  jenis_masalah: string;
  hari_tgl_jam: string;
  pemandu_konferensi: string;
  pemandu_nama: string;
  pemandu_jabatan: string;
  data_ingin_diperoleh: string;
  uraian_kegiatan_inti: string;
  data_diperoleh_simpulan: string;
  keterpenuhan_kebutuhan_data: string; // e.g., 'terpenuhi' | 'belum_terpenuhi'
  rujukan_pelayanan: string; // e.g., "Guru Mata Pelajaran, Wali Kelas"
  rapat_nama_sekolah: string;
  rapat_alamat: string;
  rapat_tempat: string;
  rapat_ketua: string;
  rapat_jumlah_hadir: string;
  rapat_dimulai_pukul: string;
  rapat_diakhiri_pukul: string;
  rapat_hasil_pertemuan: string;
  daftar_hadir_peserta_singkat: string;
  daftar_hadir_rows: string; // JSON string of DaftarHadirRow[]
  tanggal_surat: string;
  tempat_surat: string;
  nama_guru_bk?: string;
  nip_guru_bk?: string;
  nama_kepala_sekolah?: string;
  nip_kepala_sekolah?: string;
  keterangan?: string;
}

export type FormKonferensiKasusData = Omit<KonferensiKasus, 'id' | 'created_at' | 'updated_at'>;

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

export interface Siswa {
  id: string;
  created_at?: string;
  updated_at?: string;
  nama_siswa: string;
  kelas: string;
  nis: string;
  jenis_kelamin: string; // 'Laki-laki' | 'Perempuan'
  keterangan?: string;
}

export type FormSiswaData = Omit<Siswa, 'id' | 'created_at' | 'updated_at'>;

export interface SiswaTidakHadir {
  nama_siswa: string;
  alasan: string;
  tindak_lanjut: string;
}

export interface JurnalBK {
  id: string;
  created_at?: string;
  updated_at?: string;
  hari: string; // e.g. "Senin", "Selasa"
  tanggal: string; // YYYY-MM-DD
  bulan: string; // e.g. "Agustus"
  tahun: string; // e.g. "2026"
  jam_ke: string; // e.g. "1 - 2" or "3"
  materi_layanan: string;
  bidang_layanan: 'Pribadi' | 'Sosial' | 'Belajar' | 'Karir' | string;
  jenis_layanan: string;
  fungsi_layanan: string;
  hasil_layanan_bmb3: string; // Immediate BMB3
  siswa_tidak_mengikuti: SiswaTidakHadir[];
  kelas: string;
  sasaran_peserta?: string;
  link_foto_kegiatan?: string;
  keterangan?: string;
  nama_guru_bk?: string;
  nip_guru_bk?: string;
  nama_kepala_sekolah?: string;
  nip_kepala_sekolah?: string;
  tanggal_surat?: string;
  tempat_surat?: string;
}

export type FormJurnalBKData = Omit<JurnalBK, 'id' | 'created_at' | 'updated_at'>;

export interface SiswaATS {
  id: string;
  created_at?: string;
  updated_at?: string;
  hari: string; // e.g. "Senin", "Selasa"
  tanggal: string; // YYYY-MM-DD
  tahun_ajaran: string; // e.g. "2025/2026"
  waktu: string; // e.g. "08:00 WIB"
  nama_siswa: string; // Nama siswa ATS
  kategori_ats: 'DO (Drop Out)' | 'LTM (Lulus Tidak Melanjutkan)' | string;
  kelas?: string; // e.g. "VIII A"
  alamat: string; // Alamat siswa ATS
  alasan_ats: string; // Popup pilihan kategori alasan ATS
  alasan_manual: string; // Isian manual / uraian tambahan
  foto_kunjungan_1: string; // Foto Kunjungan 1 (URL / Base64)
  foto_bukti_fisik_2: string; // Foto Bukti Fisik 2 (URL / Base64)
  tempat_laporan: string; // e.g. "Pasuruan"
  tanggal_laporan: string; // YYYY-MM-DD
  nama_guru_kunjungan: string; // Pilihan: WIWIK ISMIATI, S.Pd / EKI FEBRIANI, S.Pd
  nip_guru_kunjungan: string; // NIP Guru Kunjungan
  nama_kepala_sekolah?: string;
  nip_kepala_sekolah?: string;
  keterangan?: string;
}

export type FormSiswaATSData = Omit<SiswaATS, 'id' | 'created_at' | 'updated_at'>;




