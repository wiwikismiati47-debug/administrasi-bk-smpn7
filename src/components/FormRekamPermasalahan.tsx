import { getActiveGuruBK, PRESET_GURU_BK } from '../lib/guruBk';
import React, { useState, useEffect } from 'react';
import { RekamPermasalahan, FormRekamPermasalahanData, Siswa } from '../types';
import { SiswaSelector } from './SiswaSelector';
import {
  FileText,
  Calendar,
  Clock,
  User,
  Users,
  Briefcase,
  MapPin,
  Image as ImageIcon,
  Link as LinkIcon,
  Upload,
  Eye,
  CheckCircle2,
  AlertCircle,
  Save,
  RotateCcw,
  Sparkles,
  HelpCircle,
  XCircle,
  ShieldCheck,
  Building,
  GraduationCap
} from 'lucide-react';

interface FormRekamPermasalahanProps {
  initialData?: RekamPermasalahan | null;
  onSave?: (data: FormRekamPermasalahanData & { id?: string }) => Promise<void>;
  onSubmit?: (data: FormRekamPermasalahanData & { id?: string }) => Promise<void>;
  onCancelEdit?: () => void;
  isLoading?: boolean;
  isSubmitting?: boolean;
  siswaItems?: Siswa[];
}

export const FormRekamPermasalahan: React.FC<FormRekamPermasalahanProps> = ({
  initialData,
  onSave,
  onSubmit,
  onCancelEdit,
  isLoading = false,
  isSubmitting = false,
  siswaItems = [],
}) => {
  const activeSubmit = onSubmit || onSave;
  const activeLoading = isLoading || isSubmitting;

  const getTodayISO = () => new Date().toISOString().slice(0, 10);

  const getDayNameFromDate = (dateString: string) => {
    if (!dateString) return 'Senin';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Senin';
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return days[date.getDay()];
  };

  const getBulanFromDate = (dateString: string) => {
    if (!dateString) return 'Agustus';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Agustus';
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return months[date.getMonth()];
  };

  const getTahunFromDate = (dateString: string) => {
    if (!dateString) return '2026';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '2026';
    return date.getFullYear().toString();
  };

  const [formData, setFormData] = useState<FormRekamPermasalahanData>({
    hari: getDayNameFromDate(getTodayISO()),
    tanggal: getTodayISO(),
    bulan: getBulanFromDate(getTodayISO()),
    tahun: getTahunFromDate(getTodayISO()),
    waktu: '08:00 WIB',
    kelas: '8-A',
    nama_siswa: '',
    nama_orang_tua: '',
    pekerjaan_orang_tua: '',
    alamat: 'Kota Pasuruan',
    ringkasan_uraian_permasalahan: '',
    upaya_konselor_walikelas: '',
    hasil_dan_kesimpulan: '',
    link_foto_kegiatan: '',
    keterangan: 'Proses Pendampingan BK',
    nama_guru_bk: getActiveGuruBK().nama,
    nip_guru_bk: getActiveGuruBK().nip,
    nama_kepala_sekolah: 'NUR FADILAH, S.Pd,. M.Pd',
    nip_kepala_sekolah: '19860410 201001 2 030',
  });

  const studentsInClass = (siswaItems || []).filter(
    (s) => (s.kelas || '').toLowerCase().replace(/\s+/g, '') === (formData.kelas || '').toLowerCase().replace(/\s+/g, '')
  );

  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        hari: initialData.hari || getDayNameFromDate(initialData.tanggal || getTodayISO()),
        tanggal: initialData.tanggal || getTodayISO(),
        bulan: initialData.bulan || getBulanFromDate(initialData.tanggal || getTodayISO()),
        tahun: initialData.tahun || getTahunFromDate(initialData.tanggal || getTodayISO()),
        waktu: initialData.waktu || '08:00 WIB',
        kelas: initialData.kelas || '8-A',
        nama_siswa: initialData.nama_siswa || '',
        nama_orang_tua: initialData.nama_orang_tua || '',
        pekerjaan_orang_tua: initialData.pekerjaan_orang_tua || '',
        alamat: initialData.alamat || 'Kota Pasuruan',
        ringkasan_uraian_permasalahan: initialData.ringkasan_uraian_permasalahan || '',
        upaya_konselor_walikelas: initialData.upaya_konselor_walikelas || '',
        hasil_dan_kesimpulan: initialData.hasil_dan_kesimpulan || '',
        link_foto_kegiatan: initialData.link_foto_kegiatan || '',
        keterangan: initialData.keterangan || 'Proses Pendampingan BK',
        nama_guru_bk: initialData.nama_guru_bk || getActiveGuruBK().nama,
        nip_guru_bk: initialData.nip_guru_bk || getActiveGuruBK().nip,
        nama_kepala_sekolah: initialData.nama_kepala_sekolah || 'NUR FADILAH, S.Pd,. M.Pd',
        nip_kepala_sekolah: initialData.nip_kepala_sekolah || '19860410 201001 2 030',
      });
    }
  }, [initialData]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const dayName = getDayNameFromDate(val);
    const monthName = getBulanFromDate(val);
    const yearName = getTahunFromDate(val);

    setFormData((prev) => ({
      ...prev,
      tanggal: val,
      hari: dayName,
      bulan: monthName,
      tahun: yearName,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [previewError, setPreviewError] = useState<boolean>(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran foto terlalu besar. Maksimal 5 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setFormData(prev => ({ ...prev, link_foto_kegiatan: dataUrl }));
        setPreviewError(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    const today = getTodayISO();
    setFormData({
      hari: getDayNameFromDate(today),
      tanggal: today,
      bulan: getBulanFromDate(today),
      tahun: getTahunFromDate(today),
      waktu: '08:00 WIB',
      kelas: '8-A',
      nama_siswa: '',
      nama_orang_tua: '',
      pekerjaan_orang_tua: '',
      alamat: 'Kota Pasuruan',
      ringkasan_uraian_permasalahan: '',
      upaya_konselor_walikelas: '',
      hasil_dan_kesimpulan: '',
      link_foto_kegiatan: '',
      keterangan: 'Proses Pendampingan BK',
    });
    setStatusMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama_siswa.trim()) {
      setStatusMessage({ type: 'error', text: 'Nama siswa wajib diisi!' });
      return;
    }
    if (!formData.ringkasan_uraian_permasalahan.trim()) {
      setStatusMessage({ type: 'error', text: 'Ringkasan uraian permasalahan wajib diisi!' });
      return;
    }

    try {
      await onSave({
        ...formData,
        id: initialData?.id,
      });

      setStatusMessage({
        type: 'success',
        text: initialData
          ? 'Data rekam permasalahan siswa berhasil diperbarui!'
          : 'Data rekam permasalahan siswa berhasil disimpan ke database!',
      });

      if (!initialData) {
        handleReset();
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Gagal menyimpan data ke database. Silakan coba lagi.' });
    }
  };

  return (
    <div className="bg-white text-slate-800 rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xl shadow-slate-200/50 relative overflow-hidden">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 mb-6">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-700 text-white rounded-2xl shadow-md shadow-emerald-500/20 font-black">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                FORMULIR D
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                Publik • Tanpa Login • Supabase Ready
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              REKAM PERMASALAHAN SISWA
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Formulir Rekam Pencatatan & Penanganan Permasalahan Siswa BK SMPN 7 Pasuruan
            </p>
          </div>
        </div>

        {initialData && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-300 text-amber-900 px-3.5 py-1.5 rounded-xl text-xs font-bold">
            <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
            <span>Mode Edit Data</span>
            {onCancelEdit && (
              <button
                type="button"
                onClick={onCancelEdit}
                className="ml-2 hover:bg-amber-200 p-1 rounded-lg transition-colors"
                title="Batal Edit"
              >
                <XCircle className="w-4 h-4 text-amber-700" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Status Alert Banner */}
      {statusMessage && (
        <div
          className={`mb-6 p-4 rounded-2xl flex items-center gap-3 border text-sm font-semibold transition-all ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span className="flex-1">{statusMessage.text}</span>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-xs underline hover:no-underline font-bold"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Form Grid */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECTION 1: WAKTU & IDENTITAS SISWA */}
        <div className="bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-800 uppercase tracking-wider border-b border-slate-200 pb-2">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>1. WAKTU KEGIATAN & IDENTITAS SISWA</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* TANGGAL */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">
                  HARI & TANGGAL <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const today = getTodayISO();
                    setFormData(prev => ({
                      ...prev,
                      tanggal: today,
                      hari: getDayNameFromDate(today),
                      bulan: getBulanFromDate(today),
                      tahun: getTahunFromDate(today)
                    }));
                  }}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-800 transition-colors"
                >
                  Hari Ini
                </button>
              </div>
              <div className="relative">
                <input
                  type="date"
                  name="tanggal"
                  value={formData.tanggal}
                  onChange={handleDateChange}
                  required
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
              </div>
              <div className="mt-2 px-3 py-1.5 bg-emerald-50/60 border border-emerald-100 rounded-xl flex items-center gap-2 text-xs font-bold text-emerald-900">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>{formData.hari}, {new Date(formData.tanggal || getTodayISO()).getDate()} {formData.bulan} {formData.tahun}</span>
              </div>
            </div>

            {/* WAKTU */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                WAKTU / JAM PELAKSANAAN <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  name="waktu"
                  value={formData.waktu}
                  onChange={handleChange}
                  placeholder="Contoh: 08:00 WIB / Jam Ke-2"
                  required
                  className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <SiswaSelector
              siswaItems={siswaItems}
              selectedKelas={formData.kelas}
              onSelectKelas={(k) => setFormData((prev) => ({ ...prev, kelas: k }))}
              selectedNamaSiswa={formData.nama_siswa}
              onSelectNamaSiswa={(n) => setFormData((prev) => ({ ...prev, nama_siswa: n }))}
              isMultiSelect={true}
              kelasLabel="Kelas Siswa"
              siswaLabel="Nama Lengkap Siswa"
              themeColor="emerald"
              required={true}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* NAMA ORANG TUA */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                NAMA ORANG TUA / WALI
              </label>
              <div className="relative">
                <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  name="nama_orang_tua"
                  value={formData.nama_orang_tua}
                  onChange={handleChange}
                  placeholder="Masukkan nama ayah/ibu/wali siswa"
                  className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* PEKERJAAN ORANG TUA */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                PEKERJAAN ORANG TUA
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  name="pekerjaan_orang_tua"
                  value={formData.pekerjaan_orang_tua}
                  onChange={handleChange}
                  placeholder="Contoh: Wiraswasta / Karyawan / PNS"
                  className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* ALAMAT */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                ALAMAT SISWA / ORANG TUA
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleChange}
                  placeholder="Masukkan alamat domisili siswa"
                  className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: URAIAN PERMASALAHAN & PENANGANAN */}
        <div className="bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-800 uppercase tracking-wider border-b border-slate-200 pb-2">
            <Building className="w-4 h-4 text-emerald-600" />
            <span>2. RINGKASAN PERMASALAHAN, UPAYA & HASIL</span>
          </div>

          {/* RINGKASAN URAIAN PERMASALAHAN SISWA */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              RINGKASAN URAIAN PERMASALAHAN SISWA <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="ringkasan_uraian_permasalahan"
              value={formData.ringkasan_uraian_permasalahan}
              onChange={handleChange}
              rows={3}
              required
              placeholder="Jelaskan secara ringkas permasalahan yang dihadapi siswa (misal: penurunan motivasi belajar, presensi, perilaku, dll)..."
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all leading-relaxed"
            />
          </div>

          {/* UPAYA YANG SUDAH DILAKUKAN OLEH KONSELOR, WALI KELAS */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              UPAYA YANG SUDAH DILAKUKAN OLEH KONSELOR, WALI KELAS
            </label>
            <textarea
              name="upaya_konselor_walikelas"
              value={formData.upaya_konselor_walikelas}
              onChange={handleChange}
              rows={3}
              placeholder="Tuliskan upaya/tindakan yang telah dilaksanakan oleh Guru BK / Konselor dan Wali Kelas..."
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all leading-relaxed"
            />
          </div>

          {/* HASIL DAN KESIMPULAN */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              HASIL DAN KESIMPULAN
            </label>
            <textarea
              name="hasil_dan_kesimpulan"
              value={formData.hasil_dan_kesimpulan}
              onChange={handleChange}
              rows={3}
              placeholder="Tuliskan hasil pembahasan, komitmen siswa/orang tua, serta kesimpulan penanganan..."
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all leading-relaxed"
            />
          </div>
        </div>

        {/* SECTION 3: FOTO & KETERANGAN */}
        <div className="bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-800 uppercase tracking-wider border-b border-slate-200 pb-2">
            <ImageIcon className="w-4 h-4 text-emerald-600" />
            <span>3. DOKUMENTASI FOTO & KETERANGAN TAMBAHAN</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* LINK FOTO KEGIATAN */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 space-y-3 md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-emerald-600" />
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
                    name="link_foto_kegiatan"
                    value={formData.link_foto_kegiatan}
                    onChange={(e) => {
                      handleChange(e);
                      setPreviewError(false);
                    }}
                    placeholder="https://... (URL foto Google Drive / Imgur / web)"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                  />
                </div>

                {/* Local File Upload Button */}
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-lg border border-slate-300 shadow-sm transition-colors">
                    <Upload className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Upload Foto dari Perangkat</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[11px] text-slate-500">
                    {formData.link_foto_kegiatan.startsWith('data:image')
                      ? '✓ Foto berhasil diunggah'
                      : 'Format JPG, PNG, WEBP'}
                  </span>
                </div>
              </div>

              {/* Photo Preview Thumbnail */}
              <div className="flex flex-col items-center justify-center p-2 bg-slate-50 rounded-lg border border-slate-200 min-h-[90px]">
                {formData.link_foto_kegiatan && !previewError ? (
                  <div className="relative group w-full h-20 overflow-hidden rounded border border-slate-200 flex items-center justify-center bg-slate-900/5">
                    <img
                      src={formData.link_foto_kegiatan}
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

            {/* KETERANGAN */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                KETERANGAN / STATUS LAINNYA
              </label>
              <div className="relative">
                <HelpCircle className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  name="keterangan"
                  value={formData.keterangan}
                  onChange={handleChange}
                  placeholder="Contoh: Selesai / Terus Dipantau / Rencana Follow-up"
                  className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* DATA PENGESAHAN (GURU BK & KEPALA SEKOLAH) */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-600" />
                <span>Pengesahan Tanda Tangan (Guru BK & Kepala Sekolah)</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Guru BK</label>
                  <select
                    name="nama_guru_bk"
                    value={formData.nama_guru_bk || ''}
                    onChange={(e) => {
                      handleChange(e);
                      const preset = PRESET_GURU_BK.find(g => g.nama === e.target.value);
                      if (preset) {
                        handleChange({ target: { name: 'nip_guru_bk', value: preset.nip } } as any);
                      }
                    }}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
                  >
                    {PRESET_GURU_BK.map(g => (
                      <option key={g.nip} value={g.nama}>{g.nama}</option>
                    ))}
                    {!PRESET_GURU_BK.some(g => g.nama === formData.nama_guru_bk) && (
                      <option value={formData.nama_guru_bk || ''}>{formData.nama_guru_bk}</option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">NIP Guru BK</label>
                  <select
                    name="nip_guru_bk"
                    value={formData.nip_guru_bk || ''}
                    onChange={(e) => {
                      handleChange(e);
                      const preset = PRESET_GURU_BK.find(g => g.nip === e.target.value);
                      if (preset) {
                        handleChange({ target: { name: 'nama_guru_bk', value: preset.nama } } as any);
                      }
                    }}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
                  >
                    {PRESET_GURU_BK.map(g => (
                      <option key={g.nip} value={g.nip}>{g.nip}</option>
                    ))}
                    {!PRESET_GURU_BK.some(g => g.nip === formData.nip_guru_bk) && (
                      <option value={formData.nip_guru_bk || ''}>{formData.nip_guru_bk}</option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Kepala Sekolah</label>
                  <input
                    type="text"
                    name="nama_kepala_sekolah"
                    value={formData.nama_kepala_sekolah || ''}
                    onChange={handleChange}
                    placeholder="NUR FADILAH, S.Pd,. M.Pd"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">NIP Kepala Sekolah</label>
                  <input
                    type="text"
                    name="nip_kepala_sekolah"
                    value={formData.nip_kepala_sekolah || ''}
                    onChange={handleChange}
                    placeholder="19860410 201001 2 030"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SUBMIT BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-200">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Data otomatis tersinkronisasi ke database Supabase & penyimpanan lokal.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleReset}
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{initialData ? 'Update Data Permasalahan' : 'Simpan Permasalahan Siswa'}</span>
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};
