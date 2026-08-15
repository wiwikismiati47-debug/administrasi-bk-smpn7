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
  Globe
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
  const [activeTab, setActiveTab] = useState<'android' | 'laptop' | 'ios'>('android');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with App Logo & Title */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 bg-white rounded-2xl p-1.5 shadow-md flex items-center justify-center shrink-0 border-2 border-amber-400">
              <img
                src="/logo-bk-peduli.png"
                alt="Logo BK Peduli"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full shadow-sm">
                Aplikasi PWA Resmi
              </span>
              <h3 className="text-lg font-black text-white mt-1 leading-tight">
                SABDA BK SPANJU
              </h3>
              <p className="text-xs text-blue-100 font-medium">
                Ikon Aplikasi: Logo BK Peduli (SMPN 7 Pasuruan)
              </p>
            </div>
          </div>
        </div>

        {/* Quick 1-Click Install Button if Supported */}
        {deferredPrompt && (
          <div className="p-4 bg-amber-50 border-b border-amber-200 flex items-center justify-between gap-3">
            <div className="text-xs text-amber-900 font-medium">
              <p className="font-bold text-amber-950 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Siap Diinstal Langsung!
              </p>
              Klik tombol untuk memasang ke layar utama / desktop Anda.
            </div>
            <button
              onClick={onDirectInstall}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-black rounded-xl shadow-md active:scale-95 transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
            >
              <DownloadCloud className="w-4 h-4" />
              <span>Pasang Sekarang</span>
            </button>
          </div>
        )}

        {/* Device Selection Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-600">
          <button
            onClick={() => setActiveTab('android')}
            className={`flex-1 py-3 px-2 flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'android'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <span>HP Android</span>
          </button>

          <button
            onClick={() => setActiveTab('laptop')}
            className={`flex-1 py-3 px-2 flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'laptop'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Laptop className="w-4 h-4 text-blue-600" />
            <span>Laptop / PC</span>
          </button>

          <button
            onClick={() => setActiveTab('ios')}
            className={`flex-1 py-3 px-2 flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'ios'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Apple className="w-4 h-4 text-slate-800" />
            <span>iPhone / iPad</span>
          </button>
        </div>

        {/* Guide Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-sm text-slate-700 flex-1">
          {/* Android Guide */}
          {activeTab === 'android' && (
            <div className="space-y-3.5">
              <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                  1
                </span>
                <div>
                  <p className="font-bold text-slate-900">Buka Browser Chrome</p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Akses aplikasi di browser Google Chrome pada smartphone Android Anda.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                  2
                </span>
                <div>
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    Klik Titik Tiga <MoreVertical className="w-4 h-4 text-slate-700 inline" /> di Kanan Atas
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Buka menu opsi browser di sudut kanan atas layar HP Anda.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                  3
                </span>
                <div>
                  <p className="font-bold text-slate-900">
                    Pilih "Instal Aplikasi" atau "Tambahkan ke Layar Utama"
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Ikon <strong>Logo BK Peduli</strong> akan otomatis muncul di layar utama (home screen) HP Anda seperti aplikasi bawaan Play Store.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Laptop / PC Guide */}
          {activeTab === 'laptop' && (
            <div className="space-y-3.5">
              <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                  1
                </span>
                <div>
                  <p className="font-bold text-slate-900">Buka Chrome atau Microsoft Edge</p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Buka link aplikasi di browser Chrome atau Edge di Laptop/Komputer Anda.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                  2
                </span>
                <div>
                  <p className="font-bold text-slate-900">
                    Klik Ikon Instal di Kolom Alamat (Address Bar)
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Di ujung kanan kolom URL browser, klik ikon monitor / tanda panah ke bawah (Instal SABDA BK SPANJU).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                  3
                </span>
                <div>
                  <p className="font-bold text-slate-900">Selesai & Muncul di Desktop</p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Aplikasi akan terpasang di Desktop & Taskbar laptop dengan icon <strong>Logo BK Peduli</strong> dan bisa dibuka langsung dalam jendela mandiri tanpa address bar.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* iOS / iPhone Guide */}
          {activeTab === 'ios' && (
            <div className="space-y-3.5">
              <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                  1
                </span>
                <div>
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    Buka di Safari <Globe className="w-4 h-4 text-blue-500 inline" />
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Pastikan Anda membuka tautan aplikasi melalui browser Safari di iPhone/iPad.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                  2
                </span>
                <div>
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    Tekan Tombol Share <Share2 className="w-4 h-4 text-blue-600 inline" />
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Klik tombol "Bagikan" (ikon kotak dengan panah ke atas) di bilah bawah Safari.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                  3
                </span>
                <div>
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    Pilih "Tambah ke Layar Utama" <PlusSquare className="w-4 h-4 text-slate-700 inline" />
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Scroll ke bawah dan pilih <strong>"Add to Home Screen"</strong> (Tambah ke Layar Utama). Ikon <strong>Logo BK Peduli</strong> akan langsung muncul di home screen iPhone Anda.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* App Icon Preview Card */}
          <div className="mt-4 p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-xl p-1 shadow border border-slate-200 shrink-0 flex items-center justify-center">
              <img
                src="/logo-bk-peduli.png"
                alt="BK Peduli Icon"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-xs text-slate-700">
              <p className="font-bold text-blue-900">Icon: Logo BK Peduli</p>
              <p className="text-slate-600 text-[11px]">
                Ikon resmi hijau-kuning BK Peduli SMPN 7 Pasuruan akan tampil di layar perangkat Anda.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow transition-colors cursor-pointer"
          >
            Mengerti
          </button>
        </div>
      </div>
    </div>
  );
};
