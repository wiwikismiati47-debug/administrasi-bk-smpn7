import React from 'react';
import {
  Download,
  Upload,
  Database,
  ShieldCheck,
  Sparkles,
  Layers,
  BookOpen
} from 'lucide-react';

interface DashboardHeaderProps {
  onBackup: () => void;
  onImportClick: () => void;
  isSupabaseActive: boolean;
  onOpenSupabaseConfig: () => void;
  totalLinksCount: number;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onBackup,
  onImportClick,
  isSupabaseActive,
  onOpenSupabaseConfig,
  totalLinksCount,
}) => {
  return (
    <header className="bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 text-white shadow-[0_12px_30px_rgba(0,0,0,0.35)] border-b-4 border-amber-400 relative overflow-hidden">
      {/* Subtle 3D Background Lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Application Title */}
          <div className="flex items-center gap-4 text-center md:text-left">
            {/* 3D Framed Emblem Logo */}
            <div className="relative group shrink-0">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
              <div className="relative bg-slate-900/90 p-2 sm:p-2.5 rounded-2xl border border-white/20 backdrop-blur-md shadow-[0_8px_16px_rgba(0,0,0,0.4)] flex items-center justify-center">
                <img
                  src="https://iili.io/KDFk4fI.png"
                  alt="Logo SMPN 7 Pasuruan"
                  className="w-12 h-12 sm:w-14 sm:h-14 object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] transform group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // fallback icon if offline
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            </div>

            {/* School & App Names */}
            <div>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <span className="bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-widest px-2 py-0.5 rounded shadow">
                  SMPN 7 PASURAN
                </span>
                <span className="text-xs text-amber-300 font-semibold tracking-wide hidden sm:inline-block">
                  Pemerintah Kota Pasuruan
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1 drop-shadow-md flex items-center gap-2 justify-center md:justify-start">
                ADMINISTRASI BK SMPN 7 PASURAN
              </h1>

              <p className="text-xs font-semibold text-blue-200 mt-0.5 flex items-center gap-1.5 justify-center md:justify-start">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                DASHBOARD INTEGRASI APLIKASI & AGENDA KERJA GURU BK
              </p>
            </div>
          </div>

          {/* Action Bar: Backup, Upload, Supabase Pill */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-2.5">
            
            {/* Public Access Badge */}
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 px-3 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-sm shadow-[0_4px_12px_rgba(16,185,129,0.15)]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Akses Publik (Tanpa Login)</span>
            </div>

            {/* Supabase Status Button */}
            <button
              onClick={onOpenSupabaseConfig}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md transform hover:-translate-y-0.5 active:translate-y-0 ${
                isSupabaseActive
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white ring-2 ring-emerald-400/40 shadow-emerald-900/40'
                  : 'bg-amber-500/20 text-amber-200 border border-amber-400/40 hover:bg-amber-500/30'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-amber-300" />
              <span>{isSupabaseActive ? 'Database Supabase Aktif' : 'Atur Supabase'}</span>
            </button>

            {/* Backup Links JSON Button */}
            <button
              onClick={onBackup}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold backdrop-blur-md shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              title="Unduh file backup JSON seluruh tombol aplikasi link"
            >
              <Download className="w-3.5 h-3.5 text-amber-300" />
              <span>Backup Link</span>
            </button>

            {/* Import JSON Button */}
            <button
              onClick={onImportClick}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-black shadow-lg shadow-amber-400/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              title="Upload file JSON backup link aplikasi"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Link</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
