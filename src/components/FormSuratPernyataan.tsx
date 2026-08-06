import React, { useState, useEffect } from 'react';
import { SuratPernyataan, FormSuratPernyataanData, JenisSuratPernyataan } from '../types';
import { FileText, Save, RefreshCw, Sparkles, CheckCircle2, User, AlertCircle, Calendar, MapPin, Building, ShieldCheck } from 'lucide-react';

interface FormSuratPernyataanProps {
  initialData?: SuratPernyataan | null;
  onSubmit: (data: Partial<SuratPernyataan> & FormSuratPernyataanData) => Promise<void>;
  isSubmitting?: boolean;
  onCancelEdit?: () => void;
  existingItems?: SuratPernyataan[];
}

const TEMPLATES: Record<JenisSuratPernyataan, { title: string; defaultRules: string }> = {
  SP_1: {
    title: '1. SP 1 (Surat Peringatan 1 Siswa)',
    defaultRules:
      '1. Hadir di sekolah Tepat Waktu\n2. Tidak Absen lagi mulai terhitung Surat Perjanjian ini dibuat\n3. Mengerjakan semua Tugas tertulis /praktek dari Bapak /Ibu Guru Mata Pelajaran yang belum Tuntas\n\nApabila saya tidak dapat memenuhi Peraturan tersebut diatas, maka saya bersedia dikembalikan ke Orang Tua atau Mengundurkan diri dari Sekolah, tanpa ada tuntutan apapun kepada Pihak Sekolah.',
  },
  SP_2: {
    title: '2. SP 2 (Surat Peringatan 2 Siswa)',
    defaultRules:
      '1. Hadir di sekolah Tepat Waktu dan mematuhi seluruh tata tertib sekolah\n2. Tidak melakukan pelanggaran disiplin/ketidakhadiran berturut-turut\n3. Menyelesaikan seluruh kewajiban tugas akademik dan non-akademik tepat waktu\n\nApabila saya tidak dapat memenuhi Peraturan tersebut diatas, maka saya bersedia dikembalikan ke Orang Tua atau Mengundurkan diri dari Sekolah, tanpa ada tuntutan apapun kepada Pihak Sekolah.',
  },
  SP_3: {
    title: '3. SP 3 (Surat Peringatan 3 Siswa - Terakhir)',
    defaultRules:
      '1. Berkomitmen penuh mematuhi seluruh aturan dan norma UPT SMP Negeri 7 Pasuruan\n2. Tidak akan mengulangi segala bentuk tindakan indisipliner maupun pelanggaran aturan\n3. Wajib mematuhi bimbingan khusus dari Guru BK dan Wali Kelas\n\nApabila saya kembali melakukan pelanggaran, maka saya bersedia dikembalikan kepada Orang Tua / Mengundurkan Diri dari UPT SMP Negeri 7 Pasuruan secara mutlak.',
  },
  SP_ORTU_1: {
    title: '4. SP ORANG TUA 1 (Komitmen Nilai & Sikap)',
    defaultRules:
      'Apabila dikemudian hari nanti di kelas VIII sikap anak saya masih tetap /tidak berubah sehingga mempengaruhi nilai akademis dan non akademis menjadi rendah, sehingga anak saya tidak naik kelas atau mengulang di kelas VIII, maka saya sebagai orang tua tidak akan menuntut kepada pihak sekolah.',
  },
  SP_ORTU_2: {
    title: '5. SP ORANG TUA 2 (Komitmen Bimbingan & Wajib Belajar)',
    defaultRules:
      'Dengan ini kami menyatakan dengan sebenarnya bahwa kami sebagai orang tua akan mendidik /membimbing anak kami dirumah dengan sebaik-baiknya dan tidak akan memaksa anak kami untuk tidak melanjutkan sekolah /berhenti sekolah karena kondisi ekonomi dalam keluarga kami. apabila dikemudian hari kami sebagai orang tua melakukan pemaksaan terhadap anak kami untuk berhenti sekolah tanpa alasan yang pasti, kami bersedia menerima sangsi dalam bentuk apapun dari sekolah, sebab anak mempunyai hak untuk wajib belajar 9 tahun.',
  },
  SP_PENGUNDURAN_DIRI: {
    title: '6. SP PENGUNDURAN DIRI / PINDAH SEKOLAH',
    defaultRules:
      'Dengan ini menyatakan anak kami tersebut diatas mengundurkan diri dari UPT SMP NEGERI 7 PASURUAN. Demikian surat pernyataan ini kami buat dengan sebenar-benarnya dan hendaknya digunakan sebagaimana mestinya.',
  },
};

export const FormSuratPernyataan: React.FC<FormSuratPernyataanProps> = ({
  initialData,
  onSubmit,
  isSubmitting = false,
  onCancelEdit,
  existingItems = [],
}) => {
  const [jenisSp, setJenisSp] = useState<JenisSuratPernyataan>(initialData?.jenis_sp || 'SP_1');
  const [namaSiswa, setNamaSiswa] = useState(initialData?.nama_siswa || '');
  const [kelas, setKelas] = useState(initialData?.kelas || '');
  const [namaOrangTua, setNamaOrangTua] = useState(initialData?.nama_orang_tua || '');
  const [pekerjaanOrangTua, setPekerjaanOrangTua] = useState(initialData?.pekerjaan_orang_tua || '');
  const [alamatOrangTua, setAlamatOrangTua] = useState(initialData?.alamat_orang_tua || '');
  const [hubunganKeluarga, setHubunganKeluarga] = useState(initialData?.hubungan_keluarga || 'Orang Tua / Wali');
  const [peraturanDiketahui, setPeraturanDiketahui] = useState(initialData?.peraturan_diketahui || TEMPLATES.SP_1.defaultRules);
  const [alasanPengunduran, setAlasanPengunduran] = useState(initialData?.alasan_pengunduran || '');
  const [tanggalSurat, setTanggalSurat] = useState(initialData?.tanggal_surat || new Date().toISOString().slice(0, 10));
  const [tempatSurat, setTempatSurat] = useState(initialData?.tempat_surat || 'Pasuruan');
  const [keterangan, setKeterangan] = useState(initialData?.keterangan || '');
  const [autoUpdatedNotice, setAutoUpdatedNotice] = useState(false);

  // Update fields when initialData changes
  useEffect(() => {
    if (initialData) {
      setJenisSp(initialData.jenis_sp || 'SP_1');
      setNamaSiswa(initialData.nama_siswa || '');
      setKelas(initialData.kelas || '');
      setNamaOrangTua(initialData.nama_orang_tua || '');
      setPekerjaanOrangTua(initialData.pekerjaan_orang_tua || '');
      setAlamatOrangTua(initialData.alamat_orang_tua || '');
      setHubunganKeluarga(initialData.hubungan_keluarga || 'Orang Tua / Wali');
      setPeraturanDiketahui(initialData.peraturan_diketahui || TEMPLATES[initialData.jenis_sp || 'SP_1'].defaultRules);
      setAlasanPengunduran(initialData.alasan_pengunduran || '');
      setTanggalSurat(initialData.tanggal_surat || new Date().toISOString().slice(0, 10));
      setTempatSurat(initialData.tempat_surat || 'Pasuruan');
      setKeterangan(initialData.keterangan || '');
    }
  }, [initialData]);

  // When jenisSp changes in new form mode, prefill default template rules
  const handleJenisChange = (newJenis: JenisSuratPernyataan) => {
    setJenisSp(newJenis);
    if (!initialData) {
      setPeraturanDiketahui(TEMPLATES[newJenis].defaultRules);
    }
  };

  // Check if existing student data exists to notify user that uploading/submitting will update existing record
  const handleNamaSiswaBlur = () => {
    if (!namaSiswa.trim() || initialData) return;
    const match = existingItems.find(
      (item) =>
        item.nama_siswa.toLowerCase().trim() === namaSiswa.toLowerCase().trim() &&
        item.jenis_sp === jenisSp
    );
    if (match) {
      setKelas(match.kelas || kelas);
      setNamaOrangTua(match.nama_orang_tua || namaOrangTua);
      setPekerjaanOrangTua(match.pekerjaan_orang_tua || pekerjaanOrangTua);
      setAlamatOrangTua(match.alamat_orang_tua || alamatOrangTua);
      setHubunganKeluarga(match.hubungan_keluarga || hubunganKeluarga);
      setAutoUpdatedNotice(true);
      setTimeout(() => setAutoUpdatedNotice(false), 5000);
    }
  };

  const resetForm = () => {
    setJenisSp('SP_1');
    setNamaSiswa('');
    setKelas('');
    setNamaOrangTua('');
    setPekerjaanOrangTua('');
    setAlamatOrangTua('');
    setHubunganKeluarga('Orang Tua / Wali');
    setPeraturanDiketahui(TEMPLATES.SP_1.defaultRules);
    setAlasanPengunduran('');
    setTanggalSurat(new Date().toISOString().slice(0, 10));
    setTempatSurat('Pasuruan');
    setKeterangan('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaSiswa.trim()) {
      alert('Nama Siswa wajib diisi.');
      return;
    }

    // Check if an existing item matches the same student & jenisSp for auto-update
    let matchedId = initialData?.id;
    if (!matchedId) {
      const match = existingItems.find(
        (item) =>
          item.nama_siswa.toLowerCase().trim() === namaSiswa.toLowerCase().trim() &&
          item.jenis_sp === jenisSp
      );
      if (match) {
        matchedId = match.id;
      }
    }

    const payload: Partial<SuratPernyataan> & FormSuratPernyataanData = {
      ...(matchedId ? { id: matchedId } : {}),
      jenis_sp: jenisSp,
      nama_siswa: namaSiswa,
      kelas: kelas,
      nama_orang_tua: namaOrangTua,
      pekerjaan_orang_tua: pekerjaanOrangTua,
      alamat_orang_tua: alamatOrangTua,
      hubungan_keluarga: hubunganKeluarga,
      peraturan_diketahui: peraturanDiketahui,
      alasan_pengunduran: jenisSp === 'SP_PENGUNDURAN_DIRI' ? alasanPengunduran : '',
      tanggal_surat: tanggalSurat,
      tempat_surat: tempatSurat,
      keterangan: keterangan,
    };

    await onSubmit(payload);
    if (!initialData) {
      resetForm();
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-5 sm:p-7">
      
      {/* Header Form */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 rounded-2xl text-white shadow-lg shadow-orange-500/20">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 rounded-md border border-amber-200">
                FORM G
              </span>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                {initialData ? 'Edit Surat Pernyataan Siswa / Ortu' : 'Formulir Surat Pernyataan Siswa'}
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Input SP 1, SP 2, SP 3, SP Orang Tua, & Pengunduran Diri (Terhubung Supabase)
            </p>
          </div>
        </div>

        {initialData && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="px-3.5 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
          >
            Batal Edit
          </button>
        )}
      </div>

      {autoUpdatedNotice && (
        <div className="mb-5 p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2.5 text-xs text-amber-800 font-medium animate-fade-in">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Data siswa ini ditemukan sebelumnya. Formulir otomatis memuat info terbaru dan akan memperbarui data di Supabase jika disimpan!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* 1. Pilih Jenis Surat Pernyataan (6 Pilihan) */}
        <div className="space-y-2">
          <label className="block text-xs font-extrabold uppercase text-slate-700 tracking-wider">
            Jenis Surat Pernyataan <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {(Object.keys(TEMPLATES) as JenisSuratPernyataan[]).map((key) => {
              const active = jenisSp === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleJenisChange(key)}
                  className={`p-3 text-left rounded-xl border transition-all text-xs font-bold flex items-start gap-2.5 ${
                    active
                      ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/20 ring-2 ring-amber-300'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <div className={`p-1 rounded-md shrink-0 ${active ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="leading-snug">{TEMPLATES[key].title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Data Siswa */}
        <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider">
            <User className="w-4 h-4 text-amber-600" />
            <span>Identitas Siswa</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Nama Lengkap Siswa <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={namaSiswa}
                onChange={(e) => setNamaSiswa(e.target.value)}
                onBlur={handleNamaSiswaBlur}
                placeholder="Contoh: Ahmad Rizky Pratama"
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-medium text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Kelas</label>
              <input
                type="text"
                value={kelas}
                onChange={(e) => setKelas(e.target.value)}
                placeholder="Contoh: VIII A / IX B"
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-medium text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* 3. Identitas Orang Tua / Wali */}
        <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider">
            <Building className="w-4 h-4 text-amber-600" />
            <span>Identitas Orang Tua / Wali</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Nama Orang Tua / Wali</label>
              <input
                type="text"
                value={namaOrangTua}
                onChange={(e) => setNamaOrangTua(e.target.value)}
                placeholder="Contoh: Bapak Santoso"
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-medium text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Pekerjaan Orang Tua</label>
              <input
                type="text"
                value={pekerjaanOrangTua}
                onChange={(e) => setPekerjaanOrangTua(e.target.value)}
                placeholder="Contoh: Wiraswasta / PNS"
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-medium text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Hubungan Keluarga</label>
              <input
                type="text"
                value={hubunganKeluarga}
                onChange={(e) => setHubunganKeluarga(e.target.value)}
                placeholder="Contoh: Orang Tua / Wali / Ayah Kandung"
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-medium text-slate-900"
              />
            </div>

            <div className="sm:col-span-3 space-y-1">
              <label className="block text-xs font-bold text-slate-700">Alamat Lengkap</label>
              <input
                type="text"
                value={alamatOrangTua}
                onChange={(e) => setAlamatOrangTua(e.target.value)}
                placeholder="Contoh: Jl. Pahlawan No. 45, Pasuruan"
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-medium text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* 4. Isi / Komitmen Pernyataan */}
        <div className="space-y-4 p-4 bg-amber-50/50 border border-amber-200/80 rounded-2xl">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-extrabold uppercase text-amber-900 tracking-wider">
              Isi Poin Pernyataan / Komitmen Peraturan
            </label>
            <button
              type="button"
              onClick={() => setPeraturanDiketahui(TEMPLATES[jenisSp].defaultRules)}
              className="text-[11px] text-amber-700 hover:text-amber-900 font-bold flex items-center gap-1 hover:underline"
              title="Reset ke Teks Template Standard"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Teks Template</span>
            </button>
          </div>

          <textarea
            rows={5}
            value={peraturanDiketahui}
            onChange={(e) => setPeraturanDiketahui(e.target.value)}
            placeholder="Ketik atau edit poin-poin pernyataan..."
            className="w-full p-3.5 text-xs bg-white border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-sans text-slate-900 leading-relaxed"
          />

          {jenisSp === 'SP_PENGUNDURAN_DIRI' && (
            <div className="space-y-1">
              <label className="block text-xs font-bold text-red-700">
                Alasan Pengunduran Diri / Pindah Sekolah
              </label>
              <textarea
                rows={2}
                value={alasanPengunduran}
                onChange={(e) => setAlasanPengunduran(e.target.value)}
                placeholder="Contoh: Mengikuti domisili orang tua ke luar kota / Alasan pribadi keluarga"
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-red-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all font-medium text-slate-900"
              />
            </div>
          )}
        </div>

        {/* 5. Tanggal & Lokasi Surat */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>Tempat Surat</span>
            </label>
            <input
              type="text"
              value={tempatSurat}
              onChange={(e) => setTempatSurat(e.target.value)}
              placeholder="Pasuruan"
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-medium text-slate-900"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Tanggal Surat</span>
            </label>
            <input
              type="date"
              value={tanggalSurat}
              onChange={(e) => setTanggalSurat(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-medium text-slate-900"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Catatan / Keterangan Tambahan</label>
            <input
              type="text"
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              placeholder="Catatan internal BK..."
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-medium text-slate-900"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Form</span>
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-700 hover:to-red-700 rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{initialData ? 'Update Surat Pernyataan' : 'Simpan Surat Pernyataan'}</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};
