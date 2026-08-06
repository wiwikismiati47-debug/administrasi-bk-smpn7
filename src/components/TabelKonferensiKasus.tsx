import React, { useState } from 'react';
import { KonferensiKasus, DaftarHadirRow } from '../types';
import {
  FileText,
  Search,
  Printer,
  ClipboardList,
  Trash2,
  Pencil,
  Eye,
  Calendar,
  X,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface TabelKonferensiKasusProps {
  items: KonferensiKasus[];
  onEdit: (item: KonferensiKasus) => void;
  onDelete: (id: string) => Promise<void>;
  onPrintItem: (item: KonferensiKasus, docType: 'notula' | 'notulen' | 'daftar_hadir' | 'gabungan') => void;
  onPrintTableRekap: (items: KonferensiKasus[]) => void;
  isFromSupabase?: boolean;
}

export const TabelKonferensiKasus: React.FC<TabelKonferensiKasusProps> = ({
  items,
  onEdit,
  onDelete,
  onPrintItem,
  onPrintTableRekap,
  isFromSupabase = false,
}) => {
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<KonferensiKasus | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredItems = items.filter((item) => {
    return (
      item.nama_konseli.toLowerCase().includes(search.toLowerCase()) ||
      item.kelas_ta.toLowerCase().includes(search.toLowerCase()) ||
      item.jenis_masalah.toLowerCase().includes(search.toLowerCase()) ||
      (item.keterangan || '').toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleDeleteConfirm = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus dokumen Konferensi Kasus ini dari database?')) {
      setDeletingId(id);
      try {
        await onDelete(id);
      } finally {
        setDeletingId(null);
        if (selectedItem?.id === id) setSelectedItem(null);
      }
    }
  };

  const getDaftarHadirLength = (rowStr?: string) => {
    if (!rowStr) return 0;
    try {
      const parsed = JSON.parse(rowStr);
      return Array.isArray(parsed) ? parsed.length : 0;
    } catch {
      return 0;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-5 sm:p-7 space-y-5">
      
      {/* Header Tabel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-rose-600 via-red-600 to-orange-600 rounded-2xl text-white shadow-lg shadow-rose-500/20">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 rounded-md border border-rose-200">
                TABEL H
              </span>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Rekap Konferensi Kasus Siswa
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Daftar Notula, Notulen Rapat, dan Daftar Hadir (Total {items.length} Berkas)
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onPrintTableRekap(filteredItems)}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 transition-all"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            Cetak Rekap Tabel
          </button>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama konseli, kelas, jenis masalah..."
            className="w-full text-xs rounded-xl border-slate-200 focus:border-rose-500 focus:ring-rose-500 pl-10 pr-4 py-2.5 border outline-none bg-slate-50/50"
          />
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* Left Side: Table List */}
        <div className="xl:col-span-2 overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 select-none">
                <th className="p-4 w-12 text-center">No</th>
                <th className="p-4">Konseli / Kelas</th>
                <th className="p-4">Jenis Masalah</th>
                <th className="p-4">Tanggal Pelaksanaan</th>
                <th className="p-4 text-center">Jumlah Peserta</th>
                <th className="p-4 text-center w-28">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item, index) => {
                const isSelected = selectedItem?.id === item.id;
                return (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`cursor-pointer transition-colors hover:bg-slate-50/75 ${
                      isSelected ? 'bg-rose-50/40 hover:bg-rose-50/60' : ''
                    }`}
                  >
                    <td className="p-4 text-center text-slate-500 font-semibold">{index + 1}</td>
                    <td className="p-4">
                      <div className="font-bold text-slate-800">{item.nama_konseli}</div>
                      <div className="text-[10px] text-slate-500 font-semibold">{item.kelas_ta || 'Tidak ada kelas'}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-slate-700 font-medium line-clamp-1">{item.jenis_masalah}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{item.keterangan || '-'}</div>
                    </td>
                    <td className="p-4 text-slate-500 font-medium">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {item.hari_tgl_jam ? (
                          <span className="line-clamp-1">{item.hari_tgl_jam}</span>
                        ) : (
                          <span>{item.tanggal_surat}</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-center text-slate-700 font-bold">
                      {getDaftarHadirLength(item.daftar_hadir_rows)} orang
                    </td>
                    <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => onEdit(item)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
                          title="Edit Data"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteConfirm(item.id)}
                          disabled={deletingId === item.id}
                          className="p-1.5 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors disabled:opacity-50"
                          title="Hapus Data"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 font-medium">
                    Belum ada data konferensi kasus yang sesuai pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Right Side: Quick Action & Details Preview */}
        <div className="xl:col-span-1">
          {selectedItem ? (
            <div className="border border-slate-200/90 rounded-2xl p-5 bg-slate-50/50 space-y-4 shadow-sm animate-fade-in">
              <div className="flex items-start justify-between border-b pb-3 border-slate-200">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Pratinjau Berkas</h3>
                  <p className="text-[10px] text-slate-500 font-medium">Informasi kasus & opsi cetak dokumen</p>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Stats info */}
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Nama Konseli</span>
                  <strong className="text-slate-800 text-sm font-black">{selectedItem.nama_konseli}</strong>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400 font-semibold block text-[10px] uppercase">Kelas</span>
                    <strong className="text-slate-700 font-bold">{selectedItem.kelas_ta || '-'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block text-[10px] uppercase">Keterpenuhan Data</span>
                    <span
                      className={`inline-block px-1.5 py-0.5 text-[9px] font-bold rounded uppercase border ${
                        selectedItem.keterpenuhan_kebutuhan_data === 'terpenuhi'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {selectedItem.keterpenuhan_kebutuhan_data === 'terpenuhi' ? 'Terpenuhi' : 'Belum Terpenuhi'}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Permasalahan</span>
                  <p className="text-slate-700 font-medium leading-relaxed">{selectedItem.jenis_masalah}</p>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Hasil Rapat Notulen</span>
                  <p className="text-slate-600 font-normal leading-relaxed line-clamp-3 italic">
                    {selectedItem.rapat_hasil_pertemuan || 'Tidak ada uraian hasil pertemuan.'}
                  </p>
                </div>
                
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Daftar Hadir Singkat</span>
                  <p className="text-slate-600 font-normal leading-relaxed line-clamp-2">
                    {selectedItem.daftar_hadir_peserta_singkat || '-'}
                  </p>
                </div>
              </div>

              {/* Action Buttons to Print Specific Docs */}
              <div className="border-t pt-4 border-slate-200 space-y-2">
                <span className="text-slate-400 font-semibold block text-[10px] uppercase mb-1">
                  Cetak Formulir Konferensi
                </span>

                <button
                  onClick={() => onPrintItem(selectedItem, 'notula')}
                  className="w-full flex items-center justify-between text-left text-xs text-slate-700 font-semibold bg-white hover:bg-rose-50 hover:text-rose-700 border border-slate-200 hover:border-rose-200 p-2.5 rounded-xl transition-all"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-rose-500" />
                    1. Notula Konferensi Kasus
                  </span>
                  <Printer className="w-4 h-4 text-slate-400 shrink-0" />
                </button>

                <button
                  onClick={() => onPrintItem(selectedItem, 'notulen')}
                  className="w-full flex items-center justify-between text-left text-xs text-slate-700 font-semibold bg-white hover:bg-rose-50 hover:text-rose-700 border border-slate-200 hover:border-rose-200 p-2.5 rounded-xl transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-500" />
                    2. Notulen Rapat Konferensi
                  </span>
                  <Printer className="w-4 h-4 text-slate-400 shrink-0" />
                </button>

                <button
                  onClick={() => onPrintItem(selectedItem, 'daftar_hadir')}
                  className="w-full flex items-center justify-between text-left text-xs text-slate-700 font-semibold bg-white hover:bg-rose-50 hover:text-rose-700 border border-slate-200 hover:border-rose-200 p-2.5 rounded-xl transition-all"
                >
                  <span className="flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-teal-500" />
                    3. Daftar Hadir Konferensi
                  </span>
                  <Printer className="w-4 h-4 text-slate-400 shrink-0" />
                </button>

                <button
                  onClick={() => onPrintItem(selectedItem, 'gabungan')}
                  className="w-full flex items-center justify-between text-left text-xs text-white font-bold bg-rose-600 hover:bg-rose-700 p-2.5 rounded-xl transition-all shadow-md hover:shadow-rose-500/20"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-white" />
                    Cetak Gabungan (Seluruh Dokumen)
                  </span>
                  <Printer className="w-4 h-4 text-white shrink-0" />
                </button>
              </div>
            </div>
          ) : (
            <div className="border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-400 bg-slate-50/25">
              <Eye className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-semibold">Pratinjau Berkas</p>
              <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                Pilih salah satu baris rekam data di sebelah kiri untuk melihat detail cepat dan mencetak berkas.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
