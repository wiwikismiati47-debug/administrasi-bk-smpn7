import React, { useState, useEffect } from 'react';
import { RekamPermasalahan, FormRekamPermasalahanData } from '../types';
import {
  FileText,
  Calendar,
  Clock,
  User,
  Users,
  Briefcase,
  MapPin,
  Image as ImageIcon,
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
  onSave: (data: FormRekamPermasalahanData & { id?: string }) => Promise<void>;
  onCancelEdit?: () => void;
  isLoading?: boolean;
}

export const FormRekamPermasalahan: React.FC<FormRekamPermasalahanProps> = ({
  initialData,
  onSave,
  onCancelEdit,
  isLoading = false,
}) => {
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
  });

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
              D. REKAM PERMASALAHAN SISWA
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* TANGGAL */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                HARI & TANGGAL <span className="text-rose-500">*</span>
              </label>
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
              <p className="text-[11px] text-slate-500 mt-1 font-semibold">
                Hari: <span className="text-emerald-700 font-bold">{formData.hari}</span> ({formData.bulan} {formData.tahun})
              </p>
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

            {/* KELAS */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                KELAS SISWA <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  name="kelas"
                  value={formData.kelas}
                  onChange={handleChange}
                  placeholder="Contoh: 8-A / 7-C / 9-B"
                  required
                  className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* NAMA SISWA */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                NAMA LENGKAP SISWA <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  name="nama_siswa"
                  value={formData.nama_siswa}
                  onChange={handleChange}
                  placeholder="Masukkan nama lengkap siswa"
                  required
                  className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                LINK FOTO KEGIATAN (URL GOOGLE DRIVE / CLOUD)
              </label>
              <div className="relative">
                <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="url"
                  name="link_foto_kegiatan"
                  value={formData.link_foto_kegiatan}
                  onChange={handleChange}
                  placeholder="https://drive.google.com/..."
                  className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Tempel link foto dari Google Drive / Imgur / Cloud
              </p>
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
