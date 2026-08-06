import React from 'react';
import { BookOpen, Database, ShieldCheck, School, Sparkles } from 'lucide-react';

interface HeaderProps {
  isSupabaseConnected: boolean;
  onOpenSupabaseConfig: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isSupabaseConnected, onOpenSupabaseConfig }) => {
  return (
    <header className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-xl border-b-4 border-amber-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & School Name */}
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="bg-white/10 p-3.5 rounded-2xl border border-white/20 backdrop-blur-md shadow-inner flex items-center justify-center shrink-0">
              <School className="w-10 h-10 text-amber-300" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-amber-300 font-semibold">
                Pemerintah Kota Pasuruan • Dinas Pendidikan & Kebudayaan
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2 justify-center md:justify-start">
                SMP NEGERI 7 PASURAN
              </h1>
              <p className="text-sm font-medium text-blue-200 mt-0.5 flex items-center gap-1.5 justify-center md:justify-start">
                <BookOpen className="w-4 h-4 text-amber-400" />
                ADMINISTRASI BIMBINGAN KONSELING (BK)
              </p>
            </div>
          </div>

          {/* Right Status Pill & Badges */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-2.5">
            {/* Public Access Badge */}
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 px-3 py-1.5 rounded-full text-xs font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Akses Publik (Tanpa Login)</span>
            </div>

            {/* Supabase Connection Button/Status */}
            <button
              onClick={onOpenSupabaseConfig}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shadow-sm ${
                isSupabaseConnected
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white ring-2 ring-emerald-400/50'
                  : 'bg-amber-500/20 text-amber-200 border border-amber-500/40 hover:bg-amber-500/30'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>
                {isSupabaseConnected ? 'Database Supabase Aktif' : 'Atur Database Supabase'}
              </span>
              <Sparkles className="w-3 h-3 opacity-70" />
            </button>
          </div>

        </div>

        {/* Section Title Banner */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-slate-950 font-bold px-2.5 py-1 rounded text-xs tracking-wide">
              BAGIAN A
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-amber-300 tracking-wide uppercase">
              AGENDA KERJA BK
            </h2>
          </div>
          <span className="text-xs text-blue-200 hidden sm:inline-block italic">
            Format Administrasi Resmi Guru Bimbingan Konseling
          </span>
        </div>
      </div>
    </header>
  );
};
