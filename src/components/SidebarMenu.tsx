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
  RotateCcw,
  FileSpreadsheet,
  UserCheck,
  UserPlus,
  FileCheck2,
  ClipboardList
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
    <aside className="w-full lg:w-88 xl:w-96 shrink-0 bg-white text-slate-800 rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xl shadow-slate-200/50 flex flex-col space-y-4">
      
      {/* Sidebar Header & Add Link Trigger */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl text-white font-bold shadow-md shadow-blue-500/20">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-black text-sm text-slate-900 uppercase tracking-wider">
              MENU APLIKASI BK
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">
              Pilih & Buka Aplikasi Terhubung
            </p>
          </div>
        </div>

        {/* Add Button */}
        <button
          onClick={onAddLink}
          className="px-3 py-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-1.5"
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
          className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
        />
      </div>

      {/* Button Links List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[calc(100vh-280px)] min-h-[300px]">
        {filteredLinks.length === 0 ? (
          <div className="text-center p-6 text-slate-400 space-y-2">
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
                    ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-lg shadow-blue-500/20 scale-[1.01]'
                    : 'bg-slate-100 hover:bg-slate-200/80'
                }`}
              >
                {/* Outer Card */}
                <div
                  onClick={() => onSelectLink(link)}
                  className={`cursor-pointer rounded-[14px] p-3.5 transition-all duration-200 flex items-start gap-3 relative overflow-hidden ${
                    isSelected
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'bg-white/80 text-slate-800 hover:bg-white'
                  }`}
                >
                  {/* Icon Box */}
                  <div
                    className={`p-2.5 rounded-xl text-white bg-gradient-to-br ${gradientClass} shadow-md shrink-0 transform group-hover:scale-105 transition-transform`}
                  >
                    <IconComp className="w-5 h-5 text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {link.badge && (
                        <span className="bg-blue-100 text-blue-800 border border-blue-200 text-[9px] font-black px-1.5 py-0.2 rounded uppercase">
                          {link.badge}
                        </span>
                      )}
                      {link.category && (
                        <span className="text-[10px] text-slate-500 font-semibold">
                          {link.category}
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold tracking-tight text-slate-900 mt-0.5 group-hover:text-blue-600 transition-colors leading-snug">
                      {link.title}
                    </h3>

                    {link.description && (
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {link.description}
                      </p>
                    )}
                  </div>

                  {/* Selection Chevron Indicator */}
                  <div className="self-center shrink-0">
                    <ChevronRight
                      className={`w-5 h-5 transition-transform ${
                        isSelected
                          ? 'text-blue-600 translate-x-0.5'
                          : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    />
                  </div>
                </div>

                {/* Edit & Delete hover controls */}
                <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 backdrop-blur-md p-1 rounded-lg border border-slate-200 shadow-md">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditLink(link);
                    }}
                    className="p-1 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded transition-colors"
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
                      className="p-1 text-slate-600 hover:text-red-600 hover:bg-slate-100 rounded transition-colors"
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
      <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
        <div className="flex items-center gap-1 text-[11px]">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Total {links.length} Aplikasi</span>
        </div>

        <div className="flex items-center gap-1.5">
          {onResetDefault && (
            <button
              onClick={onResetDefault}
              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors border border-slate-300 flex items-center gap-1 text-[11px] font-medium"
              title="Reset Semu Menu Default BK"
            >
              <RotateCcw className="w-3 h-3 text-purple-600" />
              <span>Reset</span>
            </button>
          )}
          <button
            onClick={onBackup}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors border border-slate-300 flex items-center gap-1 text-[11px] font-semibold"
            title="Export File Backup JSON"
          >
            <Download className="w-3 h-3 text-blue-600" />
            <span>Backup</span>
          </button>
          <button
            onClick={onImportClick}
            className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-1 text-[11px] font-bold shadow"
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
