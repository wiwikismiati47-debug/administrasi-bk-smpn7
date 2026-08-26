import React, { useState, useMemo, useEffect } from 'react';
import { Siswa, SiswaTidakHadir } from '../types';
import {
  User,
  Users,
  GraduationCap,
  Calendar,
  Search,
  CheckSquare,
  Square,
  Check,
  X,
  Filter,
  AlertCircle,
  FileSpreadsheet,
  CheckCircle2,
  Trash2,
  Sparkles,
  ArrowRight,
  ClipboardList
} from 'lucide-react';

interface SiswaSelectorProps {
  siswaItems?: Siswa[];
  // Class selection props
  selectedKelas: string;
  onSelectKelas: (kelas: string) => void;
  // Academic Year selection props
  selectedTahunAjaran?: string;
  onSelectTahunAjaran?: (ta: string) => void;
  showTahunAjaran?: boolean;
  // Student selection props
  selectedNamaSiswa: string;
  onSelectNamaSiswa: (nama: string) => void;
  // Multi-student selection behavior
  isMultiSelect?: boolean;
  formatMultiType?: 'comma' | 'numbered' | 'newline'; // how multi names are formatted
  // Absence Reason feature props
  showAbsenReason?: boolean;
  initialAlasan?: string;
  initialTindakLanjut?: string;
  onMultiSelectAbsen?: (items: SiswaTidakHadir[]) => void;
  // Labels and Theme
  kelasLabel?: string;
  taLabel?: string;
  siswaLabel?: string;
  themeColor?: 'rose' | 'emerald' | 'indigo' | 'pink' | 'amber' | 'purple' | 'blue';
  required?: boolean;
  onSelectStudentDetails?: (student: Siswa) => void; // Callback if student object detail is needed (e.g. NIS, Ortu)
}

const DEFAULT_CLASSES = [
  '7A', '7B', '7C', '7D', '7E', '7F', '7G', '7H',
  '8A', '8B', '8C', '8D', '8E', '8F', '8G', '8H',
  '9A', '9B', '9C', '9D', '9E', '9F', '9G', '9H'
];

const DEFAULT_TA = ['2026/2027'];

const PRESET_QUICK_REASONS = [
  { label: 'Sakit', val: 'Sakit', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  { label: 'Izin', val: 'Izin', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { label: 'Alpha', val: 'Alpha (Tanpa Keterangan)', color: 'bg-rose-100 text-rose-800 border-rose-300' },
  { label: 'Dispensasi', val: 'Dispensasi Lomba / Tugas Sekolah', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { label: 'UKS', val: 'Mengikuti Layanan Kesehatan / UKS', color: 'bg-purple-100 text-purple-800 border-purple-300' }
];

const PRESET_QUICK_TINDAK_LANJUT = [
  'Bimbingan Susulan',
  'Konseling Individual',
  'Panggilan Orang Tua',
  'Koordinasi Wali Kelas'
];

const THEME_STYLES = {
  rose: {
    badge: 'bg-rose-100 text-rose-800 border-rose-300',
    ring: 'focus:ring-rose-500 focus:border-rose-500',
    btn: 'bg-rose-600 hover:bg-rose-700 text-white',
    lightBtn: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100',
    accent: 'text-rose-600'
  },
  emerald: {
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    ring: 'focus:ring-emerald-500 focus:border-emerald-500',
    btn: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    lightBtn: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
    accent: 'text-emerald-600'
  },
  indigo: {
    badge: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    ring: 'focus:ring-indigo-500 focus:border-indigo-500',
    btn: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    lightBtn: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100',
    accent: 'text-indigo-600'
  },
  pink: {
    badge: 'bg-pink-100 text-pink-800 border-pink-300',
    ring: 'focus:ring-pink-500 focus:border-pink-500',
    btn: 'bg-pink-600 hover:bg-pink-700 text-white',
    lightBtn: 'bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100',
    accent: 'text-pink-600'
  },
  amber: {
    badge: 'bg-amber-100 text-amber-800 border-amber-300',
    ring: 'focus:ring-amber-500 focus:border-amber-500',
    btn: 'bg-amber-600 hover:bg-amber-700 text-white',
    lightBtn: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
    accent: 'text-amber-600'
  },
  purple: {
    badge: 'bg-purple-100 text-purple-800 border-purple-300',
    ring: 'focus:ring-purple-500 focus:border-purple-500',
    btn: 'bg-purple-600 hover:bg-purple-700 text-white',
    lightBtn: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
    accent: 'text-purple-600'
  },
  blue: {
    badge: 'bg-blue-100 text-blue-800 border-blue-300',
    ring: 'focus:ring-blue-500 focus:border-blue-500',
    btn: 'bg-blue-600 hover:bg-blue-700 text-white',
    lightBtn: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
    accent: 'text-blue-600'
  }
};

// Robust class normalization helper
export const normalizeClassString = (cls: string): string => {
  if (!cls) return '';
  let str = String(cls).toUpperCase().trim();
  // Remove prefix "KELAS" or "KLAS" or "CLASS"
  str = str.replace(/^(KELAS|KLAS|CLASS)\s*/i, '');
  // Replace Roman numerals at beginning (VIII -> 8, VII -> 7, IX -> 9, etc.)
  const romanMap: Record<string, string> = {
    'VIII': '8',
    'VII': '7',
    'IX': '9',
    'XII': '12',
    'XI': '11',
    'X': '10'
  };
  for (const [rom, num] of Object.entries(romanMap)) {
    if (str.startsWith(rom)) {
      str = num + str.substring(rom.length);
      break;
    }
  }
  // Strip all whitespace, hyphens, dots, underscores
  return str.replace(/[\s\-_.]/g, '');
};

// Robust class matching helper
export const isClassMatching = (studentClass: string, targetClass: string): boolean => {
  if (!targetClass || targetClass === 'ALL' || targetClass === 'Semua Kelas' || targetClass === 'SEMUA') {
    return true;
  }
  if (!studentClass) return false;
  
  const rawS = studentClass.trim();
  const rawT = targetClass.trim();
  if (rawS === rawT) return true;

  const normS = normalizeClassString(rawS);
  const normT = normalizeClassString(rawT);
  if (!normS || !normT) return false;
  if (normS === normT) return true;

  // If target is just grade level number like "7" or "8" or "9"
  if (normT === '7' || normT === '8' || normT === '9') {
    return normS.startsWith(normT);
  }

  // Handle case where target is "7H" and student is "7-H" or "KELAS 7H"
  return normS === normT || normS.includes(normT) || normT.includes(normS);
};

export const SiswaSelector: React.FC<SiswaSelectorProps> = ({
  siswaItems = [],
  selectedKelas,
  onSelectKelas,
  selectedTahunAjaran = '',
  onSelectTahunAjaran,
  showTahunAjaran = false,
  selectedNamaSiswa,
  onSelectNamaSiswa,
  isMultiSelect = false,
  formatMultiType = 'comma',
  showAbsenReason = false,
  initialAlasan = 'Sakit',
  initialTindakLanjut = 'Bimbingan Susulan',
  onMultiSelectAbsen,
  kelasLabel = 'Kelas',
  taLabel = 'Tahun Ajaran',
  siswaLabel = 'Nama Siswa',
  themeColor = 'indigo',
  required = false,
  onSelectStudentDetails
}) => {
  const [showMultiModal, setShowMultiModal] = useState(false);
  const [modalTab, setModalTab] = useState<'select' | 'reason'>('select');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  
  // Absence reason & follow up map per student ID
  const [studentAbsenData, setStudentAbsenData] = useState<
    Record<string, { alasan: string; tindak_lanjut: string }>
  >({});

  const theme = THEME_STYLES[themeColor] || THEME_STYLES.indigo;

  // Extract list of all unique classes from siswaItems merged with defaults
  const classOptions = useMemo(() => {
    const fromItems = siswaItems
      .map((s) => (s.kelas || '').trim())
      .filter((k) => k.length > 0);
    
    const set = new Set<string>();
    fromItems.forEach((k) => set.add(k));
    DEFAULT_CLASSES.forEach((k) => set.add(k));

    return Array.from(set).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }, [siswaItems]);

  // Count students per class for accurate display
  const getClassStudentCount = (targetClass: string) => {
    if (!targetClass || targetClass === 'Semua Kelas' || targetClass === 'SEMUA') {
      return siswaItems.length;
    }
    return siswaItems.filter((s) => isClassMatching(s.kelas, targetClass)).length;
  };

  // Extract available students based on selectedKelas (ALL students in the class)
  const availableStudents = useMemo(() => {
    if (!selectedKelas || selectedKelas === 'ALL' || selectedKelas === 'Semua Kelas' || selectedKelas === 'SEMUA') {
      return siswaItems;
    }
    return siswaItems.filter((s) => isClassMatching(s.kelas, selectedKelas));
  }, [siswaItems, selectedKelas]);

  // Suggestions for single-select dropdown (shows all available students for the selected class)
  const [showSuggestions, setShowSuggestions] = useState(false);
  const singleSuggestions = useMemo(() => {
    if (!selectedNamaSiswa || !selectedNamaSiswa.trim()) {
      return availableStudents;
    }
    const q = selectedNamaSiswa.toLowerCase().trim();
    const filtered = availableStudents.filter(
      (s) =>
        s.nama_siswa.toLowerCase().includes(q) ||
        (s.nis && s.nis.toLowerCase().includes(q))
    );
    return filtered;
  }, [availableStudents, selectedNamaSiswa]);

  // Filter students inside modal search
  const filteredStudentsInModal = useMemo(() => {
    if (!searchQuery.trim()) return availableStudents;
    const q = searchQuery.toLowerCase().trim();
    return availableStudents.filter(
      (s) =>
        s.nama_siswa.toLowerCase().includes(q) ||
        (s.nis && s.nis.toLowerCase().includes(q)) ||
        (s.kelas && s.kelas.toLowerCase().includes(q))
    );
  }, [availableStudents, searchQuery]);

  // Selected student objects
  const selectedStudentObjects = useMemo(() => {
    return siswaItems.filter((s) => selectedStudentIds.includes(s.id));
  }, [siswaItems, selectedStudentIds]);

  // Initialize or maintain reason when a student is selected
  const handleToggleStudent = (student: Siswa) => {
    if (selectedStudentIds.includes(student.id)) {
      setSelectedStudentIds((prev) => prev.filter((id) => id !== student.id));
    } else {
      setSelectedStudentIds((prev) => [...prev, student.id]);
      if (!studentAbsenData[student.id]) {
        setStudentAbsenData((prev) => ({
          ...prev,
          [student.id]: {
            alasan: initialAlasan || 'Sakit',
            tindak_lanjut: initialTindakLanjut || 'Bimbingan Susulan'
          }
        }));
      }
    }
  };

  // Select all visible students in class
  const handleSelectAllVisible = () => {
    const visibleIds = filteredStudentsInModal.map((s) => s.id);
    const allSelected = visibleIds.every((id) => selectedStudentIds.includes(id));
    if (allSelected) {
      setSelectedStudentIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      const merged = new Set([...selectedStudentIds, ...visibleIds]);
      setSelectedStudentIds(Array.from(merged));
      // Initialize defaults for newly added
      setStudentAbsenData((prev) => {
        const next = { ...prev };
        visibleIds.forEach((vid) => {
          if (!next[vid]) {
            next[vid] = {
              alasan: initialAlasan || 'Sakit',
              tindak_lanjut: initialTindakLanjut || 'Bimbingan Susulan'
            };
          }
        });
        return next;
      });
    }
  };

  // Bulk set reason for all selected students
  const handleBulkSetReason = (reasonText: string) => {
    setStudentAbsenData((prev) => {
      const next = { ...prev };
      selectedStudentIds.forEach((id) => {
        next[id] = {
          alasan: reasonText,
          tindak_lanjut: next[id]?.tindak_lanjut || initialTindakLanjut || 'Bimbingan Susulan'
        };
      });
      return next;
    });
  };

  // Bulk set tindak lanjut for all selected students
  const handleBulkSetTindakLanjut = (tindakLanjutText: string) => {
    setStudentAbsenData((prev) => {
      const next = { ...prev };
      selectedStudentIds.forEach((id) => {
        next[id] = {
          alasan: next[id]?.alasan || initialAlasan || 'Sakit',
          tindak_lanjut: tindakLanjutText
        };
      });
      return next;
    });
  };

  // Update specific student's reason
  const handleUpdateStudentReason = (studentId: string, alasan: string) => {
    setStudentAbsenData((prev) => ({
      ...prev,
      [studentId]: {
        alasan,
        tindak_lanjut: prev[studentId]?.tindak_lanjut || initialTindakLanjut || 'Bimbingan Susulan'
      }
    }));
  };

  // Update specific student's tindak lanjut
  const handleUpdateStudentTindakLanjut = (studentId: string, tindak_lanjut: string) => {
    setStudentAbsenData((prev) => ({
      ...prev,
      [studentId]: {
        alasan: prev[studentId]?.alasan || initialAlasan || 'Sakit',
        tindak_lanjut
      }
    }));
  };

  // Apply multi selection
  const handleApplyMulti = () => {
    if (selectedStudentObjects.length === 0) {
      setShowMultiModal(false);
      return;
    }

    if (showAbsenReason && onMultiSelectAbsen) {
      const items: SiswaTidakHadir[] = selectedStudentObjects.map((s) => ({
        nama_siswa: s.nama_siswa,
        alasan: studentAbsenData[s.id]?.alasan?.trim() || initialAlasan || 'Tanpa Keterangan',
        tindak_lanjut: studentAbsenData[s.id]?.tindak_lanjut?.trim() || initialTindakLanjut || 'Bimbingan Susulan'
      }));
      onMultiSelectAbsen(items);
      setSelectedStudentIds([]);
      setShowMultiModal(false);
      setModalTab('select');
      return;
    }

    let resultString = '';
    if (formatMultiType === 'numbered') {
      resultString = selectedStudentObjects.map((s, idx) => `${idx + 1}. ${s.nama_siswa}`).join('\n');
    } else if (formatMultiType === 'newline') {
      resultString = selectedStudentObjects.map((s) => s.nama_siswa).join('\n');
    } else {
      resultString = selectedStudentObjects.map((s) => s.nama_siswa).join(', ');
    }

    onSelectNamaSiswa(resultString);
    setShowMultiModal(false);
    setModalTab('select');
  };

  return (
    <div className="space-y-3">
      {/* ROW 1: TAHUN AJARAN (IF SHOW_TA) */}
      {showTahunAjaran && onSelectTahunAjaran && (
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
            <Calendar className={`w-3.5 h-3.5 ${theme.accent}`} />
            <span>{taLabel} {required && <span className="text-rose-500">*</span>}</span>
          </label>

          <div className="space-y-1">
            <select
              value={DEFAULT_TA.includes(selectedTahunAjaran) ? selectedTahunAjaran : '__custom__'}
              onChange={(e) => {
                if (e.target.value !== '__custom__') {
                  onSelectTahunAjaran(e.target.value);
                }
              }}
              className={`w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 ${theme.ring}`}
            >
              <option value="">-- Pilih Tahun Ajaran --</option>
              {DEFAULT_TA.map((ta) => (
                <option key={ta} value={ta}>
                  T.A. {ta}
                </option>
              ))}
              <option value="__custom__">Input Manual / Lainnya...</option>
            </select>

            {(!DEFAULT_TA.includes(selectedTahunAjaran || '') || selectedTahunAjaran === '') && (
              <input
                type="text"
                value={selectedTahunAjaran || ''}
                onChange={(e) => onSelectTahunAjaran(e.target.value)}
                placeholder="e.g. 2026/2027"
                className={`w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 ${theme.ring}`}
              />
            )}
          </div>
        </div>
      )}

      {/* ROW 2: NAMA SISWA SELECTOR + MULTI SELECT BUTTON */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
            <User className={`w-3.5 h-3.5 ${theme.accent}`} />
            <span>{siswaLabel} {required && <span className="text-rose-500">*</span>}</span>
          </label>

          <div className="flex items-center gap-1.5">
            {availableStudents.length > 0 && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold border ${theme.badge}`}>
                {availableStudents.length} Siswa Tersedia
              </span>
            )}

            {/* MULTI-SELECT BUTTON (Bisa > 10 Siswa) */}
            <button
              type="button"
              onClick={() => {
                setShowMultiModal(true);
                setModalTab('select');
                setSearchQuery('');
              }}
              className={`text-[11px] font-extrabold px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 shadow-sm ${theme.lightBtn}`}
              title="Pilih beberapa siswa sekaligus (Bisa > 10 siswa dengan alasan masing-masing)"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Multi-Pilih Siswa (&gt;10)</span>
            </button>
          </div>
        </div>

        {/* TEXT INPUT FIELD WITH AUTO-SUGGESTION LIST */}
        <div className="relative">
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={selectedNamaSiswa || ''}
              onChange={(e) => {
                onSelectNamaSiswa(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Ketik / pilih nama siswa dari database..."
              required={required}
              className={`w-full bg-white border border-slate-300 rounded-xl pl-10 pr-16 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 ${theme.ring}`}
            />
            <div className="absolute right-2 top-2 flex items-center gap-1">
              {selectedNamaSiswa && (
                <button
                  type="button"
                  onClick={() => onSelectNamaSiswa('')}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
                  title="Hapus nama"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowSuggestions(!showSuggestions)}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border transition-all ${theme.lightBtn}`}
                title="Tampilkan / sembunyikan daftar siswa"
              >
                Pilih
              </button>
            </div>
          </div>

          {/* Autocomplete / Suggestions Popover */}
          {showSuggestions && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl shadow-xl border border-slate-200 z-40 max-h-56 overflow-y-auto p-1.5 space-y-1 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between px-2.5 py-1 text-[10px] font-black text-slate-400 border-b border-slate-100 mb-1">
                <span>Daftar Siswa ({availableStudents.length} tersedia di {selectedKelas || 'Semua Kelas'})</span>
                <button
                  type="button"
                  onClick={() => setShowSuggestions(false)}
                  className="text-slate-400 hover:text-slate-700 font-bold"
                >
                  Tutup ✕
                </button>
              </div>

              {singleSuggestions.length === 0 ? (
                <div className="p-3 text-center text-xs text-slate-400 font-medium">
                  Tidak ada siswa yang cocok. Anda dapat tetap mengetik nama manual.
                </div>
              ) : (
                singleSuggestions.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      onSelectNamaSiswa(s.nama_siswa);
                      if (onSelectStudentDetails) {
                        onSelectStudentDetails(s);
                      }
                      setShowSuggestions(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between group hover:bg-indigo-50/80 ${
                      selectedNamaSiswa === s.nama_siswa ? 'bg-indigo-50 border border-indigo-200' : 'border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-[10px] group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        {(s.nama_siswa || '?')[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-950">
                          {s.nama_siswa}
                        </p>
                        <p className="text-[10px] text-slate-500 font-medium">
                          Kelas {s.kelas || '-'} {s.nis ? `• NIS: ${s.nis}` : ''} {s.jenis_kelamin ? `• ${s.jenis_kelamin}` : ''}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-indigo-600">
                      Pilih ↵
                    </span>
                  </button>
                ))
              )}

              {availableStudents.length > 15 && (
                <div className="p-1.5 text-center border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSuggestions(false);
                      setShowMultiModal(true);
                      setModalTab('select');
                    }}
                    className={`text-[11px] font-extrabold ${theme.accent} hover:underline`}
                  >
                    Lihat Semua Siswa ({availableStudents.length}) di Modal Pencarian ➔
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MODAL MULTI-SELECT SISWA (> 10 SISWA) WITH INDIVIDUAL REASONS */}
      {showMultiModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl ${theme.badge}`}>
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-800">
                    {showAbsenReason
                      ? 'Multi-Pilih Siswa & Atur Alasan Absen Masing-Masing'
                      : 'Pilih Multi Siswa (> 10 Siswa)'}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {showAbsenReason
                      ? 'Pilih beberapa siswa dan tentukan alasan (Sakit/Izin/Alpha/Dispen) pada masing-masing siswa'
                      : 'Filter per kelas dan centang siswa yang terlibat'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowMultiModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* TAB NAVIGATION IF SHOW_ABSEN_REASON IS TRUE */}
            {showAbsenReason && (
              <div className="flex border-b border-slate-200 bg-slate-100/70 p-1.5 gap-1.5">
                <button
                  type="button"
                  onClick={() => setModalTab('select')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    modalTab === 'select'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>1. Pilih Siswa ({selectedStudentIds.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (selectedStudentIds.length === 0) {
                      alert('Silakan pilih minimal 1 siswa terlebih dahulu.');
                      return;
                    }
                    setModalTab('reason');
                  }}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    modalTab === 'reason'
                      ? 'bg-white text-rose-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <ClipboardList className="w-3.5 h-3.5 text-rose-600" />
                  <span>2. Atur Alasan Masing-Masing Siswa ({selectedStudentIds.length})</span>
                </button>
              </div>
            )}

            {/* TAB 1 CONTENT: SELECT STUDENTS */}
            {modalTab === 'select' && (
              <>
                {/* Modal Search & Filters */}
                <div className="p-4 border-b border-slate-100 space-y-3 bg-white">
                  {/* Quick Class Chips Bar */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1.5 flex items-center justify-between">
                      <span>Pilih Kelas Cepat:</span>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        Total {availableStudents.length} siswa di kelas aktif
                      </span>
                    </label>
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectKelas('Semua Kelas');
                          setSearchQuery('');
                        }}
                        className={`px-2.5 py-1 text-[11px] font-extrabold rounded-xl border transition-all whitespace-nowrap ${
                          !selectedKelas || selectedKelas === 'Semua Kelas' || selectedKelas === 'ALL' || selectedKelas === 'SEMUA'
                            ? `${theme.btn} shadow-sm border-transparent`
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Semua ({siswaItems.length})
                      </button>

                      {classOptions.map((k) => {
                        const count = getClassStudentCount(k);
                        const isSelected = isClassMatching(selectedKelas, k);
                        return (
                          <button
                            key={k}
                            type="button"
                            onClick={() => {
                              onSelectKelas(k);
                              setSearchQuery('');
                            }}
                            className={`px-2.5 py-1 text-[11px] font-bold rounded-xl border transition-all whitespace-nowrap flex items-center gap-1 ${
                              isSelected
                                ? `${theme.btn} shadow-sm border-transparent`
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <span>{k}</span>
                            <span className={`text-[9px] px-1.5 py-0.2 rounded-md ${isSelected ? 'bg-white/25 text-white' : 'bg-slate-200/80 text-slate-600'}`}>
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dropdown & Search Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {/* Filter Kelas Dropdown */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Filter Kelas
                      </label>
                      <select
                        value={selectedKelas}
                        onChange={(e) => {
                          onSelectKelas(e.target.value);
                          setSearchQuery('');
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="Semua Kelas">Semua Kelas ({siswaItems.length} Siswa)</option>
                        {classOptions.map((k) => (
                          <option key={k} value={k}>
                            Kelas {k} ({getClassStudentCount(k)} Siswa)
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Search Box with Clear Button */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Cari Nama / NIS
                      </label>
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Cari nama atau NIS siswa..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-8 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {searchQuery && (
                          <button
                            type="button"
                            onClick={() => setSearchQuery('')}
                            className="absolute right-2 top-2 p-0.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200 transition-colors"
                            title="Hapus pencarian dan tampilkan semua siswa"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Filter Status Alert / Summary Banner */}
                  {searchQuery ? (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-2 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-amber-900 font-semibold">
                        <Search className="w-3.5 h-3.5 text-amber-600" />
                        <span>
                          Menyaring: &quot;<strong>{searchQuery}</strong>&quot; • Ditemukan <strong>{filteredStudentsInModal.length}</strong> dari <strong>{availableStudents.length}</strong> siswa
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="text-[11px] font-bold text-amber-800 hover:text-amber-950 underline px-2 py-0.5 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors"
                      >
                        ✕ Tampilkan Semua ({availableStudents.length})
                      </button>
                    </div>
                  ) : (
                    <div className="bg-slate-100/80 border border-slate-200/60 rounded-xl px-3 py-1.5 flex items-center justify-between text-xs text-slate-600">
                      <span>
                        📋 Menampilkan semua <strong>{availableStudents.length}</strong> siswa di <strong>{selectedKelas || 'Semua Kelas'}</strong>
                      </span>
                    </div>
                  )}

                  {/* Action Buttons: Select All */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={handleSelectAllVisible}
                      className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-all border border-slate-200"
                    >
                      <CheckSquare className="w-3.5 h-3.5 text-slate-600" />
                      <span>
                        Pilih Semua ({filteredStudentsInModal.length} Siswa Tampak)
                      </span>
                    </button>

                    <span className="text-xs font-extrabold text-slate-600">
                      Terpilih: <strong className={theme.accent}>{selectedStudentIds.length}</strong> Siswa
                    </span>
                  </div>
                </div>

                {/* Modal Student Checklist List */}
                <div className="p-4 overflow-y-auto flex-1 space-y-1.5 bg-slate-50/50">
                  {filteredStudentsInModal.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 space-y-2">
                      <p className="text-xs font-semibold">Tidak ada data siswa ditemukan untuk filter ini.</p>
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery('')}
                          className={`text-xs font-bold ${theme.accent} underline`}
                        >
                          Hapus filter pencarian & tampilkan semua {availableStudents.length} siswa
                        </button>
                      )}
                    </div>
                  ) : (
                    filteredStudentsInModal.map((student, idx) => {
                      const isChecked = selectedStudentIds.includes(student.id);
                      return (
                        <label
                          key={student.id}
                          onClick={() => handleToggleStudent(student)}
                          className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                            isChecked
                              ? 'bg-white border-indigo-400 shadow-sm ring-1 ring-indigo-300'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-5 h-5 rounded-lg bg-slate-100 text-slate-500 font-bold text-[10px] flex items-center justify-center">
                              {idx + 1}
                            </span>

                            <div
                              className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                                isChecked
                                  ? `${theme.btn} border-transparent`
                                  : 'border-slate-300 bg-slate-50'
                              }`}
                            >
                              {isChecked && <Check className="w-3.5 h-3.5 text-white" />}
                            </div>

                            <div>
                              <p className="text-xs font-bold text-slate-900">{student.nama_siswa}</p>
                              <p className="text-[10px] text-slate-500 font-medium">
                                Kelas {student.kelas || '-'} {student.nis ? `• NIS: ${student.nis}` : ''} {student.jenis_kelamin ? `• ${student.jenis_kelamin}` : ''}
                              </p>
                            </div>
                          </div>

                          {isChecked && (
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${theme.badge}`}>
                              Terpilih
                            </span>
                          )}
                        </label>
                      );
                    })
                  )}
                </div>
              </>
            )}

            {/* TAB 2 CONTENT: ATUR ALASAN ABSEN & TINDAK LANJUT PER SISWA */}
            {modalTab === 'reason' && (
              <div className="p-4 overflow-y-auto flex-1 space-y-4 bg-slate-50/50">
                {/* QUICK BULK SETTER BAR */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-slate-700 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Set Serentak / Cepat ke Semua ({selectedStudentIds.length} Siswa):
                    </span>
                  </div>

                  {/* Quick Reason Pills */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500">Terapkan Alasan Seragam:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {PRESET_QUICK_REASONS.map((pr) => (
                        <button
                          key={pr.val}
                          type="button"
                          onClick={() => handleBulkSetReason(pr.val)}
                          className="px-2.5 py-1 text-[11px] font-bold rounded-lg border bg-slate-50 hover:bg-slate-100 text-slate-700 transition-all active:scale-95"
                        >
                          Semua {pr.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Tindak Lanjut Pills */}
                  <div className="space-y-1 pt-1 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-500">Terapkan Tindak Lanjut Seragam:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {PRESET_QUICK_TINDAK_LANJUT.map((tl) => (
                        <button
                          key={tl}
                          type="button"
                          onClick={() => handleBulkSetTindakLanjut(tl)}
                          className="px-2 py-0.5 text-[10px] font-bold rounded-md border bg-slate-50 hover:bg-slate-100 text-slate-600 transition-all active:scale-95"
                        >
                          {tl}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* INDIVIDUAL STUDENT CARDS */}
                <div className="space-y-2.5">
                  <span className="text-xs font-black text-slate-800 block">
                    Daftar Siswa Terpilih ({selectedStudentObjects.length}):
                  </span>

                  {selectedStudentObjects.map((student, idx) => {
                    const currentData = studentAbsenData[student.id] || {
                      alasan: initialAlasan || 'Sakit',
                      tindak_lanjut: initialTindakLanjut || 'Bimbingan Susulan'
                    };

                    return (
                      <div
                        key={student.id}
                        className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-2.5 hover:border-slate-300 transition-all"
                      >
                        {/* Student Name & Remove Button */}
                        <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-black text-[10px] flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <div>
                              <p className="text-xs font-black text-slate-900">{student.nama_siswa}</p>
                              <p className="text-[10px] text-slate-500 font-medium">
                                Kelas {student.kelas || '-'} {student.nis ? `• NIS: ${student.nis}` : ''}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleToggleStudent(student)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Hapus dari daftar pilihan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Reason Controls */}
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-slate-600">
                            Alasan Absen:
                          </label>

                          {/* Quick Pills */}
                          <div className="flex flex-wrap gap-1">
                            {PRESET_QUICK_REASONS.map((pr) => {
                              const isSelected =
                                currentData.alasan.toLowerCase().includes(pr.label.toLowerCase()) ||
                                currentData.alasan === pr.val;
                              return (
                                <button
                                  key={pr.val}
                                  type="button"
                                  onClick={() => handleUpdateStudentReason(student.id, pr.val)}
                                  className={`px-2 py-0.5 text-[10px] font-bold rounded-lg border transition-all ${
                                    isSelected
                                      ? `${pr.color} ring-1 ring-slate-400`
                                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                                  }`}
                                >
                                  {pr.label}
                                </button>
                              );
                            })}
                          </div>

                          {/* Custom Reason Text Input */}
                          <input
                            type="text"
                            value={currentData.alasan}
                            onChange={(e) => handleUpdateStudentReason(student.id, e.target.value)}
                            placeholder="Ketik detail alasan (misal: Sakit demam, Izin ada acara, dll)..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-medium focus:bg-white focus:ring-2 focus:ring-rose-500"
                          />
                        </div>

                        {/* Tindak Lanjut Input */}
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-600">
                            Tindak Lanjut BK:
                          </label>
                          <input
                            type="text"
                            value={currentData.tindak_lanjut}
                            onChange={(e) => handleUpdateStudentTindakLanjut(student.id, e.target.value)}
                            placeholder="Contoh: Bimbingan Susulan / Panggilan Ortu"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setSelectedStudentIds([]);
                  setStudentAbsenData({});
                }}
                className="text-xs font-bold text-slate-500 hover:text-slate-700 px-3 py-1.5"
              >
                Reset Pilihan
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowMultiModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all"
                >
                  Batal
                </button>

                {showAbsenReason && modalTab === 'select' ? (
                  <button
                    type="button"
                    disabled={selectedStudentIds.length === 0}
                    onClick={() => {
                      if (selectedStudentIds.length === 0) {
                        alert('Silakan pilih minimal 1 siswa terlebih dahulu.');
                        return;
                      }
                      setModalTab('reason');
                    }}
                    className={`px-5 py-2 text-xs font-extrabold rounded-xl shadow-md transition-all flex items-center gap-1.5 ${
                      selectedStudentIds.length === 0
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                        : `${theme.btn}`
                    }`}
                  >
                    <span>Lanjut Atur Alasan ({selectedStudentIds.length} Siswa)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={selectedStudentIds.length === 0}
                    onClick={handleApplyMulti}
                    className={`px-5 py-2 text-xs font-extrabold rounded-xl shadow-md transition-all flex items-center gap-1.5 ${
                      selectedStudentIds.length === 0
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                        : showAbsenReason
                        ? 'bg-rose-600 hover:bg-rose-700 text-white'
                        : `${theme.btn}`
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    <span>
                      {showAbsenReason
                        ? `Tambahkan ${selectedStudentIds.length} Siswa ke Daftar Absen`
                        : `Terapkan (${selectedStudentIds.length} Siswa)`}
                    </span>
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

