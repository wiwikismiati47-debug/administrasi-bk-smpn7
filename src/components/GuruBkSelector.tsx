import React, { useState, useEffect } from 'react';
import { UserCog, Check, X } from 'lucide-react';
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

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 text-sm font-bold rounded-lg flex items-center gap-2 border transition-all cursor-pointer bg-white text-indigo-700 border-indigo-300 hover:bg-indigo-50 shadow-sm"
        title="Ubah Guru BK / Konselor Aktif"
      >
        <UserCog className="w-4 h-4" />
        <span>Pilih Guru BK</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
            <div className="bg-indigo-50 border-b border-indigo-100 p-3 flex items-center justify-between">
              <h3 className="font-bold text-indigo-900 text-sm">Pilih Guru BK Aktif</h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-2 space-y-1">
              {PRESET_GURU_BK.map((guru, idx) => {
                const isSelected = active.nip === guru.nip;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(guru)}
                    className={`w-full text-left p-3 rounded-lg flex items-start gap-3 transition-colors ${
                      isSelected ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'
                    }`}>
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                    <div>
                      <p className={`font-bold text-sm ${isSelected ? 'text-indigo-900' : 'text-slate-700'}`}>{guru.nama}</p>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">NIP. {guru.nip}</p>
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
