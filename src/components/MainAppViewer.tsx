import React, { useState } from 'react';
import {
  AppLink,
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
  Siswa,
  FormSiswaData,
  JurnalBK,
  FormJurnalBKData
} from '../types';
import { FormAgenda } from './FormAgenda';
import { TabelAgenda } from './TabelAgenda';
import { StatistikRekap } from './StatistikRekap';
import { FormUndangan } from './FormUndangan';
import { TabelUndangan } from './TabelUndangan';
import { FormHomeVisit } from './FormHomeVisit';
import { TabelHomeVisit } from './TabelHomeVisit';
import { FormRekamPermasalahan } from './FormRekamPermasalahan';
import { TabelRekamPermasalahan } from './TabelRekamPermasalahan';
import { FormKonselingIndividu } from './FormKonselingIndividu';
import { TabelKonselingIndividu } from './TabelKonselingIndividu';
import { FormKonselingKelompok } from './FormKonselingKelompok';
import { TabelKonselingKelompok } from './TabelKonselingKelompok';
import { FormSuratPernyataan } from './FormSuratPernyataan';
import { TabelSuratPernyataan } from './TabelSuratPernyataan';
import { FormKonferensiKasus } from './FormKonferensiKasus';
import { TabelKonferensiKasus } from './TabelKonferensiKasus';
import { FormSiswa } from './FormSiswa';
import { TabelSiswa } from './TabelSiswa';
import { FormJurnalBK } from './FormJurnalBK';
import { TabelJurnalBK } from './TabelJurnalBK';
import { PrintView } from './PrintView';
import {
  ExternalLink,
  RefreshCw,
  PlusCircle,
  ListFilter,
  BarChart2,
  Database,
  Globe,
  BookOpen,
  Users,
  Home,
  Info,
  Mail,
  FileCheck,
  FileText,
  Printer,
  AlertTriangle,
  UserCheck,
  UserPlus,
  FileCheck2,
  GraduationCap
} from 'lucide-react';

interface MainAppViewerProps {
  selectedLink: AppLink | null;
  
  // Agenda BK Props
  agendaItems: AgendaKerja[];
  isLoadingAgenda: boolean;
  isSubmittingAgenda: boolean;
  onSubmitAgenda: (data: Partial<AgendaKerja> & FormAgendaData) => Promise<void>;
  onDeleteAgenda: (id: string) => Promise<void>;

  // Undangan Orang Tua Props
  undanganItems: UndanganOrangTua[];
  isLoadingUndangan: boolean;
  isSubmittingUndangan: boolean;
  onSubmitUndangan: (data: Partial<UndanganOrangTua> & FormUndanganData) => Promise<void>;
  onDeleteUndangan: (id: string) => Promise<void>;

  // Home Visit Props
  homeVisitItems: HomeVisit[];
  isLoadingHomeVisit: boolean;
  isSubmittingHomeVisit: boolean;
  onSubmitHomeVisit: (data: Partial<HomeVisit> & FormHomeVisitData) => Promise<void>;
  onDeleteHomeVisit: (id: string) => Promise<void>;

  // Rekam Permasalahan Props
  rekamPermasalahanItems: RekamPermasalahan[];
  isLoadingRekamPermasalahan: boolean;
  isSubmittingRekamPermasalahan: boolean;
  onSubmitRekamPermasalahan: (data: Partial<RekamPermasalahan> & FormRekamPermasalahanData) => Promise<void>;
  onDeleteRekamPermasalahan: (id: string) => Promise<void>;

  // Konseling Individu Props
  konselingIndividuItems: KonselingIndividu[];
  isLoadingKonselingIndividu: boolean;
  isSubmittingKonselingIndividu: boolean;
  onSubmitKonselingIndividu: (data: Partial<KonselingIndividu> & FormKonselingIndividuData) => Promise<void>;
  onDeleteKonselingIndividu: (id: string) => Promise<void>;

  // Konseling Kelompok Props
  konselingKelompokItems: KonselingKelompok[];
  isLoadingKonselingKelompok: boolean;
  isSubmittingKonselingKelompok: boolean;
  onSubmitKonselingKelompok: (data: Partial<KonselingKelompok> & FormKonselingKelompokData) => Promise<void>;
  onDeleteKonselingKelompok: (id: string) => Promise<void>;

  // Surat Pernyataan Siswa Props
  suratPernyataanItems: SuratPernyataan[];
  isLoadingSuratPernyataan: boolean;
  isSubmittingSuratPernyataan: boolean;
  onSubmitSuratPernyataan: (data: Partial<SuratPernyataan> & FormSuratPernyataanData) => Promise<void>;
  onDeleteSuratPernyataan: (id: string) => Promise<void>;

  // Konferensi Kasus Props
  konferensiKasusItems: KonferensiKasus[];
  isLoadingKonferensiKasus: boolean;
  isSubmittingKonferensiKasus: boolean;
  onSubmitKonferensiKasus: (data: Partial<KonferensiKasus> & FormKonferensiKasusData) => Promise<void>;
  onDeleteKonferensiKasus: (id: string) => Promise<void>;

  // Siswa Props
  siswaItems: Siswa[];
  isLoadingSiswa: boolean;
  isSubmittingSiswa: boolean;
  onSubmitSiswa: (data: Partial<Siswa> & FormSiswaData) => Promise<void>;
  onDeleteSiswa: (id: string) => Promise<void>;
  onBulkImportSiswa: (students: Omit<Siswa, 'id' | 'created_at' | 'updated_at'>[]) => Promise<void>;

  // Jurnal BK Props
  jurnalBKItems?: JurnalBK[];
  isLoadingJurnalBK?: boolean;
  isSubmittingJurnalBK?: boolean;
  onSubmitJurnalBK?: (data: Partial<JurnalBK> & FormJurnalBKData) => Promise<void>;
  onDeleteJurnalBK?: (id: string) => Promise<void>;

  // Common Props
  isSupabaseConnected: boolean;
  onRefreshData: () => void;
  onOpenSupabaseConfig: () => void;
}

export const MainAppViewer: React.FC<MainAppViewerProps> = ({
  selectedLink,
  agendaItems = [],
  isLoadingAgenda = false,
  isSubmittingAgenda = false,
  onSubmitAgenda,
  onDeleteAgenda,
  undanganItems = [],
  isLoadingUndangan = false,
  isSubmittingUndangan = false,
  onSubmitUndangan,
  onDeleteUndangan,
  homeVisitItems = [],
  isLoadingHomeVisit = false,
  isSubmittingHomeVisit = false,
  onSubmitHomeVisit,
  onDeleteHomeVisit,
  rekamPermasalahanItems = [],
  isLoadingRekamPermasalahan = false,
  isSubmittingRekamPermasalahan = false,
  onSubmitRekamPermasalahan,
  onDeleteRekamPermasalahan,
  konselingIndividuItems = [],
  isLoadingKonselingIndividu = false,
  isSubmittingKonselingIndividu = false,
  onSubmitKonselingIndividu,
  onDeleteKonselingIndividu,
  konselingKelompokItems = [],
  isLoadingKonselingKelompok = false,
  isSubmittingKonselingKelompok = false,
  onSubmitKonselingKelompok,
  onDeleteKonselingKelompok,
  suratPernyataanItems = [],
  isLoadingSuratPernyataan = false,
  isSubmittingSuratPernyataan = false,
  onSubmitSuratPernyataan,
  onDeleteSuratPernyataan,
  konferensiKasusItems = [],
  isLoadingKonferensiKasus = false,
  isSubmittingKonferensiKasus = false,
  onSubmitKonferensiKasus,
  onDeleteKonferensiKasus,
  siswaItems = [],
  isLoadingSiswa = false,
  isSubmittingSiswa = false,
  onSubmitSiswa,
  onDeleteSiswa,
  onBulkImportSiswa,
  jurnalBKItems = [],
  isLoadingJurnalBK = false,
  isSubmittingJurnalBK = false,
  onSubmitJurnalBK,
  onDeleteJurnalBK,
  isSupabaseConnected = false,
  onRefreshData,
  onOpenSupabaseConfig,
}) => {
  const [internalTab, setInternalTab] = useState<'form' | 'table' | 'stats'>('form');
  const [editingAgenda, setEditingAgenda] = useState<AgendaKerja | null>(null);
  const [editingUndangan, setEditingUndangan] = useState<UndanganOrangTua | null>(null);
  const [editingHomeVisit, setEditingHomeVisit] = useState<HomeVisit | null>(null);
  const [editingRekamPermasalahan, setEditingRekamPermasalahan] = useState<RekamPermasalahan | null>(null);
  const [editingKonselingIndividu, setEditingKonselingIndividu] = useState<KonselingIndividu | null>(null);
  const [editingKonselingKelompok, setEditingKonselingKelompok] = useState<KonselingKelompok | null>(null);
  const [editingSuratPernyataan, setEditingSuratPernyataan] = useState<SuratPernyataan | null>(null);
  const [editingKonferensiKasus, setEditingKonferensiKasus] = useState<KonferensiKasus | null>(null);
  const [editingSiswa, setEditingSiswa] = useState<Siswa | null>(null);
  const [editingJurnalBK, setEditingJurnalBK] = useState<JurnalBK | null>(null);
  
  // Printing states
  const [isPrintMode, setIsPrintMode] = useState(false);
  const [printDocType, setPrintDocType] = useState<
    | 'agenda'
    | 'undangan_tabel'
    | 'surat_undangan'
    | 'laporan_konsultasi'
    | 'home_visit_tabel'
    | 'laporan_home_visit'
    | 'surat_tugas_home_visit'
    | 'surat_kesediaan_ortu'
    | 'rekam_permasalahan_tabel'
    | 'rekam_permasalahan_dokumen'
    | 'konseling_individu_tabel'
    | 'konseling_individu_dokumen'
    | 'konseling_kelompok_tabel'
    | 'konseling_kelompok_dokumen'
    | 'surat_pernyataan_tabel'
    | 'surat_pernyataan_dokumen'
    | 'konferensi_kasus_tabel'
    | 'konferensi_kasus_notula'
    | 'konferensi_kasus_notulen_rapat'
    | 'konferensi_kasus_daftar_hadir'
    | 'konferensi_kasus_gabungan'
    | 'jurnal_bk_tabel'
    | 'jurnal_bk_dokumen'
  >('agenda');
  const [selectedForPrint, setSelectedForPrint] = useState<UndanganOrangTua | null>(null);
  const [selectedHomeVisitForPrint, setSelectedHomeVisitForPrint] = useState<HomeVisit | null>(null);
  const [selectedRekamPermasalahanForPrint, setSelectedRekamPermasalahanForPrint] = useState<RekamPermasalahan | null>(null);
  const [selectedKonselingIndividuForPrint, setSelectedKonselingIndividuForPrint] = useState<KonselingIndividu | null>(null);
  const [selectedKonselingKelompokForPrint, setSelectedKonselingKelompokForPrint] = useState<KonselingKelompok | null>(null);
  const [selectedSuratPernyataanForPrint, setSelectedSuratPernyataanForPrint] = useState<SuratPernyataan | null>(null);
  const [selectedKonferensiKasusForPrint, setSelectedKonferensiKasusForPrint] = useState<KonferensiKasus | null>(null);
  const [selectedJurnalBKForPrint, setSelectedJurnalBKForPrint] = useState<JurnalBK | null>(null);
  
  const [iframeKey, setIframeKey] = useState(0);

  // Route flags
  const linkUrl = selectedLink?.url || 'internal:agenda_bk';
  const isInternalAgenda = linkUrl === 'internal:agenda_bk';
  const isInternalUndangan = linkUrl === 'internal:undangan_ortu';
  const isInternalHomeVisit = linkUrl === 'internal:home_visit';
  const isInternalRekamPermasalahan = linkUrl === 'internal:rekam_permasalahan';
  const isInternalKonselingIndividu = linkUrl === 'internal:konseling_individu';
  const isInternalKonselingKelompok = linkUrl === 'internal:konseling_kelompok';
  const isInternalSuratPernyataan = linkUrl === 'internal:surat_pernyataan';
  const isInternalKonferensiKasus = linkUrl === 'internal:konferensi_kasus';
  const isInternalSiswa = linkUrl === 'internal:siswa';
  const isInternalJurnalBK = linkUrl === 'internal:jurnal_bk';
  const isInternal =
    isInternalAgenda ||
    isInternalUndangan ||
    isInternalHomeVisit ||
    isInternalRekamPermasalahan ||
    isInternalKonselingIndividu ||
    isInternalKonselingKelompok ||
    isInternalSuratPernyataan ||
    isInternalKonferensiKasus ||
    isInternalSiswa ||
    isInternalJurnalBK;

  const handleOpenPrint = (
    docType:
      | 'agenda'
      | 'undangan_tabel'
      | 'surat_undangan'
      | 'laporan_konsultasi'
      | 'home_visit_tabel'
      | 'laporan_home_visit'
      | 'surat_tugas_home_visit'
      | 'surat_kesediaan_ortu'
      | 'rekam_permasalahan_tabel'
      | 'rekam_permasalahan_dokumen'
      | 'konseling_individu_tabel'
      | 'konseling_individu_dokumen'
      | 'konseling_kelompok_tabel'
      | 'konseling_kelompok_dokumen'
      | 'surat_pernyataan_tabel'
      | 'surat_pernyataan_dokumen'
      | 'konferensi_kasus_tabel'
      | 'konferensi_kasus_notula'
      | 'konferensi_kasus_notulen_rapat'
      | 'konferensi_kasus_daftar_hadir'
      | 'konferensi_kasus_gabungan'
      | 'jurnal_bk_tabel'
      | 'jurnal_bk_dokumen',
    itemUndangan: UndanganOrangTua | null = null,
    itemHomeVisit: HomeVisit | null = null,
    itemRekamPermasalahan: RekamPermasalahan | null = null,
    itemKonselingIndividu: KonselingIndividu | null = null,
    itemKonselingKelompok: KonselingKelompok | null = null,
    itemSuratPernyataan: SuratPernyataan | null = null,
    itemKonferensiKasus: KonferensiKasus | null = null,
    itemJurnalBK: JurnalBK | null = null
  ) => {
    setPrintDocType(docType);
    setSelectedForPrint(itemUndangan);
    setSelectedHomeVisitForPrint(itemHomeVisit);
    setSelectedRekamPermasalahanForPrint(itemRekamPermasalahan);
    setSelectedKonselingIndividuForPrint(itemKonselingIndividu);
    setSelectedKonselingKelompokForPrint(itemKonselingKelompok);
    setSelectedSuratPernyataanForPrint(itemSuratPernyataan);
    setSelectedKonferensiKasusForPrint(itemKonferensiKasus);
    setSelectedJurnalBKForPrint(itemJurnalBK);
    setIsPrintMode(true);
  };

  if (isPrintMode) {
    return (
      <PrintView
        docType={printDocType}
        agendaItems={agendaItems}
        undanganItems={undanganItems}
        selectedUndangan={selectedForPrint}
        homeVisitItems={homeVisitItems}
        selectedHomeVisit={selectedHomeVisitForPrint}
        rekamPermasalahanItems={rekamPermasalahanItems}
        selectedRekamPermasalahan={selectedRekamPermasalahanForPrint}
        konselingIndividuItems={konselingIndividuItems}
        selectedKonselingIndividu={selectedKonselingIndividuForPrint}
        konselingKelompokItems={konselingKelompokItems}
        selectedKonselingKelompok={selectedKonselingKelompokForPrint}
        suratPernyataanItems={suratPernyataanItems}
        selectedSuratPernyataan={selectedSuratPernyataanForPrint}
        konferensiKasusItems={konferensiKasusItems}
        selectedKonferensiKasus={selectedKonferensiKasusForPrint}
        jurnalBKItems={jurnalBKItems}
        selectedJurnalBK={selectedJurnalBKForPrint}
        onBack={() => setIsPrintMode(false)}
      />
    );
  }

  return (
    <section className="flex-1 min-w-0 bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 flex flex-col overflow-hidden">
      
      {/* Viewer Header Bar */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-4 sm:p-5 border-b border-blue-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        
        {/* Title & Badge */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white text-blue-700 rounded-2xl font-black shadow-md shrink-0">
            {isInternalAgenda ? (
              <BookOpen className="w-6 h-6" />
            ) : isInternalUndangan ? (
              <Users className="w-6 h-6" />
            ) : isInternalHomeVisit ? (
              <Home className="w-6 h-6" />
            ) : isInternalRekamPermasalahan ? (
              <AlertTriangle className="w-6 h-6" />
            ) : isInternalKonselingIndividu ? (
              <UserCheck className="w-6 h-6" />
            ) : isInternalKonselingKelompok ? (
              <UserPlus className="w-6 h-6" />
            ) : isInternalSuratPernyataan ? (
              <FileCheck2 className="w-6 h-6" />
            ) : isInternalKonferensiKasus ? (
              <Users className="w-6 h-6" />
            ) : isInternalSiswa ? (
              <GraduationCap className="w-6 h-6" />
            ) : (
              <Globe className="w-6 h-6" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-sm">
                {selectedLink?.badge || (
                  isInternalSiswa ? 'SISWA' :
                  isInternalKonferensiKasus ? 'FORM H' :
                  isInternalSuratPernyataan ? 'FORM G' :
                  isInternalKonselingKelompok ? 'FORM F' :
                  isInternalKonselingIndividu ? 'FORM E' :
                  isInternalRekamPermasalahan ? 'FORM D' :
                  isInternalHomeVisit ? 'FORM C' :
                  isInternalUndangan ? 'FORM B' : 'FORM A'
                )}
              </span>
              <span className="text-xs text-blue-100 font-semibold">
                {selectedLink?.category || 'Administrasi BK'}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-0.5">
              {selectedLink
                ? selectedLink.title
                : 'AGENDA KERJA BK SMPN 7 PASURUAN'}
            </h2>
          </div>
        </div>

        {/* Right Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {isInternal ? (
            /* Internal Tabs & Direct Document Actions */
            <div className="flex flex-wrap items-center gap-2">
              
              {/* Core Tabs */}
              <div className="bg-white/10 backdrop-blur-md p-1 rounded-xl border border-white/20 flex items-center gap-1">
                <button
                  onClick={() => {
                    setInternalTab('form');
                    if (editingAgenda) setEditingAgenda(null);
                    if (editingUndangan) setEditingUndangan(null);
                    if (editingHomeVisit) setEditingHomeVisit(null);
                    if (editingRekamPermasalahan) setEditingRekamPermasalahan(null);
                    if (editingKonselingIndividu) setEditingKonselingIndividu(null);
                    if (editingKonselingKelompok) setEditingKonselingKelompok(null);
                    if (editingSuratPernyataan) setEditingSuratPernyataan(null);
                    if (editingKonferensiKasus) setEditingKonferensiKasus(null);
                    if (editingSiswa) setEditingSiswa(null);
                    if (editingJurnalBK) setEditingJurnalBK(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    internalTab === 'form'
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>
                    {(editingAgenda || editingUndangan || editingHomeVisit || editingRekamPermasalahan || editingKonselingIndividu || editingKonselingKelompok || editingSuratPernyataan || editingKonferensiKasus || editingSiswa || editingJurnalBK) ? 'Edit Form' : 'Input Form'}
                  </span>
                </button>
 
                <button
                  onClick={() => setInternalTab('table')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    internalTab === 'table'
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <ListFilter className="w-3.5 h-3.5" />
                  <span>
                    {isInternalJurnalBK
                      ? `Daftar Jurnal BK (${(jurnalBKItems || []).length})`
                      : isInternalKonferensiKasus
                      ? `Daftar Konferensi Kasus (${(konferensiKasusItems || []).length})`
                      : isInternalSuratPernyataan
                      ? `Daftar Surat Pernyataan (${(suratPernyataanItems || []).length})`
                      : isInternalKonselingKelompok
                      ? `Daftar Konseling Kelompok (${(konselingKelompokItems || []).length})`
                      : isInternalKonselingIndividu
                      ? `Daftar Konseling Individu (${(konselingIndividuItems || []).length})`
                      : isInternalRekamPermasalahan
                      ? `Daftar Rekam (${(rekamPermasalahanItems || []).length})`
                      : isInternalHomeVisit
                      ? `Daftar Home Visit (${(homeVisitItems || []).length})`
                      : isInternalUndangan
                      ? `Daftar Undangan (${(undanganItems || []).length})`
                      : `Daftar Agenda (${(agendaItems || []).length})`}
                  </span>
                </button>

                {isInternalAgenda && (
                  <button
                    onClick={() => setInternalTab('stats')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      internalTab === 'stats'
                        ? 'bg-white text-blue-700 shadow-sm'
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <BarChart2 className="w-3.5 h-3.5" />
                    <span>Rekap</span>
                  </button>
                )}
              </div>

              {/* Form B Quick Document Shortcut Actions */}
              {isInternalUndangan && (
                <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md p-1 rounded-xl border border-white/20">
                  <button
                    onClick={() => handleOpenPrint('surat_undangan')}
                    className="px-2.5 py-1.5 bg-white text-blue-900 hover:bg-blue-50 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                    title="Cetak / Preview Surat Undangan Orang Tua"
                  >
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    <span>Surat Undangan</span>
                  </button>

                  <button
                    onClick={() => handleOpenPrint('laporan_konsultasi')}
                    className="px-2.5 py-1.5 bg-white text-emerald-900 hover:bg-emerald-50 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                    title="Cetak / Preview Laporan Konsultasi Orang Tua"
                  >
                    <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Laporan Konsultasi</span>
                  </button>

                  <button
                    onClick={() => handleOpenPrint('undangan_tabel')}
                    className="px-2.5 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                    title="Cetak Rekap Tabel Undangan"
                  >
                    <Printer className="w-3.5 h-3.5 text-amber-300" />
                    <span>Cetak Tabel</span>
                  </button>
                </div>
              )}

              {/* Form C Home Visit Quick Document Shortcut Actions */}
              {isInternalHomeVisit && (
                <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md p-1 rounded-xl border border-white/20">
                  <button
                    onClick={() => handleOpenPrint('surat_tugas_home_visit')}
                    className="px-2.5 py-1.5 bg-white text-amber-900 hover:bg-amber-50 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                    title="Cetak / Preview Surat Tugas Kunjungan Rumah"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-600" />
                    <span>Surat Tugas</span>
                  </button>

                  <button
                    onClick={() => handleOpenPrint('surat_kesediaan_ortu')}
                    className="px-2.5 py-1.5 bg-white text-emerald-900 hover:bg-emerald-50 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                    title="Cetak / Preview Surat Kesediaan Menerima Kunjungan Orang Tua"
                  >
                    <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Surat Kesediaan Ortu</span>
                  </button>

                  <button
                    onClick={() => handleOpenPrint('laporan_home_visit')}
                    className="px-2.5 py-1.5 bg-white text-blue-900 hover:bg-blue-50 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                    title="Cetak / Preview Laporan Home Visit"
                  >
                    <FileCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Laporan Home Visit</span>
                  </button>

                  <button
                    onClick={() => handleOpenPrint('home_visit_tabel')}
                    className="px-2.5 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                    title="Cetak Rekap Tabel Home Visit"
                  >
                    <Printer className="w-3.5 h-3.5 text-amber-300" />
                    <span>Cetak Tabel</span>
                  </button>
                </div>
              )}

              {/* Form D Rekam Permasalahan Quick Document Shortcut Actions */}
              {isInternalRekamPermasalahan && (
                <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md p-1 rounded-xl border border-white/20">
                  <button
                    onClick={() => handleOpenPrint('rekam_permasalahan_dokumen')}
                    className="px-2.5 py-1.5 bg-white text-purple-900 hover:bg-purple-50 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                    title="Cetak / Preview Rekam Permasalahan Siswa"
                  >
                    <FileText className="w-3.5 h-3.5 text-purple-600" />
                    <span>Laporan Rekam</span>
                  </button>

                  <button
                    onClick={() => handleOpenPrint('rekam_permasalahan_tabel')}
                    className="px-2.5 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                    title="Cetak Rekap Tabel Rekam Permasalahan"
                  >
                    <Printer className="w-3.5 h-3.5 text-amber-300" />
                    <span>Cetak Tabel</span>
                  </button>
                </div>
              )}

              {/* Form E Konseling Individu Quick Document Shortcut Actions */}
              {isInternalKonselingIndividu && (
                <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md p-1 rounded-xl border border-white/20">
                  <button
                    onClick={() => handleOpenPrint('konseling_individu_dokumen')}
                    className="px-2.5 py-1.5 bg-white text-teal-900 hover:bg-teal-50 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                    title="Cetak / Preview Dokumen Rencana Konseling Individu"
                  >
                    <FileText className="w-3.5 h-3.5 text-teal-600" />
                    <span>Cetak Rencana</span>
                  </button>

                  <button
                    onClick={() => handleOpenPrint('konseling_individu_tabel')}
                    className="px-2.5 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                    title="Cetak Rekap Tabel Konseling Individu"
                  >
                    <Printer className="w-3.5 h-3.5 text-amber-300" />
                    <span>Cetak Tabel</span>
                  </button>
                </div>
              )}

              {/* Form F Konseling Kelompok Quick Document Shortcut Actions */}
              {isInternalKonselingKelompok && (
                <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md p-1 rounded-xl border border-white/20">
                  <button
                    onClick={() => handleOpenPrint('konseling_kelompok_dokumen')}
                    className="px-2.5 py-1.5 bg-white text-indigo-900 hover:bg-indigo-50 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                    title="Cetak / Preview Dokumen Rencana Konseling Kelompok"
                  >
                    <FileText className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Cetak Rencana</span>
                  </button>

                  <button
                    onClick={() => handleOpenPrint('konseling_kelompok_tabel')}
                    className="px-2.5 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                    title="Cetak Rekap Tabel Konseling Kelompok"
                  >
                    <Printer className="w-3.5 h-3.5 text-amber-300" />
                    <span>Cetak Tabel</span>
                  </button>
                </div>
              )}

              {/* Form G Surat Pernyataan Quick Document Shortcut Actions */}
              {isInternalSuratPernyataan && (
                <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md p-1 rounded-xl border border-white/20">
                  <button
                    onClick={() => handleOpenPrint('surat_pernyataan_dokumen')}
                    className="px-2.5 py-1.5 bg-white text-violet-900 hover:bg-violet-50 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                    title="Cetak / Preview Dokumen Surat Pernyataan"
                  >
                    <FileText className="w-3.5 h-3.5 text-violet-600" />
                    <span>Cetak Surat</span>
                  </button>

                  <button
                    onClick={() => handleOpenPrint('surat_pernyataan_tabel')}
                    className="px-2.5 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                    title="Cetak Rekap Tabel Surat Pernyataan"
                  >
                    <Printer className="w-3.5 h-3.5 text-amber-300" />
                    <span>Cetak Tabel</span>
                  </button>
                </div>
              )}

              {/* Form H Konferensi Kasus Quick Document Shortcut Actions */}
              {isInternalKonferensiKasus && (
                <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md p-1 rounded-xl border border-white/20">
                  <button
                    onClick={() => handleOpenPrint('konferensi_kasus_gabungan')}
                    className="px-2.5 py-1.5 bg-white text-teal-900 hover:bg-teal-50 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                    title="Cetak / Preview Seluruh Dokumen Konferensi Kasus"
                  >
                    <FileText className="w-3.5 h-3.5 text-teal-600" />
                    <span>Cetak Gabungan</span>
                  </button>

                  <button
                    onClick={() => handleOpenPrint('konferensi_kasus_tabel')}
                    className="px-2.5 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                    title="Cetak Rekap Tabel Konferensi Kasus"
                  >
                    <Printer className="w-3.5 h-3.5 text-amber-300" />
                    <span>Cetak Tabel</span>
                  </button>
                </div>
              )}

              {/* Form Jurnal BK Quick Document Shortcut Actions */}
              {isInternalJurnalBK && (
                <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md p-1 rounded-xl border border-white/20">
                  <button
                    onClick={() => handleOpenPrint('jurnal_bk_dokumen')}
                    className="px-2.5 py-1.5 bg-white text-sky-900 hover:bg-sky-50 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                    title="Cetak / Preview Jurnal BK"
                  >
                    <FileText className="w-3.5 h-3.5 text-sky-600" />
                    <span>Cetak Jurnal</span>
                  </button>

                  <button
                    onClick={() => handleOpenPrint('jurnal_bk_tabel')}
                    className="px-2.5 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                    title="Cetak Rekap Tabel Jurnal BK"
                  >
                    <Printer className="w-3.5 h-3.5 text-amber-300" />
                    <span>Cetak Tabel</span>
                  </button>
                </div>
              )}

            </div>
          ) : (
            /* External Controls */
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIframeKey((prev) => prev + 1)}
                className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
                title="Muat Ulang Halaman Web"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload</span>
              </button>

              {selectedLink?.url && (
                <a
                  href={selectedLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1.5 bg-white text-blue-900 hover:bg-blue-50 text-xs font-extrabold rounded-xl shadow-md transition-all flex items-center gap-1.5 transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>Buka Tab Baru</span>
                  <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                </a>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Main View Area */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto min-h-[550px] bg-slate-50/50">
        {isInternal ? (
          <div className="space-y-6">
            
            {/* Supabase Status Pill Banner */}
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-white border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-700 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
                  <Database className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-600">Database Cloud:</span>
                    <strong className="text-emerald-800 font-extrabold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Terhubung Supabase SMPN 7 Pasuruan (Realtime Multiuser)
                    </strong>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    Data tersimpan langsung di Cloud & otomatis tersinkronisasi antar-pengguna / multi-user.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={onRefreshData}
                  disabled={isLoadingAgenda || isLoadingUndangan}
                  className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
                  title="Muat data terbaru langsung dari database Supabase"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${(isLoadingAgenda || isLoadingUndangan) ? 'animate-spin text-blue-600' : 'text-blue-600'}`} />
                  <span>Sinkronkan Cloud</span>
                </button>

                <button
                  onClick={onOpenSupabaseConfig}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-bold rounded-xl text-xs transition-colors"
                  title="Buka pengaturan database Supabase & Script SQL"
                >
                  Pengaturan Database
                </button>
              </div>
            </div>

            {/* A. AGENDA KERJA BK CONTROLLER */}
            {isInternalAgenda && (
              <>
                {internalTab === 'form' && (
                  <FormAgenda
                    initialData={editingAgenda}
                    onSubmit={async (data) => {
                      await onSubmitAgenda(data);
                      setEditingAgenda(null);
                      setInternalTab('table');
                    }}
                    onCancelEdit={() => {
                      setEditingAgenda(null);
                      setInternalTab('table');
                    }}
                    isSubmitting={isSubmittingAgenda}
                    siswaItems={siswaItems}
                  />
                )}

                {internalTab === 'table' && (
                  <TabelAgenda
                    items={agendaItems}
                    onEdit={(item) => {
                      setEditingAgenda(item);
                      setInternalTab('form');
                    }}
                    onDelete={onDeleteAgenda}
                    onPrint={() => handleOpenPrint('agenda')}
                    isSupabase={isSupabaseConnected}
                    isLoading={isLoadingAgenda}
                  />
                )}

                {internalTab === 'stats' && <StatistikRekap items={agendaItems} />}
              </>
            )}

            {/* B. UNDANGAN ORANG TUA CONTROLLER */}
            {isInternalUndangan && (
              <>
                {internalTab === 'form' && (
                  <FormUndangan
                    initialData={editingUndangan}
                    onSubmit={async (data) => {
                      await onSubmitUndangan(data);
                      setEditingUndangan(null);
                      setInternalTab('table');
                    }}
                    onCancelEdit={() => {
                      setEditingUndangan(null);
                      setInternalTab('table');
                    }}
                    isSubmitting={isSubmittingUndangan}
                    siswaItems={siswaItems}
                  />
                )}

                {internalTab === 'table' && (
                  <TabelUndangan
                    items={undanganItems}
                    onEdit={(item) => {
                      setEditingUndangan(item);
                      setInternalTab('form');
                    }}
                    onDelete={onDeleteUndangan}
                    onPrint={() => handleOpenPrint('undangan_tabel')}
                    onPrintSuratUndangan={(item) => handleOpenPrint('surat_undangan', item)}
                    onPrintLaporanKonsultasi={(item) => handleOpenPrint('laporan_konsultasi', item)}
                    isSupabase={isSupabaseConnected}
                    isLoading={isLoadingUndangan}
                  />
                )}
              </>
            )}

            {/* C. HOME VISIT / KUNJUNGAN RUMAH CONTROLLER */}
            {isInternalHomeVisit && (
              <>
                {internalTab === 'form' && (
                  <FormHomeVisit
                    initialData={editingHomeVisit}
                    onSubmit={async (data) => {
                      await onSubmitHomeVisit(data);
                      setEditingHomeVisit(null);
                      setInternalTab('table');
                    }}
                    onCancelEdit={() => {
                      setEditingHomeVisit(null);
                      setInternalTab('table');
                    }}
                    isSubmitting={isSubmittingHomeVisit}
                    siswaItems={siswaItems}
                  />
                )}

                {internalTab === 'table' && (
                  <TabelHomeVisit
                    items={homeVisitItems}
                    onEdit={(item) => {
                      setEditingHomeVisit(item);
                      setInternalTab('form');
                    }}
                    onDelete={onDeleteHomeVisit}
                    onPrint={() => handleOpenPrint('home_visit_tabel')}
                    onPrintLaporanHomeVisit={(item) => handleOpenPrint('laporan_home_visit', null, item)}
                    onPrintSuratTugasHomeVisit={(item) => handleOpenPrint('surat_tugas_home_visit', null, item)}
                    onPrintSuratKesediaanOrtu={(item) => handleOpenPrint('surat_kesediaan_ortu', null, item)}
                    isSupabase={isSupabaseConnected}
                    isLoading={isLoadingHomeVisit}
                  />
                )}
              </>
            )}

            {/* D. REKAM PERMASALAHAN SISWA CONTROLLER */}
            {isInternalRekamPermasalahan && (
              <>
                {internalTab === 'form' && (
                  <FormRekamPermasalahan
                    initialData={editingRekamPermasalahan}
                    onSubmit={async (data) => {
                      await onSubmitRekamPermasalahan(data);
                      setEditingRekamPermasalahan(null);
                      setInternalTab('table');
                    }}
                    onCancelEdit={() => {
                      setEditingRekamPermasalahan(null);
                      setInternalTab('table');
                    }}
                    isSubmitting={isSubmittingRekamPermasalahan}
                    siswaItems={siswaItems}
                  />
                )}

                {internalTab === 'table' && (
                  <TabelRekamPermasalahan
                    items={rekamPermasalahanItems}
                    onEdit={(item) => {
                      setEditingRekamPermasalahan(item);
                      setInternalTab('form');
                    }}
                    onDelete={onDeleteRekamPermasalahan}
                    onPrintRekap={() => handleOpenPrint('rekam_permasalahan_tabel')}
                    onPrintItem={(item) => handleOpenPrint('rekam_permasalahan_dokumen', null, null, item)}
                    // @ts-ignore
                    isSupabase={isSupabaseConnected}
                    isLoading={isLoadingRekamPermasalahan}
                  />
                )}
              </>
            )}

            {/* E. RENCANA KONSELING INDIVIDU CONTROLLER */}
            {isInternalKonselingIndividu && (
              <>
                {internalTab === 'form' && (
                  <FormKonselingIndividu
                    initialData={editingKonselingIndividu}
                    onSubmit={async (data) => {
                      await onSubmitKonselingIndividu(data);
                      setEditingKonselingIndividu(null);
                      setInternalTab('table');
                    }}
                    onCancelEdit={() => {
                      setEditingKonselingIndividu(null);
                      setInternalTab('table');
                    }}
                    isSubmitting={isSubmittingKonselingIndividu}
                    siswaItems={siswaItems}
                  />
                )}

                {internalTab === 'table' && (
                  <TabelKonselingIndividu
                    items={konselingIndividuItems}
                    onEdit={(item) => {
                      setEditingKonselingIndividu(item);
                      setInternalTab('form');
                    }}
                    onDelete={onDeleteKonselingIndividu}
                    onPrintRekap={() => handleOpenPrint('konseling_individu_tabel')}
                    onPrintItem={(item) => handleOpenPrint('konseling_individu_dokumen', null, null, null, item)}
                    // @ts-ignore
                    isSupabase={isSupabaseConnected}
                    isLoading={isLoadingKonselingIndividu}
                  />
                )}
              </>
            )}

            {/* F. RENCANA KONSELING KELOMPOK CONTROLLER */}
            {isInternalKonselingKelompok && (
              <>
                {internalTab === 'form' && (
                  <FormKonselingKelompok
                    initialData={editingKonselingKelompok}
                    onSubmit={async (data) => {
                      await onSubmitKonselingKelompok(data);
                      setEditingKonselingKelompok(null);
                      setInternalTab('table');
                    }}
                    onCancelEdit={() => {
                      setEditingKonselingKelompok(null);
                      setInternalTab('table');
                    }}
                    isSubmitting={isSubmittingKonselingKelompok}
                    siswaItems={siswaItems}
                  />
                )}

                {internalTab === 'table' && (
                  <TabelKonselingKelompok
                    items={konselingKelompokItems}
                    onEdit={(item) => {
                      setEditingKonselingKelompok(item);
                      setInternalTab('form');
                    }}
                    onDelete={onDeleteKonselingKelompok}
                    onPrintRekap={() => handleOpenPrint('konseling_kelompok_tabel')}
                    onPrintItem={(item) => handleOpenPrint('konseling_kelompok_dokumen', null, null, null, null, item)}
                    // @ts-ignore
                    isSupabase={isSupabaseConnected}
                    isLoading={isLoadingKonselingKelompok}
                  />
                )}
              </>
            )}

            {/* G. SURAT PERNYATAAN SISWA CONTROLLER */}
            {isInternalSuratPernyataan && (
              <>
                {internalTab === 'form' && (
                  <FormSuratPernyataan
                    initialData={editingSuratPernyataan}
                    onSubmit={async (data) => {
                      await onSubmitSuratPernyataan(data);
                      setEditingSuratPernyataan(null);
                      setInternalTab('table');
                    }}
                    onCancelEdit={() => {
                      setEditingSuratPernyataan(null);
                      setInternalTab('table');
                    }}
                    isSubmitting={isSubmittingSuratPernyataan}
                    siswaItems={siswaItems}
                  />
                )}

                {internalTab === 'table' && (
                  <TabelSuratPernyataan
                    items={suratPernyataanItems}
                    onEdit={(item) => {
                      setEditingSuratPernyataan(item);
                      setInternalTab('form');
                    }}
                    onDelete={onDeleteSuratPernyataan}
                    onPrintTableRekap={() => handleOpenPrint('surat_pernyataan_tabel')}
                    onPrintItem={(item) => handleOpenPrint('surat_pernyataan_dokumen', null, null, null, null, null, item)}
                    isFromSupabase={isSupabaseConnected}
                  />
                )}
              </>
            )}

            {/* H. NOTULEN RAPAT KONFERENSI KASUS SISWA CONTROLLER */}
            {isInternalKonferensiKasus && (
              <>
                {internalTab === 'form' && (
                  <FormKonferensiKasus
                    initialData={editingKonferensiKasus}
                    onSubmit={async (data) => {
                      await onSubmitKonferensiKasus(data);
                      setEditingKonferensiKasus(null);
                      setInternalTab('table');
                    }}
                    onCancelEdit={() => {
                      setEditingKonferensiKasus(null);
                      setInternalTab('table');
                    }}
                    isSubmitting={isSubmittingKonferensiKasus}
                    existingItems={konferensiKasusItems}
                    siswaItems={siswaItems}
                  />
                )}

                {internalTab === 'table' && (
                  <TabelKonferensiKasus
                    items={konferensiKasusItems}
                    onEdit={(item) => {
                      setEditingKonferensiKasus(item);
                      setInternalTab('form');
                    }}
                    onDelete={onDeleteKonferensiKasus}
                    onPrintTableRekap={() => handleOpenPrint('konferensi_kasus_tabel')}
                    onPrintItem={(item, docType) => {
                      const printTypeMap: Record<string, string> = {
                        'notula': 'konferensi_kasus_notula',
                        'notulen': 'konferensi_kasus_notulen_rapat',
                        'daftar_hadir': 'konferensi_kasus_daftar_hadir',
                        'gabungan': 'konferensi_kasus_gabungan'
                      };
                      const mappedType = printTypeMap[docType] || 'konferensi_kasus_gabungan';
                      handleOpenPrint(mappedType as any, null, null, null, null, null, null, item);
                    }}
                    isFromSupabase={isSupabaseConnected}
                  />
                )}
              </>
            )}

            {/* I. DATA MANAGEMENT SISWA CONTROLLER */}
            {isInternalSiswa && (
              <>
                {internalTab === 'form' && (
                  <FormSiswa
                    initialData={editingSiswa}
                    onSubmit={async (data) => {
                      await onSubmitSiswa(data);
                      setEditingSiswa(null);
                      setInternalTab('table');
                    }}
                    onCancelEdit={() => {
                      setEditingSiswa(null);
                      setInternalTab('table');
                    }}
                    isSubmitting={isSubmittingSiswa}
                  />
                )}

                {internalTab === 'table' && (
                  <TabelSiswa
                    items={siswaItems}
                    onEdit={(item) => {
                      setEditingSiswa(item);
                      setInternalTab('form');
                    }}
                    onDelete={onDeleteSiswa}
                    onBulkImport={onBulkImportSiswa}
                    isSupabase={isSupabaseConnected}
                    isLoading={isLoadingSiswa}
                  />
                )}
              </>
            )}

            {/* J. JURNAL BK CONTROLLER */}
            {isInternalJurnalBK && (
              <>
                {internalTab === 'form' && (
                  <FormJurnalBK
                    initialData={editingJurnalBK}
                    onSubmit={async (data) => {
                      if (onSubmitJurnalBK) {
                        await onSubmitJurnalBK(data);
                      }
                      setEditingJurnalBK(null);
                      setInternalTab('table');
                    }}
                    onCancelEdit={() => {
                      setEditingJurnalBK(null);
                      setInternalTab('table');
                    }}
                    isSubmitting={isSubmittingJurnalBK}
                    siswaItems={siswaItems}
                  />
                )}

                {internalTab === 'table' && (
                  <TabelJurnalBK
                    items={jurnalBKItems}
                    onEdit={(item) => {
                      setEditingJurnalBK(item);
                      setInternalTab('form');
                    }}
                    onDelete={onDeleteJurnalBK || (async () => {})}
                    onPrintTableRekap={() => handleOpenPrint('jurnal_bk_tabel')}
                    onPrintItem={(item) => handleOpenPrint('jurnal_bk_dokumen', null, null, null, null, null, null, null, item)}
                    isSupabase={isSupabaseConnected}
                    isLoading={isLoadingJurnalBK}
                  />
                )}
              </>
            )}

          </div>
        ) : (
          /* External Web View Frame */
          <div className="h-full min-h-[600px] flex flex-col bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl relative">
            
            {/* Embedded URL Bar */}
            <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-2 truncate max-w-xl">
                <Globe className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span className="truncate">{selectedLink?.url}</span>
              </div>

              <a
                href={selectedLink?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-amber-300 hover:underline font-bold"
              >
                <span>Buka Jendela Penuh</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Embedded iFrame or Fallback */}
            <div className="flex-1 relative bg-white">
              <iframe
                key={iframeKey}
                src={selectedLink?.url}
                title={selectedLink?.title}
                className="w-full h-full border-none min-h-[550px]"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />

              {/* Security / X-Frame-Options notice banner overlay at bottom */}
              <div className="absolute bottom-4 inset-x-4 bg-slate-900/90 backdrop-blur-md text-slate-200 p-3 rounded-xl border border-slate-700 shadow-xl flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    Bila tampilan web tidak muncul karena kebijakan keamanan (X-Frame-Options), gunakan tombol <strong>Buka Tab Baru</strong>.
                  </span>
                </div>
                <a
                  href={selectedLink?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg text-xs shrink-0 transition-colors shadow"
                >
                  Buka Web
                </a>
              </div>
            </div>

          </div>
        )}
      </div>

    </section>
  );
};
