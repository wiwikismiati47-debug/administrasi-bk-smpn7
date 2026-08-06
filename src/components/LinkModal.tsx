import React, { useState, useEffect } from 'react';
import { AppLink } from '../types';
import {
  X,
  PlusCircle,
  Pencil,
  Link as LinkIcon,
  Tag,
  FileText,
  Sparkles,
  Palette,
  CheckCircle2,
  FolderPlus
} from 'lucide-react';

interface LinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (link: AppLink) => void;
  editingLink?: AppLink | null;
}

const COLOR_PRESETS = [
  { name: 'Blue Metallic', value: 'from-blue-600 via-indigo-600 to-blue-800' },
  { name: 'Emerald Gem', value: 'from-emerald-600 via-teal-600 to-emerald-800' },
  { name: 'Amber Gold', value: 'from-amber-500 via-orange-500 to-amber-700' },
  { name: 'Fuchsia Neon', value: 'from-fuchsia-600 via-purple-600 to-violet-800' },
  { name: 'Sky Cyan', value: 'from-sky-600 via-blue-600 to-indigo-800' },
  { name: 'Rose Red 3D', value: 'from-rose-600 via-pink-600 to-red-800' },
  { name: 'Dark Slate 3D', value: 'from-slate-700 via-slate-800 to-slate-950' },
];

const CATEGORY_PRESETS = [
  'Administrasi BK',
  'Penyimpanan Berkas',
  'Kedinasan & Rapor',
  'Database & Cloud',
  'Media Layanan',
  'Lainnya',
];

export const LinkModal: React.FC<LinkModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingLink,
}) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('Administrasi BK');
  const [description, setDescription] = useState('');
  const [badge, setBadge] = useState('LINK');
  const [colorGradient, setColorGradient] = useState('from-blue-600 via-indigo-600 to-blue-800');

  useEffect(() => {
    if (editingLink) {
      setTitle(editingLink.title || '');
      setUrl(editingLink.url || '');
      setCategory(editingLink.category || 'Administrasi BK');
      setDescription(editingLink.description || '');
      setBadge(editingLink.badge || 'LINK');
      setColorGradient(editingLink.colorGradient || COLOR_PRESETS[0].value);
    } else {
      setTitle('');
      setUrl('');
      setCategory('Administrasi BK');
      setDescription('');
      setBadge('LINK');
      setColorGradient(COLOR_PRESETS[0].value);
    }
  }, [editingLink, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Judul aplikasi wajib diisi!');
      return;
    }
    if (!url.trim()) {
      alert('Link URL wajib diisi!');
      return;
    }

    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://') && !finalUrl.startsWith('internal:')) {
      finalUrl = 'https://' + finalUrl;
    }

    const newLink: AppLink = {
      id: editingLink?.id || `link-${Date.now()}`,
      title: title.trim(),
      url: finalUrl,
      category: category.trim(),
      description: description.trim(),
      badge: badge.trim().toUpperCase() || 'LINK',
      colorGradient: colorGradient,
      isInternal: editingLink?.isInternal || false,
    };

    onSave(newLink);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] border border-white/40 relative my-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl text-white bg-gradient-to-br ${colorGradient} shadow-md shadow-blue-500/20`}>
              {editingLink ? <Pencil className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                {editingLink ? 'EDIT TOMBOL MENU APLIKASI' : 'TAMBAH LINK APLIKASI BARU'}
              </h3>
              <p className="text-xs text-slate-500">
                Menu Tombol Dashboard • SMPN 7 Pasuruan
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Judul Aplikasi */}
          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1 flex items-center gap-1.5 uppercase tracking-wide">
              <FolderPlus className="w-3.5 h-3.5 text-blue-600" />
              <span>Judul / Nama Aplikasi <span className="text-red-500">*</span></span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Google Drive Berkas Siswa BK"
              required
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-semibold"
            />
          </div>

          {/* URL Link */}
          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1 flex items-center gap-1.5 uppercase tracking-wide">
              <LinkIcon className="w-3.5 h-3.5 text-blue-600" />
              <span>Link URL Web Aplikasi <span className="text-red-500">*</span></span>
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://drive.google.com atau https://..."
              required
              disabled={editingLink?.isInternal}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-mono text-xs"
            />
            {editingLink?.isInternal && (
              <p className="text-[11px] text-amber-600 mt-1 font-medium">
                * Aplikasi internal utama BK SMPN 7 Pasuruan
              </p>
            )}
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1 flex items-center gap-1.5 uppercase tracking-wide">
              <Tag className="w-3.5 h-3.5 text-blue-600" />
              <span>Kategori Menu</span>
            </label>
            <div className="space-y-2">
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Tulis atau pilih kategori"
                className="w-full px-4 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
              />
              <div className="flex flex-wrap gap-1.5">
                {CATEGORY_PRESETS.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-900 border border-slate-200 transition-colors"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Label Badge */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1 uppercase tracking-wide">
                Label Tanda (Badge)
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="LINK / WEB / APP"
                maxLength={10}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl uppercase font-bold text-blue-900"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1 uppercase tracking-wide">
                Warna Tema 3D
              </label>
              <select
                value={colorGradient}
                onChange={(e) => setColorGradient(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl"
              >
                {COLOR_PRESETS.map((p) => (
                  <option key={p.name} value={p.value}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1 flex items-center gap-1.5 uppercase tracking-wide">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>Keterangan Singkat</span>
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsi fungsi aplikasi ini..."
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
            />
          </div>

          {/* Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors"
            >
              Batal
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white text-xs font-extrabold shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2 transform active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-300" />
              <span>{editingLink ? 'Update Tombol' : 'Simpan Tombol Link'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
