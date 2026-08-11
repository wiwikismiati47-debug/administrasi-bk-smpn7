import React, { useState, useEffect } from 'react';
import { AgendaKerja, FormAgendaData, Siswa } from '../types';
import { SiswaSelector } from './SiswaSelector';
import {
  Calendar,
  Clock,
  FileText,
  Users,
  Image as ImageIcon,
  CheckCircle2,
  Save,
  RotateCcw,
  Sparkles,
  Link as LinkIcon,
  Upload,
  Eye,
  AlertCircle,
  Pencil
} from 'lucide-react';

interface FormAgendaProps {
  initialData?: AgendaKerja | null;
  onSubmit: (data: Partial<AgendaKerja> & FormAgendaData) => Promise<void>;
  onCancelEdit?: () => void;
  isSubmitting: boolean;
  siswaItems?: Siswa[];
}

const NAMA_HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const NAMA_BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const PRESET_URAIAN = [
  'Layanan Bimbingan Klasikal: Motivasi Belajar & Etika',
  'Konseling Individual: Pendampingan Masalah Pribadi & Belajar',
  'Konseling Kelompok: Pembentukan Karakter & Kerjasama',
  'Layanan Mediasi / Penyelesaian Konflik Antar Siswa',
  'Home Visit / Kunjungan Rumah Siswa',
  'Layanan Orientasi & Informasi Karir / Kelanjutan Studi',
  'Konferensi Kasus Bersama Orang Tua & Wali Kelas',
];

const PRESET_SASARAN = [
  'Siswa Kelas 7-A',
  'Siswa Kelas 7-B',
  'Siswa Kelas 7-C',
  'Siswa Kelas 7-D',
  'Siswa Kelas 7-E',
  'Siswa Kelas 7-F',
  'Siswa Kelas 7-G',
  'Siswa Kelas 7-H',
  'Siswa Kelas 8-A',
  'Siswa Kelas 8-B',
  'Siswa Kelas 8-C',
  'Siswa Kelas 8-D',
  'Siswa Kelas 8-E',
  'Siswa Kelas 8-F',
  'Siswa Kelas 8-G',
  'Siswa Kelas 8-H',
  'Siswa Kelas 9-A',
  'Siswa Kelas 9-B',
  'Siswa Kelas 9-C',
  'Siswa Kelas 9-D',
  'Siswa Kelas 9-E',
  'Siswa Kelas 9-F',
  'Siswa Kelas 9-G',
  'Siswa Kelas 9-H',
  'Seluruh Siswa Kelas 7',
  'Seluruh Siswa Kelas 8',
  'Seluruh Siswa Kelas 9',
  'Seluruh Siswa Kelas 7, 8, 9',
  'Orang Tua / Wali Siswa',
  'Wali Kelas & Guru Mata Pelajaran',
  'Konselor',
  'Guru BK / Konselor',
];

const PRESET_WAKTU = [
  '07.15-07.55 WIB',
  '07.55-08.35 WIB',
  '08.35-09.15 WIB',
  '09.15-09.55 WIB',
  '10.35-11.15 WIB',
  '11.15-11.55 WIB',
  '11.55-12.35 WIB',
  '12.35-13.15 WIB',
];

export const FormAgenda: React.FC<FormAgendaProps> = ({
  initialData,
  onSubmit,
  onCancelEdit,
  isSubmitting,
  siswaItems = [],
}) => {
  // Get current date formatted for initial values
  const today = new Date();
  const defaultDateStr = today.toISOString().split('T')[0];

  const [formData, setFormData] = useState<FormAgendaData>({
    hari: NAMA_HARI[today.getDay()],
    tanggal: defaultDateStr,
    bulan: NAMA_BULAN[today.getMonth()],
    tahun: String(today.getFullYear()),
    waktu: '07.15-07.55 WIB',
    uraian_kegiatan: '',
    sasaran: '',
    link_foto_kegiatan: '',
    keterangan: 'Terlaksana dengan baik',
  });

  const [previewError, setPreviewError] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');

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
    setFormData((prev) => ({ ...prev, waktu: `${hrs}.${mins} WIB` }));
  };

  // Sync when initialData changes (for Edit mode)
  useEffect(() => {
    if (initialData) {
      setFormData({
        hari: initialData.hari || 'Senin',
        tanggal: initialData.tanggal || defaultDateStr,
        bulan: initialData.bulan || 'Agustus',
        tahun: initialData.tahun || String(today.getFullYear()),
        waktu: initialData.waktu || '',
        uraian_kegiatan: initialData.uraian_kegiatan || '',
        sasaran: initialData.sasaran || '',
        link_foto_kegiatan: initialData.link_foto_kegiatan || '',
        keterangan: initialData.keterangan || '',
      });
      setPreviewError(false);
    }
  }, [initialData]);

  // When date input changes, automatically update Hari, Bulan, Tahun
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val) {
      setFormData((prev) => ({ ...prev, tanggal: val }));
      return;
    }
    const d = new Date(val + 'T00:00:00');
    if (!isNaN(d.getTime())) {
      const dayName = NAMA_HARI[d.getDay()];
      const monthName = NAMA_BULAN[d.getMonth()];
      const yearName = String(d.getFullYear());

      setFormData((prev) => ({
        ...prev,
        tanggal: val,
        hari: dayName,
        bulan: monthName,
        tahun: yearName,
      }));
    } else {
      setFormData((prev) => ({ ...prev, tanggal: val }));
    }
  };

  // Image File upload preview converter
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
        setFormData((prev) => ({ ...prev, link_foto_kegiatan: dataUrl }));
        setPreviewError(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.uraian_kegiatan.trim()) {
      alert('Uraian kegiatan wajib diisi!');
      return;
    }
    if (!formData.sasaran.trim()) {
      alert('Sasaran kegiatan wajib diisi!');
      return;
    }

    try {
      await onSubmit({
        ...(initialData?.id ? { id: initialData.id, created_at: initialData.created_at } : {}),
        ...formData,
      });

      setSuccessMessage(
        initialData?.id
          ? 'Data Agenda Kerja BK berhasil diperbarui!'
          : 'Data Agenda Kerja BK berhasil disimpan!'
      );

      setTimeout(() => setSuccessMessage(null), 4000);

      if (!initialData?.id) {
        // Reset form for next input if new record
        setFormData((prev) => ({
          ...prev,
          uraian_kegiatan: '',
          sasaran: '',
          link_foto_kegiatan: '',
          keterangan: 'Terlaksana dengan baik',
        }));
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menyimpan data.');
    }
  };

  const handleReset = () => {
    if (initialData?.id && onCancelEdit) {
      onCancelEdit();
    } else {
      setFormData({
        hari: NAMA_HARI[today.getDay()],
        tanggal: defaultDateStr,
        bulan: NAMA_BULAN[today.getMonth()],
        tahun: String(today.getFullYear()),
        waktu: '07.15-07.55 WIB',
        uraian_kegiatan: '',
        sasaran: '',
        link_foto_kegiatan: '',
        keterangan: 'Terlaksana dengan baik',
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      {/* Form Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
            {initialData?.id ? <Pencil className="w-5 h-5 text-amber-300" /> : <Sparkles className="w-5 h-5 text-amber-300" />}
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight">
              {initialData?.id ? 'UPDATE AGENDA KERJA BK' : 'INPUT AGENDA KERJA BK BARU'}
            </h3>
            <p className="text-xs text-blue-200">
              Formulir Administrasi BK • SMPN 7 Pasuruan
            </p>
          </div>
        </div>

        {initialData?.id && (
          <span className="bg-amber-400 text-slate-900 text-xs font-bold px-3 py-1 rounded-full shadow">
            Mode Edit ID: {initialData.id.slice(0, 8)}...
          </span>
        )}
      </div>

      {successMessage && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-3 flex items-center gap-2 text-emerald-800 text-sm font-medium animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        
        {/* ROW 1: Hari / Tanggal / Bulan / Tahun */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>HARI / TANGGAL / BULAN / TAHUN <span className="text-red-500">*</span></span>
            </div>
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                const dStr = now.toISOString().split('T')[0];
                setFormData(prev => ({
                  ...prev,
                  tanggal: dStr,
                  hari: NAMA_HARI[now.getDay()],
                  bulan: NAMA_BULAN[now.getMonth()],
                  tahun: String(now.getFullYear())
                }));
              }}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
            >
              Hari Ini
            </button>
          </div>

          <div className="max-w-md">
            {/* Tanggal Picker */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pilih Tanggal <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.tanggal}
                onChange={handleDateChange}
                required
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all [color-scheme:light]"
              />
            </div>
          </div>

          <div className="px-3 py-1.5 bg-blue-50/60 border border-blue-100 rounded-xl flex items-center gap-2 text-xs font-bold text-blue-900">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>{formData.hari}, {new Date(formData.tanggal || defaultDateStr).getDate()} {formData.bulan} {formData.tahun}</span>
          </div>
        </div>

        {/* ROW 2: Waktu */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
            <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>WAKTU KEGIATAN <span className="text-red-500">*</span></span>
            </label>
            {currentTime && (
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Jam Realtime: {currentTime}</span>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.waktu}
                onChange={(e) => setFormData({ ...formData, waktu: e.target.value })}
                required
                placeholder="Contoh: 07.15-07.55 WIB"
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={handleUseCurrentTime}
                className="px-3.5 py-2 text-xs font-bold bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-700 rounded-lg border border-blue-200 transition-all shadow-sm flex items-center gap-1.5 shrink-0"
                title="Gunakan jam saat ini"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                <span>Gunakan Waktu Sekarang</span>
              </button>
            </div>
            {/* Quick time combobox */}
            <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center pt-1">
              <span className="text-[11px] text-slate-500 font-medium">Pilih Cepat Waktu:</span>
              <select
                value={PRESET_WAKTU.includes(formData.waktu) ? formData.waktu : ''}
                onChange={(e) => {
                  if (e.target.value) {
                    setFormData({ ...formData, waktu: e.target.value });
                  }
                }}
                className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer shadow-sm min-w-[200px]"
              >
                <option value="">-- Klik untuk memilih waktu --</option>
                {PRESET_WAKTU.map((tw) => (
                  <option key={tw} value={tw}>
                    {tw}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ROW 3: Uraian Kegiatan */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-blue-600" />
            <span>URAIAN KEGIATAN <span className="text-red-500">*</span></span>
          </label>
          <textarea
            rows={6}
            value={formData.uraian_kegiatan}
            onChange={(e) => setFormData({ ...formData, uraian_kegiatan: e.target.value })}
            required
            placeholder="Tuliskan detail uraian kegiatan Bimbingan Konseling yang dilaksanakan..."
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-400"
          />
          {/* Quick preset chips */}
          <div className="mt-2 space-y-1">
            <span className="text-[11px] text-slate-500 block">Template Uraian Kegiatan BK:</span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_URAIAN.map((u, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setFormData({ ...formData, uraian_kegiatan: u })}
                  className="text-xs px-2.5 py-1 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium transition-colors border border-blue-200/60 text-left"
                >
                  + {u}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ROW 4: Sasaran */}
        <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 space-y-3">
          <label className="block text-xs font-semibold text-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-blue-600" />
              <span>SASARAN KEGIATAN <span className="text-red-500">*</span></span>
            </span>
            <span className="text-[11px] text-slate-500 font-medium">Pilih Kelas & Siswa atau Ketik Manual Sasaran</span>
          </label>

          {/* Quick Preset Selector for 7A-7H, 8A-8H, 9A-9H & Groups */}
          <div className="flex items-center gap-2 bg-blue-50/60 p-2.5 rounded-xl border border-blue-100">
            <span className="text-[11px] font-bold text-blue-800 whitespace-nowrap">Pilih Cepat Sasaran:</span>
            <select
              onChange={(e) => {
                const val = e.target.value;
                if (val) {
                  setFormData((prev) => ({ ...prev, sasaran: val }));
                }
              }}
              value=""
              className="w-full bg-white border border-blue-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Pilih Kelas (7A-7H, 8A-8H, 9A-9H) atau Kelompok --</option>
              <optgroup label="Kelas 7 (7A - 7H)">
                {['7A', '7B', '7C', '7D', '7E', '7F', '7G', '7H'].map((k) => (
                  <option key={`7${k}`} value={`Siswa Kelas ${k}`}>Siswa Kelas {k}</option>
                ))}
              </optgroup>
              <optgroup label="Kelas 8 (8A - 8H)">
                {['8A', '8B', '8C', '8D', '8E', '8F', '8G', '8H'].map((k) => (
                  <option key={`8${k}`} value={`Siswa Kelas ${k}`}>Siswa Kelas {k}</option>
                ))}
              </optgroup>
              <optgroup label="Kelas 9 (9A - 9H)">
                {['9A', '9B', '9C', '9D', '9E', '9F', '9G', '9H'].map((k) => (
                  <option key={`9${k}`} value={`Siswa Kelas ${k}`}>Siswa Kelas {k}</option>
                ))}
              </optgroup>
              <optgroup label="Kelompok / Seluruh Siswa / Guru">
                <option value="Seluruh Siswa Kelas 7, 8, 9">SELURUH SISWA 7, 8, 9</option>
                <option value="Seluruh Siswa Kelas 7">Seluruh Siswa Kelas 7</option>
                <option value="Seluruh Siswa Kelas 8">Seluruh Siswa Kelas 8</option>
                <option value="Seluruh Siswa Kelas 9">Seluruh Siswa Kelas 9</option>
                <option value="Konselor / Guru BK">Konselor / Guru BK</option>
              </optgroup>
            </select>
          </div>

          <SiswaSelector
            siswaItems={siswaItems}
            selectedKelas=""
            onSelectKelas={(k) => {
              if (k) {
                setFormData((prev) => ({ ...prev, sasaran: `Siswa Kelas ${k}` }));
              }
            }}
            selectedNamaSiswa={formData.sasaran}
            onSelectNamaSiswa={(n) => setFormData((prev) => ({ ...prev, sasaran: n }))}
            isMultiSelect={true}
            kelasLabel="Kelas Sasaran"
            siswaLabel="Sasaran Kegiatan (Nama Siswa / Kelompok)"
            themeColor="blue"
            required={true}
          />
        </div>

        {/* ROW 5: Link Foto Kegiatan */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
          <label className="block text-xs font-semibold text-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-blue-600" />
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
                  value={formData.link_foto_kegiatan}
                  onChange={(e) => {
                    setFormData({ ...formData, link_foto_kegiatan: e.target.value });
                    setPreviewError(false);
                  }}
                  placeholder="https://... (URL foto Google Drive / Imgur / web)"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Local File Upload Button */}
              <div className="flex items-center gap-2">
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-lg border border-slate-300 shadow-sm transition-colors">
                  <Upload className="w-3.5 h-3.5 text-blue-600" />
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
            <div className="flex flex-col items-center justify-center p-2 bg-white rounded-lg border border-slate-200 min-h-[90px]">
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

        {/* ROW 6: Keterangan */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            <span>KETERANGAN / HASIL LAYANAN</span>
          </label>
          <input
            type="text"
            value={formData.keterangan}
            onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
            placeholder="Contoh: Terlaksana dengan baik, Siswa kooperatif, Perlunya tindak lanjut"
            className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Form Action Buttons */}
        <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleReset}
            disabled={isSubmitting}
            className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-sm font-semibold transition-all inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{initialData?.id ? 'Batal Edit' : 'Reset Form'}</span>
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Menyimpan Data...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-amber-300" />
                <span>{initialData?.id ? 'Update Agenda BK' : 'Simpan Agenda BK'}</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};
