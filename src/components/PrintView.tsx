import React from 'react';
import { AgendaKerja, UndanganOrangTua, HomeVisit } from '../types';
import { Printer, ArrowLeft, Download, ExternalLink } from 'lucide-react';
import {
  downloadSuratUndanganWord,
  downloadLaporanKonsultasiWord,
  downloadBulkSuratUndanganWord,
  downloadBulkLaporanKonsultasiWord,
  downloadSuratTugasHomeVisitWord,
  downloadBulkSuratTugasHomeVisitWord,
  downloadLaporanHomeVisitWord,
  downloadBulkLaporanHomeVisitWord,
  downloadSuratKesediaanOrtuWord,
  downloadBulkSuratKesediaanOrtuWord
} from '../lib/wordExporter';

interface PrintViewProps {
  docType?: 'agenda' | 'undangan_tabel' | 'surat_undangan' | 'laporan_konsultasi' | 'home_visit_tabel' | 'laporan_home_visit' | 'surat_tugas_home_visit' | 'surat_kesediaan_ortu';
  agendaItems?: AgendaKerja[];
  undanganItems?: UndanganOrangTua[];
  selectedUndangan?: UndanganOrangTua | null;
  homeVisitItems?: HomeVisit[];
  selectedHomeVisit?: HomeVisit | null;
  onBack: () => void;
}

export const PrintView: React.FC<PrintViewProps> = ({
  docType = 'agenda',
  agendaItems = [],
  undanganItems = [],
  selectedUndangan = null,
  homeVisitItems = [],
  selectedHomeVisit = null,
  onBack,
}) => {
  const todayStr = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const formatIndoDate = (dateVal?: string) => {
    if (!dateVal) return todayStr;
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return dateVal;
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Pick single item if selected, else first item if available
  const currentItem = selectedUndangan || (undanganItems.length > 0 ? undanganItems[0] : null);
  const currentHomeVisit = selectedHomeVisit || (homeVisitItems.length > 0 ? homeVisitItems[0] : null);

  const handleTriggerPrint = () => {
    try {
      window.print();
    } catch (e) {
      console.warn('Direct print failed, using print iframe fallback:', e);
      handlePrintIframeFallback();
    }
  };

  const handlePrintIframeFallback = () => {
    const el = document.getElementById('printable-sheet');
    if (!el) return;

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const frameDoc = iframe.contentWindow?.document || iframe.contentDocument;
    if (!frameDoc) return;

    frameDoc.open();
    frameDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Dokumen Cetak SMPN 7 Pasuruan</title>
          <style>
            @page { size: A4 portrait; margin: 12mm; }
            body { font-family: system-ui, -apple-system, sans-serif; color: #000; background: #fff; margin: 0; padding: 0; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #000; padding: 6px; }
          </style>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="p-8 bg-white text-black">
          ${el.innerHTML}
          <script>
            setTimeout(() => {
              window.focus();
              window.print();
            }, 600);
          </script>
        </body>
      </html>
    `);
    frameDoc.close();

    setTimeout(() => {
      try {
        document.body.removeChild(iframe);
      } catch (err) {}
    }, 4000);
  };

  const handleOpenNewPrintTab = () => {
    const el = document.getElementById('printable-sheet');
    if (!el) return;

    const printWin = window.open('', '_blank');
    if (!printWin) {
      alert('Pop-up terhalang browser. Silakan izinkan pop-up untuk mencetak.');
      return;
    }

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Dokumen Cetak SMPN 7 Pasuruan</title>
          <style>
            @page { size: A4 portrait; margin: 12mm; }
            body { font-family: system-ui, -apple-system, sans-serif; color: #000; background: #fff; margin: 0; padding: 0; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #000; padding: 6px; }
          </style>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="p-8 bg-white text-black">
          ${el.innerHTML}
          <script>
            setTimeout(() => {
              window.focus();
              window.print();
            }, 600);
          </script>
        </body>
      </html>
    `);
    printWin.document.close();
  };

  const handleDownloadWordCurrent = () => {
    if (docType === 'surat_undangan') {
      if (currentItem) {
        downloadSuratUndanganWord(currentItem);
      } else {
        downloadBulkSuratUndanganWord(undanganItems);
      }
    } else if (docType === 'laporan_konsultasi') {
      if (currentItem) {
        downloadLaporanKonsultasiWord(currentItem);
      } else {
        downloadBulkLaporanKonsultasiWord(undanganItems);
      }
    } else if (docType === 'surat_tugas_home_visit') {
      if (currentHomeVisit) {
        downloadSuratTugasHomeVisitWord(currentHomeVisit);
      } else {
        downloadBulkSuratTugasHomeVisitWord(homeVisitItems);
      }
    } else if (docType === 'laporan_home_visit') {
      if (currentHomeVisit) {
        downloadLaporanHomeVisitWord(currentHomeVisit);
      } else {
        downloadBulkLaporanHomeVisitWord(homeVisitItems);
      }
    } else if (docType === 'surat_kesediaan_ortu') {
      if (currentHomeVisit) {
        downloadSuratKesediaanOrtuWord(currentHomeVisit);
      } else {
        downloadBulkSuratKesediaanOrtuWord(homeVisitItems);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-2 sm:p-8 text-slate-900 print:bg-white print:p-0">
      
      {/* Top Action Bar (hidden during actual printing) */}
      <div className="max-w-5xl mx-auto mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl shadow border border-slate-200 print:hidden">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold rounded-lg transition-colors w-full sm:w-auto justify-center"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Aplikasi</span>
        </button>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
          {(docType === 'surat_undangan' || docType === 'laporan_konsultasi' || docType === 'surat_tugas_home_visit' || docType === 'laporan_home_visit' || docType === 'surat_kesediaan_ortu') && (
            <button
              onClick={handleDownloadWordCurrent}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold rounded-lg shadow transition-colors"
              title="Download dokumen dalam format Microsoft Word (.doc)"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>Download Word (.doc)</span>
            </button>
          )}

          <button
            onClick={handleOpenNewPrintTab}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-700 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-lg shadow transition-colors"
            title="Buka di tab baru jika tombol cetak terhalang iframe"
          >
            <ExternalLink className="w-4 h-4 text-slate-300" />
            <span>Tab Baru</span>
          </button>

          <button
            onClick={handleTriggerPrint}
            className="inline-flex items-center gap-2 px-6 py-2 bg-purple-700 hover:bg-purple-800 text-white text-sm font-bold rounded-lg shadow transition-colors w-full sm:w-auto justify-center"
          >
            <Printer className="w-4 h-4 text-amber-300" />
            <span>Cetak / Simpan PDF</span>
          </button>
        </div>
      </div>

      {/* Official Printable Sheet Container */}
      <div
        id="printable-sheet"
        className="printable-sheet max-w-5xl mx-auto bg-white p-6 sm:p-12 shadow-xl rounded-xl border border-slate-300 print:shadow-none print:border-none print:p-0 print:m-0"
      >
        
        {/* KOP SURAT RESMI SMPN 7 PASURAN */}
        <div className="text-center border-b-4 border-double border-slate-900 pb-3 mb-6">
          <h4 className="text-sm sm:text-base font-bold tracking-widest text-slate-900 uppercase">
            PEMERINTAH KOTA PASURAN
          </h4>
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-wide uppercase">
            DINAS PENDIDIKAN DAN KEBUDAYAAN
          </h3>
          <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-wider uppercase mt-0.5">
            SMP NEGERI 7 PASURAN
          </h1>
          <p className="text-xs text-slate-700 mt-0.5 font-medium">
            Jl. Simpang Slamet Riyadi No. 2 Seboro Gadangrejo Pasuruan 07139 Telp. (0343) 426845
          </p>
        </div>

        {/* 1. SURAT UNDANGAN ORANG TUA (MODE IMAGE 1) */}
        {docType === 'surat_undangan' && (
          <div className="space-y-5 text-sm leading-relaxed text-slate-950">
            {currentItem ? (
              <>
                <div className="text-right font-medium">
                  {currentItem.tempat_surat || 'Pasuruan'}, {formatIndoDate(currentItem.tanggal_surat)}
                </div>

                <div className="grid grid-cols-[80px_15px_1fr] text-xs font-medium max-w-sm">
                  <span>No</span><span>:</span><span>{currentItem.nomor_surat || `400/  /423.102.54/${currentItem.tahun || '2026'}`}</span>
                  <span>Lamp</span><span>:</span><span>-</span>
                  <span>Hal</span><span>:</span><span className="font-bold">Undangan Orang Tua</span>
                </div>

                <div className="pt-2">
                  <p>Kepada</p>
                  <p>
                    Yth. Bapak /Ibu /Wali Siswa <strong className="uppercase">{currentItem.nama_siswa}</strong> &nbsp;
                    <span className="font-bold">KELAS {currentItem.kelas}</span>
                  </p>
                  <p>Di-</p>
                  <p className="pl-6 font-bold">Tempat</p>
                </div>

                <div className="pt-2 text-justify">
                  <p>Assalamu&apos;alaikum wr. wb.</p>
                  <p className="mt-1">
                    Mengharap dengan hormat kehadiran Bapak /Ibu /Wali Siswa SMP Negeri 7 Pasuruan pada:
                  </p>
                </div>

                <div className="pl-6">
                  <table className="text-sm border-collapse font-medium">
                    <tbody>
                      <tr>
                        <td className="py-1 w-28">Hari</td>
                        <td className="py-1 w-4">:</td>
                        <td className="py-1 font-bold">{currentItem.hari}</td>
                      </tr>
                      <tr>
                        <td className="py-1">Tanggal</td>
                        <td className="py-1">:</td>
                        <td className="py-1 font-bold">{currentItem.tanggal} ({currentItem.bulan} {currentItem.tahun})</td>
                      </tr>
                      <tr>
                        <td className="py-1">Jam</td>
                        <td className="py-1">:</td>
                        <td className="py-1 font-bold">{currentItem.waktu || '07.30 WIB'}</td>
                      </tr>
                      <tr>
                        <td className="py-1">Tempat</td>
                        <td className="py-1">:</td>
                        <td className="py-1">{currentItem.tempat_pelaksanaan || 'SMP Negeri 7 Pasuruan'}</td>
                      </tr>
                      <tr>
                        <td className="py-1">Perihal</td>
                        <td className="py-1">:</td>
                        <td className="py-1 font-semibold">{currentItem.perihal_undangan}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="text-justify pt-2">
                  <p>
                    Kehadiran Bapak /Ibu /Wali Siswa <strong className="font-bold underline">mohon tidak diwakilkan</strong> sangat kami harapkan demi pendidikan putra Bapak /Ibu.
                  </p>
                  <p className="mt-2">
                    Demikian Surat panggilan ini, atas perhatian dan kerja sama yang baik kami ucapkan terima kasih.
                  </p>
                  <p className="mt-1">Wassalamu&apos;alaikum wr. wb.</p>
                </div>

                <div className="pt-8 flex justify-end">
                  <div className="text-center w-64">
                    <p>Guru BK</p>
                    <div className="h-20" />
                    <p className="font-bold underline uppercase">{currentItem.nama_guru_bk || 'WIWIK ISMIATI, S.Pd'}</p>
                    <p className="text-xs font-mono">NIP. {currentItem.nip_guru_bk || '19831116 200904 2 003'}</p>
                  </div>
                </div>

                <div className="pt-4 font-bold text-xs">
                  NB: Beserta Putranya.
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-slate-500 italic">
                Tidak ada data undangan orang tua siswa dipilih.
              </div>
            )}
          </div>
        )}

        {/* 2. LAPORAN KONSULTASI DENGAN ORANG TUA SISWA (MODE IMAGE 2) */}
        {docType === 'laporan_konsultasi' && (
          <div className="space-y-5 text-sm text-slate-950">
            {currentItem ? (
              <>
                <div className="text-center my-3">
                  <h3 className="text-base font-extrabold uppercase underline decoration-2 underline-offset-4">
                    LAPORAN KONSULTASI DENGAN ORANG TUA SISWA
                  </h3>
                  <p className="text-xs font-bold uppercase mt-1">
                    {currentItem.semester || `SEMESTER 1 (GANJIL) TAHUN PELAJARAN ${currentItem.tahun || '2025-2026'}`}
                  </p>
                </div>

                <table className="w-full text-left text-xs border-collapse border border-slate-900 my-4">
                  <tbody>
                    <tr className="border-b border-slate-900">
                      <td className="p-2.5 border-r border-slate-900 font-bold text-center w-8">1</td>
                      <td className="p-2.5 border-r border-slate-900 font-bold w-52">Nama peserta didik/konseli</td>
                      <td className="p-2.5 font-bold text-sm uppercase">{currentItem.nama_siswa}</td>
                    </tr>
                    <tr className="border-b border-slate-900">
                      <td className="p-2.5 border-r border-slate-900 font-bold text-center">2</td>
                      <td className="p-2.5 border-r border-slate-900 font-bold">Kelas / Semester</td>
                      <td className="p-2.5 font-bold">{currentItem.kelas} / GANJIL</td>
                    </tr>
                    <tr className="border-b border-slate-900">
                      <td className="p-2.5 border-r border-slate-900 font-bold text-center">3</td>
                      <td className="p-2.5 border-r border-slate-900 font-bold">Hari/Tanggal</td>
                      <td className="p-2.5 font-bold">{currentItem.hari} / {currentItem.tanggal} ({currentItem.bulan} {currentItem.tahun})</td>
                    </tr>
                    <tr className="border-b border-slate-900">
                      <td className="p-2.5 border-r border-slate-900 font-bold text-center">4</td>
                      <td className="p-2.5 border-r border-slate-900 font-bold">Waktu</td>
                      <td className="p-2.5 font-bold">{currentItem.waktu || '08.00 WIB'}</td>
                    </tr>
                    <tr className="border-b border-slate-900">
                      <td className="p-2.5 border-r border-slate-900 font-bold text-center">5</td>
                      <td className="p-2.5 border-r border-slate-900 font-bold">Topik pembahasan</td>
                      <td className="p-2.5 font-semibold">{currentItem.perihal_undangan}</td>
                    </tr>
                    <tr className="border-b border-slate-900">
                      <td className="p-2.5 border-r border-slate-900 font-bold text-center">6</td>
                      <td className="p-2.5 border-r border-slate-900 font-bold">Konsultan/Nara Sumber</td>
                      <td className="p-2.5 leading-relaxed">
                        1. {currentItem.nama_guru_bk || 'Wiwik Ismiati, S.Pd'} (Konselor)<br/>
                        2. {currentItem.nama_orang_tua} {currentItem.pekerjaan_orang_tua ? `(${currentItem.pekerjaan_orang_tua})` : ''}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 border-r border-slate-900 font-bold text-center">7</td>
                      <td className="p-2.5 border-r border-slate-900 font-bold">
                        Peran Guru Bimbingan dan Konseling atau Konselor
                      </td>
                      <td className="p-2.5 space-y-2 leading-relaxed text-justify">
                        <p>
                          Peran konselor adalah untuk membina hubungan dengan orang tua, dalam kedudukannya sebagai konsultan. Konselor mengambil inisiatif memanggil orang tua ke sekolah.
                        </p>
                        <p>
                          Hal yang dibicarakan menyangkut kemajuan anak dalam belajar, kedisiplinan, sikap dan perilaku anak di rumah. Orang tua dapat memberikan informasi tentang perilaku anak di rumah.
                        </p>
                        {currentItem.uraian_permasalahan && (
                          <div className="bg-slate-50 p-2 rounded border border-slate-300">
                            <strong>Uraian Permasalahan Siswa:</strong>
                            <p className="italic mt-0.5">&quot;{currentItem.uraian_permasalahan}&quot;</p>
                          </div>
                        )}
                        {currentItem.tindak_lanjut && (
                          <div className="bg-slate-50 p-2 rounded border border-slate-300">
                            <strong>Hasil / Tindak Lanjut:</strong>
                            <p className="mt-0.5">{currentItem.tindak_lanjut}</p>
                          </div>
                        )}
                        <p>
                          Hasil yang diharapkan dari pembicaraan orang tua dan konselor sekolah adalah pengetahuan pemahaman tentang keadaan siswa. Bagi orang tua, hasil ini akan membawa komunikasi yang baik dengan anak.
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* SIGNATURE 3 BAGIAN */}
                <div className="pt-4 grid grid-cols-2 text-center text-xs font-semibold">
                  <div>
                    <p>Guru BK/ Konselor</p>
                    <div className="h-16" />
                    <p className="font-bold underline">{currentItem.nama_guru_bk || 'Wiwik Ismiati, S.Pd'}</p>
                    <p className="text-[11px] font-mono">NIP. {currentItem.nip_guru_bk || '19831116 200904 2 003'}</p>
                  </div>

                  <div>
                    <p>{currentItem.tempat_surat || 'Pasuruan'}, {formatIndoDate(currentItem.tanggal_surat)}</p>
                    <p>Konsultan/ Narasumber</p>
                    <div className="h-14" />
                    <p className="font-bold underline">{currentItem.nama_orang_tua || 'Orang Tua / Wali Siswa'}</p>
                    <p className="text-[11px]">Orang Tua / Wali</p>
                  </div>
                </div>

                <div className="pt-8 text-center text-xs font-semibold">
                  <p>Mengetahui,</p>
                  <p className="font-bold">Kepala Sekolah SMPN 7 Pasuruan</p>
                  <div className="h-16" />
                  <p className="font-bold underline uppercase">{currentItem.nama_kepala_sekolah || 'MAKHRUS SIDDIQ, S.Psi, M.Pd'}</p>
                  <p className="text-[11px] font-mono">NIP. {currentItem.nip_kepala_sekolah || '19731018 200604 1 020'}</p>
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-slate-500 italic">
                Tidak ada data konsultasi dipilih.
              </div>
            )}
          </div>
        )}

        {/* 3. UNDANGAN ORANG TUA (TABEL REKAP) */}
        {docType === 'undangan_tabel' && (
          <div className="overflow-x-auto my-4">
            <h3 className="text-center text-base font-bold uppercase mb-4 underline">
              DAFTAR REKAPITULASI UNDANGAN ORANG TUA SISWA
            </h3>
            <table className="w-full text-left text-xs border-collapse border border-slate-900">
              <thead>
                <tr className="bg-slate-200 text-slate-950 font-bold border-b border-slate-900 text-[10px] uppercase text-center">
                  <th className="p-2 border border-slate-900 w-8">NO</th>
                  <th className="p-2 border border-slate-900 w-28">HARI / TANGGAL / WAKTU</th>
                  <th className="p-2 border border-slate-900 w-28">KELAS & NAMA SISWA</th>
                  <th className="p-2 border border-slate-900 w-32">NAMA ORANG TUA / PEKERJAAN / ALAMAT</th>
                  <th className="p-2 border border-slate-900">PERIHAL & URAIAN PERMASALAHAN SISWA</th>
                  <th className="p-2 border border-slate-900 w-28">TINDAK LANJUT</th>
                  <th className="p-2 border border-slate-900 w-20">KETERANGAN</th>
                </tr>
              </thead>
              <tbody>
                {undanganItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-slate-500 italic border border-slate-900">
                      Belum ada data undangan orang tua siswa.
                    </td>
                  </tr>
                ) : (
                  undanganItems.map((item, idx) => (
                    <tr key={item.id} className="border-b border-slate-900">
                      <td className="p-2 text-center border border-slate-900 font-semibold">{idx + 1}</td>
                      <td className="p-2 border border-slate-900 font-medium">
                        <div><strong>{item.hari}</strong>, {item.tanggal}</div>
                        <div className="text-[10px] text-slate-600">{item.waktu}</div>
                      </td>
                      <td className="p-2 border border-slate-900">
                        <div className="font-bold text-slate-900">Kelas {item.kelas}</div>
                        <div className="font-semibold text-slate-800">{item.nama_siswa}</div>
                      </td>
                      <td className="p-2 border border-slate-900">
                        <div className="font-bold">{item.nama_orang_tua}</div>
                        {item.pekerjaan_orang_tua && <div className="text-[10px] text-slate-600">{item.pekerjaan_orang_tua}</div>}
                      </td>
                      <td className="p-2 border border-slate-900">
                        <div className="font-bold">{item.perihal_undangan}</div>
                        {item.uraian_permasalahan && <div className="text-[10px] text-slate-700 italic mt-0.5">&quot;{item.uraian_permasalahan}&quot;</div>}
                      </td>
                      <td className="p-2 border border-slate-900">{item.tindak_lanjut || '-'}</td>
                      <td className="p-2 border border-slate-900">{item.keterangan || 'Hadir'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* 4. AGENDA KERJA (TABEL REKAP) */}
        {docType === 'agenda' && (
          <div className="overflow-x-auto my-4">
            <h3 className="text-center text-base font-bold uppercase mb-4 underline">
              AGENDA KERJA BIMBINGAN KONSELING (BK)
            </h3>
            <table className="w-full text-left text-xs border-collapse border border-slate-900">
              <thead>
                <tr className="bg-slate-200 text-slate-950 font-bold border-b border-slate-900 text-[11px] uppercase text-center">
                  <th className="p-2 border border-slate-900 w-8">NO</th>
                  <th className="p-2 border border-slate-900 w-32">HARI / TANGGAL</th>
                  <th className="p-2 border border-slate-900 w-24">WAKTU</th>
                  <th className="p-2 border border-slate-900">URAIAN KEGIATAN</th>
                  <th className="p-2 border border-slate-900 w-32">SASARAN</th>
                  <th className="p-2 border border-slate-900 w-28">KETERANGAN</th>
                </tr>
              </thead>
              <tbody>
                {agendaItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-500 italic border border-slate-900">
                      Belum ada data agenda kerja.
                    </td>
                  </tr>
                ) : (
                  agendaItems.map((item, idx) => (
                    <tr key={item.id} className="border-b border-slate-900">
                      <td className="p-2 text-center border border-slate-900 font-semibold">{idx + 1}</td>
                      <td className="p-2 border border-slate-900 font-medium">
                        <div><strong>{item.hari}</strong></div>
                        <div>{item.tanggal} ({item.bulan} {item.tahun})</div>
                      </td>
                      <td className="p-2 border border-slate-900 text-center font-mono">{item.waktu || '-'}</td>
                      <td className="p-2 border border-slate-900 font-medium">{item.uraian_kegiatan}</td>
                      <td className="p-2 border border-slate-900 font-semibold">{item.sasaran}</td>
                      <td className="p-2 border border-slate-900">{item.keterangan || 'Terlaksana'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* 5. SURAT TUGAS KUNJUNGAN RUMAH (FORMAT PERSIS ATTACHMENT USER) */}
        {docType === 'surat_tugas_home_visit' && (
          <div className="space-y-4 text-sm leading-relaxed text-slate-950 font-serif">
            {currentHomeVisit ? (
              <>
                {/* Header No & Date */}
                <div className="flex justify-between items-start my-2">
                  <div>
                    <div>
                      No : 400/ <u className="font-bold print:no-underline print:border-b print:border-black">{currentHomeVisit.nomor_surat_tugas || '015'}</u> /423.102.54/2026
                    </div>
                    <div>Hal : Kunjungan Rumah</div>
                  </div>
                  <div className="text-right">
                    Pasuruan, <u className="font-bold print:no-underline print:border-b print:border-black">{currentHomeVisit.tanggal_surat ? formatIndoDate(currentHomeVisit.tanggal_surat) : formatIndoDate(currentHomeVisit.tanggal)}</u>
                  </div>
                </div>

                {/* Recipient */}
                <div className="mt-3">
                  <div>Kepada</div>
                  <div>
                    Yth. Bapk /Ibu /WaliSiswa <u className="font-bold print:no-underline print:border-b print:border-black">{currentHomeVisit.nama_orang_tua || '....................................'}</u>
                  </div>
                  <div>Di</div>
                  <div className="pl-6">Tempat</div>
                </div>

                {/* Body Text */}
                <div className="mt-3">DenganHormat.</div>
                <div>Dengan ini kami menugaskan :</div>

                <div className="pl-6 space-y-1 my-2">
                  <div className="grid grid-cols-[50px_10px_1fr]">
                    <span>Sdr.</span><span>:</span><u className="font-bold print:no-underline print:border-b print:border-black">{currentHomeVisit.petugas_1 || currentHomeVisit.nama_guru_bk || 'WIWIK ISMIATI, S.Pd'}</u>
                  </div>
                  <div className="grid grid-cols-[50px_10px_1fr]">
                    <span>Sdr</span><span>:</span><u className="font-bold print:no-underline print:border-b print:border-black">{currentHomeVisit.petugas_2 || '....................................'}</u>
                  </div>
                </div>

                <div className="mt-2 text-justify">
                  Selaku Konselor (<u className="font-bold print:no-underline print:border-b print:border-black">{currentHomeVisit.jabatan_petugas_1 || 'Guru Bimbingan dan Konseling'}</u>) dan <u className="font-bold print:no-underline print:border-b print:border-black">{currentHomeVisit.jabatan_petugas_2 || 'Wali Kelas / Waka Kesiswaan'}</u> /Guru Mata Pelajaran disekolah tersebut untuk mengadakan kunjungan kerumah saudara pada :
                </div>

                <div className="pl-6 space-y-1 my-2">
                  <div className="grid grid-cols-[80px_10px_1fr]">
                    <span>Hari</span><span>:</span><u className="font-bold print:no-underline print:border-b print:border-black">{currentHomeVisit.hari}</u>
                  </div>
                  <div className="grid grid-cols-[80px_10px_1fr]">
                    <span>Tanggal</span><span>:</span><u className="font-bold print:no-underline print:border-b print:border-black">{formatIndoDate(currentHomeVisit.tanggal)}</u>
                  </div>
                  <div className="grid grid-cols-[80px_10px_1fr]">
                    <span>Jam</span><span>:</span><u className="font-bold print:no-underline print:border-b print:border-black">{currentHomeVisit.waktu}</u>
                  </div>
                </div>

                <div className="mt-2 text-justify">
                  Dalam rangka usaha kami di bidang Bimbingan dan Konseling guna membicarakan masalah putra /putri saudara :
                </div>

                <div className="pl-6 space-y-1 my-2">
                  <div className="grid grid-cols-[80px_10px_1fr]">
                    <span>Nama</span><span>:</span><u className="font-bold print:no-underline print:border-b print:border-black">{currentHomeVisit.nama_siswa}</u>
                  </div>
                  <div className="grid grid-cols-[80px_10px_1fr]">
                    <span>Kelas</span><span>:</span><u className="font-bold print:no-underline print:border-b print:border-black">{currentHomeVisit.kelas}</u>
                  </div>
                  <div className="grid grid-cols-[80px_10px_1fr]">
                    <span>Nis</span><span>:</span><u className="font-bold print:no-underline print:border-b print:border-black">{currentHomeVisit.nis_siswa || '-'}</u>
                  </div>
                </div>

                <div className="mt-3 text-justify">
                  Kami mengharap agar saudara bersedia untuk menerima kunjungan para petugas kami tersebut diatas dan mengizinkan kembali surat yang kami lampirkan ini.
                </div>
                <div>Atas kesediaan saudara kami sampaikan terima kasih.</div>

                {/* Signature */}
                <div className="flex justify-end mt-8">
                  <div className="text-center w-72">
                    <div>Mengetahui,</div>
                    <div>Kepala SMP Negeri 7 Pasuruan</div>
                    <div className="h-16" />
                    <div className="font-bold">
                      <u className="print:no-underline print:border-b print:border-black">{currentHomeVisit.nama_kepala_sekolah || 'NUR FADILAH, S.Pd'}</u>
                    </div>
                    <div>{currentHomeVisit.nip_kepala_sekolah || 'NIP. 19860410 201001 2 030'}</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-slate-500 italic">
                Data Home Visit tidak ditemukan.
              </div>
            )}
          </div>
        )}

        {/* 6. LAPORAN HOME VISIT INDIVIDUAL */}
        {docType === 'laporan_home_visit' && (
          <div className="space-y-4 text-sm leading-relaxed text-slate-950 font-serif">
            {currentHomeVisit ? (
              <>
                <h3 className="text-center text-base font-bold uppercase mb-4 underline">
                  LAPORAN PELAKSANAAN KUNJUNGAN RUMAH (HOME VISIT)
                </h3>

                <table className="w-full border-collapse border border-slate-900 text-xs">
                  <tbody>
                    <tr>
                      <th className="p-2.5 border border-slate-900 text-left bg-slate-100 w-1/3">Hari / Tanggal</th>
                      <td className="p-2.5 border border-slate-900">{currentHomeVisit.hari}, {formatIndoDate(currentHomeVisit.tanggal)}</td>
                    </tr>
                    <tr>
                      <th className="p-2.5 border border-slate-900 text-left bg-slate-100">Jam / Waktu</th>
                      <td className="p-2.5 border border-slate-900">{currentHomeVisit.waktu}</td>
                    </tr>
                    <tr>
                      <th className="p-2.5 border border-slate-900 text-left bg-slate-100">Nama Siswa / Kelas</th>
                      <td className="p-2.5 border border-slate-900"><b>{currentHomeVisit.nama_siswa}</b> (Kelas: {currentHomeVisit.kelas})</td>
                    </tr>
                    <tr>
                      <th className="p-2.5 border border-slate-900 text-left bg-slate-100">Orang Tua / Pekerjaan</th>
                      <td className="p-2.5 border border-slate-900">{currentHomeVisit.nama_orang_tua || '-'} (Pekerjaan: {currentHomeVisit.pekerjaan_orang_tua || '-'})</td>
                    </tr>
                    <tr>
                      <th className="p-2.5 border border-slate-900 text-left bg-slate-100">Alamat Rumah</th>
                      <td className="p-2.5 border border-slate-900">{currentHomeVisit.alamat || '-'}</td>
                    </tr>
                    <tr>
                      <th className="p-2.5 border border-slate-900 text-left bg-slate-100">Perihal Home Visit</th>
                      <td className="p-2.5 border border-slate-900 font-bold">{currentHomeVisit.perihal_home_visit}</td>
                    </tr>
                    <tr>
                      <th className="p-2.5 border border-slate-900 text-left bg-slate-100">Uraian Permasalahan</th>
                      <td className="p-2.5 border border-slate-900 whitespace-pre-line">{currentHomeVisit.uraian_permasalahan || '-'}</td>
                    </tr>
                    <tr>
                      <th className="p-2.5 border border-slate-900 text-left bg-slate-100">Tindak Lanjut / Hasil</th>
                      <td className="p-2.5 border border-slate-900 whitespace-pre-line">{currentHomeVisit.tindak_lanjut || '-'}</td>
                    </tr>
                    <tr>
                      <th className="p-2.5 border border-slate-900 text-left bg-slate-100">Keterangan</th>
                      <td className="p-2.5 border border-slate-900">{currentHomeVisit.keterangan || '-'}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Signatures */}
                <div className="grid grid-cols-2 text-center pt-6 text-xs gap-4">
                  <div>
                    <div>Guru BK / Konselor</div>
                    <div className="h-16" />
                    <div className="font-bold underline">{currentHomeVisit.nama_guru_bk || 'WIWIK ISMIATI, S.Pd'}</div>
                    <div>NIP. {currentHomeVisit.nip_guru_bk || '19831116 200904 2 003'}</div>
                  </div>
                  <div>
                    <div>Orang Tua / Wali Siswa</div>
                    <div className="h-16" />
                    <div className="font-bold underline">{currentHomeVisit.nama_orang_tua || 'Orang Tua Siswa'}</div>
                    <div>Wali Siswa</div>
                  </div>
                </div>

                <div className="text-center pt-4 text-xs">
                  <div>Mengetahui,</div>
                  <div>Kepala SMP Negeri 7 Pasuruan</div>
                  <div className="h-16" />
                  <div className="font-bold underline">{currentHomeVisit.nama_kepala_sekolah || 'NUR FADILAH, S.Pd'}</div>
                  <div>{currentHomeVisit.nip_kepala_sekolah || 'NIP. 19860410 201001 2 030'}</div>
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-slate-500 italic">
                Data Laporan Home Visit tidak ditemukan.
              </div>
            )}
          </div>
        )}

        {/* 7. TABEL REKAP HOME VISIT */}
        {docType === 'home_visit_tabel' && (
          <div className="overflow-x-auto my-4">
            <h3 className="text-center text-base font-bold uppercase mb-4 underline">
              REKAPITULASI PELAKSANAAN HOME VISIT / KUNJUNGAN RUMAH
            </h3>
            <table className="w-full text-left text-xs border-collapse border border-slate-900">
              <thead>
                <tr className="bg-slate-200 text-slate-950 font-bold border-b border-slate-900 text-[10px] uppercase text-center">
                  <th className="p-2 border border-slate-900 w-8">NO</th>
                  <th className="p-2 border border-slate-900 w-24">HARI / TGL</th>
                  <th className="p-2 border border-slate-900 w-28">SISWA / KELAS</th>
                  <th className="p-2 border border-slate-900 w-28">ORANG TUA</th>
                  <th className="p-2 border border-slate-900">PERIHAL & URAIAN</th>
                  <th className="p-2 border border-slate-900">TINDAK LANJUT</th>
                </tr>
              </thead>
              <tbody>
                {homeVisitItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-500 italic border border-slate-900">
                      Belum ada data Kunjungan Rumah (Home Visit).
                    </td>
                  </tr>
                ) : (
                  homeVisitItems.map((item, idx) => (
                    <tr key={item.id} className="border-b border-slate-900">
                      <td className="p-2 text-center border border-slate-900 font-semibold">{idx + 1}</td>
                      <td className="p-2 border border-slate-900 font-medium text-[11px]">
                        <div><b>{item.hari}</b></div>
                        <div>{formatIndoDate(item.tanggal)}</div>
                        <div className="text-slate-600 font-mono text-[10px]">{item.waktu}</div>
                      </td>
                      <td className="p-2 border border-slate-900 font-bold">
                        <div>{item.nama_siswa}</div>
                        <div className="text-slate-700 font-normal">Kl: {item.kelas}</div>
                      </td>
                      <td className="p-2 border border-slate-900">
                        <div><b>{item.nama_orang_tua || '-'}</b></div>
                        <div className="text-slate-600 text-[10px]">{item.alamat || '-'}</div>
                      </td>
                      <td className="p-2 border border-slate-900">
                        <div className="font-bold text-amber-900">{item.perihal_home_visit}</div>
                        <div className="text-slate-700 text-[11px] mt-0.5">{item.uraian_permasalahan || '-'}</div>
                      </td>
                      <td className="p-2 border border-slate-900">{item.tindak_lanjut || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* 8. SURAT KESEDIAAN MENERIMA KUNJUNGAN OLEH ORANG TUA (PERSIS ATTACHMENT USER) */}
        {docType === 'surat_kesediaan_ortu' && (
          <div className="space-y-4 text-sm leading-relaxed text-slate-950 font-serif my-4">
            {currentHomeVisit ? (
              <>
                {/* Header Recipient */}
                <div className="mb-6 leading-relaxed">
                  <div>Kepada</div>
                  <div>Kepala Sekolah</div>
                  <div>SMP Negeri 7 Pasuruan</div>
                  <div>Di Pasuruan</div>
                </div>

                <div className="mt-4">Dengan Hormat</div>
                <div>Kami yang bertanda tangan dibawahini :</div>

                <div className="pl-6 space-y-1 my-2">
                  <div className="grid grid-cols-[80px_10px_1fr]">
                    <span>Nama</span><span>:</span><u className="font-bold print:no-underline print:border-b print:border-black">{currentHomeVisit.nama_orang_tua || '....................................'}</u>
                  </div>
                  <div className="grid grid-cols-[80px_10px_1fr]">
                    <span>Alamat</span><span>:</span><u className="font-bold print:no-underline print:border-b print:border-black">{currentHomeVisit.alamat || '....................................'}</u>
                  </div>
                </div>

                <div className="mt-3">Orangtua /Wali Siswa dari tersebut di bawahini :</div>
                <div className="pl-6 space-y-1 my-2">
                  <div className="grid grid-cols-[80px_10px_1fr]">
                    <span>Nama</span><span>:</span><u className="font-bold print:no-underline print:border-b print:border-black">{currentHomeVisit.nama_siswa || '....................................'}</u>
                  </div>
                  <div className="grid grid-cols-[80px_10px_1fr]">
                    <span>Nis</span><span>:</span><u className="font-bold print:no-underline print:border-b print:border-black">{currentHomeVisit.nis_siswa || '....................'}</u>
                  </div>
                </div>

                <div className="mt-4 text-justify">
                  Dengan ini menyatakan kesediaan kami untuk menerima kunjungan saudara :<br/>
                  ........................................ <u className="font-bold print:no-underline print:border-b print:border-black">{currentHomeVisit.petugas_penerima_kunjungan || currentHomeVisit.petugas_1 || currentHomeVisit.nama_guru_bk || 'WIWIK ISMIATI, S.Pd dkk'}</u> ........................................<br/>
                  Kerumah kami pada :
                </div>

                <div className="pl-6 space-y-1 my-2">
                  <div className="grid grid-cols-[80px_10px_1fr]">
                    <span>Hari</span><span>:</span><u className="font-bold print:no-underline print:border-b print:border-black">{currentHomeVisit.hari || '................'}</u>
                  </div>
                  <div className="grid grid-cols-[80px_10px_1fr]">
                    <span>Tanggal</span><span>:</span><u className="font-bold print:no-underline print:border-b print:border-black">{formatIndoDate(currentHomeVisit.tanggal)}</u>
                  </div>
                  <div className="grid grid-cols-[80px_10px_1fr]">
                    <span>Jam</span><span>:</span><u className="font-bold print:no-underline print:border-b print:border-black">{currentHomeVisit.waktu || '................'}</u>
                  </div>
                </div>

                <div className="mt-4 text-justify">
                  Untuk membicarakan masalah yang di hadapi oleh putra /putri kami tersebut diatas sesuai dengan<br/>
                  Surat Tugas nomor <u className="font-bold print:no-underline print:border-b print:border-black">{currentHomeVisit.nomor_surat_tugas || '......'}</u> tanggal <u className="font-bold print:no-underline print:border-b print:border-black">{currentHomeVisit.tanggal_surat_tugas ? formatIndoDate(currentHomeVisit.tanggal_surat_tugas) : (currentHomeVisit.tanggal_surat ? formatIndoDate(currentHomeVisit.tanggal_surat) : formatIndoDate(currentHomeVisit.tanggal))}</u>
                </div>

                {/* Signature */}
                <div className="flex justify-end mt-12 pr-6">
                  <div className="text-center w-72">
                    <div>Pasuruan, <u className="font-bold print:no-underline print:border-b print:border-black">{currentHomeVisit.tanggal_pernyataan_ortu ? formatIndoDate(currentHomeVisit.tanggal_pernyataan_ortu) : todayStr}</u></div>
                    <div>HormatKami,</div>
                    <div>Orang Tua /Walisiswa</div>
                    <div className="h-20" />
                    <div>
                      ( <u className="font-bold print:no-underline print:border-b print:border-black">{currentHomeVisit.nama_orang_tua || '....................................'}</u> )
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-slate-500 italic">
                Data Surat Kesediaan Orang Tua tidak ditemukan.
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
