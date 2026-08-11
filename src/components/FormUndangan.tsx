import { getActiveGuruBK, PRESET_GURU_BK } from '../lib/guruBk';
import React, { useState, useEffect } from 'react';
import { UndanganOrangTua, FormUndanganData, Siswa } from '../types';
import { SiswaSelector } from './SiswaSelector';
import {
  Users,
  Calendar,
  Clock,
  GraduationCap,
  User,
  Briefcase,
  MapPin,
  FileText,
  AlertTriangle,
  CheckSquare,
  Image as ImageIcon,
  HelpCircle,
  Save,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  XCircle,
  Pencil
} from 'lucide-react';

interface FormUndanganProps {
  initialData?: UndanganOrangTua | null;
  onSubmit: (data: Partial<UndanganOrangTua> & FormUndanganData) => Promise<void>;
  onCancelEdit?: () => void;
  isSubmitting?: boolean;
  siswaItems?: Siswa[];
}

const DAYS_LIST = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
const MONTHS_LIST = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const KELAS_PRESETS = [
  '7-A', '7-B', '7-C', '7-D', '7-E', '7-F', '7-G', '7-H',
  '8-A', '8-B', '8-C', '8-D', '8-E', '8-F', '8-G', '8-H',
  '9-A', '9-B', '9-C', '9-D', '9-E', '9-F', '9-G', '9-H'
];

const PERIHAL_PRESETS = [
  'Konsultasi Perkembangan Belajar & Kedisiplinan Siswa',
  'Penganganan Keterlambatan dan Kehadiran Siswa',
  'Konseling Kasus Pelanggaran Tata Tertib Sekolah',
  'Pendampingan Minat Bakat & Persiapan Karir',
  'Penguatan Karakter & Etika Pergaulan Siswa',
];

export const FormUndangan: React.FC<FormUndanganProps> = ({
  initialData,
  onSubmit,
  onCancelEdit,
  isSubmitting = false,
  siswaItems = [],
}) => {
  const getTodayISO = () => new Date().toISOString().slice(0, 10);

  const [hari, setHari] = useState('Senin');
  const [tanggal, setTanggal] = useState(getTodayISO());
  const [bulan, setBulan] = useState('Agustus');
  const [tahun, setTahun] = useState('2026');
  const [waktu, setWaktu] = useState('08:30 WIB');
  const [tempatPelaksanaan, setTempatPelaksanaan] = useState('SMP Negeri 7 Pasuruan');
  const [kelas, setKelas] = useState('8-A');
  const [namaSiswa, setNamaSiswa] = useState('');
  const [namaOrangTua, setNamaOrangTua] = useState('');
  const [pekerjaanOrangTua, setPekerjaanOrangTua] = useState('');
  const [alamat, setAlamat] = useState('');
  const [perihalUndangan, setPerihalUndangan] = useState('Konsultasi Perkembangan Belajar & Kedisiplinan Siswa');
  const [uraianPermasalahan, setUraianPermasalahan] = useState('');
  const [tindakLanjut, setTindakLanjut] = useState('');
  const [linkFotoKegiatan, setLinkFotoKegiatan] = useState('');
  const [keterangan, setKeterangan] = useState('');

  // Administration & Print Settings
  const [tanggalSurat, setTanggalSurat] = useState(getTodayISO());
  const [tempatSurat, setTempatSurat] = useState('Pasuruan');
  const [nomorSurat, setNomorSurat] = useState('400/  /423.102.54/2026');
  const [namaGuruBk, setNamaGuruBk] = useState(getActiveGuruBK().nama);
  const [nipGuruBk, setNipGuruBk] = useState(getActiveGuruBK().nip);
  const [namaKepalaSekolah, setNamaKepalaSekolah] = useState('NUR FADILAH, S.Pd,. M.Pd');
  const [nipKepalaSekolah, setNipKepalaSekolah] = useState('19860410 201001 2 030');
  const [semester, setSemester] = useState('SEMESTER 1 (GANJIL) TAHUN PELAJARAN 2025-2026');

  // Automatically update Hari, Bulan, Tahun from Date Picker selection
  const handleDateChange = (dateVal: string) => {
    setTanggal(dateVal);
    if (!dateVal) return;
    const d = new Date(dateVal);
    if (!isNaN(d.getTime())) {
      const dayNameIndex = d.getDay(); // 0 is Sunday
      const dayNamesMap = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      setHari(dayNamesMap[dayNameIndex]);
      setBulan(MONTHS_LIST[d.getMonth()]);
      setTahun(d.getFullYear().toString());
    }
  };

  useEffect(() => {
    if (initialData) {
      setHari(initialData.hari || 'Senin');
      setTanggal(initialData.tanggal || getTodayISO());
      setBulan(initialData.bulan || 'Agustus');
      setTahun(initialData.tahun || '2026');
      setWaktu(initialData.waktu || '08:30 WIB');
      setTempatPelaksanaan(initialData.tempat_pelaksanaan || 'SMP Negeri 7 Pasuruan');
      setKelas(initialData.kelas || '8-A');
      setNamaSiswa(initialData.nama_siswa || '');
      setNamaOrangTua(initialData.nama_orang_tua || '');
      setPekerjaanOrangTua(initialData.pekerjaan_orang_tua || '');
      setAlamat(initialData.alamat || '');
      setPerihalUndangan(initialData.perihal_undangan || 'Konsultasi Perkembangan Belajar & Kedisiplinan Siswa');
      setUraianPermasalahan(initialData.uraian_permasalahan || '');
      setTindakLanjut(initialData.tindak_lanjut || '');
      setLinkFotoKegiatan(initialData.link_foto_kegiatan || '');
      setKeterangan(initialData.keterangan || '');

      setTanggalSurat(initialData.tanggal_surat || getTodayISO());
      setTempatSurat(initialData.tempat_surat || 'Pasuruan');
      setNomorSurat(initialData.nomor_surat || '400/  /423.102.54/2026');
      setNamaGuruBk(initialData.nama_guru_bk || getActiveGuruBK().nama);
      setNipGuruBk(initialData.nip_guru_bk || getActiveGuruBK().nip);
      setNamaKepalaSekolah(initialData.nama_kepala_sekolah || 'NUR FADILAH, S.Pd,. M.Pd');
      setNipKepalaSekolah(initialData.nip_kepala_sekolah || '19860410 201001 2 030');
      setSemester(initialData.semester || 'SEMESTER 1 (GANJIL) TAHUN PELAJARAN 2025-2026');
    } else {
      handleDateChange(getTodayISO());
      setTempatPelaksanaan('SMP Negeri 7 Pasuruan');
      setNamaSiswa('');
      setNamaOrangTua('');
      setPekerjaanOrangTua('');
      setAlamat('');
      setUraianPermasalahan('');
      setTindakLanjut('');
      setLinkFotoKegiatan('');
      setKeterangan('');

      setTanggalSurat(getTodayISO());
      setTempatSurat('Pasuruan');
      setNomorSurat('400/  /423.102.54/2026');
      setNamaGuruBk(getActiveGuruBK().nama);
      setNipGuruBk(getActiveGuruBK().nip);
      setNamaKepalaSekolah('NUR FADILAH, S.Pd,. M.Pd');
      setNipKepalaSekolah('19860410 201001 2 030');
      setSemester('SEMESTER 1 (GANJIL) TAHUN PELAJARAN 2025-2026');
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!namaSiswa.trim()) {
      alert('Nama Siswa wajib diisi!');
      return;
    }
    if (!perihalUndangan.trim()) {
      alert('Perihal Undangan wajib diisi!');
      return;
    }

    const formData: Partial<UndanganOrangTua> & FormUndanganData = {
      id: initialData?.id,
      hari,
      tanggal,
      bulan,
      tahun,
      waktu,
      tempat_pelaksanaan: tempatPelaksanaan.trim(),
      kelas,
      nama_siswa: namaSiswa.trim(),
      nama_orang_tua: namaOrangTua.trim(),
      pekerjaan_orang_tua: pekerjaanOrangTua.trim(),
      alamat: alamat.trim(),
      perihal_undangan: perihalUndangan.trim(),
      uraian_permasalahan: uraianPermasalahan.trim(),
      tindak_lanjut: tindakLanjut.trim(),
      link_foto_kegiatan: linkFotoKegiatan.trim(),
      keterangan: keterangan.trim(),
      
      tanggal_surat: tanggalSurat,
      tempat_surat: tempatSurat.trim(),
      nomor_surat: nomorSurat.trim(),
      nama_guru_bk: namaGuruBk.trim(),
      nip_guru_bk: nipGuruBk.trim(),
      nama_kepala_sekolah: namaKepalaSekolah.trim(),
      nip_kepala_sekolah: nipKepalaSekolah.trim(),
      semester: semester.trim(),
    };

    await onSubmit(formData);
  };

  const handleReset = () => {
    if (window.confirm('Bersihkan seluruh isian form undangan?')) {
      handleDateChange(getTodayISO());
      setWaktu('08:30 WIB');
      setKelas('8-A');
      setNamaSiswa('');
      setNamaOrangTua('');
      setPekerjaanOrangTua('');
      setAlamat('');
      setPerihalUndangan('Konsultasi Perkembangan Belajar & Kedisiplinan Siswa');
      setUraianPermasalahan('');
      setTindakLanjut('');
      setLinkFotoKegiatan('');
      setKeterangan('');
      setTanggalSurat(getTodayISO());
      setTempatSurat('Pasuruan');
    }
  };

  const studentsInClass = (siswaItems || []).filter(
    (s) => (s.kelas || '').toLowerCase().replace(/\s+/g, '') === (kelas || '').toLowerCase().replace(/\s+/g, '')
  );

  return (
    <div className="bg-white text-slate-800 rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xl shadow-slate-200/50 relative overflow-hidden">
      
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 mb-6">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 text-white rounded-2xl shadow-md shadow-purple-500/20">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-purple-100 text-purple-800 border border-purple-200 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                FORMULIR B
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                Publik • Tanpa Login • Supabase Ready
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              UNDANGAN ORANG TUA SISWA
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Administrasi Penanganan & Pembinaan Siswa Melalui Undangan Orang Tua BK SMPN 7 Pasuruan
            </p>
          </div>
        </div>

        {initialData && (
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-300 text-amber-900 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm">
            <Pencil className="w-4 h-4 text-amber-600" />
            <span>Mode Edit Data (ID: {initialData.id.slice(0, 8)}...)</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* ROW 1: Hari, Tanggal, Waktu, Tempat */}
        <div className="bg-purple-50/40 p-4 sm:p-5 rounded-2xl border border-purple-100 space-y-4">
          <div className="flex items-center gap-2 text-purple-900 font-extrabold text-xs uppercase tracking-wider">
            <Calendar className="w-4 h-4 text-purple-600" />
            <span>1. WAKTU PELAKSANAAN UNDANGAN</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
            {/* Tanggal Picker */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>PILIH TANGGAL (KALENDER) <span className="text-red-400">*</span></span>
              </label>
              <input
                type="date"
                value={tanggal}
                onChange={(e) => handleDateChange(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all [color-scheme:dark]"
              />
            </div>

            {/* Hari */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">HARI</label>
              <select
                value={hari}
                onChange={(e) => setHari(e.target.value)}
                className="w-full px-3 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-semibold"
              >
                {DAYS_LIST.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Waktu */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                <span>JAM / WAKTU UNDANGAN</span>
              </label>
              <input
                type="text"
                value={waktu}
                onChange={(e) => setWaktu(e.target.value)}
                placeholder="Contoh: 08:30 WIB s/d Selesai"
                required
                className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-semibold focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Tempat Pelaksanaan */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-purple-400" />
                <span>TEMPAT PELAKSANAAN</span>
              </label>
              <input
                type="text"
                value={tempatPelaksanaan}
                onChange={(e) => setTempatPelaksanaan(e.target.value)}
                placeholder="Contoh: SMP Negeri 7 Pasuruan"
                required
                className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-semibold focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {/* ROW 2: Kelas, Nama Siswa, Nama Ortu, Pekerjaan Ortu, Alamat */}
        <div className="bg-slate-950/80 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-purple-400 font-extrabold text-xs uppercase tracking-wider">
            <GraduationCap className="w-4 h-4" />
            <span>2. IDENTITAS SISWA & ORANG TUA / WALI</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
          <div className="pt-2">
            <SiswaSelector
              siswaItems={siswaItems}
              selectedKelas={kelas}
              onSelectKelas={(k) => setKelas(k)}
              selectedNamaSiswa={namaSiswa}
              onSelectNamaSiswa={(n) => setNamaSiswa(n)}
              isMultiSelect={true}
              kelasLabel="Kelas Siswa"
              siswaLabel="Nama Siswa"
              themeColor="purple"
              required={true}
            />
          </div>

            {/* Nama Orang Tua */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-purple-400" />
                <span>NAMA ORANG TUA / WALI <span className="text-slate-400 text-[10px] font-normal">(Opsional)</span></span>
              </label>
              <input
                type="text"
                value={namaOrangTua}
                onChange={(e) => setNamaOrangTua(e.target.value)}
                placeholder="Contoh: Bapak Santoso / Ibu Rahma (boleh dikosongkan)"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-semibold focus:ring-2 focus:ring-purple-500"
              />
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Pekerjaan Orang Tua */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-purple-400" />
                <span>PEKERJAAN ORANG TUA <span className="text-slate-400 text-[10px] font-normal">(Opsional)</span></span>
              </label>
              <input
                type="text"
                value={pekerjaanOrangTua}
                onChange={(e) => setPekerjaanOrangTua(e.target.value)}
                placeholder="Contoh: Wiraswasta / PNS / Karyawan Swasta"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-medium"
              />
            </div>

            {/* Alamat */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-purple-400" />
                <span>ALAMAT TEMPAT TINGGAL <span className="text-slate-400 text-[10px] font-normal">(Opsional)</span></span>
              </label>
              <input
                type="text"
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                placeholder="Contoh: Jl. Pahlawan No. 45, Pasuruan"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-medium"
              />
            </div>

          </div>
        </div>

        {/* ROW 3: Perihal Undangan, Uraian Permasalahan Siswa, Tindak Lanjut */}
        <div className="bg-slate-950/80 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-rose-400 font-extrabold text-xs uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            <span>3. PERIHAL & URAIAN PERMASALAHAN SISWA</span>
          </div>

          {/* Perihal Undangan */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              PERIHAL UNDANGAN <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={perihalUndangan}
              onChange={(e) => setPerihalUndangan(e.target.value)}
              placeholder="Perihal undangan ke orang tua..."
              required
              className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-bold focus:ring-2 focus:ring-purple-500 mb-2"
            />
            
            {/* Presets */}
            <div className="flex flex-wrap gap-1.5">
              {PERIHAL_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setPerihalUndangan(preset)}
                  className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-purple-950 text-slate-300 hover:text-purple-300 border border-slate-800 transition-colors"
                >
                  + {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Uraian Permasalahan Siswa */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>URAIAN PERMASALAHAN SISWA</span>
            </label>
            <textarea
              rows={3}
              value={uraianPermasalahan}
              onChange={(e) => setUraianPermasalahan(e.target.value)}
              placeholder="Jelaskan detail permasalahan siswa yang melatarbelakangi dipanggilnya orang tua/wali..."
              className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 font-normal leading-relaxed"
            />
          </div>

          {/* Tindak Lanjut */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>TINDAK LANJUT HASIL PERTEMUAN / SOLUSI</span>
            </label>
            <textarea
              rows={2}
              value={tindakLanjut}
              onChange={(e) => setTindakLanjut(e.target.value)}
              placeholder="Rencana tindakan, kesepakatan orang tua & guru BK, atau solusi yang diambil..."
              className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 font-normal leading-relaxed"
            />
          </div>
        </div>

        {/* ROW 4: Link Foto Kegiatan & Keterangan */}
        <div className="bg-slate-950/80 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-cyan-400 font-extrabold text-xs uppercase tracking-wider">
            <ImageIcon className="w-4 h-4" />
            <span>4. DOKUMENTASI FOTO KEGIATAN & KETERANGAN</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Link Foto Kegiatan */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                LINK FOTO KEGIATAN (URL)
              </label>
              <input
                type="text"
                value={linkFotoKegiatan}
                onChange={(e) => setLinkFotoKegiatan(e.target.value)}
                placeholder="https://drive.google.com/... atau URL foto"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:ring-2 focus:ring-purple-500"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                * Tempelkan URL foto dokumentasi dari Google Drive / Cloud storage.
              </p>

              {/* Photo Preview if valid image URL */}
              {linkFotoKegiatan && (linkFotoKegiatan.startsWith('http://') || linkFotoKegiatan.startsWith('https://')) && (
                <div className="mt-2.5 p-2 bg-slate-900 rounded-xl border border-slate-800 flex items-center gap-3">
                  <img
                    src={linkFotoKegiatan}
                    alt="Pratinjau Foto"
                    className="w-12 h-12 object-cover rounded-lg shrink-0 border border-slate-700"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="text-[11px] text-slate-300 truncate">
                    <p className="font-bold text-amber-300">Pratinjau Link Foto Terpasang</p>
                    <p className="text-slate-400 truncate">{linkFotoKegiatan}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Keterangan */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                KETERANGAN TAMBAHAN
              </label>
              <textarea
                rows={3}
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder="Catatan tambahan seperti kehadiran orang tua, perwakilan wali, status kasus, dll."
                className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-medium"
              />
            </div>

          </div>
        </div>

        {/* ROW 5: ADMINISTRASI SURAT (TANGGAL PEMBUATAN, NOMOR SURAT, GURU BK / KONSELOR, KEPALA SEKOLAH) */}
        <div className="bg-slate-950/80 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-indigo-400 font-extrabold text-xs uppercase tracking-wider">
            <FileText className="w-4 h-4 text-amber-400" />
            <span>5. ADMINISTRASI CETAK SURAT UNDANGAN & LAPORAN</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Tanggal Pembuatan Surat */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>TANGGAL PEMBUATAN SURAT (KALENDER)</span>
              </label>
              <input
                type="date"
                value={tanggalSurat}
                onChange={(e) => setTanggalSurat(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:ring-2 focus:ring-purple-500 [color-scheme:dark]"
              />
            </div>

            {/* Tempat Pembuatan Surat */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>TEMPAT PEMBUATAN SURAT</span>
              </label>
              <input
                type="text"
                value={tempatSurat}
                onChange={(e) => setTempatSurat(e.target.value)}
                placeholder="Contoh: Pasuruan"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-semibold focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Nomor Surat */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                NOMOR SURAT UNDANGAN
              </label>
              <input
                type="text"
                value={nomorSurat}
                onChange={(e) => setNomorSurat(e.target.value)}
                placeholder="400/  /423.102.54/2026"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Semester */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                SEMESTER & TAHUN PELAJARAN
              </label>
              <input
                type="text"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                placeholder="SEMESTER 1 (GANJIL) TAHUN PELAJARAN 2025-2026"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-medium focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
            {/* Nama & NIP Guru BK / Konselor */}
            <div className="space-y-3 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
              <span className="text-xs font-bold text-purple-300 block">
                PEJABAT KONSELOR / GURU BK
              </span>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Nama Guru BK / Konselor
                </label>
                <select
                  value={namaGuruBk}
                  onChange={(e) => {
                    setNamaGuruBk(e.target.value);
                    const preset = PRESET_GURU_BK.find(g => g.nama === e.target.value);
                    if (preset) setNipGuruBk(preset.nip);
                  }}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white font-bold cursor-pointer"
                >
                  {PRESET_GURU_BK.map(g => (
                    <option key={g.nip} value={g.nama}>{g.nama}</option>
                  ))}
                  {!PRESET_GURU_BK.some(g => g.nama === namaGuruBk) && (
                    <option value={namaGuruBk}>{namaGuruBk}</option>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  NIP Guru BK / Konselor
                </label>
                <select
                  value={nipGuruBk}
                  onChange={(e) => {
                    setNipGuruBk(e.target.value);
                    const preset = PRESET_GURU_BK.find(g => g.nip === e.target.value);
                    if (preset) setNamaGuruBk(preset.nama);
                  }}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-slate-300 cursor-pointer"
                >
                  {PRESET_GURU_BK.map(g => (
                    <option key={g.nip} value={g.nip}>{g.nip}</option>
                  ))}
                  {!PRESET_GURU_BK.some(g => g.nip === nipGuruBk) && (
                    <option value={nipGuruBk}>{nipGuruBk}</option>
                  )}
                </select>
              </div>
            </div>

            {/* Nama & NIP Kepala Sekolah */}
            <div className="space-y-3 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
              <span className="text-xs font-bold text-amber-300 block">
                KEPALA SEKOLAH
              </span>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Nama Kepala Sekolah
                </label>
                <input
                  type="text"
                  value={namaKepalaSekolah}
                  onChange={(e) => setNamaKepalaSekolah(e.target.value)}
                  placeholder="NUR FADILAH, S.Pd,. M.Pd"
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  NIP Kepala Sekolah
                </label>
                <input
                  type="text"
                  value={nipKepalaSekolah}
                  onChange={(e) => setNipKepalaSekolah(e.target.value)}
                  placeholder="19860410 201001 2 030"
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-slate-300"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Action Buttons Bar */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl border border-slate-700 transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Form</span>
          </button>

          <div className="flex items-center gap-3">
            {onCancelEdit && initialData && (
              <button
                type="button"
                onClick={onCancelEdit}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl border border-slate-700 transition-colors"
              >
                Batal Edit
              </button>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-700 hover:from-purple-500 hover:to-rose-600 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2 transform active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-amber-300" />
              )}
              <span>
                {initialData ? 'UPDATE UNDANGAN ORANG TUA' : 'SIMPAN UNDANGAN ORANG TUA'}
              </span>
            </button>
          </div>

        </div>

      </form>

    </div>
  );
};
