import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { UndanganOrangTua } from '../types';
import {
  downloadSuratUndanganWord,
  downloadLaporanKonsultasiWord,
  downloadBulkSuratUndanganWord,
  downloadBulkLaporanKonsultasiWord
} from '../lib/wordExporter';
import {
  Search,
  Filter,
  Download,
  Printer,
  Pencil,
  Trash2,
  ExternalLink,
  Users,
  Calendar,
  GraduationCap,
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
  Mail,
  FileCheck
} from 'lucide-react';

interface TabelUndanganProps {
  items: UndanganOrangTua[];
  onEdit: (item: UndanganOrangTua) => void;
  onDelete: (id: string) => Promise<void>;
  onPrint: () => void;
  onPrintSuratUndangan?: (item: UndanganOrangTua) => void;
  onPrintLaporanKonsultasi?: (item: UndanganOrangTua) => void;
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
  '7-A', '7-B', '7-C', '7-D', '7-E', '7-F', '7-G', '7-H',
  '8-A', '8-B', '8-C', '8-D', '8-E', '8-F', '8-G', '8-H',
  '9-A', '9-B', '9-C', '9-D', '9-E', '9-F', '9-G', '9-H'
];

export const TabelUndangan: React.FC<TabelUndanganProps> = ({
  items,
  onEdit,
  onDelete,
  onPrint,
  onPrintSuratUndangan,
  onPrintLaporanKonsultasi,
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
      item.perihal_undangan.toLowerCase().includes(search.toLowerCase()) ||
      item.uraian_permasalahan.toLowerCase().includes(search.toLowerCase()) ||
      item.kelas.toLowerCase().includes(search.toLowerCase());

    const matchesKelas = selectedKelas === 'Semua Kelas' || item.kelas === selectedKelas;
    const matchesBulan = selectedBulan === 'Semua Bulan' || item.bulan === selectedBulan;
    const matchesTahun = selectedTahun === 'Semua Tahun' || item.tahun === selectedTahun;

    return matchesSearch && matchesKelas && matchesBulan && matchesTahun;
  });

  // Get unique years in data
  const yearsInSeries = Array.from(new Set(items.map((i) => i.tahun))).sort().reverse();

  // Export to Excel function with Letterhead (Kop)
  const handleExportExcel = () => {
    if (filtered.length === 0) {
      alert('Tidak ada data undangan untuk diexport.');
      return;
    }

    const kop = [
      ["PEMERINTAH KOTA PASURUAN"],
      ["DINAS PENDIDIKAN DAN KEBUDAYAAN"],
      ["🏫 SMP NEGERI 7 PASURUAN (SPANJU)"],
      ["SABDA BK SPANJU - SISTEM ADMINISTRASI BK DIGITAL DAN AKUNTABEL"],
      ["Jl. Sunan Ampel No. 9, Pasuruan, Jawa Timur (67116) | Telp: (0343) 421271"],
      ["DAFTAR REKAPITULASI UNDANGAN ORANG TUA / WALI SISWA (BK)"],
      ["------------------------------------------------------------------------------------------------------------------------------------"],
      [""], // Spacer row
    ];

    const headers = [
      "NO",
      "HARI / TANGGAL",
      "WAKTU",
      "KELAS",
      "NAMA SISWA",
      "NAMA ORANG TUA",
      "PEKERJAAN ORTU",
      "ALAMAT",
      "PERIHAL UNDANGAN",
      "URAIAN MASALAH",
      "TINDAK LANJUT",
      "KETERANGAN / STATUS"
    ];

    const rows = filtered.map((item, idx) => [
      idx + 1,
      `${item.hari}, ${item.tanggal} ${item.bulan} ${item.tahun}`,
      item.waktu || '-',
      item.kelas || '',
      item.nama_siswa || '',
      item.nama_orang_tua || '',
      item.pekerjaan_orang_tua || '',
      item.alamat || '',
      item.perihal_undangan || '',
      item.uraian_permasalahan || '',
      item.tindak_lanjut || '',
      item.keterangan || ''
    ]);

    const wsData = [...kop, headers, ...rows];
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Apply merges for the Kop (columns A to L, 12 columns total, index 0 to 11)
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 11 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 11 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: 11 } },
      { s: { r: 3, c: 0 }, e: { r: 3, c: 11 } },
      { s: { r: 4, c: 0 }, e: { r: 4, c: 11 } },
      { s: { r: 5, c: 0 }, e: { r: 5, c: 11 } },
      { s: { r: 6, c: 0 }, e: { r: 6, c: 11 } },
    ];

    // Set custom column widths for pristine Excel layout
    ws['!cols'] = [
      { wch: 6 },   // NO
      { wch: 28 },  // HARI / TANGGAL
      { wch: 18 },  // WAKTU
      { wch: 12 },  // KELAS
      { wch: 25 },  // NAMA SISWA
      { wch: 25 },  // NAMA ORANG TUA
      { wch: 20 },  // PEKERJAAN ORTU
      { wch: 30 },  // ALAMAT
      { wch: 30 },  // PERIHAL UNDANGAN
      { wch: 35 },  // URAIAN MASALAH
      { wch: 35 },  // TINDAK LANJUT
      { wch: 18 },  // KETERANGAN / STATUS
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Daftar Undangan BK");

    XLSX.writeFile(wb, `Daftar_Undangan_Orang_Tua_BK_SMPN7_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div className="bg-white text-slate-800 rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xl shadow-slate-200/50 space-y-6">
      
      {/* Table Header Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-purple-100 text-purple-800 border border-purple-200 text-[10px] font-black px-2 py-0.5 rounded uppercase">
              TABEL DATA B
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              SMPN 7 Pasuruan
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
            DAFTAR UNDANGAN ORANG TUA SISWA
          </h3>
          <p className="text-xs text-slate-500">
            Total {items.length} Data Terdaftar • {filtered.length} Ditampilkan
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* View Mode Toggle */}
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Tampilan Tabel Detail"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'cards' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Tampilan Kartu 3D"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>

          {/* Export Word Surat Undangan */}
          <button
            onClick={() => downloadBulkSuratUndanganWord(filtered)}
            className="px-3.5 py-2 bg-blue-900/80 hover:bg-blue-800 text-blue-100 text-xs font-bold rounded-xl border border-blue-700 transition-colors flex items-center gap-1.5"
            title="Download Word (.doc) Surat Undangan Orang Tua Siswa"
          >
            <Mail className="w-3.5 h-3.5 text-blue-300" />
            <span>Word Surat</span>
          </button>

          {/* Export Word Laporan Konsultasi */}
          <button
            onClick={() => downloadBulkLaporanKonsultasiWord(filtered)}
            className="px-3.5 py-2 bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 text-xs font-bold rounded-xl border border-emerald-700 transition-colors flex items-center gap-1.5"
            title="Download Word (.doc) Laporan Konsultasi Orang Tua"
          >
            <FileCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>Word Laporan</span>
          </button>

          {/* Export XLSX */}
          <button
            onClick={handleExportExcel}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Download file Excel (.xlsx) data undangan"
          >
            <Download className="w-3.5 h-3.5 text-amber-300" />
            <span>Export Excel (.xlsx)</span>
          </button>

          {/* Cetak Print */}
          <button
            onClick={onPrint}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center gap-1.5"
            title="Cetak Laporan Resmi Undangan Orang Tua Siswa"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Laporan</span>
          </button>

        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
        
        {/* Search */}
        <div className="relative sm:col-span-2 lg:col-span-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari siswa, ortu, perihal..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 font-medium"
          />
        </div>

        {/* Filter Kelas */}
        <div>
          <select
            value={selectedKelas}
            onChange={(e) => setSelectedKelas(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white font-semibold"
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
            className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white font-semibold"
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
            className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white font-semibold"
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

      {/* Loading indicator */}
      {isLoading && (
        <div className="text-center p-8 text-purple-400 space-y-2">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold">Memuat data undangan dari database...</p>
        </div>
      )}

      {/* Main Data View */}
      {!isLoading && filtered.length === 0 ? (
        <div className="text-center p-12 bg-slate-950/40 rounded-2xl border border-dashed border-slate-800 space-y-3">
          <Users className="w-12 h-12 text-slate-600 mx-auto" />
          <h4 className="text-sm font-extrabold text-slate-300">Belum Ada Data Undangan Orang Tua</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Gunakan tab <strong>Input Form</strong> untuk menambahkan data undangan orang tua siswa baru.
          </p>
        </div>
      ) : viewMode === 'table' ? (
        
        /* Table View */
        <div className="overflow-x-auto rounded-2xl border border-slate-800 shadow-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gradient-to-r from-slate-950 via-purple-950 to-slate-950 text-purple-200 border-b border-slate-800 font-extrabold uppercase tracking-wider">
                <th className="py-3.5 px-3 text-center w-10">No</th>
                <th className="py-3.5 px-3 w-36">Waktu / Tanggal</th>
                <th className="py-3.5 px-4 w-48">Kelas & Siswa</th>
                <th className="py-3.5 px-4 w-52">Orang Tua / Wali</th>
                <th className="py-3.5 px-4">Perihal & Permasalahan</th>
                <th className="py-3.5 px-4 w-44">Tindak Lanjut</th>
                <th className="py-3.5 px-3 text-center w-20">Foto</th>
                <th className="py-3.5 px-3 text-center w-20">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-950/60 font-medium">
              {filtered.map((item, index) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  
                  {/* No */}
                  <td className="py-3 px-3 text-center font-bold text-slate-400">
                    {index + 1}
                  </td>

                  {/* Waktu / Tanggal */}
                  <td className="py-3 px-3">
                    <span className="font-bold text-white block">{item.hari}, {item.tanggal}</span>
                    <span className="text-[11px] text-purple-300 font-mono block mt-0.5">{item.waktu}</span>
                  </td>

                  {/* Kelas & Siswa */}
                  <td className="py-3 px-4">
                    <span className="inline-block bg-purple-500/20 text-purple-300 border border-purple-400/30 text-[10px] font-black px-1.5 py-0.2 rounded mb-1">
                      Kelas {item.kelas}
                    </span>
                    <h4 className="font-extrabold text-white text-xs">{item.nama_siswa}</h4>
                  </td>

                  {/* Orang Tua */}
                  <td className="py-3 px-4">
                    <p className="font-bold text-amber-300">{item.nama_orang_tua}</p>
                    {item.pekerjaan_orang_tua && (
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Briefcase className="w-3 h-3 text-slate-500 shrink-0" />
                        <span className="truncate">{item.pekerjaan_orang_tua}</span>
                      </p>
                    )}
                    {item.alamat && (
                      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                        {item.alamat}
                      </p>
                    )}
                  </td>

                  {/* Perihal & Permasalahan */}
                  <td className="py-3 px-4 space-y-1">
                    <p className="font-bold text-white text-xs leading-snug">{item.perihal_undangan}</p>
                    {item.uraian_permasalahan && (
                      <p className="text-[11px] text-slate-300 line-clamp-2 bg-slate-900/80 p-1.5 rounded-lg border border-slate-800">
                        {item.uraian_permasalahan}
                      </p>
                    )}
                  </td>

                  {/* Tindak Lanjut */}
                  <td className="py-3 px-4">
                    {item.tindak_lanjut ? (
                      <p className="text-[11px] text-slate-200 line-clamp-3 font-normal">
                        {item.tindak_lanjut}
                      </p>
                    ) : (
                      <span className="text-[10px] text-slate-500 italic">- Belum diisi -</span>
                    )}
                  </td>

                  {/* Foto */}
                  <td className="py-3 px-3 text-center">
                    {item.link_foto_kegiatan ? (
                      <a
                        href={item.link_foto_kegiatan}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 bg-slate-800 hover:bg-purple-900 text-purple-300 rounded-lg inline-flex items-center gap-1 text-[10px] font-bold border border-slate-700 transition-colors"
                        title="Lihat Foto Kegiatan"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Foto</span>
                      </a>
                    ) : (
                      <span className="text-slate-600 text-[10px]">-</span>
                    )}
                  </td>

                  {/* Aksi */}
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5 flex-wrap">
                      <button
                        onClick={() => downloadSuratUndanganWord(item)}
                        className="p-1.5 bg-blue-950 hover:bg-blue-900 text-blue-300 rounded-lg border border-blue-800 transition-colors"
                        title="Download Word (.doc) Surat Undangan"
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => downloadLaporanKonsultasiWord(item)}
                        className="p-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 rounded-lg border border-emerald-800 transition-colors"
                        title="Download Word (.doc) Laporan Konsultasi"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                      </button>

                      {onPrintSuratUndangan && (
                        <button
                          onClick={() => onPrintSuratUndangan(item)}
                          className="p-1.5 bg-purple-950 hover:bg-purple-900 text-purple-300 rounded-lg border border-purple-800 transition-colors"
                          title="Cetak Surat Undangan"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => onEdit(item)}
                        className="p-1.5 bg-slate-800 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 rounded-lg transition-colors"
                        title="Edit Data Undangan Ini"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={async () => {
                          if (window.confirm(`Yakin hapus data undangan untuk siswa "${item.nama_siswa}"?`)) {
                            await onDelete(item.id);
                          }
                        }}
                        className="p-1.5 bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 rounded-lg transition-colors"
                        title="Hapus Data"
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

        /* Cards Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 relative group hover:border-purple-500/50 transition-all"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="bg-purple-500/20 text-purple-300 border border-purple-400/30 text-[10px] font-extrabold px-2 py-0.5 rounded">
                  Kelas {item.kelas}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {item.hari}, {item.tanggal}
                </span>
              </div>

              <div>
                <h4 className="font-extrabold text-white text-sm">{item.nama_siswa}</h4>
                <p className="text-xs text-amber-300 font-semibold mt-0.5">
                  Ortu: {item.nama_orang_tua} ({item.pekerjaan_orang_tua || '-'})
                </p>
              </div>

              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-xs space-y-1">
                <p className="font-bold text-slate-200">{item.perihal_undangan}</p>
                {item.uraian_permasalahan && (
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {item.uraian_permasalahan}
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                {item.link_foto_kegiatan ? (
                  <a
                    href={item.link_foto_kegiatan}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-purple-400 hover:underline flex items-center gap-1 font-bold"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Foto Dokumentasi</span>
                  </a>
                ) : (
                  <span className="text-[10px] text-slate-600">Tanpa Foto</span>
                )}

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => downloadSuratUndanganWord(item)}
                    className="p-1.5 bg-blue-950 hover:bg-blue-900 text-blue-300 rounded-lg border border-blue-800 transition-colors"
                    title="Download Word Surat Undangan"
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => downloadLaporanKonsultasiWord(item)}
                    className="p-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 rounded-lg border border-emerald-800 transition-colors"
                    title="Download Word Laporan Konsultasi"
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onEdit(item)}
                    className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-300 rounded-lg transition-colors"
                    title="Edit Data"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={async () => {
                      if (window.confirm(`Yakin hapus data undangan "${item.nama_siswa}"?`)) {
                        await onDelete(item.id);
                      }
                    }}
                    className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-red-400 rounded-lg transition-colors"
                    title="Hapus Data"
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
