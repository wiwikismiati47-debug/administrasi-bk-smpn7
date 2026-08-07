import React, { useState, useEffect } from 'react';
import { KonselingIndividu, FormKonselingIndividuData, Siswa } from '../types';
import { SiswaSelector } from './SiswaSelector';
import {
  FileText,
  Calendar,
  Clock,
  User,
  GraduationCap,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Save,
  RotateCcw,
  Sparkles,
  HelpCircle,
  XCircle,
  ShieldCheck,
  Target,
  Wrench,
  BookOpen,
  CheckSquare
} from 'lucide-react';

interface FormKonselingIndividuProps {
  initialData?: KonselingIndividu | null;
  onSubmit: (data: Partial<KonselingIndividu> & FormKonselingIndividuData) => Promise<void>;
  onCancelEdit?: () => void;
  isSubmitting?: boolean;
  siswaItems?: Siswa[];
}

const PENDEKATAN_PRESETS = [
  {
    id: 'cbt',
    nama: 'CBT (Kognitif Perilaku)',
    fokus: 'Mengubah pola pikir negatif atau irasional menjadi rasional dan positif.',
    teknik: 'Restrukturisasi Kognitif',
    kasus: 'Depresi, kecemasan berlebih, stres akademik.',
  },
  {
    id: 'behavioral',
    nama: 'Behavioral (Behavioristik)',
    fokus: 'Mengubah perilaku maladaptif melalui proses belajar dan pembiasaan.',
    teknik: 'Desensitisasi Sistematis, Token Economy (Penghargaan), Pelatihan Asertif',
    kasus: 'Fobia, kecemasan spesifik, kebiasaan buruk, kedisiplinan.',
  },
  {
    id: 'person-centered',
    nama: 'Person-Centered',
    fokus: 'Membantu konseli menemukan potensi dirinya melalui ruang yang aman dan empati.',
    teknik: 'Empati Akurat, Refleksi Perasaan, Penerimaan Tanpa Syarat',
    kasus: 'Masalah konsep diri, pencarian jati diri, eksplorasi emosi.',
  },
  {
    id: 'reality',
    nama: 'Reality Therapy',
    fokus: 'Mendorong konseli agar bertanggung jawab atas pilihan tindakannya saat ini.',
    teknik: 'Metode WDEP (Wants, Direction, Evaluation, Plan), Kontrak Perilaku',
    kasus: 'Pelanggaran aturan, kenakalan remaja, kurang motivasi/tanggung jawab.',
  },
  {
    id: 'sfbt',
    nama: 'SFBT (Solusi Terfokus)',
    fokus: 'Berfokus langsung pada pencarian solusi dan masa depan, tanpa membahas masa lalu.',
    teknik: 'Miracle Question (Pertanyaan Ajaib), Scaling Questions (Pertanyaan Skala), Pertanyaan Pengecualian',
    kasus: 'Hambatan spesifik yang membutuhkan penanganan cepat dan praktis.',
  }
];

export const FormKonselingIndividu: React.FC<FormKonselingIndividuProps> = ({
  initialData,
  onSubmit,
  onCancelEdit,
  isSubmitting = false,
  siswaItems = [],
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

  const [formData, setFormData] = useState<FormKonselingIndividuData>({
    hari: getDayNameFromDate(getTodayISO()),
    tanggal: getTodayISO(),
    bulan: getBulanFromDate(getTodayISO()),
    tahun: getTahunFromDate(getTodayISO()),
    waktu: '08:00 WIB',
    kelas: '8-A',
    nama_siswa: '',
    topik_permasalahan: '',
    media_yang_diperlukan: '',
    ringkasan_uraian_permasalahan: '',
    pendekatan_dan_teknik_konseling: '',
    hasil_yang_dicapai: '',
    link_foto_kegiatan: '',
    keterangan: 'Rencana Pelaksanaan Konseling Individu',
    nama_guru_bk: 'WIWIK ISMIATI, S.Pd',
    nip_guru_bk: '19831116 200904 2 003',
    nama_kepala_sekolah: 'NUR FADILAH, S.Pd',
    nip_kepala_sekolah: '19860410 201001 2 030',
  });

  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [selectedPresetTab, setSelectedPresetTab] = useState<number>(0);

  const studentsInClass = (siswaItems || []).filter(
    (s) => (s.kelas || '').toLowerCase().replace(/\s+/g, '') === (formData.kelas || '').toLowerCase().replace(/\s+/g, '')
  );

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
        topik_permasalahan: initialData.topik_permasalahan || '',
        media_yang_diperlukan: initialData.media_yang_diperlukan || '',
        ringkasan_uraian_permasalahan: initialData.ringkasan_uraian_permasalahan || '',
        pendekatan_dan_teknik_konseling: initialData.pendekatan_dan_teknik_konseling || '',
        hasil_yang_dicapai: initialData.hasil_yang_dicapai || '',
        link_foto_kegiatan: initialData.link_foto_kegiatan || '',
        keterangan: initialData.keterangan || 'Rencana Pelaksanaan Konseling Individu',
        nama_guru_bk: initialData.nama_guru_bk || 'WIWIK ISMIATI, S.Pd',
        nip_guru_bk: initialData.nip_guru_bk || '19831116 200904 2 003',
        nama_kepala_sekolah: initialData.nama_kepala_sekolah || 'NUR FADILAH, S.Pd',
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
      topik_permasalahan: '',
      media_yang_diperlukan: '',
      ringkasan_uraian_permasalahan: '',
      pendekatan_dan_teknik_konseling: '',
      hasil_yang_dicapai: '',
      link_foto_kegiatan: '',
      keterangan: 'Rencana Pelaksanaan Konseling Individu',
    });
    setStatusMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama_siswa.trim()) {
      setStatusMessage({ type: 'error', text: 'Nama siswa wajib diisi!' });
      return;
    }
    if (!formData.topik_permasalahan.trim()) {
      setStatusMessage({ type: 'error', text: 'Topik permasalahan wajib diisi!' });
      return;
    }

    try {
      await onSubmit({
        ...formData,
        id: initialData?.id,
      });

      setStatusMessage({
        type: 'success',
        text: initialData
          ? 'Data Rencana Konseling Individu berhasil diperbarui!'
          : 'Data Rencana Konseling Individu berhasil disimpan ke database!',
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
          <div className="p-3 bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-800 text-white rounded-2xl shadow-md shadow-indigo-500/20 font-black">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-indigo-100 text-indigo-900 border border-indigo-300 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                FORMULIR E
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                Publik • Tanpa Login • Supabase Ready
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              E. RENCANA KONSELING INDIVIDU
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Formulir Perencanaan & Pelaksanaan Konseling Individu BK SMPN 7 Pasuruan
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
              ? 'bg-indigo-50 border-indigo-300 text-indigo-900'
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
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
          <div className="flex items-center gap-2 text-xs font-extrabold text-indigo-800 uppercase tracking-wider border-b border-slate-200 pb-2">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <span>1. WAKTU & IDENTITAS SISWA</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* TANGGAL */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                HARI / TANGGAL <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                name="tanggal"
                value={formData.tanggal}
                onChange={handleDateChange}
                required
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
              <p className="text-[11px] text-slate-500 mt-1 font-semibold">
                Hari: <span className="text-indigo-700 font-bold">{formData.hari}</span> ({formData.bulan} {formData.tahun})
              </p>
            </div>

            {/* WAKTU */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                WAKTU <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  name="waktu"
                  value={formData.waktu}
                  onChange={handleChange}
                  placeholder="Contoh: 08:00 WIB / Jam ke-2"
                  required
                  className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
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
              themeColor="indigo"
              required={true}
            />
          </div>
        </div>

        {/* SECTION 2: TOPIK, MEDIA & PERMASALAHAN */}
        <div className="bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-2 text-xs font-extrabold text-indigo-800 uppercase tracking-wider border-b border-slate-200 pb-2">
            <Target className="w-4 h-4 text-indigo-600" />
            <span>2. TOPIK, MEDIA & URAIAN PERMASALAHAN</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* TOPIK PERMASALAHAN */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                TOPIK PERMASALAHAN <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  name="topik_permasalahan"
                  value={formData.topik_permasalahan}
                  onChange={handleChange}
                  placeholder="Contoh: Kesulitan Pengelolaan Waktu Belajar"
                  required
                  className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* MEDIA YANG DIPERLUKAN */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                MEDIA YANG DIPERLUKAN
              </label>
              <div className="relative">
                <Wrench className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  name="media_yang_diperlukan"
                  value={formData.media_yang_diperlukan}
                  onChange={handleChange}
                  placeholder="Contoh: Lembar Kerja Siswa, Format Jadwal, Lembar Kontrak"
                  className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* RINGKASAN URAIAN PERMASALAHAN SISWA */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              RINGKASAN URAIAN PERMASALAHAN SISWA
            </label>
            <textarea
              name="ringkasan_uraian_permasalahan"
              value={formData.ringkasan_uraian_permasalahan}
              onChange={handleChange}
              rows={3}
              placeholder="Tuliskan uraian ringkas permasalahan siswa yang menjadi latar belakang konseling..."
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all leading-relaxed"
            />
          </div>
        </div>

        {/* SECTION 3: PENDEKATAN, HASIL, FOTO & KETERANGAN */}
        <div className="bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-2 text-xs font-extrabold text-indigo-800 uppercase tracking-wider border-b border-slate-200 pb-2">
            <CheckSquare className="w-4 h-4 text-indigo-600" />
            <span>3. PENDEKATAN, HASIL & FOTO KEGIATAN</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* PENDEKATAN DAN TEKNIK KONSELING */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                PENDEKATAN DAN TEKNIK KONSELING
              </label>
              <textarea
                name="pendekatan_dan_teknik_konseling"
                value={formData.pendekatan_dan_teknik_konseling}
                onChange={handleChange}
                rows={3}
                placeholder="Contoh: Pendekatan Behavioral dengan Teknik Behavioral Contract / SFBT..."
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all leading-relaxed"
              />
              <div className="mt-3 bg-slate-50/80 border border-slate-200 rounded-2xl p-3.5">
                <div className="flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                    PILIHAN PENDEKATAN & TEKNIK KONSELING (PANDUAN)
                  </span>
                </div>

                {/* Tab selector */}
                <div className="flex flex-wrap gap-1.5 mb-2.5 pb-2 border-b border-slate-200/60">
                  {PENDEKATAN_PRESETS.map((preset, index) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setSelectedPresetTab(index)}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all border ${
                        selectedPresetTab === index
                          ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm shadow-indigo-600/10'
                          : 'bg-white text-slate-600 hover:text-slate-950 hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      {preset.nama.split(' ')[0]}
                    </button>
                  ))}
                </div>

                {/* Tab content showing details of current selection */}
                <div className="space-y-2 text-xs leading-relaxed text-slate-600 bg-white border border-slate-100 rounded-xl p-3 shadow-sm">
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2 mb-2">
                    <div>
                      <span className="font-extrabold text-slate-900 text-[13px] block">
                        {PENDEKATAN_PRESETS[selectedPresetTab].nama}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const target = PENDEKATAN_PRESETS[selectedPresetTab];
                        const text = `Pendekatan: ${target.nama}\nTeknik Utama: ${target.teknik}\nFokus: ${target.fokus}\nKasus Efektif: ${target.kasus}`;
                        setFormData(prev => ({
                          ...prev,
                          pendekatan_dan_teknik_konseling: text
                        }));
                      }}
                      className="shrink-0 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg border border-indigo-100 transition-all text-[11px] flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Gunakan Pilihan Ini
                    </button>
                  </div>
                  <div>
                    <span className="font-bold text-slate-400 block text-[9px] uppercase tracking-wider mb-0.5">Fokus Utama</span>
                    <p className="text-slate-700 font-medium">{PENDEKATAN_PRESETS[selectedPresetTab].fokus}</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-400 block text-[9px] uppercase tracking-wider mb-0.5">Teknik Utama</span>
                    <p className="text-indigo-950 font-semibold">{PENDEKATAN_PRESETS[selectedPresetTab].teknik}</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-400 block text-[9px] uppercase tracking-wider mb-0.5">Sangat Efektif Untuk Kasus</span>
                    <p className="text-emerald-700 font-semibold">{PENDEKATAN_PRESETS[selectedPresetTab].kasus}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* HASIL YANG DICAPAI */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                HASIL YANG DICAPAI
              </label>
              <textarea
                name="hasil_yang_dicapai"
                value={formData.hasil_yang_dicapai}
                onChange={handleChange}
                rows={3}
                placeholder="Tuliskan komitmen siswa atau kesepakatan hasil konseling..."
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all leading-relaxed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
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
                  className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* KETERANGAN */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                KETERANGAN
              </label>
              <div className="relative">
                <HelpCircle className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  name="keterangan"
                  value={formData.keterangan}
                  onChange={handleChange}
                  placeholder="Catatan atau keterangan tambahan"
                  className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* DATA PENGESAHAN (GURU BK & KEPALA SEKOLAH) */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-4 h-4 text-indigo-600" />
                <span>Pengesahan Tanda Tangan (Guru BK & Kepala Sekolah)</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Guru BK</label>
                  <input
                    type="text"
                    name="nama_guru_bk"
                    value={formData.nama_guru_bk || ''}
                    onChange={handleChange}
                    placeholder="WIWIK ISMIATI, S.Pd"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">NIP Guru BK</label>
                  <input
                    type="text"
                    name="nip_guru_bk"
                    value={formData.nip_guru_bk || ''}
                    onChange={handleChange}
                    placeholder="19831116 200904 2 003"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Kepala Sekolah</label>
                  <input
                    type="text"
                    name="nama_kepala_sekolah"
                    value={formData.nama_kepala_sekolah || ''}
                    onChange={handleChange}
                    placeholder="NUR FADILAH, S.Pd"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
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
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SUBMIT BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-200">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>Data tersimpan ke database Supabase & penyimpanan lokal. Dapat di-update kapan saja.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleReset}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{initialData ? 'Update Rencana Konseling' : 'Simpan Konseling Individu'}</span>
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};
