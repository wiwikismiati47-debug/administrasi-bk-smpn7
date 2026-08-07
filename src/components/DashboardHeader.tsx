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
  const [deferredPrompt, setDeferredPrompt] = React.useState<any>(null);
  const [isInstallable, setIsInstallable] = React.useState(false);

  React.useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
      alert('Selamat! SABDA BK SPANJU berhasil diinstal di perangkat Anda.');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert(
        'SABDA BK SPANJU mendukung instalasi langsung di HP & Laptop Anda!\n\n' +
        'Langkah mudah untuk menginstal:\n' +
        '📱 Di HP Android (Chrome): Klik ikon titik tiga di kanan atas, lalu pilih "Instal aplikasi" atau "Tambahkan ke Layar Utama".\n' +
        '🍏 Di iPhone (Safari): Klik tombol "Bagikan" (Share / panah ke atas) di menu Safari bawah, lalu pilih "Tambahkan ke Layar Utama" (Add to Home Screen).\n' +
        '💻 Di Laptop / PC (Chrome/Edge): Klik ikon instalasi (tanda tambah/monitor berpanah bawah) di sebelah kanan kolom alamat (address bar) browser Anda.'
      );
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted install');
      setIsInstallable(false);
      setDeferredPrompt(null);
    }
  };

  return (
    <header className="bg-white/90 backdrop-blur-md text-slate-900 shadow-md border-b-4 border-gradient-to-r border-blue-600 relative overflow-hidden">
      {/* Decorative Gradient Top Stripe */}
      <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-purple-600 via-pink-600 to-amber-500" />

      {/* Soft Background Accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-80 h-80 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Application Title */}
          <div className="flex items-center gap-4 text-center md:text-left">
            {/* 3D Framed Emblem Logo */}
            <div className="relative group shrink-0">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-300" />
              <div className="relative bg-white p-2 sm:p-2.5 rounded-2xl border border-slate-200 shadow-lg flex items-center justify-center">
                <img
                  src="https://iili.io/KDFk4fI.png"
                  alt="Logo SMPN 7 Pasuruan"
                  className="w-12 h-12 sm:w-14 sm:h-14 object-contain filter drop-shadow-md transform group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            </div>

            {/* School & App Names */}
            <div>
              <h1 className="text-lg sm:text-2xl font-extrabold tracking-tight text-slate-900 mt-1 flex flex-col sm:flex-row sm:items-center gap-x-2 justify-center md:justify-start leading-tight">
                <span className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
                  SABDA BK SPANJU
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-500">
                  (Sistem Administrasi BK Digital dan Akuntabel) SMPN 7 PASURUAN
                </span>
              </h1>

              <p className="text-xs font-semibold text-slate-600 mt-1.5 flex items-center gap-1.5 justify-center md:justify-start">
                <BookOpen className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                <span className="italic">"Data Tertata, Layanan Berkualitas."</span>
              </p>
            </div>
          </div>

          {/* Action Bar: Backup, Upload, Supabase Pill */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-2.5">
            
            {/* Install PWA Button with School Logo Mascot */}
            <button
              onClick={handleInstallClick}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-xs font-black shadow-md shadow-orange-500/20 hover:shadow-orange-500/30 active:scale-95 transition-all cursor-pointer relative overflow-hidden group/install"
              title="Instal aplikasi SABDA BK SPANJU di HP atau Laptop Anda"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/install:translate-y-0 transition-transform duration-300" />
              <img
                src="https://iili.io/KDFk4fI.png"
                alt="Maskot"
                className="w-4 h-4 object-contain rounded-full bg-white p-0.5 shadow-sm transform group-hover/install:rotate-12 transition-transform"
              />
              <span>Instal Aplikasi</span>
              {isInstallable && (
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
              )}
            </button>

            {/* Public Access Badge */}
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Akses Publik</span>
            </div>

            {/* Supabase Status Button */}
            <button
              onClick={onOpenSupabaseConfig}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                isSupabaseActive
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-500/20'
                  : 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-amber-500" />
              <span>{isSupabaseActive ? 'Database Supabase' : 'Atur Supabase'}</span>
            </button>

            {/* Backup Links JSON Button */}
            <button
              onClick={onBackup}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold shadow-sm transition-all"
              title="Unduh file backup JSON seluruh tombol aplikasi link"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Backup Link</span>
            </button>

            {/* Import JSON Button */}
            <button
              onClick={onImportClick}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
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
