import React, { useState } from 'react';
import { SuratPernyataan, JenisSuratPernyataan } from '../types';
import {
  FileText,
  Search,
  Printer,
  FileCheck2,
  Trash2,
  Pencil,
  Eye,
  Download,
  Calendar,
  X,
  User,
  ShieldCheck,
  Building,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { downloadSuratPernyataanWord, downloadBulkSuratPernyataanWord } from '../lib/wordExporter';


function formatName(name: string | undefined | null) {
  if (!name) return name;
  return name.replace(/S\.PD/g, 'S.Pd').replace(/S\.pd/g, 'S.Pd');
}

interface TabelSuratPernyataanProps {
  items: SuratPernyataan[];
  onEdit: (item: SuratPernyataan) => void;
  onDelete: (id: string) => Promise<void>;
  onPrintItem: (item: SuratPernyataan) => void;
  onPrintTableRekap: (items: SuratPernyataan[]) => void;
  isFromSupabase?: boolean;
}

const JENIS_LABEL_MAP: Record<JenisSuratPernyataan, { label: string; badge: string; color: string }> = {
  SP_1: { label: '1. SP 1 Siswa', badge: 'SP 1', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  SP_2: { label: '2. SP 2 Siswa', badge: 'SP 2', color: 'bg-orange-100 text-orange-800 border-orange-300' },
  SP_3: { label: '3. SP 3 Siswa', badge: 'SP 3', color: 'bg-red-100 text-red-800 border-red-300' },
  SP_ORTU_1: { label: '4. SP Orang Tua 1', badge: 'ORTU 1', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  SP_ORTU_2: { label: '5. SP Orang Tua 2', badge: 'ORTU 2', color: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
  SP_PENGUNDURAN_DIRI: { label: '6. SP Pengunduran Diri', badge: 'PINDAH', color: 'bg-rose-100 text-rose-800 border-rose-300' },
};

export const TabelSuratPernyataan: React.FC<TabelSuratPernyataanProps> = ({
  items,
  onEdit,
  onDelete,
  onPrintItem,
  onPrintTableRekap,
  isFromSupabase = false,
}) => {
  const [search, setSearch] = useState('');
  const [filterJenis, setFilterJenis] = useState<string>('ALL');
  const [selectedItem, setSelectedItem] = useState<SuratPernyataan | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.nama_siswa.toLowerCase().includes(search.toLowerCase()) ||
      item.kelas.toLowerCase().includes(search.toLowerCase()) ||
      item.nama_orang_tua.toLowerCase().includes(search.toLowerCase()) ||
      item.keterangan.toLowerCase().includes(search.toLowerCase());

    const matchesJenis = filterJenis === 'ALL' || item.jenis_sp === filterJenis;

    return matchesSearch && matchesJenis;
  });

  const handleDeleteConfirm = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus dokumen Surat Pernyataan ini?')) {
      setDeletingId(id);
      try {
        await onDelete(id);
      } finally {
        setDeletingId(null);
        if (selectedItem?.id === id) setSelectedItem(null);
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-5 sm:p-7 space-y-5">
      
      {/* Header Tabel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 rounded-2xl text-white shadow-lg shadow-orange-500/20">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 rounded-md border border-amber-200">
                TABEL G
              </span>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Rekap Surat Pernyataan Siswa
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Daftar SP 1, SP 2, SP 3, SP Orang Tua, & Pengunduran Diri (Total {items.length} Berkas)
            </p>
          </div>
        </div>

        {/* Action Top Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => downloadBulkSuratPernyataanWord(filteredItems)}
            disabled={filteredItems.length === 0}
            className="px-3.5 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-40"
            title="Download Seluruh Hasil Filter ke Word (.doc)"
          >
            <Download className="w-4 h-4 text-blue-600" />
            <span>Export Word</span>
          </button>

          <button
            onClick={() => onPrintTableRekap(filteredItems)}
            disabled={filteredItems.length === 0}
            className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5 disabled:opacity-40"
            title="Cetak Tabel Rekapitulasi Data"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Tabel Rekap</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari berdasarkan nama siswa, kelas, nama ortu, keterangan..."
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-medium"
          />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Filter className="w-4 h-4" />
          </div>
          <select
            value={filterJenis}
            onChange={(e) => setFilterJenis(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-bold"
          >
            <option value="ALL">Semua Jenis SP ({items.length})</option>
            <option value="SP_1">1. SP 1 Siswa</option>
            <option value="SP_2">2. SP 2 Siswa</option>
            <option value="SP_3">3. SP 3 Siswa</option>
            <option value="SP_ORTU_1">4. SP Orang Tua 1</option>
            <option value="SP_ORTU_2">5. SP Orang Tua 2</option>
            <option value="SP_PENGUNDURAN_DIRI">6. SP Pengunduran Diri</option>
          </select>
        </div>
      </div>

      {/* Tabel Main Data */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700 font-extrabold uppercase tracking-wider border-b border-slate-200">
              <th className="py-3 px-3.5 text-center w-12">No</th>
              <th className="py-3 px-3.5">Jenis SP</th>
              <th className="py-3 px-3.5">Nama Siswa & Kelas</th>
              <th className="py-3 px-3.5">Orang Tua / Wali</th>
              <th className="py-3 px-3.5">Tanggal Surat</th>
              <th className="py-3 px-3.5">Keterangan</th>
              <th className="py-3 px-3.5 text-center w-36">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-800">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="font-medium text-xs">Belum ada data Surat Pernyataan Siswa yang sesuai.</p>
                </td>
              </tr>
            ) : (
              filteredItems.map((item, index) => {
                const jenisInfo = JENIS_LABEL_MAP[item.jenis_sp] || {
                  label: item.jenis_sp,
                  badge: 'SP',
                  color: 'bg-slate-100 text-slate-800 border-slate-300',
                };

                return (
                  <tr key={item.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="py-3 px-3.5 text-center font-bold text-slate-500">
                      {index + 1}
                    </td>
                    <td className="py-3 px-3.5 font-bold">
                      <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-black rounded-md border ${jenisInfo.color}`}>
                        {jenisInfo.badge}
                      </span>
                    </td>
                    <td className="py-3 px-3.5">
                      <div className="font-extrabold text-slate-900">{item.nama_siswa}</div>
                      <div className="text-[11px] text-amber-800 font-bold">Kelas {item.kelas || '-'}</div>
                    </td>
                    <td className="py-3 px-3.5">
                      <div className="font-bold text-slate-800">{item.nama_orang_tua || '-'}</div>
                      <div className="text-[11px] text-slate-500">{item.pekerjaan_orang_tua || item.alamat_orang_tua || '-'}</div>
                    </td>
                    <td className="py-3 px-3.5 whitespace-nowrap text-slate-600 font-medium">
                      {item.tanggal_surat || '-'}
                    </td>
                    <td className="py-3 px-3.5 max-w-xs">
                      <p className="line-clamp-2 text-slate-600 font-normal">
                        {item.keterangan || item.peraturan_diketahui || '-'}
                      </p>
                    </td>
                    <td className="py-3 px-3.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="p-1.5 text-slate-600 hover:text-amber-700 hover:bg-amber-100 rounded-lg transition-colors"
                          title="Lihat Detail Surat"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onPrintItem(item)}
                          className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Cetak Dokumen Resmi"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => downloadSuratPernyataanWord(item)}
                          className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors"
                          title="Download File Word (.doc)"
                        >
                          <Download className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onEdit(item)}
                          className="p-1.5 text-slate-600 hover:text-indigo-700 hover:bg-indigo-100 rounded-lg transition-colors"
                          title="Edit Surat Ini"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteConfirm(item.id)}
                          disabled={deletingId === item.id}
                          className="p-1.5 text-slate-600 hover:text-red-700 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-30"
                          title="Hapus Surat"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Detail Surat */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-5 animate-scale-up">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-amber-500 text-white rounded-xl">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-amber-100 text-amber-800 rounded">
                    {selectedItem.jenis_sp}
                  </span>
                  <h3 className="text-base font-black text-slate-900 mt-0.5">
                    Surat Pernyataan: {selectedItem.nama_siswa}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedItem(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Detail */}
            <div className="space-y-4 text-xs text-slate-800">
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-slate-500 font-bold block">Nama Siswa:</span>
                  <span className="font-extrabold text-slate-900 text-sm">{selectedItem.nama_siswa}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block">Kelas:</span>
                  <span className="font-extrabold text-amber-700 text-sm">Kelas {selectedItem.kelas}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block">Orang Tua / Wali:</span>
                  <span className="font-bold">{selectedItem.nama_orang_tua || '-'} ({selectedItem.pekerjaan_orang_tua || '-'})</span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block">Alamat / Hubungan:</span>
                  <span className="font-medium">{selectedItem.alamat_orang_tua || '-'} ({selectedItem.hubungan_keluarga || '-'})</span>
                </div>
              </div>

              <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 space-y-2">
                <span className="text-amber-900 font-black block uppercase text-[11px] tracking-wider">
                  Poin-poin Pernyataan / Komitmen:
                </span>
                <div className="whitespace-pre-wrap leading-relaxed font-sans text-slate-900 bg-white p-3.5 rounded-xl border border-amber-200">
                  {selectedItem.peraturan_diketahui}
                </div>
              </div>

              {selectedItem.alasan_pengunduran && (
                <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-200 space-y-1">
                  <span className="text-rose-900 font-bold block">Alasan Pengunduran Diri:</span>
                  <p className="font-medium text-slate-900">{selectedItem.alasan_pengunduran}</p>
                </div>
              )}

              <div className="flex items-center justify-between text-slate-500 text-[11px] pt-2">
                <span>Tempat & Tanggal Surat: <b>{selectedItem.tempat_surat}, {selectedItem.tanggal_surat}</b></span>
                {selectedItem.keterangan && <span>Keterangan: <b>{selectedItem.keterangan}</b></span>}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
              <button
                onClick={() => downloadSuratPernyataanWord(selectedItem)}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center gap-1.5"
              >
                <Download className="w-4 h-4 text-blue-600" />
                <span>Export Word</span>
              </button>

              <button
                onClick={() => {
                  onPrintItem(selectedItem);
                  setSelectedItem(null);
                }}
                className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow transition-all flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Dokumen</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
