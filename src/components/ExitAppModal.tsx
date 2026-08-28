import React from 'react';
import { LogOut, X, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { getActiveGuruBK } from '../lib/guruBk';
import { LOGO_BK_BASE64 } from '../lib/logo';

interface ExitAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmExit: () => void;
}

export const ExitAppModal: React.FC<ExitAppModalProps> = ({
  isOpen,
  onClose,
  onConfirmExit
}) => {
  if (!isOpen) return null;

  const activeGuru = getActiveGuruBK();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header decoration */}
        <div className="h-2 w-full bg-gradient-to-r from-red-500 via-rose-500 to-amber-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 text-center space-y-4">
          {/* Animated Icon Circle */}
          <div className="mx-auto w-16 h-16 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shadow-inner">
            <LogOut className="w-8 h-8 stroke-[2.2]" />
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              Keluar dari Aplikasi BK?
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              Apakah Anda yakin ingin mengakhiri sesi kerja pada sistem <strong>SABDA BK SPANJU</strong>?
            </p>
          </div>

          {/* Active Profile & Data Safety Notice Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-left space-y-2">
            <div className="flex items-center gap-2.5">
              <img
                src={LOGO_BK_BASE64}
                alt="Logo BK"
                className="w-8 h-8 rounded-lg object-contain bg-white p-0.5 border border-slate-200"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://i.ibb.co/W4w3pQ3v/logo-konselor.jpg";
                }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-800 truncate">{activeGuru.nama}</p>
                <p className="text-[10px] text-slate-500 font-mono">Konselor / Guru BK Aktif</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/80 flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Semua data & catatan tersimpan aman di database.</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 transition-colors cursor-pointer"
            >
              Batal / Tetap di Sini
            </button>
            <button
              type="button"
              onClick={onConfirmExit}
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-md shadow-red-500/20 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Ya, Keluar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
