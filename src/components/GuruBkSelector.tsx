import React, { useState, useEffect } from 'react';
import { UserCheck, ChevronDown, Check, X, Shield } from 'lucide-react';
import { GuruBK, PRESET_GURU_BK, getActiveGuruBK, setActiveGuruBK } from '../lib/guruBk';

export const GuruBkSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState<GuruBK>(PRESET_GURU_BK[0]);

  useEffect(() => {
    setActive(getActiveGuruBK());

    const handleChanged = () => {
      setActive(getActiveGuruBK());
    };
    window.addEventListener('guru-bk-changed', handleChanged);
    return () => window.removeEventListener('guru-bk-changed', handleChanged);
  }, []);

  const handleSelect = (guru: GuruBK) => {
    setActiveGuruBK(guru);
    setIsOpen(false);
  };

  // Get short display name (e.g. Nur Fadilah)
  const shortName = active.nama.split(',')[0] || active.nama;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1.5 border transition-all cursor-pointer bg-blue-50/80 text-blue-800 border-blue-200/80 hover:bg-blue-100/80 shadow-sm"
        title="Pilih / Ganti Guru BK Aktif"
      >
        <UserCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
        <span className="max-w-[100px] sm:max-w-[140px] truncate text-left">
          {shortName}
        </span>
        <ChevronDown className="w-3 h-3 text-blue-500 shrink-0" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-xs" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-800 text-xs sm:text-sm">Pilih Konselor / Guru BK Aktif</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-2 space-y-1 max-h-72 overflow-y-auto">
              {PRESET_GURU_BK.map((guru, idx) => {
                const isSelected = active.nip === guru.nip;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(guru)}
                    className={`w-full text-left p-3 rounded-xl flex items-start gap-3 transition-all ${
                      isSelected
                        ? 'bg-blue-50 border border-blue-200 text-blue-900 shadow-xs'
                        : 'hover:bg-slate-50 border border-transparent text-slate-700'
                    }`}
                  >
                    <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'
                    }`}>
                      {isSelected && <Check className="w-2.5 h-2.5" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">{guru.nama}</p>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">NIP. {guru.nip}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
