import React, { useState, useMemo } from 'react';
import { Siswa } from '../types';
import * as XLSX from 'xlsx';
import {
  Search,
  Filter,
  Pencil,
  Trash2,
  FileSpreadsheet,
  Upload,
  Download,
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
  '7-A', '7-B', '7-C', '7-D', '7-E', '7-F', '7-G', '7-H',
  '8-A', '8-B', '8-C', '8-D', '8-E', '8-F', '8-G', '8-H',
  '9-A', '9-B', '9-C', '9-D', '9-E', '9-F', '9-G', '9-H'
];

export function standardizeKelas(kelasStr: string): string {
  if (!kelasStr) return '8-A';
  const clean = kelasStr.trim().toUpperCase();
  
  // Match Roman numerals with optional spaces/hyphens/dashes, e.g. VIII A or VIII-A or VIII_A or VIII B
  const romanMatch = clean.match(/^(VIII|VII|IX)[\s\-_]*([A-H0-9]+)$/i);
  if (romanMatch) {
    let grade = '8';
    const r = romanMatch[1].toUpperCase();
    if (r === 'VII') grade = '7';
    if (r === 'VIII') grade = '8';
    if (r === 'IX') grade = '9';
    return `${grade}-${romanMatch[2].toUpperCase()}`;
  }

  // Match Arabic numerals with optional spaces/hyphens, e.g. 8 A or 8-A or 8A
  const arabicMatch = clean.match(/^([789])[\s\-_]*([A-H0-9]+)$/i);
  if (arabicMatch) {
    return `${arabicMatch[1]}-${arabicMatch[2].toUpperCase()}`;
  }

  // Fallback cleanup
  const fallback = clean.replace(/[\s\-_]+/g, '-');
  if (!fallback.includes('-')) {
    const simpleMatch = fallback.match(/^([789])([A-H])$/);
    if (simpleMatch) {
      return `${simpleMatch[1]}-${simpleMatch[2]}`;
    }
    const romanSimpleMatch = fallback.match(/^(VIII|VII|IX)([A-H])$/);
    if (romanSimpleMatch) {
      let grade = '8';
      const r = romanSimpleMatch[1];
      if (r === 'VII') grade = '7';
      if (r === 'VIII') grade = '8';
      if (r === 'IX') grade = '9';
      return `${grade}-${romanSimpleMatch[2]}`;
    }
  }
  return fallback || '8-A';
}


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
  const [activeImportTab, setActiveImportTab] = useState<'excel' | 'copypaste'>('excel');

  // Excel template downloader
  const downloadExcelTemplate = () => {
    try {
      const data = [
        ['NAMA SISWA', 'KELAS', 'NIS', 'JENIS KELAMIN', 'KETERANGAN'],
        ['Slamet Santoso', '8-A', '12345', 'Laki-laki', 'Aktif'],
        ['Wahyu Hidayat', '8-B', '12346', 'Laki-laki', 'Aktif'],
        ['Ismiati Rahayu', '9-C', '12347', 'Perempuan', 'Butuh bimbingan']
      ];
      
      const worksheet = XLSX.utils.aoa_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Siswa');
      XLSX.writeFile(workbook, 'Template_Data_Siswa.xlsx');
    } catch (err) {
      console.error('Gagal mengunduh template:', err);
      alert('Gagal mengunduh template Excel.');
    }
  };

  // Process Excel upload
  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportStatus(null);
    setIsImporting(true);

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const data = evt.target?.result;
        if (!data) throw new Error('File tidak terbaca.');

        const arrayBuffer = data as ArrayBuffer;
        const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert sheet to json 2D array
        const sheetData = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1 });
        
        if (sheetData.length === 0) {
          throw new Error('Sheet kosong atau tidak ada data.');
        }

        // Find the header row (scan first 5 rows)
        let headerRowIdx = 0;
        let bestScore = -1;
        let headerMap = { nama: -1, kelas: -1, nis: -1, jk: -1, ket: -1 };

        const keywords = {
          nama: ['nama', 'siswa', 'student', 'nama_siswa'],
          kelas: ['kelas', 'class', 'grade'],
          nis: ['nis', 'nisn', 'nomor induk', 'induk', 'id'],
          jk: ['jenis kelamin', 'kelamin', 'jk', 'gender', 'sex', 'l/p', 'lp'],
          ket: ['keterangan', 'status', 'catatan', 'description', 'ket']
        };

        const limitRows = Math.min(sheetData.length, 5);
        for (let r = 0; r < limitRows; r++) {
          const row = sheetData[r];
          if (!row || !Array.isArray(row)) continue;
          
          let score = 0;
          let tempMap = { nama: -1, kelas: -1, nis: -1, jk: -1, ket: -1 };
          
          row.forEach((cell, cIdx) => {
            if (cell === null || cell === undefined) return;
            const str = cell.toString().toLowerCase().trim();
            
            if (keywords.jk.some(k => str === k || str.includes(k))) {
              tempMap.jk = cIdx;
              score += 2;
            } else if (keywords.nama.some(k => str === k || str.includes(k))) {
              tempMap.nama = cIdx;
              score += 3;
            } else if (keywords.nis.some(k => {
              if (k === 'nis') {
                return str === 'nis' || str === 'nisn' || str === 'nis/nisn' || (str.includes('nis') && !str.includes('jenis') && !str.includes('kelamin'));
              }
              if (k === 'id') {
                return str === 'id';
              }
              return str === k || str.includes(k);
            })) {
              tempMap.nis = cIdx;
              score += 3;
            } else if (keywords.kelas.some(k => str === k || str.includes(k))) {
              tempMap.kelas = cIdx;
              score += 2;
            } else if (keywords.ket.some(k => str === k || str.includes(k))) {
              tempMap.ket = cIdx;
              score += 1;
            }
          });

          if (score > bestScore) {
            bestScore = score;
            headerRowIdx = r;
            headerMap = tempMap;
          }
        }

        const hasHeader = bestScore > 2;
        const startRowIdx = hasHeader ? headerRowIdx + 1 : 0;

        const parsedStudents: Omit<Siswa, 'id' | 'created_at' | 'updated_at'>[] = [];

        for (let r = startRowIdx; r < sheetData.length; r++) {
          const row = sheetData[r];
          if (!row || !Array.isArray(row) || row.length === 0) continue;

          // Check if row has any values
          const hasValues = row.some(cell => cell !== null && cell !== undefined && cell.toString().trim() !== '');
          if (!hasValues) continue;

          let nama_siswa = '';
          let kelas = '';
          let nis = '';
          let jenis_kelamin = 'Laki-laki';
          let keterangan = 'Aktif';

          if (hasHeader) {
            if (headerMap.nama !== -1) nama_siswa = row[headerMap.nama]?.toString() || '';
            if (headerMap.kelas !== -1) kelas = row[headerMap.kelas]?.toString() || '';
            if (headerMap.nis !== -1) nis = row[headerMap.nis]?.toString() || '';
            if (headerMap.jk !== -1) jenis_kelamin = row[headerMap.jk]?.toString() || '';
            if (headerMap.ket !== -1) keterangan = row[headerMap.ket]?.toString() || '';
          } else {
            nama_siswa = row[0]?.toString() || '';
            kelas = row[1]?.toString() || '';
            nis = row[2]?.toString() || '';
            jenis_kelamin = row[3]?.toString() || 'Laki-laki';
            keterangan = row[4]?.toString() || 'Aktif';
          }

          nama_siswa = nama_siswa.trim();
          nis = nis.trim();
          kelas = kelas.trim();
          jenis_kelamin = jenis_kelamin.trim();
          keterangan = keterangan.trim();

          if (!nama_siswa || !nis) continue;

          // Clean gender
          const jkLower = jenis_kelamin.toLowerCase();
          if (jkLower.startsWith('p') || jkLower.includes('wanita') || jkLower.includes('perempuan') || jkLower === 'f' || jkLower === 'w') {
            jenis_kelamin = 'Perempuan';
          } else {
            jenis_kelamin = 'Laki-laki';
          }

          // Format Kelas
          const matchedKelas = standardizeKelas(kelas);

          parsedStudents.push({
            nama_siswa,
            kelas: matchedKelas,
            nis,
            jenis_kelamin,
            keterangan
          });
        }

        if (parsedStudents.length === 0) {
          throw new Error('Tidak ada data siswa valid yang berhasil dibaca. Pastikan terdapat kolom Nama dan NIS.');
        }

        await onBulkImport(parsedStudents);
        setImportStatus({
          type: 'success',
          message: `Berhasil mengimpor/memperbarui ${parsedStudents.length} data siswa dari file Excel!`
        });

        e.target.value = '';
        
        setTimeout(() => {
          setShowBulkImport(false);
          setImportStatus(null);
        }, 3000);

      } catch (err: any) {
        setImportStatus({
          type: 'error',
          message: err.message || 'Gagal membaca file Excel.'
        });
      } finally {
        setIsImporting(false);
      }
    };

    reader.onerror = () => {
      setImportStatus({ type: 'error', message: 'Gagal membaca file.' });
      setIsImporting(false);
    };

    reader.readAsArrayBuffer(file);
  };

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
          if (part.includes('kelamin') || part.includes('jenis') || part.includes('jk')) {
            headerIndices.jk = index;
          } else if (part.includes('nama') || part.includes('siswa')) {
            headerIndices.nama = index;
          } else if (part.includes('kelas')) {
            headerIndices.kelas = index;
          } else if (part.includes('nis') && !part.includes('jenis') && !part.includes('kelamin')) {
            headerIndices.nis = index;
          } else if (part.includes('keterangan') || part.includes('catatan') || part.includes('ket')) {
            headerIndices.ket = index;
          }
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
        const matchedKelas = standardizeKelas(kelas);

        parsedStudents.push({
          nama_siswa,
          kelas: matchedKelas,
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
            <span>{showBulkImport ? 'Tutup Panel Import' : 'Import Massal (Excel/Copypaste)'}</span>
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
          {/* Tab Headers */}
          <div className="flex border-b border-amber-200 gap-1">
            <button
              type="button"
              onClick={() => {
                setActiveImportTab('excel');
                setImportStatus(null);
              }}
              className={`px-4 py-2 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeImportTab === 'excel'
                  ? 'border-amber-600 text-amber-700 bg-amber-100/40 rounded-t-lg'
                  : 'border-transparent text-amber-900/60 hover:text-amber-800'
              }`}
            >
              📂 Unggah File Excel (.xlsx)
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveImportTab('copypaste');
                setImportStatus(null);
              }}
              className={`px-4 py-2 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeImportTab === 'copypaste'
                  ? 'border-amber-600 text-amber-700 bg-amber-100/40 rounded-t-lg'
                  : 'border-transparent text-amber-900/60 hover:text-amber-800'
              }`}
            >
              📝 Salin-Tempel Teks (Copypaste)
            </button>
          </div>

          {activeImportTab === 'excel' ? (
            <div className="space-y-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-amber-250 shadow-sm">
                <div className="space-y-1">
                  <h6 className="font-bold text-slate-800 text-xs sm:text-sm flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <span>Unduh Template Excel</span>
                  </h6>
                  <p className="text-xs text-slate-500">Gunakan template standar ini agar format kolom sesuai dengan sistem BK.</p>
                </div>
                <button
                  type="button"
                  onClick={downloadExcelTemplate}
                  className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-lg flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Template (.xlsx)</span>
                </button>
              </div>

              <div className="border-2 border-dashed border-amber-300 bg-white rounded-lg p-6 flex flex-col items-center justify-center text-center gap-3">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <Upload className="w-6 h-6 text-amber-700" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-700">Pilih file Excel Anda</p>
                  <p className="text-xs text-slate-500">Mendukung format file <strong>excel.xlsx</strong> atau <strong>.xls</strong></p>
                </div>
                
                <label className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg transition-all cursor-pointer shadow-sm">
                  <span>Pilih File Excel</span>
                  <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleExcelUpload}
                    disabled={isImporting}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          ) : (
            <div className="space-y-3 animate-fade-in">
              <div>
                <h5 className="font-bold text-amber-950 text-xs sm:text-sm flex items-center gap-2">
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
                placeholder="Contoh format (Bisa pakai header atau tanpa header):&#10;Slamet Santoso	8-A	12345	Laki-laki	Aktif&#10;Wahyu Hidayat	8-B	12346	Laki-laki	Aktif&#10;Ismiati Rahayu	9-C	12347	Perempuan	Butuh bimbingan"
                className="w-full p-3 bg-white border border-amber-300 rounded-lg text-slate-900 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
              />
            </div>
          )}

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
            {activeImportTab === 'copypaste' && (
              <button
                onClick={handleProcessBulkImport}
                disabled={isImporting || !bulkText.trim()}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-sm"
              >
                {isImporting ? 'Memproses...' : 'Proses Import / Update'}
              </button>
            )}
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
