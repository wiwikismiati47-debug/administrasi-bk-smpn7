import React, { useState, useEffect } from 'react';
import { JurnalBK, FormJurnalBKData, SiswaTidakHadir, Siswa } from '../types';
import { SiswaSelector } from './SiswaSelector';
import { getActiveGuruBK, PRESET_GURU_BK, setActiveGuruBK, GuruBK } from '../lib/guruBk';
import { compressImageFile } from '../lib/imageCompressor';
import {
  BookOpen,
  Calendar,
  Clock,
  Layers,
  Award,
  Users,
  UserX,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  Building,
  GraduationCap,
  UserCheck,
  UserCog,
  X,
  Check,
  Image as ImageIcon,
  Link as LinkIcon,
  Upload,
  Eye,
  Camera
} from 'lucide-react';

interface FormJurnalBKProps {
  initialData?: JurnalBK | null;
  onSubmit: (data: Partial<JurnalBK> & FormJurnalBKData) => Promise<void>;
  onCancelEdit?: () => void;
  isSubmitting: boolean;
  siswaItems?: Siswa[];
  onOpenPrint?: (item: JurnalBK) => void;
}

const NAMA_HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const NAMA_BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export const BIDANG_LAYANAN_OPTIONS = [
  'Pribadi',
  'Sosial',
  'Belajar',
  'Karir'
];

export const JENIS_LAYANAN_OPTIONS = [
  'Bimbingan Klasikal / Lintas Kelas',
  'Bimbingan Kelompok',
  'Konseling Kelompok',
  'Konseling Individual',
  'Konsultasi / Referal (Alih Tangan Kasus)',
  'Bimbingan Teman Sebaya',
  'Konferensi Kasus (Case Conference)',
  'Advokasi'
];

export const FUNGSI_LAYANAN_OPTIONS = [
  'Pemahaman: Membantu konseli memahami diri dan lingkungannya.',
  'Pencegahan (Preventif): Upaya mencegah masalah yang mungkin terjadi.',
  'Pengentasan (Kuratif): Upaya mengatasi masalah yang sedang dialami konseli.',
  'Pemeliharaan dan Pengembangan: Menjaga kondisi yang sudah baik dan mengembangkannya secara berkelanjutan.',
  'Advokasi: Membela hak-hak konseli yang terabaikan.'
];

export const PRESET_JAM = [
  'Jam Ke 1 - 2 (07.15 - 08.35 WIB)',
  'Jam Ke 3 - 4 (08.35 - 09.55 WIB)',
  'Jam Ke 5 - 6 (10.35 - 11.55 WIB)',
  'Jam Ke 7 - 8 (11.55 - 13.15 WIB)',
  'Jam Ke 1 (07.15 - 07.55 WIB)',
  'Jam Ke 2 (07.55 - 08.35 WIB)',
  'Jam Ke 3 (08.35 - 09.15 WIB)',
  'Jam Ke 4 (09.15 - 09.55 WIB)',
  'Jam Ke 5 (10.35 - 11.15 WIB)',
  'Jam Ke 6 (11.15 - 11.55 WIB)',
  'Jam Ke 7 (11.55 - 12.35 WIB)',
  'Jam Ke 8 (12.35 - 13.15 WIB)'
];

export const PRESET_KELAS = [
  'VII A', 'VII B', 'VII C', 'VII D', 'VII E', 'VII F', 'VII G', 'VII H',
  'VIII A', 'VIII B', 'VIII C', 'VIII D', 'VIII E', 'VIII F', 'VIII G', 'VIII H',
  'IX A', 'IX B', 'IX C', 'IX D', 'IX E', 'IX F', 'IX G', 'IX H',
  'Kelas 7-A', 'Kelas 7-B', 'Kelas 7-C', 'Kelas 7-D', 'Kelas 7-E', 'Kelas 7-F', 'Kelas 7-G', 'Kelas 7-H',
  'Kelas 8-A', 'Kelas 8-B', 'Kelas 8-C', 'Kelas 8-D', 'Kelas 8-E', 'Kelas 8-F', 'Kelas 8-G', 'Kelas 8-H',
  'Kelas 9-A', 'Kelas 9-B', 'Kelas 9-C', 'Kelas 9-D', 'Kelas 9-E', 'Kelas 9-F', 'Kelas 9-G', 'Kelas 9-H',
  'Lintas Kelas 7', 'Lintas Kelas 8', 'Lintas Kelas 9', 'Gabungan Kelas 7, 8 & 9'
];

export const PRESET_SASARAN_PESERTA = [
  'Siswa Kelas VII A',
  'Siswa Kelas VII B',
  'Siswa Kelas VII C',
  'Siswa Kelas VII D',
  'Siswa Kelas VII E',
  'Siswa Kelas VII F',
  'Siswa Kelas VII G',
  'Siswa Kelas VII H',
  'Siswa Kelas VIII A',
  'Siswa Kelas VIII B',
  'Siswa Kelas VIII C',
  'Siswa Kelas VIII D',
  'Siswa Kelas VIII E',
  'Siswa Kelas VIII F',
  'Siswa Kelas VIII G',
  'Siswa Kelas VIII H',
  'Siswa Kelas IX A',
  'Siswa Kelas IX B',
  'Siswa Kelas IX C',
  'Siswa Kelas IX D',
  'Siswa Kelas IX E',
  'Siswa Kelas IX F',
  'Siswa Kelas IX G',
  'Siswa Kelas IX H',
  'Seluruh Siswa Kelas 7',
  'Seluruh Siswa Kelas 8',
  'Seluruh Siswa Kelas 9',
  'Seluruh Siswa Kelas 7, 8, 9',
  'Siswa Kelompok Bimbingan',
  'Konseli Individual',
  'Orang Tua / Wali Siswa',
  'Wali Kelas & Guru Mata Pelajaran'
];

export const PRESET_ALASAN_ABSEN = [
  'Sakit (Izin Surat Ortu)',
  'Izin (Kepentingan Keluarga)',
  'Alpha (Tanpa Keterangan)',
  'Dispensasi Tugas Lomba / Kegiatan Sekolah',
  'Mengikuti Layanan Kesehatan / UKS',
  'Mencari Bimbingan Susulan'
];

export const FormJurnalBK: React.FC<FormJurnalBKProps> = ({
  initialData,
  onSubmit,
  onCancelEdit,
  isSubmitting,
  siswaItems = [],
  onOpenPrint
}) => {
  const today = new Date();
  const defaultDateStr = today.toISOString().split('T')[0];
  const activeGuruBK = getActiveGuruBK();

  const [dateVal, setDateVal] = useState<string>(defaultDateStr);
  const [hari, setHari] = useState<string>('Senin');
  const [bulan, setBulan] = useState<string>('Agustus');
  const [tahun, setTahun] = useState<string>('2026');
  const [jamKe, setJamKe] = useState<string>('Jam Ke 1 - 2 (07.15 - 08.35 WIB)');
  const [kelas, setKelas] = useState<string>('VIII A');
  const [sasaranPeserta, setSasaranPeserta] = useState<string>('Siswa Kelas VIII A');
  const [materiLayanan, setMateriLayanan] = useState<string>('');
  const [bidangLayanan, setBidangLayanan] = useState<string>('Pribadi');
  const [jenisLayanan, setJenisLayanan] = useState<string>('Bimbingan Klasikal / Lintas Kelas');
  const [fungsiLayanan, setFungsiLayanan] = useState<string>(FUNGSI_LAYANAN_OPTIONS[0]);
  const [hasilLayananBmb3, setHasilLayananBmb3] = useState<string>('');
  const [linkFoto, setLinkFoto] = useState<string>('');
  const [previewError, setPreviewError] = useState<boolean>(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file, 1024, 1024, 0.75);
      if (dataUrl) {
        setLinkFoto(dataUrl);
        setPreviewError(false);
      }
    } catch (err) {
      console.error('Gagal memproses foto:', err);
      alert('Gagal memproses foto. Silakan coba file gambar lain.');
    }
  };
  const [keterangan, setKeterangan] = useState<string>('');
  const [namaGuruBK, setNamaGuruBK] = useState<string>(activeGuruBK.nama);
  const [nipGuruBK, setNipGuruBK] = useState<string>(activeGuruBK.nip);
  const [namaKepalaSekolah, setNamaKepalaSekolah] = useState<string>('NUR FADILAH, S.Pd,. M.Pd');
  const [nipKepalaSekolah, setNipKepalaSekolah] = useState<string>('19860410 201001 2 030');
  const [showGuruBkPopup, setShowGuruBkPopup] = useState<boolean>(false);

  // List of non-attending students
  const [siswaTidakMengikuti, setSiswaTidakMengikuti] = useState<SiswaTidakHadir[]>([]);
  const [newNamaSiswa, setNewNamaSiswa] = useState<string>('');
  const [newAlasan, setNewAlasan] = useState<string>('');
  const [newTindakLanjut, setNewTindakLanjut] = useState<string>('');

  const [showSuccessNotif, setShowSuccessNotif] = useState(false);
  const [notifMessage, setNotifMessage] = useState('');
  const [currentTime, setCurrentTime] = useState<string>('');

  const [isManualJam, setIsManualJam] = useState<boolean>(false);
  const [isManualKelas, setIsManualKelas] = useState<boolean>(false);
  const [isManualSasaran, setIsManualSasaran] = useState<boolean>(false);
  const [isManualGuruBk, setIsManualGuruBk] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const secs = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${hrs}.${mins}.${secs} WIB`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleUseCurrentTime = () => {
    const now = new Date();
    const hrs = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    setJamKe(`Jam (${hrs}.${mins} WIB)`);
  };

  // Auto calculate Hari, Bulan, Tahun when date changes
  useEffect(() => {
    if (dateVal) {
      const parts = dateVal.split('-').map(Number);
      if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        const dayIdx = d.getDay();
        const monthIdx = d.getMonth();
        setHari(NAMA_HARI[dayIdx]);
        setBulan(NAMA_BULAN[monthIdx]);
        setTahun(String(parts[0]));
      }
    }
  }, [dateVal]);

  // Load initialData when editing an existing Jurnal BK or reset when new
  useEffect(() => {
    if (initialData) {
      setDateVal(initialData.tanggal || defaultDateStr);
      setHari(initialData.hari || 'Senin');
      setBulan(initialData.bulan || 'Agustus');
      setTahun(initialData.tahun || '2026');
      setJamKe(initialData.jam_ke || 'Jam Ke 1 - 2 (07.15 - 08.35 WIB)');
      setKelas(initialData.kelas || 'VIII A');
      setSasaranPeserta(initialData.sasaran_peserta || `Siswa Kelas ${initialData.kelas || 'VIII A'}`);
      setMateriLayanan(initialData.materi_layanan || '');
      setBidangLayanan(initialData.bidang_layanan || 'Pribadi');
      setJenisLayanan(initialData.jenis_layanan || 'Bimbingan Klasikal / Lintas Kelas');
      setFungsiLayanan(initialData.fungsi_layanan || FUNGSI_LAYANAN_OPTIONS[0]);
      setHasilLayananBmb3(initialData.hasil_layanan_bmb3 || '');
      setSiswaTidakMengikuti(initialData.siswa_tidak_mengikuti || []);
      setLinkFoto(initialData.link_foto_kegiatan || '');
      setKeterangan(initialData.keterangan || '');
      setNamaGuruBK(initialData.nama_guru_bk || activeGuruBK.nama);
      setNipGuruBK(initialData.nip_guru_bk || activeGuruBK.nip);
      setNamaKepalaSekolah(initialData.nama_kepala_sekolah || 'NUR FADILAH, S.Pd,. M.Pd');
      setNipKepalaSekolah(initialData.nip_kepala_sekolah || '19860410 201001 2 030');
    } else {
      const today = new Date();
      setDateVal(today.toISOString().split('T')[0]);
      setJamKe('Jam Ke 1 - 2 (07.15 - 08.35 WIB)');
      setKelas('VIII A');
      setSasaranPeserta('Siswa Kelas VIII A');
      setMateriLayanan('');
      setBidangLayanan('Pribadi');
      setJenisLayanan('Bimbingan Klasikal / Lintas Kelas');
      setFungsiLayanan(FUNGSI_LAYANAN_OPTIONS[0]);
      setHasilLayananBmb3('');
      setSiswaTidakMengikuti([]);
      setLinkFoto('');
      setKeterangan('');
      setNamaGuruBK(activeGuruBK.nama);
      setNipGuruBK(activeGuruBK.nip);
    }
  }, [initialData]);

  const handleAddSiswaTidakHadir = () => {
    if (!newNamaSiswa.trim()) {
      alert('Masukkan nama siswa terlebih dahulu');
      return;
    }
    const newEntry: SiswaTidakHadir = {
      nama_siswa: newNamaSiswa.trim(),
      alasan: newAlasan.trim() || 'Tanpa Keterangan',
      tindak_lanjut: newTindakLanjut.trim() || 'Layanan susulan / Bimbingan individual'
    };
    setSiswaTidakMengikuti([...siswaTidakMengikuti, newEntry]);
    setNewNamaSiswa('');
    setNewAlasan('');
    setNewTindakLanjut('');
  };

  const handleRemoveSiswaTidakHadir = (index: number) => {
    setSiswaTidakMengikuti(siswaTidakMengikuti.filter((_, idx) => idx !== index));
  };

  const handleReset = () => {
    const today = new Date();
    setDateVal(today.toISOString().split('T')[0]);
    setJamKe('Jam Ke 1 - 2 (07.15 - 08.35 WIB)');
    setKelas('VIII A');
    setSasaranPeserta('Siswa Kelas VIII A');
    setMateriLayanan('');
    setBidangLayanan('Pribadi');
    setJenisLayanan('Bimbingan Klasikal / Lintas Kelas');
    setFungsiLayanan(FUNGSI_LAYANAN_OPTIONS[0]);
    setHasilLayananBmb3('');
    setSiswaTidakMengikuti([]);
    setLinkFoto('');
    setKeterangan('');
    if (onCancelEdit) onCancelEdit();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!materiLayanan.trim()) {
      alert('Mohon isi Materi Layanan BK');
      return;
    }

    const payload: Partial<JurnalBK> & FormJurnalBKData = {
      id: initialData?.id,
      hari,
      tanggal: dateVal,
      bulan,
      tahun,
      jam_ke: jamKe,
      materi_layanan: materiLayanan.trim(),
      bidang_layanan: bidangLayanan,
      jenis_layanan: jenisLayanan,
      fungsi_layanan: fungsiLayanan,
      hasil_layanan_bmb3: hasilLayananBmb3.trim(),
      siswa_tidak_mengikuti: siswaTidakMengikuti,
      kelas: kelas.trim(),
      sasaran_peserta: sasaranPeserta.trim(),
      link_foto_kegiatan: linkFoto.trim(),
      keterangan: keterangan.trim(),
      nama_guru_bk: namaGuruBK,
      nip_guru_bk: nipGuruBK,
      nama_kepala_sekolah: namaKepalaSekolah,
      nip_kepala_sekolah: nipKepalaSekolah,
      tanggal_surat: dateVal,
      tempat_surat: 'Pasuruan'
    };

    try {
      await onSubmit(payload);
      setNotifMessage(initialData ? 'Data Jurnal BK Berhasil Diperbarui & Disimpan!' : 'Jurnal BK Baru Berhasil Disimpan ke Supabase & Local Database!');
      setShowSuccessNotif(true);
      setTimeout(() => setShowSuccessNotif(false), 4000);
      if (!initialData) {
        handleReset();
      }
    } catch (err) {
      alert('Gagal menyimpan Jurnal BK. Mohon periksa jaringan atau konfigurasi Supabase.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-indigo-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-emerald-500/20 rounded-2xl border border-emerald-400/30 backdrop-blur-sm">
              <BookOpen className="w-8 h-8 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
                  FORMULIR PUBLIK
                </span>
                <span className="text-xs text-emerald-200 font-medium">
                  {initialData ? '✎ Mode Edit Data' : '✨ Input Jurnal Harian'}
                </span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
                Jurnal Layanan Bimbingan dan Konseling
              </h2>
              <p className="text-sm text-emerald-100/80 mt-0.5">
                SMP Negeri 7 Pasuruan — Pengisian Jurnal Harian, Bidang, Jenis, Fungsi, Hasil BMB3 & Siswa Absen
              </p>
            </div>
          </div>

          {initialData && onCancelEdit && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-sm border border-white/20 transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Batal Edit
            </button>
          )}
        </div>
      </div>

      {/* Notification Banner */}
      {showSuccessNotif && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3 shadow-md animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="text-sm font-medium">{notifMessage}</div>
        </div>
      )}

      {/* Main Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-8">
        {/* SECTION 1: WAKTU & HARI / TANGGAL / BULAN / TAHUN */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-800">1. Waktu & Pelaksanaan Layanan BK</h3>
            </div>
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                const dStr = now.toISOString().split('T')[0];
                setDateVal(dStr);
                setHari(NAMA_HARI[now.getDay()]);
                setBulan(NAMA_BULAN[now.getMonth()]);
                setTahun(String(now.getFullYear()));
              }}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-800 transition-colors"
            >
              Hari Ini
            </button>
          </div>

          <div className="max-w-md">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Layanan <span className="text-red-500">*</span></label>
              <input
                type="date"
                value={dateVal}
                onChange={(e) => setDateVal(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          <div className="px-3 py-1.5 bg-emerald-50/60 border border-emerald-100 rounded-xl flex items-center gap-2 text-xs font-bold text-emerald-900">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            <span>{hari}, {new Date(dateVal || defaultDateStr).getDate()} {bulan} {tahun}</span>
          </div>

          {/* ROW 2: Jam Ke, Kelas, Sasaran Peserta (Model Pilihan Agenda BK SMPN7) */}
          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Jam Ke */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Jam Ke <span className="text-rose-500">*</span></span>
                  </label>
                  {currentTime && (
                    <button
                      type="button"
                      onClick={handleUseCurrentTime}
                      className="text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-md transition-all inline-flex items-center gap-1 shrink-0"
                      title="Gunakan jam realtime saat ini"
                    >
                      <Sparkles className="w-3 h-3 text-emerald-600 animate-pulse" />
                      <span>{currentTime}</span>
                    </button>
                  )}
                </div>

                <select
                  value={PRESET_JAM.includes(jamKe) ? jamKe : isManualJam ? '__manual__' : jamKe ? jamKe : ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '__manual__') {
                      setIsManualJam(true);
                    } else {
                      setIsManualJam(false);
                      setJamKe(val);
                    }
                  }}
                  required={!jamKe}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 font-semibold cursor-pointer shadow-sm focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">-- Pilih Jam Ke --</option>
                  {PRESET_JAM.map((j) => (
                    <option key={j} value={j}>
                      {j}
                    </option>
                  ))}
                  <option value="__manual__">Ketik Jam Ke Manual...</option>
                </select>

                {isManualJam && (
                  <input
                    type="text"
                    value={jamKe}
                    onChange={(e) => setJamKe(e.target.value)}
                    placeholder="Contoh: Jam Ke 1 - 2 (07.15 - 08.35 WIB)"
                    required
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                )}
              </div>

              {/* Kelas */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Kelas <span className="text-rose-500">*</span></span>
                </label>

                <input
                  type="text"
                  value={kelas}
                  list="preset-kelas-jurnal"
                  onChange={(e) => {
                    const val = e.target.value;
                    setKelas(val);
                    if (val && (!sasaranPeserta || sasaranPeserta.startsWith('Siswa Kelas'))) {
                      setSasaranPeserta(`Siswa Kelas ${val}`);
                    }
                  }}
                  placeholder="Contoh: 7H / VIII A / Kelas 7-H"
                  required
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 transition-all"
                />
                <datalist id="preset-kelas-jurnal">
                  {Array.from(
                    new Set([
                      ...PRESET_KELAS,
                      '7A', '7B', '7C', '7D', '7E', '7F', '7G', '7H',
                      '8A', '8B', '8C', '8D', '8E', '8F', '8G', '8H',
                      '9A', '9B', '9C', '9D', '9E', '9F', '9G', '9H',
                      ...siswaItems.map((s) => s.kelas).filter(Boolean)
                    ])
                  ).map((k) => (
                    <option key={k} value={k} />
                  ))}
                </datalist>
              </div>

              {/* Sasaran Peserta / Konseli */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Sasaran Peserta / Konseli <span className="text-rose-500">*</span></span>
                </label>

                <input
                  type="text"
                  value={sasaranPeserta}
                  onChange={(e) => setSasaranPeserta(e.target.value)}
                  placeholder="Contoh: Siswa Kelas VIII A"
                  required
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>

            </div>
          </div>
        </div>

        {/* SECTION 2: MATERI & KLASIFIKASI LAYANAN */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Layers className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-800">2. Materi, Bidang, Jenis & Fungsi Layanan BK</h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Materi Layanan BK <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={materiLayanan}
              onChange={(e) => setMateriLayanan(e.target.value)}
              rows={2}
              placeholder="Tuliskan Topik / Judul Materi Layanan BK yang diberikan..."
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Bidang Layanan BK <span className="text-rose-500">*</span>
              </label>
              <select
                value={bidangLayanan}
                onChange={(e) => setBidangLayanan(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all"
              >
                {BIDANG_LAYANAN_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Jenis Layanan / Kegiatan <span className="text-rose-500">*</span>
              </label>
              <select
                value={jenisLayanan}
                onChange={(e) => setJenisLayanan(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all"
              >
                {JENIS_LAYANAN_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Fungsi Layanan BK <span className="text-rose-500">*</span>
            </label>
            <select
              value={fungsiLayanan}
              onChange={(e) => setFungsiLayanan(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all"
            >
              {FUNGSI_LAYANAN_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* SECTION 3: HASIL YANG DICAPAI (BMB3) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Award className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold text-slate-800">3. Hasil yang Dicapai (BMB3)</h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Deskripsi Hasil Immediate Layanan (BMB3: Berpikir, Merasa, Bersikap, Bertindak, Bertanggung Jawab)
            </label>
            <textarea
              value={hasilLayananBmb3}
              onChange={(e) => setHasilLayananBmb3(e.target.value)}
              rows={3}
              placeholder="Deskripsikan kondisi segera setelah layanan (Contoh: Siswa memahami materi [B], merasa nyaman [M], bersikap kooperatif [B], bertindak aktif [T], dan berkomitmen bertanggung jawab [B])."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>
        </div>

        {/* SECTION 4: SISWA YANG TIDAK MENGIKUTI LAYANAN BK */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <UserX className="w-5 h-5 text-rose-600" />
              <h3 className="text-base font-bold text-slate-800">4. Siswa yang Tidak Mengikuti Layanan BK</h3>
            </div>
            <div className="flex items-center gap-2">
              {siswaTidakMengikuti.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Kosongkan semua daftar siswa absen?')) {
                      setSiswaTidakMengikuti([]);
                    }
                  }}
                  className="text-xs font-bold text-slate-400 hover:text-rose-600 px-2 py-1 transition-colors"
                >
                  Bersihkan
                </button>
              )}
              <span className="text-xs bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-full font-semibold">
                Total: {siswaTidakMengikuti.length} Siswa Absen
              </span>
            </div>
          </div>

          {/* Quick Input Row for Missing Students with Multi-Select Reason Support */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-700">
                Pilih atau Input Siswa Absen / Tidak Ikut Layanan:
              </p>
              <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                💡 Gunakan tombol <strong>"Multi-Pilih Siswa (&gt;10)"</strong> untuk menentukan alasan per siswa sekaligus
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <SiswaSelector
                  siswaItems={siswaItems}
                  selectedKelas={kelas}
                  onSelectKelas={(k) => setKelas(k)}
                  selectedNamaSiswa={newNamaSiswa}
                  onSelectNamaSiswa={(val) => setNewNamaSiswa(val)}
                  themeColor="rose"
                  siswaLabel="Pilih Nama Siswa"
                  showAbsenReason={true}
                  initialAlasan={newAlasan || 'Sakit'}
                  initialTindakLanjut={newTindakLanjut || 'Bimbingan Susulan'}
                  onMultiSelectAbsen={(items) => {
                    setSiswaTidakMengikuti((prev) => [...prev, ...items]);
                    setNewNamaSiswa('');
                  }}
                  required={false}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Alasan Default (Single Siswa)
                </label>
                <input
                  type="text"
                  value={newAlasan}
                  onChange={(e) => setNewAlasan(e.target.value)}
                  placeholder="Contoh: Sakit / Izin / Alpha"
                  list="preset-alasan-list"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-rose-500"
                />
                <datalist id="preset-alasan-list">
                  {PRESET_ALASAN_ABSEN.map((a) => (
                    <option key={a} value={a} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Tindak Lanjut BK (Single Siswa)
                </label>
                <input
                  type="text"
                  value={newTindakLanjut}
                  onChange={(e) => setNewTindakLanjut(e.target.value)}
                  placeholder="Contoh: Bimbingan Susulan"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleAddSiswaTidakHadir}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg text-xs transition-colors shadow-sm active:scale-95"
              >
                <Plus className="w-4 h-4" /> Tambah 1 Siswa Ini
              </button>
            </div>
          </div>

          {/* Table of Non-Attending Students */}
          {siswaTidakMengikuti.length > 0 ? (
            <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-sm">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-2.5 text-center w-10">NO</th>
                    <th className="p-2.5 min-w-[160px]">NAMA SISWA</th>
                    <th className="p-2.5 min-w-[180px]">ALASAN ABSEN</th>
                    <th className="p-2.5 min-w-[180px]">TINDAK LANJUT BK</th>
                    <th className="p-2.5 text-center w-16">AKSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {siswaTidakMengikuti.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-2.5 text-center font-bold text-slate-500">{index + 1}</td>
                      <td className="p-2.5 font-bold text-slate-800">{item.nama_siswa}</td>
                      <td className="p-2.5">
                        <input
                          type="text"
                          value={item.alasan}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSiswaTidakMengikuti((prev) =>
                              prev.map((s, idx) => (idx === index ? { ...s, alasan: val } : s))
                            );
                          }}
                          className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-rose-400 rounded-lg px-2.5 py-1 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-rose-400"
                        />
                      </td>
                      <td className="p-2.5">
                        <input
                          type="text"
                          value={item.tindak_lanjut}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSiswaTidakMengikuti((prev) =>
                              prev.map((s, idx) => (idx === index ? { ...s, tindak_lanjut: val } : s))
                            );
                          }}
                          className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-400 rounded-lg px-2.5 py-1 text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-400"
                        />
                      </td>
                      <td className="p-2.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveSiswaTidakHadir(index)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Hapus Siswa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic bg-slate-50 p-3 rounded-lg border border-dashed border-slate-200 text-center">
              Nihil (Semua siswa/konseli mengikuti layanan BK dengan lengkap).
            </p>
          )}
        </div>

        {/* SECTION 5: FOTO DOKUMENTASI & KETERANGAN */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <FileText className="w-5 h-5 text-teal-600" />
            <h3 className="text-base font-bold text-slate-800">5. Dokumentasi & Keterangan Tambahan</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* LINK FOTO KEGIATAN */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3 md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-teal-600" />
                  LINK FOTO KEGIATAN
                </span>
                <span className="text-[11px] text-slate-500">Bisa Input Link URL atau Upload Foto</span>
              </label>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                
                {/* Input URL */}
                <div className="md:col-span-2 space-y-2">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LinkIcon className="w-4 h-4 text-slate-400" />
                    </div>
                    <input
                      type="url"
                      value={linkFoto}
                      onChange={(e) => {
                        setLinkFoto(e.target.value);
                        setPreviewError(false);
                      }}
                      placeholder="https://... (URL foto Google Drive / Imgur / web)"
                      className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all placeholder:text-slate-400"
                    />
                  </div>

                  {/* Local File Upload Button */}
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 shadow-sm transition-colors">
                      <Upload className="w-3.5 h-3.5 text-teal-600" />
                      <span>Pilih Foto Dokumentasi (Galeri / File)</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/jpg"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-600 text-xs font-medium rounded-lg border border-slate-200 transition-colors">
                      <Camera className="w-3.5 h-3.5 text-slate-500" />
                      <span>Kamera Langsung</span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[11px] text-slate-500">
                      {linkFoto.startsWith('data:image')
                        ? '✓ Foto dokumentasi berhasil diunggah'
                        : 'Format JPG, PNG, WEBP'}
                    </span>
                  </div>
                </div>

                {/* Photo Preview Thumbnail */}
                <div className="flex flex-col items-center justify-center p-2 bg-white rounded-lg border border-slate-200 min-h-[90px]">
                  {linkFoto && !previewError ? (
                    <div className="relative group w-full h-20 overflow-hidden rounded border border-slate-200 flex items-center justify-center bg-slate-900/5">
                      <img
                        src={linkFoto}
                        alt="Preview Kegiatan"
                        onError={() => setPreviewError(true)}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium gap-1">
                        <Eye className="w-3.5 h-3.5" /> Preview
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-2 text-slate-400">
                      <ImageIcon className="w-6 h-6 mx-auto mb-1 opacity-50" />
                      <span className="text-[11px] block">
                        {previewError ? 'Link foto tidak valid' : 'Belum ada foto'}
                      </span>
                    </div>
                  )}
                </div>

              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Keterangan Catatan Tambahan
              </label>
              <input
                type="text"
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder="Catatan pendukung pelaksanaan..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* SECTION 6: PENGESAHAN GURU BK & KEPALA SEKOLAH */}
        <div className="space-y-4 bg-slate-50/70 p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
            <Building className="w-5 h-5 text-slate-700" />
            <h3 className="text-base font-bold text-slate-800">6. Pengesahan (Guru BK & Kepala Sekolah)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <label className="block text-xs font-bold text-slate-700">Guru Bimbingan Konseling (Konselor)</label>
                <button
                  type="button"
                  onClick={() => setShowGuruBkPopup(true)}
                  className="px-2.5 py-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                  title="Klik untuk memilih Guru BK via Pop-up"
                >
                  <UserCog className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Pop-up Pilih Guru BK</span>
                </button>
              </div>

              <select
                value={PRESET_GURU_BK.some((g) => g.nama === namaGuruBK) ? namaGuruBK : isManualGuruBk ? '__manual__' : ''}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '__manual__') {
                    setIsManualGuruBk(true);
                  } else {
                    setIsManualGuruBk(false);
                    const preset = PRESET_GURU_BK.find((g) => g.nama === val);
                    if (preset) {
                      setNamaGuruBK(preset.nama);
                      setNipGuruBK(preset.nip);
                      setActiveGuruBK(preset);
                    }
                  }
                }}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 font-semibold cursor-pointer focus:ring-2 focus:ring-emerald-500 shadow-sm"
              >
                <option value="">-- Pilih Guru BK (Konselor) --</option>
                {PRESET_GURU_BK.map((g) => (
                  <option key={g.nip} value={g.nama}>
                    {g.nama} (NIP. {g.nip})
                  </option>
                ))}
                <option value="__manual__">Ketik Guru BK Manual...</option>
              </select>

              {isManualGuruBk && (
                <div className="space-y-2 pt-1 animate-in fade-in duration-150">
                  <input
                    type="text"
                    value={namaGuruBK}
                    onChange={(e) => setNamaGuruBK(e.target.value)}
                    placeholder="Nama Guru BK"
                    required
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    type="text"
                    value={nipGuruBK}
                    onChange={(e) => setNipGuruBK(e.target.value)}
                    placeholder="NIP Guru BK"
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Kepala SMP Negeri 7 Pasuruan</label>
              <input
                type="text"
                value={namaKepalaSekolah}
                onChange={(e) => setNamaKepalaSekolah(e.target.value)}
                placeholder="Nama Kepala Sekolah"
                required
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="text"
                value={nipKepalaSekolah}
                onChange={(e) => setNipKepalaSekolah(e.target.value)}
                placeholder="NIP Kepala Sekolah"
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* POP-UP MODAL PILIH GURU BK */}
        {showGuruBkPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">
              <div className="bg-gradient-to-r from-indigo-700 to-emerald-700 p-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-amber-300" />
                  <h3 className="font-bold text-sm">Pilih Guru Bimbingan Konseling (Konselor)</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowGuruBkPopup(false)}
                  className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 space-y-3">
                <p className="text-xs text-slate-600">
                  Pilih salah satu nama Guru BK / Konselor di bawah ini untuk diterapkan secara otomatis pada laporan:
                </p>

                <div className="space-y-2">
                  {PRESET_GURU_BK.map((guru, index) => {
                    const isSelected = namaGuruBK === guru.nama;
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          setNamaGuruBK(guru.nama);
                          setNipGuruBK(guru.nip);
                          setActiveGuruBK(guru);
                          setShowGuruBkPopup(false);
                        }}
                        className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/30'
                            : 'bg-white border-slate-200 hover:border-indigo-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                            isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {guru.nama.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-xs text-slate-800">{guru.nama}</div>
                            <div className="text-[11px] text-slate-500 font-mono mt-0.5">NIP. {guru.nip}</div>
                          </div>
                        </div>
                        {isSelected ? (
                          <span className="px-2.5 py-1 text-[11px] font-bold text-indigo-700 bg-indigo-100 rounded-lg flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Terpilih
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 bg-slate-100 rounded-lg">
                            Pilih
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowGuruBkPopup(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                  >
                    Tutup Pop-up
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBMIT & ACTION BUTTONS */}
        <div className="pt-4 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              disabled={isSubmitting}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Reset Form
            </button>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 md:flex-initial px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSubmitting
                ? 'Menyimpan Data...'
                : initialData
                ? 'Update Jurnal BK'
                : 'Simpan Jurnal BK ke Supabase'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
