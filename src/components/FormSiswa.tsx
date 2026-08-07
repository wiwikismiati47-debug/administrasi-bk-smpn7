import React, { useState, useEffect } from 'react';
import { Siswa, FormSiswaData } from '../types';
import {
  User,
  Hash,
  School,
  Smile,
  Info,
  Save,
  RotateCcw,
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface FormSiswaProps {
  initialData?: Siswa | null;
  onSubmit: (data: Partial<Siswa> & FormSiswaData) => Promise<void>;
  onCancelEdit?: () => void;
  isSubmitting: boolean;
}

const PRESET_KELAS = [
  '7-A', '7-B', '7-C', '7-D', '7-E', '7-F', '7-G', '7-H',
  '8-A', '8-B', '8-C', '8-D', '8-E', '8-F', '8-G', '8-H',
  '9-A', '9-B', '9-C', '9-D', '9-E', '9-F', '9-G', '9-H'
];

export const FormSiswa: React.FC<FormSiswaProps> = ({
  initialData,
  onSubmit,
  onCancelEdit,
  isSubmitting,
}) => {
  const [formData, setFormData] = useState<FormSiswaData>({
    nama_siswa: '',
    kelas: '8-A',
    nis: '',
    jenis_kelamin: 'Laki-laki',
    keterangan: 'Aktif',
  });

  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sync when initialData changes (for Edit mode)
  useEffect(() => {
    if (initialData) {
      setFormData({
        nama_siswa: initialData.nama_siswa || '',
        kelas: initialData.kelas || '8-A',
        nis: initialData.nis || '',
        jenis_kelamin: initialData.jenis_kelamin || 'Laki-laki',
        keterangan: initialData.keterangan || '',
      });
    } else {
      setFormData({
        nama_siswa: '',
        kelas: '8-A',
        nis: '',
        jenis_kelamin: 'Laki-laki',
        keterangan: 'Aktif',
      });
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setValidationError(null);
  };

  const handleReset = () => {
    if (initialData) {
      setFormData({
        nama_siswa: initialData.nama_siswa || '',
        kelas: initialData.kelas || '8-A',
        nis: initialData.nis || '',
        jenis_kelamin: initialData.jenis_kelamin || 'Laki-laki',
        keterangan: initialData.keterangan || '',
      });
    } else {
      setFormData({
        nama_siswa: '',
        kelas: '8-A',
        nis: '',
        jenis_kelamin: 'Laki-laki',
        keterangan: 'Aktif',
      });
    }
    setValidationError(null);
    setSuccessMessage(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setSuccessMessage(null);

    // Basic Validation
    if (!formData.nama_siswa.trim()) {
      setValidationError('Nama Siswa wajib diisi.');
      return;
    }
    if (!formData.nis.trim()) {
      setValidationError('NIS wajib diisi.');
      return;
    }
    if (!formData.kelas.trim()) {
      setValidationError('Kelas wajib diisi.');
      return;
    }

    try {
      const payload: Partial<Siswa> & FormSiswaData = {
        ...formData,
        nama_siswa: formData.nama_siswa.trim(),
        nis: formData.nis.trim(),
      };

      if (initialData?.id) {
        payload.id = initialData.id;
        payload.created_at = initialData.created_at;
      }

      await onSubmit(payload);
      
      setSuccessMessage(
        initialData 
          ? 'Data siswa berhasil diperbarui!' 
          : 'Data siswa berhasil disimpan!'
      );

      if (!initialData) {
        // Clear only if adding new
        setFormData({
          nama_siswa: '',
          kelas: '8-A',
          nis: '',
          jenis_kelamin: 'Laki-laki',
          keterangan: 'Aktif',
        });
      }

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan saat menyimpan data.';
      setValidationError(msg);
    }
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden" id="form-siswa-card">
      <div className="bg-gradient-to-r from-cyan-600 to-teal-600 px-6 py-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="bg-white/10 p-2 rounded-lg">
            <Smile className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg">
              {initialData ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}
            </h3>
            <p className="text-xs text-cyan-100 mt-0.5">
              Administrasi Data & Profil Siswa Bimbingan Konseling (Public Access)
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1 bg-white/15 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Siswa BK</span>
        </div>
      </div>

      <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
        {/* Status Alerts */}
        {validationError && (
          <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg text-sm animate-fade-in">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{validationError}</span>
          </div>
        )}

        {successMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-lg text-sm flex items-center gap-2">
            <span className="p-1 bg-emerald-200 rounded text-emerald-800 text-xs">✓</span>
            <span className="font-semibold">{successMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* NAMA SISWA */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-cyan-600" />
              Nama Siswa <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nama_siswa"
              value={formData.nama_siswa}
              onChange={handleInputChange}
              placeholder="Masukkan nama lengkap siswa"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium transition-all"
              required
            />
          </div>

          {/* NIS */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-cyan-600" />
              Nomor Induk Siswa (NIS) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nis"
              value={formData.nis}
              onChange={handleInputChange}
              placeholder="Masukkan NIS siswa (contoh: 12345)"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono transition-all"
              required
            />
            <p className="text-[11px] text-slate-500 font-medium">
              * Jika NIS yang dimasukkan sudah terdaftar, data siswa tersebut akan langsung di-update secara otomatis sesuai input/upload terbaru Anda.
            </p>
          </div>

          {/* KELAS */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <School className="w-3.5 h-3.5 text-cyan-600" />
              Kelas <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="kelas"
                value={formData.kelas}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium transition-all appearance-none"
                required
              >
                {PRESET_KELAS.map((kls) => (
                  <option key={kls} value={kls}>
                    {kls}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-500">
                ▼
              </div>
            </div>
          </div>

          {/* JENIS KELAMIN */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-cyan-600" />
              Jenis Kelamin
            </label>
            <div className="flex gap-4 p-1 bg-slate-50 border border-slate-300 rounded-lg">
              <label className="flex-1 flex items-center justify-center gap-2 py-1.5 text-sm font-semibold rounded-md cursor-pointer transition-all select-none peer-checked:bg-white">
                <input
                  type="radio"
                  name="jenis_kelamin"
                  value="Laki-laki"
                  checked={formData.jenis_kelamin === 'Laki-laki'}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-cyan-600 focus:ring-cyan-500"
                />
                <span className={formData.jenis_kelamin === 'Laki-laki' ? 'text-cyan-700 font-bold' : 'text-slate-600'}>
                  Laki-laki
                </span>
              </label>
              <label className="flex-1 flex items-center justify-center gap-2 py-1.5 text-sm font-semibold rounded-md cursor-pointer transition-all select-none">
                <input
                  type="radio"
                  name="jenis_kelamin"
                  value="Perempuan"
                  checked={formData.jenis_kelamin === 'Perempuan'}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-cyan-600 focus:ring-cyan-500"
                />
                <span className={formData.jenis_kelamin === 'Perempuan' ? 'text-cyan-700 font-bold' : 'text-slate-600'}>
                  Perempuan
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* KETERANGAN */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-cyan-600" />
            Keterangan Tambahan / Catatan BK
          </label>
          <textarea
            name="keterangan"
            value={formData.keterangan}
            onChange={handleInputChange}
            rows={2}
            placeholder="Masukkan keterangan (contoh: Siswa aktif, OSIS, perlu pemantauan, dll)"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium transition-all"
          />
        </div>

        {/* Form Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Info className="w-3.5 h-3.5 text-cyan-600" />
            <span>Formulir ini dapat diakses publik & langsung tersimpan</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-lg flex items-center gap-1.5 border border-slate-300 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>

            {onCancelEdit && (
              <button
                type="button"
                onClick={onCancelEdit}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 font-bold text-sm rounded-lg transition-all cursor-pointer"
              >
                Batal
              </button>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-bold text-sm rounded-lg flex items-center gap-2 shadow-sm shadow-cyan-600/10 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Menyimpan...' : initialData ? 'Update Siswa' : 'Simpan Siswa'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
