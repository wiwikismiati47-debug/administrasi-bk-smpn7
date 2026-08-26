import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  AgendaKerja,
  FormAgendaData,
  UndanganOrangTua,
  FormUndanganData,
  HomeVisit,
  FormHomeVisitData,
  RekamPermasalahan,
  FormRekamPermasalahanData,
  KonselingIndividu,
  FormKonselingIndividuData,
  KonselingKelompok,
  FormKonselingKelompokData,
  SuratPernyataan,
  FormSuratPernyataanData,
  KonferensiKasus,
  FormKonferensiKasusData,
  AppLink,
  Siswa,
  FormSiswaData,
  JurnalBK,
  FormJurnalBKData
} from './types';
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
  fetchAllRekamPermasalahan,
  saveOrUpdateRekamPermasalahan,
  deleteRekamPermasalahanItem,
  fetchAllKonselingIndividu,
  saveOrUpdateKonselingIndividu,
  deleteKonselingIndividuItem,
  fetchAllKonselingKelompok,
  saveOrUpdateKonselingKelompok,
  deleteKonselingKelompokItem,
  fetchAllSuratPernyataan,
  saveOrUpdateSuratPernyataan,
  deleteSuratPernyataanItem,
  fetchAllKonferensiKasus,
  saveOrUpdateKonferensiKasus,
  deleteKonferensiKasusItem,
  fetchSiswaList,
  saveOrUpdateSiswa,
  bulkSaveOrUpdateSiswa,
  deleteSiswaItem,
  fetchAllJurnalBK,
  saveOrUpdateJurnalBK,
  deleteJurnalBKItem,
  getSavedSupabaseConfig,
  getSupabaseClient,
  STORAGE_KEY_CONFIG
} from './lib/supabase';
import {
  getSavedAppLinks,
  resetDefaultAppLinks,
  saveAppLinksToStorage,
  exportLinksBackupJSON,
  parseLinksBackupJSON,
  STORAGE_KEY_APP_LINKS
} from './lib/appLinksManager';
import { initStorageKeys } from './lib/storageManager';
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

  // Rekam Permasalahan state
  const [rekamPermasalahanItems, setRekamPermasalahanItems] = useState<RekamPermasalahan[]>([]);
  const [isLoadingRekamPermasalahan, setIsLoadingRekamPermasalahan] = useState<boolean>(true);
  const [isSubmittingRekamPermasalahan, setIsSubmittingRekamPermasalahan] = useState<boolean>(false);

  // Konseling Individu state
  const [konselingIndividuItems, setKonselingIndividuItems] = useState<KonselingIndividu[]>([]);
  const [isLoadingKonselingIndividu, setIsLoadingKonselingIndividu] = useState<boolean>(true);
  const [isSubmittingKonselingIndividu, setIsSubmittingKonselingIndividu] = useState<boolean>(false);

  // Konseling Kelompok state
  const [konselingKelompokItems, setKonselingKelompokItems] = useState<KonselingKelompok[]>([]);
  const [isLoadingKonselingKelompok, setIsLoadingKonselingKelompok] = useState<boolean>(true);
  const [isSubmittingKonselingKelompok, setIsSubmittingKonselingKelompok] = useState<boolean>(false);

  // Surat Pernyataan Siswa state
  const [suratPernyataanItems, setSuratPernyataanItems] = useState<SuratPernyataan[]>([]);
  const [isLoadingSuratPernyataan, setIsLoadingSuratPernyataan] = useState<boolean>(true);
  const [isSubmittingSuratPernyataan, setIsSubmittingSuratPernyataan] = useState<boolean>(false);

  // Konferensi Kasus state
  const [konferensiKasusItems, setKonferensiKasusItems] = useState<KonferensiKasus[]>([]);
  const [isLoadingKonferensiKasus, setIsLoadingKonferensiKasus] = useState<boolean>(true);
  const [isSubmittingKonferensiKasus, setIsSubmittingKonferensiKasus] = useState<boolean>(false);

  // Siswa state
  const [siswaItems, setSiswaItems] = useState<Siswa[]>([]);
  const [isLoadingSiswa, setIsLoadingSiswa] = useState<boolean>(true);
  const [isSubmittingSiswa, setIsSubmittingSiswa] = useState<boolean>(false);

  // Jurnal BK state
  const [jurnalBKItems, setJurnalBKItems] = useState<JurnalBK[]>([]);
  const [isLoadingJurnalBK, setIsLoadingJurnalBK] = useState<boolean>(true);
  const [isSubmittingJurnalBK, setIsSubmittingJurnalBK] = useState<boolean>(false);

  // Connection state (Default true with permanent SMPN 7 Supabase connection)
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(true);

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

  // 1. Load Agenda & Undangan Data
  const loadAgendaData = useCallback(async () => {
    setIsLoadingAgenda(true);
    try {
      const res = await fetchAllAgenda();
      setAgendaItems(res.data);
      
      if (res.error) {
        showToast(res.error, 'info');
      }
      return res.isFromSupabase;
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
      return res.isFromSupabase;
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
      return res.isFromSupabase;
    } catch (err) {
      console.error(err);
      showToast('Gagal memuat data home visit.', 'error');
    } finally {
      setIsLoadingHomeVisit(false);
    }
  }, []);

  const loadRekamPermasalahanData = useCallback(async () => {
    setIsLoadingRekamPermasalahan(true);
    try {
      const res = await fetchAllRekamPermasalahan();
      setRekamPermasalahanItems(res.data);
      return res.isFromSupabase;
    } catch (err) {
      console.error(err);
      showToast('Gagal memuat data rekam permasalahan siswa.', 'error');
    } finally {
      setIsLoadingRekamPermasalahan(false);
    }
  }, []);

  const loadKonselingIndividuData = useCallback(async () => {
    setIsLoadingKonselingIndividu(true);
    try {
      const res = await fetchAllKonselingIndividu();
      setKonselingIndividuItems(res.data);
      return res.isFromSupabase;
    } catch (err) {
      console.error(err);
      showToast('Gagal memuat data konseling individu.', 'error');
    } finally {
      setIsLoadingKonselingIndividu(false);
    }
  }, []);

  const loadKonselingKelompokData = useCallback(async () => {
    setIsLoadingKonselingKelompok(true);
    try {
      const res = await fetchAllKonselingKelompok();
      setKonselingKelompokItems(res.data);
      return res.isFromSupabase;
    } catch (err) {
      console.error(err);
      showToast('Gagal memuat data konseling kelompok.', 'error');
    } finally {
      setIsLoadingKonselingKelompok(false);
    }
  }, []);

  const loadSuratPernyataanData = useCallback(async () => {
    setIsLoadingSuratPernyataan(true);
    try {
      const res = await fetchAllSuratPernyataan();
      setSuratPernyataanItems(res.data);
      return res.isFromSupabase;
    } catch (err) {
      console.error(err);
      showToast('Gagal memuat data surat pernyataan siswa.', 'error');
    } finally {
      setIsLoadingSuratPernyataan(false);
    }
  }, []);

  const loadKonferensiKasusData = useCallback(async () => {
    setIsLoadingKonferensiKasus(true);
    try {
      const res = await fetchAllKonferensiKasus();
      setKonferensiKasusItems(res.data);
      return res.isFromSupabase;
    } catch (err) {
      console.error(err);
      showToast('Gagal memuat data konferensi kasus siswa.', 'error');
    } finally {
      setIsLoadingKonferensiKasus(false);
    }
  }, []);

  const loadSiswaData = useCallback(async () => {
    setIsLoadingSiswa(true);
    try {
      const res = await fetchSiswaList();
      setSiswaItems(res.data);
      return res.isFromSupabase;
    } catch (err) {
      console.error(err);
      showToast('Gagal memuat data manajemen siswa.', 'error');
    } finally {
      setIsLoadingSiswa(false);
    }
  }, []);

  const loadJurnalBKData = useCallback(async () => {
    setIsLoadingJurnalBK(true);
    try {
      const res = await fetchAllJurnalBK();
      setJurnalBKItems(res.data);
      return res.isFromSupabase;
    } catch (err) {
      console.error(err);
      showToast('Gagal memuat data Jurnal BK.', 'error');
    } finally {
      setIsLoadingJurnalBK(false);
    }
  }, []);

  const refreshAllData = useCallback(async () => {
    const results = await Promise.all([
      loadAgendaData(),
      loadUndanganData(),
      loadHomeVisitData(),
      loadRekamPermasalahanData(),
      loadKonselingIndividuData(),
      loadKonselingKelompokData(),
      loadSuratPernyataanData(),
      loadKonferensiKasusData(),
      loadSiswaData(),
      loadJurnalBKData()
    ]);
    
    // Check if any load was successful from Supabase
    const connectedCount = results.filter(r => Boolean(r)).length;
    if (connectedCount > 0) {
      setIsSupabaseConnected(true);
      if (connectedCount < results.length) {
        console.warn(`Supabase terhubung (${connectedCount}/${results.length} tabel). Tabel yang belum tersedia di Supabase otomatis menggunakan penyimpanan data lokal.`);
      }
    } else {
      setIsSupabaseConnected(false);
    }
  }, [
    loadAgendaData,
    loadUndanganData,
    loadHomeVisitData,
    loadRekamPermasalahanData,
    loadKonselingIndividuData,
    loadKonselingKelompokData,
    loadSuratPernyataanData,
    loadKonferensiKasusData,
    loadSiswaData,
    loadJurnalBKData
  ]);

  useEffect(() => {
    async function initApp() {
      await initStorageKeys([
        STORAGE_KEY_CONFIG,
        STORAGE_KEY_APP_LINKS
      ]);
      const saved = getSavedAppLinks();
      setLinks(saved);
      if (saved.length > 0) {
        setSelectedLink((prev) => prev || saved[0]);
      }
      refreshAllData();
    }
    initApp();

    // Set up realtime subscription
    const config = getSavedSupabaseConfig();
    const client = getSupabaseClient(config);
    let channel: any = null;

    if (client) {
      channel = client
        .channel('schema-db-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
          },
          (payload) => {
            console.log('Realtime update received!', payload);
            refreshAllData();
          }
        )
        .subscribe();
    }

    return () => {
      if (channel) {
        client?.removeChannel(channel);
      }
    };
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
            ? 'Data Agenda Kerja BK berhasil diperbarui di Supabase!'
            : 'Data Agenda Kerja BK berhasil disimpan di Supabase!',
          'success'
        );
      } else {
        showToast(res.error || 'Gagal menyimpan agenda ke Supabase.', 'error');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan';
      showToast(`Gagal menyimpan ke Supabase: ${msg}`, 'error');
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
        showToast('Data Agenda berhasil dihapus dari Supabase.', 'success');
      } else {
        showToast(res.error || 'Gagal menghapus data agenda dari Supabase.', 'error');
      }
    } catch {
      showToast('Gagal menghapus data agenda dari Supabase.', 'error');
    }
  };

  // Handle Undangan submit
  const handleSubmitUndangan = async (data: Partial<UndanganOrangTua> & FormUndanganData) => {
    setIsSubmittingUndangan(true);
    try {
      const res = await saveOrUpdateUndangan(data);
      if (res.success) {
        if (res.data) {
          const item = res.data;
          setUndanganItems((prev) => {
            const idx = prev.findIndex((i) => i.id === item.id);
            if (idx >= 0) {
              const next = [...prev];
              next[idx] = item;
              return next;
            }
            return [item, ...prev];
          });
        }
        await loadUndanganData();
        showToast(
          data.id
            ? 'Data Undangan Orang Tua berhasil diperbarui di Supabase!'
            : 'Data Undangan Orang Tua berhasil disimpan di Supabase!',
          'success'
        );
      } else {
        showToast(res.error || 'Gagal menyimpan undangan orang tua ke Supabase.', 'error');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan';
      showToast(`Gagal menyimpan ke Supabase: ${msg}`, 'error');
    } finally {
      setIsSubmittingUndangan(false);
    }
  };

  // Handle Undangan delete
  const handleDeleteUndangan = async (id: string) => {
    try {
      setUndanganItems((prev) => prev.filter((i) => i.id !== id));
      const res = await deleteUndanganItem(id);
      if (res.success) {
        await loadUndanganData();
        showToast('Data Undangan Orang Tua berhasil dihapus dari Supabase.', 'success');
      } else {
        await loadUndanganData();
        showToast(res.error || 'Gagal menghapus data undangan dari Supabase.', 'error');
      }
    } catch {
      await loadUndanganData();
      showToast('Gagal menghapus data undangan orang tua dari Supabase.', 'error');
    }
  };

  // Handle Home Visit submit
  const handleSubmitHomeVisit = async (data: Partial<HomeVisit> & FormHomeVisitData) => {
    setIsSubmittingHomeVisit(true);
    try {
      const res = await saveOrUpdateHomeVisit(data);
      if (res.success) {
        if (res.data) {
          const item = res.data;
          setHomeVisitItems((prev) => {
            const idx = prev.findIndex((i) => i.id === item.id);
            if (idx >= 0) {
              const next = [...prev];
              next[idx] = item;
              return next;
            }
            return [item, ...prev];
          });
        }
        await loadHomeVisitData();
        showToast(
          data.id
            ? 'Data Home Visit berhasil diperbarui di Supabase!'
            : 'Data Home Visit berhasil disimpan di Supabase!',
          'success'
        );
      } else {
        showToast(res.error || 'Gagal menyimpan data home visit ke Supabase.', 'error');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan';
      showToast(`Gagal menyimpan ke Supabase: ${msg}`, 'error');
    } finally {
      setIsSubmittingHomeVisit(false);
    }
  };

  // Handle Home Visit delete
  const handleDeleteHomeVisit = async (id: string) => {
    try {
      setHomeVisitItems((prev) => prev.filter((i) => i.id !== id));
      const res = await deleteHomeVisitItem(id);
      if (res.success) {
        await loadHomeVisitData();
        showToast('Data Home Visit berhasil dihapus dari Supabase.', 'success');
      } else {
        await loadHomeVisitData();
        showToast(res.error || 'Gagal menghapus data home visit dari Supabase.', 'error');
      }
    } catch {
      await loadHomeVisitData();
      showToast('Gagal menghapus data home visit dari Supabase.', 'error');
    }
  };

  // Handle Rekam Permasalahan submit
  const handleSubmitRekamPermasalahan = async (data: Partial<RekamPermasalahan> & FormRekamPermasalahanData) => {
    setIsSubmittingRekamPermasalahan(true);
    try {
      const res = await saveOrUpdateRekamPermasalahan(data);
      if (res.success) {
        if (res.data) {
          const item = res.data;
          setRekamPermasalahanItems((prev) => {
            const idx = prev.findIndex((i) => i.id === item.id);
            if (idx >= 0) {
              const next = [...prev];
              next[idx] = item;
              return next;
            }
            return [item, ...prev];
          });
        }
        await loadRekamPermasalahanData();
        showToast(
          data.id
            ? 'Data Rekam Permasalahan Siswa berhasil diperbarui di Supabase!'
            : 'Data Rekam Permasalahan Siswa berhasil disimpan di Supabase!',
          'success'
        );
      } else {
        showToast(res.error || 'Gagal menyimpan data rekam permasalahan ke Supabase.', 'error');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan';
      showToast(`Gagal menyimpan ke Supabase: ${msg}`, 'error');
    } finally {
      setIsSubmittingRekamPermasalahan(false);
    }
  };

  // Handle Rekam Permasalahan delete
  const handleDeleteRekamPermasalahan = async (id: string) => {
    try {
      setRekamPermasalahanItems((prev) => prev.filter((i) => i.id !== id));
      const res = await deleteRekamPermasalahanItem(id);
      if (res.success) {
        await loadRekamPermasalahanData();
        showToast('Data Rekam Permasalahan berhasil dihapus dari Supabase.', 'success');
      } else {
        await loadRekamPermasalahanData();
        showToast(res.error || 'Gagal menghapus data rekam permasalahan dari Supabase.', 'error');
      }
    } catch {
      await loadRekamPermasalahanData();
      showToast('Gagal menghapus data rekam permasalahan dari Supabase.', 'error');
    }
  };

  // Handle Konseling Individu submit & delete
  const handleSubmitKonselingIndividu = async (data: Partial<KonselingIndividu> & FormKonselingIndividuData) => {
    setIsSubmittingKonselingIndividu(true);
    try {
      const res = await saveOrUpdateKonselingIndividu(data);
      if (res.success) {
        if (res.data) {
          const item = res.data;
          setKonselingIndividuItems((prev) => {
            const idx = prev.findIndex((i) => i.id === item.id);
            if (idx >= 0) {
              const next = [...prev];
              next[idx] = item;
              return next;
            }
            return [item, ...prev];
          });
        }
        await loadKonselingIndividuData();
        showToast(
          data.id
            ? 'Data Konseling Individu berhasil diperbarui di Supabase!'
            : 'Data Konseling Individu berhasil disimpan di Supabase!',
          'success'
        );
      } else {
        showToast(res.error || 'Gagal menyimpan data konseling individu ke Supabase.', 'error');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan';
      showToast(`Gagal menyimpan ke Supabase: ${msg}`, 'error');
    } finally {
      setIsSubmittingKonselingIndividu(false);
    }
  };

  const handleDeleteKonselingIndividu = async (id: string) => {
    try {
      setKonselingIndividuItems((prev) => prev.filter((i) => i.id !== id));
      const res = await deleteKonselingIndividuItem(id);
      if (res.success) {
        await loadKonselingIndividuData();
        showToast('Data Konseling Individu berhasil dihapus dari Supabase.', 'success');
      } else {
        await loadKonselingIndividuData();
        showToast(res.error || 'Gagal menghapus data konseling individu dari Supabase.', 'error');
      }
    } catch {
      await loadKonselingIndividuData();
      showToast('Gagal menghapus data konseling individu dari Supabase.', 'error');
    }
  };

  // Handle Konseling Kelompok submit & delete
  const handleSubmitKonselingKelompok = async (data: Partial<KonselingKelompok> & FormKonselingKelompokData) => {
    setIsSubmittingKonselingKelompok(true);
    try {
      const res = await saveOrUpdateKonselingKelompok(data);
      if (res.success) {
        if (res.data) {
          const item = res.data;
          setKonselingKelompokItems((prev) => {
            const idx = prev.findIndex((i) => i.id === item.id);
            if (idx >= 0) {
              const next = [...prev];
              next[idx] = item;
              return next;
            }
            return [item, ...prev];
          });
        }
        await loadKonselingKelompokData();
        showToast(
          data.id
            ? 'Data Konseling Kelompok berhasil diperbarui di Supabase!'
            : 'Data Konseling Kelompok berhasil disimpan di Supabase!',
          'success'
        );
      } else {
        showToast(res.error || 'Gagal menyimpan data konseling kelompok ke Supabase.', 'error');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan';
      showToast(`Gagal menyimpan ke Supabase: ${msg}`, 'error');
    } finally {
      setIsSubmittingKonselingKelompok(false);
    }
  };

  const handleDeleteKonselingKelompok = async (id: string) => {
    try {
      setKonselingKelompokItems((prev) => prev.filter((i) => i.id !== id));
      const res = await deleteKonselingKelompokItem(id);
      if (res.success) {
        await loadKonselingKelompokData();
        showToast('Data Konseling Kelompok berhasil dihapus dari Supabase.', 'success');
      } else {
        await loadKonselingKelompokData();
        showToast(res.error || 'Gagal menghapus data konseling kelompok dari Supabase.', 'error');
      }
    } catch {
      await loadKonselingKelompokData();
      showToast('Gagal menghapus data konseling kelompok dari Supabase.', 'error');
    }
  };

  // Handle Surat Pernyataan submit & delete
  const handleSubmitSuratPernyataan = async (data: Partial<SuratPernyataan> & FormSuratPernyataanData) => {
    setIsSubmittingSuratPernyataan(true);
    try {
      const res = await saveOrUpdateSuratPernyataan(data);
      if (res.success) {
        if (res.data) {
          const item = res.data;
          setSuratPernyataanItems((prev) => {
            const idx = prev.findIndex((i) => i.id === item.id);
            if (idx >= 0) {
              const next = [...prev];
              next[idx] = item;
              return next;
            }
            return [item, ...prev];
          });
        }
        await loadSuratPernyataanData();
        showToast(
          data.id
            ? 'Data Surat Pernyataan berhasil diperbarui di Supabase!'
            : 'Data Surat Pernyataan berhasil disimpan di Supabase!',
          'success'
        );
      } else {
        showToast(res.error || 'Gagal menyimpan data surat pernyataan ke Supabase.', 'error');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan';
      showToast(`Gagal menyimpan ke Supabase: ${msg}`, 'error');
    } finally {
      setIsSubmittingSuratPernyataan(false);
    }
  };

  const handleDeleteSuratPernyataan = async (id: string) => {
    try {
      setSuratPernyataanItems((prev) => prev.filter((i) => i.id !== id));
      const res = await deleteSuratPernyataanItem(id);
      if (res.success) {
        await loadSuratPernyataanData();
        showToast('Data Surat Pernyataan berhasil dihapus dari Supabase.', 'success');
      } else {
        await loadSuratPernyataanData();
        showToast(res.error || 'Gagal menghapus data surat pernyataan dari Supabase.', 'error');
      }
    } catch {
      await loadSuratPernyataanData();
      showToast('Gagal menghapus data surat pernyataan dari Supabase.', 'error');
    }
  };

  // Handle Konferensi Kasus submit & delete
  const handleSubmitKonferensiKasus = async (data: Partial<KonferensiKasus> & FormKonferensiKasusData) => {
    setIsSubmittingKonferensiKasus(true);
    try {
      const res = await saveOrUpdateKonferensiKasus(data);
      if (res.success) {
        if (res.data) {
          const itemToSet = res.data;
          setKonferensiKasusItems((prev) => {
            const idx = prev.findIndex((i) => i.id === itemToSet.id);
            if (idx >= 0) {
              const next = [...prev];
              next[idx] = itemToSet;
              return next;
            }
            return [itemToSet, ...prev];
          });
        }
        await loadKonferensiKasusData();
        showToast(
          data.id
            ? 'Data Konferensi Kasus berhasil diperbarui di Supabase!'
            : 'Data Konferensi Kasus berhasil disimpan di Supabase!',
          'success'
        );
      } else {
        showToast(res.error || 'Gagal menyimpan data konferensi kasus ke Supabase.', 'error');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan';
      showToast(`Gagal menyimpan ke Supabase: ${msg}`, 'error');
    } finally {
      setIsSubmittingKonferensiKasus(false);
    }
  };

  const handleDeleteKonferensiKasus = async (id: string) => {
    try {
      setKonferensiKasusItems((prev) => prev.filter((i) => i.id !== id));
      const res = await deleteKonferensiKasusItem(id);
      if (res.success) {
        await loadKonferensiKasusData();
        showToast('Data Konferensi Kasus berhasil dihapus dari Supabase.', 'success');
      } else {
        await loadKonferensiKasusData();
        showToast(res.error || 'Gagal menghapus data konferensi kasus dari Supabase.', 'error');
      }
    } catch {
      await loadKonferensiKasusData();
      showToast('Gagal menghapus data konferensi kasus dari Supabase.', 'error');
    }
  };

  // Handle Siswa submit & delete & bulk import
  const handleSubmitSiswa = async (data: Partial<Siswa> & FormSiswaData) => {
    setIsSubmittingSiswa(true);
    try {
      const res = await saveOrUpdateSiswa(data);
      if (res.success) {
        if (res.data) {
          const item = res.data;
          setSiswaItems((prev) => {
            const idx = prev.findIndex((i) => i.id === item.id);
            if (idx >= 0) {
              const next = [...prev];
              next[idx] = item;
              return next;
            }
            return [item, ...prev];
          });
        }
        await loadSiswaData();
        showToast(
          data.id
            ? 'Data Siswa berhasil diperbarui di Supabase!'
            : 'Data Siswa berhasil disimpan di Supabase!',
          'success'
        );
      } else {
        showToast(res.error || 'Gagal menyimpan data siswa ke Supabase.', 'error');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan';
      showToast(`Gagal menyimpan ke Supabase: ${msg}`, 'error');
    } finally {
      setIsSubmittingSiswa(false);
    }
  };

  const handleDeleteSiswa = async (id: string) => {
    try {
      setSiswaItems((prev) => prev.filter((i) => i.id !== id));
      const res = await deleteSiswaItem(id);
      if (res.success) {
        await loadSiswaData();
        showToast('Data Siswa berhasil dihapus dari Supabase.', 'success');
      } else {
        await loadSiswaData();
        showToast(res.error || 'Gagal menghapus data siswa dari Supabase.', 'error');
      }
    } catch {
      await loadSiswaData();
      showToast('Gagal menghapus data siswa dari Supabase.', 'error');
    }
  };

  const handleBulkImportSiswa = async (students: Omit<Siswa, 'id' | 'created_at' | 'updated_at'>[]) => {
    setIsSubmittingSiswa(true);
    try {
      const res = await bulkSaveOrUpdateSiswa(students);
      await loadSiswaData();
      if (res.success) {
        if (res.error) {
          showToast(res.error, 'info');
        } else {
          showToast(`Berhasil mengimpor ${students.length} data siswa ke Supabase.`, 'success');
        }
      } else {
        showToast(res.error || 'Gagal mengimpor data siswa ke Supabase.', 'error');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan saat import massal';
      showToast(`Gagal mengimpor ke Supabase: ${msg}`, 'error');
    } finally {
      setIsSubmittingSiswa(false);
    }
  };

  // Handle Jurnal BK submit
  const handleSubmitJurnalBK = async (data: Partial<JurnalBK> & FormJurnalBKData) => {
    setIsSubmittingJurnalBK(true);
    try {
      const res = await saveOrUpdateJurnalBK(data);
      if (res.success) {
        if (res.data) {
          const item = res.data;
          setJurnalBKItems((prev) => {
            const idx = prev.findIndex((i) => i.id === item.id);
            if (idx >= 0) {
              const next = [...prev];
              next[idx] = item;
              return next;
            }
            return [item, ...prev];
          });
        }
        await loadJurnalBKData();
        showToast(
          data.id
            ? 'Data Jurnal BK berhasil diperbarui di Supabase!'
            : 'Data Jurnal BK berhasil disimpan di Supabase!',
          'success'
        );
      } else {
        showToast(res.error || 'Gagal menyimpan Jurnal BK ke Supabase.', 'error');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan';
      showToast(`Gagal menyimpan ke Supabase: ${msg}`, 'error');
    } finally {
      setIsSubmittingJurnalBK(false);
    }
  };

  // Handle Jurnal BK delete
  const handleDeleteJurnalBK = async (id: string) => {
    try {
      setJurnalBKItems((prev) => prev.filter((i) => i.id !== id));
      const res = await deleteJurnalBKItem(id);
      if (res.success) {
        await loadJurnalBKData();
        showToast('Data Jurnal BK berhasil dihapus dari Supabase.', 'success');
      } else {
        await loadJurnalBKData();
        showToast(res.error || 'Gagal menghapus data Jurnal BK dari Supabase.', 'error');
      }
    } catch {
      await loadJurnalBKData();
      showToast('Gagal menghapus data Jurnal BK dari Supabase.', 'error');
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
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white relative overflow-x-hidden">
      {/* Subtle Background Decorative Blur Effects */}
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/3 -right-40 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed -bottom-40 left-1/3 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      
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
          onRefreshData={refreshAllData}
          isSyncing={
            isLoadingAgenda ||
            isLoadingUndangan ||
            isLoadingHomeVisit ||
            isLoadingRekamPermasalahan ||
            isLoadingKonselingIndividu ||
            isLoadingKonselingKelompok ||
            isLoadingSuratPernyataan ||
            isLoadingKonferensiKasus ||
            isLoadingSiswa ||
            isLoadingJurnalBK
          }
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
          rekamPermasalahanItems={rekamPermasalahanItems}
          isLoadingRekamPermasalahan={isLoadingRekamPermasalahan}
          isSubmittingRekamPermasalahan={isSubmittingRekamPermasalahan}
          onSubmitRekamPermasalahan={handleSubmitRekamPermasalahan}
          onDeleteRekamPermasalahan={handleDeleteRekamPermasalahan}
          konselingIndividuItems={konselingIndividuItems}
          isLoadingKonselingIndividu={isLoadingKonselingIndividu}
          isSubmittingKonselingIndividu={isSubmittingKonselingIndividu}
          onSubmitKonselingIndividu={handleSubmitKonselingIndividu}
          onDeleteKonselingIndividu={handleDeleteKonselingIndividu}
          konselingKelompokItems={konselingKelompokItems}
          isLoadingKonselingKelompok={isLoadingKonselingKelompok}
          isSubmittingKonselingKelompok={isSubmittingKonselingKelompok}
          onSubmitKonselingKelompok={handleSubmitKonselingKelompok}
          onDeleteKonselingKelompok={handleDeleteKonselingKelompok}
          suratPernyataanItems={suratPernyataanItems}
          isLoadingSuratPernyataan={isLoadingSuratPernyataan}
          isSubmittingSuratPernyataan={isSubmittingSuratPernyataan}
          onSubmitSuratPernyataan={handleSubmitSuratPernyataan}
          onDeleteSuratPernyataan={handleDeleteSuratPernyataan}
          konferensiKasusItems={konferensiKasusItems}
          isLoadingKonferensiKasus={isLoadingKonferensiKasus}
          isSubmittingKonferensiKasus={isSubmittingKonferensiKasus}
          onSubmitKonferensiKasus={handleSubmitKonferensiKasus}
          onDeleteKonferensiKasus={handleDeleteKonferensiKasus}
          siswaItems={siswaItems}
          isLoadingSiswa={isLoadingSiswa}
          isSubmittingSiswa={isSubmittingSiswa}
          onSubmitSiswa={handleSubmitSiswa}
          onDeleteSiswa={handleDeleteSiswa}
          onBulkImportSiswa={handleBulkImportSiswa}
          jurnalBKItems={jurnalBKItems}
          isLoadingJurnalBK={isLoadingJurnalBK}
          isSubmittingJurnalBK={isSubmittingJurnalBK}
          onSubmitJurnalBK={handleSubmitJurnalBK}
          onDeleteJurnalBK={handleDeleteJurnalBK}
          isSupabaseConnected={isSupabaseConnected}
          onRefreshData={refreshAllData}
          onOpenSupabaseConfig={() => setIsSettingsOpen(true)}
        />

      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-5 text-center text-xs text-slate-400 print:hidden">
        <div className="max-w-[1700px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-bold text-slate-300">
            SABDA BK SPANJU SMPN 7 PASURUAN © 2026
          </p>
          <p className="text-slate-500 text-[11px]">
            Sistem Administrasi BK Digital dan Akuntabel • "Data Tertata, Layanan Berkualitas."
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
