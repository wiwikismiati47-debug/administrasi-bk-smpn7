import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AgendaKerja, FormAgendaData, UndanganOrangTua, FormUndanganData, HomeVisit, FormHomeVisitData, AppLink } from './types';
import {
  fetchAllAgenda,
  saveOrUpdateAgenda,
  deleteAgendaItem,
  fetchAllUndangan,
  saveOrUpdateUndangan,
  deleteUndanganItem,
  fetchAllHomeVisit,
  saveOrUpdateHomeVisit,
  deleteHomeVisitItem,
} from './lib/supabase';
import {
  getSavedAppLinks,
  resetDefaultAppLinks,
  saveAppLinksToStorage,
  exportLinksBackupJSON,
  parseLinksBackupJSON,
} from './lib/appLinksManager';
import { DashboardHeader } from './components/DashboardHeader';
import { SidebarMenu } from './components/SidebarMenu';
import { MainAppViewer } from './components/MainAppViewer';
import { LinkModal } from './components/LinkModal';
import { SupabaseSettingsModal } from './components/SupabaseSettingsModal';
import {
  CheckCircle2,
  Info
} from 'lucide-react';

export default function App() {
  // App links state
  const [links, setLinks] = useState<AppLink[]>([]);
  const [selectedLink, setSelectedLink] = useState<AppLink | null>(null);
  
  // Agenda BK state
  const [agendaItems, setAgendaItems] = useState<AgendaKerja[]>([]);
  const [isLoadingAgenda, setIsLoadingAgenda] = useState<boolean>(true);
  const [isSubmittingAgenda, setIsSubmittingAgenda] = useState<boolean>(false);

  // Undangan Orang Tua state
  const [undanganItems, setUndanganItems] = useState<UndanganOrangTua[]>([]);
  const [isLoadingUndangan, setIsLoadingUndangan] = useState<boolean>(true);
  const [isSubmittingUndangan, setIsSubmittingUndangan] = useState<boolean>(false);

  // Home Visit state
  const [homeVisitItems, setHomeVisitItems] = useState<HomeVisit[]>([]);
  const [isLoadingHomeVisit, setIsLoadingHomeVisit] = useState<boolean>(true);
  const [isSubmittingHomeVisit, setIsSubmittingHomeVisit] = useState<boolean>(false);

  // Connection state
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(false);

  // Modals state
  const [isLinkModalOpen, setIsLinkModalOpen] = useState<boolean>(false);
  const [editingLink, setEditingLink] = useState<AppLink | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Hidden file input ref for JSON backup upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // 1. Initial Load App Links
  useEffect(() => {
    const saved = getSavedAppLinks();
    setLinks(saved);
    if (saved.length > 0) {
      setSelectedLink(saved[0]);
    }
  }, []);

  // 2. Load Agenda & Undangan Data
  const loadAgendaData = useCallback(async () => {
    setIsLoadingAgenda(true);
    try {
      const res = await fetchAllAgenda();
      setAgendaItems(res.data);
      setIsSupabaseConnected(res.isFromSupabase);
      if (res.error) {
        showToast(res.error, 'info');
      }
    } catch (err) {
      console.error(err);
      showToast('Gagal memuat data agenda BK.', 'error');
    } finally {
      setIsLoadingAgenda(false);
    }
  }, []);

  const loadUndanganData = useCallback(async () => {
    setIsLoadingUndangan(true);
    try {
      const res = await fetchAllUndangan();
      setUndanganItems(res.data);
      if (res.isFromSupabase) {
        setIsSupabaseConnected(true);
      }
    } catch (err) {
      console.error(err);
      showToast('Gagal memuat data undangan orang tua.', 'error');
    } finally {
      setIsLoadingUndangan(false);
    }
  }, []);

  const loadHomeVisitData = useCallback(async () => {
    setIsLoadingHomeVisit(true);
    try {
      const res = await fetchAllHomeVisit();
      setHomeVisitItems(res.data);
      if (res.isFromSupabase) {
        setIsSupabaseConnected(true);
      }
    } catch (err) {
      console.error(err);
      showToast('Gagal memuat data home visit.', 'error');
    } finally {
      setIsLoadingHomeVisit(false);
    }
  }, []);

  const refreshAllData = useCallback(async () => {
    await Promise.all([loadAgendaData(), loadUndanganData(), loadHomeVisitData()]);
  }, [loadAgendaData, loadUndanganData, loadHomeVisitData]);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  // Handle Agenda submit
  const handleSubmitAgenda = async (data: Partial<AgendaKerja> & FormAgendaData) => {
    setIsSubmittingAgenda(true);
    try {
      const res = await saveOrUpdateAgenda(data);
      if (res.success) {
        await loadAgendaData();
        showToast(
          data.id
            ? 'Data Agenda Kerja BK berhasil diperbarui!'
            : 'Data Agenda Kerja BK berhasil disimpan!',
          'success'
        );
      } else {
        showToast('Gagal menyimpan agenda.', 'error');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan';
      showToast(`Error: ${msg}`, 'error');
    } finally {
      setIsSubmittingAgenda(false);
    }
  };

  // Handle Agenda delete
  const handleDeleteAgenda = async (id: string) => {
    try {
      const res = await deleteAgendaItem(id);
      if (res.success) {
        await loadAgendaData();
        showToast('Data Agenda berhasil dihapus.', 'success');
      }
    } catch {
      showToast('Gagal menghapus data agenda.', 'error');
    }
  };

  // Handle Undangan submit
  const handleSubmitUndangan = async (data: Partial<UndanganOrangTua> & FormUndanganData) => {
    setIsSubmittingUndangan(true);
    try {
      const res = await saveOrUpdateUndangan(data);
      if (res.success) {
        await loadUndanganData();
        showToast(
          data.id
            ? 'Data Undangan Orang Tua berhasil diperbarui!'
            : 'Data Undangan Orang Tua berhasil disimpan!',
          'success'
        );
      } else {
        showToast('Gagal menyimpan undangan orang tua.', 'error');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan';
      showToast(`Error: ${msg}`, 'error');
    } finally {
      setIsSubmittingUndangan(false);
    }
  };

  // Handle Undangan delete
  const handleDeleteUndangan = async (id: string) => {
    try {
      const res = await deleteUndanganItem(id);
      if (res.success) {
        await loadUndanganData();
        showToast('Data Undangan Orang Tua berhasil dihapus.', 'success');
      }
    } catch {
      showToast('Gagal menghapus data undangan orang tua.', 'error');
    }
  };

  // Handle Home Visit submit
  const handleSubmitHomeVisit = async (data: Partial<HomeVisit> & FormHomeVisitData) => {
    setIsSubmittingHomeVisit(true);
    try {
      const res = await saveOrUpdateHomeVisit(data);
      if (res.success) {
        await loadHomeVisitData();
        showToast(
          data.id
            ? 'Data Home Visit / Kunjungan Rumah berhasil diperbarui!'
            : 'Data Home Visit / Kunjungan Rumah berhasil disimpan!',
          'success'
        );
      } else {
        showToast('Gagal menyimpan data home visit.', 'error');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan';
      showToast(`Error: ${msg}`, 'error');
    } finally {
      setIsSubmittingHomeVisit(false);
    }
  };

  // Handle Home Visit delete
  const handleDeleteHomeVisit = async (id: string) => {
    try {
      const res = await deleteHomeVisitItem(id);
      if (res.success) {
        await loadHomeVisitData();
        showToast('Data Home Visit berhasil dihapus.', 'success');
      }
    } catch {
      showToast('Gagal menghapus data home visit.', 'error');
    }
  };

  // --- APP LINK MANAGER HANDLERS ---
  const handleSaveLink = (linkToSave: AppLink) => {
    const existingIndex = links.findIndex((l) => l.id === linkToSave.id);
    let updated: AppLink[];
    if (existingIndex >= 0) {
      updated = [...links];
      updated[existingIndex] = linkToSave;
      showToast(`Tombol "${linkToSave.title}" berhasil diperbarui!`, 'success');
    } else {
      updated = [...links, linkToSave];
      showToast(`Tombol "${linkToSave.title}" berhasil ditambahkan!`, 'success');
    }
    setLinks(updated);
    saveAppLinksToStorage(updated);
    setSelectedLink(linkToSave);
  };

  const handleDeleteLink = (id: string) => {
    const target = links.find((l) => l.id === id);
    if (target?.isInternal) {
      alert('Tombol aplikasi internal utama tidak dapat dihapus.');
      return;
    }
    if (window.confirm(`Yakin ingin menghapus tombol menu "${target?.title}"?`)) {
      const updated = links.filter((l) => l.id !== id);
      setLinks(updated);
      saveAppLinksToStorage(updated);
      if (selectedLink?.id === id && updated.length > 0) {
        setSelectedLink(updated[0]);
      }
      showToast('Tombol menu aplikasi dihapus.', 'info');
    }
  };

  // Backup & Import Handlers
  const handleResetDefaultLinks = () => {
    if (window.confirm('Reset daftar menu aplikasi kembali ke susunan awal BK SMPN 7 Pasuruan?')) {
      const defaults = resetDefaultAppLinks();
      setLinks(defaults);
      setSelectedLink(defaults[0]);
      showToast('Menu aplikasi BK berhasil di-reset ke susunan awal!', 'success');
    }
  };

  const handleBackupLinks = () => {
    exportLinksBackupJSON(links);
    showToast('File backup menu aplikasi berhasil diunduh!', 'success');
  };

  const handleTriggerImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileUploadJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const parsed = parseLinksBackupJSON(content);
        if (parsed && parsed.length > 0) {
          setLinks(parsed);
          saveAppLinksToStorage(parsed);
          setSelectedLink(parsed[0]);
          showToast(`Berhasil mengunggah & memulihkan ${parsed.length} link menu aplikasi!`, 'success');
        } else {
          alert('Format file JSON tidak valid atau kosong.');
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-amber-400 selection:text-slate-950">
      
      {/* Hidden File Input for JSON Backup */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".json,application/json"
        onChange={handleFileUploadJSON}
        className="hidden"
      />

      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-slideDown max-w-md print:hidden">
          <div
            className={`p-4 rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.5)] border flex items-center gap-3 text-xs sm:text-sm font-bold text-white backdrop-blur-md ${
              toast.type === 'success'
                ? 'bg-emerald-600/95 border-emerald-400'
                : toast.type === 'error'
                ? 'bg-red-600/95 border-red-400'
                : 'bg-purple-600/95 border-purple-400'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 text-amber-300" />
            ) : (
              <Info className="w-5 h-5 shrink-0 text-purple-200" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* 3D Header with Logo */}
      <div className="print:hidden">
        <DashboardHeader
          onBackup={handleBackupLinks}
          onImportClick={handleTriggerImport}
          isSupabaseActive={isSupabaseConnected}
          onOpenSupabaseConfig={() => setIsSettingsOpen(true)}
          totalLinksCount={links.length}
        />
      </div>

      {/* Main Container Layout */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 print:p-0 print:m-0 print:max-w-none print:block">
        
        {/* Left Sidebar Menu */}
        <div className="print:hidden w-full lg:w-88 xl:w-96 shrink-0">
          <SidebarMenu
            links={links}
            selectedLink={selectedLink}
            onSelectLink={(link) => setSelectedLink(link)}
            onAddLink={() => {
              setEditingLink(null);
              setIsLinkModalOpen(true);
            }}
            onEditLink={(link) => {
              setEditingLink(link);
              setIsLinkModalOpen(true);
            }}
            onDeleteLink={handleDeleteLink}
            onBackup={handleBackupLinks}
            onImportClick={handleTriggerImport}
            onResetDefault={handleResetDefaultLinks}
          />
        </div>

        {/* Right Application Viewer */}
        <MainAppViewer
          selectedLink={selectedLink}
          agendaItems={agendaItems}
          isLoadingAgenda={isLoadingAgenda}
          isSubmittingAgenda={isSubmittingAgenda}
          onSubmitAgenda={handleSubmitAgenda}
          onDeleteAgenda={handleDeleteAgenda}
          undanganItems={undanganItems}
          isLoadingUndangan={isLoadingUndangan}
          isSubmittingUndangan={isSubmittingUndangan}
          onSubmitUndangan={handleSubmitUndangan}
          onDeleteUndangan={handleDeleteUndangan}
          homeVisitItems={homeVisitItems}
          isLoadingHomeVisit={isLoadingHomeVisit}
          isSubmittingHomeVisit={isSubmittingHomeVisit}
          onSubmitHomeVisit={handleSubmitHomeVisit}
          onDeleteHomeVisit={handleDeleteHomeVisit}
          isSupabaseConnected={isSupabaseConnected}
          onRefreshData={refreshAllData}
          onOpenSupabaseConfig={() => setIsSettingsOpen(true)}
        />

      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-5 text-center text-xs text-slate-400 print:hidden">
        <div className="max-w-[1700px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-bold text-slate-300">
            ADMINISTRASI BK SMPN 7 PASURAN © 2026
          </p>
          <p className="text-slate-500 text-[11px]">
            Sistem Integrasi Menu Aplikasi, Agenda Kerja & Undangan Orang Tua Guru BK • Supabase Cloud Ready
          </p>
        </div>
      </footer>

      {/* Link Add/Edit Modal */}
      <LinkModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        onSave={handleSaveLink}
        editingLink={editingLink}
      />

      {/* Supabase Settings Modal */}
      <SupabaseSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onConfigSaved={refreshAllData}
      />

    </div>
  );
}
