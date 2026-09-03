import { getActiveGuruBK, PRESET_GURU_BK } from '../lib/guruBk';
import { compressImageFile } from '../lib/imageCompressor';
import React, { useState, useEffect, useMemo } from 'react';
import { HomeVisit, FormHomeVisitData, Siswa } from '../types';
import { SiswaSelector } from './SiswaSelector';
import {
  Home,
  Calendar,
  Clock,
  GraduationCap,
  User,
  Users,
  Briefcase,
  MapPin,
  FileText,
  FileCheck,
  AlertTriangle,
  CheckSquare,
  Image as ImageIcon,
  Link as LinkIcon,
  Upload,
  Eye,
  RotateCcw,
  CheckCircle2,
  Pencil,
  Search,
  ChevronDown,
  X,
  Layers,
  Sparkles,
  School,
  Check
} from 'lucide-react';

interface FormHomeVisitProps {
  initialData?: HomeVisit | null;
  onSubmit: (data: Partial<HomeVisit> & FormHomeVisitData) => Promise<void>;
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

const SEMESTER_LAPORAN_OPTIONS = [
  'SEMESTER 1 (GANJIL) TAHUN PELAJARAN 2026-2027',
  'SEMESTER 2 (GENAP) TAHUN PELAJARAN 2026-2027',
];

const PERIHAL_PRESETS = [
  'Kunjungan Rumah Terkait Presensi & Kehadiran Siswa',
  'Home Visit Pendampingan Belajar Rumah & Konseling Siswa',
  'Kunjungan Rumah Penanganan Ketidakhadiran Tanpa Keterangan',
  'Home Visit Penguatan Hubungan Sekolah & Orang Tua Siswa',
  'Pendampingan Khusus Masalah Perilaku & Kedisiplinan Siswa',
];

export const FormHomeVisit: React.FC<FormHomeVisitProps> = ({
  initialData,
  onSubmit,
  onCancelEdit,
  isSubmitting = false,
  siswaItems = [],
}) => {
  const getTodayISO = () => new Date().toISOString().slice(0, 10);

  const [hari, setHari] = useState('Kamis');
  const [tanggal, setTanggal] = useState(getTodayISO());
  const [bulan, setBulan] = useState('Agustus');
  const [tahun, setTahun] = useState('2026');
  const [waktu, setWaktu] = useState('09:00 WIB');
  const [kelas, setKelas] = useState('8-A');
  const [namaSiswa, setNamaSiswa] = useState('');
  const [namaOrangTua, setNamaOrangTua] = useState('');
  const [pekerjaanOrangTua, setPekerjaanOrangTua] = useState('');
  const [alamat, setAlamat] = useState('');
  const [perihalHomeVisit, setPerihalHomeVisit] = useState('Kunjungan Rumah Terkait Presensi & Kehadiran Siswa');
  const [uraianPermasalahan, setUraianPermasalahan] = useState('');
  const [tindakLanjut, setTindakLanjut] = useState('');
  const [linkFotoKegiatan, setLinkFotoKegiatan] = useState('');
  const [previewError, setPreviewError] = useState<boolean>(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file, 1024, 1024, 0.75);
      if (dataUrl) {
        setLinkFotoKegiatan(dataUrl);
        setPreviewError(false);
      }
    } catch (err) {
      console.error('Gagal memproses foto:', err);
      alert('Gagal memproses foto. Silakan coba file gambar lain.');
    }
  };
  const [keterangan, setKeterangan] = useState('');

  // Administration & Print Settings
  const [tanggalSurat, setTanggalSurat] = useState(getTodayISO());
  const [tempatSurat, setTempatSurat] = useState('Pasuruan');
  const [namaGuruBk, setNamaGuruBk] = useState(getActiveGuruBK().nama);
  const [nipGuruBk, setNipGuruBk] = useState(getActiveGuruBK().nip);
  const [namaKepalaSekolah, setNamaKepalaSekolah] = useState('NUR FADILAH, S.Pd,. M.Pd');
  const [nipKepalaSekolah, setNipKepalaSekolah] = useState('19860410 201001 2 030');

  // Surat Tugas Kunjungan Rumah fields (Semua underlined item)
  const [nomorSuratTugas, setNomorSuratTugas] = useState('015');
  const [petugas1, setPetugas1] = useState(getActiveGuruBK().nama);
  const [petugas2, setPetugas2] = useState('');
  const [jabatanPetugas1, setJabatanPetugas1] = useState('Guru Bimbingan dan Konseling');
  const [jabatanPetugas2, setJabatanPetugas2] = useState('Wali Kelas / Waka Kesiswaan');
  const [nisSiswa, setNisSiswa] = useState('');

  // Surat Pernyataan Kesediaan Menerima Kunjungan Orang Tua fields
  const [tanggalSuratTugas, setTanggalSuratTugas] = useState(getTodayISO());
  const [petugasPenerimaKunjungan, setPetugasPenerimaKunjungan] = useState(getActiveGuruBK().nama);
  const [tanggalPernyataanOrtu, setTanggalPernyataanOrtu] = useState(getTodayISO());

  // 14 Field Laporan Kunjungan Rumah Resmi (Sesuai Lampiran User)
  const [semesterLaporan, setSemesterLaporan] = useState('SEMESTER 1 (GANJIL) TAHUN PELAJARAN 2026-2027');
  const [bidangLayanan, setBidangLayanan] = useState('Pribadi / Belajar');
  const [topikPermasalahan, setTopikPermasalahan] = useState('');
  const [fungsiLayanan, setFungsiLayanan] = useState('Pemahaman/Pencegahan/Penyembuhan');
  const [pihakTerlibat, setPihakTerlibat] = useState('1. Konselor\n2. Wali Kelas');
  const [tujuanKegiatan, setTujuanKegiatan] = useState(
    'a) Membangun hubungan baik dengan orangtua/wali peserta didik/konseli\nb) Melengkapi dan klarifikasi data tentang peserta didik/konseli\nc) Mengkonsultasikan serta membangun kolaborasi untuk pemecahan masalah peserta didik/konseli'
  );
  const [gambaranRingkasMasalah, setGambaranRingkasMasalah] = useState('');
  const [alamatKunjungan, setAlamatKunjungan] = useState('');
  const [hariTanggalLamaKunjungan, setHariTanggalLamaKunjungan] = useState('');
  const [anggotaKeluargaDikunjungi, setAnggotaKeluargaDikunjungi] = useState('');
  const [rencanaEvaluasi, setRencanaEvaluasi] = useState(
    'a) Konfirmasi kebenaran tentang siswa bersama orangtua\nb) Kualitas hubungan dengan keluarga'
  );
  const [catatanKhusus, setCatatanKhusus] = useState(
    'Konseli selama mengikuti pembelajaran disekolah termasuk siswa yang baik, tekun, tidak pernah membuat pelanggaran tata tertib sekolah dan tidak pernah bolos sekolah.'
  );

  // Popup Modals state for Section 8 (14 Poin Laporan)
  const [isSemesterPopupOpen, setIsSemesterPopupOpen] = useState(false);
  const [isSiswaPopupOpen, setIsSiswaPopupOpen] = useState(false);
  const [isKelasSemesterPopupOpen, setIsKelasSemesterPopupOpen] = useState(false);
  const [searchSiswaPopup, setSearchSiswaPopup] = useState('');
  const [filterKelasSiswaPopup, setFilterKelasSiswaPopup] = useState('ALL');

  // Filtered students for popup selector
  const filteredSiswaForPopup = useMemo(() => {
    return (siswaItems || []).filter((s) => {
      const q = searchSiswaPopup.toLowerCase().trim();
      const matchSearch =
        !q ||
        (s.nama_siswa || '').toLowerCase().includes(q) ||
        (s.nis || '').toLowerCase().includes(q) ||
        (s.kelas || '').toLowerCase().includes(q);

      const k = (s.kelas || '').toUpperCase().replace(/\s+/g, '');
      const matchKelas =
        filterKelasSiswaPopup === 'ALL' ||
        k === filterKelasSiswaPopup.replace(/\s+/g, '') ||
        (filterKelasSiswaPopup === 'KELAS_7' && k.startsWith('7')) ||
        (filterKelasSiswaPopup === 'KELAS_8' && k.startsWith('8')) ||
        (filterKelasSiswaPopup === 'KELAS_9' && k.startsWith('9'));

      return matchSearch && matchKelas;
    });
  }, [siswaItems, searchSiswaPopup, filterKelasSiswaPopup]);

  // Auto Sync 14 Poin dari Form Utama
  const handleSyncLaporan14Poin = () => {
    setTopikPermasalahan(perihalHomeVisit || 'Membicarakan permasalahan siswa');
    setGambaranRingkasMasalah(uraianPermasalahan || 'Informasi yang didapat dari sekolah/komite.');
    setAlamatKunjungan(alamat || 'Alamat tempat tinggal siswa');
    setHariTanggalLamaKunjungan(`${hari}, ${tanggal} (${waktu})`);
    setAnggotaKeluargaDikunjungi(`Ayah : ${namaOrangTua || '-'}    Ibu : -`);
  };

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
      setHari(initialData.hari || 'Kamis');
      setTanggal(initialData.tanggal || getTodayISO());
      setBulan(initialData.bulan || 'Agustus');
      setTahun(initialData.tahun || '2026');
      setWaktu(initialData.waktu || '09:00 WIB');
      setKelas(initialData.kelas || '8-A');
      setNamaSiswa(initialData.nama_siswa || '');
      setNamaOrangTua(initialData.nama_orang_tua || '');
      setPekerjaanOrangTua(initialData.pekerjaan_orang_tua || '');
      setAlamat(initialData.alamat || '');
      setPerihalHomeVisit(initialData.perihal_home_visit || 'Kunjungan Rumah Terkait Presensi & Kehadiran Siswa');
      setUraianPermasalahan(initialData.uraian_permasalahan || '');
      setTindakLanjut(initialData.tindak_lanjut || '');
      setLinkFotoKegiatan(initialData.link_foto_kegiatan || '');
      setKeterangan(initialData.keterangan || '');

      setTanggalSurat(initialData.tanggal_surat || getTodayISO());
      setTempatSurat(initialData.tempat_surat || 'Pasuruan');
      setNamaGuruBk(initialData.nama_guru_bk || getActiveGuruBK().nama);
      setNipGuruBk(initialData.nip_guru_bk || getActiveGuruBK().nip);
      setNamaKepalaSekolah(initialData.nama_kepala_sekolah || 'NUR FADILAH, S.Pd,. M.Pd');
      setNipKepalaSekolah(initialData.nip_kepala_sekolah || 'NIP. 19860410 201001 2 030');

      setNomorSuratTugas(initialData.nomor_surat_tugas || '015');
      setPetugas1(initialData.petugas_1 || getActiveGuruBK().nama);
      setPetugas2(initialData.petugas_2 || '');
      setJabatanPetugas1(initialData.jabatan_petugas_1 || 'Guru Bimbingan dan Konseling');
      setJabatanPetugas2(initialData.jabatan_petugas_2 || 'Wali Kelas / Waka Kesiswaan');
      setNisSiswa(initialData.nis_siswa || '');

      setTanggalSuratTugas(initialData.tanggal_surat_tugas || initialData.tanggal_surat || getTodayISO());
      setPetugasPenerimaKunjungan(initialData.petugas_penerima_kunjungan || initialData.petugas_1 || getActiveGuruBK().nama);
      setTanggalPernyataanOrtu(initialData.tanggal_pernyataan_ortu || getTodayISO());

      setSemesterLaporan(initialData.semester_laporan || 'SEMESTER 1 (GANJIL) TAHUN PELAJARAN 2026-2027');
      setBidangLayanan(initialData.bidang_layanan || 'Pribadi / Belajar');
      setTopikPermasalahan(initialData.topik_permasalahan || initialData.perihal_home_visit || '');
      setFungsiLayanan(initialData.fungsi_layanan || 'Pemahaman/Pencegahan/Penyembuhan');
      setPihakTerlibat(initialData.pihak_terlibat || '1. Konselor\n2. Wali Kelas');
      setTujuanKegiatan(
        initialData.tujuan_kegiatan ||
          'a) Membangun hubungan baik dengan orangtua/wali peserta didik/konseli\nb) Melengkapi dan klarifikasi data tentang peserta didik/konseli\nc) Mengkonsultasikan serta membangun kolaborasi untuk pemecahan masalah peserta didik/konseli'
      );
      setGambaranRingkasMasalah(initialData.gambaran_ringkas_masalah || initialData.uraian_permasalahan || '');
      setAlamatKunjungan(initialData.alamat_kunjungan || initialData.alamat || '');
      setHariTanggalLamaKunjungan(
        initialData.hari_tanggal_lama_kunjungan ||
          `${initialData.hari || 'Kamis'}, ${initialData.tanggal || getTodayISO()} (${initialData.waktu || '09:00 WIB'})`
      );
      setAnggotaKeluargaDikunjungi(
        initialData.anggota_keluarga_dikunjungi || `Ayah : ${initialData.nama_orang_tua || ''}`
      );
      setRencanaEvaluasi(
        initialData.rencana_evaluasi ||
          'a) Konfirmasi kebenaran tentang siswa bersama orangtua\nb) Kualitas hubungan dengan keluarga'
      );
      setCatatanKhusus(
        initialData.catatan_khusus ||
          initialData.keterangan ||
          'Konseli selama mengikuti pembelajaran disekolah termasuk siswa yang baik, tekun, tidak pernah membuat pelanggaran tata tertib sekolah dan tidak pernah bolos sekolah.'
      );
    } else {
      handleDateChange(getTodayISO());
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
      setNamaGuruBk(getActiveGuruBK().nama);
      setNipGuruBk(getActiveGuruBK().nip);
      setNamaKepalaSekolah('NUR FADILAH, S.Pd,. M.Pd');
      setNipKepalaSekolah('NIP. 19860410 201001 2 030');

      setNomorSuratTugas('015');
      setPetugas1(getActiveGuruBK().nama);
      setPetugas2('');
      setJabatanPetugas1('Guru Bimbingan dan Konseling');
      setJabatanPetugas2('Wali Kelas / Waka Kesiswaan');
      setNisSiswa('');

      setTanggalSuratTugas(getTodayISO());
      setPetugasPenerimaKunjungan(getActiveGuruBK().nama + ' dkk');
      setTanggalPernyataanOrtu(getTodayISO());

      setSemesterLaporan('SEMESTER 1 (GANJIL) TAHUN PELAJARAN 2026-2027');
      setBidangLayanan('Pribadi / Belajar');
      setTopikPermasalahan('');
      setFungsiLayanan('Pemahaman/Pencegahan/Penyembuhan');
      setPihakTerlibat('1. Konselor\n2. Wali Kelas');
      setTujuanKegiatan(
        'a) Membangun hubungan baik dengan orangtua/wali peserta didik/konseli\nb) Melengkapi dan klarifikasi data tentang peserta didik/konseli\nc) Mengkonsultasikan serta membangun kolaborasi untuk pemecahan masalah peserta didik/konseli'
      );
      setGambaranRingkasMasalah('');
      setAlamatKunjungan('');
      setHariTanggalLamaKunjungan('');
      setAnggotaKeluargaDikunjungi('');
      setRencanaEvaluasi(
        'a) Konfirmasi kebenaran tentang siswa bersama orangtua\nb) Kualitas hubungan dengan keluarga'
      );
      setCatatanKhusus(
        'Konseli selama mengikuti pembelajaran disekolah termasuk siswa yang baik, tekun, tidak pernah membuat pelanggaran tata tertib sekolah dan tidak pernah bolos sekolah.'
      );
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!namaSiswa.trim()) {
      alert('Nama Siswa wajib diisi!');
      return;
    }
    if (!perihalHomeVisit.trim()) {
      alert('Perihal Home Visit / Kunjungan Rumah wajib diisi!');
      return;
    }

    const formData: Partial<HomeVisit> & FormHomeVisitData = {
      id: initialData?.id,
      hari,
      tanggal,
      bulan,
      tahun,
      waktu,
      kelas,
      nama_siswa: namaSiswa.trim(),
      nama_orang_tua: namaOrangTua.trim(),
      pekerjaan_orang_tua: pekerjaanOrangTua.trim(),
      alamat: alamat.trim(),
      perihal_home_visit: perihalHomeVisit.trim(),
      uraian_permasalahan: uraianPermasalahan.trim(),
      tindak_lanjut: tindakLanjut.trim(),
      link_foto_kegiatan: linkFotoKegiatan.trim(),
      keterangan: keterangan.trim(),
      
      tanggal_surat: tanggalSurat,
      tempat_surat: tempatSurat.trim(),
      nama_guru_bk: namaGuruBk.trim(),
      nip_guru_bk: nipGuruBk.trim(),
      nama_kepala_sekolah: namaKepalaSekolah.trim(),
      nip_kepala_sekolah: nipKepalaSekolah.trim(),

      nomor_surat_tugas: nomorSuratTugas.trim(),
      petugas_1: petugas1.trim(),
      petugas_2: petugas2.trim(),
      jabatan_petugas_1: jabatanPetugas1.trim(),
      jabatan_petugas_2: jabatanPetugas2.trim(),
      nis_siswa: nisSiswa.trim(),

      tanggal_surat_tugas: tanggalSuratTugas,
      petugas_penerima_kunjungan: petugasPenerimaKunjungan.trim(),
      tanggal_pernyataan_ortu: tanggalPernyataanOrtu,

      // 14 Field Laporan Kunjungan Rumah
      semester_laporan: semesterLaporan.trim(),
      bidang_layanan: bidangLayanan.trim(),
      topik_permasalahan: topikPermasalahan.trim() || perihalHomeVisit.trim(),
      fungsi_layanan: fungsiLayanan.trim(),
      pihak_terlibat: pihakTerlibat.trim(),
      tujuan_kegiatan: tujuanKegiatan.trim(),
      gambaran_ringkas_masalah: gambaranRingkasMasalah.trim() || uraianPermasalahan.trim(),
      alamat_kunjungan: alamatKunjungan.trim() || alamat.trim(),
      hari_tanggal_lama_kunjungan: hariTanggalLamaKunjungan.trim() || `${hari}, ${tanggal} (${waktu})`,
      anggota_keluarga_dikunjungi: anggotaKeluargaDikunjungi.trim() || `Ayah : ${namaOrangTua.trim()}`,
      rencana_evaluasi: rencanaEvaluasi.trim(),
      catatan_khusus: catatanKhusus.trim() || keterangan.trim(),
    };

    await onSubmit(formData);
  };

  const handleReset = () => {
    if (window.confirm('Bersihkan seluruh isian form home visit?')) {
      handleDateChange(getTodayISO());
      setWaktu('09:00 WIB');
      setKelas('8-A');
      setNamaSiswa('');
      setNamaOrangTua('');
      setPekerjaanOrangTua('');
      setAlamat('');
      setPerihalHomeVisit('Kunjungan Rumah Terkait Presensi & Kehadiran Siswa');
      setUraianPermasalahan('');
      setTindakLanjut('');
      setLinkFotoKegiatan('');
      setKeterangan('');
      setTanggalSurat(getTodayISO());
      setTempatSurat('Pasuruan');

      setNomorSuratTugas('015');
      setPetugas1(getActiveGuruBK().nama);
      setPetugas2('');
      setJabatanPetugas1('Guru Bimbingan dan Konseling');
      setJabatanPetugas2('Wali Kelas / Waka Kesiswaan');
      setNisSiswa('');

      setSemesterLaporan('SEMESTER 1 (GANJIL) TAHUN PELAJARAN 2026-2027');
      setBidangLayanan('Pribadi / Belajar');
      setTopikPermasalahan('');
      setFungsiLayanan('Pemahaman/Pencegahan/Penyembuhan');
      setPihakTerlibat('1. Konselor\n2. Wali Kelas');
      setTujuanKegiatan(
        'a) Membangun hubungan baik dengan orangtua/wali peserta didik/konseli\nb) Melengkapi dan klarifikasi data tentang peserta didik/konseli\nc) Mengkonsultasikan serta membangun kolaborasi untuk pemecahan masalah peserta didik/konseli'
      );
      setGambaranRingkasMasalah('');
      setAlamatKunjungan('');
      setHariTanggalLamaKunjungan('');
      setAnggotaKeluargaDikunjungi('');
      setRencanaEvaluasi(
        'a) Konfirmasi kebenaran tentang siswa bersama orangtua\nb) Kualitas hubungan dengan keluarga'
      );
      setCatatanKhusus(
        'Konseli selama mengikuti pembelajaran disekolah termasuk siswa yang baik, tekun, tidak pernah membuat pelanggaran tata tertib sekolah dan tidak pernah bolos sekolah.'
      );
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
          <div className="p-3 bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white rounded-2xl shadow-md shadow-amber-500/20 font-black">
            <Home className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                FORMULIR C
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                Publik • Tanpa Login • Supabase Ready
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              HOME VISIT / KUNJUNGAN RUMAH
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Laporan Pelaksanaan Home Visit / Kunjungan Rumah Guru BK SMPN 7 Pasuruan
            </p>
          </div>
        </div>

        {initialData && (
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/40 text-amber-300 px-3 py-1.5 rounded-xl text-xs font-bold">
            <Pencil className="w-4 h-4" />
            <span>Mode Edit Data (ID: {initialData.id.slice(0, 8)}...)</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECTION 1: Hari / Tanggal & Jam */}
        <div className="bg-slate-950/80 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between text-amber-400 font-extrabold text-xs uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>1. WAKTU & JAM KUNJUNGAN RUMAH <span className="text-red-400">*</span></span>
            </div>
            <button
              type="button"
              onClick={() => {
                const today = getTodayISO();
                handleDateChange(today);
              }}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors lowercase"
            >
              Hari Ini
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Tanggal Picker */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>TANGGAL (KALENDER) <span className="text-red-400">*</span></span>
              </label>
              <input
                type="date"
                value={tanggal}
                onChange={(e) => handleDateChange(e.target.value)}
                onClick={(e) => {
                  try {
                    e.currentTarget.showPicker();
                  } catch {}
                }}
                required
                className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all [color-scheme:dark] cursor-pointer"
              />
            </div>

            {/* Jam / Waktu */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>JAM PELAKSANAAN <span className="text-red-400">*</span></span>
              </label>
              <input
                type="text"
                value={waktu}
                onChange={(e) => setWaktu(e.target.value)}
                placeholder="Contoh: 09:00 WIB s/d Selesai"
                required
                className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
              />
            </div>
          </div>

          <div className="px-3 py-1.5 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center gap-2 text-xs font-bold text-amber-300">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>{hari}, {new Date(tanggal || getTodayISO()).getDate()} {bulan} {tahun} ({waktu})</span>
          </div>
        </div>

        {/* SECTION 2: Nama Siswa, Nama Ortu, Pekerjaan Ortu, Alamat */}
        <div className="bg-slate-950/80 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase tracking-wider">
            <User className="w-4 h-4" />
            <span>2. IDENTITAS SISWA, ORANG TUA & ALAMAT RUMAH</span>
          </div>

          <SiswaSelector
            siswaItems={siswaItems}
            selectedKelas={kelas}
            onSelectKelas={(k) => setKelas(k)}
            selectedNamaSiswa={namaSiswa}
            onSelectNamaSiswa={(n) => setNamaSiswa(n)}
            onSelectStudentDetails={(s) => {
              if (s.nis) setNisSiswa(s.nis);
            }}
            isMultiSelect={true}
            kelasLabel="Kelas Siswa"
            siswaLabel="Nama Siswa"
            themeColor="amber"
            required={true}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">

            {/* Nama Orang Tua */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>NAMA ORANG TUA / WALI <span className="text-red-400">*</span></span>
              </label>
              <input
                type="text"
                value={namaOrangTua}
                onChange={(e) => setNamaOrangTua(e.target.value)}
                placeholder="Contoh: Bapak Hartono"
                required
                className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-semibold focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Pekerjaan Orang Tua */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                <span>PEKERJAAN ORANG TUA</span>
              </label>
              <input
                type="text"
                value={pekerjaanOrangTua}
                onChange={(e) => setPekerjaanOrangTua(e.target.value)}
                placeholder="Contoh: Pedagang / Swasta / Wiraswasta"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-medium focus:ring-2 focus:ring-amber-500"
              />
            </div>

          </div>

          {/* Alamat Rumah */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>ALAMAT RUMAH SISWA / LOKASI HOME VISIT <span className="text-red-400">*</span></span>
            </label>
            <input
              type="text"
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              placeholder="Contoh: Jl. Bugul Kidul No. 12, RT 02/RW 04, Pasuruan"
              required
              className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-semibold focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* SECTION 3: Perihal Home Visit, Uraian Permasalahan Siswa, Tindak Lanjut */}
        <div className="bg-slate-950/80 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            <span>3. PERIHAL HOME VISIT, PERMASALAHAN & TINDAK LANJUT</span>
          </div>

          {/* Perihal Home Visit */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              PERIHAL HOME VISIT / KUNJUNGAN RUMAH <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={perihalHomeVisit}
              onChange={(e) => setPerihalHomeVisit(e.target.value)}
              placeholder="Maksud dan tujuan kunjungan rumah..."
              required
              className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-bold focus:ring-2 focus:ring-amber-500 mb-2"
            />
            
            {/* Presets */}
            <div className="flex flex-wrap gap-1.5">
              {PERIHAL_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setPerihalHomeVisit(preset)}
                  className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-amber-950 text-slate-300 hover:text-amber-300 border border-slate-800 transition-colors"
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
              placeholder="Jelaskan uraian permasalahan siswa yang melatarbelakangi perlunya kunjungan rumah oleh Guru BK..."
              className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500 font-normal leading-relaxed"
            />
          </div>

          {/* Tindak Lanjut */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>TINDAK LANJUT / HASIL KUNJUNGAN RUMAH</span>
            </label>
            <textarea
              rows={3}
              value={tindakLanjut}
              onChange={(e) => setTindakLanjut(e.target.value)}
              placeholder="Hasil kesepakatan saat kunjungan rumah, peran orang tua, komitmen siswa, dan rencana pendampingan lanjutan..."
              className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500 font-normal leading-relaxed"
            />
          </div>
        </div>

        {/* SECTION 4: Link Foto Kegiatan & Keterangan */}
        <div className="bg-slate-950/80 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase tracking-wider">
            <ImageIcon className="w-4 h-4" />
            <span>4. DOKUMENTASI FOTO KEGIATAN & KETERANGAN</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
          {/* LINK FOTO KEGIATAN */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3 md:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-amber-400">
                <ImageIcon className="w-4 h-4 text-amber-400" />
                LINK FOTO KEGIATAN
              </span>
              <span className="text-[11px] text-slate-400">Bisa Input Link URL atau Upload Foto</span>
            </label>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
              
              {/* Input URL */}
              <div className="md:col-span-2 space-y-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LinkIcon className="w-4 h-4 text-slate-500" />
                  </div>
                  <input
                    type="url"
                    value={linkFotoKegiatan}
                    onChange={(e) => {
                      setLinkFotoKegiatan(e.target.value);
                      setPreviewError(false);
                    }}
                    placeholder="https://... (URL foto Google Drive / Imgur / web)"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white font-mono focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all placeholder:text-slate-500"
                  />
                </div>

                {/* Local File Upload Button */}
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 shadow-sm transition-colors">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>Upload Foto dari Perangkat</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {linkFotoKegiatan.startsWith('data:image')
                      ? '✓ Foto berhasil diunggah'
                      : 'Format JPG, PNG, WEBP'}
                  </span>
                </div>
              </div>

              {/* Photo Preview Thumbnail */}
              <div className="flex flex-col items-center justify-center p-2 bg-slate-950 rounded-lg border border-slate-800 min-h-[90px]">
                {linkFotoKegiatan && !previewError ? (
                  <div className="relative group w-full h-20 overflow-hidden rounded border border-slate-700 flex items-center justify-center bg-slate-900">
                    <img
                      src={linkFotoKegiatan}
                      alt="Preview Kegiatan"
                      onError={() => setPreviewError(true)}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium gap-1">
                      <Eye className="w-3.5 h-3.5" /> Preview
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-2 text-slate-500">
                    <ImageIcon className="w-6 h-6 mx-auto mb-1 opacity-50" />
                    <span className="text-[11px] block">
                      {previewError ? 'Link foto tidak valid' : 'Belum ada foto'}
                    </span>
                  </div>
                )}
              </div>

            </div>
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
                placeholder="Catatan seperti kondisi tempat tinggal, keterlibatan wali kelas, status penyelesaian, dll."
                className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-medium"
              />
            </div>

          </div>
        </div>

        {/* SECTION 5: ADMINISTRASI CETAK SURAT/LAPORAN */}
        <div className="bg-slate-950/80 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase tracking-wider">
            <FileText className="w-4 h-4 text-amber-400" />
            <span>5. PEJABAT PENANDATANGAN LAPORAN HOME VISIT</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Tanggal & Tempat Pembuatan Surat */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>TANGGAL LAPORAN (KALENDER)</span>
              </label>
              <input
                type="date"
                value={tanggalSurat}
                onChange={(e) => setTanggalSurat(e.target.value)}
                onClick={(e) => {
                  try {
                    e.currentTarget.showPicker();
                  } catch {}
                }}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:ring-2 focus:ring-amber-500 [color-scheme:dark] cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>TEMPAT LAPORAN</span>
              </label>
              <input
                type="text"
                value={tempatSurat}
                onChange={(e) => setTempatSurat(e.target.value)}
                placeholder="Pasuruan"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-semibold focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
            {/* Nama & NIP Guru BK / Konselor */}
            <div className="space-y-3 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
              <span className="text-xs font-bold text-amber-300 block">
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
                  placeholder="NIP. 19860410 201001 2 030"
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-slate-300"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 6: ISIAN SURAT TUGAS KUNJUNGAN RUMAH (GARIS BAWAH BISA DIEDIT) */}
        <div className="bg-slate-950/90 p-4 sm:p-5 rounded-2xl border-2 border-amber-500/40 space-y-4 shadow-xl">
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase tracking-wider">
              <FileCheck className="w-4 h-4 text-amber-400" />
              <span>6. FORM SURAT TUGAS KUNJUNGAN RUMAH (ISIAN GARIS BAWAH)</span>
            </div>
            <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded shadow">
              DAPAT DIEDIT
            </span>
          </div>

          <p className="text-xs text-slate-300">
            Bidang yang digarisbawahi pada Surat Tugas Kunjungan Rumah resmi dapat disesuaikan di bawah ini:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Nomor Surat Tugas */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                NOMOR SURAT TUGAS <span className="text-amber-400 font-normal">(400/.../423.102.54/2026)</span>
              </label>
              <input
                type="text"
                value={nomorSuratTugas}
                onChange={(e) => setNomorSuratTugas(e.target.value)}
                placeholder="015"
                className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-amber-500/50 rounded-xl text-amber-300 font-mono font-bold focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* NIS Siswa */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                NIS SISWA <span className="text-amber-400 font-normal">(GARIS BAWAH)</span>
              </label>
              <input
                type="text"
                value={nisSiswa}
                onChange={(e) => setNisSiswa(e.target.value)}
                placeholder="mis. 1234/567"
                className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-amber-500/50 rounded-xl text-amber-300 font-bold focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Nama Petugas 1 */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Sdr. PETUGAS 1 <span className="text-amber-400 font-normal">(GARIS BAWAH)</span>
              </label>
              <input
                type="text"
                value={petugas1}
                onChange={(e) => setPetugas1(e.target.value)}
                placeholder="WIWIK ISMIATI, S.Pd"
                className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-amber-500/50 rounded-xl text-amber-300 font-bold focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Jabatan Petugas 1 */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                JABATAN PETUGAS 1 <span className="text-amber-400 font-normal">(GARIS BAWAH)</span>
              </label>
              <input
                type="text"
                value={jabatanPetugas1}
                onChange={(e) => setJabatanPetugas1(e.target.value)}
                placeholder="Guru Bimbingan dan Konseling"
                className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-amber-500/50 rounded-xl text-amber-300 font-semibold focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Nama Petugas 2 */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Sdr. PETUGAS 2 <span className="text-amber-400 font-normal">(OPTIONAL / GARIS BAWAH)</span>
              </label>
              <input
                type="text"
                value={petugas2}
                onChange={(e) => setPetugas2(e.target.value)}
                placeholder="mis. Wali Kelas IX C"
                className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-amber-500/50 rounded-xl text-amber-300 font-bold focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Jabatan Petugas 2 */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                JABATAN PETUGAS 2 <span className="text-amber-400 font-normal">(GARIS BAWAH)</span>
              </label>
              <input
                type="text"
                value={jabatanPetugas2}
                onChange={(e) => setJabatanPetugas2(e.target.value)}
                placeholder="Wali Kelas / Waka Kesiswaan"
                className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-amber-500/50 rounded-xl text-amber-300 font-semibold focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* SECTION 7: ISIAN SURAT BERSEDIA MENERIMA KUNJUNGAN OLEH ORANG TUA (GARIS BAWAH BISA DIEDIT) */}
        <div className="bg-slate-950/90 p-4 sm:p-5 rounded-2xl border-2 border-emerald-500/40 space-y-4 shadow-xl">
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs uppercase tracking-wider">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>7. FORM SURAT BERSEDIA MENERIMA KUNJUNGAN OLEH ORANG TUA (ISIAN GARIS BAWAH)</span>
            </div>
            <span className="text-[10px] bg-emerald-400 text-slate-950 font-black px-2 py-0.5 rounded shadow">
              GARIS BAWAH BISA DIEDIT
            </span>
          </div>

          <p className="text-xs text-slate-300">
            Seluruh bidang yang digarisbawahi merah pada Surat Pernyataan Kesediaan Menerima Kunjungan Orang Tua dapat disesuaikan di bawah ini:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Nama Orang Tua */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                NAMA ORANG TUA / WALI <span className="text-emerald-400 font-normal">(GARIS BAWAH)</span>
              </label>
              <input
                type="text"
                value={namaOrangTua}
                onChange={(e) => setNamaOrangTua(e.target.value)}
                placeholder="Sutrisno / Wali Siswa"
                className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-emerald-500/50 rounded-xl text-emerald-300 font-bold focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Alamat Orang Tua */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                ALAMAT ORANG TUA <span className="text-emerald-400 font-normal">(GARIS BAWAH)</span>
              </label>
              <input
                type="text"
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                placeholder="Jl. Simpang Slamet Riyadi Pasuruan"
                className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-emerald-500/50 rounded-xl text-emerald-300 font-bold focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Nama Siswa */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                NAMA SISWA <span className="text-emerald-400 font-normal">(GARIS BAWAH)</span>
              </label>
              <input
                type="text"
                value={namaSiswa}
                onChange={(e) => setNamaSiswa(e.target.value)}
                placeholder="Ahmad Rizky"
                className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-emerald-500/50 rounded-xl text-emerald-300 font-bold focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* NIS Siswa */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                NIS SISWA <span className="text-emerald-400 font-normal">(GARIS BAWAH)</span>
              </label>
              <input
                type="text"
                value={nisSiswa}
                onChange={(e) => setNisSiswa(e.target.value)}
                placeholder="1234/567"
                className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-emerald-500/50 rounded-xl text-emerald-300 font-bold focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Petugas Penerima Kunjungan */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                PETUGAS YANG DITERIMA <span className="text-emerald-400 font-normal">(GARIS BAWAH)</span>
              </label>
              <input
                type="text"
                value={petugasPenerimaKunjungan}
                onChange={(e) => setPetugasPenerimaKunjungan(e.target.value)}
                placeholder="WIWIK ISMIATI, S.Pd dkk"
                className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-emerald-500/50 rounded-xl text-emerald-300 font-bold focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Nomor Surat Tugas */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                NO. SURAT TUGAS ACUAN <span className="text-emerald-400 font-normal">(GARIS BAWAH)</span>
              </label>
              <input
                type="text"
                value={nomorSuratTugas}
                onChange={(e) => setNomorSuratTugas(e.target.value)}
                placeholder="015"
                className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-emerald-500/50 rounded-xl text-emerald-300 font-mono font-bold focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Tanggal Surat Tugas */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>TGL SURAT TUGAS <span className="text-emerald-400 font-normal">(KALENDER)</span></span>
              </label>
              <input
                type="date"
                value={tanggalSuratTugas}
                onChange={(e) => setTanggalSuratTugas(e.target.value)}
                onClick={(e) => {
                  try {
                    e.currentTarget.showPicker();
                  } catch {}
                }}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-emerald-500/50 rounded-xl text-emerald-300 font-bold focus:ring-2 focus:ring-emerald-500 [color-scheme:dark] cursor-pointer"
              />
            </div>

            {/* Tanggal Pernyataan Orang Tua */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>TGL PERNYATAAN ORANG TUA <span className="text-emerald-400 font-normal">(KALENDER)</span></span>
              </label>
              <input
                type="date"
                value={tanggalPernyataanOrtu}
                onChange={(e) => setTanggalPernyataanOrtu(e.target.value)}
                onClick={(e) => {
                  try {
                    e.currentTarget.showPicker();
                  } catch {}
                }}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-emerald-500/50 rounded-xl text-emerald-300 font-bold focus:ring-2 focus:ring-emerald-500 [color-scheme:dark] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* SECTION 8: ISIAN 14 POIN LAPORAN KUNJUNGAN RUMAH (SOP RESMI LAMPIRAN) */}
        <div className="bg-slate-950/90 p-4 sm:p-5 rounded-2xl border-2 border-blue-500/40 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-blue-400 font-extrabold text-xs uppercase tracking-wider">
              <FileText className="w-4 h-4 text-blue-400" />
              <span>8. LAPORAN KUNJUNGAN RUMAH (14 POIN RESMI - BISA DIEDIT)</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSyncLaporan14Poin}
                className="text-[11px] bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1 rounded-lg transition-colors flex items-center gap-1 shadow"
              >
                ⚡ Sinkronkan Isian 14 Poin
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-300">
            Formulir di bawah ini memuat 14 Poin Laporan Kunjungan Rumah sesuai format resmi yang dapat diisi dan diedit sepenuhnya untuk dicetak maupun diexport ke Word:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Header Judul Laporan & Semester */}
            <div className="md:col-span-2 bg-slate-900/80 p-3.5 rounded-xl border border-blue-500/30">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                  <span>SUB-JUDUL / SEMESTER & TAHUN PELAJARAN LAPORAN <span className="text-blue-400 font-normal">(PILIHAN POPUP)</span></span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsSemesterPopupOpen(true)}
                  className="text-[11px] bg-blue-600/90 hover:bg-blue-500 text-white font-bold px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 shadow"
                >
                  <Layers className="w-3 h-3" />
                  <span>Pilihan Popup</span>
                </button>
              </div>
              <div className="relative">
                <select
                  value={semesterLaporan}
                  onChange={(e) => setSemesterLaporan(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-blue-500/50 rounded-xl text-blue-200 font-bold focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer pr-10"
                >
                  {SEMESTER_LAPORAN_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} className="bg-slate-900 text-white py-1">
                      {opt}
                    </option>
                  ))}
                  {!SEMESTER_LAPORAN_OPTIONS.includes(semesterLaporan) && semesterLaporan && (
                    <option value={semesterLaporan} className="bg-slate-900 text-amber-300 py-1">
                      {semesterLaporan} (Kustom)
                    </option>
                  )}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-blue-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Poin 1: Nama peserta didik/konseli */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  <span>1. Nama peserta didik/konseli <span className="text-blue-400 font-normal">(PILIHAN POPUP)</span></span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsSiswaPopupOpen(true)}
                  className="text-[11px] bg-blue-600 hover:bg-blue-500 text-white font-bold px-2.5 py-0.5 rounded-lg transition-colors flex items-center gap-1 shadow"
                >
                  <Search className="w-3 h-3" />
                  <span>Pilih Siswa (Popup)</span>
                </button>
              </div>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={namaSiswa}
                  onChange={(e) => setNamaSiswa(e.target.value)}
                  placeholder="Klik 'Pilih Siswa (Popup)' atau ketik nama..."
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-blue-500/40 rounded-xl text-white font-bold focus:ring-2 focus:ring-blue-500 pr-9"
                />
                <button
                  type="button"
                  onClick={() => setIsSiswaPopupOpen(true)}
                  className="absolute right-2 text-slate-400 hover:text-blue-300 p-1"
                  title="Buka Popup Database Siswa"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Poin 2: Kelas/Semester */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <School className="w-3.5 h-3.5 text-blue-400" />
                  <span>2. Kelas / Semester <span className="text-blue-400 font-normal">(PILIHAN POPUP)</span></span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsKelasSemesterPopupOpen(true)}
                  className="text-[11px] bg-blue-600/90 hover:bg-blue-500 text-white font-bold px-2.5 py-0.5 rounded-lg transition-colors flex items-center gap-1 shadow"
                >
                  <Layers className="w-3 h-3" />
                  <span>Pilih Popup</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {/* Dropdown Kelas */}
                <div className="relative">
                  <select
                    value={kelas}
                    onChange={(e) => setKelas(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs bg-slate-900 border border-blue-500/40 rounded-xl text-white font-bold focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer pr-8"
                  >
                    <option value="">-- Pilih Kelas --</option>
                    {KELAS_PRESETS.map((k) => (
                      <option key={k} value={k} className="bg-slate-900 text-white">
                        Kelas {k}
                      </option>
                    ))}
                    {!KELAS_PRESETS.includes(kelas) && kelas && (
                      <option value={kelas} className="bg-slate-900 text-amber-300">
                        {kelas} (Kustom)
                      </option>
                    )}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-slate-400">
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Dropdown Semester */}
                <div className="relative">
                  <select
                    value={semesterLaporan.includes('GANJIL') ? 'Ganjil' : 'Genap'}
                    onChange={(e) => {
                      const sem = e.target.value;
                      if (sem === 'Ganjil') {
                        setSemesterLaporan((prev) =>
                          prev.replace(/GENAP/g, 'GANJIL').replace(/Semester 2/g, 'Semester 1').replace(/SEMESTER 2/g, 'SEMESTER 1')
                        );
                      } else {
                        setSemesterLaporan((prev) =>
                          prev.replace(/GANJIL/g, 'GENAP').replace(/Semester 1/g, 'Semester 2').replace(/SEMESTER 1/g, 'SEMESTER 2')
                        );
                      }
                    }}
                    className="w-full px-3 py-2.5 text-xs bg-slate-900 border border-blue-500/40 rounded-xl text-white font-bold focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer pr-8"
                  >
                    <option value="Ganjil" className="bg-slate-900 text-white">
                      Semester 1 (Ganjil)
                    </option>
                    <option value="Genap" className="bg-slate-900 text-white">
                      Semester 2 (Genap)
                    </option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-slate-400">
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Poin 3: Bidang Layanan */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                3. Bidang Layanan
              </label>
              <div className="relative">
                <select
                  value={bidangLayanan}
                  onChange={(e) => setBidangLayanan(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-semibold focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer pr-8"
                >
                  <option value="Pribadi / Belajar">Pribadi / Belajar</option>
                  <option value="Pribadi">Pribadi</option>
                  <option value="Sosial">Sosial</option>
                  <option value="Belajar">Belajar</option>
                  <option value="Karir">Karir</option>
                  <option value="Pribadi / Sosial">Pribadi / Sosial</option>
                  <option value="Belajar / Karir">Belajar / Karir</option>
                  <option value="Sosial / Belajar">Sosial / Belajar</option>
                  {!['Pribadi / Belajar', 'Pribadi', 'Sosial', 'Belajar', 'Karir', 'Pribadi / Sosial', 'Belajar / Karir', 'Sosial / Belajar'].includes(bidangLayanan) && bidangLayanan && (
                    <option value={bidangLayanan}>{bidangLayanan} (Kustom)</option>
                  )}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-slate-400">
                  <ChevronDown className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Poin 5: Fungsi Layanan */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                5. Fungsi layanan
              </label>
              <div className="relative">
                <select
                  value={fungsiLayanan}
                  onChange={(e) => setFungsiLayanan(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-semibold focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer pr-8"
                >
                  <option value="Pemahaman/Pencegahan/Penyembuhan">Pemahaman/Pencegahan/Penyembuhan</option>
                  <option value="Pemahaman">Pemahaman</option>
                  <option value="Pencegahan">Pencegahan</option>
                  <option value="Pengentasan / Penyembuhan">Pengentasan / Penyembuhan</option>
                  <option value="Pemeliharaan dan Pengembangan">Pemeliharaan dan Pengembangan</option>
                  <option value="Advokasi">Advokasi</option>
                  {!['Pemahaman/Pencegahan/Penyembuhan', 'Pemahaman', 'Pencegahan', 'Pengentasan / Penyembuhan', 'Pemeliharaan dan Pengembangan', 'Advokasi'].includes(fungsiLayanan) && fungsiLayanan && (
                    <option value={fungsiLayanan}>{fungsiLayanan} (Kustom)</option>
                  )}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-slate-400">
                  <ChevronDown className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Poin 4: Topik / Permasalahan */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">
                4. Topik / Permasalahan
              </label>
              <textarea
                rows={2}
                value={topikPermasalahan || perihalHomeVisit}
                onChange={(e) => setTopikPermasalahan(e.target.value)}
                placeholder="Membicarakan permasalahan siswa..."
                className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-medium"
              />
            </div>

            {/* Poin 6: Pihak yang Terlibat */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                6. Pihak yang Terlibat
              </label>
              <textarea
                rows={3}
                value={pihakTerlibat}
                onChange={(e) => setPihakTerlibat(e.target.value)}
                placeholder="1. Konselor&#10;2. Wali Kelas"
                className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-medium"
              />
            </div>

            {/* Poin 7: Tujuan Kegiatan */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                7. Tujuan Kegiatan
              </label>
              <textarea
                rows={3}
                value={tujuanKegiatan}
                onChange={(e) => setTujuanKegiatan(e.target.value)}
                placeholder="a) Membangun hubungan baik..."
                className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-medium"
              />
            </div>

            {/* Poin 8: Gambaran Ringkas Masalah */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">
                8. Gambaran ringkas masalah
              </label>
              <textarea
                rows={3}
                value={gambaranRingkasMasalah || uraianPermasalahan}
                onChange={(e) => setGambaranRingkasMasalah(e.target.value)}
                placeholder="Informasi ringkas mengenai masalah siswa..."
                className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-medium"
              />
            </div>

            {/* Poin 9: Alamat Kunjungan */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                9. Alamat Kunjungan
              </label>
              <input
                type="text"
                value={alamatKunjungan || alamat}
                onChange={(e) => setAlamatKunjungan(e.target.value)}
                placeholder="Sebani Rt. 1"
                className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-semibold"
              />
            </div>

            {/* Poin 10: Hari/Tanggal dan lama kunjungan */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                10. Hari/Tanggal dan lama kunjungan
              </label>
              <input
                type="text"
                value={hariTanggalLamaKunjungan || `${hari}, ${tanggal} (${waktu})`}
                onChange={(e) => setHariTanggalLamaKunjungan(e.target.value)}
                placeholder="Senin, 19 Oktober 2020 (10.00 wib)"
                className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-semibold"
              />
            </div>

            {/* Poin 11: Anggota keluarga yang dikunjungi */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                11. Anggota keluarga yang dikunjungi
              </label>
              <input
                type="text"
                value={anggotaKeluargaDikunjungi || (namaOrangTua ? `Ayah : ${namaOrangTua}` : '')}
                onChange={(e) => setAnggotaKeluargaDikunjungi(e.target.value)}
                placeholder="Ayah : Sukisno        Ibu : Mariyatul Kiptiyah"
                className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-semibold"
              />
            </div>

            {/* Poin 12: Rencana Evaluasi */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                12. Rencana Evaluasi
              </label>
              <textarea
                rows={2}
                value={rencanaEvaluasi}
                onChange={(e) => setRencanaEvaluasi(e.target.value)}
                placeholder="a) Konfirmasi kebenaran...&#10;b) Kualitas hubungan..."
                className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-medium"
              />
            </div>

            {/* Poin 13: Tindaklanjut */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                13. Tindaklanjut
              </label>
              <textarea
                rows={2}
                value={tindakLanjut}
                onChange={(e) => setTindakLanjut(e.target.value)}
                placeholder="Tindak lanjut hasil kunjungan..."
                className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-medium"
              />
            </div>

            {/* Poin 14: Catatan Khusus */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                14. Catatan Khusus
              </label>
              <textarea
                rows={2}
                value={catatanKhusus || keterangan}
                onChange={(e) => setCatatanKhusus(e.target.value)}
                placeholder="Konseli selama mengikuti pembelajaran disekolah..."
                className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-medium"
              />
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
              className="px-6 py-3 bg-gradient-to-r from-amber-500 via-orange-600 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 text-xs font-black rounded-xl shadow-lg shadow-amber-500/30 transition-all flex items-center gap-2 transform active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-slate-950" />
              )}
              <span>
                {initialData ? 'UPDATE DATA HOME VISIT' : 'SIMPAN DATA HOME VISIT'}
              </span>
            </button>
          </div>

        </div>

      </form>

      {/* MODAL POPUP 1: PILIH SEMESTER & TAHUN PELAJARAN LAPORAN */}
      {isSemesterPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-blue-500/50 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2 text-blue-400 font-black text-sm">
                <GraduationCap className="w-5 h-5 text-blue-400" />
                <span>Pilih Semester & Tahun Pelajaran</span>
              </div>
              <button
                type="button"
                onClick={() => setIsSemesterPopupOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-2 overflow-y-auto max-h-[60vh]">
              <p className="text-xs text-slate-400 mb-3">
                Pilih salah satu format semester dan tahun ajaran resmi di bawah ini:
              </p>
              {SEMESTER_LAPORAN_OPTIONS.map((item) => {
                const isSelected = semesterLaporan === item;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setSemesterLaporan(item);
                      setIsSemesterPopupOpen(false);
                    }}
                    className={`w-full p-3 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between border ${
                      isSelected
                        ? 'bg-blue-600/30 border-blue-500 text-blue-200 shadow-md ring-1 ring-blue-500'
                        : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span>{item}</span>
                    {isSelected && <Check className="w-4 h-4 text-blue-400 shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400">Atau pilih kustom melalui input</span>
              <button
                type="button"
                onClick={() => setIsSemesterPopupOpen(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-colors"
              >
                Tutup Popup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL POPUP 2: PILIH PESERTA DIDIK / SISWA */}
      {isSiswaPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-blue-500/50 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2 text-blue-400 font-black text-sm">
                <Users className="w-5 h-5 text-blue-400" />
                <span>Pilih Peserta Didik / Konseli</span>
              </div>
              <button
                type="button"
                onClick={() => setIsSiswaPopupOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search & Filter */}
            <div className="p-4 border-b border-slate-800 bg-slate-950/30 space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={searchSiswaPopup}
                  onChange={(e) => setSearchSiswaPopup(e.target.value)}
                  placeholder="Cari nama siswa atau NIS..."
                  autoFocus
                  className="w-full pl-9 pr-8 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-semibold focus:ring-2 focus:ring-blue-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                {searchSiswaPopup && (
                  <button
                    type="button"
                    onClick={() => setSearchSiswaPopup('')}
                    className="absolute right-3 top-3 text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Class Filter Chips */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => setFilterKelasSiswaPopup('ALL')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                    filterKelasSiswaPopup === 'ALL'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Semua ({siswaItems.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterKelasSiswaPopup('KELAS_7')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                    filterKelasSiswaPopup === 'KELAS_7'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Kelas 7
                </button>
                <button
                  type="button"
                  onClick={() => setFilterKelasSiswaPopup('KELAS_8')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                    filterKelasSiswaPopup === 'KELAS_8'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Kelas 8
                </button>
                <button
                  type="button"
                  onClick={() => setFilterKelasSiswaPopup('KELAS_9')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                    filterKelasSiswaPopup === 'KELAS_9'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Kelas 9
                </button>
                {kelas && (
                  <button
                    type="button"
                    onClick={() => setFilterKelasSiswaPopup(kelas)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors border border-amber-500/40 ${
                      filterKelasSiswaPopup === kelas
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
                    }`}
                  >
                    Hanya Kelas {kelas}
                  </button>
                )}
              </div>
            </div>

            {/* Student List */}
            <div className="p-4 space-y-1.5 overflow-y-auto max-h-[50vh]">
              {filteredSiswaForPopup.length === 0 ? (
                <div className="text-center py-8 text-slate-400 space-y-2">
                  <User className="w-8 h-8 mx-auto text-slate-600" />
                  <p className="text-xs">Tidak ada siswa yang cocok dengan pencarian.</p>
                  <button
                    type="button"
                    onClick={() => {
                      if (searchSiswaPopup.trim()) {
                        setNamaSiswa(searchSiswaPopup.trim());
                        setIsSiswaPopupOpen(false);
                      }
                    }}
                    className="mt-2 text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg font-bold"
                  >
                    Gunakan "{searchSiswaPopup}" Sebagai Nama Siswa
                  </button>
                </div>
              ) : (
                filteredSiswaForPopup.map((siswa) => {
                  const isSelected = (namaSiswa || '').toLowerCase() === (siswa.nama_siswa || '').toLowerCase();
                  return (
                    <button
                      key={siswa.id || `${siswa.nis}-${siswa.nama_siswa}`}
                      type="button"
                      onClick={() => {
                        setNamaSiswa(siswa.nama_siswa);
                        if (siswa.kelas) setKelas(siswa.kelas);
                        if (siswa.nis) setNisSiswa(siswa.nis);
                        setIsSiswaPopupOpen(false);
                      }}
                      className={`w-full p-2.5 rounded-xl text-left text-xs transition-all flex items-center justify-between border ${
                        isSelected
                          ? 'bg-blue-600/30 border-blue-500 text-blue-200 shadow ring-1 ring-blue-500'
                          : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-500/40 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
                          {siswa.nama_siswa ? siswa.nama_siswa.charAt(0).toUpperCase() : 'S'}
                        </div>
                        <div>
                          <div className="font-bold text-white text-xs">{siswa.nama_siswa}</div>
                          <div className="text-[10px] text-slate-400">
                            NIS: <span className="font-mono text-slate-300">{siswa.nis || '-'}</span> • Kelas:{' '}
                            <span className="font-bold text-amber-400">{siswa.kelas || '-'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded font-mono text-slate-300">
                          Pilih
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-blue-400" />}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-3.5 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400">
                Menampilkan <strong className="text-white">{filteredSiswaForPopup.length}</strong> siswa
              </span>
              <button
                type="button"
                onClick={() => setIsSiswaPopupOpen(false)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-colors"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL POPUP 3: PILIH KELAS & SEMESTER */}
      {isKelasSemesterPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-blue-500/50 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2 text-blue-400 font-black text-sm">
                <School className="w-5 h-5 text-blue-400" />
                <span>Pilih Kelas & Semester</span>
              </div>
              <button
                type="button"
                onClick={() => setIsKelasSemesterPopupOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto max-h-[65vh]">
              {/* Semester Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  PILIH SEMESTER:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSemesterLaporan((prev) =>
                        prev.replace(/GENAP/g, 'GANJIL').replace(/Semester 2/g, 'Semester 1').replace(/SEMESTER 2/g, 'SEMESTER 1')
                      );
                    }}
                    className={`p-2.5 rounded-xl text-xs font-bold transition-all border text-center ${
                      semesterLaporan.includes('GANJIL')
                        ? 'bg-blue-600 text-white border-blue-400 shadow'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    Semester 1 (Ganjil)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSemesterLaporan((prev) =>
                        prev.replace(/GANJIL/g, 'GENAP').replace(/Semester 1/g, 'Semester 2').replace(/SEMESTER 1/g, 'SEMESTER 2')
                      );
                    }}
                    className={`p-2.5 rounded-xl text-xs font-bold transition-all border text-center ${
                      semesterLaporan.includes('GENAP')
                        ? 'bg-blue-600 text-white border-blue-400 shadow'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    Semester 2 (Genap)
                  </button>
                </div>
              </div>

              {/* Class Selection Grid */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  PILIH KELAS:
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {KELAS_PRESETS.map((k) => {
                    const isSelected = kelas === k;
                    return (
                      <button
                        key={k}
                        type="button"
                        onClick={() => setKelas(k)}
                        className={`p-2 rounded-xl text-xs font-bold transition-all border text-center ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 border-amber-300 shadow font-black'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        {k}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-center font-bold text-blue-300">
                Pilihan Saat Ini: <span className="text-amber-400">{kelas || '-'}</span> /{' '}
                <span className="text-white">{semesterLaporan.includes('GANJIL') ? 'Ganjil' : 'Genap'}</span>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setIsKelasSemesterPopupOpen(false)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-colors"
              >
                Selesai / Terapkan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
