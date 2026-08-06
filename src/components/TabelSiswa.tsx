import React, { useState, useMemo } from 'react';
import { Siswa } from '../types';
import {
  Search,
  Filter,
  Pencil,
  Trash2,
  FileSpreadsheet,
  Upload,
  User,
  Hash,
  School,
  Smile,
  CheckCircle2,
  AlertCircle,
  Database,
  X,
  Info
} from 'lucide-react';

interface TabelSiswaProps {
  items: Siswa[];
  onEdit: (item: Siswa) => void;
  onDelete: (id: string) => Promise<void>;
  onBulkImport: (students: Omit<Siswa, 'id' | 'created_at' | 'updated_at'>[]) => Promise<void>;
  isSupabase: boolean;
  isLoading: boolean;
}

const PRESET_KELAS = [
  'SEMUA',
  'VII A', 'VII B', 'VII C', 'VII D', 'VII E', 'VII F', 'VII G', 'VII H',
  'VIII A', 'VIII B', 'VIII C', 'VIII D', 'VIII E', 'VIII F', 'VIII G', 'VIII H',
  'IX A', 'IX B', 'IX C', 'IX D', 'IX E', 'IX F', 'IX G', 'IX H'
];

export const TabelSiswa: React.FC<TabelSiswaProps> = ({
  items,
  onEdit,
  onDelete,
  onBulkImport,
  isSupabase,
  isLoading,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKelas, setSelectedKelas] = useState('SEMUA');
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchSearch =
        !searchTerm ||
        item.nama_siswa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nis.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.kelas.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.keterangan || '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchKelas = selectedKelas === 'SEMUA' || item.kelas === selectedKelas;

      return matchSearch && matchKelas;
    });
  }, [items, searchTerm, selectedKelas]);

  // Export to CSV Function
  const exportToCSV = () => {
    if (filteredItems.length === 0) {
      alert('Tidak ada data untuk diexport.');
      return;
    }

    const headers = ['No', 'Nama Siswa', 'Kelas', 'NIS', 'Jenis Kelamin', 'Keterangan'];
    const rows = filteredItems.map((item, idx) => [
      idx + 1,
      `"${(item.nama_siswa || '').replace(/"/g, '""')}"`,
      `"${item.kelas || ''}"`,
      `"${item.nis || ''}"`,
      `"${item.jenis_kelamin || ''}"`,
      `"${(item.keterangan || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `data_siswa_bk_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Parse copy-pasted spreadsheet (tab-separated) or CSV data
  const handleProcessBulkImport = async () => {
    setImportStatus(null);
    if (!bulkText.trim()) {
      setImportStatus({ type: 'error', message: 'Silakan tempel teks data siswa terlebih dahulu.' });
      return;
    }

    setIsImporting(true);
    try {
      const lines = bulkText.split('\n').map(l => l.trim()).filter(Boolean);
      const parsedStudents: Omit<Siswa, 'id' | 'created_at' | 'updated_at'>[] = [];
      
      let headerIndices = { nama: -1, kelas: -1, nis: -1, jk: -1, ket: -1 };
      let hasHeader = false;

      // Detect if first line is a header row
      const firstLineParts = lines[0].split(/[\t,;]/).map(p => p.trim().toLowerCase());
      
      const containsHeaderKeywords = firstLineParts.some(
        part => part.includes('nama') || part.includes('siswa') || part.includes('nis') || part.includes('kelas') || part.includes('kelamin')
      );

      if (containsHeaderKeywords) {
        hasHeader = true;
        firstLineParts.forEach((part, index) => {
          if (part.includes('nama') || part.includes('siswa')) headerIndices.nama = index;
          else if (part.includes('kelas')) headerIndices.kelas = index;
          else if (part.includes('nis')) headerIndices.nis = index;
          else if (part.includes('kelamin') || part.includes('jenis') || part.includes('jk')) headerIndices.jk = index;
          else if (part.includes('keterangan') || part.includes('catatan') || part.includes('ket')) headerIndices.ket = index;
        });
      }

      const startIdx = hasHeader ? 1 : 0;

      for (let i = startIdx; i < lines.length; i++) {
        // split by tab, comma, or semicolon
        const cols = lines[i].split(/[\t,;]/).map(col => col.trim().replace(/^["']|["']$/g, ''));
        
        if (cols.length < 3) continue; // Skip invalid lines

        let nama_siswa = '';
        let kelas = '';
        let nis = '';
        let jenis_kelamin = 'Laki-laki';
        let keterangan = 'Aktif';

        if (hasHeader) {
          if (headerIndices.nama !== -1) nama_siswa = cols[headerIndices.nama] || '';
          if (headerIndices.kelas !== -1) kelas = cols[headerIndices.kelas] || '';
          if (headerIndices.nis !== -1) nis = cols[headerIndices.nis] || '';
          if (headerIndices.jk !== -1) jenis_kelamin = cols[headerIndices.jk] || '';
          if (headerIndices.ket !== -1) keterangan = cols[headerIndices.ket] || '';
        } else {
          // Default fallbacks by column index if no headers:
          // Col 0: Nama, Col 1: Kelas, Col 2: NIS, Col 3: Jenis Kelamin, Col 4: Keterangan
          nama_siswa = cols[0] || '';
          kelas = cols[1] || '';
          nis = cols[2] || '';
          jenis_kelamin = cols[3] || 'Laki-laki';
          keterangan = cols[4] || 'Aktif';
        }

        // Clean up and validate
        if (!nama_siswa || !nis) continue;

        // Clean gender
        if (jenis_kelamin.toLowerCase().startsWith('p') || jenis_kelamin.toLowerCase().includes('wanita') || jenis_kelamin.toLowerCase().includes('perempuan')) {
          jenis_kelamin = 'Perempuan';
        } else {
          jenis_kelamin = 'Laki-laki';
        }

        // Format Kelas slightly to match presets
        let matchedKelas = kelas.toUpperCase();
        if (!matchedKelas.includes(' ') && matchedKelas.length >= 4) {
          // try to split e.g., VIIIA -> VIII A
          const match = matchedKelas.match(/^(VII|VIII|IX|7|8|9)([A-H])$/i);
          if (match) {
            let grade = match[1];
            if (grade === '7') grade = 'VII';
            else if (grade === '8') grade = 'VIII';
            else if (grade === '9') grade = 'IX';
            matchedKelas = `${grade} ${match[2]}`;
          }
        }

        parsedStudents.push({
          nama_siswa,
          kelas: matchedKelas || 'VIII A',
          nis,
          jenis_kelamin,
          keterangan
        });
      }

      if (parsedStudents.length === 0) {
        throw new Error('Format baris tidak valid. Pastikan Anda memiliki kolom Nama, Kelas, dan NIS.');
      }

      await onBulkImport(parsedStudents);
      setImportStatus({
        type: 'success',
        message: `Berhasil mengimpor/memperbarui ${parsedStudents.length} data siswa!`
      });
      setBulkText('');
      setTimeout(() => {
        setShowBulkImport(false);
        setImportStatus(null);
      }, 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Kesalahan parsing data.';
      setImportStatus({ type: 'error', message: msg });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="w-full space-y-4" id="tabel-siswa-container">
      {/* Table Header and Bulk Upload Option */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-slate-800 text-base sm:text-lg flex items-center gap-2">
            <School className="w-5 h-5 text-cyan-600" />
            <span>Database Siswa Bimbingan Konseling</span>
          </h4>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Total terdaftar: <strong>{items.length} siswa</strong> {isSupabase ? '(Cloud Supabase)' : '(Penyimpanan Lokal)'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Toggle Bulk Import Area */}
          <button
            onClick={() => {
              setShowBulkImport(!showBulkImport);
              setImportStatus(null);
            }}
            className={`px-4 py-2 text-sm font-bold rounded-lg flex items-center gap-2 border transition-all cursor-pointer ${
              showBulkImport
                ? 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100'
                : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>{showBulkImport ? 'Tutup Panel Import' : 'Excel/CSV Copypaste'}</span>
          </button>

          {/* Export CSV Button */}
          <button
            onClick={exportToCSV}
            disabled={filteredItems.length === 0}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-lg flex items-center gap-2 border border-emerald-700 transition-all cursor-pointer disabled:opacity-50"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Bulk Import Collapsible Panel */}
      {showBulkImport && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 space-y-4 animate-fade-in" id="bulk-import-panel">
          <div>
            <h5 className="font-bold text-amber-950 text-sm flex items-center gap-2">
              <Upload className="w-4 h-4 text-amber-700" />
              <span>Bulk Importer: Tempel Data dari Excel / Spreadsheet / CSV</span>
            </h5>
            <p className="text-xs text-amber-900 mt-1 leading-relaxed">
              Caranya: Buka file Excel/Spreadsheet Anda, salin kolom data siswa (misalnya kolom Nama, Kelas, NIS, Jenis Kelamin, Keterangan), lalu langsung tempel di bawah ini. Baris data dengan <strong>NIS yang sama akan langsung diupdate</strong> ke data terbaru otomatis!
            </p>
          </div>

          <textarea
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            rows={5}
            placeholder="Contoh format (Bisa pakai header atau tanpa header):&#10;Slamet Santoso	VIII A	12345	Laki-laki	Aktif&#10;Wahyu Hidayat	VIII B	12346	Laki-laki	Aktif&#10;Ismiati Rahayu	IX C	12347	Perempuan	Butuh bimbingan"
            className="w-full p-3 bg-white border border-amber-300 rounded-lg text-slate-900 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
          />

          {importStatus && (
            <div className={`p-3 rounded-lg text-xs flex items-start gap-2 border ${
              importStatus.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}>
              {importStatus.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span className="font-semibold">{importStatus.message}</span>
            </div>
          )}

          <div className="flex justify-end gap-3.5">
            <button
              onClick={() => {
                setShowBulkImport(false);
                setImportStatus(null);
              }}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-md border border-slate-300 cursor-pointer"
            >
              Batal
            </button>
            <button
              onClick={handleProcessBulkImport}
              disabled={isImporting || !bulkText.trim()}
              className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isImporting ? 'Memproses...' : 'Proses Import / Update'}
            </button>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-inner">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari siswa berdasarkan nama, NIS, kelas, atau keterangan..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all font-medium"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Kelas:</span>
          </div>
          <select
            value={selectedKelas}
            onChange={(e) => setSelectedKelas(e.target.value)}
            className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 font-bold cursor-pointer"
          >
            {PRESET_KELAS.map((kls) => (
              <option key={kls} value={kls}>
                {kls}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Database Warning if local */}
      {!isSupabase && (
        <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-xs flex items-center gap-2 text-blue-900 font-medium">
          <Database className="w-4 h-4 text-blue-600" />
          <span>Koneksi Supabase belum aktif atau menggunakan konfigurasi lokal default. Seluruh data tetap tersimpan aman di browser Anda.</span>
        </div>
      )}

      {/* Student List Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-500 font-semibold animate-pulse">Memuat data siswa dari database...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-16 text-center">
            <User className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-800 font-bold text-sm">Data Siswa Tidak Ditemukan</p>
            <p className="text-slate-500 text-xs mt-1">
              {searchTerm || selectedKelas !== 'SEMUA'
                ? 'Coba ganti kata kunci pencarian atau filter kelas.'
                : 'Silakan isi formulir di tab Tambah Siswa Baru.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider">
                  <th className="py-3 px-4 w-12 text-center">NO</th>
                  <th className="py-3 px-4">NAMA SISWA</th>
                  <th className="py-3 px-4 w-28 text-center">KELAS</th>
                  <th className="py-3 px-4 w-36 font-mono">NIS</th>
                  <th className="py-3 px-4 w-36 text-center">JENIS KELAMIN</th>
                  <th className="py-3 px-4">KETERANGAN</th>
                  <th className="py-3 px-4 w-28 text-center">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800 text-sm">
                {filteredItems.map((siswa, idx) => (
                  <tr key={siswa.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-400 text-center">
                      {idx + 1}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {siswa.nama_siswa}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-block px-2.5 py-1 bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold rounded">
                        {siswa.kelas}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs font-semibold text-slate-600">
                      {siswa.nis}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                        siswa.jenis_kelamin === 'Laki-laki'
                          ? 'bg-blue-50 text-blue-700 border border-blue-150'
                          : 'bg-pink-50 text-pink-700 border border-pink-150'
                      }`}>
                        {siswa.jenis_kelamin}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600 font-medium max-w-xs truncate">
                      {siswa.keterangan || '-'}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onEdit(siswa)}
                          className="p-1.5 bg-slate-50 hover:bg-cyan-50 border border-slate-200 hover:border-cyan-200 text-slate-600 hover:text-cyan-700 rounded transition-all cursor-pointer"
                          title="Edit Siswa"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus data siswa: ${siswa.nama_siswa}?`)) {
                              onDelete(siswa.id);
                            }
                          }}
                          className="p-1.5 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-600 hover:text-rose-700 rounded transition-all cursor-pointer"
                          title="Hapus Siswa"
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
        )}
      </div>
    </div>
  );
};
