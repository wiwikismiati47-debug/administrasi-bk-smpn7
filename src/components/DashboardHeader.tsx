import React from 'react';
import { GuruBkSelector } from './GuruBkSelector';
import { InstallGuideModal } from './InstallGuideModal';
import { LOGO_BK_BASE64 } from '../lib/logo';
import {
  Database,
  RefreshCw,
  Menu,
  Sparkles,
  Download,
  Upload,
  Settings,
  Smartphone,
  CheckCircle2,
  BookOpen
} from 'lucide-react';

interface DashboardHeaderProps {
  onBackup: () => void;
  onImportClick: () => void;
  isSupabaseActive: boolean;
  onOpenSupabaseConfig: () => void;
  totalLinksCount: number;
  onRefreshData?: () => void;
  isSyncing?: boolean;
  onToggleMobileMenu?: () => void;
  isMobileMenuOpen?: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onBackup,
  onImportClick,
  isSupabaseActive,
  onOpenSupabaseConfig,
  totalLinksCount,
  onRefreshData,
  isSyncing = false,
  onToggleMobileMenu,
}) => {
  const [deferredPrompt, setDeferredPrompt] = React.useState<any>(null);
  const [isInstallable, setIsInstallable] = React.useState(false);
  const [isInstallGuideOpen, setIsInstallGuideOpen] = React.useState(false);

  React.useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
      setIsInstallGuideOpen(false);
      alert('Selamat! SABDA BK SPANJU berhasil diinstal di perangkat Anda.');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = () => {
    setIsInstallGuideOpen(true);
  };

  const handleDirectInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
      setDeferredPrompt(null);
      setIsInstallGuideOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-sm transition-all">
      {/* Top Accent Stripe */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />

      <div className="max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-3">
          
          {/* Left: Mobile Menu Toggle & Brand Logo */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            {/* Mobile Menu Button (< lg) */}
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:text-blue-600 hover:bg-slate-100 active:bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Buka Menu Navigasi"
              title="Buka Menu Navigasi"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* School Logo Emblem */}
            <div className="relative shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-50 border border-slate-200 p-1 flex items-center justify-center shadow-sm">
                <img
                  src={LOGO_BK_BASE64}
                  alt="Logo SABDA BK SPANJU SMPN 7 Pasuruan"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://i.ibb.co/W4w3pQ3v/logo-konselor.jpg";
                  }}
                />
              </div>
            </div>

            {/* Brand Title & School Info */}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-base sm:text-lg lg:text-xl font-black tracking-tight text-slate-900 leading-tight truncate">
                  SABDA BK SPANJU
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  SMPN 7 PASURUAN
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate flex items-center gap-1">
                <span className="text-blue-600 font-semibold hidden md:inline">Sistem Administrasi BK Digital</span>
                <span className="hidden md:inline">•</span>
                <span className="italic text-slate-600 truncate">"Data Tertata, Layanan Berkualitas"</span>
              </p>
            </div>
          </div>

          {/* Right: Quick Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Guru BK Selector */}
            <GuruBkSelector />

            {/* Supabase Status Chip & Quick Refresh */}
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 rounded-xl px-2.5 py-1.5 shadow-sm">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  {isSupabaseActive && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  )}
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${isSupabaseActive ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                </span>
                <span className="text-xs font-semibold text-slate-700 hidden md:inline">
                  {isSupabaseActive ? 'Supabase Cloud' : 'Database Lokal'}
                </span>
              </div>

              {onRefreshData && (
                <button
                  onClick={onRefreshData}
                  disabled={isSyncing}
                  className={`p-1 text-slate-500 hover:text-blue-600 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer ${
                    isSyncing ? 'animate-spin text-blue-600' : ''
                  }`}
                  title="Sinkronisasi & Refresh Data Cloud"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Mobile Sync Button (compact for small screens) */}
            {onRefreshData && (
              <button
                onClick={onRefreshData}
                disabled={isSyncing}
                className="sm:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
                title="Refresh Data"
              >
                <RefreshCw className={`w-4 h-4 text-slate-600 ${isSyncing ? 'animate-spin text-blue-600' : ''}`} />
              </button>
            )}

            {/* Install PWA Button */}
            <button
              onClick={handleInstallClick}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs font-bold shadow-sm active:scale-95 transition-all cursor-pointer"
              title="Instal Aplikasi di HP atau Laptop"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Instal App</span>
            </button>

            {/* Supabase Config / Settings Trigger */}
            <button
              onClick={onOpenSupabaseConfig}
              className="p-2 rounded-xl text-slate-700 hover:text-blue-600 hover:bg-slate-100 border border-slate-200 transition-colors"
              title="Pengaturan Database Supabase"
            >
              <Settings className="w-4 h-4 text-slate-600" />
            </button>
          </div>

        </div>
      </div>

      {/* Install Guide Modal */}
      <InstallGuideModal
        isOpen={isInstallGuideOpen}
        onClose={() => setIsInstallGuideOpen(false)}
        deferredPrompt={deferredPrompt}
        onDirectInstall={deferredPrompt ? handleDirectInstall : undefined}
      />
    </header>
  );
};
