import React, { useState } from 'react';
import { AppLink } from '../types';
import {
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
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
  ShieldCheck,
  Compass,
  RotateCcw
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
}) => {
  const [search, setSearch] = useState('');

  const filteredLinks = links.filter(
    (l) =>
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      (l.category && l.category.toLowerCase().includes(search.toLowerCase())) ||
      (l.description && l.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <aside className="w-full lg:w-88 xl:w-96 shrink-0 bg-slate-900/95 text-slate-100 rounded-3xl p-4 sm:p-5 border border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-xl flex flex-col space-y-4">
      
      {/* Sidebar Header & Add Link Trigger */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl text-slate-950 font-bold shadow-md shadow-amber-500/20">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm text-white uppercase tracking-wider">
              MENU APLIKASI BK
            </h2>
            <p className="text-[11px] text-slate-400">
              Pilih & Buka Aplikasi Terhubung
            </p>
          </div>
        </div>

        {/* 3D Add Button */}
        <button
          onClick={onAddLink}
          className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-[0_6px_12px_rgba(37,99,235,0.3)] border border-blue-400/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0.5 flex items-center gap-1.5"
          title="Tambah Tombol Link Aplikasi Baru"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari tombol aplikasi..."
          className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950/80 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
        />
      </div>

      {/* 3D Button Links List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[calc(100vh-280px)] min-h-[300px]">
        {filteredLinks.length === 0 ? (
          <div className="text-center p-6 text-slate-500 space-y-2">
            <p className="text-xs">Tidak ada menu aplikasi yang sesuai.</p>
          </div>
        ) : (
          filteredLinks.map((link) => {
            const isSelected = selectedLink?.id === link.id;
            const IconComp = getIconComponent(link.iconName);
            const gradientClass =
              link.colorGradient || 'from-blue-600 via-indigo-600 to-blue-800';

            return (
              <div
                key={link.id}
                className={`group relative rounded-2xl p-0.5 transition-all duration-300 ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 shadow-[0_10px_25px_rgba(251,191,36,0.25)] scale-[1.02]'
                    : 'bg-slate-800/80 hover:bg-slate-800 hover:scale-[1.01]'
                }`}
              >
                {/* Outer 3D Tactile Card */}
                <div
                  onClick={() => onSelectLink(link)}
                  className={`cursor-pointer rounded-[14px] p-3.5 transition-all duration-200 flex items-start gap-3 relative overflow-hidden ${
                    isSelected
                      ? 'bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white shadow-inner'
                      : 'bg-slate-900/90 text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  {/* Subtle Top 3D Highlight Bevel */}
                  <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-white/20 via-white/5 to-transparent pointer-events-none" />

                  {/* Icon Box with 3D Bevel */}
                  <div
                    className={`p-2.5 rounded-xl text-white bg-gradient-to-br ${gradientClass} shadow-[0_6px_12px_rgba(0,0,0,0.3)] border border-white/20 shrink-0 transform group-hover:scale-105 transition-transform`}
                  >
                    <IconComp className="w-5 h-5 text-amber-300" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {link.badge && (
                        <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[9px] font-black px-1.5 py-0.2 rounded uppercase">
                          {link.badge}
                        </span>
                      )}
                      {link.category && (
                        <span className="text-[10px] text-slate-400 font-medium">
                          {link.category}
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold tracking-tight text-white mt-0.5 group-hover:text-amber-300 transition-colors leading-snug">
                      {link.title}
                    </h3>

                    {link.description && (
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {link.description}
                      </p>
                    )}
                  </div>

                  {/* Selection Chevron Indicator */}
                  <div className="self-center shrink-0">
                    <ChevronRight
                      className={`w-5 h-5 transition-transform ${
                        isSelected
                          ? 'text-amber-400 translate-x-0.5'
                          : 'text-slate-600 group-hover:text-slate-300'
                      }`}
                    />
                  </div>
                </div>

                {/* Edit & Delete hover controls */}
                <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/90 backdrop-blur-md p-1 rounded-lg border border-slate-700 shadow-md">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditLink(link);
                    }}
                    className="p-1 text-slate-300 hover:text-amber-400 hover:bg-slate-800 rounded transition-colors"
                    title="Edit Tombol Ini"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>

                  {!link.isInternal && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteLink(link.id);
                      }}
                      className="p-1 text-slate-300 hover:text-red-400 hover:bg-slate-800 rounded transition-colors"
                      title="Hapus Tombol"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Footer Backup & Upload Links Action Area */}
      <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
        <div className="flex items-center gap-1 text-[11px]">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Total {links.length} Aplikasi</span>
        </div>

        <div className="flex items-center gap-1.5">
          {onResetDefault && (
            <button
              onClick={onResetDefault}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700 flex items-center gap-1 text-[11px] font-medium"
              title="Reset Semu Menu Default BK"
            >
              <RotateCcw className="w-3 h-3 text-purple-400" />
              <span>Reset</span>
            </button>
          )}
          <button
            onClick={onBackup}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700 flex items-center gap-1 text-[11px] font-semibold"
            title="Export File Backup JSON"
          >
            <Download className="w-3 h-3 text-amber-300" />
            <span>Backup</span>
          </button>
          <button
            onClick={onImportClick}
            className="p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors flex items-center gap-1 text-[11px] font-bold shadow"
            title="Import File Backup JSON"
          >
            <Upload className="w-3 h-3" />
            <span>Upload</span>
          </button>
        </div>
      </div>

    </aside>
  );
};
