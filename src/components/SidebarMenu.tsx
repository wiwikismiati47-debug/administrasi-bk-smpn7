import React, { useState, useMemo } from 'react';
import { AppLink } from '../types';
import {
  Plus,
  Pencil,
  Trash2,
  BookOpen,
  Users,
  Home,
  Database,
  FolderKanban,
  GraduationCap,
  Palette,
  Layers,
  Search,
  Download,
  Upload,
  Sparkles,
  ChevronRight,
  RotateCcw,
  FileSpreadsheet,
  UserCheck,
  UserPlus,
  FileCheck2,
  ClipboardList,
  AlertTriangle,
  X,
  Compass,
  CheckCircle2
} from 'lucide-react';

interface SidebarMenuProps {
  links: AppLink[];
  selectedLink: AppLink | null;
  onSelectLink: (link: AppLink) => void;
  onAddLink: () => void;
  onEditLink: (link: AppLink) => void;
  onDeleteLink: (id: string) => void;
  onBackup: () => void;
  onImportClick: () => void;
  onResetDefault?: () => void;
  onCloseMobile?: () => void;
  counts?: {
    jurnal?: number;
    agenda?: number;
    undangan?: number;
    homeVisit?: number;
    rekam?: number;
    konselingIndividu?: number;
    konselingKelompok?: number;
    suratPernyataan?: number;
    konferensiKasus?: number;
    siswa?: number;
  };
}

// Icon mapper helper
const getIconComponent = (iconName?: string) => {
  switch (iconName) {
    case 'BookOpen':
      return BookOpen;
    case 'Users':
      return Users;
    case 'Home':
      return Home;
    case 'Database':
      return Database;
    case 'FolderKanban':
      return FolderKanban;
    case 'GraduationCap':
      return GraduationCap;
    case 'Palette':
      return Palette;
    case 'FileSpreadsheet':
      return FileSpreadsheet;
    case 'UserCheck':
      return UserCheck;
    case 'UserPlus':
      return UserPlus;
    case 'FileCheck2':
      return FileCheck2;
    case 'ClipboardList':
      return ClipboardList;
    case 'AlertTriangle':
      return AlertTriangle;
    default:
      return Layers;
  }
};

export const SidebarMenu: React.FC<SidebarMenuProps> = ({
  links,
  selectedLink,
  onSelectLink,
  onAddLink,
  onEditLink,
  onDeleteLink,
  onBackup,
  onImportClick,
  onResetDefault,
  onCloseMobile,
  counts
}) => {
  const [search, setSearch] = useState('');

  const getItemCount = (link: AppLink): number | undefined => {
    if (!counts) return undefined;
    if (link.url === 'internal:jurnal_bk') return counts.jurnal;
    if (link.url === 'internal:agenda_bk') return counts.agenda;
    if (link.url === 'internal:undangan_ortu') return counts.undangan;
    if (link.url === 'internal:home_visit') return counts.homeVisit;
    if (link.url === 'internal:rekam_permasalahan') return counts.rekam;
    if (link.url === 'internal:konseling_individu') return counts.konselingIndividu;
    if (link.url === 'internal:konseling_kelompok') return counts.konselingKelompok;
    if (link.url === 'internal:surat_pernyataan') return counts.suratPernyataan;
    if (link.url === 'internal:konferensi_kasus') return counts.konferensiKasus;
    if (link.url === 'internal:siswa') return counts.siswa;
    return undefined;
  };

  const filteredLinks = useMemo(() => {
    return links.filter(
      (l) =>
        l.title.toLowerCase().includes(search.toLowerCase()) ||
        (l.category && l.category.toLowerCase().includes(search.toLowerCase())) ||
        (l.badge && l.badge.toLowerCase().includes(search.toLowerCase())) ||
        (l.description && l.description.toLowerCase().includes(search.toLowerCase()))
    );
  }, [links, search]);

  // Group links into categories if no search
  const categorizedLinks = useMemo(() => {
    if (search.trim()) {
      return [{ category: 'Hasil Pencarian', items: filteredLinks }];
    }

    const groups: { [key: string]: AppLink[] } = {
      'Layanan Utama & Harian': [],
      'Bimbingan & Konseling': [],
      'Administrasi & Surat Resmi': [],
      'Tautan Lainnya': []
    };

    filteredLinks.forEach((link) => {
      if (
        link.url === 'internal:jurnal_bk' ||
        link.url === 'internal:agenda_bk' ||
        link.url === 'internal:siswa'
      ) {
        groups['Layanan Utama & Harian'].push(link);
      } else if (
        link.url === 'internal:konseling_individu' ||
        link.url === 'internal:konseling_kelompok' ||
        link.url === 'internal:rekam_permasalahan'
      ) {
        groups['Bimbingan & Konseling'].push(link);
      } else if (
        link.url === 'internal:undangan_ortu' ||
        link.url === 'internal:home_visit' ||
        link.url === 'internal:surat_pernyataan' ||
        link.url === 'internal:konferensi_kasus'
      ) {
        groups['Administrasi & Surat Resmi'].push(link);
      } else {
        groups['Tautan Lainnya'].push(link);
      }
    });

    return Object.entries(groups)
      .filter(([_, items]) => items.length > 0)
      .map(([category, items]) => ({ category, items }));
  }, [filteredLinks, search]);

  return (
    <aside className="w-full bg-white text-slate-800 rounded-3xl p-3.5 sm:p-4 border border-slate-200 shadow-sm flex flex-col space-y-3.5">
      
      {/* Header & Quick Action */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-600 rounded-xl text-white shadow-xs">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-extrabold text-xs sm:text-sm text-slate-900 uppercase tracking-wide">
              Navigasi Aplikasi BK
            </h2>
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium">
              Pilih Layanan & Administrasi
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Add Custom Link Button */}
          <button
            onClick={onAddLink}
            className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-blue-700 hover:text-blue-800 text-xs font-bold rounded-lg transition-colors border border-slate-200 flex items-center gap-1 cursor-pointer"
            title="Tambah Tautan Menu Baru"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tambah</span>
          </button>

          {/* Close drawer button on mobile */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Tutup Menu"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-3.5 h-3.5" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari layanan (Jurnal, Konseling, dsb)..."
          className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Navigation List grouped by categories */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-0.5 max-h-[calc(100vh-280px)] min-h-[300px]">
        {categorizedLinks.length === 0 ? (
          <div className="text-center py-8 text-slate-400 space-y-2">
            <p className="text-xs font-medium">Tidak ada menu aplikasi yang cocok.</p>
            <button
              onClick={() => setSearch('')}
              className="text-xs text-blue-600 font-bold hover:underline"
            >
              Reset Pencarian
            </button>
          </div>
        ) : (
          categorizedLinks.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1.5">
              <div className="px-1.5 flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400">
                <span>{group.category}</span>
                <span>{group.items.length}</span>
              </div>

              <div className="space-y-1">
                {group.items.map((link) => {
                  const isSelected = selectedLink?.id === link.id;
                  const IconComp = getIconComponent(link.iconName);
                  const count = getItemCount(link);

                  return (
                    <div
                      key={link.id}
                      className="group relative"
                    >
                      <button
                        onClick={() => {
                          onSelectLink(link);
                          if (onCloseMobile) onCloseMobile();
                        }}
                        className={`w-full text-left rounded-xl p-2.5 transition-all flex items-center gap-2.5 cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white font-bold shadow-sm'
                            : 'hover:bg-slate-100 text-slate-700 font-medium'
                        }`}
                      >
                        {/* Icon Badge */}
                        <div
                          className={`p-2 rounded-lg shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-100 group-hover:bg-white text-slate-600 group-hover:text-blue-600 border border-slate-200/60'
                          }`}
                        >
                          <IconComp className="w-4 h-4" />
                        </div>

                        {/* Text Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-xs truncate ${
                                isSelected ? 'text-white font-bold' : 'text-slate-800'
                              }`}
                            >
                              {link.title}
                            </span>
                            {link.badge && (
                              <span
                                className={`text-[9px] font-black px-1.5 py-0.2 rounded shrink-0 uppercase ${
                                  isSelected
                                    ? 'bg-white/20 text-white'
                                    : 'bg-slate-200 text-slate-700'
                                }`}
                              >
                                {link.badge}
                              </span>
                            )}
                          </div>
                          {link.description && (
                            <p
                              className={`text-[10px] truncate leading-tight mt-0.5 ${
                                isSelected ? 'text-blue-100' : 'text-slate-400'
                              }`}
                            >
                              {link.description}
                            </p>
                          )}
                        </div>

                        {/* Count Badge or Chevron */}
                        <div className="shrink-0 flex items-center gap-1">
                          {count !== undefined && (
                            <span
                              className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                                isSelected
                                  ? 'bg-white/20 text-white font-bold'
                                  : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              {count}
                            </span>
                          )}
                          <ChevronRight
                            className={`w-3.5 h-3.5 transition-transform ${
                              isSelected
                                ? 'text-white translate-x-0.5'
                                : 'text-slate-300 group-hover:text-slate-500'
                            }`}
                          />
                        </div>
                      </button>

                      {/* Edit & Delete hover controls for custom/editable links */}
                      <div className="absolute top-2 right-2 hidden group-hover:flex items-center gap-1 bg-white/95 backdrop-blur-md p-0.5 rounded-lg border border-slate-200 shadow-sm z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditLink(link);
                          }}
                          className="p-1 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded transition-colors"
                          title="Edit Tombol"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>

                        {!link.isInternal && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteLink(link.id);
                            }}
                            className="p-1 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded transition-colors"
                            title="Hapus Tombol"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Backup & Utilities */}
      <div className="pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
        <span className="font-semibold text-slate-400">Total {links.length} Modul</span>

        <div className="flex items-center gap-1">
          {onResetDefault && (
            <button
              onClick={onResetDefault}
              className="p-1.5 text-slate-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
              title="Reset Susunan Menu Awal"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={onBackup}
            className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            title="Download Backup Menu (JSON)"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onImportClick}
            className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
            title="Upload / Restore Menu (JSON)"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </aside>
  );
};
