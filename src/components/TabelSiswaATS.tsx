import React, { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { SiswaATS } from '../types';
import {
  Search,
  Filter,
  Download,
  Printer,
  Pencil,
  Trash2,
  Calendar,
  Clock,
  User,
  MapPin,
  FileText,
  Camera,
  Image as ImageIcon,
  Sparkles,
  Database,
  Grid,
  List,
  Eye,
  CheckCircle2,
  AlertTriangle,
  UserX,
  X,
  Plus,
  RefreshCw,
  Award
} from 'lucide-react';

interface TabelSiswaATSProps {
  items: SiswaATS[];
  onEdit: (item: SiswaATS) => void;
  onDelete: (id: string) => Promise<void>;
  onPrintLaporanATS?: (item: SiswaATS) => void;
  onPrintTabelATS?: () => void;
  onAddNew?: () => void;
  isSupabase?: boolean;
  isLoading?: boolean;
  onRefresh?: () => void;
}

export const TabelSiswaATS: React.FC<TabelSiswaATSProps> = ({
  items,
  onEdit,
  onDelete,
  onPrintLaporanATS,
  onPrintTabelATS,
  onAddNew,
  isSupabase = true,
  isLoading = false,
  onRefresh
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTahunAjaran, setFilterTahunAjaran] = useState<string>('ALL');
  const [filterKategori, setFilterKategori] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [selectedDetailItem, setSelectedDetailItem] = useState<SiswaATS | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Extract unique Tahun Ajaran
  const uniqueTahunAjaran = useMemo(() => {
    const set = new Set<string>();
    items.forEach((i) => {
      if (i.tahun_ajaran) set.add(i.tahun_ajaran);
    });
    return Array.from(set).sort().reverse();
  }, [items]);

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchSearch =
        (item.nama_siswa || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.alamat || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.alasan_ats || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.alasan_manual || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.nama_guru_kunjungan || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.kelas || '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchTahun =
        filterTahunAjaran === 'ALL' || item.tahun_ajaran === filterTahunAjaran;

      const matchKategori =
        filterKategori === 'ALL' ||
        (filterKategori === 'DO' && (item.kategori_ats || '').includes('DO')) ||
        (filterKategori === 'LTM' && (item.kategori_ats || '').includes('LTM'));

      return matchSearch && matchTahun && matchKategori;
    });
  }, [items, searchTerm, filterTahunAjaran, filterKategori]);

  const handleDelete = async (id: string, nama: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data Siswa ATS: "${nama}"? Data akan terhapus dari Supabase dan penyimpanan lokal.`)) {
      setDeletingId(id);
      try {
        await onDelete(id);
        if (selectedDetailItem?.id === id) {
          setSelectedDetailItem(null);
        }
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleExportExcel = () => {
    if (filteredItems.length === 0) {
      alert('Tidak ada data untuk diekspor.');
      return;
    }

    const exportRows = filteredItems.map((item, idx) => ({
      'No': idx + 1,
      'Hari/Tanggal': `${item.hari}, ${item.tanggal}`,
      'Tahun Ajaran': item.tahun_ajaran || '-',
      'Waktu': item.waktu || '-',
      'Nama Siswa': item.nama_siswa,
      'Kategori ATS': item.kategori_ats,
      'Kelas': item.kelas || '-',
      'Alamat Siswa': item.alamat,
      'Alasan ATS': item.alasan_ats,
      'Alasan Manual': item.alasan_manual || '-',
      'Tempat Laporan': item.tempat_laporan || 'Pasuruan',
      'Tanggal Laporan': item.tanggal_laporan || item.tanggal,
      'Guru Kunjungan': item.nama_guru_kunjungan,
      'NIP Guru': item.nip_guru_kunjungan,
      'Kepala Sekolah': item.nama_kepala_sekolah || 'NUR FADILAH, S.Pd,. M.Pd',
      'NIP Kepala Sekolah': item.nip_kepala_sekolah || '19860410 201001 2 030',
      'Keterangan Tindak Lanjut': item.keterangan || '-'
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Siswa ATS');
    XLSX.writeFile(workbook, `Rekap_Siswa_ATS_SMPN7_Pasuruan_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Controls */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-700 via-rose-700 to-red-800 text-white flex items-center justify-center shadow-md shrink-0">
              <UserX className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  Rekapitulasi Data Siswa ATS
                </h2>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  isSupabase ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}>
                  <Database className="w-3 h-3" />
                  {isSupabase ? 'Supabase Sync' : 'Penyimpanan Lokal'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Total terdaftar: <strong>{items.length}</strong> siswa ATS ({items.filter(i => (i.kategori_ats || '').includes('DO')).length} DO, {items.filter(i => (i.kategori_ats || '').includes('LTM')).length} LTM)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                disabled={isLoading}
                className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-300 transition"
                title="Muat ulang dari Cloud Supabase"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-700' : ''}`} />
              </button>
            )}

            {onPrintTabelATS && (
              <button
                type="button"
                onClick={onPrintTabelATS}
                className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-2 transition shadow-sm"
              >
                <Printer className="w-4 h-4 text-amber-300" />
                Cetak Rekap Tabel
              </button>
            )}

            <button
              type="button"
              onClick={handleExportExcel}
              className="px-3.5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-2 transition shadow-sm"
            >
              <Download className="w-4 h-4" />
              Ekspor Excel
            </button>

            {onAddNew && (
              <button
                type="button"
                onClick={onAddNew}
                className="px-4 py-2.5 bg-gradient-to-r from-amber-700 to-red-800 hover:from-amber-800 hover:to-red-900 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 transition shadow-md"
              >
                <Plus className="w-4 h-4" />
                Tambah Siswa ATS
              </button>
            )}
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="mt-5 pt-5 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="lg:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari siswa ATS, alamat, alasan, atau guru kunjungan..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Tahun Ajaran */}
          <div className="lg:col-span-3">
            <select
              value={filterTahunAjaran}
              onChange={(e) => setFilterTahunAjaran(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="ALL">Semua Tahun Ajaran</option>
              {uniqueTahunAjaran.map((thn) => (
                <option key={thn} value={thn}>{thn}</option>
              ))}
            </select>
          </div>

          {/* Filter Kategori */}
          <div className="lg:col-span-2">
            <select
              value={filterKategori}
              onChange={(e) => setFilterKategori(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="ALL">Semua Kategori</option>
              <option value="DO">DO (Drop Out)</option>
              <option value="LTM">LTM (Lulus Tdk Lanjut)</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="lg:col-span-1 flex items-center justify-end">
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'table' ? 'bg-white text-amber-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Tampilan Tabel"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'cards' ? 'bg-white text-amber-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Tampilan Kartu"
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {filteredItems.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-sm">
          <UserX className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">Tidak ada data Siswa ATS yang cocok</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchTerm || filterTahunAjaran !== 'ALL' || filterKategori !== 'ALL'
              ? 'Coba atur ulang pencarian atau filter untuk menemukan data.'
              : 'Belum ada data Siswa ATS yang dicatat. Silakan input melalui formulir di atas.'}
          </p>
          {onAddNew && (
            <button
              type="button"
              onClick={onAddNew}
              className="mt-4 px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Tambah Siswa ATS Baru
            </button>
          )}
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-3 text-center w-12">No</th>
                  <th className="py-3.5 px-4 w-36">Hari / Tanggal</th>
                  <th className="py-3.5 px-4 w-28">Tahun Ajaran</th>
                  <th className="py-3.5 px-4 w-52">Nama Siswa ATS</th>
                  <th className="py-3.5 px-3 w-28">Kategori</th>
                  <th className="py-3.5 px-4">Alasan ATS & Uraian</th>
                  <th className="py-3.5 px-3 text-center w-20">Foto</th>
                  <th className="py-3.5 px-4 w-44">Guru Kunjungan</th>
                  <th className="py-3.5 px-4 text-center w-36">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item, idx) => {
                  const hasPhoto1 = Boolean(item.foto_kunjungan_1);
                  const hasPhoto2 = Boolean(item.foto_bukti_fisik_2);
                  const isDeleting = deletingId === item.id;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-amber-50/40 transition-colors group"
                    >
                      <td className="py-3.5 px-3 text-center text-slate-500 font-medium">
                        {idx + 1}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{item.hari}</div>
                        <div className="text-[11px] text-slate-500">{item.tanggal}</div>
                        <div className="text-[10px] text-slate-400">{item.waktu}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-semibold text-[11px] border border-slate-200">
                          {item.tahun_ajaran || '2025/2026'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 uppercase text-xs">
                          {item.nama_siswa}
                        </div>
                        {item.kelas && (
                          <div className="text-[11px] text-slate-500">Kelas: {item.kelas}</div>
                        )}
                        <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 flex items-center gap-1" title={item.alamat}>
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{item.alamat}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          (item.kategori_ats || '').includes('DO')
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {item.kategori_ats}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-medium text-slate-800 line-clamp-2 leading-relaxed" title={item.alasan_ats}>
                          {item.alasan_ats}
                        </p>
                        {item.alasan_manual && (
                          <p className="text-[11px] text-slate-500 italic mt-0.5 line-clamp-1" title={item.alasan_manual}>
                            &quot;{item.alasan_manual}&quot;
                          </p>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {hasPhoto1 && (
                            <button
                              type="button"
                              onClick={() => setSelectedDetailItem(item)}
                              className="p-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200"
                              title="Lihat Foto Kunjungan 1"
                            >
                              <Camera className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {hasPhoto2 && (
                            <button
                              type="button"
                              onClick={() => setSelectedDetailItem(item)}
                              className="p-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200"
                              title="Lihat Foto Bukti Fisik 2"
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {!hasPhoto1 && !hasPhoto2 && (
                            <span className="text-[10px] text-slate-400">-</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800 text-[11px]">
                          {item.nama_guru_kunjungan}
                        </div>
                        <div className="text-[10px] text-slate-400">NIP. {item.nip_guru_kunjungan}</div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {onPrintLaporanATS && (
                            <button
                              type="button"
                              onClick={() => onPrintLaporanATS(item)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition"
                              title="Cetak Laporan Kunjungan ATS"
                            >
                              <Printer className="w-4 h-4 text-amber-700" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setSelectedDetailItem(item)}
                            className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 transition"
                            title="Lihat Rincian Lengkap"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onEdit(item)}
                            className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition"
                            title="Edit Data"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id, item.nama_siswa)}
                            disabled={isDeleting}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition disabled:opacity-50"
                            title="Hapus Data"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Header Card */}
                <div className="bg-gradient-to-r from-amber-700/10 via-rose-700/10 to-red-800/10 p-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      (item.kategori_ats || '').includes('DO')
                        ? 'bg-rose-100 text-rose-800 border-rose-200'
                        : 'bg-amber-100 text-amber-800 border-amber-200'
                    }`}>
                      {item.kategori_ats}
                    </span>
                    <span className="text-[11px] font-bold text-slate-700">
                      TA {item.tahun_ajaran || '2025/2026'}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {item.tanggal}
                  </span>
                </div>

                {/* Body Card */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 uppercase">
                      {item.nama_siswa}
                    </h3>
                    {item.kelas && (
                      <p className="text-xs text-slate-500">Kelas: {item.kelas}</p>
                    )}
                  </div>

                  <div className="text-xs text-slate-600 flex items-start gap-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <MapPin className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <span className="leading-relaxed line-clamp-2">{item.alamat}</span>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Alasan ATS:
                    </span>
                    <p className="text-xs text-slate-800 font-medium line-clamp-3 leading-relaxed">
                      {item.alasan_ats}
                    </p>
                    {item.alasan_manual && (
                      <p className="text-[11px] text-slate-500 italic mt-1 line-clamp-2">
                        &quot;{item.alasan_manual}&quot;
                      </p>
                    )}
                  </div>

                  {/* Foto Thumbnails */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    {item.foto_kunjungan_1 ? (
                      <div className="rounded-lg overflow-hidden border border-slate-200 aspect-video bg-black/5">
                        <img src={item.foto_kunjungan_1} alt="Foto 1" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="rounded-lg border border-dashed border-slate-200 p-2 text-center text-[10px] text-slate-400 aspect-video flex items-center justify-center">
                        Tanpa Foto 1
                      </div>
                    )}
                    {item.foto_bukti_fisik_2 ? (
                      <div className="rounded-lg overflow-hidden border border-slate-200 aspect-video bg-black/5">
                        <img src={item.foto_bukti_fisik_2} alt="Foto 2" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="rounded-lg border border-dashed border-slate-200 p-2 text-center text-[10px] text-slate-400 aspect-video flex items-center justify-center">
                        Tanpa Foto 2
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer Card Actions */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[11px] text-slate-500 truncate max-w-[150px]">
                  Petugas: <strong className="text-slate-700">{item.nama_guru_kunjungan}</strong>
                </div>

                <div className="flex items-center gap-1.5">
                  {onPrintLaporanATS && (
                    <button
                      type="button"
                      onClick={() => onPrintLaporanATS(item)}
                      className="p-2 rounded-xl bg-white hover:bg-slate-100 text-amber-800 border border-slate-200 transition shadow-xs"
                      title="Cetak Laporan"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setSelectedDetailItem(item)}
                    className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition shadow-xs"
                    title="Lihat Detail"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit(item)}
                    className="p-2 rounded-xl bg-white hover:bg-slate-100 text-blue-700 border border-slate-200 transition shadow-xs"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id, item.nama_siswa)}
                    className="p-2 rounded-xl bg-white hover:bg-slate-100 text-rose-700 border border-slate-200 transition shadow-xs"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedDetailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] shadow-2xl overflow-hidden border border-slate-200 flex flex-col">
            {/* Header Modal */}
            <div className="bg-gradient-to-r from-amber-700 via-rose-700 to-red-800 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/20">
                  Rincian Dokumen Siswa ATS
                </span>
                <h3 className="font-bold text-lg mt-1">{selectedDetailItem.nama_siswa}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDetailItem(null)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body Modal */}
            <div className="p-6 space-y-5 overflow-y-auto">
              {/* Grid 2 Kolom Info */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-slate-500 mb-0.5">Hari / Tanggal Kunjungan</div>
                  <div className="font-bold text-slate-900 text-sm">
                    {selectedDetailItem.hari}, {selectedDetailItem.tanggal}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Waktu: {selectedDetailItem.waktu}</div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-slate-500 mb-0.5">Kategori / Status</div>
                  <div className="font-bold text-slate-900 text-sm">{selectedDetailItem.kategori_ats}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Tahun Ajaran: {selectedDetailItem.tahun_ajaran}</div>
                </div>
              </div>

              {/* Alamat */}
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Alamat Siswa ATS:
                </span>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium text-slate-800">
                  {selectedDetailItem.alamat}
                </div>
              </div>

              {/* Nama Orang Tua */}
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Nama Orang Tua / Wali:
                </span>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-900">
                  {selectedDetailItem.nama_orang_tua || '-'}
                </div>
              </div>

              {/* Alasan ATS */}
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Alasan Siswa Tidak Sekolah:
                </span>
                <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-xs text-slate-900 leading-relaxed">
                  {selectedDetailItem.alasan_ats}
                </div>
                {selectedDetailItem.alasan_manual && (
                  <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 italic">
                    <strong className="not-italic text-slate-800">Uraian Tambahan: </strong>
                    {selectedDetailItem.alasan_manual}
                  </div>
                )}
              </div>

              {/* Foto Kunjungan & Bukti Fisik */}
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Dokumentasi Foto Kunjungan & Bukti Fisik:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-semibold text-slate-700 mb-1">Foto Kunjungan 1:</div>
                    {selectedDetailItem.foto_kunjungan_1 ? (
                      <div className="rounded-xl overflow-hidden border border-slate-300 aspect-video">
                        <img
                          src={selectedDetailItem.foto_kunjungan_1}
                          alt="Foto Kunjungan 1"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl border border-dashed border-slate-300 text-center text-xs text-slate-400">
                        Tidak ada foto kunjungan 1
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-slate-700 mb-1">Foto Bukti Fisik 2:</div>
                    {selectedDetailItem.foto_bukti_fisik_2 ? (
                      <div className="rounded-xl overflow-hidden border border-slate-300 aspect-video">
                        <img
                          src={selectedDetailItem.foto_bukti_fisik_2}
                          alt="Foto Bukti Fisik 2"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl border border-dashed border-slate-300 text-center text-xs text-slate-400">
                        Tidak ada foto bukti fisik 2
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Petugas & Laporan */}
              <div className="grid grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-200">
                <div>
                  <div className="text-slate-500">Tempat & Tanggal Laporan:</div>
                  <div className="font-semibold text-slate-900 mt-0.5">
                    {selectedDetailItem.tempat_laporan || 'Pasuruan'}, {selectedDetailItem.tanggal_laporan || selectedDetailItem.tanggal}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500">Guru Kunjungan:</div>
                  <div className="font-semibold text-slate-900 mt-0.5">
                    {selectedDetailItem.nama_guru_kunjungan}
                  </div>
                  <div className="text-[11px] text-slate-400">NIP. {selectedDetailItem.nip_guru_kunjungan}</div>
                </div>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedDetailItem(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-xl transition"
              >
                Tutup
              </button>

              <div className="flex items-center gap-2">
                {onPrintLaporanATS && (
                  <button
                    type="button"
                    onClick={() => {
                      onPrintLaporanATS(selectedDetailItem);
                      setSelectedDetailItem(null);
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 transition"
                  >
                    <Printer className="w-3.5 h-3.5 text-amber-300" />
                    Cetak Laporan
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    onEdit(selectedDetailItem);
                    setSelectedDetailItem(null);
                  }}
                  className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 transition"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
