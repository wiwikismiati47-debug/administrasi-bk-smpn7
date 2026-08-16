import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Laptop,
  Apple,
  DownloadCloud,
  CheckCircle2,
  Share2,
  MoreVertical,
  PlusSquare,
  Globe,
  Sparkles
} from 'lucide-react';

interface InstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: any;
  onDirectInstall: () => void;
}

export const InstallGuideModal: React.FC<InstallGuideModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onDirectInstall,
}) => {
  // Detect device automatically
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'laptop'>(() => {
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
      if (/android/i.test(ua)) return 'android';
      if (/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream) return 'ios';
      if (/Win|Mac|Linux|X11/.test(ua)) return 'laptop';
    }
    return 'laptop';
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/75 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[88vh] my-auto">
        {/* Header with App Logo & Title */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white p-4 sm:p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-2xl p-1 shadow-lg flex items-center justify-center shrink-0 border-2 border-amber-400">
              <img
                src="https://image2url.com/r2/default/images/1772189169508-8d8beaf3-1640-4a9f-bf4f-ebdeb6048a5b.png"
                alt="Logo BK Peduli"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://iili.io/KDFk4fI.png";
                }}
              />
            </div>
            <div>
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full shadow-sm">
                Instal Aplikasi Resmi
              </span>
              <h3 className="text-base sm:text-lg font-black text-white mt-1 leading-tight">
                SABDA BK SPANJU
              </h3>
              <p className="text-[11px] sm:text-xs text-blue-100 font-medium">
                Ikon Logo BK Peduli di HP Anda
              </p>
            </div>
          </div>
        </div>

        {/* 1-Click Direct Install Banner (Top Priority for Mobile) */}
        <div className="p-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-inner flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-left w-full sm:w-auto">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-amber-200 animate-pulse" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-black text-white">
                {deferredPrompt ? 'Pemasangan Instan Tersedia!' : 'Instal ke Layar Utama'}
              </p>
              <p className="text-[11px] text-amber-100">
                {deferredPrompt ? 'Klik tombol di samping untuk langsung pasang.' : 'Ikuti panduan mudah 1 detik di bawah ini.'}
              </p>
            </div>
          </div>

          {deferredPrompt && (
            <button
              onClick={onDirectInstall}
              className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-amber-50 text-amber-950 font-black text-xs rounded-xl shadow-lg active:scale-95 transition-all shrink-0 cursor-pointer flex items-center justify-center gap-2"
            >
              <DownloadCloud className="w-4 h-4 text-amber-600" />
              <span>PASANG SEKARANG</span>
            </button>
          )}
        </div>

        {/* Device Selection Tabs (Optimized for Mobile Touch) */}
        <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-100 text-xs font-bold text-slate-600">
          <button
            onClick={() => setActiveTab('android')}
            className={`py-3 px-1 flex flex-col sm:flex-row items-center justify-center gap-1 border-b-2 transition-all cursor-pointer ${
              activeTab === 'android'
                ? 'border-blue-600 text-blue-700 bg-white shadow-sm'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-[11px] sm:text-xs">Android</span>
          </button>

          <button
            onClick={() => setActiveTab('ios')}
            className={`py-3 px-1 flex flex-col sm:flex-row items-center justify-center gap-1 border-b-2 transition-all cursor-pointer ${
              activeTab === 'ios'
                ? 'border-blue-600 text-blue-700 bg-white shadow-sm'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Apple className="w-4 h-4 text-slate-800 shrink-0" />
            <span className="text-[11px] sm:text-xs">iPhone / iPad</span>
          </button>

          <button
            onClick={() => setActiveTab('laptop')}
            className={`py-3 px-1 flex flex-col sm:flex-row items-center justify-center gap-1 border-b-2 transition-all cursor-pointer ${
              activeTab === 'laptop'
                ? 'border-blue-600 text-blue-700 bg-white shadow-sm'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Laptop className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="text-[11px] sm:text-xs">Laptop / PC</span>
          </button>
        </div>

        {/* Guide Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 text-xs sm:text-sm text-slate-700 flex-1">
          {/* Android Guide */}
          {activeTab === 'android' && (
            <div className="space-y-3">
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-emerald-900 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Paling mudah menggunakan Google Chrome di HP Android Anda</span>
              </div>

              <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                  1
                </span>
                <div>
                  <p className="font-bold text-slate-900">Ketuk Menu Titik Tiga ( ⋮ )</p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Lihat di sudut <strong>kanan atas</strong> browser Google Chrome HP Anda.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                  2
                </span>
                <div>
                  <p className="font-bold text-slate-900">
                    Pilih "Instal Aplikasi" / "Tambahkan ke Layar Utama"
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Atau cari menu <strong>"Tambahkan ke Layar Utama" (Add to Home screen)</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                  3
                </span>
                <div>
                  <p className="font-bold text-slate-900">Konfirmasi "Instal"</p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Ikon <strong>Logo BK Peduli</strong> akan langsung muncul di menu HP Anda dan siap dibuka layaknya aplikasi Play Store!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* iOS / iPhone Guide */}
          {activeTab === 'ios' && (
            <div className="space-y-3">
              <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl text-blue-900 text-xs font-bold flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Buka melalui browser Safari di iPhone atau iPad Anda</span>
              </div>

              <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                  1
                </span>
                <div>
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    Tekan Tombol Bagikan <Share2 className="w-4 h-4 text-blue-600 inline" />
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Ketuk ikon kotak berpanah ke atas di bilah menu bagian bawah Safari.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                  2
                </span>
                <div>
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    Pilih "Tambah ke Layar Utama" <PlusSquare className="w-4 h-4 text-slate-700 inline" />
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Geser menu ke bawah dan pilih <strong>"Add to Home Screen"</strong> (Tambah ke Layar Utama).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                  3
                </span>
                <div>
                  <p className="font-bold text-slate-900">Ketuk "Tambah" (Add)</p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Selesai! <strong>Logo BK Peduli</strong> terpampang cantik di layar utama iPhone Anda.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Laptop / PC Guide */}
          {activeTab === 'laptop' && (
            <div className="space-y-3">
              <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl text-blue-900 text-xs font-bold flex items-center gap-2">
                <Laptop className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Pasang aplikasi di komputer/laptop untuk akses mandiri seperti aplikasi desktop</span>
              </div>

              <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                  1
                </span>
                <div>
                  <p className="font-bold text-slate-900">Buka Google Chrome atau Microsoft Edge</p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Gunakan browser Chrome atau Edge di Laptop/Komputer Anda.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                  2
                </span>
                <div>
                  <p className="font-bold text-slate-900">Klik Ikon Instal (Address Bar) atau Menu Titik Tiga ( ⋮ )</p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Klik ikon komputer/panah ke bawah di ujung kanan kolom alamat URL, atau klik menu titik tiga di kanan atas lalu pilih <strong>"Instal SABDA BK SPANJU..."</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                  3
                </span>
                <div>
                  <p className="font-bold text-slate-900">Klik "Instal"</p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Aplikasi akan terpasang di Desktop & Taskbar laptop dengan <strong>Logo BK Peduli</strong> dan terbuka di jendela mandiri yang luas tanpa tab browser!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* App Icon Preview */}
          <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl p-1 shadow border border-slate-200 shrink-0 flex items-center justify-center">
              <img
                src="https://image2url.com/r2/default/images/1772189169508-8d8beaf3-1640-4a9f-bf4f-ebdeb6048a5b.png"
                alt="BK Peduli Icon"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://iili.io/KDFk4fI.png";
                }}
              />
            </div>
            <div className="text-xs text-slate-700">
              <p className="font-bold text-blue-900">Logo Resmi BK Peduli</p>
              <p className="text-slate-600 text-[11px]">
                Akses instan tanpa browser, bekerja offline dengan penyimpanan aman.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-black text-xs rounded-xl shadow transition-colors cursor-pointer"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};

