import { getActiveGuruBK, PRESET_GURU_BK } from '../lib/guruBk';
import React, { useState, useEffect } from 'react';
import { KonferensiKasus, FormKonferensiKasusData, DaftarHadirRow, Siswa } from '../types';
import { SiswaSelector } from './SiswaSelector';
import { FileText, Save, RefreshCw, Sparkles, User, AlertCircle, Calendar, MapPin, ClipboardList, Plus, Trash2, Check, ShieldCheck, HelpCircle } from 'lucide-react';

interface FormKonferensiKasusProps {
  initialData?: KonferensiKasus | null;
  onSubmit: (data: Partial<KonferensiKasus> & FormKonferensiKasusData) => Promise<void>;
  isSubmitting?: boolean;
  onCancelEdit?: () => void;
  existingItems?: KonferensiKasus[];
  siswaItems?: Siswa[];
}

const DEFAULT_ROWS: DaftarHadirRow[] = [
  { no: 1, nama: 'Wiwik Ismiati, S.Pd', jabatan: 'Konselor Sekolah', kelas: '-', asal_sekolah: 'UPT SMPN 7 Pasuruan', ttd: 'Ada' },
  { no: 2, nama: 'Guru Kelas / Wali Kelas', jabatan: 'Wali Kelas', kelas: '9E', asal_sekolah: 'UPT SMPN 7 Pasuruan', ttd: 'Ada' },
  { no: 3, nama: 'Guru Mata Pelajaran', jabatan: 'Guru Mapel', kelas: '-', asal_sekolah: 'UPT SMPN 7 Pasuruan', ttd: 'Ada' },
  { no: 4, nama: 'Siswa Bersangkutan', jabatan: 'Siswa / Konseli', kelas: '9E', asal_sekolah: 'UPT SMPN 7 Pasuruan', ttd: 'Ada' },
  { no: 5, nama: 'Orang Tua / Wali Siswa', jabatan: 'Orang Tua', kelas: '-', asal_sekolah: '-', ttd: 'Ada' }
];

export const FormKonferensiKasus: React.FC<FormKonferensiKasusProps> = ({
  initialData,
  onSubmit,
  isSubmitting = false,
  onCancelEdit,
  existingItems = [],
  siswaItems = [],
}) => {
  // Tabs: 'notula' | 'rapat' | 'daftar_hadir' | 'ttd'
  const [activeTab, setActiveTab] = useState<'notula' | 'rapat' | 'daftar_hadir' | 'ttd'>('notula');

  // --- State Fields ---
  // 1. Notula & Common Info
  const [namaKonseli, setNamaKonseli] = useState('');
  const [kelasTa, setKelasTa] = useState('');
  const [selectedKelas, setSelectedKelas] = useState('');
  const [selectedTahunAjaran, setSelectedTahunAjaran] = useState('2026/2027');

  const handleSelectKelas = (k: string) => {
    setSelectedKelas(k);
    if (k && selectedTahunAjaran) {
      setKelasTa(`${k} / ${selectedTahunAjaran}`);
    } else if (k) {
      setKelasTa(k);
    }
  };

  const handleSelectTahunAjaran = (ta: string) => {
    setSelectedTahunAjaran(ta);
    if (selectedKelas && ta) {
      setKelasTa(`${selectedKelas} / ${ta}`);
    } else if (ta) {
      setKelasTa(ta);
    }
  };
  const [jenisMasalah, setJenisMasalah] = useState('');
  const [hariTglJam, setHariTglJam] = useState('');
  const [pemanduKonferensi, setPemanduKonferensi] = useState('Konselor Sekolah');
  const [pemanduNama, setPemanduNama] = useState('Wiwik Ismiati, S.Pd');
  const [pemanduJabatan, setPemanduJabatan] = useState('Konselor');
  const [dataInginDiperoleh, setDataInginDiperoleh] = useState('');
  const [uraianKegiatanInti, setUraianKegiatanInti] = useState('');
  const [dataDiperolehSimpulan, setDataDiperolehSimpulan] = useState('');
  const [keterpenuhanKebutuhanData, setKeterpenuhanKebutuhanData] = useState('terpenuhi');
  const [rujukanPelayanan, setRujukanPelayanan] = useState('Guru Mata Pelajaran, Wali Kelas, Konselor Sekolah');

  // 2. Notulen Rapat
  const [rapatNamaSekolah, setRapatNamaSekolah] = useState('UPT SMPN 7 PASURUAN');
  const [rapatAlamat, setRapatAlamat] = useState('Jl. Simpang Slamet Riadi No.2 Sebani Gadingrejo');
  const [rapatTempat, setRapatTempat] = useState('UPT SMPN 7 PASURUAN');
  const [rapatKetua, setRapatKetua] = useState('Konselor');
  const [rapatJumlahHadir, setRapatJumlahHadir] = useState('5 orang');
  const [rapatDimulaiPukul, setRapatDimulaiPukul] = useState('10.30 WIB');
  const [rapatDiakhiriPukul, setRapatDiakhiriPukul] = useState('11.00 WIB');
  const [rapatHasilPertemuan, setRapatHasilPertemuan] = useState('');

  // 3. Daftar Hadir
  const [daftarHadirPesertaSingkat, setDaftarHadirPesertaSingkat] = useState('');
  const [daftarHadirRows, setDaftarHadirRows] = useState<DaftarHadirRow[]>(DEFAULT_ROWS);

  // Meta & Signatures
  const [tanggalSurat, setTanggalSurat] = useState(new Date().toISOString().slice(0, 10));
  const [tempatSurat, setTempatSurat] = useState('Pasuruan');
  const [namaGuruBk, setNamaGuruBk] = useState(getActiveGuruBK().nama);
  const [nipGuruBk, setNipGuruBk] = useState(getActiveGuruBK().nip);
  const [namaKepalaSekolah, setNamaKepalaSekolah] = useState('NUR FADILAH, S.Pd');
  const [nipKepalaSekolah, setNipKepalaSekolah] = useState('19860410 201001 2 030');
  const [keterangan, setKeterangan] = useState('');

  const [autoUpdatedNotice, setAutoUpdatedNotice] = useState(false);

  // Load Initial Data
  useEffect(() => {
    if (initialData) {
      setNamaKonseli(initialData.nama_konseli || '');
      setKelasTa(initialData.kelas_ta || '');
      setJenisMasalah(initialData.jenis_masalah || '');
      setHariTglJam(initialData.hari_tgl_jam || '');
      setPemanduKonferensi(initialData.pemandu_konferensi || 'Konselor Sekolah');
      setPemanduNama(initialData.pemandu_nama || '');
      setPemanduJabatan(initialData.pemandu_jabatan || '');
      setDataInginDiperoleh(initialData.data_ingin_diperoleh || '');
      setUraianKegiatanInti(initialData.uraian_kegiatan_inti || '');
      setDataDiperolehSimpulan(initialData.data_diperoleh_simpulan || '');
      setKeterpenuhanKebutuhanData(initialData.keterpenuhan_kebutuhan_data || 'terpenuhi');
      setRujukanPelayanan(initialData.rujukan_pelayanan || 'Guru Mata Pelajaran, Wali Kelas, Konselor Sekolah');

      setRapatNamaSekolah(initialData.rapat_nama_sekolah || 'UPT SMPN 7 PASURUAN');
      setRapatAlamat(initialData.rapat_alamat || 'Jl. Simpang Slamet Riadi No.2 Sebani Gadingrejo');
      setRapatTempat(initialData.rapat_tempat || 'UPT SMPN 7 PASURUAN');
      setRapatKetua(initialData.rapat_ketua || 'Konselor');
      setRapatJumlahHadir(initialData.rapat_jumlah_hadir || '');
      setRapatDimulaiPukul(initialData.rapat_dimulai_pukul || '');
      setRapatDiakhiriPukul(initialData.rapat_diakhiri_pukul || '');
      setRapatHasilPertemuan(initialData.rapat_hasil_pertemuan || '');

      setDaftarHadirPesertaSingkat(initialData.daftar_hadir_peserta_singkat || '');
      if (initialData.daftar_hadir_rows) {
        try {
          setDaftarHadirRows(JSON.parse(initialData.daftar_hadir_rows));
        } catch {
          setDaftarHadirRows(DEFAULT_ROWS);
        }
      } else {
        setDaftarHadirRows(DEFAULT_ROWS);
      }

      setTanggalSurat(initialData.tanggal_surat || new Date().toISOString().slice(0, 10));
      setTempatSurat(initialData.tempat_surat || 'Pasuruan');
      setNamaGuruBk(initialData.nama_guru_bk || getActiveGuruBK().nama);
      setNipGuruBk(initialData.nip_guru_bk || getActiveGuruBK().nip);
      setNamaKepalaSekolah(initialData.nama_kepala_sekolah || 'NUR FADILAH, S.Pd');
      setNipKepalaSekolah(initialData.nip_kepala_sekolah || '19860410 201001 2 030');
      setKeterangan(initialData.keterangan || '');
    }
  }, [initialData]);

  // Handle Upsert / Match checking if data already exists
  const handleNamaKonseliBlur = () => {
    if (!namaKonseli.trim() || initialData) return;

    const match = existingItems.find(
      (item) => item.nama_konseli.toLowerCase().trim() === namaKonseli.toLowerCase().trim()
    );

    if (match) {
      setKelasTa(match.kelas_ta || kelasTa);
      setJenisMasalah(match.jenis_masalah || jenisMasalah);
      setHariTglJam(match.hari_tgl_jam || hariTglJam);
      setPemanduKonferensi(match.pemandu_konferensi || pemanduKonferensi);
      setPemanduNama(match.pemandu_nama || pemanduNama);
      setPemanduJabatan(match.pemandu_jabatan || pemanduJabatan);
      setDataInginDiperoleh(match.data_ingin_diperoleh || dataInginDiperoleh);
      setUraianKegiatanInti(match.uraian_kegiatan_inti || uraianKegiatanInti);
      setDataDiperolehSimpulan(match.data_diperoleh_simpulan || dataDiperolehSimpulan);
      setKeterpenuhanKebutuhanData(match.keterpenuhan_kebutuhan_data || keterpenuhanKebutuhanData);
      setRujukanPelayanan(match.rujukan_pelayanan || rujukanPelayanan);

      setRapatNamaSekolah(match.rapat_nama_sekolah || rapatNamaSekolah);
      setRapatAlamat(match.rapat_alamat || rapatAlamat);
      setRapatTempat(match.rapat_tempat || rapatTempat);
      setRapatKetua(match.rapat_ketua || rapatKetua);
      setRapatJumlahHadir(match.rapat_jumlah_hadir || rapatJumlahHadir);
      setRapatDimulaiPukul(match.rapat_dimulai_pukul || rapatDimulaiPukul);
      setRapatDiakhiriPukul(match.rapat_diakhiri_pukul || rapatDiakhiriPukul);
      setRapatHasilPertemuan(match.rapat_hasil_pertemuan || rapatHasilPertemuan);

      setDaftarHadirPesertaSingkat(match.daftar_hadir_peserta_singkat || daftarHadirPesertaSingkat);
      if (match.daftar_hadir_rows) {
        try {
          setDaftarHadirRows(JSON.parse(match.daftar_hadir_rows));
        } catch {
          // ignore
        }
      }

      setTanggalSurat(match.tanggal_surat || tanggalSurat);
      setTempatSurat(match.tempat_surat || tempatSurat);
      setNamaGuruBk(match.nama_guru_bk || namaGuruBk);
      setNipGuruBk(match.nip_guru_bk || nipGuruBk);
      setNamaKepalaSekolah(match.nama_kepala_sekolah || namaKepalaSekolah);
      setNipKepalaSekolah(match.nip_kepala_sekolah || nipKepalaSekolah);
      setKeterangan(match.keterangan || keterangan);

      setAutoUpdatedNotice(true);
      setTimeout(() => setAutoUpdatedNotice(false), 6000);
    }
  };

  // Participant inline edit helpers
  const handleAddParticipant = () => {
    const newNo = daftarHadirRows.length + 1;
    const newRow: DaftarHadirRow = {
      no: newNo,
      nama: '',
      jabatan: '',
      kelas: '',
      asal_sekolah: '',
      ttd: 'Ada'
    };
    setDaftarHadirRows([...daftarHadirRows, newRow]);
  };

  const handleRemoveParticipant = (index: number) => {
    const updated = daftarHadirRows.filter((_, idx) => idx !== index).map((row, idx) => ({
      ...row,
      no: idx + 1
    }));
    setDaftarHadirRows(updated);
  };

  const handleRowChange = (index: number, field: keyof DaftarHadirRow, value: string | number) => {
    const updated = [...daftarHadirRows];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    setDaftarHadirRows(updated);

    // Auto update rapat_jumlah_hadir and daftar_hadir_peserta_singkat
    const count = updated.length;
    setRapatJumlahHadir(`${count} orang`);

    const names = updated
      .map((row, idx) => {
        const clsSuffix = row.kelas && row.kelas !== '-' ? ` (${row.kelas})` : '';
        return `${idx + 1}. ${row.nama || '...'}${clsSuffix}`;
      })
      .filter(n => !n.includes('...'))
      .join(', ');
    setDaftarHadirPesertaSingkat(names);
  };

  const resetForm = () => {
    setNamaKonseli('');
    setKelasTa('');
    setJenisMasalah('');
    setHariTglJam('');
    setPemanduKonferensi('Konselor Sekolah');
    setPemanduNama('Wiwik Ismiati, S.Pd');
    setPemanduJabatan('Konselor');
    setDataInginDiperoleh('');
    setUraianKegiatanInti('');
    setDataDiperolehSimpulan('');
    setKeterpenuhanKebutuhanData('terpenuhi');
    setRujukanPelayanan('Guru Mata Pelajaran, Wali Kelas, Konselor Sekolah');

    setRapatNamaSekolah('UPT SMPN 7 PASURUAN');
    setRapatAlamat('Jl. Simpang Slamet Riadi No.2 Sebani Gadingrejo');
    setRapatTempat('UPT SMPN 7 PASURUAN');
    setRapatKetua('Konselor');
    setRapatJumlahHadir('5 orang');
    setRapatDimulaiPukul('10.30 WIB');
    setRapatDiakhiriPukul('11.00 WIB');
    setRapatHasilPertemuan('');

    setDaftarHadirPesertaSingkat('');
    setDaftarHadirRows(DEFAULT_ROWS);

    setTanggalSurat(new Date().toISOString().slice(0, 10));
    setTempatSurat('Pasuruan');
    setNamaGuruBk(getActiveGuruBK().nama);
    setNipGuruBk(getActiveGuruBK().nip);
    setNamaKepalaSekolah('NUR FADILAH, S.Pd');
    setNipKepalaSekolah('19860410 201001 2 030');
    setKeterangan('');
    setActiveTab('notula');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaKonseli.trim()) {
      alert('Nama Siswa / Konseli wajib diisi.');
      return;
    }

    // Auto-match for update
    let matchedId = initialData?.id;
    if (!matchedId) {
      const match = existingItems.find(
        (item) => item.nama_konseli.toLowerCase().trim() === namaKonseli.toLowerCase().trim()
      );
      if (match) {
        matchedId = match.id;
      }
    }

    const payload: Partial<KonferensiKasus> & FormKonferensiKasusData = {
      id: matchedId,
      nama_konseli: namaKonseli.trim(),
      kelas_ta: kelasTa.trim(),
      jenis_masalah: jenisMasalah.trim(),
      hari_tgl_jam: hariTglJam.trim(),
      pemandu_konferensi: pemanduKonferensi.trim(),
      pemandu_nama: pemanduNama.trim(),
      pemandu_jabatan: pemanduJabatan.trim(),
      data_ingin_diperoleh: dataInginDiperoleh.trim(),
      uraian_kegiatan_inti: uraianKegiatanInti.trim(),
      data_diperoleh_simpulan: dataDiperolehSimpulan.trim(),
      keterpenuhan_kebutuhan_data: keterpenuhanKebutuhanData,
      rujukan_pelayanan: rujukanPelayanan.trim(),

      rapat_nama_sekolah: rapatNamaSekolah.trim(),
      rapat_alamat: rapatAlamat.trim(),
      rapat_tempat: rapatTempat.trim(),
      rapat_ketua: rapatKetua.trim(),
      rapat_jumlah_hadir: rapatJumlahHadir.trim(),
      rapat_dimulai_pukul: rapatDimulaiPukul.trim(),
      rapat_diakhiri_pukul: rapatDiakhiriPukul.trim(),
      rapat_hasil_pertemuan: rapatHasilPertemuan.trim(),

      daftar_hadir_peserta_singkat: daftarHadirPesertaSingkat.trim() || 
        daftarHadirRows.map((row, idx) => `${idx + 1}. ${row.nama || '...'}`).join(', '),
      daftar_hadir_rows: JSON.stringify(daftarHadirRows),

      tanggal_surat: tanggalSurat,
      tempat_surat: tempatSurat,
      nama_guru_bk: namaGuruBk.trim(),
      nip_guru_bk: nipGuruBk.trim(),
      nama_kepala_sekolah: namaKepalaSekolah.trim(),
      nip_kepala_sekolah: nipKepalaSekolah.trim(),
      keterangan: keterangan.trim(),
    };

    await onSubmit(payload);
    if (!initialData) {
      resetForm();
    }
  };

  return (
    <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
        <div className="p-2 bg-rose-600 text-white rounded-lg">
          <ClipboardList className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            {initialData ? 'Edit Data Konferensi Kasus' : 'Buat Baru Data Konferensi Kasus'}
          </h2>
          <p className="text-xs text-slate-500">
            Satu Form mencakup Notula, Notulen Rapat, dan Daftar Hadir Konferensi Kasus.
          </p>
        </div>
      </div>

      {autoUpdatedNotice && (
        <div className="mb-5 p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-amber-800 animate-fade-in shadow-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
          <div>
            <p className="font-bold text-xs uppercase tracking-wide">Data Terdeteksi!</p>
            <p className="text-xs mt-0.5">
              Siswa bernama <strong className="font-semibold underline">{namaKonseli}</strong> sudah terdata dalam basis data. Kolom form otomatis disinkronkan dengan data terbaru. Simpan untuk meng-update record yang sudah ada (upsert).
            </p>
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-1 mb-6 bg-slate-100 p-1.5 rounded-xl border border-slate-200/80">
        <button
          type="button"
          onClick={() => setActiveTab('notula')}
          className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'notula'
              ? 'bg-white text-rose-700 shadow-md shadow-slate-200/50 border border-rose-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          1. Notula Konferensi
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('rapat')}
          className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'rapat'
              ? 'bg-white text-rose-700 shadow-md shadow-slate-200/50 border border-rose-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Calendar className="w-4 h-4" />
          2. Notulen Rapat
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('daftar_hadir')}
          className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'daftar_hadir'
              ? 'bg-white text-rose-700 shadow-md shadow-slate-200/50 border border-rose-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          3. Daftar Hadir
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('ttd')}
          className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'ttd'
              ? 'bg-white text-rose-700 shadow-md shadow-slate-200/50 border border-rose-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Tanda Tangan & Meta
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* --- SECTION 1: NOTULA --- */}
        {activeTab === 'notula' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-700 border-b pb-2 mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-rose-600" />
                Informasi Siswa (Konseli) & Kasus
              </h3>
              
              <SiswaSelector
                siswaItems={siswaItems}
                selectedKelas={selectedKelas}
                onSelectKelas={handleSelectKelas}
                selectedTahunAjaran={selectedTahunAjaran}
                onSelectTahunAjaran={handleSelectTahunAjaran}
                showTahunAjaran={true}
                selectedNamaSiswa={namaKonseli}
                onSelectNamaSiswa={(val) => setNamaKonseli(val)}
                isMultiSelect={true}
                kelasLabel="Kelas Siswa"
                taLabel="Tahun Ajaran"
                siswaLabel="Nama Siswa (Konseli)"
                themeColor="rose"
                required={true}
              />

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Jenis Masalah / Deskripsi Singkat Kasus
                  </label>
                  <input
                    type="text"
                    value={jenisMasalah}
                    onChange={(e) => setJenisMasalah(e.target.value)}
                    placeholder="e.g. Berkelahi karena salah paham"
                    className="w-full text-xs rounded-xl border-slate-200 focus:border-rose-500 focus:ring-rose-500 px-3.5 py-2 border outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Hari, Tanggal & Waktu Pelaksanaan
                  </label>
                  <input
                    type="text"
                    value={hariTglJam}
                    onChange={(e) => setHariTglJam(e.target.value)}
                    placeholder="e.g. Kamis, 8 September 2016 Jam 10.30 WIB"
                    className="w-full text-xs rounded-xl border-slate-200 focus:border-rose-500 focus:ring-rose-500 px-3.5 py-2 border outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Pemandu Konferensi
                  </label>
                  <input
                    type="text"
                    value={pemanduKonferensi}
                    onChange={(e) => setPemanduKonferensi(e.target.value)}
                    placeholder="e.g. Konselor Sekolah"
                    className="w-full text-xs rounded-xl border-slate-200 focus:border-rose-500 focus:ring-rose-500 px-3.5 py-2 border outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Nama Pemandu
                  </label>
                  <input
                    type="text"
                    value={pemanduNama}
                    onChange={(e) => setPemanduNama(e.target.value)}
                    placeholder="e.g. Wiwik Ismiati, S.Pd"
                    className="w-full text-xs rounded-xl border-slate-200 focus:border-rose-500 focus:ring-rose-500 px-3.5 py-2 border outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Jabatan Pemandu
                  </label>
                  <input
                    type="text"
                    value={pemanduJabatan}
                    onChange={(e) => setPemanduJabatan(e.target.value)}
                    placeholder="e.g. Konselor"
                    className="w-full text-xs rounded-xl border-slate-200 focus:border-rose-500 focus:ring-rose-500 px-3.5 py-2 border outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-700 border-b pb-2 mb-3">
                Proses & Hasil Notula
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Data yang Ingin Diperoleh (Tujuan Konferensi)
                </label>
                <textarea
                  rows={2}
                  value={dataInginDiperoleh}
                  onChange={(e) => setDataInginDiperoleh(e.target.value)}
                  placeholder="e.g. Identifikasi permasalahan siswa dan mencari solusi terbaik..."
                  className="w-full text-xs rounded-xl border-slate-200 focus:border-rose-500 focus:ring-rose-500 px-3.5 py-2 border outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Uraian Singkat Kegiatan Inti
                </label>
                <textarea
                  rows={4}
                  value={uraianKegiatanInti}
                  onChange={(e) => setUraianKegiatanInti(e.target.value)}
                  placeholder="e.g. Untuk mengetahui kronologi sebenarnya dari perselisihan siswa..."
                  className="w-full text-xs rounded-xl border-slate-200 focus:border-rose-500 focus:ring-rose-500 px-3.5 py-2 border outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Kesimpulan / Data yang Diperoleh
                </label>
                <textarea
                  rows={4}
                  value={dataDiperolehSimpulan}
                  onChange={(e) => setDataDiperolehSimpulan(e.target.value)}
                  placeholder="e.g. Siswa bersedia saling memaafkan dan menyelesaikan masalah secara kekeluargaan..."
                  className="w-full text-xs rounded-xl border-slate-200 focus:border-rose-500 focus:ring-rose-500 px-3.5 py-2 border outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Keterpenuhan Kebutuhan Data
                  </label>
                  <select
                    value={keterpenuhanKebutuhanData}
                    onChange={(e) => setKeterpenuhanKebutuhanData(e.target.value)}
                    className="w-full text-xs rounded-xl border-slate-200 focus:border-rose-500 focus:ring-rose-500 px-3 py-2 border outline-none bg-white"
                  >
                    <option value="terpenuhi">Terpenuhi</option>
                    <option value="belum_terpenuhi">Belum Terpenuhi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Rujukan Pelayanan Lanjutan
                  </label>
                  <input
                    type="text"
                    value={rujukanPelayanan}
                    onChange={(e) => setRujukanPelayanan(e.target.value)}
                    placeholder="e.g. Wali Kelas, Guru Mata Pelajaran, Konselor"
                    className="w-full text-xs rounded-xl border-slate-200 focus:border-rose-500 focus:ring-rose-500 px-3.5 py-2 border outline-none"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Dipisahkan dengan koma jika lebih dari satu.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('rapat')}
                className="bg-rose-600 text-white font-semibold text-xs px-5 py-2.5 rounded-xl hover:bg-rose-700 shadow transition-all"
              >
                Lanjut ke Notulen Rapat &gt;
              </button>
            </div>
          </div>
        )}

        {/* --- SECTION 2: NOTULEN RAPAT --- */}
        {activeTab === 'rapat' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-700 border-b pb-2 mb-3">
                Kop & Lokasi Pertemuan Rapat
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Nama Sekolah
                  </label>
                  <input
                    type="text"
                    value={rapatNamaSekolah}
                    onChange={(e) => setRapatNamaSekolah(e.target.value)}
                    placeholder="e.g. UPT SMPN 7 PASURUAN"
                    className="w-full text-xs rounded-xl border-slate-200 focus:border-rose-500 focus:ring-rose-500 px-3.5 py-2 border outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Alamat Sekolah
                  </label>
                  <input
                    type="text"
                    value={rapatAlamat}
                    onChange={(e) => setRapatAlamat(e.target.value)}
                    placeholder="e.g. Jl. Simpang Slamet Riadi No.2 Sebani Gadingrejo"
                    className="w-full text-xs rounded-xl border-slate-200 focus:border-rose-500 focus:ring-rose-500 px-3.5 py-2 border outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Tempat Rapat
                  </label>
                  <input
                    type="text"
                    value={rapatTempat}
                    onChange={(e) => setRapatTempat(e.target.value)}
                    placeholder="e.g. Ruang BK SMPN 7 Pasuruan"
                    className="w-full text-xs rounded-xl border-slate-200 focus:border-rose-500 focus:ring-rose-500 px-3.5 py-2 border outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Ketua Sidang / Rapat
                  </label>
                  <input
                    type="text"
                    value={rapatKetua}
                    onChange={(e) => setRapatKetua(e.target.value)}
                    placeholder="e.g. Konselor Sekolah"
                    className="w-full text-xs rounded-xl border-slate-200 focus:border-rose-500 focus:ring-rose-500 px-3.5 py-2 border outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Jumlah Hadir
                  </label>
                  <input
                    type="text"
                    value={rapatJumlahHadir}
                    onChange={(e) => setRapatJumlahHadir(e.target.value)}
                    placeholder="e.g. 5 orang"
                    className="w-full text-xs rounded-xl border-slate-200 focus:border-rose-500 focus:ring-rose-500 px-3.5 py-2 border outline-none bg-slate-50"
                    readOnly
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Otomatis dihitung dari jumlah Daftar Hadir.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Dimulai Pukul
                  </label>
                  <input
                    type="text"
                    value={rapatDimulaiPukul}
                    onChange={(e) => setRapatDimulaiPukul(e.target.value)}
                    placeholder="e.g. 10.30 WIB"
                    className="w-full text-xs rounded-xl border-slate-200 focus:border-rose-500 focus:ring-rose-500 px-3.5 py-2 border outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Diakhiri Pukul
                  </label>
                  <input
                    type="text"
                    value={rapatDiakhiriPukul}
                    onChange={(e) => setRapatDiakhiriPukul(e.target.value)}
                    placeholder="e.g. 11.00 WIB"
                    className="w-full text-xs rounded-xl border-slate-200 focus:border-rose-500 focus:ring-rose-500 px-3.5 py-2 border outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-700 border-b pb-2 mb-3">
                Hasil Keputusan / Jalannya Rapat
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Uraian Hasil Pertemuan Rapat
                </label>
                <textarea
                  rows={8}
                  value={rapatHasilPertemuan}
                  onChange={(e) => setRapatHasilPertemuan(e.target.value)}
                  placeholder="A. Dari identifikasi permasalahan siswa, didapatkan permasalahan tersebut timbul karena...&#10;B. Setelah dilakukan konseling dan konferensi kasus, dicapai kesepakatan...&#10;C. Hasil penyelesaian..."
                  className="w-full text-xs font-mono rounded-xl border-slate-200 focus:border-rose-500 focus:ring-rose-500 px-3.5 py-2 border outline-none"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Gunakan baris baru (Enter) untuk membedakan butir-butir keputusan agar tercetak rapi.
                </p>
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('notula')}
                className="bg-slate-200 text-slate-700 font-semibold text-xs px-5 py-2.5 rounded-xl hover:bg-slate-300 transition-all"
              >
                &lt; Kembali ke Notula
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('daftar_hadir')}
                className="bg-rose-600 text-white font-semibold text-xs px-5 py-2.5 rounded-xl hover:bg-rose-700 shadow transition-all"
              >
                Lanjut ke Daftar Hadir &gt;
              </button>
            </div>
          </div>
        )}

        {/* --- SECTION 3: DAFTAR HADIR --- */}
        {activeTab === 'daftar_hadir' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 overflow-hidden">
              <div className="flex items-center justify-between border-b pb-3 mb-2">
                <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-rose-600" />
                  Daftar Hadir Peserta Konferensi Kasus
                </h3>
                <button
                  type="button"
                  onClick={handleAddParticipant}
                  className="flex items-center gap-1 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Tambah Peserta
                </button>
              </div>

              <div className="overflow-x-auto -mx-4 sm:-mx-5">
                <table className="w-full min-w-[600px] border-collapse text-xs text-left">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <th className="p-3 w-12 text-center">No</th>
                      <th className="p-3">Nama Lengkap</th>
                      <th className="p-3">Jabatan / Peran</th>
                      <th className="p-3 w-20">Kelas</th>
                      <th className="p-3">Instansi / Asal Sekolah</th>
                      <th className="p-3 w-28 text-center">Tanda Tangan</th>
                      <th className="p-3 w-12 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {daftarHadirRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-3 text-center text-slate-500 font-semibold">{row.no}</td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={row.nama}
                            onChange={(e) => handleRowChange(idx, 'nama', e.target.value)}
                            placeholder="e.g. Wiwik Ismiati, S.Pd"
                            className="w-full text-xs rounded-lg border-slate-200 focus:border-rose-500 focus:ring-rose-500 px-2 py-1.5 border outline-none"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={row.jabatan}
                            onChange={(e) => handleRowChange(idx, 'jabatan', e.target.value)}
                            placeholder="e.g. Konselor / Wali Kelas"
                            className="w-full text-xs rounded-lg border-slate-200 focus:border-rose-500 focus:ring-rose-500 px-2 py-1.5 border outline-none"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={row.kelas}
                            onChange={(e) => handleRowChange(idx, 'kelas', e.target.value)}
                            placeholder="e.g. 9E"
                            className="w-full text-xs rounded-lg border-slate-200 focus:border-rose-500 focus:ring-rose-500 px-2 py-1.5 border outline-none text-center"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={row.asal_sekolah}
                            onChange={(e) => handleRowChange(idx, 'asal_sekolah', e.target.value)}
                            placeholder="e.g. UPT SMPN 7 Pas"
                            className="w-full text-xs rounded-lg border-slate-200 focus:border-rose-500 focus:ring-rose-500 px-2 py-1.5 border outline-none"
                          />
                        </td>
                        <td className="p-2">
                          <select
                            value={row.ttd}
                            onChange={(e) => handleRowChange(idx, 'ttd', e.target.value)}
                            className="w-full text-xs rounded-lg border-slate-200 focus:border-rose-500 focus:ring-rose-500 px-2 py-1.5 border outline-none bg-white"
                          >
                            <option value="Ada">Ada (Hadir)</option>
                            <option value="-">- (Absen)</option>
                          </select>
                        </td>
                        <td className="p-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveParticipant(idx)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus baris"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {daftarHadirRows.length === 0 && (
                <div className="text-center py-6 text-slate-400 text-xs">
                  Belum ada peserta. Klik tombol "+ Tambah Peserta" di kanan atas.
                </div>
              )}

              <div className="border-t pt-4">
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Ringkasan Hadirin (Untuk display cepat di agenda/notula)
                </label>
                <input
                  type="text"
                  value={daftarHadirPesertaSingkat}
                  onChange={(e) => setDaftarHadirPesertaSingkat(e.target.value)}
                  placeholder="e.g. 1. Ibu Wiwik, 2. Ibu Citra, 3. Syahnaz (9E)..."
                  className="w-full text-xs rounded-xl border-slate-200 focus:border-rose-500 focus:ring-rose-500 px-3.5 py-2 border outline-none"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Secara default, kolom ini diperbarui otomatis ketika Anda mengedit tabel peserta di atas. Anda juga dapat mengetik bebas di sini.
                </p>
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('rapat')}
                className="bg-slate-200 text-slate-700 font-semibold text-xs px-5 py-2.5 rounded-xl hover:bg-slate-300 transition-all"
              >
                &lt; Kembali ke Rapat
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ttd')}
                className="bg-rose-600 text-white font-semibold text-xs px-5 py-2.5 rounded-xl hover:bg-rose-700 shadow transition-all"
              >
                Lanjut ke Penandatangan &gt;
              </button>
            </div>
          </div>
        )}

        {/* --- SECTION 4: SIGNATURES & META --- */}
        {activeTab === 'ttd' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-700 border-b pb-2 mb-3">
                Waktu & Tempat Penandatanganan
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Tempat Pembuatan Surat / Notula
                  </label>
                  <input
                    type="text"
                    value={tempatSurat}
                    onChange={(e) => setTempatSurat(e.target.value)}
                    placeholder="e.g. Pasuruan"
                    className="w-full text-xs rounded-xl border-slate-200 focus:border-rose-500 focus:ring-rose-500 px-3.5 py-2 border outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Tanggal Surat / Notula
                  </label>
                  <input
                    type="date"
                    value={tanggalSurat}
                    onChange={(e) => setTanggalSurat(e.target.value)}
                    className="w-full text-xs rounded-xl border-slate-200 focus:border-rose-500 focus:ring-rose-500 px-3.5 py-2 border outline-none bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-700 border-b pb-2 mb-3">
                Identitas Pejabat Penandatangan
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Nama Guru BK / Konselor
                  </label>
                  <select
                    value={namaGuruBk}
                    onChange={(e) => {
                      setNamaGuruBk(e.target.value);
                      const preset = PRESET_GURU_BK.find(g => g.nama === e.target.value);
                      if (preset) setNipGuruBk(preset.nip);
                    }}
                    className="w-full text-xs rounded-xl border-slate-200 focus:border-rose-500 focus:ring-rose-500 px-3.5 py-2 border outline-none cursor-pointer"
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
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    NIP Guru BK / Konselor
                  </label>
                  <select
                    value={nipGuruBk}
                    onChange={(e) => {
                      setNipGuruBk(e.target.value);
                      const preset = PRESET_GURU_BK.find(g => g.nip === e.target.value);
                      if (preset) setNamaGuruBk(preset.nama);
                    }}
                    className="w-full text-xs rounded-xl border-slate-200 focus:border-rose-500 focus:ring-rose-500 px-3.5 py-2 border outline-none cursor-pointer"
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Nama Kepala Sekolah
                  </label>
                  <input
                    type="text"
                    value={namaKepalaSekolah}
                    onChange={(e) => setNamaKepalaSekolah(e.target.value)}
                    placeholder="e.g. NUR FADILAH, S.Pd"
                    className="w-full text-xs rounded-xl border-slate-200 focus:border-rose-500 focus:ring-rose-500 px-3.5 py-2 border outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    NIP Kepala Sekolah
                  </label>
                  <input
                    type="text"
                    value={nipKepalaSekolah}
                    onChange={(e) => setNipKepalaSekolah(e.target.value)}
                    placeholder="e.g. 19860410 201001 2 030"
                    className="w-full text-xs rounded-xl border-slate-200 focus:border-rose-500 focus:ring-rose-500 px-3.5 py-2 border outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Keterangan / Catatan Tambahan (Opsional)
                </label>
                <input
                  type="text"
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  placeholder="e.g. Konferensi kasus diselesaikan dengan lancar."
                  className="w-full text-xs rounded-xl border-slate-200 focus:border-rose-500 focus:ring-rose-500 px-3.5 py-2 border outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('daftar_hadir')}
                className="w-full sm:w-auto bg-slate-200 text-slate-700 font-semibold text-xs px-5 py-2.5 rounded-xl hover:bg-slate-300 transition-all"
              >
                &lt; Kembali ke Daftar Hadir
              </button>
              
              <div className="flex w-full sm:w-auto gap-2">
                {onCancelEdit && (
                  <button
                    type="button"
                    onClick={onCancelEdit}
                    className="flex-1 sm:flex-initial bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-2.5 rounded-xl border transition-all"
                  >
                    Batal Edit
                  </button>
                )}
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-lg hover:shadow-rose-500/20 disabled:opacity-50 transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Simpan Data (Upsert)
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      </form>
    </div>
  );
};
