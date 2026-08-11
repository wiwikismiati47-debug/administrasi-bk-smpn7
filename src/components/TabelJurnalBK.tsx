import React, { useState } from 'react';
import { JurnalBK } from '../types';
import {
  BookOpen,
  Search,
  Filter,
  Calendar,
  Layers,
  Award,
  Users,
  UserX,
  Printer,
  FileText,
  Trash2,
  Edit,
  Eye,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Download,
  CheckCircle2,
  Building
} from 'lucide-react';
import { downloadJurnalBKWord, downloadBulkJurnalBKWord } from '../lib/wordExporter';

interface TabelJurnalBKProps {
  items: JurnalBK[];
  isLoading?: boolean;
  onEdit: (item: JurnalBK) => void;
  onDelete: (id: string) => Promise<void>;
  onPrintItem?: (item: JurnalBK) => void;
  onPrintTableRekap?: () => void;
  onOpenPrint?: (item: JurnalBK) => void;
  onOpenRekapPrint?: () => void;
  onAddNew?: () => void;
  isSupabase?: boolean;
}

export const TabelJurnalBK: React.FC<TabelJurnalBKProps> = ({
  items = [],
  isLoading = false,
  onEdit,
  onDelete,
  onPrintItem,
  onPrintTableRekap,
  onOpenPrint,
  onOpenRekapPrint,
  onAddNew,
  isSupabase = false
}) => {
  const handlePrintItem = (item: JurnalBK) => {
    if (onPrintItem) onPrintItem(item);
    else if (onOpenPrint) onOpenPrint(item);
  };

  const handlePrintRekap = () => {
    if (onPrintTableRekap) onPrintTableRekap();
    else if (onOpenRekapPrint) onOpenRekapPrint();
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBidang, setFilterBidang] = useState('ALL');
  const [filterJenis, setFilterJenis] = useState('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredItems = items.filter((item) => {
    const matchSearch =
      item.materi_layanan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kelas?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sasaran_peserta?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.jenis_layanan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fungsi_layanan?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchBidang = filterBidang === 'ALL' || item.bidang_layanan === filterBidang;
    const matchJenis = filterJenis === 'ALL' || item.jenis_layanan === filterJenis;

    return matchSearch && matchBidang && matchJenis;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDownloadWord = (item: JurnalBK) => {
    downloadJurnalBKWord(item);
  };

  const handleDownloadBulkWord = () => {
    if (filteredItems.length === 0) {
      alert('Tidak ada data jurnal untuk di-export.');
      return;
    }
    downloadBulkJurnalBKWord(filteredItems);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Controls */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              DATA JURNAL BK
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Total Recorded: {items.length} Entri
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mt-1">Daftar Rekap Jurnal Layanan BK</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manajemen & rekapitulasi data Jurnal BK harian SMP Negeri 7 Pasuruan
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onAddNew}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" /> + Tambah Jurnal Baru
          </button>

          <button
            onClick={handleDownloadBulkWord}
            className="px-3.5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-xl text-xs border border-blue-200 transition-all flex items-center gap-2"
            title="Export ke Dokumen Word (.doc)"
          >
            <Download className="w-4 h-4" /> Export Word
          </button>

          <button
            onClick={handlePrintRekap}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs border border-slate-200 transition-all flex items-center gap-2"
            title="Cetak Tabel Rekapitulasi Jurnal BK"
          >
            <Printer className="w-4 h-4" /> Cetak Rekap
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari materi, kelas, sasaran, jenis..."
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>

        <div>
          <select
            value={filterBidang}
            onChange={(e) => setFilterBidang(e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">Semua Bidang Layanan</option>
            <option value="Pribadi">Bidang Pribadi</option>
            <option value="Sosial">Bidang Sosial</option>
            <option value="Belajar">Bidang Belajar</option>
            <option value="Karir">Bidang Karir</option>
          </select>
        </div>

        <div>
          <select
            value={filterJenis}
            onChange={(e) => setFilterJenis(e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">Semua Jenis Layanan</option>
            <option value="Bimbingan Klasikal / Lintas Kelas">Bimbingan Klasikal / Lintas Kelas</option>
            <option value="Bimbingan Kelompok">Bimbingan Kelompok</option>
            <option value="Konseling Kelompok">Konseling Kelompok</option>
            <option value="Konseling Individual">Konseling Individual</option>
            <option value="Konsultasi / Referal (Alih Tangan Kasus)">Konsultasi / Referal</option>
            <option value="Bimbingan Teman Sebaya">Bimbingan Teman Sebaya</option>
            <option value="Konferensi Kasus (Case Conference)">Konferensi Kasus</option>
            <option value="Advokasi">Advokasi</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-semibold text-slate-500">Memuat data Jurnal BK...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">Belum Ada Data Jurnal BK</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Silakan isi formulir Jurnal BK melalui tombol di atas atau sesuaikan pencarian filter Anda.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-3.5 text-center w-10">NO</th>
                  <th className="p-3.5">HARI / TGL / JAM</th>
                  <th className="p-3.5">MATERI LAYANAN</th>
                  <th className="p-3.5">BIDANG & JENIS</th>
                  <th className="p-3.5">FUNGSI LAYANAN</th>
                  <th className="p-3.5 text-center">SISWA ABSEN</th>
                  <th className="p-3.5 text-center w-36">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredItems.map((item, index) => {
                  const isExpanded = expandedId === item.id;
                  const countAbsen = item.siswa_tidak_mengikuti?.length || 0;

                  return (
                    <React.Fragment key={item.id}>
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5 text-center font-bold text-slate-400">{index + 1}</td>
                        <td className="p-3.5">
                          <div className="font-bold text-slate-800">{item.hari}, {item.tanggal}</div>
                          <div className="text-[11px] text-emerald-700 font-semibold">{item.jam_ke}</div>
                          <div className="text-[11px] text-slate-500">Kelas: {item.kelas || '-'}</div>
                        </td>
                        <td className="p-3.5 max-w-xs">
                          <div className="font-bold text-slate-800 line-clamp-2">{item.materi_layanan}</div>
                          <div className="text-[11px] text-slate-500">Sasaran: {item.sasaran_peserta || '-'}</div>
                        </td>
                        <td className="p-3.5">
                          <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-1">
                            {item.bidang_layanan}
                          </span>
                          <div className="text-[11px] text-slate-700 font-medium">{item.jenis_layanan}</div>
                        </td>
                        <td className="p-3.5 max-w-xs text-slate-600 text-[11px] line-clamp-2">
                          {item.fungsi_layanan}
                        </td>
                        <td className="p-3.5 text-center">
                          {countAbsen > 0 ? (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                              {countAbsen} Siswa
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                              Lengkap (0)
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => toggleExpand(item.id)}
                              className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                              title="Lihat Detail"
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => onOpenPrint(item)}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Cetak Dokumen Jurnal"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDownloadWord(item)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Download Word (.doc)"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onEdit(item)}
                              className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                              title="Edit Data"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={async () => {
                                if (confirm(`Apakah Anda yakin ingin menghapus Jurnal BK tanggal ${item.tanggal}?`)) {
                                  await onDelete(item.id);
                                }
                              }}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Hapus Data"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Detail Box */}
                      {isExpanded && (
                        <tr className="bg-slate-50/90 border-b border-slate-200">
                          <td colSpan={7} className="p-5 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-slate-200">
                              <div>
                                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                                  <Award className="w-4 h-4 text-amber-600" /> Hasil yang Dicapai (BMB3)
                                </h4>
                                <p className="text-xs text-slate-700 leading-relaxed bg-amber-50/50 p-2.5 rounded-lg border border-amber-100">
                                  {item.hasil_layanan_bmb3 || 'Belum diisi'}
                                </p>
                              </div>

                              <div>
                                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                                  <Building className="w-4 h-4 text-emerald-600" /> Pengesahan Guru BK & Kepala Sekolah
                                </h4>
                                <div className="text-xs text-slate-700 space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                                  <div>
                                    <span className="font-semibold text-slate-800">Guru BK:</span>{' '}
                                    {item.nama_guru_bk} (NIP. {item.nip_guru_bk})
                                  </div>
                                  <div>
                                    <span className="font-semibold text-slate-800">Kepala Sekolah:</span>{' '}
                                    {item.nama_kepala_sekolah} (NIP. {item.nip_kepala_sekolah})
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Siswa Tidak Mengikuti Section */}
                            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                                <UserX className="w-4 h-4 text-rose-600" /> Siswa yang Tidak Mengikuti Layanan BK
                              </h4>

                              {countAbsen > 0 ? (
                                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                                  <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-100 font-bold text-slate-700">
                                      <tr>
                                        <th className="p-2 text-center w-8">NO</th>
                                        <th className="p-2">NAMA SISWA</th>
                                        <th className="p-2">ALASAN</th>
                                        <th className="p-2">TINDAK LANJUT</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                      {item.siswa_tidak_mengikuti.map((absen, aIdx) => (
                                        <tr key={aIdx}>
                                          <td className="p-2 text-center font-bold text-slate-400">{aIdx + 1}</td>
                                          <td className="p-2 font-semibold text-slate-800">{absen.nama_siswa}</td>
                                          <td className="p-2 text-rose-700 font-medium">{absen.alasan}</td>
                                          <td className="p-2 text-slate-600">{absen.tindak_lanjut}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              ) : (
                                <p className="text-xs text-emerald-700 font-medium">
                                  ✓ Seluruh siswa mengikuti kegiatan layanan BK.
                                </p>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
