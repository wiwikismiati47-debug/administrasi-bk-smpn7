import React, { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { AgendaKerja } from '../types';
import {
  Search,
  Filter,
  Pencil,
  Trash2,
  ExternalLink,
  Image as ImageIcon,
  Calendar,
  Clock,
  Users,
  FileSpreadsheet,
  Printer,
  Eye,
  X,
  AlertCircle,
  Database
} from 'lucide-react';

interface TabelAgendaProps {
  items: AgendaKerja[];
  onEdit: (item: AgendaKerja) => void;
  onDelete: (id: string) => Promise<void>;
  onPrint: () => void;
  isSupabase: boolean;
  isLoading: boolean;
}

export const TabelAgenda: React.FC<TabelAgendaProps> = ({
  items,
  onEdit,
  onDelete,
  onPrint,
  isSupabase,
  isLoading,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('SEMUA');
  const [selectedYear, setSelectedYear] = useState('SEMUA');
  const [previewItem, setPreviewItem] = useState<AgendaKerja | null>(null);

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchSearch =
        !searchTerm ||
        item.uraian_kegiatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sasaran.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.hari.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.keterangan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tanggal.includes(searchTerm);

      const matchMonth = selectedMonth === 'SEMUA' || item.bulan === selectedMonth;
      const matchYear = selectedYear === 'SEMUA' || item.tahun === selectedYear;

      return matchSearch && matchMonth && matchYear;
    });
  }, [items, searchTerm, selectedMonth, selectedYear]);

  // Unique list of Months and Years for dropdown
  const uniqueMonths = useMemo(() => {
    const setM = new Set(items.map((i) => i.bulan));
    return Array.from(setM).filter(Boolean);
  }, [items]);

  const uniqueYears = useMemo(() => {
    const setY = new Set(items.map((i) => i.tahun));
    return Array.from(setY).filter(Boolean);
  }, [items]);

  // Export to Excel Function with Letterhead (Kop)
  const exportToExcel = () => {
    if (filteredItems.length === 0) {
      alert('Tidak ada data untuk diexport.');
      return;
    }

    const kop = [
      ["PEMERINTAH KOTA PASURUAN"],
      ["DINAS PENDIDIKAN DAN KEBUDAYAAN"],
      ["🏫 SMP NEGERI 7 PASURUAN (SPANJU)"],
      ["SABDA BK SPANJU - SISTEM ADMINISTRASI BK DIGITAL DAN AKUNTABEL"],
      ["Jl. Sunan Ampel No. 9, Pasuruan, Jawa Timur (67116) | Telp: (0343) 421271"],
      ["REKAPITULASI LAPORAN AGENDA KERJA HARIAN BIMBINGAN KONSELING (BK)"],
      ["------------------------------------------------------------------------------------------------------------------------------------"],
      [""], // Spacer row
    ];

    const headers = [
      "NO",
      "HARI / TANGGAL",
      "WAKTU",
      "URAIAN KEGIATAN",
      "SASARAN KEGIATAN",
      "KETERANGAN / STATUS"
    ];

    const rows = filteredItems.map((item, idx) => {
      const isSameDateAsPrevious = idx > 0 && 
        filteredItems[idx - 1].tanggal === item.tanggal &&
        filteredItems[idx - 1].bulan === item.bulan &&
        filteredItems[idx - 1].tahun === item.tahun &&
        filteredItems[idx - 1].hari === item.hari;

      return [
        idx + 1,
        isSameDateAsPrevious ? '〃' : `${item.hari}, ${item.tanggal} ${item.bulan} ${item.tahun}`,
        item.waktu || '-',
        item.uraian_kegiatan || '',
        item.sasaran || '',
        item.keterangan || 'Terlaksana'
      ];
    });

    const wsData = [...kop, headers, ...rows];
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Apply merges for the Kop (columns A to F)
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }, // Row 1
      { s: { r: 1, c: 0 }, e: { r: 1, c: 5 } }, // Row 2
      { s: { r: 2, c: 0 }, e: { r: 2, c: 5 } }, // Row 3
      { s: { r: 3, c: 0 }, e: { r: 3, c: 5 } }, // Row 4
      { s: { r: 4, c: 0 }, e: { r: 4, c: 5 } }, // Row 5
      { s: { r: 5, c: 0 }, e: { r: 5, c: 5 } }, // Row 6
      { s: { r: 6, c: 0 }, e: { r: 6, c: 5 } }, // Row 7
    ];

    // Set custom column widths for Excel layout
    ws['!cols'] = [
      { wch: 6 },   // NO
      { wch: 28 },  // HARI / TANGGAL
      { wch: 22 },  // WAKTU
      { wch: 55 },  // URAIAN KEGIATAN
      { wch: 28 },  // SASARAN
      { wch: 22 },  // KETERANGAN
    ];

    // Create workbook and append worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Agenda Kerja BK");

    // Write file
    XLSX.writeFile(wb, `Agenda_Kerja_BK_SMPN7_Pasuruan_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const handleDeleteConfirm = async (id: string, uraian: string) => {
    if (window.confirm(`Yakin ingin menghapus agenda kegiatan:\n"${uraian}"?`)) {
      await onDelete(id);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded uppercase shadow-sm">
              DAFTAR ADMINISTRASI
            </span>
            <span className="bg-white/20 text-white text-xs px-2.5 py-0.5 rounded-full font-bold">
              {filteredItems.length} Data Agenda
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">
            A. AGENDA KERJA BK SMPN 7 PASURAN
          </h3>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={exportToExcel}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg shadow transition-all cursor-pointer"
            title="Export data ke file Excel (.xlsx)"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Excel (.xlsx)</span>
          </button>

          <button
            onClick={onPrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-700 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg shadow transition-all"
            title="Cetak format cetak resmi Administrasi BK"
          >
            <Printer className="w-4 h-4 text-amber-300" />
            <span>Cetak Cetakan Resmi</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {/* Search Input */}
        <div className="relative md:col-span-2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari uraian kegiatan, sasaran, hari..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Month Filter */}
        <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full text-xs font-medium bg-transparent focus:outline-none"
          >
            <option value="SEMUA">Semua Bulan</option>
            {uniqueMonths.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Year Filter */}
        <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5">
          <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full text-xs font-medium bg-transparent focus:outline-none"
          >
            <option value="SEMUA">Semua Tahun</option>
            {uniqueYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-medium">Memuat data Agenda Kerja BK...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">Belum Ada Data Agenda Kerja BK</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Silakan gunakan form input di sebelah kiri atau atas untuk menambahkan agenda kegiatan Bimbingan Konseling baru.
            </p>
          </div>
        ) : (
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold border-b-2 border-slate-300 text-[11px] uppercase tracking-wider">
                <th className="p-3 text-center w-12 border-r border-slate-200">NO</th>
                <th className="p-3 border-r border-slate-200 min-w-[140px]">HARI / TANGGAL</th>
                <th className="p-3 border-r border-slate-200 min-w-[100px]">WAKTU</th>
                <th className="p-3 border-r border-slate-200 min-w-[220px]">URAIAN KEGIATAN</th>
                <th className="p-3 border-r border-slate-200 min-w-[140px]">SASARAN</th>
                <th className="p-3 border-r border-slate-200 text-center min-w-[110px]">FOTO KEGIATAN</th>
                <th className="p-3 border-r border-slate-200 min-w-[130px]">KETERANGAN</th>
                <th className="p-3 text-center min-w-[100px]">AKSI / EDIT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredItems.map((item, index) => {
                const isSameDateAsPrevious = index > 0 && 
                  filteredItems[index - 1].tanggal === item.tanggal &&
                  filteredItems[index - 1].bulan === item.bulan &&
                  filteredItems[index - 1].tahun === item.tahun &&
                  filteredItems[index - 1].hari === item.hari;

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-blue-50/60 transition-colors group text-slate-800"
                  >
                    {/* NO */}
                    <td className="p-3 text-center font-bold text-slate-600 border-r border-slate-200 bg-slate-50/50">
                      {index + 1}
                    </td>

                    {/* HARI / TANGGAL / BULAN / TAHUN */}
                    <td className="p-3 border-r border-slate-200 font-medium">
                      {!isSameDateAsPrevious ? (
                        <>
                          <div className="font-bold text-blue-900">{item.hari}</div>
                          <div className="text-slate-600 text-xs flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{item.tanggal}</span>
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {item.bulan} {item.tahun}
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full py-1.5 select-none">
                          <span className="text-slate-300 font-extrabold text-base leading-none">〃</span>
                          <span className="text-[9px] text-slate-400/80 font-bold italic mt-0.5">(s.d.a)</span>
                        </div>
                      )}
                    </td>

                  {/* WAKTU */}
                  <td className="p-3 border-r border-slate-200 text-slate-700">
                    <div className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 px-2 py-1 rounded text-xs font-semibold">
                      <Clock className="w-3 h-3 text-blue-600" />
                      <span>{item.waktu || '-'}</span>
                    </div>
                  </td>

                  {/* URAIAN KEGIATAN */}
                  <td className="p-3 border-r border-slate-200 font-medium text-slate-900 leading-relaxed">
                    {item.uraian_kegiatan}
                  </td>

                  {/* SASARAN */}
                  <td className="p-3 border-r border-slate-200">
                    <div className="inline-flex items-center gap-1 text-slate-800 font-semibold text-xs bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-md">
                      <Users className="w-3 h-3 text-amber-700 shrink-0" />
                      <span>{item.sasaran}</span>
                    </div>
                  </td>

                  {/* LINK FOTO KEGIATAN */}
                  <td className="p-3 border-r border-slate-200 text-center">
                    {item.link_foto_kegiatan ? (
                      <div className="flex flex-col items-center gap-1">
                        <button
                          onClick={() => setPreviewItem(item)}
                          className="relative w-14 h-12 rounded border border-slate-300 overflow-hidden group/img hover:ring-2 hover:ring-blue-500 shadow-sm"
                          title="Klik untuk lihat foto"
                        >
                          <img
                            src={item.link_foto_kegiatan}
                            alt="Foto kegiatan"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center text-white text-[10px] font-bold">
                            Lihat
                          </div>
                        </button>
                        {item.link_foto_kegiatan.startsWith('http') && (
                          <a
                            href={item.link_foto_kegiatan}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-0.5 text-[10px] text-blue-600 hover:underline font-medium"
                          >
                            <span>Link Buka</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs italic">-</span>
                    )}
                  </td>

                  {/* KETERANGAN */}
                  <td className="p-3 border-r border-slate-200 text-xs text-slate-700">
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-medium inline-block">
                      {item.keterangan || 'Terlaksana'}
                    </span>
                  </td>

                  {/* AKSI / EDIT */}
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onEdit(item)}
                        className="p-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg shadow-sm transition-all"
                        title="Edit / Update Data Terbaru"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteConfirm(item.id, item.uraian_kegiatan)}
                        className="p-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg shadow-sm transition-all"
                        title="Hapus Agenda Ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          </table>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
        <div className="flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-blue-600" />
          <span>
            Penyimpanan: <strong>{isSupabase ? 'Supabase Cloud Database' : 'Penyimpanan Lokal Browser'}</strong>
          </span>
        </div>
        <div>
          Menampilkan <strong>{filteredItems.length}</strong> dari total <strong>{items.length}</strong> entri
        </div>
      </div>

      {/* Modal Preview Foto */}
      {previewItem && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setPreviewItem(null)}
              className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-200 pb-3">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                Foto Dokumentasi Kegiatan BK
              </span>
              <h4 className="text-lg font-bold text-slate-900 leading-snug">
                {previewItem.uraian_kegiatan}
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                {previewItem.hari}, {previewItem.tanggal} • Sasaran: {previewItem.sasaran}
              </p>
            </div>

            <div className="bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center max-h-[450px]">
              <img
                src={previewItem.link_foto_kegiatan}
                alt="Foto Dokumentasi"
                className="max-h-[450px] w-auto object-contain"
              />
            </div>

            {previewItem.link_foto_kegiatan.startsWith('http') && (
              <div className="text-right pt-2">
                <a
                  href={previewItem.link_foto_kegiatan}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:underline"
                >
                  <span>Buka Gambar Ukuran Penuh</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
