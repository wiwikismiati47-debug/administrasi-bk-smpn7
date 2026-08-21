import { getActiveGuruBK, PRESET_GURU_BK } from '../lib/guruBk';
import React, { useState, useEffect } from 'react';
import { SuratPernyataan, FormSuratPernyataanData, JenisSuratPernyataan, Siswa } from '../types';
import { SiswaSelector } from './SiswaSelector';
import { FileText, Save, RefreshCw, Sparkles, CheckCircle2, User, AlertCircle, Calendar, MapPin, Building, ShieldCheck } from 'lucide-react';

interface FormSuratPernyataanProps {
  initialData?: SuratPernyataan | null;
  onSubmit: (data: Partial<SuratPernyataan> & FormSuratPernyataanData) => Promise<void>;
  isSubmitting?: boolean;
  onCancelEdit?: () => void;
  existingItems?: SuratPernyataan[];
  siswaItems?: Siswa[];
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
  SP_DAMAI: {
    title: '7. SP DAMAI SISWA (Penyelesaian Perselisihan)',
    defaultRules:
      '1. Saling memaafkan dengan tulus dan tidak akan mengungkit atau memperpanjang masalah ini lagi.\n2. Kembali berteman dengan baik serta tidak akan saling mengejek, mengancam, memprovokasi, atau melakukan kekerasan dalam bentuk apa pun.\n3. Siap menerima sanksi tegas dari pihak sekolah sesuai dengan aturan yang berlaku apabila melanggar janji ini.',
  },
};

export const FormSuratPernyataan: React.FC<FormSuratPernyataanProps> = ({
  initialData,
  onSubmit,
  isSubmitting = false,
  onCancelEdit,
  existingItems = [],
  siswaItems = [],
}) => {
  const [jenisSp, setJenisSp] = useState<JenisSuratPernyataan>(initialData?.jenis_sp || 'SP_1');
  const [namaSiswa, setNamaSiswa] = useState(initialData?.nama_siswa || '');
  const [kelas, setKelas] = useState(initialData?.kelas || '');

  // Siswa Kedua & Info Khusus untuk SP Damai
  const [namaSiswa2, setNamaSiswa2] = useState(initialData?.nama_siswa_2 || '');
  const [kelas2, setKelas2] = useState(initialData?.kelas_2 || '');
  const [hariTanggalKejadian, setHariTanggalKejadian] = useState(initialData?.hari_tanggal_kejadian || '');
  const [tahunAjaran, setTahunAjaran] = useState(initialData?.tahun_ajaran || '2026-2027');
  const [jabatanPengetahu, setJabatanPengetahu] = useState(initialData?.jabatan_pengetahu || 'Guru BK / Wali Kelas');

  const [namaOrangTua, setNamaOrangTua] = useState(initialData?.nama_orang_tua || '');
  const [pekerjaanOrangTua, setPekerjaanOrangTua] = useState(initialData?.pekerjaan_orang_tua || '');
  const [alamatOrangTua, setAlamatOrangTua] = useState(initialData?.alamat_orang_tua || '');
  const [hubunganKeluarga, setHubunganKeluarga] = useState(initialData?.hubungan_keluarga || 'Orang Tua / Wali');
  const [peraturanDiketahui, setPeraturanDiketahui] = useState(initialData?.peraturan_diketahui || TEMPLATES.SP_1.defaultRules);
  const [alasanPengunduran, setAlasanPengunduran] = useState(initialData?.alasan_pengunduran || '');
  const [tanggalSurat, setTanggalSurat] = useState(initialData?.tanggal_surat || new Date().toISOString().slice(0, 10));
  const [tempatSurat, setTempatSurat] = useState(initialData?.tempat_surat || 'Pasuruan');
  const [keterangan, setKeterangan] = useState(initialData?.keterangan || '');
  const [namaGuruBk, setNamaGuruBk] = useState(initialData?.nama_guru_bk || getActiveGuruBK().nama);
  const [nipGuruBk, setNipGuruBk] = useState(initialData?.nip_guru_bk || getActiveGuruBK().nip);
  const [namaKepalaSekolah, setNamaKepalaSekolah] = useState(initialData?.nama_kepala_sekolah || 'NUR FADILAH, S.Pd,. M.Pd');
  const [nipKepalaSekolah, setNipKepalaSekolah] = useState(initialData?.nip_kepala_sekolah || '19860410 201001 2 030');
  const [autoUpdatedNotice, setAutoUpdatedNotice] = useState(false);

  // Update fields when initialData changes
  useEffect(() => {
    if (initialData) {
      setJenisSp(initialData.jenis_sp || 'SP_1');
      setNamaSiswa(initialData.nama_siswa || '');
      setKelas(initialData.kelas || '');
      setNamaSiswa2(initialData.nama_siswa_2 || '');
      setKelas2(initialData.kelas_2 || '');
      setHariTanggalKejadian(initialData.hari_tanggal_kejadian || '');
      setTahunAjaran(initialData.tahun_ajaran || '2026-2027');
      setJabatanPengetahu(initialData.jabatan_pengetahu || 'Guru BK / Wali Kelas');
      setNamaOrangTua(initialData.nama_orang_tua || '');
      setPekerjaanOrangTua(initialData.pekerjaan_orang_tua || '');
      setAlamatOrangTua(initialData.alamat_orang_tua || '');
      setHubunganKeluarga(initialData.hubungan_keluarga || 'Orang Tua / Wali');
      setPeraturanDiketahui(initialData.peraturan_diketahui || TEMPLATES[initialData.jenis_sp || 'SP_1'].defaultRules);
      setAlasanPengunduran(initialData.alasan_pengunduran || '');
      setTanggalSurat(initialData.tanggal_surat || new Date().toISOString().slice(0, 10));
      setTempatSurat(initialData.tempat_surat || 'Pasuruan');
      setKeterangan(initialData.keterangan || '');
      setNamaGuruBk(initialData.nama_guru_bk || getActiveGuruBK().nama);
      setNipGuruBk(initialData.nip_guru_bk || getActiveGuruBK().nip);
      setNamaKepalaSekolah(initialData.nama_kepala_sekolah || 'NUR FADILAH, S.Pd,. M.Pd');
      setNipKepalaSekolah(initialData.nip_kepala_sekolah || '19860410 201001 2 030');
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
    setNamaSiswa2('');
    setKelas2('');
    setHariTanggalKejadian('');
    setTahunAjaran('2026-2027');
    setJabatanPengetahu('Guru BK / Wali Kelas');
    setNamaOrangTua('');
    setPekerjaanOrangTua('');
    setAlamatOrangTua('');
    setHubunganKeluarga('Orang Tua / Wali');
    setPeraturanDiketahui(TEMPLATES.SP_1.defaultRules);
    setAlasanPengunduran('');
    setTanggalSurat(new Date().toISOString().slice(0, 10));
    setTempatSurat('Pasuruan');
    setKeterangan('');
    setNamaGuruBk(getActiveGuruBK().nama);
    setNipGuruBk(getActiveGuruBK().nip);
    setNamaKepalaSekolah('NUR FADILAH, S.Pd,. M.Pd');
    setNipKepalaSekolah('19860410 201001 2 030');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaSiswa.trim()) {
      alert(jenisSp === 'SP_DAMAI' ? 'Nama Siswa Pertama wajib diisi.' : 'Nama Siswa wajib diisi.');
      return;
    }

    if (jenisSp === 'SP_DAMAI' && !namaSiswa2.trim()) {
      alert('Nama Siswa Kedua wajib diisi untuk Surat Pernyataan Damai.');
      return;
    }

    const payload: Partial<SuratPernyataan> & FormSuratPernyataanData = {
      ...(initialData?.id ? { id: initialData.id } : {}),
      jenis_sp: jenisSp,
      nama_siswa: namaSiswa,
      kelas: kelas,
      nama_siswa_2: jenisSp === 'SP_DAMAI' ? namaSiswa2 : '',
      kelas_2: jenisSp === 'SP_DAMAI' ? kelas2 : '',
      hari_tanggal_kejadian: jenisSp === 'SP_DAMAI' ? hariTanggalKejadian : '',
      tahun_ajaran: tahunAjaran,
      jabatan_pengetahu: jabatanPengetahu,
      nama_orang_tua: jenisSp === 'SP_DAMAI' ? '' : namaOrangTua,
      pekerjaan_orang_tua: jenisSp === 'SP_DAMAI' ? '' : pekerjaanOrangTua,
      alamat_orang_tua: jenisSp === 'SP_DAMAI' ? '' : alamatOrangTua,
      hubungan_keluarga: jenisSp === 'SP_DAMAI' ? '' : hubunganKeluarga,
      peraturan_diketahui: peraturanDiketahui,
      alasan_pengunduran: jenisSp === 'SP_PENGUNDURAN_DIRI' ? alasanPengunduran : '',
      tanggal_surat: tanggalSurat,
      tempat_surat: tempatSurat,
      keterangan: keterangan,
      nama_guru_bk: namaGuruBk,
      nip_guru_bk: nipGuruBk,
      nama_kepala_sekolah: namaKepalaSekolah,
      nip_kepala_sekolah: nipKepalaSekolah,
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
              Input SP 1, SP 2, SP 3, SP Orang Tua, Pengunduran Diri, & Pernyataan Damai Siswa
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

        {/* 1. Pilih Jenis Surat Pernyataan (7 Pilihan) */}
        <div className="space-y-2">
          <label className="block text-xs font-extrabold uppercase text-slate-700 tracking-wider">
            Jenis Surat Pernyataan <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
            {(Object.keys(TEMPLATES) as JenisSuratPernyataan[]).map((key) => {
              const active = jenisSp === key;
              const isDamai = key === 'SP_DAMAI';
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleJenisChange(key)}
                  className={`p-3 text-left rounded-xl border transition-all text-xs font-bold flex items-start gap-2.5 relative overflow-hidden ${
                    active
                      ? isDamai
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-md shadow-emerald-500/20 ring-2 ring-emerald-300'
                        : 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/20 ring-2 ring-amber-300'
                      : isDamai
                      ? 'bg-emerald-50/80 hover:bg-emerald-100/80 text-emerald-950 border-emerald-300 ring-1 ring-emerald-200'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <div
                    className={`p-1 rounded-md shrink-0 ${
                      active
                        ? isDamai
                          ? 'bg-emerald-700 text-white'
                          : 'bg-amber-600 text-white'
                        : isDamai
                        ? 'bg-emerald-200 text-emerald-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="leading-snug block">{TEMPLATES[key].title}</span>
                    {isDamai && (
                      <span className={`inline-block text-[9px] font-extrabold px-1.5 py-0.5 rounded mt-1 uppercase tracking-wider ${
                        active ? 'bg-white/20 text-white' : 'bg-emerald-200 text-emerald-800'
                      }`}>
                        Kesepakatan Damai
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SP DAMAI SISWA KHUSUS */}
        {jenisSp === 'SP_DAMAI' ? (
          <div className="space-y-4">
            {/* Identitas Siswa Pertama & Siswa Kedua */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Siswa Pertama */}
              <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/80 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-amber-200 text-amber-900 font-bold text-xs uppercase tracking-wider">
                  <User className="w-4 h-4 text-amber-600" />
                  <span>Identitas Siswa Pertama (Pihak 1)</span>
                </div>

                <SiswaSelector
                  siswaItems={siswaItems}
                  selectedKelas={kelas}
                  onSelectKelas={(k) => setKelas(k)}
                  selectedNamaSiswa={namaSiswa}
                  onSelectNamaSiswa={(n) => setNamaSiswa(n)}
                  isMultiSelect={true}
                  kelasLabel="Kelas Siswa Pertama"
                  siswaLabel="Nama Lengkap Siswa Pertama"
                  themeColor="amber"
                  required={true}
                />
              </div>

              {/* Siswa Kedua */}
              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-emerald-200 text-emerald-900 font-bold text-xs uppercase tracking-wider">
                  <User className="w-4 h-4 text-emerald-600" />
                  <span>Identitas Siswa Kedua (Pihak 2)</span>
                </div>

                <SiswaSelector
                  siswaItems={siswaItems}
                  selectedKelas={kelas2}
                  onSelectKelas={(k) => setKelas2(k)}
                  selectedNamaSiswa={namaSiswa2}
                  onSelectNamaSiswa={(n) => setNamaSiswa2(n)}
                  isMultiSelect={true}
                  kelasLabel="Kelas Siswa Kedua"
                  siswaLabel="Nama Lengkap Siswa Kedua"
                  themeColor="emerald"
                  required={true}
                />
              </div>
            </div>

            {/* Informasi Kejadian & Tahun Ajaran */}
            <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider">
                <Calendar className="w-4 h-4 text-amber-600" />
                <span>Detail Perselisihan & Tahun Ajaran</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Hari, Tanggal Kejadian Perselisihan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={hariTanggalKejadian}
                    onChange={(e) => setHariTanggalKejadian(e.target.value)}
                    placeholder="Contoh: Senin, 17 Agustus 2026"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-medium text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Tahun Ajaran</label>
                  <input
                    type="text"
                    value={tahunAjaran}
                    onChange={(e) => setTahunAjaran(e.target.value)}
                    placeholder="2026-2027"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-medium text-slate-900"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* 2. Data Siswa Standard */}
            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider">
                <User className="w-4 h-4 text-amber-600" />
                <span>Identitas Siswa</span>
              </div>

              <SiswaSelector
                siswaItems={siswaItems}
                selectedKelas={kelas}
                onSelectKelas={(k) => setKelas(k)}
                selectedNamaSiswa={namaSiswa}
                onSelectNamaSiswa={(n) => setNamaSiswa(n)}
                isMultiSelect={true}
                kelasLabel="Kelas Siswa"
                siswaLabel="Nama Lengkap Siswa"
                themeColor="amber"
                required={true}
              />
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
          </>
        )}

        {/* 4. Isi / Komitmen Pernyataan */}
        <div className="space-y-4 p-4 bg-amber-50/50 border border-amber-200/80 rounded-2xl">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-extrabold uppercase text-amber-900 tracking-wider">
              {jenisSp === 'SP_DAMAI' ? 'Poin Ikrar / Janji Kesepakatan Damai' : 'Isi Poin Pernyataan / Komitmen Peraturan'}
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

        {/* DATA PENGESAHAN */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <User className="w-4 h-4 text-amber-600" />
            <span>
              {jenisSp === 'SP_DAMAI'
                ? 'Pengesahan Mengetahui (Guru BK / Wali Kelas)'
                : 'Pengesahan Tanda Tangan (Guru BK & Kepala Sekolah)'}
            </span>
          </h4>

          {jenisSp === 'SP_DAMAI' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Jabatan Pengetahu</label>
                <select
                  value={jabatanPengetahu}
                  onChange={(e) => setJabatanPengetahu(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none cursor-pointer"
                >
                  <option value="Guru BK / Wali Kelas">Guru BK / Wali Kelas</option>
                  <option value="Guru Bimbingan dan Konseling">Guru BK</option>
                  <option value="Wali Kelas">Wali Kelas</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Guru / Pembina</label>
                <select
                  value={namaGuruBk}
                  onChange={(e) => {
                    setNamaGuruBk(e.target.value);
                    const preset = PRESET_GURU_BK.find(g => g.nama === e.target.value);
                    if (preset) setNipGuruBk(preset.nip);
                  }}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none cursor-pointer"
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
                <label className="block text-xs font-semibold text-slate-600 mb-1">NIP Guru / Pembina</label>
                <select
                  value={nipGuruBk}
                  onChange={(e) => {
                    setNipGuruBk(e.target.value);
                    const preset = PRESET_GURU_BK.find(g => g.nip === e.target.value);
                    if (preset) setNamaGuruBk(preset.nama);
                  }}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none cursor-pointer"
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Guru BK</label>
                <select
                  value={namaGuruBk}
                  onChange={(e) => {
                    setNamaGuruBk(e.target.value);
                    const preset = PRESET_GURU_BK.find(g => g.nama === e.target.value);
                    if (preset) setNipGuruBk(preset.nip);
                  }}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none cursor-pointer"
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
                <label className="block text-xs font-semibold text-slate-600 mb-1">NIP Guru BK</label>
                <select
                  value={nipGuruBk}
                  onChange={(e) => {
                    setNipGuruBk(e.target.value);
                    const preset = PRESET_GURU_BK.find(g => g.nip === e.target.value);
                    if (preset) setNamaGuruBk(preset.nama);
                  }}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none cursor-pointer"
                >
                  {PRESET_GURU_BK.map(g => (
                    <option key={g.nip} value={g.nip}>{g.nip}</option>
                  ))}
                  {!PRESET_GURU_BK.some(g => g.nip === nipGuruBk) && (
                    <option value={nipGuruBk}>{nipGuruBk}</option>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Kepala Sekolah</label>
                <input
                  type="text"
                  value={namaKepalaSekolah}
                  onChange={(e) => setNamaKepalaSekolah(e.target.value)}
                  placeholder="NUR FADILAH, S.Pd,. M.Pd"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">NIP Kepala Sekolah</label>
                <input
                  type="text"
                  value={nipKepalaSekolah}
                  onChange={(e) => setNipKepalaSekolah(e.target.value)}
                  placeholder="19860410 201001 2 030"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>
          )}
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
