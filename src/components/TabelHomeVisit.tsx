import React, { useState } from 'react';
import { HomeVisit } from '../types';
import {
  downloadLaporanHomeVisitWord,
  downloadBulkLaporanHomeVisitWord,
  downloadSuratTugasHomeVisitWord,
  downloadBulkSuratTugasHomeVisitWord,
  downloadSuratKesediaanOrtuWord,
  downloadBulkSuratKesediaanOrtuWord
} from '../lib/wordExporter';
import {
  Search,
  Filter,
  Download,
  Printer,
  Pencil,
  Trash2,
  ExternalLink,
  Home,
  Calendar,
  GraduationCap,
  User,
  Users,
  Briefcase,
  MapPin,
  FileText,
  AlertTriangle,
  CheckSquare,
  Image as ImageIcon,
  Sparkles,
  Database,
  Grid,
  List,
  FileCheck
} from 'lucide-react';

interface TabelHomeVisitProps {
  items: HomeVisit[];
  onEdit: (item: HomeVisit) => void;
  onDelete: (id: string) => Promise<void>;
  onPrint: () => void;
  onPrintLaporanHomeVisit?: (item: HomeVisit) => void;
  onPrintSuratTugasHomeVisit?: (item: HomeVisit) => void;
  onPrintSuratKesediaanOrtu?: (item: HomeVisit) => void;
  isSupabase?: boolean;
  isLoading?: boolean;
}

const MONTHS_LIST = [
  'Semua Bulan',
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const KELAS_LIST = [
  'Semua Kelas',
  'VII A', 'VII B', 'VII C', 'VII D', 'VII E', 'VII F',
  'VIII A', 'VIII B', 'VIII C', 'VIII D', 'VIII E', 'VIII F',
  'IX A', 'IX B', 'IX C', 'IX D', 'IX E', 'IX F'
];

export const TabelHomeVisit: React.FC<TabelHomeVisitProps> = ({
  items,
  onEdit,
  onDelete,
  onPrint,
  onPrintLaporanHomeVisit,
  onPrintSuratTugasHomeVisit,
  onPrintSuratKesediaanOrtu,
  isSupabase = false,
  isLoading = false,
}) => {
  const [search, setSearch] = useState('');
  const [selectedKelas, setSelectedKelas] = useState('Semua Kelas');
  const [selectedBulan, setSelectedBulan] = useState('Semua Bulan');
  const [selectedTahun, setSelectedTahun] = useState('Semua Tahun');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Filter items
  const filtered = items.filter((item) => {
    const matchesSearch =
      item.nama_siswa.toLowerCase().includes(search.toLowerCase()) ||
      item.nama_orang_tua.toLowerCase().includes(search.toLowerCase()) ||
      item.perihal_home_visit.toLowerCase().includes(search.toLowerCase()) ||
      item.uraian_permasalahan.toLowerCase().includes(search.toLowerCase()) ||
      item.alamat.toLowerCase().includes(search.toLowerCase()) ||
      item.kelas.toLowerCase().includes(search.toLowerCase());

    const matchesKelas = selectedKelas === 'Semua Kelas' || item.kelas === selectedKelas;
    const matchesBulan = selectedBulan === 'Semua Bulan' || item.bulan === selectedBulan;
    const matchesTahun = selectedTahun === 'Semua Tahun' || item.tahun === selectedTahun;

    return matchesSearch && matchesKelas && matchesBulan && matchesTahun;
  });

  // Get unique years in data
  const yearsInSeries = Array.from(new Set(items.map((i) => i.tahun))).sort().reverse();

  // Export CSV function
  const handleExportCSV = () => {
    if (filtered.length === 0) {
      alert('Tidak ada data home visit untuk diexport.');
      return;
    }

    const headers = [
      'No',
      'Hari',
      'Tanggal',
      'Bulan',
      'Tahun',
      'Jam',
      'Kelas',
      'Nama Siswa',
      'Nama Orang Tua',
      'Pekerjaan Orang Tua',
      'Alamat Rumah',
      'Perihal Home Visit',
      'Uraian Permasalahan',
      'Tindak Lanjut',
      'Link Foto',
      'Keterangan'
    ];

    const rows = filtered.map((item, index) => [
      index + 1,
      `"${item.hari}"`,
      `"${item.tanggal}"`,
      `"${item.bulan}"`,
      `"${item.tahun}"`,
      `"${item.waktu}"`,
      `"${item.kelas}"`,
      `"${item.nama_siswa.replace(/"/g, '""')}"`,
      `"${item.nama_orang_tua.replace(/"/g, '""')}"`,
      `"${(item.pekerjaan_orang_tua || '').replace(/"/g, '""')}"`,
      `"${(item.alamat || '').replace(/"/g, '""')}"`,
      `"${item.perihal_home_visit.replace(/"/g, '""')}"`,
      `"${(item.uraian_permasalahan || '').replace(/"/g, '""')}"`,
      `"${(item.tindak_lanjut || '').replace(/"/g, '""')}"`,
      `"${(item.link_foto_kegiatan || '').replace(/"/g, '""')}"`,
      `"${(item.keterangan || '').replace(/"/g, '""')}"`
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Rekap_Home_Visit_BK_SMPN7_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-900/90 text-slate-100 rounded-3xl p-5 sm:p-7 border border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.4)] backdrop-blur-xl relative space-y-6">
      
      {/* Table Header & Quick Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-gradient-to-br from-amber-500 via-orange-600 to-amber-700 text-slate-950 rounded-2xl shadow-lg shadow-amber-500/20 font-black">
            <Home className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded uppercase shadow">
                TABEL C
              </span>
              <span className="text-xs text-amber-300 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Terdata {filtered.length} Kunjungan Rumah
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
              REKAP DATA HOME VISIT / KUNJUNGAN RUMAH
            </h3>
            <p className="text-xs text-slate-400">
              Sistem Laporan & Pemantauan Kunjungan Rumah BK SMPN 7 Pasuruan
            </p>
          </div>
        </div>

        {/* Top Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* View Mode Switcher */}
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center">
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                viewMode === 'table' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
              title="Tampilan Tabel"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tabel</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                viewMode === 'cards' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
              title="Tampilan Kartu / Grid"
            >
              <Grid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kartu</span>
            </button>
          </div>

          {/* Bulk Download Word Button */}
          {filtered.length > 0 && (
            <button
              onClick={() => downloadBulkLaporanHomeVisitWord(filtered)}
              className="px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-extrabold rounded-xl shadow-md transition-all flex items-center gap-1.5"
              title="Unduh Seluruh Laporan Home Visit ke Word (.docx)"
            >
              <FileCheck className="w-4 h-4 text-amber-300" />
              <span>Bulk Word (.docx)</span>
            </button>
          )}

          {/* Export Excel / CSV */}
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-extrabold rounded-xl shadow-md transition-all flex items-center gap-1.5"
            title="Export Data ke CSV/Excel"
          >
            <Download className="w-4 h-4 text-emerald-200" />
            <span>Export CSV</span>
          </button>

          {/* Cetak Tabel */}
          <button
            onClick={onPrint}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5"
            title="Cetak / Save PDF Laporan Home Visit"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Tabel</span>
          </button>

        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
        
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama siswa, ortu, alamat..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-amber-500 font-medium"
          />
        </div>

        {/* Filter Kelas */}
        <div>
          <select
            value={selectedKelas}
            onChange={(e) => setSelectedKelas(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 font-semibold"
          >
            {KELAS_LIST.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Bulan */}
        <div>
          <select
            value={selectedBulan}
            onChange={(e) => setSelectedBulan(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 font-semibold"
          >
            {MONTHS_LIST.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Tahun */}
        <div>
          <select
            value={selectedTahun}
            onChange={(e) => setSelectedTahun(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 font-semibold"
          >
            <option value="Semua Tahun">Semua Tahun</option>
            {yearsInSeries.map((y) => (
              <option key={y} value={y}>
                Tahun {y}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Main Content List / Table */}
      {isLoading ? (
        <div className="text-center py-16 text-slate-400 space-y-3">
          <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold">Memuat data Home Visit...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-slate-950/40 rounded-2xl border border-slate-800/80 space-y-3">
          <Home className="w-12 h-12 text-slate-600 mx-auto" />
          <h4 className="text-base font-bold text-slate-300">Belum Ada Data Home Visit</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Tidak ada laporan home visit yang sesuai pencarian atau filter yang dipilih. Silakan tambahkan data melalui tab Input Form.
          </p>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="overflow-x-auto rounded-2xl border border-slate-800 shadow-xl">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-slate-200 uppercase font-black tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3.5 text-center w-12">NO</th>
                <th className="p-3.5">HARI / TANGGAL / JAM</th>
                <th className="p-3.5">KELAS & SISWA</th>
                <th className="p-3.5">ORANG TUA & ALAMAT</th>
                <th className="p-3.5 min-w-[220px]">PERIHAL & PERMASALAHAN</th>
                <th className="p-3.5 min-w-[200px]">TINDAK LANJUT</th>
                <th className="p-3.5 text-center">FOTO</th>
                <th className="p-3.5 text-center w-32">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-900/60 font-medium">
              {filtered.map((item, idx) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-800/60 transition-colors group"
                >
                  <td className="p-3.5 text-center font-extrabold text-amber-400">
                    {idx + 1}
                  </td>

                  {/* Waktu */}
                  <td className="p-3.5 space-y-1">
                    <span className="font-bold text-white block">
                      {item.hari}, {item.tanggal}
                    </span>
                    <span className="text-[11px] text-amber-300 font-mono bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/50 inline-block">
                      {item.waktu}
                    </span>
                  </td>

                  {/* Siswa & Kelas */}
                  <td className="p-3.5 space-y-1">
                    <span className="inline-block bg-purple-500/20 text-purple-300 border border-purple-400/30 font-black text-[10px] px-2 py-0.5 rounded uppercase">
                      Kelas {item.kelas}
                    </span>
                    <p className="font-extrabold text-white text-sm">
                      {item.nama_siswa}
                    </p>
                  </td>

                  {/* Ortu & Alamat */}
                  <td className="p-3.5 space-y-1">
                    <p className="font-bold text-slate-200 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{item.nama_orang_tua || '-'}</span>
                    </p>
                    {item.pekerjaan_orang_tua && (
                      <p className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Briefcase className="w-3 h-3 text-slate-500 shrink-0" />
                        <span>{item.pekerjaan_orang_tua}</span>
                      </p>
                    )}
                    <p className="text-[11px] text-slate-400 flex items-start gap-1">
                      <MapPin className="w-3 h-3 text-red-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{item.alamat || '-'}</span>
                    </p>
                  </td>

                  {/* Perihal & Permasalahan */}
                  <td className="p-3.5 space-y-1.5">
                    <p className="font-bold text-amber-300 text-xs leading-snug">
                      {item.perihal_home_visit}
                    </p>
                    {item.uraian_permasalahan && (
                      <p className="text-[11px] text-slate-300 bg-slate-950/80 p-2 rounded-xl border border-slate-800/80 leading-relaxed line-clamp-3">
                        {item.uraian_permasalahan}
                      </p>
                    )}
                  </td>

                  {/* Tindak Lanjut */}
                  <td className="p-3.5">
                    {item.tindak_lanjut ? (
                      <p className="text-[11px] text-slate-200 bg-emerald-950/40 p-2 rounded-xl border border-emerald-800/40 leading-relaxed line-clamp-3">
                        {item.tindak_lanjut}
                      </p>
                    ) : (
                      <span className="text-slate-500 italic text-[11px]">- Belum diisi -</span>
                    )}
                  </td>

                  {/* Foto */}
                  <td className="p-3.5 text-center">
                    {item.link_foto_kegiatan ? (
                      <a
                        href={item.link_foto_kegiatan}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg text-[10px] font-bold border border-slate-700 transition-colors"
                        title="Buka Foto Kegiatan"
                      >
                        <ImageIcon className="w-3 h-3" />
                        <span>Foto</span>
                      </a>
                    ) : (
                      <span className="text-slate-600 text-[10px]">-</span>
                    )}
                  </td>

                  {/* Action Buttons */}
                  <td className="p-3.5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      
                      {/* Cetak Surat Tugas Kunjungan Rumah */}
                      {onPrintSuratTugasHomeVisit && (
                        <button
                          onClick={() => onPrintSuratTugasHomeVisit(item)}
                          className="p-1.5 bg-amber-900/60 hover:bg-amber-800/80 text-amber-300 rounded-lg border border-amber-700/60 transition-colors"
                          title="Cetak Surat Tugas Kunjungan Rumah"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Cetak Surat Kesediaan Ortu */}
                      {onPrintSuratKesediaanOrtu && (
                        <button
                          onClick={() => onPrintSuratKesediaanOrtu(item)}
                          className="p-1.5 bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-300 rounded-lg border border-emerald-700/60 transition-colors"
                          title="Cetak Surat Kesediaan Menerima Kunjungan Orang Tua"
                        >
                          <FileCheck className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Download Word Report */}
                      <button
                        onClick={() => downloadLaporanHomeVisitWord(item)}
                        className="p-1.5 bg-blue-900/60 hover:bg-blue-800/80 text-blue-300 rounded-lg border border-blue-700/60 transition-colors"
                        title="Unduh Laporan Home Visit Word (.doc)"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      {/* Download Word Surat Kesediaan Ortu */}
                      <button
                        onClick={() => downloadSuratKesediaanOrtuWord(item)}
                        className="p-1.5 bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-300 rounded-lg border border-emerald-700/60 transition-colors"
                        title="Unduh Surat Kesediaan Ortu Word (.doc)"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      {/* Download Word Surat Tugas */}
                      <button
                        onClick={() => downloadSuratTugasHomeVisitWord(item)}
                        className="p-1.5 bg-purple-900/60 hover:bg-purple-800/80 text-purple-300 rounded-lg border border-purple-700/60 transition-colors"
                        title="Unduh Surat Tugas Home Visit Word (.doc)"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => onEdit(item)}
                        className="p-1.5 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 rounded-lg border border-amber-400/30 transition-colors"
                        title="Edit Data Ini"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={async () => {
                          if (window.confirm(`Hapus laporan home visit siswa "${item.nama_siswa}"?`)) {
                            await onDelete(item.id);
                          }
                        }}
                        className="p-1.5 bg-red-900/50 hover:bg-red-600 text-red-300 hover:text-white rounded-lg border border-red-700/60 transition-colors"
                        title="Hapus Data Ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* CARDS / GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-slate-950/90 rounded-2xl p-4 border border-slate-800 hover:border-amber-500/50 shadow-xl space-y-3 flex flex-col justify-between transition-all"
            >
              <div className="space-y-3">
                
                {/* Header */}
                <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                  <span className="bg-purple-500/20 text-purple-300 border border-purple-400/30 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                    Kelas {item.kelas}
                  </span>
                  <span className="text-[11px] text-amber-300 font-mono font-bold">
                    {item.hari}, {item.tanggal} ({item.waktu})
                  </span>
                </div>

                {/* Identity */}
                <div>
                  <h4 className="text-base font-black text-white">{item.nama_siswa}</h4>
                  <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Ortu: <strong>{item.nama_orang_tua || '-'}</strong> ({item.pekerjaan_orang_tua || '-'})</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                    <span>{item.alamat || '-'}</span>
                  </p>
                </div>

                {/* Perihal & Permasalahan */}
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1.5">
                  <p className="text-xs font-bold text-amber-300">{item.perihal_home_visit}</p>
                  {item.uraian_permasalahan && (
                    <p className="text-[11px] text-slate-300 line-clamp-3 leading-relaxed">
                      {item.uraian_permasalahan}
                    </p>
                  )}
                </div>

                {/* Tindak lanjut */}
                {item.tindak_lanjut && (
                  <div className="bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-800/30">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase block mb-0.5">Tindak Lanjut:</span>
                    <p className="text-[11px] text-slate-200 line-clamp-3">{item.tindak_lanjut}</p>
                  </div>
                )}

              </div>

              {/* Footer Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                {item.link_foto_kegiatan ? (
                  <a
                    href={item.link_foto_kegiatan}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-amber-300 hover:underline flex items-center gap-1 font-bold"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Foto Bukti</span>
                  </a>
                ) : (
                  <span className="text-slate-600 text-[10px]">-</span>
                )}

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => downloadLaporanHomeVisitWord(item)}
                    className="p-1.5 bg-blue-900/60 hover:bg-blue-800 text-blue-300 text-xs font-bold rounded-lg border border-blue-700/60 transition-colors flex items-center gap-1"
                    title="Download Word Report"
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>Word</span>
                  </button>

                  <button
                    onClick={() => onEdit(item)}
                    className="p-1.5 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 rounded-lg transition-colors border border-amber-400/30"
                    title="Edit"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={async () => {
                      if (window.confirm(`Hapus laporan home visit siswa "${item.nama_siswa}"?`)) {
                        await onDelete(item.id);
                      }
                    }}
                    className="p-1.5 bg-red-900/50 hover:bg-red-600 text-red-300 hover:text-white rounded-lg transition-colors border border-red-700/60"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
