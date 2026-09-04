import React, { useState, useEffect } from 'react';
import { SiswaATS, FormSiswaATSData, Siswa } from '../types';
import { compressImageFile } from '../lib/imageCompressor';
import { SiswaSelector } from './SiswaSelector';
import {
  Calendar,
  Clock,
  User,
  MapPin,
  FileText,
  Upload,
  Eye,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Users,
  ChevronDown,
  X,
  Sparkles,
  Camera,
  Layers,
  GraduationCap,
  Building,
  Check,
  Award,
  Link as LinkIcon,
  ImageIcon
} from 'lucide-react';

interface FormSiswaATSProps {
  initialData?: SiswaATS | null;
  onSubmit: (data: Partial<SiswaATS> & FormSiswaATSData) => Promise<void>;
  onCancelEdit?: () => void;
  isSubmitting?: boolean;
  siswaItems?: Siswa[];
}

export const GURU_KUNJUNGAN_OPTIONS = [
  {
    nama: 'WIWIK ISMIATI, S.Pd',
    nip: '19831116 200904 2 003',
    jabatan: 'Guru Bimbingan dan Konseling'
  },
  {
    nama: 'EKI FEBRIANI, S.Pd',
    nip: '19940214 202221 2 014',
    jabatan: 'Guru Bimbingan dan Konseling'
  }
];

export const TAHUN_AJARAN_OPTIONS = [
  '2024/2025',
  '2025/2026',
  '2026/2027',
  '2027/2028',
  '2028/2029'
];

export const ALASAN_ATS_OPTIONS = [
  {
    id: 'ekonomi',
    kategori: 'Ekonomi',
    deskripsi: 'Tidak ada biaya operasional (seragam, transpor) atau anak harus bekerja membantu keuangan keluarga.',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300'
  },
  {
    id: 'keluarga_sosial',
    kategori: 'Keluarga & Sosial',
    deskripsi: 'Terjadi pernikahan dini, orang tua kurang mendukung pendidikan, atau anak harus mengurus rumah tangga/adik.',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300'
  },
  {
    id: 'akses_aksesibilitas',
    kategori: 'Akses & Aksesibilitas',
    deskripsi: 'Jarak sekolah terlalu jauh, jalur transportasi sulit, atau minimnya fasilitas untuk anak berkebutuhan khusus.',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300'
  },
  {
    id: 'internal_lingkungan',
    kategori: 'Internal & Lingkungan',
    deskripsi: 'Anak kehilangan minat belajar, menjadi korban perundungan (bullying), atau terpengaruh ajakan teman yang tidak sekolah.',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300'
  },
  {
    id: 'tidak_ats',
    kategori: 'Status Aktif / Bukan ATS',
    deskripsi: 'Siswa berstatus aktif, tidak mengalami putus sekolah (DO) maupun kendala kelulusan (TLM).',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
  }
];

const DAYS_INDO: Record<number, string> = {
  0: 'Minggu',
  1: 'Senin',
  2: 'Selasa',
  3: 'Rabu',
  4: 'Kamis',
  5: 'Jumat',
  6: 'Sabtu'
};

export const FormSiswaATS: React.FC<FormSiswaATSProps> = ({
  initialData,
  onSubmit,
  onCancelEdit,
  isSubmitting = false,
  siswaItems = []
}) => {
  const getTodayISO = () => new Date().toISOString().slice(0, 10);

  const getCurrentTimeString = () => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    return `${hh}:${mm} WIB`;
  };

  const getDayFromDateString = (dateStr: string) => {
    if (!dateStr) return 'Senin';
    const [y, m, d] = dateStr.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    return DAYS_INDO[dateObj.getDay()] || 'Senin';
  };

  // State
  const [tanggal, setTanggal] = useState<string>(getTodayISO());
  const [hari, setHari] = useState<string>(getDayFromDateString(getTodayISO()));
  const [tahunAjaran, setTahunAjaran] = useState<string>('2025/2026');
  const [showTahunAjaranModal, setShowTahunAjaranModal] = useState<boolean>(false);
  const [customTahunAjaran, setCustomTahunAjaran] = useState<string>('');

  const [waktu, setWaktu] = useState<string>(getCurrentTimeString());
  const [isAutoTime, setIsAutoTime] = useState<boolean>(true);

  const [namaSiswa, setNamaSiswa] = useState<string>('');
  const [kategoriATS, setKategoriATS] = useState<'DO (Drop Out)' | 'LTM (Lulus Tidak Melanjutkan)' | 'Tidak DO / TLM' | string>('DO (Drop Out)');
  const [kelas, setKelas] = useState<string>('');
  const [namaOrangTua, setNamaOrangTua] = useState<string>('');
  const [alamat, setAlamat] = useState<string>('');

  // Alasan ATS (Popup & isian manual)
  const [alasanATS, setAlasanATS] = useState<string>(ALASAN_ATS_OPTIONS[0].deskripsi);
  const [selectedAlasanKategori, setSelectedAlasanKategori] = useState<string>(ALASAN_ATS_OPTIONS[0].kategori);
  const [alasanManual, setAlasanManual] = useState<string>('');
  const [showAlasanModal, setShowAlasanModal] = useState<boolean>(false);

  // Photos
  const [fotoKunjungan1, setFotoKunjungan1] = useState<string>('');
  const [fotoBuktiFisik2, setFotoBuktiFisik2] = useState<string>('');
  const [isUploading1, setIsUploading1] = useState<boolean>(false);
  const [isUploading2, setIsUploading2] = useState<boolean>(false);
  const [previewError1, setPreviewError1] = useState<boolean>(false);
  const [previewError2, setPreviewError2] = useState<boolean>(false);

  // Laporan & Guru Kunjungan
  const [tempatLaporan, setTempatLaporan] = useState<string>('Pasuruan');
  const [tanggalLaporan, setTanggalLaporan] = useState<string>(getTodayISO());
  const [namaGuruKunjungan, setNamaGuruKunjungan] = useState<string>(GURU_KUNJUNGAN_OPTIONS[0].nama);
  const [nipGuruKunjungan, setNipGuruKunjungan] = useState<string>(GURU_KUNJUNGAN_OPTIONS[0].nip);
  const [showGuruModal, setShowGuruModal] = useState<boolean>(false);

  const [keterangan, setKeterangan] = useState<string>('');

  // Load initialData when editing
  useEffect(() => {
    if (initialData) {
      setTanggal(initialData.tanggal || getTodayISO());
      setHari(initialData.hari || getDayFromDateString(initialData.tanggal || getTodayISO()));
      setTahunAjaran(initialData.tahun_ajaran || '2025/2026');
      setWaktu(initialData.waktu || getCurrentTimeString());
      setIsAutoTime(false);
      setNamaSiswa(initialData.nama_siswa || '');
      setKategoriATS(initialData.kategori_ats || 'DO (Drop Out)');
      setKelas(initialData.kelas || '');
      setNamaOrangTua(initialData.nama_orang_tua || '');
      setAlamat(initialData.alamat || '');

      setAlasanATS(initialData.alasan_ats || ALASAN_ATS_OPTIONS[0].deskripsi);
      // find category matching description
      const matched = ALASAN_ATS_OPTIONS.find((opt) => opt.deskripsi === initialData.alasan_ats);
      setSelectedAlasanKategori(matched ? matched.kategori : 'Kustom / Lainnya');
      setAlasanManual(initialData.alasan_manual || '');

      setFotoKunjungan1(initialData.foto_kunjungan_1 || '');
      setFotoBuktiFisik2(initialData.foto_bukti_fisik_2 || '');

      setTempatLaporan(initialData.tempat_laporan || 'Pasuruan');
      setTanggalLaporan(initialData.tanggal_laporan || initialData.tanggal || getTodayISO());

      setNamaGuruKunjungan(initialData.nama_guru_kunjungan || GURU_KUNJUNGAN_OPTIONS[0].nama);
      setNipGuruKunjungan(initialData.nip_guru_kunjungan || GURU_KUNJUNGAN_OPTIONS[0].nip);
      setKeterangan(initialData.keterangan || '');
    }
  }, [initialData]);

  // When tanggal changes, update hari and sync tanggalLaporan if it was matching
  const handleTanggalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTanggal(val);
    setHari(getDayFromDateString(val));
    if (!initialData) {
      setTanggalLaporan(val);
    }
  };

  // Live timer if auto time is active
  useEffect(() => {
    if (!isAutoTime || initialData) return;
    const interval = setInterval(() => {
      setWaktu(getCurrentTimeString());
    }, 30000);
    return () => clearInterval(interval);
  }, [isAutoTime, initialData]);

  // Image Upload 1
  const handleFileUpload1 = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading1(true);
      const compressed = await compressImageFile(file, 1024, 1024, 0.75);
      setFotoKunjungan1(compressed);
    } catch (err) {
      console.error('Error compress foto 1:', err);
    } finally {
      setIsUploading1(false);
    }
  };

  // Image Upload 2
  const handleFileUpload2 = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading2(true);
      const compressed = await compressImageFile(file, 1024, 1024, 0.75);
      setFotoBuktiFisik2(compressed);
    } catch (err) {
      console.error('Error compress foto 2:', err);
    } finally {
      setIsUploading2(false);
    }
  };

  // Form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaSiswa.trim()) {
      alert('Nama Siswa ATS wajib diisi.');
      return;
    }
    if (!alamat.trim()) {
      alert('Alamat Siswa ATS wajib diisi.');
      return;
    }
    if (!alasanATS.trim()) {
      alert('Alasan ATS wajib dipilih.');
      return;
    }

    const payload: FormSiswaATSData & { id?: string } = {
      hari,
      tanggal,
      tahun_ajaran: tahunAjaran,
      waktu,
      nama_siswa: namaSiswa.trim(),
      kategori_ats: kategoriATS,
      kelas: kelas.trim(),
      nama_orang_tua: namaOrangTua.trim(),
      alamat: alamat.trim(),
      alasan_ats: alasanATS,
      alasan_manual: alasanManual.trim(),
      foto_kunjungan_1: fotoKunjungan1,
      foto_bukti_fisik_2: fotoBuktiFisik2,
      tempat_laporan: tempatLaporan.trim() || 'Pasuruan',
      tanggal_laporan: tanggalLaporan || tanggal,
      nama_guru_kunjungan: namaGuruKunjungan,
      nip_guru_kunjungan: nipGuruKunjungan,
      nama_kepala_sekolah: 'NUR FADILAH, S.Pd,. M.Pd',
      nip_kepala_sekolah: '19860410 201001 2 030',
      keterangan: keterangan.trim()
    };

    if (initialData?.id) {
      payload.id = initialData.id;
    }

    await onSubmit(payload);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all">
      {/* Header Form */}
      <div className="bg-gradient-to-r from-amber-700 via-rose-700 to-red-800 text-white p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-sm mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              UPT SMP NEGERI 7 PASURUAN • LAYANAN KHUSUS BK
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              {initialData ? 'Perbarui Data Siswa ATS' : 'Form Pendataan & Kunjungan Siswa ATS'}
            </h2>
            <p className="text-amber-100 text-xs sm:text-sm mt-1 max-w-2xl">
              Pencatatan Siswa ATS (Anak Tidak Sekolah: Drop Out / Lulus Tidak Melanjutkan), alasan kendala, dokumentasi foto fisik kunjungan, dan sinkronisasi otomatis ke database Supabase.
            </p>
          </div>

          {initialData && onCancelEdit && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-medium transition backdrop-blur-sm self-start sm:self-center"
            >
              <RotateCcw className="w-4 h-4" />
              Batal Edit
            </button>
          )}
        </div>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
        {/* BAGIAN 1: WAKTU & TAHUN AJARAN */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-slate-200 pb-2">
            <Calendar className="w-4 h-4 text-amber-700" />
            1. Waktu Pelaksanaan & Tahun Ajaran
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Hari & Tanggal */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Hari / Tanggal (Bentuk Kalender) <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={tanggal}
                  onChange={handleTanggalChange}
                  required
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              <div className="mt-1 flex items-center justify-between text-xs text-slate-500 px-1">
                <span>Hari Otomatis: <strong className="text-amber-800 font-semibold">{hari}</strong></span>
              </div>
            </div>

            {/* Tahun Ajaran (Popup Pilihan) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tahun Ajaran (Pilihan Popup) <span className="text-rose-600">*</span>
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={tahunAjaran}
                    readOnly
                    onClick={() => setShowTahunAjaranModal(true)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowTahunAjaranModal(true)}
                  className="px-3 py-2.5 bg-amber-50 border border-amber-300 text-amber-800 hover:bg-amber-100 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition"
                  title="Buka Popup Pilihan Tahun Ajaran"
                >
                  <Layers className="w-4 h-4 text-amber-700" />
                  Pilih
                </button>
              </div>
            </div>

            {/* Jam / Waktu Otomatis */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Jam / Waktu (Otomatis) <span className="text-rose-600">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setWaktu(getCurrentTimeString());
                    setIsAutoTime(true);
                  }}
                  className="text-[11px] text-amber-700 hover:text-amber-900 font-medium inline-flex items-center gap-1"
                >
                  <Clock className="w-3 h-3" />
                  Set Jam Sekarang
                </button>
              </div>
              <input
                type="text"
                value={waktu}
                onChange={(e) => {
                  setWaktu(e.target.value);
                  setIsAutoTime(false);
                }}
                required
                placeholder="Contoh: 08:30 WIB"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* BAGIAN 2: IDENTITAS SISWA ATS */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-slate-200 pb-2">
            <User className="w-4 h-4 text-amber-700" />
            2. Identitas & Status Siswa ATS
          </h3>

          {/* Pilihan Kategori Siswa ATS (3 Tombol Luas & Jelas) */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Kategori Siswa ATS <span className="text-rose-600">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                id="btn-kategori-do"
                onClick={() => {
                  setKategoriATS('DO (Drop Out)');
                  if (selectedAlasanKategori === 'Status Aktif / Bukan ATS') {
                    setAlasanATS(ALASAN_ATS_OPTIONS[0].deskripsi);
                    setSelectedAlasanKategori(ALASAN_ATS_OPTIONS[0].kategori);
                  }
                }}
                className={`p-3 text-xs font-bold rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  kategoriATS.includes('DO') && !kategoriATS.toLowerCase().includes('tidak')
                    ? 'bg-rose-50 border-rose-500 text-rose-800 ring-2 ring-rose-300 shadow-sm'
                    : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="text-sm font-bold text-slate-900">DO (Drop Out)</span>
                <span className="text-[11px] font-normal text-slate-500">Putus Sekolah</span>
              </button>
              <button
                type="button"
                id="btn-kategori-ltm"
                onClick={() => {
                  setKategoriATS('LTM (Lulus Tidak Melanjutkan)');
                  if (selectedAlasanKategori === 'Status Aktif / Bukan ATS') {
                    setAlasanATS(ALASAN_ATS_OPTIONS[0].deskripsi);
                    setSelectedAlasanKategori(ALASAN_ATS_OPTIONS[0].kategori);
                  }
                }}
                className={`p-3 text-xs font-bold rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  kategoriATS.includes('LTM') && !kategoriATS.toLowerCase().includes('tidak')
                    ? 'bg-amber-50 border-amber-500 text-amber-800 ring-2 ring-amber-300 shadow-sm'
                    : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="text-sm font-bold text-slate-900">LTM (Lulus Tdk Lanjut)</span>
                <span className="text-[11px] font-normal text-slate-500">Lulus Tidak Melanjutkan</span>
              </button>
              <button
                type="button"
                id="btn-kategori-tidak-do-tlm"
                onClick={() => {
                  setKategoriATS('Tidak DO / TLM');
                  const opt = ALASAN_ATS_OPTIONS.find(o => o.id === 'tidak_ats');
                  if (opt) {
                    setAlasanATS(opt.deskripsi);
                    setSelectedAlasanKategori(opt.kategori);
                  }
                }}
                className={`p-3 text-xs font-bold rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  kategoriATS.toLowerCase().includes('tidak') || kategoriATS.toLowerCase().includes('tlm')
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-300 shadow-sm'
                    : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="text-sm font-bold text-emerald-800">Tidak DO / TLM</span>
                <span className="text-[11px] font-normal text-emerald-600">Bukan Siswa ATS / Masih Aktif</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

            {/* Nama Siswa ATS */}
            <div className="md:col-span-8">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nama Siswa ATS (DO / LTM / Tidak DO/TLM) <span className="text-rose-600">*</span>
              </label>
              <SiswaSelector
                siswaItems={siswaItems}
                selectedKelas={kelas}
                onSelectKelas={(k) => setKelas(k)}
                selectedNamaSiswa={namaSiswa}
                onSelectNamaSiswa={(n) => setNamaSiswa(n)}
                onSelectStudentDetails={(s) => {
                  if (s.kelas) setKelas(s.kelas);
                }}
                isMultiSelect={false}
                kelasLabel="Kelas Terakhir"
                siswaLabel="Nama Siswa ATS"
                themeColor="amber"
                required={true}
              />
            </div>

            {/* Kelas Terakhir */}
            <div className="md:col-span-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Kelas Terakhir / Terdaftar
              </label>
              <input
                type="text"
                value={kelas}
                onChange={(e) => setKelas(e.target.value)}
                placeholder="Contoh: VIII A / IX B"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Nama Orang Tua / Wali */}
            <div className="md:col-span-12">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-600" />
                <span>Nama Orang Tua / Wali Siswa ATS</span>
              </label>
              <input
                type="text"
                value={namaOrangTua}
                onChange={(e) => setNamaOrangTua(e.target.value)}
                placeholder="Contoh: Bapak Sutrisno / Ibu Siti Aminah / Wali Siswa"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Alamat Siswa ATS */}
            <div className="md:col-span-12">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Alamat Siswa ATS <span className="text-rose-600">*</span></span>
                <span className="text-[11px] text-slate-400 font-normal">Sertakan RT/RW, Dusun/Kelurahan, Kecamatan</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <textarea
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  rows={2}
                  required
                  placeholder="Contoh: Jl. Ki Hajar Dewantara No. 12, RT 02 / RW 04, Kelurahan Sekargadung, Kec. Purworejo, Kota Pasuruan"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* BAGIAN 3: ALASAN ATS (POPUP PILIHAN & ISIAN MANUAL) */}
        <div>
          <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-2">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              3. Alasan Anak Tidak Sekolah (ATS)
            </h3>
            <button
              type="button"
              onClick={() => setShowAlasanModal(true)}
              className="px-3 py-1.5 bg-rose-50 border border-rose-300 text-rose-800 hover:bg-rose-100 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition"
            >
              <ChevronDown className="w-3.5 h-3.5 text-rose-700" />
              Buka Popup Pilihan Alasan
            </button>
          </div>

          <div className="space-y-4">
            {/* Alasan ATS Terpilih */}
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  Kategori Terpilih: {selectedAlasanKategori}
                </span>
                <span className="text-[11px] text-amber-700 font-medium">Klik &quot;Buka Popup Pilihan Alasan&quot; untuk mengganti</span>
              </div>
              <p className="text-sm text-slate-800 font-medium leading-relaxed">
                {alasanATS}
              </p>
            </div>

            {/* Isian Manual Uraian / Alasan Tambahan */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tambahkan Isian Manual / Uraian Spesifik Alasan ATS
              </label>
              <textarea
                value={alasanManual}
                onChange={(e) => setAlasanManual(e.target.value)}
                rows={3}
                placeholder="Tuliskan keterangan detail tambahan hasil wawancara kunjungan rumah dengan siswa atau orang tua... (opsional namun disarankan)"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* BAGIAN 4: DOKUMENTASI FOTO (KUNJUNGAN 1 & BUKTI FISIK 2) */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-slate-200 pb-2">
            <Camera className="w-4 h-4 text-amber-700" />
            4. Dokumentasi Foto Kunjungan & Bukti Fisik
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* FOTO 1: Kunjungan Rumah 1 */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-amber-700" />
                    FOTO KUNJUNGAN 1 (DOKUMENTASI FOTO)
                  </span>
                  <span className="text-[11px] font-normal text-slate-500">Bisa Input Link URL atau Upload Foto</span>
                </label>

                <div className="space-y-2">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LinkIcon className="w-4 h-4 text-slate-400" />
                    </div>
                    <input
                      type="url"
                      value={fotoKunjungan1}
                      onChange={(e) => {
                        setFotoKunjungan1(e.target.value);
                        setPreviewError1(false);
                      }}
                      placeholder="https://... (URL foto Google Drive / Imgur / web)"
                      className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all placeholder:text-slate-400"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 shadow-sm transition-colors">
                      <Upload className="w-3.5 h-3.5 text-amber-700" />
                      <span>{isUploading1 ? 'Mengompres...' : 'Pilih Foto Dokumentasi (Galeri / File)'}</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/jpg"
                        onChange={handleFileUpload1}
                        className="hidden"
                      />
                    </label>
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-slate-600 text-xs font-medium rounded-lg border border-slate-200 transition-colors">
                      <Camera className="w-3.5 h-3.5 text-slate-500" />
                      <span>Kamera Langsung</span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleFileUpload1}
                        className="hidden"
                      />
                    </label>
                    <div className="flex items-center gap-2 ml-auto">
                      <span className="text-[11px] text-slate-500">
                        {fotoKunjungan1.startsWith('data:image') ? '✓ Foto Terunggah' : 'Format JPG, PNG, WEBP'}
                      </span>
                      {fotoKunjungan1 && (
                        <button
                          type="button"
                          onClick={() => setFotoKunjungan1('')}
                          className="text-[11px] text-rose-600 hover:text-rose-800 font-semibold px-1.5 py-0.5 rounded bg-rose-50 border border-rose-200"
                        >
                          Hapus
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview Thumbnail Box */}
              <div className="mt-3">
                <div className="flex flex-col items-center justify-center p-2 bg-white rounded-xl border border-slate-200 min-h-[90px]">
                  {fotoKunjungan1 && !previewError1 ? (
                    <div className="relative group w-full h-24 overflow-hidden rounded-lg border border-slate-200 flex items-center justify-center bg-slate-900/5">
                      <img
                        src={fotoKunjungan1}
                        alt="Preview Foto Kunjungan 1"
                        onError={() => setPreviewError1(true)}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
                        Preview Dokumentasi Kunjungan 1
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-2">
                      <Camera className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                      <p className="text-[11px] text-slate-500 font-medium">Belum ada foto dokumentasi</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* FOTO 2: Bukti Fisik 2 */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-rose-700" />
                    FOTO BUKTI FISIK 2 (MANUAL / DOKUMEN)
                  </span>
                  <span className="text-[11px] font-normal text-slate-500">Input Link atau Upload Dokumen</span>
                </label>

                <div className="space-y-2">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LinkIcon className="w-4 h-4 text-slate-400" />
                    </div>
                    <input
                      type="url"
                      value={fotoBuktiFisik2}
                      onChange={(e) => {
                        setFotoBuktiFisik2(e.target.value);
                        setPreviewError2(false);
                      }}
                      placeholder="https://... (URL foto Google Drive / Imgur / web)"
                      className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all placeholder:text-slate-400"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 shadow-sm transition-colors">
                      <Upload className="w-3.5 h-3.5 text-rose-700" />
                      <span>{isUploading2 ? 'Mengompres...' : 'Pilih Foto Dokumentasi (Galeri / File)'}</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/jpg"
                        onChange={handleFileUpload2}
                        className="hidden"
                      />
                    </label>
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-slate-600 text-xs font-medium rounded-lg border border-slate-200 transition-colors">
                      <Camera className="w-3.5 h-3.5 text-slate-500" />
                      <span>Kamera Langsung</span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleFileUpload2}
                        className="hidden"
                      />
                    </label>
                    <div className="flex items-center gap-2 ml-auto">
                      <span className="text-[11px] text-slate-500">
                        {fotoBuktiFisik2.startsWith('data:image') ? '✓ Foto Terunggah' : 'Format JPG, PNG, WEBP'}
                      </span>
                      {fotoBuktiFisik2 && (
                        <button
                          type="button"
                          onClick={() => setFotoBuktiFisik2('')}
                          className="text-[11px] text-rose-600 hover:text-rose-800 font-semibold px-1.5 py-0.5 rounded bg-rose-50 border border-rose-200"
                        >
                          Hapus
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview Thumbnail Box */}
              <div className="mt-3">
                <div className="flex flex-col items-center justify-center p-2 bg-white rounded-xl border border-slate-200 min-h-[90px]">
                  {fotoBuktiFisik2 && !previewError2 ? (
                    <div className="relative group w-full h-24 overflow-hidden rounded-lg border border-slate-200 flex items-center justify-center bg-slate-900/5">
                      <img
                        src={fotoBuktiFisik2}
                        alt="Preview Foto Bukti Fisik 2"
                        onError={() => setPreviewError2(true)}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
                        Preview Dokumentasi Bukti Fisik 2
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-2">
                      <FileText className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                      <p className="text-[11px] text-slate-500 font-medium">Belum ada foto dokumentasi</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BAGIAN 5: PENGESAHAN & GURU KUNJUNGAN */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-slate-200 pb-2">
            <Award className="w-4 h-4 text-amber-700" />
            5. Tempat Laporan, Tanggal & Petugas Kunjungan
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tempat Laporan */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tempat Laporan <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                value={tempatLaporan}
                onChange={(e) => setTempatLaporan(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Tanggal Laporan (Kalender) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tanggal Laporan (Kalender) <span className="text-rose-600">*</span>
              </label>
              <input
                type="date"
                value={tanggalLaporan}
                onChange={(e) => setTanggalLaporan(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Nama Guru Kunjungan (Popup Pilihan) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nama Guru Kunjungan (Pilihan Popup) <span className="text-rose-600">*</span>
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={namaGuruKunjungan}
                    readOnly
                    onClick={() => setShowGuruModal(true)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowGuruModal(true)}
                  className="px-3 py-2.5 bg-amber-50 border border-amber-300 text-amber-800 hover:bg-amber-100 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition"
                  title="Pilih Guru Kunjungan"
                >
                  <Users className="w-4 h-4 text-amber-700" />
                  Pilih
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                NIP: <strong className="text-slate-700 font-semibold">{nipGuruKunjungan}</strong>
              </p>
            </div>

            {/* Keterangan / Rencana Tindak Lanjut (Optional) */}
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Rencana Tindak Lanjut / Keterangan Penanganan
              </label>
              <textarea
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                rows={2}
                placeholder="Contoh: Menghubungi pihak dinas terkait Program Indonesia Pintar (PIP), koordinasi dengan wali kelas dan pihak keluarga untuk opsi Kejar Paket B..."
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Data otomatis disimpan ke Cloud Supabase dan memori lokal perangkat.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {initialData && onCancelEdit && (
              <button
                type="button"
                onClick={onCancelEdit}
                disabled={isSubmitting}
                className="flex-1 sm:flex-initial px-5 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-sm font-semibold transition"
              >
                Batal
              </button>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 sm:flex-initial px-8 py-3 rounded-xl bg-gradient-to-r from-amber-700 via-rose-700 to-red-800 hover:from-amber-800 hover:to-red-900 text-white text-sm font-bold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isSubmitting
                ? 'Menyimpan ke Supabase...'
                : initialData
                ? 'Perbarui Data Siswa ATS'
                : 'Simpan Data Siswa ATS'}
            </button>
          </div>
        </div>
      </form>

      {/* POPUP MODAL: PILIHAN ALASAN ATS */}
      {showAlasanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-gradient-to-r from-rose-700 to-red-800 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 text-rose-200" />
                <h4 className="font-bold text-base">Pilih Kategori Alasan ATS</h4>
              </div>
              <button
                type="button"
                onClick={() => setShowAlasanModal(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
              <p className="text-xs text-slate-500 mb-2">
                Pilih salah satu dari 4 kategori utama faktor penyebab Anak Tidak Sekolah (ATS):
              </p>

              {ALASAN_ATS_OPTIONS.map((item) => {
                const isSelected = alasanATS === item.deskripsi;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setAlasanATS(item.deskripsi);
                      setSelectedAlasanKategori(item.kategori);
                      setShowAlasanModal(false);
                    }}
                    className={`w-full text-left p-4 rounded-xl border transition flex items-start gap-3.5 ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50/80 ring-2 ring-rose-200'
                        : 'border-slate-200 hover:border-rose-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="mt-0.5">
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold border ${item.badgeColor}`}>
                          {item.kategori}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {item.deskripsi}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setShowAlasanModal(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-xl transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP MODAL: PILIHAN TAHUN AJARAN */}
      {showTahunAjaranModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-gradient-to-r from-amber-700 to-red-800 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Layers className="w-5 h-5 text-amber-200" />
                <h4 className="font-bold text-base">Pilih Tahun Ajaran</h4>
              </div>
              <button
                type="button"
                onClick={() => setShowTahunAjaranModal(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-2.5">
              <p className="text-xs text-slate-500 mb-2">
                Pilih tahun ajaran aktif atau ketikkan tahun ajaran kustom:
              </p>

              <div className="grid grid-cols-2 gap-2">
                {TAHUN_AJARAN_OPTIONS.map((thn) => (
                  <button
                    key={thn}
                    type="button"
                    onClick={() => {
                      setTahunAjaran(thn);
                      setShowTahunAjaranModal(false);
                    }}
                    className={`p-3 rounded-xl border text-center font-bold text-sm transition ${
                      tahunAjaran === thn
                        ? 'bg-amber-100 border-amber-500 text-amber-900 ring-2 ring-amber-300'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    {thn}
                  </button>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-200 mt-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Atau Isi Tahun Ajaran Kustom:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customTahunAjaran}
                    onChange={(e) => setCustomTahunAjaran(e.target.value)}
                    placeholder="Misal: 2029/2030"
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customTahunAjaran.trim()) {
                        setTahunAjaran(customTahunAjaran.trim());
                        setShowTahunAjaranModal(false);
                      }
                    }}
                    disabled={!customTahunAjaran.trim()}
                    className="px-3 py-2 bg-amber-700 hover:bg-amber-800 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition"
                  >
                    Terapkan
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setShowTahunAjaranModal(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-xl transition"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP MODAL: PILIHAN GURU KUNJUNGAN */}
      {showGuruModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-gradient-to-r from-amber-700 via-rose-700 to-red-800 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Users className="w-5 h-5 text-amber-200" />
                <h4 className="font-bold text-base">Pilih Guru Kunjungan</h4>
              </div>
              <button
                type="button"
                onClick={() => setShowGuruModal(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <p className="text-xs text-slate-500 mb-2">
                Pilih guru BK yang bertugas melaksanakan kunjungan rumah (Home Visit) siswa ATS:
              </p>

              {GURU_KUNJUNGAN_OPTIONS.map((g) => {
                const isSelected = namaGuruKunjungan === g.nama;
                return (
                  <button
                    key={g.nip}
                    type="button"
                    onClick={() => {
                      setNamaGuruKunjungan(g.nama);
                      setNipGuruKunjungan(g.nip);
                      setShowGuruModal(false);
                    }}
                    className={`w-full text-left p-4 rounded-xl border transition flex items-center gap-3.5 ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50/80 ring-2 ring-amber-200'
                        : 'border-slate-200 hover:border-amber-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-sm text-slate-900">{g.nama}</div>
                      <div className="text-xs text-slate-500">NIP. {g.nip}</div>
                      <div className="text-[11px] text-amber-800 font-medium mt-0.5">{g.jabatan}</div>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setShowGuruModal(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-xl transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};
