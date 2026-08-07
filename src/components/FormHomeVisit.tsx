import React, { useState, useEffect } from 'react';
import { HomeVisit, FormHomeVisitData } from '../types';
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
  RotateCcw,
  CheckCircle2,
  Pencil
} from 'lucide-react';

interface FormHomeVisitProps {
  initialData?: HomeVisit | null;
  onSubmit: (data: Partial<HomeVisit> & FormHomeVisitData) => Promise<void>;
  onCancelEdit?: () => void;
  isSubmitting?: boolean;
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
  const [keterangan, setKeterangan] = useState('');

  // Administration & Print Settings
  const [tanggalSurat, setTanggalSurat] = useState(getTodayISO());
  const [tempatSurat, setTempatSurat] = useState('Pasuruan');
  const [namaGuruBk, setNamaGuruBk] = useState('WIWIK ISMIATI, S.Pd');
  const [nipGuruBk, setNipGuruBk] = useState('19831116 200904 2 003');
  const [namaKepalaSekolah, setNamaKepalaSekolah] = useState('NUR FADILAH, S.Pd');
  const [nipKepalaSekolah, setNipKepalaSekolah] = useState('19860410 201001 2 030');

  // Surat Tugas Kunjungan Rumah fields (Semua underlined item)
  const [nomorSuratTugas, setNomorSuratTugas] = useState('015');
  const [petugas1, setPetugas1] = useState('WIWIK ISMIATI, S.Pd');
  const [petugas2, setPetugas2] = useState('');
  const [jabatanPetugas1, setJabatanPetugas1] = useState('Guru Bimbingan dan Konseling');
  const [jabatanPetugas2, setJabatanPetugas2] = useState('Wali Kelas / Waka Kesiswaan');
  const [nisSiswa, setNisSiswa] = useState('');

  // Surat Pernyataan Kesediaan Menerima Kunjungan Orang Tua fields
  const [tanggalSuratTugas, setTanggalSuratTugas] = useState(getTodayISO());
  const [petugasPenerimaKunjungan, setPetugasPenerimaKunjungan] = useState('WIWIK ISMIATI, S.Pd dkk');
  const [tanggalPernyataanOrtu, setTanggalPernyataanOrtu] = useState(getTodayISO());

  // 14 Field Laporan Kunjungan Rumah Resmi (Sesuai Lampiran User)
  const [semesterLaporan, setSemesterLaporan] = useState('SEMESTER 2 (GENAP) TAHUN PELAJARAN 2023-2024');
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
      setNamaGuruBk(initialData.nama_guru_bk || 'WIWIK ISMIATI, S.Pd');
      setNipGuruBk(initialData.nip_guru_bk || '19831116 200904 2 003');
      setNamaKepalaSekolah(initialData.nama_kepala_sekolah || 'NUR FADILAH, S.Pd');
      setNipKepalaSekolah(initialData.nip_kepala_sekolah || 'NIP. 19860410 201001 2 030');

      setNomorSuratTugas(initialData.nomor_surat_tugas || '015');
      setPetugas1(initialData.petugas_1 || 'WIWIK ISMIATI, S.Pd');
      setPetugas2(initialData.petugas_2 || '');
      setJabatanPetugas1(initialData.jabatan_petugas_1 || 'Guru Bimbingan dan Konseling');
      setJabatanPetugas2(initialData.jabatan_petugas_2 || 'Wali Kelas / Waka Kesiswaan');
      setNisSiswa(initialData.nis_siswa || '');

      setTanggalSuratTugas(initialData.tanggal_surat_tugas || initialData.tanggal_surat || getTodayISO());
      setPetugasPenerimaKunjungan(initialData.petugas_penerima_kunjungan || initialData.petugas_1 || 'WIWIK ISMIATI, S.Pd dkk');
      setTanggalPernyataanOrtu(initialData.tanggal_pernyataan_ortu || getTodayISO());

      setSemesterLaporan(initialData.semester_laporan || 'SEMESTER 2 (GENAP) TAHUN PELAJARAN 2023-2024');
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
      setNamaGuruBk('WIWIK ISMIATI, S.Pd');
      setNipGuruBk('19831116 200904 2 003');
      setNamaKepalaSekolah('NUR FADILAH, S.Pd');
      setNipKepalaSekolah('NIP. 19860410 201001 2 030');

      setNomorSuratTugas('015');
      setPetugas1('WIWIK ISMIATI, S.Pd');
      setPetugas2('');
      setJabatanPetugas1('Guru Bimbingan dan Konseling');
      setJabatanPetugas2('Wali Kelas / Waka Kesiswaan');
      setNisSiswa('');

      setTanggalSuratTugas(getTodayISO());
      setPetugasPenerimaKunjungan('WIWIK ISMIATI, S.Pd dkk');
      setTanggalPernyataanOrtu(getTodayISO());

      setSemesterLaporan('SEMESTER 2 (GENAP) TAHUN PELAJARAN 2023-2024');
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
      setPetugas1('WIWIK ISMIATI, S.Pd');
      setPetugas2('');
      setJabatanPetugas1('Guru Bimbingan dan Konseling');
      setJabatanPetugas2('Wali Kelas / Waka Kesiswaan');
      setNisSiswa('');

      setSemesterLaporan('SEMESTER 2 (GENAP) TAHUN PELAJARAN 2023-2024');
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
              C. HOME VISIT / KUNJUNGAN RUMAH
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
          <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase tracking-wider">
            <Calendar className="w-4 h-4" />
            <span>1. WAKTU & JAM KUNJUNGAN RUMAH</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
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
                required
                className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all [color-scheme:dark]"
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
                className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-semibold focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Kelas */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                <span>KELAS <span className="text-red-400">*</span></span>
              </label>
              <select
                value={kelas}
                onChange={(e) => setKelas(e.target.value)}
                className="w-full px-3 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-bold"
              >
                {KELAS_PRESETS.map((k) => (
                  <option key={k} value={k}>
                    Kelas {k}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: Nama Siswa, Nama Ortu, Pekerjaan Ortu, Alamat */}
        <div className="bg-slate-950/80 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase tracking-wider">
            <User className="w-4 h-4" />
            <span>2. IDENTITAS SISWA, ORANG TUA & ALAMAT RUMAH</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Nama Siswa */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>NAMA SISWA <span className="text-red-400">*</span></span>
              </label>
              <input
                type="text"
                value={namaSiswa}
                onChange={(e) => setNamaSiswa(e.target.value)}
                placeholder="Contoh: Rian Adiputra"
                required
                className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-bold focus:ring-2 focus:ring-amber-500"
              />
            </div>

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
            
            {/* Link Foto Kegiatan */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                LINK FOTO KEGIATAN (URL)
              </label>
              <input
                type="text"
                value={linkFotoKegiatan}
                onChange={(e) => setLinkFotoKegiatan(e.target.value)}
                placeholder="https://drive.google.com/... atau URL foto dokumentasi"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:ring-2 focus:ring-amber-500"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                * Tempelkan URL foto bukti pelaksanaan Home Visit dari Google Drive / Cloud storage.
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
                className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:ring-2 focus:ring-amber-500 [color-scheme:dark]"
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
                <input
                  type="text"
                  value={namaGuruBk}
                  onChange={(e) => setNamaGuruBk(e.target.value)}
                  placeholder="WIWIK ISMIATI, S.Pd"
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  NIP Guru BK / Konselor
                </label>
                <input
                  type="text"
                  value={nipGuruBk}
                  onChange={(e) => setNipGuruBk(e.target.value)}
                  placeholder="19831116 200904 2 003"
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-slate-300"
                />
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
                  placeholder="NUR FADILAH, S.Pd"
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

          {/* Miniature Live Preview of Surat Tugas Kunjungan Rumah */}
          <div className="mt-4 bg-white text-black p-4 rounded-xl font-serif text-[11px] leading-relaxed border border-slate-300 shadow-inner overflow-x-auto">
            <div className="text-center font-bold text-[10px] uppercase border-b-2 border-black pb-1 mb-2">
              PEMERINTAH KOTA PASURUAN - DINAS PENDIDIKAN DAN KEBUDAYAAN - SMP NEGERI 7 PASURUAN
            </div>
            <div className="flex justify-between items-start my-1">
              <div>
                <div>No : 400/ <span className="font-bold underline text-red-600">{nomorSuratTugas || '......'}</span> /423.102.54/2026</div>
                <div>Hal : Kunjungan Rumah</div>
              </div>
              <div className="text-right">
                Pasuruan, <span className="font-bold underline text-red-600">{tanggalSurat || '..................'}</span>
              </div>
            </div>

            <div className="mt-2">
              <div>Kepada</div>
              <div>Yth. Bapk /Ibu /WaliSiswa <span className="font-bold underline text-red-600">{namaOrangTua || '....................................'}</span></div>
              <div>Di Tempat</div>
            </div>

            <div className="mt-2">DenganHormat.</div>
            <div>Dengan ini kami menugaskan :</div>
            <div className="pl-4">
              <div>Sdr. <span className="font-bold underline text-red-600">{petugas1 || '....................................'}</span></div>
              <div>Sdr <span className="font-bold underline text-red-600">{petugas2 || '....................................'}</span></div>
            </div>

            <div className="mt-1">
              Selaku Konselor (<span className="font-bold underline text-red-600">{jabatanPetugas1 || 'Guru Bimbingan dan Konseling'}</span>) dan <span className="font-bold underline text-red-600">{jabatanPetugas2 || 'Wali Kelas /Waka Kesiswaan'}</span> /Guru Mata Pelajaran disekolah tersebut untuk mengadakan kunjungan kerumah saudara pada :
            </div>

            <div className="pl-4 my-1">
              <div>Hari : <span className="font-bold underline text-red-600">{hari || '................'}</span></div>
              <div>Tanggal : <span className="font-bold underline text-red-600">{tanggal || '................'}</span></div>
              <div>Jam : <span className="font-bold underline text-red-600">{waktu || '................'}</span></div>
            </div>

            <div>Dalam rangka usaha kami di bidang Bimbingan dan Konseling guna membicarakan masalah putra /putri saudara :</div>
            <div className="pl-4 my-1">
              <div>Nama : <span className="font-bold underline text-red-600">{namaSiswa || '................'}</span></div>
              <div>Kelas : <span className="font-bold underline text-red-600">{kelas || '................'}</span></div>
              <div>Nis : <span className="font-bold underline text-red-600">{nisSiswa || '................'}</span></div>
            </div>

            <div className="mt-1">
              Kami mengharap agar saudara bersedia untuk menerima kunjungan para petugas kami tersebut diatas dan mengizinkan kembali surat yang kami lampirkan ini.
            </div>
            <div>Atas kesediaan saudara kami sampaikan terima kasih.</div>

            <div className="text-right mt-3">
              <div>Mengetahui,</div>
              <div>Kepala SMP Negeri 7 Pasuruan</div>
              <div className="h-8" />
              <div className="font-bold underline text-red-600">{namaKepalaSekolah || 'NUR FADILAH, S.Pd'}</div>
              <div>{nipKepalaSekolah || 'NIP. 19860410 201001 2 030'}</div>
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
              <label className="block text-xs font-bold text-slate-300 mb-1">
                TGL SURAT TUGAS <span className="text-emerald-400 font-normal">(GARIS BAWAH)</span>
              </label>
              <input
                type="date"
                value={tanggalSuratTugas}
                onChange={(e) => setTanggalSuratTugas(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-emerald-500/50 rounded-xl text-emerald-300 font-bold focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Tanggal Pernyataan Orang Tua */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                TGL PERNYATAAN ORANG TUA <span className="text-emerald-400 font-normal">(PASUARUAN, ...)</span>
              </label>
              <input
                type="date"
                value={tanggalPernyataanOrtu}
                onChange={(e) => setTanggalPernyataanOrtu(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-emerald-500/50 rounded-xl text-emerald-300 font-bold focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Miniature Live Preview of Surat Pernyataan Kesediaan Menerima Kunjungan Orang Tua */}
          <div className="mt-4 bg-white text-black p-5 rounded-xl font-serif text-[11px] leading-relaxed border border-slate-300 shadow-inner overflow-x-auto">
            <div className="mb-3 leading-normal">
              <div>Kepada</div>
              <div>Kepala Sekolah</div>
              <div>SMP Negeri 7 Pasuruan</div>
              <div>Di Pasuruan</div>
            </div>

            <div className="mt-3 font-semibold">Dengan Hormat</div>
            <div>Kami yang bertanda tangan dibawahini :</div>

            <div className="pl-4 my-1.5 space-y-0.5">
              <div className="grid grid-cols-[80px_10px_1fr]">
                <span>Nama</span><span>:</span><span className="font-bold underline text-red-600">{namaOrangTua || '....................................'}</span>
              </div>
              <div className="grid grid-cols-[80px_10px_1fr]">
                <span>Alamat</span><span>:</span><span className="font-bold underline text-red-600">{alamat || '....................................'}</span>
              </div>
            </div>

            <div className="mt-2">Orangtua /Wali Siswa dari tersebut di bawahini :</div>
            <div className="pl-4 my-1.5 space-y-0.5">
              <div className="grid grid-cols-[80px_10px_1fr]">
                <span>Nama</span><span>:</span><span className="font-bold underline text-red-600">{namaSiswa || '....................................'}</span>
              </div>
              <div className="grid grid-cols-[80px_10px_1fr]">
                <span>Nis</span><span>:</span><span className="font-bold underline text-red-600">{nisSiswa || '....................'}</span>
              </div>
            </div>

            <div className="mt-2">
              Dengan ini menyatakan kesediaan kami untuk menerima kunjungan saudara :<br/>
              ........................................ <span className="font-bold underline text-red-600">{petugasPenerimaKunjungan || 'WIWIK ISMIATI, S.Pd dkk'}</span> ........................................<br/>
              Kerumah kami pada :
            </div>

            <div className="pl-4 my-1.5 space-y-0.5">
              <div className="grid grid-cols-[80px_10px_1fr]">
                <span>Hari</span><span>:</span><span className="font-bold underline text-red-600">{hari || '................'}</span>
              </div>
              <div className="grid grid-cols-[80px_10px_1fr]">
                <span>Tanggal</span><span>:</span><span className="font-bold underline text-red-600">{tanggal || '................'}</span>
              </div>
              <div className="grid grid-cols-[80px_10px_1fr]">
                <span>Jam</span><span>:</span><span className="font-bold underline text-red-600">{waktu || '................'}</span>
              </div>
            </div>

            <div className="mt-2">
              Untuk membicarakan masalah yang di hadapi oleh putra /putri kami tersebut diatas sesuai dengan<br/>
              Surat Tugas nomor <span className="font-bold underline text-red-600">{nomorSuratTugas || '......'}</span> tanggal <span className="font-bold underline text-red-600">{tanggalSuratTugas || '..................'}</span>
            </div>

            <div className="text-right mt-6 pr-4">
              <div>Pasuruan, <span className="font-bold underline text-red-600">{tanggalPernyataanOrtu || '..................'}</span></div>
              <div>HormatKami,</div>
              <div>Orang Tua /Walisiswa</div>
              <div className="h-10" />
              <div>( <span className="font-bold underline text-red-600">{namaOrangTua || '....................................'}</span> )</div>
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
            <div className="md:col-span-2 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
              <label className="block text-xs font-bold text-blue-300 mb-1">
                SUB-JUDUL / SEMESTER & TAHUN PELAJARAN LAPORAN
              </label>
              <input
                type="text"
                value={semesterLaporan}
                onChange={(e) => setSemesterLaporan(e.target.value)}
                placeholder="SEMESTER 2 (GENAP) TAHUN PELAJARAN 2023-2024"
                className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white font-bold focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Poin 1: Nama peserta didik/konseli */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                1. Nama peserta didik/konseli
              </label>
              <input
                type="text"
                value={namaSiswa}
                onChange={(e) => setNamaSiswa(e.target.value)}
                placeholder="Nama Siswa"
                className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-bold"
              />
            </div>

            {/* Poin 2: Kelas/Semester */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                2. Kelas / Semester
              </label>
              <input
                type="text"
                value={kelas ? `${kelas} / ${semesterLaporan.includes('GANJIL') ? 'Ganjil' : 'Genap'}` : ''}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val.includes('/')) {
                    setKelas(val.split('/')[0].trim());
                  }
                }}
                placeholder="mis. VII-G / Genap"
                className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-semibold"
              />
            </div>

            {/* Poin 3: Bidang Layanan */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                3. Bidang Layanan
              </label>
              <input
                type="text"
                value={bidangLayanan}
                onChange={(e) => setBidangLayanan(e.target.value)}
                placeholder="Pribadi / Belajar"
                className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-semibold"
              />
            </div>

            {/* Poin 5: Fungsi Layanan */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                5. Fungsi layanan
              </label>
              <input
                type="text"
                value={fungsiLayanan}
                onChange={(e) => setFungsiLayanan(e.target.value)}
                placeholder="Pemahaman/Pencegahan/Penyembuhan"
                className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-semibold"
              />
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

          {/* Live Mini Preview Table 14 Poin */}
          <div className="mt-4 bg-white text-black p-4 rounded-xl font-serif text-[11px] border border-slate-300 shadow-inner overflow-x-auto">
            <div className="text-center font-bold text-xs uppercase mb-1">
              LAPORAN KUNJUNGAN RUMAH
            </div>
            <div className="text-center font-bold text-[10px] uppercase mb-3 text-slate-700">
              {semesterLaporan}
            </div>

            <table className="w-full border-collapse border border-black text-[10px] leading-snug">
              <tbody>
                <tr className="border-b border-black">
                  <td className="p-1 border-r border-black font-bold text-center w-6">1</td>
                  <td className="p-1 border-r border-black font-bold w-44">Nama peserta didik/konseli</td>
                  <td className="p-1 font-bold uppercase">{namaSiswa || '-'}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-1 border-r border-black font-bold text-center">2</td>
                  <td className="p-1 border-r border-black font-bold">Kelas /Semester</td>
                  <td className="p-1 font-semibold">{kelas} / {semesterLaporan.includes('GANJIL') ? 'Ganjil' : 'Genap'}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-1 border-r border-black font-bold text-center">3</td>
                  <td className="p-1 border-r border-black font-bold">Bidang Layanan</td>
                  <td className="p-1">{bidangLayanan}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-1 border-r border-black font-bold text-center">4</td>
                  <td className="p-1 border-r border-black font-bold">Topik /Permasalahan</td>
                  <td className="p-1 whitespace-pre-line">{topikPermasalahan || perihalHomeVisit || '-'}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-1 border-r border-black font-bold text-center">5</td>
                  <td className="p-1 border-r border-black font-bold">Fungsi layanan</td>
                  <td className="p-1">{fungsiLayanan}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-1 border-r border-black font-bold text-center">6</td>
                  <td className="p-1 border-r border-black font-bold">Pihak yang Terlibat</td>
                  <td className="p-1 whitespace-pre-line">{pihakTerlibat}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-1 border-r border-black font-bold text-center">7</td>
                  <td className="p-1 border-r border-black font-bold">Tujuan Kegiatan</td>
                  <td className="p-1 whitespace-pre-line">{tujuanKegiatan}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-1 border-r border-black font-bold text-center">8</td>
                  <td className="p-1 border-r border-black font-bold">Gambaran ringkas masalah</td>
                  <td className="p-1 whitespace-pre-line">{gambaranRingkasMasalah || uraianPermasalahan || '-'}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-1 border-r border-black font-bold text-center">9</td>
                  <td className="p-1 border-r border-black font-bold">Alamat Kunjungan</td>
                  <td className="p-1">{alamatKunjungan || alamat || '-'}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-1 border-r border-black font-bold text-center">10</td>
                  <td className="p-1 border-r border-black font-bold">Hari/Tanggal dan lama kunjungan</td>
                  <td className="p-1">{hariTanggalLamaKunjungan || `${hari}, ${tanggal} (${waktu})`}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-1 border-r border-black font-bold text-center">11</td>
                  <td className="p-1 border-r border-black font-bold">Anggota keluarga yang dikunjungi</td>
                  <td className="p-1">{anggotaKeluargaDikunjungi || `Ayah : ${namaOrangTua || '-'}`}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-1 border-r border-black font-bold text-center">12</td>
                  <td className="p-1 border-r border-black font-bold">Rencana Evaluasi</td>
                  <td className="p-1 whitespace-pre-line">{rencanaEvaluasi}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-1 border-r border-black font-bold text-center">13</td>
                  <td className="p-1 border-r border-black font-bold">Tindaklanjut</td>
                  <td className="p-1 whitespace-pre-line">{tindakLanjut || '-'}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-1 border-r border-black font-bold text-center">14</td>
                  <td className="p-1 border-r border-black font-bold">Catatan Khusus</td>
                  <td className="p-1 whitespace-pre-line">{catatanKhusus || keterangan || '-'}</td>
                </tr>
              </tbody>
            </table>
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

    </div>
  );
};
