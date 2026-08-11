import React, { useState, useEffect } from 'react';
import { JurnalBK, FormJurnalBKData, SiswaTidakHadir, Siswa } from '../types';
import { SiswaSelector } from './SiswaSelector';
import { getActiveGuruBK } from '../lib/guruBk';
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
  GraduationCap
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
  'Jam Ke 1',
  'Jam Ke 2',
  'Jam Ke 3',
  'Jam Ke 4',
  'Jam Ke 5',
  'Jam Ke 6',
  'Jam Ke 7',
  'Jam Ke 8'
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
  const [keterangan, setKeterangan] = useState<string>('');
  const [namaGuruBK, setNamaGuruBK] = useState<string>(activeGuruBK.nama);
  const [nipGuruBK, setNipGuruBK] = useState<string>(activeGuruBK.nip);
  const [namaKepalaSekolah, setNamaKepalaSekolah] = useState<string>('NUR FADILAH, S.Pd');
  const [nipKepalaSekolah, setNipKepalaSekolah] = useState<string>('19860410 201001 2 030');

  // List of non-attending students
  const [siswaTidakMengikuti, setSiswaTidakMengikuti] = useState<SiswaTidakHadir[]>([]);
  const [newNamaSiswa, setNewNamaSiswa] = useState<string>('');
  const [newAlasan, setNewAlasan] = useState<string>('');
  const [newTindakLanjut, setNewTindakLanjut] = useState<string>('');

  const [showSuccessNotif, setShowSuccessNotif] = useState(false);
  const [notifMessage, setNotifMessage] = useState('');

  // Auto calculate Hari, Bulan, Tahun when date changes
  useEffect(() => {
    if (dateVal) {
      const d = new Date(dateVal);
      if (!isNaN(d.getTime())) {
        const dayIdx = d.getDay();
        const monthIdx = d.getMonth();
        setHari(NAMA_HARI[dayIdx]);
        setBulan(NAMA_BULAN[monthIdx]);
        setTahun(d.getFullYear().toString());
      }
    }
  }, [dateVal]);

  // Load initialData when editing an existing Jurnal BK
  useEffect(() => {
    if (initialData) {
      setDateVal(initialData.tanggal || defaultDateStr);
      setHari(initialData.hari || 'Senin');
      setBulan(initialData.bulan || 'Agustus');
      setTahun(initialData.tahun || '2026');
      setJamKe(initialData.jam_ke || '');
      setKelas(initialData.kelas || '');
      setSasaranPeserta(initialData.sasaran_peserta || `Siswa Kelas ${initialData.kelas || ''}`);
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
      setNamaKepalaSekolah(initialData.nama_kepala_sekolah || 'NUR FADILAH, S.Pd');
      setNipKepalaSekolah(initialData.nip_kepala_sekolah || '19860410 201001 2 030');
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
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Calendar className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-800">1. Waktu & Pelaksanaan Layanan BK</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Layanan</label>
              <input
                type="date"
                value={dateVal}
                onChange={(e) => setDateVal(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Hari</label>
              <input
                type="text"
                value={hari}
                onChange={(e) => setHari(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm font-medium text-slate-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Bulan</label>
              <input
                type="text"
                value={bulan}
                onChange={(e) => setBulan(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm font-medium text-slate-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tahun</label>
              <input
                type="text"
                value={tahun}
                onChange={(e) => setTahun(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm font-medium text-slate-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Jam Ke</label>
              <input
                type="text"
                value={jamKe}
                onChange={(e) => setJamKe(e.target.value)}
                placeholder="Contoh: Jam Ke 1 - 2"
                list="preset-jam-list"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all"
              />
              <datalist id="preset-jam-list">
                {PRESET_JAM.map((j) => (
                  <option key={j} value={j} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kelas</label>
              <input
                type="text"
                value={kelas}
                onChange={(e) => {
                  setKelas(e.target.value);
                  if (!sasaranPeserta || sasaranPeserta.startsWith('Siswa Kelas')) {
                    setSasaranPeserta(`Siswa Kelas ${e.target.value}`);
                  }
                }}
                placeholder="Contoh: VIII A"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Sasaran Peserta / Konseli</label>
              <input
                type="text"
                value={sasaranPeserta}
                onChange={(e) => setSasaranPeserta(e.target.value)}
                placeholder="Contoh: Siswa Kelas VIII A"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all"
              />
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
            <span className="text-xs bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-full font-semibold">
              Total: {siswaTidakMengikuti.length} Siswa
            </span>
          </div>

          {/* Quick Input Row for Missing Students */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <p className="text-xs font-medium text-slate-600">Tambah Data Siswa Absen / Tidak Ikut Layanan:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nama Siswa</label>
                <SiswaSelector
                  siswaItems={siswaItems}
                  selectedKelas={kelas}
                  onSelectKelas={(k) => setKelas(k)}
                  selectedNamaSiswa={newNamaSiswa}
                  onSelectNamaSiswa={(val) => setNewNamaSiswa(val)}
                  themeColor="emerald"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Alasan</label>
                <input
                  type="text"
                  value={newAlasan}
                  onChange={(e) => setNewAlasan(e.target.value)}
                  placeholder="Contoh: Sakit / Izin / Alpha"
                  list="preset-alasan-list"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500"
                />
                <datalist id="preset-alasan-list">
                  {PRESET_ALASAN_ABSEN.map((a) => (
                    <option key={a} value={a} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Tindak Lanjut</label>
                <input
                  type="text"
                  value={newTindakLanjut}
                  onChange={(e) => setNewTindakLanjut(e.target.value)}
                  placeholder="Contoh: Bimbingan Susulan"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddSiswaTidakHadir}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg text-xs transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> Tambah Siswa ke Daftar Absen
            </button>
          </div>

          {/* Table of Non-Attending Students */}
          {siswaTidakMengikuti.length > 0 ? (
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-2.5 text-center w-10">NO</th>
                    <th className="p-2.5">NAMA SISWA</th>
                    <th className="p-2.5">ALASAN</th>
                    <th className="p-2.5">TINDAK LANJUT</th>
                    <th className="p-2.5 text-center w-16">AKSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {siswaTidakMengikuti.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-50 transition-colors">
                      <td className="p-2.5 text-center font-bold text-slate-500">{index + 1}</td>
                      <td className="p-2.5 font-semibold text-slate-800">{item.nama_siswa}</td>
                      <td className="p-2.5">
                        <span className="px-2 py-0.5 rounded-full text-[11px] bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                          {item.alasan}
                        </span>
                      </td>
                      <td className="p-2.5 text-slate-600">{item.tindak_lanjut}</td>
                      <td className="p-2.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveSiswaTidakHadir(index)}
                          className="p-1 text-rose-600 hover:bg-rose-50 rounded transition-colors"
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
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Link Foto / Dokumentasi Kegiatan
              </label>
              <input
                type="url"
                value={linkFoto}
                onChange={(e) => setLinkFoto(e.target.value)}
                placeholder="https://drive.google.com/... atau URL foto"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Keterangan Catatan Tambahan
              </label>
              <input
                type="text"
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder="Catatan pendukung pelaksanaan..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all"
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
              <label className="block text-xs font-bold text-slate-700">Guru Bimbingan Konseling (Konselor)</label>
              <input
                type="text"
                value={namaGuruBK}
                onChange={(e) => setNamaGuruBK(e.target.value)}
                placeholder="Nama Guru BK"
                required
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
              />
              <input
                type="text"
                value={nipGuruBK}
                onChange={(e) => setNipGuruBK(e.target.value)}
                placeholder="NIP Guru BK"
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-600"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Kepala SMP Negeri 7 Pasuruan</label>
              <input
                type="text"
                value={namaKepalaSekolah}
                onChange={(e) => setNamaKepalaSekolah(e.target.value)}
                placeholder="Nama Kepala Sekolah"
                required
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
              />
              <input
                type="text"
                value={nipKepalaSekolah}
                onChange={(e) => setNipKepalaSekolah(e.target.value)}
                placeholder="NIP Kepala Sekolah"
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-600"
              />
            </div>
          </div>
        </div>

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
