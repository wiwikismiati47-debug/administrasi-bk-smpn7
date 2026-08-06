import React, { useState } from 'react';
import { RekamPermasalahan } from '../types';
import {
  FileText,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Printer,
  ExternalLink,
  Sparkles,
  User,
  Users,
  Calendar,
  Clock,
  MapPin,
  Briefcase,
  AlertCircle,
  X,
  FileSpreadsheet,
  Building,
  GraduationCap
} from 'lucide-react';

interface TabelRekamPermasalahanProps {
  items: RekamPermasalahan[];
  onEdit: (item: RekamPermasalahan) => void;
  onDelete: (id: string) => Promise<void>;
  onPrintItem?: (item: RekamPermasalahan) => void;
  onPrintRekap?: () => void;
}

export const TabelRekamPermasalahan: React.FC<TabelRekamPermasalahanProps> = ({
  items,
  onEdit,
  onDelete,
  onPrintItem,
  onPrintRekap,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKelasFilter, setSelectedKelasFilter] = useState('ALL');
  const [selectedDetail, setSelectedDetail] = useState<RekamPermasalahan | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Extract unique classes for filtering
  const uniqueClasses = Array.from(new Set(items.map((i) => i.kelas).filter(Boolean))).sort();

  const filtered = items.filter((item) => {
    const matchKelas = selectedKelasFilter === 'ALL' || item.kelas === selectedKelasFilter;
    const query = searchTerm.toLowerCase();
    const matchSearch =
      !searchTerm ||
      item.nama_siswa?.toLowerCase().includes(query) ||
      item.nama_orang_tua?.toLowerCase().includes(query) ||
      item.kelas?.toLowerCase().includes(query) ||
      item.ringkasan_uraian_permasalahan?.toLowerCase().includes(query) ||
      item.upaya_konselor_walikelas?.toLowerCase().includes(query) ||
      item.hasil_dan_kesimpulan?.toLowerCase().includes(query);

    return matchKelas && matchSearch;
  });

  const handleDeleteConfirm = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data rekam permasalahan siswa ini?')) {
      setDeletingId(id);
      try {
        await onDelete(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const formatIndoDate = (dateVal?: string) => {
    if (!dateVal) return '-';
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return dateVal;
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white text-slate-800 rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xl shadow-slate-200/50 relative space-y-6">
      
      {/* Table Header Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-700 text-white rounded-2xl shadow-md shadow-emerald-500/20 font-black">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                TABEL D
              </span>
              <span className="text-xs text-emerald-800 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                Terdata {filtered.length} Permasalahan Siswa
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              REKAP DATA REKAM PERMASALAHAN SISWA
            </h3>
            <p className="text-xs text-slate-500">
              Total {items.length} Data Terdaftar • {filtered.length} Ditampilkan
            </p>
          </div>
        </div>

        {onPrintRekap && (
          <button
            onClick={onPrintRekap}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all self-start lg:self-auto"
          >
            <Printer className="w-4 h-4 text-emerald-200" />
            <span>Cetak / Export Rekap Tabel</span>
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200">
        <div className="md:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama siswa, orang tua, kelas, atau kata kunci permasalahan..."
            className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-3.5 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>

        <div className="relative">
          <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <select
            value={selectedKelasFilter}
            onChange={(e) => setSelectedKelasFilter(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-3.5 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer"
          >
            <option value="ALL">Semua Kelas ({items.length})</option>
            {uniqueClasses.map((kls) => (
              <option key={kls} value={kls}>
                Kelas {kls}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100/90 text-slate-800 font-extrabold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <th className="p-3 text-center w-10">NO</th>
              <th className="p-3 w-32">HARI / TGL / WAKTU</th>
              <th className="p-3 w-36">KELAS & SISWA</th>
              <th className="p-3 w-36">ORANG TUA & ALAMAT</th>
              <th className="p-3">RINGKASAN PERMASALAHAN</th>
              <th className="p-3">UPAYA KONSELOR & WALI KELAS</th>
              <th className="p-3 w-36">HASIL & KESIMPULAN</th>
              <th className="p-3 text-center w-28">AKSI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-700">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-10 text-center text-slate-400 italic bg-slate-50/50">
                  <div className="max-w-xs mx-auto space-y-2">
                    <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="font-semibold text-sm">Tidak ada data rekam permasalahan siswa ditemukan.</p>
                    <p className="text-xs text-slate-400">Silakan isi formulir di atas untuk menambahkan data baru.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 text-center font-extrabold text-slate-500">{idx + 1}</td>

                  {/* Hari / Tgl / Waktu */}
                  <td className="p-3 font-medium">
                    <div className="font-bold text-slate-900">{item.hari}</div>
                    <div className="text-[11px] text-slate-600">{formatIndoDate(item.tanggal)}</div>
                    <div className="text-[10px] text-emerald-700 font-mono font-bold mt-0.5">{item.waktu || '08:00 WIB'}</div>
                  </td>

                  {/* Kelas & Siswa */}
                  <td className="p-3">
                    <span className="inline-block bg-emerald-100 text-emerald-900 font-extrabold text-[10px] px-2 py-0.5 rounded mb-1">
                      Kelas {item.kelas}
                    </span>
                    <div className="font-bold text-slate-900 text-sm">{item.nama_siswa}</div>
                  </td>

                  {/* Orang Tua & Alamat */}
                  <td className="p-3">
                    <div className="font-bold text-slate-800">{item.nama_orang_tua || '-'}</div>
                    {item.pekerjaan_orang_tua && (
                      <div className="text-[10px] text-slate-500 font-medium">{item.pekerjaan_orang_tua}</div>
                    )}
                    {item.alamat && (
                      <div className="text-[10px] text-slate-500 truncate max-w-[140px] mt-0.5" title={item.alamat}>
                        {item.alamat}
                      </div>
                    )}
                  </td>

                  {/* Ringkasan Permasalahan */}
                  <td className="p-3">
                    <div className="line-clamp-2 text-slate-800 font-medium leading-relaxed" title={item.ringkasan_uraian_permasalahan}>
                      {item.ringkasan_uraian_permasalahan || '-'}
                    </div>
                  </td>

                  {/* Upaya Konselor & Wali Kelas */}
                  <td className="p-3">
                    <div className="line-clamp-2 text-slate-700 leading-relaxed" title={item.upaya_konselor_walikelas}>
                      {item.upaya_konselor_walikelas || '-'}
                    </div>
                  </td>

                  {/* Hasil & Kesimpulan */}
                  <td className="p-3">
                    <div className="line-clamp-2 text-slate-700 leading-relaxed" title={item.hasil_dan_kesimpulan}>
                      {item.hasil_dan_kesimpulan || '-'}
                    </div>
                    {item.keterangan && (
                      <span className="inline-block bg-slate-100 text-slate-700 text-[10px] px-1.5 py-0.5 rounded mt-1 font-semibold">
                        {item.keterangan}
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {/* View Detail Modal Button */}
                      <button
                        onClick={() => setSelectedDetail(item)}
                        className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
                        title="Lihat Detail Lengkap"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => onEdit(item)}
                        className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg transition-colors"
                        title="Edit Data Ini"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Print Single Item Button */}
                      {onPrintItem && (
                        <button
                          onClick={() => onPrintItem(item)}
                          className="p-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors"
                          title="Cetak Dokumen Permasalahan"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteConfirm(item.id)}
                        disabled={deletingId === item.id}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg transition-colors disabled:opacity-50"
                        title="Hapus Data Ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* DETAIL MODAL */}
      {selectedDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in duration-150">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500 text-white rounded-xl">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="bg-emerald-100 text-emerald-900 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                    DETAIL REKAM PERMASALAHAN SISWA
                  </span>
                  <h4 className="text-lg font-black text-slate-900">
                    {selectedDetail.nama_siswa} (Kelas {selectedDetail.kelas})
                  </h4>
                </div>
              </div>
              <button
                onClick={() => setSelectedDetail(null)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 text-xs leading-relaxed text-slate-700">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div>
                  <span className="font-bold text-slate-500 block">Hari / Tanggal / Waktu:</span>
                  <span className="font-extrabold text-slate-900 text-sm">
                    {selectedDetail.hari}, {formatIndoDate(selectedDetail.tanggal)} ({selectedDetail.waktu})
                  </span>
                </div>
                <div>
                  <span className="font-bold text-slate-500 block">Kelas Siswa:</span>
                  <span className="font-extrabold text-emerald-800 text-sm">Kelas {selectedDetail.kelas}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-500 block">Orang Tua / Wali:</span>
                  <span className="font-semibold text-slate-800">{selectedDetail.nama_orang_tua || '-'} ({selectedDetail.pekerjaan_orang_tua || 'Tidak diisi'})</span>
                </div>
                <div>
                  <span className="font-bold text-slate-500 block">Alamat Siswa:</span>
                  <span className="font-semibold text-slate-800">{selectedDetail.alamat || '-'}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="font-extrabold text-slate-900 block mb-1 uppercase tracking-wider text-[11px] text-emerald-800">
                    Ringkasan Uraian Permasalahan Siswa:
                  </span>
                  <p className="whitespace-pre-line leading-relaxed text-slate-800 font-medium">
                    {selectedDetail.ringkasan_uraian_permasalahan || '-'}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="font-extrabold text-slate-900 block mb-1 uppercase tracking-wider text-[11px] text-emerald-800">
                    Upaya Yang Sudah Dilakukan Oleh Konselor & Wali Kelas:
                  </span>
                  <p className="whitespace-pre-line leading-relaxed text-slate-800">
                    {selectedDetail.upaya_konselor_walikelas || '-'}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="font-extrabold text-slate-900 block mb-1 uppercase tracking-wider text-[11px] text-emerald-800">
                    Hasil dan Kesimpulan:
                  </span>
                  <p className="whitespace-pre-line leading-relaxed text-slate-800">
                    {selectedDetail.hasil_dan_kesimpulan || '-'}
                  </p>
                </div>

                {selectedDetail.link_foto_kegiatan && (
                  <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
                    <span className="font-bold text-emerald-900">Dokumentasi Foto Kegiatan:</span>
                    <a
                      href={selectedDetail.link_foto_kegiatan}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Buka Foto Drive</span>
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-4">
              <button
                onClick={() => {
                  const item = selectedDetail;
                  setSelectedDetail(null);
                  onEdit(item);
                }}
                className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Data</span>
              </button>

              {onPrintItem && (
                <button
                  onClick={() => {
                    const item = selectedDetail;
                    setSelectedDetail(null);
                    onPrintItem(item);
                  }}
                  className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Dokumen</span>
                </button>
              )}

              <button
                onClick={() => setSelectedDetail(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs transition-colors"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
