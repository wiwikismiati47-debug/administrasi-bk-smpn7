import React, { useState, useMemo } from 'react';
import { Siswa } from '../types';
import { User, Users, GraduationCap, Calendar, Search, CheckSquare, Square, Check, X, Filter } from 'lucide-react';

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
  kelasLabel = 'Kelas',
  taLabel = 'Tahun Ajaran',
  siswaLabel = 'Nama Siswa',
  themeColor = 'indigo',
  required = false,
  onSelectStudentDetails
}) => {
  const [showMultiModal, setShowMultiModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [isManualMode, setIsManualMode] = useState(false);

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

  // Extract available students based on selectedKelas
  const availableStudents = useMemo(() => {
    if (!selectedKelas || selectedKelas === 'ALL' || selectedKelas === 'Semua Kelas') {
      return siswaItems;
    }
    const targetClean = selectedKelas.toLowerCase().replace(/[\s\-_]/g, '');
    return siswaItems.filter((s) => {
      const kClean = (s.kelas || '').toLowerCase().replace(/[\s\-_]/g, '');
      return kClean.includes(targetClean) || targetClean.includes(kClean);
    });
  }, [siswaItems, selectedKelas]);

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

  // Toggle single student checkbox in multi modal
  const handleToggleStudent = (student: Siswa) => {
    if (selectedStudentIds.includes(student.id)) {
      setSelectedStudentIds((prev) => prev.filter((id) => id !== student.id));
    } else {
      setSelectedStudentIds((prev) => [...prev, student.id]);
    }
  };

  // Select all visible students in class
  const handleSelectAllVisible = () => {
    const visibleIds = filteredStudentsInModal.map((s) => s.id);
    const allSelected = visibleIds.every((id) => selectedStudentIds.includes(id));
    if (allSelected) {
      // Unselect all visible
      setSelectedStudentIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      // Select all visible
      const merged = new Set([...selectedStudentIds, ...visibleIds]);
      setSelectedStudentIds(Array.from(merged));
    }
  };

  // Apply multi selection
  const handleApplyMulti = () => {
    const chosenObjects = siswaItems.filter((s) => selectedStudentIds.includes(s.id));
    if (chosenObjects.length === 0) {
      setShowMultiModal(false);
      return;
    }

    let resultString = '';
    if (formatMultiType === 'numbered') {
      resultString = chosenObjects.map((s, idx) => `${idx + 1}. ${s.nama_siswa}`).join('\n');
    } else if (formatMultiType === 'newline') {
      resultString = chosenObjects.map((s) => s.nama_siswa).join('\n');
    } else {
      // default comma
      resultString = chosenObjects.map((s) => s.nama_siswa).join(', ');
    }

    onSelectNamaSiswa(resultString);
    setShowMultiModal(false);
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
                setSearchQuery('');
              }}
              className={`text-[11px] font-extrabold px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 shadow-sm ${theme.lightBtn}`}
              title="Pilih beberapa siswa sekaligus (Bisa > 10 siswa)"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Multi-Pilih Siswa (&gt;10)</span>
            </button>
          </div>
        </div>

        {/* TEXT INPUT FIELD (No dropdown select) */}
        <div>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={selectedNamaSiswa || ''}
              onChange={(e) => onSelectNamaSiswa(e.target.value)}
              placeholder="Masukkan nama siswa atau pilih dari Multi-Pilih..."
              required={required}
              className={`w-full bg-white border border-slate-300 rounded-xl pl-10 pr-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 ${theme.ring}`}
            />
          </div>
        </div>
      </div>

      {/* MODAL MULTI-SELECT SISWA (> 10 SISWA) */}
      {showMultiModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl ${theme.badge}`}>
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-800">
                    Pilih Multi Siswa (&gt; 10 Siswa)
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Filter per kelas dan centang siswa yang terlibat (bisa memilih banyak siswa sekaligus)
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

            {/* Modal Search & Filters */}
            <div className="p-4 border-b border-slate-100 space-y-3 bg-white">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Filter Kelas */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Filter Kelas
                  </label>
                  <select
                    value={selectedKelas}
                    onChange={(e) => onSelectKelas(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800"
                  >
                    <option value="Semua Kelas">Semua Kelas ({siswaItems.length} Siswa)</option>
                    {classOptions.map((k) => (
                      <option key={k} value={k}>
                        Kelas {k}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Search Box */}
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
                      placeholder="Cari nama siswa..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs font-semibold text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons: Select All */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={handleSelectAllVisible}
                  className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-all"
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
                <div className="text-center py-8 text-slate-400 text-xs font-semibold">
                  Tidak ada data siswa ditemukan untuk filter ini.
                </div>
              ) : (
                filteredStudentsInModal.map((student) => {
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
                            Kelas {student.kelas || '-'} {student.nis ? `• NIS: ${student.nis}` : ''}
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

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedStudentIds([])}
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
                <button
                  type="button"
                  onClick={handleApplyMulti}
                  className={`px-5 py-2 text-xs font-extrabold rounded-xl shadow-md transition-all flex items-center gap-1.5 ${theme.btn}`}
                >
                  <Check className="w-4 h-4" />
                  <span>Terapkan ({selectedStudentIds.length} Siswa)</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
