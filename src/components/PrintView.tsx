import { getActiveGuruBK } from '../lib/guruBk';
import React from 'react';
import { SignatureBox } from './SignatureBox';
import { AgendaKerja, UndanganOrangTua, HomeVisit, RekamPermasalahan, KonselingIndividu, KonselingKelompok, SuratPernyataan, KonferensiKasus, DaftarHadirRow, JurnalBK, SiswaATS } from '../types';
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
  downloadBulkSuratKesediaanOrtuWord,
  downloadRekamPermasalahanWord,
  downloadBulkRekamPermasalahanWord,
  downloadKonselingIndividuWord,
  downloadBulkKonselingIndividuWord,
  downloadKonselingKelompokWord,
  downloadBulkKonselingKelompokWord,
  downloadSuratPernyataanWord,
  downloadBulkSuratPernyataanWord,
  downloadJurnalBKWord,
  downloadBulkJurnalBKWord
} from '../lib/wordExporter';

interface PrintViewProps {
  docType?:
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
    | 'siswa_ats_tabel'
    | 'siswa_ats_laporan';
  agendaItems?: AgendaKerja[];
  undanganItems?: UndanganOrangTua[];
  selectedUndangan?: UndanganOrangTua | null;
  homeVisitItems?: HomeVisit[];
  selectedHomeVisit?: HomeVisit | null;
  rekamPermasalahanItems?: RekamPermasalahan[];
  selectedRekamPermasalahan?: RekamPermasalahan | null;
  konselingIndividuItems?: KonselingIndividu[];
  selectedKonselingIndividu?: KonselingIndividu | null;
  konselingKelompokItems?: KonselingKelompok[];
  selectedKonselingKelompok?: KonselingKelompok | null;
  suratPernyataanItems?: SuratPernyataan[];
  selectedSuratPernyataan?: SuratPernyataan | null;
  konferensiKasusItems?: KonferensiKasus[];
  selectedKonferensiKasus?: KonferensiKasus | null;
  jurnalBKItems?: JurnalBK[];
  selectedJurnalBK?: JurnalBK | null;
  siswaATSItems?: SiswaATS[];
  selectedSiswaATS?: SiswaATS | null;
  onBack: () => void;
}

export const PrintView: React.FC<PrintViewProps> = ({
  docType = 'agenda',
  agendaItems = [],
  undanganItems = [],
  selectedUndangan = null,
  homeVisitItems = [],
  selectedHomeVisit = null,
  rekamPermasalahanItems = [],
  selectedRekamPermasalahan = null,
  konselingIndividuItems = [],
  selectedKonselingIndividu = null,
  konselingKelompokItems = [],
  selectedKonselingKelompok = null,
  suratPernyataanItems = [],
  selectedSuratPernyataan = null,
  konferensiKasusItems = [],
  selectedKonferensiKasus = null,
  jurnalBKItems = [],
  selectedJurnalBK = null,
  siswaATSItems = [],
  selectedSiswaATS = null,
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

  const formatKepalaSekolah = (name?: string): string => {
    if (!name || (name.includes('NUR FADILAH') && !name.includes('M.Pd'))) {
      return 'NUR FADILAH, S.Pd,. M.Pd';
    }
    return name.replace(/S\.PD/g, 'S.Pd').replace(/S\.pd/g, 'S.Pd');
  };

  // Pick single item if selected, else first item if available
  const currentItem = selectedUndangan || (undanganItems.length > 0 ? undanganItems[0] : null);
  const currentHomeVisit = selectedHomeVisit || (homeVisitItems.length > 0 ? homeVisitItems[0] : null);
  const currentRekamPermasalahan = selectedRekamPermasalahan || (rekamPermasalahanItems.length > 0 ? rekamPermasalahanItems[0] : null);
  const currentKonselingIndividu = selectedKonselingIndividu || (konselingIndividuItems.length > 0 ? konselingIndividuItems[0] : null);
  const currentKonselingKelompok = selectedKonselingKelompok || (konselingKelompokItems.length > 0 ? konselingKelompokItems[0] : null);
  const currentSuratPernyataan = selectedSuratPernyataan || (suratPernyataanItems.length > 0 ? suratPernyataanItems[0] : null);
  const currentKonferensiKasus = selectedKonferensiKasus || (konferensiKasusItems.length > 0 ? konferensiKasusItems[0] : null);
  const currentJurnalBK = selectedJurnalBK || (jurnalBKItems.length > 0 ? jurnalBKItems[0] : null);
  const currentSiswaATS = selectedSiswaATS || (siswaATSItems.length > 0 ? siswaATSItems[0] : null);

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

    const printStyles = `
      @page { size: A4 portrait; margin: 8mm 10mm; }
      * {
        color: #000000 !important;
        border-color: #000000 !important;
        -webkit-text-fill-color: #000000 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        text-rendering: geometricPrecision !important;
      }
      body {
        font-family: 'Times New Roman', Times, Georgia, serif, -apple-system, BlinkMacSystemFont, sans-serif;
        color: #000000 !important;
        background: #ffffff !important;
        margin: 0;
        padding: 0;
        font-size: 11pt;
        line-height: 1.4;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        color: #000000 !important;
        border-color: #000000 !important;
        break-inside: auto !important;
        page-break-inside: auto !important;
      }
      thead { display: table-header-group !important; break-inside: avoid !important; page-break-inside: avoid !important; }
      tbody { break-inside: auto !important; page-break-inside: auto !important; }
      tr { break-inside: avoid !important; page-break-inside: avoid !important; }
      th, td {
        border-color: #000000 !important;
        color: #000000 !important;
        -webkit-text-fill-color: #000000 !important;
      }
      h1, h2, h3, h4, h5, h6 {
        break-after: avoid !important;
        page-break-after: avoid !important;
        color: #000000 !important;
        -webkit-text-fill-color: #000000 !important;
      }
      .overflow-x-auto, .overflow-y-auto { overflow: visible !important; }
      .print\\:break-inside-avoid { break-inside: avoid !important; page-break-inside: avoid !important; }
    `;

    frameDoc.open();
    frameDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Dokumen Cetak SMPN 7 Pasuruan</title>
          <style>${printStyles}</style>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="p-4 bg-white text-black">
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

    const printStyles = `
      @page { size: A4 portrait; margin: 8mm 10mm; }
      * {
        color: #000000 !important;
        border-color: #000000 !important;
        -webkit-text-fill-color: #000000 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        text-rendering: geometricPrecision !important;
      }
      body {
        font-family: 'Times New Roman', Times, Georgia, serif, -apple-system, BlinkMacSystemFont, sans-serif;
        color: #000000 !important;
        background: #ffffff !important;
        margin: 0;
        padding: 0;
        font-size: 11pt;
        line-height: 1.4;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        color: #000000 !important;
        border-color: #000000 !important;
        break-inside: auto !important;
        page-break-inside: auto !important;
      }
      thead { display: table-header-group !important; break-inside: avoid !important; page-break-inside: avoid !important; }
      tbody { break-inside: auto !important; page-break-inside: auto !important; }
      tr { break-inside: avoid !important; page-break-inside: avoid !important; }
      th, td {
        border-color: #000000 !important;
        color: #000000 !important;
        -webkit-text-fill-color: #000000 !important;
      }
      h1, h2, h3, h4, h5, h6 {
        break-after: avoid !important;
        page-break-after: avoid !important;
        color: #000000 !important;
        -webkit-text-fill-color: #000000 !important;
      }
      .overflow-x-auto, .overflow-y-auto { overflow: visible !important; }
      .print\\:break-inside-avoid { break-inside: avoid !important; page-break-inside: avoid !important; }
    `;

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Dokumen Cetak SMPN 7 Pasuruan</title>
          <style>${printStyles}</style>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="p-6 bg-white text-black">
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
    } else if (docType === 'rekam_permasalahan_dokumen' || docType === 'rekam_permasalahan_tabel') {
      if (currentRekamPermasalahan) {
        downloadRekamPermasalahanWord(currentRekamPermasalahan);
      } else {
        downloadBulkRekamPermasalahanWord(rekamPermasalahanItems);
      }
    } else if (docType === 'konseling_individu_dokumen' || docType === 'konseling_individu_tabel') {
      if (currentKonselingIndividu) {
        downloadKonselingIndividuWord(currentKonselingIndividu);
      } else {
        downloadBulkKonselingIndividuWord(konselingIndividuItems);
      }
    } else if (docType === 'konseling_kelompok_dokumen' || docType === 'konseling_kelompok_tabel') {
      if (currentKonselingKelompok) {
        downloadKonselingKelompokWord(currentKonselingKelompok);
      } else {
        downloadBulkKonselingKelompokWord(konselingKelompokItems);
      }
    } else if (docType === 'surat_pernyataan_dokumen' || docType === 'surat_pernyataan_tabel') {
      if (currentSuratPernyataan) {
        downloadSuratPernyataanWord(currentSuratPernyataan);
      } else {
        downloadBulkSuratPernyataanWord(suratPernyataanItems);
      }
    } else if (docType === 'jurnal_bk_dokumen' || docType === 'jurnal_bk_tabel') {
      if (currentJurnalBK) {
        downloadJurnalBKWord(currentJurnalBK);
      } else {
        downloadBulkJurnalBKWord(jurnalBKItems);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-2 sm:p-8 text-slate-900 print:bg-white print:p-0">
      
      {/* Top Action Bar (hidden during actual printing) */}
      <div className="max-w-5xl mx-auto mb-6 bg-white p-4 rounded-xl shadow border border-slate-200 print:hidden flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold rounded-lg transition-colors w-full sm:w-auto justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Aplikasi</span>
          </button>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
            {(docType === 'surat_undangan' ||
              docType === 'laporan_konsultasi' ||
              docType === 'surat_tugas_home_visit' ||
              docType === 'laporan_home_visit' ||
              docType === 'surat_kesediaan_ortu' ||
              docType === 'rekam_permasalahan_dokumen' ||
              docType === 'rekam_permasalahan_tabel' ||
              docType === 'konseling_individu_dokumen' ||
              docType === 'konseling_individu_tabel' ||
              docType === 'konseling_kelompok_dokumen' ||
              docType === 'konseling_kelompok_tabel' ||
              docType === 'surat_pernyataan_dokumen' ||
              docType === 'surat_pernyataan_tabel') && (
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
      </div>

      {/* Official Printable Sheet Container */}
      <div
        id="printable-sheet"
        className="printable-sheet max-w-5xl mx-auto bg-white p-6 sm:p-12 shadow-xl rounded-xl border border-slate-300 print:shadow-none print:border-none print:p-0 print:m-0 text-black"
      >
        
        {/* KOP SURAT RESMI UPT SMP NEGERI 7 PASURAN */}
        <div className="relative flex items-center justify-between border-b-4 border-double border-black pb-3 mb-6 min-h-[100px] font-serif print:pb-2 print:mb-3 print:min-h-0 text-black">
          {/* Logo Kota Pasuruan (Kiri Atas) */}
          <div className="w-20 sm:w-28 h-20 sm:h-28 flex items-center justify-center shrink-0">
            <img 
              src="https://i.ibb.co.com/677QPVHY/logo.png" 
              alt="Logo Kota Pasuruan"
              className="max-h-20 sm:max-h-28 max-w-full object-contain"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                if (!img.dataset.tried1) {
                  img.dataset.tried1 = "true";
                  img.src = "https://i.ibb.co.com/677QPVHY/logo.png";
                } else if (!img.dataset.tried2) {
                  img.dataset.tried2 = "true";
                  img.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Logo_Kota_Pasuruan_-_Seal_of_Pasuruan_City.svg/240px-Logo_Kota_Pasuruan_-_Seal_of_Pasuruan_City.svg.png";
                }
              }}
            />
          </div>

          {/* Teks Kop Surat Tengah */}
          <div className="text-center flex-1 px-2 sm:px-4 text-black">
            <h4 className="text-sm sm:text-lg font-bold tracking-wide uppercase text-black">
              PEMERINTAH KOTA PASURAN
            </h4>
            <h1 className="text-lg sm:text-2xl font-black tracking-wider uppercase my-0.5 text-black">
              UPT SMP NEGERI 7
            </h1>
            <p className="text-xs sm:text-sm font-semibold leading-tight text-black">
              Jalan Simpang Slamet Riadi Nomor 2, Kota Pasuruan, Jawa Timur, 67139
            </p>
            <p className="text-xs sm:text-sm font-semibold leading-tight text-black">
              Telepon (0343) 426845
            </p>
            <p className="text-xs sm:text-xs font-semibold leading-tight text-black">
              Pos-el <span className="italic">smp7pas@yahoo.co.id</span>, Laman <span className="italic">www.smpn7pasuruan.sch.id</span>
            </p>
          </div>

          {/* Logo SMPN 7 Pasuruan (Kanan Atas) */}
          <div className="w-20 sm:w-28 h-20 sm:h-28 flex items-center justify-center shrink-0">
            <img 
              src="https://image2url.com/r2/default/images/1772189169508-8d8beaf3-1640-4a9f-bf4f-ebdeb6048a5b.png" 
              alt="Logo SMPN 7 Pasuruan"
              className="max-h-20 sm:max-h-28 max-w-full object-contain"
            />
          </div>
        </div>

        {/* 1. SURAT UNDANGAN ORANG TUA (MODE IMAGE 1) */}
        {docType === 'surat_undangan' && (
          <div className="space-y-5 text-sm sm:text-[15px] leading-relaxed text-black font-sans">
            {currentItem ? (
              <>
                <div className="text-right font-semibold text-black text-sm">
                  {currentItem.tempat_surat || 'Pasuruan'}, {formatIndoDate(currentItem.tanggal_surat)}
                </div>

                <div className="grid grid-cols-[80px_15px_1fr] text-sm font-semibold text-black max-w-md">
                  <span className="font-bold">No</span><span className="font-bold">:</span><span className="font-bold">{currentItem.nomor_surat || `400/  /423.102.54/${currentItem.tahun || '2026'}`}</span>
                  <span className="font-bold">Lamp</span><span className="font-bold">:</span><span className="font-bold">-</span>
                  <span className="font-bold">Hal</span><span className="font-bold">:</span><span className="font-bold underline">Undangan Orang Tua</span>
                </div>

                <div className="pt-2 text-sm text-black">
                  <p className="font-semibold text-black">Kepada</p>
                  <p className="text-black font-medium">
                    Yth. Bapak /Ibu /Wali Siswa <strong className="uppercase font-bold text-black">{currentItem.nama_siswa}</strong> &nbsp;
                    <span className="font-bold text-black">KELAS {currentItem.kelas}</span>
                  </p>
                  <p className="font-semibold text-black">Di-</p>
                  <p className="pl-6 font-bold text-black">Tempat</p>
                </div>

                <div className="pt-2 text-justify text-sm text-black">
                  <p className="font-semibold text-black">Assalamu&apos;alaikum wr. wb.</p>
                  <p className="mt-1 font-medium leading-relaxed text-black">
                    Mengharap dengan hormat kehadiran Bapak /Ibu /Wali Siswa SMP Negeri 7 Pasuruan pada:
                  </p>
                </div>

                <div className="pl-6 my-2">
                  <table className="text-sm border-collapse font-medium text-black">
                    <tbody>
                      <tr>
                        <td className="py-1.5 w-28 font-bold text-black">Hari</td>
                        <td className="py-1.5 w-4 font-bold text-black">:</td>
                        <td className="py-1.5 font-bold text-black">{currentItem.hari}</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-bold text-black">Tanggal</td>
                        <td className="py-1.5 font-bold text-black">:</td>
                        <td className="py-1.5 font-bold text-black">{formatIndoDate(currentItem.tanggal)} {currentItem.bulan && currentItem.tahun && !currentItem.tanggal.includes(currentItem.bulan) ? `(${currentItem.bulan} ${currentItem.tahun})` : ''}</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-bold text-black">Jam</td>
                        <td className="py-1.5 font-bold text-black">:</td>
                        <td className="py-1.5 font-bold text-black">{currentItem.waktu || '08:00 WIB'}</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-bold text-black">Tempat</td>
                        <td className="py-1.5 font-bold text-black">:</td>
                        <td className="py-1.5 font-bold text-black">{currentItem.tempat_pelaksanaan || 'SMP Negeri 7 Pasuruan'}</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-bold text-black align-top">Perihal</td>
                        <td className="py-1.5 font-bold text-black align-top">:</td>
                        <td className="py-1.5 font-bold text-black leading-snug">{currentItem.perihal_undangan}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="text-justify pt-2 text-sm text-black space-y-2 leading-relaxed">
                  <p className="font-medium text-black">
                    Kehadiran Bapak /Ibu /Wali Siswa <strong className="font-bold underline text-black">mohon tidak diwakilkan</strong> sangat kami harapkan demi pendidikan putra Bapak /Ibu.
                  </p>
                  <p className="font-medium text-black">
                    Demikian Surat panggilan ini, atas perhatian dan kerja sama yang baik kami ucapkan terima kasih.
                  </p>
                  <p className="font-semibold text-black">Wassalamu&apos;alaikum wr. wb.</p>
                </div>

                <div className="pt-8 grid grid-cols-2 text-center text-sm font-serif text-black">
                  <div>
                    <p className="font-medium text-black">Mengetahui,</p>
                    <p className="font-bold text-black">Kepala SMP Negeri 7 Pasuruan</p>
                    <SignatureBox recordId={currentItem.id} role="kepala_sekolah" className="h-20 w-32 mx-auto" />
                    <p className="font-bold underline text-black text-sm">{formatKepalaSekolah(currentItem.nama_kepala_sekolah)}</p>
                    <p className="text-xs font-semibold text-black">NIP. {currentItem.nip_kepala_sekolah || '19860410 201001 2 030'}</p>
                  </div>
                  <div>
                    <p className="font-medium text-black">{currentItem.tempat_surat || 'Pasuruan'}, {formatIndoDate(currentItem.tanggal_surat)}</p>
                    <p className="font-bold text-black">Guru BK / Konselor</p>
                    <SignatureBox recordId={currentItem.id} role="guru_bk" className="h-20 w-32 mx-auto" />
                    <p className="font-bold underline text-black text-sm">{( ( currentItem.nama_guru_bk || getActiveGuruBK().nama )?.toString().replace(/S\.PD/g, "S.Pd").replace(/S\.pd/g, "S.Pd") )?.toString().replace(/S\.PD/g, "S.Pd").replace(/S\.pd/g, "S.Pd")}</p>
                    <p className="text-xs font-semibold text-black">NIP. {currentItem.nip_guru_bk || getActiveGuruBK().nip}</p>
                  </div>
                </div>

                <div className="pt-4 font-bold text-sm text-black">
                  NB: Beserta Putranya.
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-slate-600 italic font-semibold">
                Tidak ada data undangan orang tua siswa dipilih.
              </div>
            )}
          </div>
        )}

        {/* 2. LAPORAN KONSULTASI DENGAN ORANG TUA SISWA (MODE IMAGE 2) */}
        {docType === 'laporan_konsultasi' && (
          <div className="space-y-5 text-sm text-black">
            {currentItem ? (
              <>
                <div className="text-center my-3 text-black">
                  <h3 className="text-base font-extrabold uppercase underline decoration-2 underline-offset-4 text-black">
                    LAPORAN KONSULTASI DENGAN ORANG TUA SISWA
                  </h3>
                  <p className="text-xs font-bold uppercase mt-1 text-black">
                    {currentItem.semester || `SEMESTER 1 (GANJIL) TAHUN PELAJARAN ${currentItem.tahun || '2025-2026'}`}
                  </p>
                </div>

                <table className="w-full text-left text-xs border-collapse border border-black my-4 text-black">
                  <tbody>
                    <tr className="border-b border-black">
                      <td className="p-2.5 border-r border-black font-bold text-center w-8">1</td>
                      <td className="p-2.5 border-r border-black font-bold w-52">Nama peserta didik/konseli</td>
                      <td className="p-2.5 font-bold text-sm uppercase">{currentItem.nama_siswa}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2.5 border-r border-black font-bold text-center">2</td>
                      <td className="p-2.5 border-r border-black font-bold">Kelas / Semester</td>
                      <td className="p-2.5 font-bold">{currentItem.kelas} / GANJIL</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2.5 border-r border-black font-bold text-center">3</td>
                      <td className="p-2.5 border-r border-black font-bold">Hari/Tanggal</td>
                      <td className="p-2.5 font-bold">{currentItem.hari} / {formatIndoDate(currentItem.tanggal)} ({currentItem.bulan} {currentItem.tahun})</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2.5 border-r border-black font-bold text-center">4</td>
                      <td className="p-2.5 border-r border-black font-bold">Waktu</td>
                      <td className="p-2.5 font-bold">{currentItem.waktu || '08.00 WIB'}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2.5 border-r border-black font-bold text-center">5</td>
                      <td className="p-2.5 border-r border-black font-bold">Topik pembahasan</td>
                      <td className="p-2.5 font-bold">{currentItem.perihal_undangan}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2.5 border-r border-black font-bold text-center">6</td>
                      <td className="p-2.5 border-r border-black font-bold">Konsultan/Nara Sumber</td>
                      <td className="p-2.5 leading-relaxed font-semibold">
                        1. {( ( currentItem.nama_guru_bk || getActiveGuruBK().nama )?.toString().replace(/S\.PD/g, "S.Pd").replace(/S\.pd/g, "S.Pd") )?.toString().replace(/S\.PD/g, "S.Pd").replace(/S\.pd/g, "S.Pd")} (Konselor)<br/>
                        2. {currentItem.nama_orang_tua} {currentItem.pekerjaan_orang_tua ? `(${currentItem.pekerjaan_orang_tua})` : ''}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 border-r border-black font-bold text-center">7</td>
                      <td className="p-2.5 border-r border-black font-bold">
                        Peran Guru Bimbingan dan Konseling atau Konselor
                      </td>
                      <td className="p-2.5 space-y-2 leading-relaxed text-justify font-medium text-black">
                        <p>
                          Peran konselor adalah untuk membina hubungan dengan orang tua, dalam kedudukannya sebagai konsultan. Konselor mengambil inisiatif memanggil orang tua ke sekolah.
                        </p>
                        <p>
                          Hal yang dibicarakan menyangkut kemajuan anak dalam belajar, kedisiplinan, sikap dan perilaku anak di rumah. Orang tua dapat memberikan informasi tentang perilaku anak di rumah.
                        </p>
                        {currentItem.uraian_permasalahan && (
                          <div className="bg-slate-50 p-2.5 rounded border border-black text-black">
                            <strong className="font-bold text-black">Uraian Permasalahan Siswa:</strong>
                            <p className="italic mt-0.5 font-medium text-black">&quot;{currentItem.uraian_permasalahan}&quot;</p>
                          </div>
                        )}
                        {currentItem.tindak_lanjut && (
                          <div className="bg-slate-50 p-2.5 rounded border border-black text-black">
                            <strong className="font-bold text-black">Hasil / Tindak Lanjut:</strong>
                            <p className="mt-0.5 font-medium text-black">{currentItem.tindak_lanjut}</p>
                          </div>
                        )}
                        <p>
                          Hasil yang diharapkan dari pembicaraan orang tua dan konselor sekolah adalah pengetahuan pemahaman tentang keadaan siswa. Bagi orang tua, hasil ini akan membawa komunikasi yang baik dengan anak.
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* SIGNATURE 2 BAGIAN */}
                <div className="pt-6 grid grid-cols-2 text-center text-sm font-semibold gap-4 text-black">
                  <div>
                    <p className="font-medium text-black">Mengetahui,</p>
                    <p className="font-bold text-black">Kepala Sekolah SMPN 7 Pasuruan</p>
                    <SignatureBox recordId={currentItem.id} role="kepala_sekolah" className="h-20 w-32 mx-auto" />
                    <p className="font-bold underline text-black text-sm">{formatKepalaSekolah(currentItem.nama_kepala_sekolah)}</p>
                    <p className="text-xs font-semibold text-black">NIP. {currentItem.nip_kepala_sekolah || '19860410 201001 2 030'}</p>
                  </div>

                  <div>
                    <p className="font-medium text-black">{currentItem.tempat_surat || 'Pasuruan'}, {formatIndoDate(currentItem.tanggal_surat)}</p>
                    <p className="font-bold text-black">Guru BK / Konselor</p>
                    <SignatureBox recordId={currentItem.id} role="guru_bk" className="h-20 w-32 mx-auto" />
                    <p className="font-bold underline text-black text-sm">{( ( currentItem.nama_guru_bk || getActiveGuruBK().nama )?.toString().replace(/S\.PD/g, "S.Pd").replace(/S\.pd/g, "S.Pd") )?.toString().replace(/S\.PD/g, "S.Pd").replace(/S\.pd/g, "S.Pd")}</p>
                    <p className="text-xs font-semibold text-black">NIP. {currentItem.nip_guru_bk || getActiveGuruBK().nip}</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-slate-600 italic font-semibold">
                Tidak ada data konsultasi dipilih.
              </div>
            )}
          </div>
        )}

        {/* 3. UNDANGAN ORANG TUA (TABEL REKAP) */}
        {docType === 'undangan_tabel' && (
          <div className="overflow-x-auto my-4 print:my-0 print:overflow-visible">
            <h3 className="text-center text-base font-bold uppercase mb-4 underline print:mb-2 print:break-after-avoid">
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

            {/* SIGNATURE REKAP UNDANGAN */}
            <div className="grid grid-cols-2 text-center pt-8 text-xs gap-4 font-serif print:break-inside-avoid mt-6">
              <div>
                <div>Mengetahui,</div>
                <div className="font-bold">Kepala SMP Negeri 7 Pasuruan</div>
                <SignatureBox recordId="undangan_tabel_rekap" role="kepala_sekolah" className="h-20 w-32 mx-auto" />
                <div className="font-bold underline">NUR FADILAH, S.Pd,. M.Pd</div>
                <div>NIP. 19860410 201001 2 030</div>
              </div>
              <div>
                <div>Pasuruan, {todayStr}</div>
                <div className="font-bold">Guru Bimbingan dan Konseling</div>
                <SignatureBox recordId="undangan_tabel_rekap" role="guru_bk" className="h-20 w-32 mx-auto" />
                <div className="font-bold underline">{( getActiveGuruBK().nama )?.toString().replace(/S\.PD/g, "S.Pd").replace(/S\.pd/g, "S.Pd")}</div>
                <div>NIP. {getActiveGuruBK().nip}</div>
              </div>
            </div>
          </div>
        )}

        {/* 4. AGENDA KERJA (TABEL REKAP) */}
        {docType === 'agenda' && (
          <div className="overflow-x-auto my-4 print:my-0 print:overflow-visible">
            <h3 className="text-center text-base font-bold uppercase mb-4 underline print:mb-2 print:break-after-avoid">
              AGENDA KERJA BIMBINGAN KONSELING (BK)
            </h3>
            <table className="w-full text-left text-xs border-collapse border border-slate-900">
              <thead>
                <tr className="bg-slate-200 text-slate-950 font-bold border-b border-slate-900 text-[11px] uppercase text-center">
                  <th className="p-2 border border-slate-900 w-8">NO</th>
                  <th className="p-2 border border-slate-900 w-28">HARI / TANGGAL</th>
                  <th className="p-2 border border-slate-900 w-20">WAKTU</th>
                  <th className="p-2 border border-slate-900">URAIAN KEGIATAN</th>
                  <th className="p-2 border border-slate-900 w-28">SASARAN</th>
                  <th className="p-2 border border-slate-900 w-24 text-center">FOTO KEGIATAN</th>
                  <th className="p-2 border border-slate-900 w-24">KETERANGAN</th>
                </tr>
              </thead>
              <tbody>
                {agendaItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-slate-500 italic border border-slate-900">
                      Belum ada data agenda kerja.
                    </td>
                  </tr>
                ) : (
                  agendaItems.map((item, idx) => {
                    const isSameDateAsPrevious = idx > 0 && 
                      agendaItems[idx - 1].tanggal === item.tanggal &&
                      agendaItems[idx - 1].bulan === item.bulan &&
                      agendaItems[idx - 1].tahun === item.tahun &&
                      agendaItems[idx - 1].hari === item.hari;

                    return (
                      <tr key={item.id} className="border-b border-slate-900">
                        <td className="p-2 text-center border border-slate-900 font-semibold">{idx + 1}</td>
                        <td className="p-2 border border-slate-900 font-medium text-center">
                          {!isSameDateAsPrevious ? (
                            <>
                              <div><strong>{item.hari}</strong></div>
                              <div className="text-[10px] text-slate-800 mt-0.5">{item.tanggal} ({item.bulan} {item.tahun})</div>
                            </>
                          ) : (
                            <div className="text-slate-400 font-extrabold text-sm py-1 select-none">〃</div>
                          )}
                        </td>
                        <td className="p-2 border border-slate-900 text-center font-mono">{item.waktu || '-'}</td>
                        <td className="p-2 border border-slate-900 font-medium">{item.uraian_kegiatan}</td>
                        <td className="p-2 border border-slate-900 font-semibold">{item.sasaran}</td>
                        <td className="p-1.5 border border-slate-900 text-center align-middle">
                          {item.link_foto_kegiatan ? (
                            <div className="flex flex-col items-center justify-center">
                              <img
                                src={item.link_foto_kegiatan}
                                alt="Foto Kegiatan"
                                referrerPolicy="no-referrer"
                                className="w-16 h-14 object-cover rounded border border-slate-400 mx-auto"
                                onError={(e) => {
                                  const target = e.target as HTMLElement;
                                  target.style.display = 'none';
                                }}
                              />
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[10px]">-</span>
                          )}
                        </td>
                        <td className="p-2 border border-slate-900">{item.keterangan || 'Terlaksana'}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {/* SIGNATURE AGENDA KERJA */}
            <div className="grid grid-cols-2 text-center pt-8 text-xs gap-4 font-serif print:break-inside-avoid mt-6">
              <div>
                <div>Mengetahui,</div>
                <div className="font-bold">Kepala SMP Negeri 7 Pasuruan</div>
                <SignatureBox recordId="agenda_tabel_rekap" role="kepala_sekolah" className="h-20 w-32 mx-auto" />
                <div className="font-bold underline">NUR FADILAH, S.Pd,. M.Pd</div>
                <div>NIP. 19860410 201001 2 030</div>
              </div>
              <div>
                <div>Pasuruan, {todayStr}</div>
                <div className="font-bold">Guru Bimbingan dan Konseling</div>
                <SignatureBox recordId="agenda_tabel_rekap" role="guru_bk" className="h-20 w-32 mx-auto" />
                <div className="font-bold underline">{( getActiveGuruBK().nama )?.toString().replace(/S\.PD/g, "S.Pd").replace(/S\.pd/g, "S.Pd")}</div>
                <div>NIP. {getActiveGuruBK().nip}</div>
              </div>
            </div>
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
                    Yth. Bapak / Ibu / Wali Siswa <u className="font-bold print:no-underline print:border-b print:border-black">{currentHomeVisit.nama_siswa || '....................................'}</u>
                  </div>
                  <div>Di</div>
                  <div className="pl-6">Tempat</div>
                </div>

                {/* Body Text */}
                <div className="mt-3">Dengan Hormat,</div>
                <div>Dengan ini kami menugaskan :</div>

                <div className="pl-6 space-y-1 my-2">
                  <div className="grid grid-cols-[50px_10px_1fr]">
                    <span>Sdr.</span><span>:</span><u className="font-bold print:no-underline print:border-b print:border-black">{( ( currentHomeVisit.petugas_1 || currentHomeVisit.nama_guru_bk || getActiveGuruBK().nama )?.toString().replace(/S\.PD/g, "S.Pd").replace(/S\.pd/g, "S.Pd") )?.toString().replace(/S\.PD/g, "S.Pd").replace(/S\.pd/g, "S.Pd")}</u>
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
                <div className="grid grid-cols-2 text-center text-xs font-serif mt-8">
                  <div>
                    <div>Petugas Home Visit / Guru BK</div>
                    <SignatureBox recordId={currentHomeVisit.id} role="guru_bk" className="h-20 w-32 mx-auto" />
                    <div className="font-bold">
                      <u className="print:no-underline print:border-b print:border-black">{( ( currentHomeVisit.nama_guru_bk || getActiveGuruBK().nama )?.toString().replace(/S\.PD/g, "S.Pd").replace(/S\.pd/g, "S.Pd") )}</u>
                    </div>
                    <div>NIP. {currentHomeVisit.nip_guru_bk || getActiveGuruBK().nip}</div>
                  </div>
                  <div>
                    <div>Mengetahui,</div>
                    <div>Kepala SMP Negeri 7 Pasuruan</div>
                    <SignatureBox recordId={currentHomeVisit.id} role="kepala_sekolah" className="h-20 w-32 mx-auto" />
                    <div className="font-bold">
                      <u className="print:no-underline print:border-b print:border-black">{formatKepalaSekolah(currentHomeVisit.nama_kepala_sekolah)}</u>
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

        {/* 6. LAPORAN HOME VISIT INDIVIDUAL (FORMAT 14 POIN RESMI SANGAT PRESISI) */}
        {docType === 'laporan_home_visit' && (
          <div className="space-y-4 text-sm leading-relaxed text-slate-950 font-serif">
            {currentHomeVisit ? (
              <>
                <div className="text-center my-3">
                  <h2 className="text-base font-extrabold uppercase tracking-wide">
                    LAPORAN KUNJUNGAN RUMAH
                  </h2>
                  <p className="text-xs font-bold uppercase mt-1">
                    {currentHomeVisit.semester_laporan || 'SEMESTER 1 (GANJIL) TAHUN PELAJARAN 2026-2027'}
                  </p>
                </div>

                <table className="w-full border-collapse border border-black text-xs font-serif leading-relaxed my-4">
                  <tbody>
                    <tr className="border-b border-black">
                      <td className="p-2 border-r border-black font-bold text-center w-8">1</td>
                      <td className="p-2 border-r border-black font-bold w-52 sm:w-60">Nama peserta didik/konseli</td>
                      <td className="p-2 font-bold uppercase">{currentHomeVisit.nama_siswa || '-'}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2 border-r border-black font-bold text-center">2</td>
                      <td className="p-2 border-r border-black font-bold">Kelas /Semester</td>
                      <td className="p-2 font-semibold">
                        {currentHomeVisit.kelas} / {currentHomeVisit.semester_laporan?.includes('GANJIL') ? 'Ganjil' : 'Genap'}
                      </td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2 border-r border-black font-bold text-center">3</td>
                      <td className="p-2 border-r border-black font-bold">Bidang Layanan</td>
                      <td className="p-2">{currentHomeVisit.bidang_layanan || 'Pribadi / Belajar'}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2 border-r border-black font-bold text-center">4</td>
                      <td className="p-2 border-r border-black font-bold">Topik /Permasalahan</td>
                      <td className="p-2 whitespace-pre-line">
                        {currentHomeVisit.topik_permasalahan || currentHomeVisit.perihal_home_visit || '-'}
                      </td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2 border-r border-black font-bold text-center">5</td>
                      <td className="p-2 border-r border-black font-bold">Fungsi layanan</td>
                      <td className="p-2">{currentHomeVisit.fungsi_layanan || 'Pemahaman/Pencegahan/Penyembuhan'}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2 border-r border-black font-bold text-center">6</td>
                      <td className="p-2 border-r border-black font-bold">Pihak yang Terlibat</td>
                      <td className="p-2 whitespace-pre-line">
                        {currentHomeVisit.pihak_terlibat || '1. Konselor\n2. Wali Kelas'}
                      </td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2 border-r border-black font-bold text-center">7</td>
                      <td className="p-2 border-r border-black font-bold">Tujuan Kegiatan</td>
                      <td className="p-2 whitespace-pre-line">
                        {currentHomeVisit.tujuan_kegiatan ||
                          'a) Membangun hubungan baik dengan orangtua/wali peserta didik/konseli\nb) Melengkapi dan klarifikasi data tentang peserta didik/konseli\nc) Mengkonsultasikan serta membangun kolaborasi untuk pemecahan masalah peserta didik/konseli'}
                      </td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2 border-r border-black font-bold text-center">8</td>
                      <td className="p-2 border-r border-black font-bold">Gambaran ringkas masalah</td>
                      <td className="p-2 whitespace-pre-line">
                        {currentHomeVisit.gambaran_ringkas_masalah || currentHomeVisit.uraian_permasalahan || '-'}
                      </td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2 border-r border-black font-bold text-center">9</td>
                      <td className="p-2 border-r border-black font-bold">Alamat Kunjungan</td>
                      <td className="p-2">{currentHomeVisit.alamat_kunjungan || currentHomeVisit.alamat || '-'}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2 border-r border-black font-bold text-center">10</td>
                      <td className="p-2 border-r border-black font-bold">Hari/Tanggal dan lama kunjungan</td>
                      <td className="p-2">
                        {currentHomeVisit.hari_tanggal_lama_kunjungan ||
                          `${currentHomeVisit.hari}, ${formatIndoDate(currentHomeVisit.tanggal)} (${currentHomeVisit.waktu})`}
                      </td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2 border-r border-black font-bold text-center">11</td>
                      <td className="p-2 border-r border-black font-bold">Anggota keluarga yang dikunjungi</td>
                      <td className="p-2">
                        {currentHomeVisit.anggota_keluarga_dikunjungi || `Ayah : ${currentHomeVisit.nama_orang_tua || '-'}`}
                      </td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2 border-r border-black font-bold text-center">12</td>
                      <td className="p-2 border-r border-black font-bold">Rencana Evaluasi</td>
                      <td className="p-2 whitespace-pre-line">
                        {currentHomeVisit.rencana_evaluasi ||
                          'a) Konfirmasi kebenaran tentang siswa bersama orangtua\nb) Kualitas hubungan dengan keluarga'}
                      </td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2 border-r border-black font-bold text-center">13</td>
                      <td className="p-2 border-r border-black font-bold">Tindaklanjut</td>
                      <td className="p-2 whitespace-pre-line">{currentHomeVisit.tindak_lanjut || '-'}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2 border-r border-black font-bold text-center">14</td>
                      <td className="p-2 border-r border-black font-bold">Catatan Khusus</td>
                      <td className="p-2 whitespace-pre-line">
                        {currentHomeVisit.catatan_khusus || currentHomeVisit.keterangan || '-'}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Signatures */}
                <div className="grid grid-cols-2 text-center pt-6 text-xs gap-4 font-serif">
                  <div>
                    <div>Guru BK / Konselor</div>
                    <SignatureBox recordId={currentHomeVisit.id} role="guru_bk" className="h-20 w-32 mx-auto" />
                    <div className="font-bold underline">{( ( currentHomeVisit.nama_guru_bk || getActiveGuruBK().nama )?.toString().replace(/S\.PD/g, "S.Pd").replace(/S\.pd/g, "S.Pd") )?.toString().replace(/S\.PD/g, "S.Pd").replace(/S\.pd/g, "S.Pd")}</div>
                    <div>NIP. {currentHomeVisit.nip_guru_bk || getActiveGuruBK().nip}</div>
                  </div>
                  <div>
                    <div>Pasuruan, {formatIndoDate(currentHomeVisit.tanggal_surat || currentHomeVisit.tanggal)}</div>
                    <div>Orang Tua / Wali Siswa</div>
                    <SignatureBox recordId={currentHomeVisit.id} role="orang_tua" className="h-20 w-32 mx-auto" />
                    <div className="font-bold underline">{currentHomeVisit.nama_orang_tua || 'Orang Tua Siswa'}</div>
                    <div>Wali Siswa</div>
                  </div>
                </div>

                <div className="text-center pt-4 text-xs font-serif">
                  <div>Mengetahui,</div>
                  <div>Kepala SMP Negeri 7 Pasuruan</div>
                  <SignatureBox recordId={currentHomeVisit.id} role="kepala_sekolah" className="h-20 w-32 mx-auto" />
                  <div className="font-bold underline">{formatKepalaSekolah(currentHomeVisit.nama_kepala_sekolah)}</div>
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
          <div className="overflow-x-auto my-4 print:my-0 print:overflow-visible">
            <h3 className="text-center text-base font-bold uppercase mb-4 underline print:mb-2 print:break-after-avoid">
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

            {/* SIGNATURE REKAP HOME VISIT */}
            <div className="grid grid-cols-2 text-center pt-8 text-xs gap-4 font-serif print:break-inside-avoid mt-6">
              <div>
                <div>Mengetahui,</div>
                <div className="font-bold">Kepala SMP Negeri 7 Pasuruan</div>
                <SignatureBox recordId="home_visit_tabel_rekap" role="kepala_sekolah" className="h-20 w-32 mx-auto" />
                <div className="font-bold underline">NUR FADILAH, S.Pd,. M.Pd</div>
                <div>NIP. 19860410 201001 2 030</div>
              </div>
              <div>
                <div>Pasuruan, {todayStr}</div>
                <div className="font-bold">Guru Bimbingan dan Konseling</div>
                <SignatureBox recordId="home_visit_tabel_rekap" role="guru_bk" className="h-20 w-32 mx-auto" />
                <div className="font-bold underline">{( getActiveGuruBK().nama )?.toString().replace(/S\.PD/g, "S.Pd").replace(/S\.pd/g, "S.Pd")}</div>
                <div>NIP. {getActiveGuruBK().nip}</div>
              </div>
            </div>
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

                <div className="mt-4">Dengan Hormat,</div>
                <div>Kami yang bertanda tangan di bawah ini :</div>

                <div className="pl-6 space-y-1 my-2">
                  <div className="grid grid-cols-[80px_10px_1fr]">
                    <span>Nama</span><span>:</span><u className="font-bold print:no-underline print:border-b print:border-black">{currentHomeVisit.nama_orang_tua || '....................................'}</u>
                  </div>
                  <div className="grid grid-cols-[80px_10px_1fr]">
                    <span>Alamat</span><span>:</span><u className="font-bold print:no-underline print:border-b print:border-black">{currentHomeVisit.alamat || '....................................'}</u>
                  </div>
                </div>

                <div className="mt-3">Orang Tua / Wali Siswa dari siswa tersebut di bawah ini :</div>
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
                  ........................................ <u className="font-bold print:no-underline print:border-b print:border-black">{( ( currentHomeVisit.petugas_penerima_kunjungan || currentHomeVisit.petugas_1 || currentHomeVisit.nama_guru_bk || getActiveGuruBK().nama )?.toString().replace(/S\.PD/g, "S.Pd").replace(/S\.pd/g, "S.Pd") )?.toString().replace(/S\.PD/g, "S.Pd").replace(/S\.pd/g, "S.Pd")}</u> ........................................<br/>
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
                  Untuk membicarakan masalah yang dihadapi oleh putra / putri kami tersebut di atas sesuai dengan<br/>
                  Surat Tugas nomor <u className="font-bold print:no-underline print:border-b print:border-black">{currentHomeVisit.nomor_surat_tugas ? (currentHomeVisit.nomor_surat_tugas.includes('/423.') ? currentHomeVisit.nomor_surat_tugas : `400/ ${currentHomeVisit.nomor_surat_tugas} /423.102.54/${currentHomeVisit.tahun || '2026'}`) : `400/ 015 /423.102.54/${currentHomeVisit.tahun || '2026'}`}</u> tanggal <u className="font-bold print:no-underline print:border-b print:border-black">{currentHomeVisit.tanggal_surat_tugas ? formatIndoDate(currentHomeVisit.tanggal_surat_tugas) : (currentHomeVisit.tanggal_surat ? formatIndoDate(currentHomeVisit.tanggal_surat) : formatIndoDate(currentHomeVisit.tanggal))}</u>
                </div>

                {/* Signature */}
                <div className="grid grid-cols-2 text-center text-xs font-serif mt-10">
                  <div>
                    <div>Petugas / Konselor BK</div>
                    <SignatureBox recordId={currentHomeVisit.id} role="guru_bk" className="h-20 w-32 mx-auto" />
                    <div className="font-bold">
                      <u className="print:no-underline print:border-b print:border-black">{( ( currentHomeVisit.petugas_penerima_kunjungan || currentHomeVisit.nama_guru_bk || getActiveGuruBK().nama )?.toString().replace(/S\.PD/g, "S.Pd").replace(/S\.pd/g, "S.Pd") )}</u>
                    </div>
                    <div>Guru Bimbingan dan Konseling</div>
                  </div>
                  <div>
                    <div>Pasuruan, <u className="font-bold print:no-underline print:border-b print:border-black">{currentHomeVisit.tanggal_pernyataan_ortu ? formatIndoDate(currentHomeVisit.tanggal_pernyataan_ortu) : todayStr}</u></div>
                    <div>Hormat Kami,</div>
                    <div>Orang Tua / Wali Siswa</div>
                    <SignatureBox recordId={currentHomeVisit.id} role="orang_tua" className="h-20 w-32 mx-auto" />
                    <div>
                      ( <u className="font-bold print:no-underline print:border-b print:border-black">{currentHomeVisit.nama_orang_tua || '....................................'}</u> )
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-center italic py-8 text-slate-500 font-sans">
                Data Home Visit tidak ditemukan.
              </p>
            )}
          </div>
        )}

        {/* 9. REKAM PERMASALAHAN SISWA (INDIVIDUAL DOKUMEN) */}
        {docType === 'rekam_permasalahan_dokumen' && (
          <div className="space-y-4 text-sm text-slate-950 font-serif">
            {currentRekamPermasalahan ? (
              <>
                <div className="text-center my-3">
                  <h2 className="text-base font-extrabold uppercase tracking-wide">
                    REKAM PERMASALAHAN SISWA
                  </h2>
                  <p className="text-xs font-bold uppercase mt-1">
                    BIMBINGAN DAN KONSELING UPT SMP NEGERI 7 PASURUAN
                  </p>
                </div>

                <table className="w-full border-collapse border border-black text-xs font-serif leading-relaxed my-4">
                  <tbody>
                    <tr className="border-b border-black">
                      <td className="p-2 border-r border-black font-bold text-center w-8">1</td>
                      <td className="p-2 border-r border-black font-bold w-52 sm:w-60">Hari / Tanggal / Waktu</td>
                      <td className="p-2 font-bold">{currentRekamPermasalahan.hari}, {formatIndoDate(currentRekamPermasalahan.tanggal)} ({currentRekamPermasalahan.waktu || '08.00 WIB'})</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2 border-r border-black font-bold text-center">2</td>
                      <td className="p-2 border-r border-black font-bold">Kelas</td>
                      <td className="p-2 font-bold">Kelas {currentRekamPermasalahan.kelas}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2 border-r border-black font-bold text-center">3</td>
                      <td className="p-2 border-r border-black font-bold">Nama Siswa</td>
                      <td className="p-2 font-bold uppercase">{currentRekamPermasalahan.nama_siswa}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2 border-r border-black font-bold text-center">4</td>
                      <td className="p-2 border-r border-black font-bold">Nama Orang Tua / Wali</td>
                      <td className="p-2">{currentRekamPermasalahan.nama_orang_tua || '-'}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2 border-r border-black font-bold text-center">5</td>
                      <td className="p-2 border-r border-black font-bold">Pekerjaan Orang Tua</td>
                      <td className="p-2">{currentRekamPermasalahan.pekerjaan_orang_tua || '-'}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2 border-r border-black font-bold text-center">6</td>
                      <td className="p-2 border-r border-black font-bold">Alamat</td>
                      <td className="p-2">{currentRekamPermasalahan.alamat || '-'}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2 border-r border-black font-bold text-center">7</td>
                      <td className="p-2 border-r border-black font-bold">Ringkasan Uraian Permasalahan Siswa</td>
                      <td className="p-2 whitespace-pre-line">{currentRekamPermasalahan.ringkasan_uraian_permasalahan || '-'}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2 border-r border-black font-bold text-center">8</td>
                      <td className="p-2 border-r border-black font-bold">Upaya Yang Sudah Dilakukan Oleh Konselor, Wali Kelas</td>
                      <td className="p-2 whitespace-pre-line">{currentRekamPermasalahan.upaya_konselor_walikelas || '-'}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2 border-r border-black font-bold text-center">9</td>
                      <td className="p-2 border-r border-black font-bold">Hasil Dan Kesimpulan</td>
                      <td className="p-2 whitespace-pre-line">{currentRekamPermasalahan.hasil_dan_kesimpulan || '-'}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2 border-r border-black font-bold text-center">10</td>
                      <td className="p-2 border-r border-black font-bold">Dokumentasi / Foto Kegiatan</td>
                      <td className="p-2">
                        {currentRekamPermasalahan.link_foto_kegiatan ? (
                          <div className="space-y-1">
                            <img
                              src={currentRekamPermasalahan.link_foto_kegiatan}
                              alt="Dokumentasi Kegiatan"
                              className="max-h-48 max-w-xs object-contain rounded border border-slate-300 print:max-h-40"
                              onError={(e) => {
                                const target = e.target as HTMLElement;
                                target.style.display = 'none';
                              }}
                            />
                            {currentRekamPermasalahan.link_foto_kegiatan.startsWith('http') && (
                              <a href={currentRekamPermasalahan.link_foto_kegiatan} target="_blank" rel="noreferrer" className="text-blue-700 underline text-xs block print:hidden">
                                {currentRekamPermasalahan.link_foto_kegiatan}
                              </a>
                            )}
                          </div>
                        ) : '-'}
                      </td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2 border-r border-black font-bold text-center">11</td>
                      <td className="p-2 border-r border-black font-bold">Keterangan</td>
                      <td className="p-2">{currentRekamPermasalahan.keterangan || '-'}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Signatures */}
                <div className="grid grid-cols-2 text-center pt-6 text-xs gap-4 font-serif">
                  <div>
                    <div>Mengetahui,</div>
                    <div>Kepala SMP Negeri 7 Pasuruan</div>
                    <SignatureBox recordId={currentRekamPermasalahan.id} role="kepala_sekolah" className="h-20 w-32 mx-auto" />
                    <div className="font-bold underline">{formatKepalaSekolah(currentRekamPermasalahan.nama_kepala_sekolah)}</div>
                    <div>NIP. {currentRekamPermasalahan.nip_kepala_sekolah || '19860410 201001 2 030'}</div>
                  </div>
                  <div>
                    <div>Pasuruan, {currentRekamPermasalahan.tanggal_surat ? formatIndoDate(currentRekamPermasalahan.tanggal_surat) : todayStr}</div>
                    <div>Guru Bimbingan dan Konseling</div>
                    <SignatureBox recordId={currentRekamPermasalahan.id} role="guru_bk" className="h-20 w-32 mx-auto" />
                    <div className="font-bold underline">{( ( currentRekamPermasalahan.nama_guru_bk || getActiveGuruBK().nama )?.toString().replace(/S\.PD/g, "S.Pd").replace(/S\.pd/g, "S.Pd") )?.toString().replace(/S\.PD/g, "S.Pd").replace(/S\.pd/g, "S.Pd")}</div>
                    <div>NIP. {currentRekamPermasalahan.nip_guru_bk || getActiveGuruBK().nip}</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-slate-500 italic">
                Data Rekam Permasalahan Siswa tidak ditemukan.
              </div>
            )}
          </div>
        )}

        {/* 10. REKAM PERMASALAHAN SISWA (TABEL REKAP) */}
        {docType === 'rekam_permasalahan_tabel' && (
          <div className="overflow-x-auto my-4 print:my-0 print:overflow-visible">
            <h3 className="text-center text-base font-bold uppercase mb-4 underline print:mb-2 print:break-after-avoid">
              REKAPITULASI REKAM PERMASALAHAN SISWA
            </h3>
            <table className="w-full text-left text-xs border-collapse border border-slate-900">
              <thead>
                <tr className="bg-slate-200 text-slate-950 font-bold border-b border-slate-900 text-[10px] uppercase text-center">
                  <th className="p-2 border border-slate-900 w-8">NO</th>
                  <th className="p-2 border border-slate-900 w-24">HARI / TGL</th>
                  <th className="p-2 border border-slate-900 w-28">SISWA / KELAS</th>
                  <th className="p-2 border border-slate-900 w-28">ORANG TUA & ALAMAT</th>
                  <th className="p-2 border border-slate-900">RINGKASAN PERMASALAHAN</th>
                  <th className="p-2 border border-slate-900">UPAYA & HASIL</th>
                  <th className="p-2 border border-slate-900 w-20">FOTO / KET</th>
                </tr>
              </thead>
              <tbody>
                {rekamPermasalahanItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-slate-500 italic border border-slate-900">
                      Belum ada data Rekam Permasalahan Siswa.
                    </td>
                  </tr>
                ) : (
                  rekamPermasalahanItems.map((item, idx) => (
                    <tr key={item.id} className="border-b border-slate-900">
                      <td className="p-2 text-center border border-slate-900 font-semibold">{idx + 1}</td>
                      <td className="p-2 border border-slate-900 font-medium text-[11px]">
                        <div><b>{item.hari}</b></div>
                        <div>{formatIndoDate(item.tanggal)}</div>
                        <div className="text-slate-600 font-mono text-[10px]">{item.waktu}</div>
                      </td>
                      <td className="p-2 border border-slate-900 font-bold">
                        <div>{item.nama_siswa}</div>
                        <div className="text-slate-700 font-normal">Kelas: {item.kelas}</div>
                      </td>
                      <td className="p-2 border border-slate-900">
                        <div><b>{item.nama_orang_tua || '-'}</b></div>
                        <div className="text-slate-600 text-[10px]">{item.pekerjaan_orang_tua}</div>
                        <div className="text-slate-600 text-[10px]">{item.alamat || '-'}</div>
                      </td>
                      <td className="p-2 border border-slate-900">
                        <div className="text-slate-800 text-[11px] whitespace-pre-line">{item.ringkasan_uraian_permasalahan}</div>
                      </td>
                      <td className="p-2 border border-slate-900 text-[11px]">
                        <div><b>Upaya:</b> {item.upaya_konselor_walikelas || '-'}</div>
                        <div className="mt-1"><b>Hasil:</b> {item.hasil_dan_kesimpulan || '-'}</div>
                      </td>
                      <td className="p-2 border border-slate-900 text-[10px]">
                        {item.link_foto_kegiatan && (
                          <a href={item.link_foto_kegiatan} target="_blank" rel="noreferrer" className="text-blue-700 underline block mb-1">
                            Foto
                          </a>
                        )}
                        <div>{item.keterangan || '-'}</div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* SIGNATURE REKAP REKAM PERMASALAHAN */}
            <div className="grid grid-cols-2 text-center pt-8 text-xs gap-4 font-serif print:break-inside-avoid mt-6">
              <div>
                <div>Mengetahui,</div>
                <div className="font-bold">Kepala SMP Negeri 7 Pasuruan</div>
                <SignatureBox recordId="rekam_permasalahan_tabel_rekap" role="kepala_sekolah" className="h-20 w-32 mx-auto" />
                <div className="font-bold underline">NUR FADILAH, S.Pd,. M.Pd</div>
                <div>NIP. 19860410 201001 2 030</div>
              </div>
              <div>
                <div>Pasuruan, {todayStr}</div>
                <div className="font-bold">Guru Bimbingan dan Konseling</div>
                <SignatureBox recordId="rekam_permasalahan_tabel_rekap" role="guru_bk" className="h-20 w-32 mx-auto" />
                <div className="font-bold underline">{( getActiveGuruBK().nama )?.toString().replace(/S\.PD/g, "S.Pd").replace(/S\.pd/g, "S.Pd")}</div>
                <div>NIP. {getActiveGuruBK().nip}</div>
              </div>
            </div>
          </div>
        )}

        {/* 11. RENCANA KONSELING INDIVIDU (DOKUMEN SINGLE) */}
        {docType === 'konseling_individu_dokumen' && (
          <div className="space-y-4 text-sm text-slate-950 font-serif">
            {currentKonselingIndividu ? (
              <>
                <div className="text-center my-3">
                  <h2 className="text-base font-extrabold uppercase tracking-wide">
                    RENCANA KONSELING INDIVIDU
                  </h2>
                  <p className="text-xs font-bold uppercase mt-1">
                    BIMBINGAN DAN KONSELING UPT SMP NEGERI 7 PASURUAN
                  </p>
                </div>

                <table className="w-full border-collapse border border-black text-xs font-serif leading-relaxed my-4">
                  <tbody>
                    <tr className="border-b border-black">
                      <td className="p-2 border-r border-black font-bold text-center w-8">1</td>
                      <td className="p-2 border-r border-black font-bold w-52 sm:w-60">Hari / Tanggal / Waktu</td>
                      <td className="p-2 font-bold">{currentKonselingIndividu.hari}, {formatIndoDate(currentKonselingIndividu.tanggal)} ({currentKonselingIndividu.waktu || '08.00 WIB'})</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2 border-r border-black font-bold text-center">2</td>
                      <td className="p-2 border-r border-black font-bold">Kelas</td>
                      <td className="p-2 font-bold">Kelas {currentKonselingIndividu.kelas}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2 border-r border-black font-bold text-center">3</td>
                      <td className="p-2 border-r border-black font-bold">Nama Siswa</td>
                      <td className="p-2 font-bold uppercase">{currentKonselingIndividu.nama_siswa}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2 border-r border-black font-bold text-center">4</td>
                      <td className="p-2 border-r border-black font-bold">Topik Permasalahan</td>
                      <td className="p-2 font-semibold">{currentKonselingIndividu.topik_permasalahan || '-'}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2 border-r border-black font-bold text-center">5</td>
                      <td className="p-2 border-r border-black font-bold">Media yang Diperlukan</td>
                      <td className="p-2">{currentKonselingIndividu.media_yang_diperlukan || '-'}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2 border-r border-black font-bold text-center">6</td>
                      <td className="p-2 border-r border-black font-bold">Ringkasan Uraian Permasalahan Siswa</td>
                      <td className="p-2 whitespace-pre-line">{currentKonselingIndividu.ringkasan_uraian_permasalahan || '-'}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2 border-r border-black font-bold text-center">7</td>
                      <td className="p-2 border-r border-black font-bold">Pendekatan dan Teknik Konseling</td>
                      <td className="p-2 whitespace-pre-line">{currentKonselingIndividu.pendekatan_dan_teknik_konseling || '-'}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2 border-r border-black font-bold text-center">8</td>
                      <td className="p-2 border-r border-black font-bold">Hasil yang Dicapai</td>
                      <td className="p-2 whitespace-pre-line">{currentKonselingIndividu.hasil_yang_dicapai || '-'}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2 border-r border-black font-bold text-center">9</td>
                      <td className="p-2 border-r border-black font-bold">Dokumentasi / Foto Kegiatan</td>
                      <td className="p-2">
                        {currentKonselingIndividu.link_foto_kegiatan ? (
                          <div className="space-y-1">
                            <img
                              src={currentKonselingIndividu.link_foto_kegiatan}
                              alt="Dokumentasi Foto Konseling"
                              className="max-h-48 max-w-xs object-contain rounded border border-slate-300 print:max-h-40"
                              onError={(e) => {
                                const target = e.target as HTMLElement;
                                target.style.display = 'none';
                              }}
                            />
                            {currentKonselingIndividu.link_foto_kegiatan.startsWith('http') && (
                              <a href={currentKonselingIndividu.link_foto_kegiatan} target="_blank" rel="noreferrer" className="text-blue-700 underline text-xs block print:hidden">
                                {currentKonselingIndividu.link_foto_kegiatan}
                              </a>
                            )}
                          </div>
                        ) : '-'}
                      </td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2 border-r border-black font-bold text-center">10</td>
                      <td className="p-2 border-r border-black font-bold">Keterangan</td>
                      <td className="p-2">{currentKonselingIndividu.keterangan || '-'}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Signatures */}
                <div className="grid grid-cols-2 text-center pt-6 text-xs gap-4 font-serif">
                  <div>
                    <div>Mengetahui,</div>
                    <div>Kepala SMP Negeri 7 Pasuruan</div>
                    <SignatureBox recordId={currentKonselingIndividu.id} role="kepala_sekolah" className="h-20 w-32 mx-auto" />
                    <div className="font-bold underline">{formatKepalaSekolah(currentKonselingIndividu.nama_kepala_sekolah)}</div>
                    <div>NIP. {currentKonselingIndividu.nip_kepala_sekolah || '19860410 201001 2 030'}</div>
                  </div>
                  <div>
                    <div>Pasuruan, {formatIndoDate(currentKonselingIndividu.tanggal)}</div>
                    <div>Guru Bimbingan dan Konseling</div>
                    <SignatureBox recordId={currentKonselingIndividu.id} role="guru_bk" className="h-20 w-32 mx-auto" />
                    <div className="font-bold underline">{( ( currentKonselingIndividu.nama_guru_bk || getActiveGuruBK().nama )?.toString().replace(/S\.PD/g, "S.Pd").replace(/S\.pd/g, "S.Pd") )?.toString().replace(/S\.PD/g, "S.Pd").replace(/S\.pd/g, "S.Pd")}</div>
                    <div>NIP. {currentKonselingIndividu.nip_guru_bk || getActiveGuruBK().nip}</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-slate-500 italic">
                Data Rencana Konseling Individu tidak ditemukan.
              </div>
            )}
          </div>
        )}

        {/* 12. RENCANA KONSELING INDIVIDU (TABEL REKAP) */}
        {docType === 'konseling_individu_tabel' && (
          <div className="overflow-x-auto my-4 print:my-0 print:overflow-visible">
            <h3 className="text-center text-base font-bold uppercase mb-4 underline print:mb-2 print:break-after-avoid">
              REKAPITULASI RENCANA KONSELING INDIVIDU
            </h3>
            <table className="w-full text-left text-xs border-collapse border border-slate-900">
              <thead>
                <tr className="bg-slate-200 text-slate-950 font-bold border-b border-slate-900 text-[10px] uppercase text-center">
                  <th className="p-2 border border-slate-900 w-8">NO</th>
                  <th className="p-2 border border-slate-900 w-24">HARI / TGL</th>
                  <th className="p-2 border border-slate-900 w-28">SISWA / KELAS</th>
                  <th className="p-2 border border-slate-900 w-28">TOPIK & MEDIA</th>
                  <th className="p-2 border border-slate-900">RINGKASAN PERMASALAHAN</th>
                  <th className="p-2 border border-slate-900">PENDEKATAN & HASIL</th>
                  <th className="p-2 border border-slate-900 w-20">FOTO / KET</th>
                </tr>
              </thead>
              <tbody>
                {konselingIndividuItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-slate-500 italic border border-slate-900">
                      Belum ada data Rencana Konseling Individu.
                    </td>
                  </tr>
                ) : (
                  konselingIndividuItems.map((item, idx) => (
                    <tr key={item.id} className="border-b border-slate-900">
                      <td className="p-2 text-center border border-slate-900 font-semibold">{idx + 1}</td>
                      <td className="p-2 border border-slate-900 font-medium text-[11px]">
                        <div><b>{item.hari}</b></div>
                        <div>{formatIndoDate(item.tanggal)}</div>
                        <div className="text-slate-600 font-mono text-[10px]">{item.waktu}</div>
                      </td>
                      <td className="p-2 border border-slate-900 font-bold">
                        <div>{item.nama_siswa}</div>
                        <div className="text-slate-700 font-normal">Kelas: {item.kelas}</div>
                      </td>
                      <td className="p-2 border border-slate-900">
                        <div><b>{item.topik_permasalahan || '-'}</b></div>
                        <div className="text-slate-600 text-[10px]">Media: {item.media_yang_diperlukan || '-'}</div>
                      </td>
                      <td className="p-2 border border-slate-900">
                        <div className="text-slate-800 text-[11px] whitespace-pre-line">{item.ringkasan_uraian_permasalahan}</div>
                      </td>
                      <td className="p-2 border border-slate-900 text-[11px]">
                        <div><b>Teknik:</b> {item.pendekatan_dan_teknik_konseling || '-'}</div>
                        <div className="mt-1"><b>Hasil:</b> {item.hasil_yang_dicapai || '-'}</div>
                      </td>
                      <td className="p-2 border border-slate-900 text-[10px]">
                        {item.link_foto_kegiatan && (
                          <a href={item.link_foto_kegiatan} target="_blank" rel="noreferrer" className="text-blue-700 underline block mb-1">
                            Foto
                          </a>
                        )}
                        <div>{item.keterangan || '-'}</div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* SIGNATURE REKAP KONSELING INDIVIDU */}
            <div className="grid grid-cols-2 text-center pt-8 text-xs gap-4 font-serif print:break-inside-avoid mt-6">
              <div>
                <div>Mengetahui,</div>
                <div className="font-bold">Kepala SMP Negeri 7 Pasuruan</div>
                <SignatureBox recordId="konseling_individu_tabel_rekap" role="kepala_sekolah" className="h-20 w-32 mx-auto" />
                <div className="font-bold underline">NUR FADILAH, S.Pd,. M.Pd</div>
                <div>NIP. 19860410 201001 2 030</div>
              </div>
              <div>
                <div>Pasuruan, {todayStr}</div>
                <div className="font-bold">Guru Bimbingan dan Konseling</div>
                <SignatureBox recordId="konseling_individu_tabel_rekap" role="guru_bk" className="h-20 w-32 mx-auto" />
                <div className="font-bold underline">{( getActiveGuruBK().nama )?.toString().replace(/S\.PD/g, "S.Pd").replace(/S\.pd/g, "S.Pd")}</div>
                <div>NIP. {getActiveGuruBK().nip}</div>
              </div>
            </div>
          </div>
        )}

        {/* 13. RENCANA KONSELING KELOMPOK (DOKUMEN SINGLE) */}
        {docType === 'konseling_kelompok_dokumen' && (
          <div className="space-y-4 text-sm text-slate-950 font-serif">
            {currentKonselingKelompok ? (
              <>
                <div className="text-center my-3">
                  <h2 className="text-base font-extrabold uppercase tracking-wide">
                    RENCANA KONSELING KELOMPOK
                  </h2>
                  <p className="text-xs font-bold uppercase mt-1">
                    BIMBINGAN DAN KONSELING UPT SMP NEGERI 7 PASURUAN
                  </p>
                </div>

                <table className="w-full border-collapse border border-black text-xs font-serif leading-relaxed my-4">
                  <tbody>
                    <tr className="border-b border-black">
                      <td className="p-2 border-r border-black font-bold text-center w-8">1</td>
                      <td className="p-2 border-r border-black font-bold w-52 sm:w-60">Hari / Tanggal / Waktu</td>
                      <td className="p-2 font-bold">{currentKonselingKelompok.hari}, {formatIndoDate(currentKonselingKelompok.tanggal)} ({currentKonselingKelompok.waktu || '09.00 WIB'})</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2 border-r border-black font-bold text-center">2</td>
                      <td className="p-2 border-r border-black font-bold">Kelas</td>
                      <td className="p-2 font-bold">Kelas {currentKonselingKelompok.kelas}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2 border-r border-black font-bold text-center">3</td>
                      <td className="p-2 border-r border-black font-bold">Nama Siswa / Anggota Kelompok</td>
                      <td className="p-2 font-bold whitespace-pre-line">{currentKonselingKelompok.nama_siswa}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2 border-r border-black font-bold text-center">4</td>
                      <td className="p-2 border-r border-black font-bold">Topik Permasalahan</td>
                      <td className="p-2 font-semibold">{currentKonselingKelompok.topik_permasalahan || '-'}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2 border-r border-black font-bold text-center">5</td>
                      <td className="p-2 border-r border-black font-bold">Media yang Diperlukan</td>
                      <td className="p-2">{currentKonselingKelompok.media_yang_diperlukan || '-'}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2 border-r border-black font-bold text-center">6</td>
                      <td className="p-2 border-r border-black font-bold">Ringkasan Uraian Permasalahan Siswa</td>
                      <td className="p-2 whitespace-pre-line">{currentKonselingKelompok.ringkasan_uraian_permasalahan || '-'}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2 border-r border-black font-bold text-center">7</td>
                      <td className="p-2 border-r border-black font-bold">Pendekatan dan Teknik Konseling</td>
                      <td className="p-2 whitespace-pre-line">{currentKonselingKelompok.pendekatan_dan_teknik_konseling || '-'}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2 border-r border-black font-bold text-center">8</td>
                      <td className="p-2 border-r border-black font-bold">Hasil yang Dicapai</td>
                      <td className="p-2 whitespace-pre-line">{currentKonselingKelompok.hasil_yang_dicapai || '-'}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2 border-r border-black font-bold text-center">9</td>
                      <td className="p-2 border-r border-black font-bold">Dokumentasi / Foto Kegiatan</td>
                      <td className="p-2">
                        {currentKonselingKelompok.link_foto_kegiatan ? (
                          <div className="space-y-1">
                            <img
                              src={currentKonselingKelompok.link_foto_kegiatan}
                              alt="Dokumentasi Foto Konseling Kelompok"
                              className="max-h-48 max-w-xs object-contain rounded border border-slate-300 print:max-h-40"
                              onError={(e) => {
                                const target = e.target as HTMLElement;
                                target.style.display = 'none';
                              }}
                            />
                            {currentKonselingKelompok.link_foto_kegiatan.startsWith('http') && (
                              <a href={currentKonselingKelompok.link_foto_kegiatan} target="_blank" rel="noreferrer" className="text-blue-700 underline text-xs block print:hidden">
                                {currentKonselingKelompok.link_foto_kegiatan}
                              </a>
                            )}
                          </div>
                        ) : '-'}
                      </td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2 border-r border-black font-bold text-center">10</td>
                      <td className="p-2 border-r border-black font-bold">Keterangan</td>
                      <td className="p-2">{currentKonselingKelompok.keterangan || '-'}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Signatures */}
                <div className="grid grid-cols-2 text-center pt-6 text-xs gap-4 font-serif">
                  <div>
                    <div>Mengetahui,</div>
                    <div>Kepala SMP Negeri 7 Pasuruan</div>
                    <SignatureBox recordId={currentKonselingKelompok.id} role="kepala_sekolah" className="h-20 w-32 mx-auto" />
                    <div className="font-bold underline">{formatKepalaSekolah(currentKonselingKelompok.nama_kepala_sekolah)}</div>
                    <div>NIP. {currentKonselingKelompok.nip_kepala_sekolah || '19860410 201001 2 030'}</div>
                  </div>
                  <div>
                    <div>Pasuruan, {formatIndoDate(currentKonselingKelompok.tanggal)}</div>
                    <div>Guru Bimbingan dan Konseling</div>
                    <SignatureBox recordId={currentKonselingKelompok.id} role="guru_bk" className="h-20 w-32 mx-auto" />
                    <div className="font-bold underline">{( ( currentKonselingKelompok.nama_guru_bk || getActiveGuruBK().nama )?.toString().replace(/S\.PD/g, "S.Pd").replace(/S\.pd/g, "S.Pd") )?.toString().replace(/S\.PD/g, "S.Pd").replace(/S\.pd/g, "S.Pd")}</div>
                    <div>NIP. {currentKonselingKelompok.nip_guru_bk || getActiveGuruBK().nip}</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-slate-500 italic">
                Data Rencana Konseling Kelompok tidak ditemukan.
              </div>
            )}
          </div>
        )}

        {/* 14. RENCANA KONSELING KELOMPOK (TABEL REKAP) */}
        {docType === 'konseling_kelompok_tabel' && (
          <div className="overflow-x-auto my-4 print:my-0 print:overflow-visible">
            <h3 className="text-center text-base font-bold uppercase mb-4 underline print:mb-2 print:break-after-avoid">
              REKAPITULASI RENCANA KONSELING KELOMPOK
            </h3>
            <table className="w-full text-left text-xs border-collapse border border-slate-900">
              <thead>
                <tr className="bg-slate-200 text-slate-950 font-bold border-b border-slate-900 text-[10px] uppercase text-center">
                  <th className="p-2 border border-slate-900 w-8">NO</th>
                  <th className="p-2 border border-slate-900 w-24">HARI / TGL</th>
                  <th className="p-2 border border-slate-900 w-36">ANGGOTA & KELAS</th>
                  <th className="p-2 border border-slate-900 w-28">TOPIK & MEDIA</th>
                  <th className="p-2 border border-slate-900">RINGKASAN PERMASALAHAN</th>
                  <th className="p-2 border border-slate-900">PENDEKATAN & HASIL</th>
                  <th className="p-2 border border-slate-900 w-20">FOTO / KET</th>
                </tr>
              </thead>
              <tbody>
                {konselingKelompokItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-slate-500 italic border border-slate-900">
                      Belum ada data Rencana Konseling Kelompok.
                    </td>
                  </tr>
                ) : (
                  konselingKelompokItems.map((item, idx) => (
                    <tr key={item.id} className="border-b border-slate-900">
                      <td className="p-2 text-center border border-slate-900 font-semibold">{idx + 1}</td>
                      <td className="p-2 border border-slate-900 font-medium text-[11px]">
                        <div><b>{item.hari}</b></div>
                        <div>{formatIndoDate(item.tanggal)}</div>
                        <div className="text-slate-600 font-mono text-[10px]">{item.waktu}</div>
                      </td>
                      <td className="p-2 border border-slate-900 font-bold">
                        <div className="whitespace-pre-line text-[11px]">{item.nama_siswa}</div>
                        <div className="text-slate-700 font-normal mt-0.5">Kelas: {item.kelas}</div>
                      </td>
                      <td className="p-2 border border-slate-900">
                        <div><b>{item.topik_permasalahan || '-'}</b></div>
                        <div className="text-slate-600 text-[10px]">Media: {item.media_yang_diperlukan || '-'}</div>
                      </td>
                      <td className="p-2 border border-slate-900">
                        <div className="text-slate-800 text-[11px] whitespace-pre-line">{item.ringkasan_uraian_permasalahan}</div>
                      </td>
                      <td className="p-2 border border-slate-900 text-[11px]">
                        <div><b>Teknik:</b> {item.pendekatan_dan_teknik_konseling || '-'}</div>
                        <div className="mt-1"><b>Hasil:</b> {item.hasil_yang_dicapai || '-'}</div>
                      </td>
                      <td className="p-2 border border-slate-900 text-[10px]">
                        {item.link_foto_kegiatan && (
                          <a href={item.link_foto_kegiatan} target="_blank" rel="noreferrer" className="text-blue-700 underline block mb-1">
                            Foto
                          </a>
                        )}
                        <div>{item.keterangan || '-'}</div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* 13. SURAT PERNYATAAN SISWA / ORANG TUA (DOKUMEN DENGAN KOP SURAT) */}
        {docType === 'surat_pernyataan_dokumen' && (
          <div className="space-y-4 text-sm leading-relaxed text-slate-950 font-serif">
            {currentSuratPernyataan ? (
              (() => {
                const sp = currentSuratPernyataan;
                const tanggalIndo = formatIndoDate(sp.tanggal_surat);
                const isSPSiswa = sp.jenis_sp.startsWith('SP_1') || sp.jenis_sp.startsWith('SP_2') || sp.jenis_sp.startsWith('SP_3');

                let titleDoc = 'SURAT PERNYATAAN SISWA';
                if (sp.jenis_sp === 'SP_1') titleDoc = 'SURAT PERNYATAAN SISWA (SP 1)';
                else if (sp.jenis_sp === 'SP_2') titleDoc = 'SURAT PERNYATAAN SISWA (SP 2)';
                else if (sp.jenis_sp === 'SP_3') titleDoc = 'SURAT PERNYATAAN SISWA (SP 3)';
                else if (sp.jenis_sp === 'SP_ORTU_1') titleDoc = 'SURAT PERNYATAAN ORANG TUA / WALI';
                else if (sp.jenis_sp === 'SP_ORTU_2') titleDoc = 'SURAT PERNYATAAN ORANG TUA / WALI';
                else if (sp.jenis_sp === 'SP_PENGUNDURAN_DIRI') titleDoc = 'SURAT PERNYATAAN PENGUNDURAN DIRI';
                else if (sp.jenis_sp === 'SP_DAMAI') titleDoc = 'SURAT PERNYATAAN DAMAI SISWA';

                return (
                  <>
                    <div className="text-center my-4">
                      <h2 className="text-base font-bold uppercase underline tracking-wider">
                        {titleDoc}
                      </h2>
                      {sp.jenis_sp === 'SP_DAMAI' && (
                        <>
                          <p className="text-xs font-bold uppercase mt-1">UPT SMP NEGERI 7 PASURUAN</p>
                          <p className="text-xs font-semibold mt-0.5">Tahun Ajaran {sp.tahun_ajaran || '2026-2027'}</p>
                        </>
                      )}
                    </div>

                    {/* SP DAMAI SISWA */}
                    {sp.jenis_sp === 'SP_DAMAI' && (
                      <div className="space-y-3">
                        <p>
                          Pada hari ini, <span className="font-semibold">{tanggalIndo}</span>, kami yang bertanda tangan di bawah ini:
                        </p>

                        <table className="ml-5 border-collapse w-11/12">
                          <tbody>
                            <tr>
                              <td className="w-48 py-1">Nama Siswa Pertama</td>
                              <td className="w-5 py-1">:</td>
                              <td className="py-1 font-bold">{sp.nama_siswa}</td>
                            </tr>
                            <tr>
                              <td className="py-1">Kelas</td>
                              <td className="py-1">:</td>
                              <td className="py-1 font-bold">{sp.kelas}</td>
                            </tr>
                            <tr>
                              <td className="py-1">Nama Siswa Kedua</td>
                              <td className="py-1">:</td>
                              <td className="py-1 font-bold">{sp.nama_siswa_2 || '....................................'}</td>
                            </tr>
                            <tr>
                              <td className="py-1">Kelas</td>
                              <td className="py-1">:</td>
                              <td className="py-1 font-bold">{sp.kelas_2 || '................'}</td>
                            </tr>
                            <tr>
                              <td className="py-1">Hari, Tanggal Kejadian</td>
                              <td className="py-1">:</td>
                              <td className="py-1 font-semibold">{sp.hari_tanggal_kejadian || '................, ....................'}</td>
                            </tr>
                          </tbody>
                        </table>

                        <p className="pt-2 text-justify">
                          Menyatakan bahwa kami telah bersepakat untuk damai dan menyelesaikan perselisihan yang pernah terjadi secara kekeluargaan.
                        </p>

                        <p className="pt-1 font-semibold text-black">Dengan ini kami berjanji:</p>
                        <div className="ml-5 py-1 text-black whitespace-pre-wrap leading-relaxed text-sm">
                          {sp.peraturan_diketahui || (
                            <>
                              1. Saling memaafkan dengan tulus dan tidak akan mengungkit atau memperpanjang masalah ini lagi.<br />
                              2. Kembali berteman dengan baik serta tidak akan saling mengejek, mengancam, memprovokasi, atau melakukan kekerasan dalam bentuk apa pun.<br />
                              3. Siap menerima sanksi tegas dari pihak sekolah sesuai dengan aturan yang berlaku apabila melanggar janji ini.
                            </>
                          )}
                        </div>

                        <p className="text-justify pt-2">
                          Demikian surat pernyataan damai ini kami buat dengan penuh kesadaran dan tanpa paksaan dari pihak mana pun.
                        </p>

                        {/* Signatures for SP Damai */}
                        <div className="pt-6 space-y-6 text-xs font-serif">
                          <div className="text-right">
                            <p>{sp.tempat_surat || 'Pasuruan'}, {tanggalIndo}</p>
                          </div>

                          <div className="grid grid-cols-2 text-center gap-6">
                            <div>
                              <p className="font-bold">Siswa Pertama</p>
                              <SignatureBox recordId={sp.id} role="siswa" className="h-20 w-32 mx-auto" />
                              <p className="font-bold underline">( {sp.nama_siswa} )</p>
                            </div>

                            <div>
                              <p className="font-bold">Siswa Kedua</p>
                              <SignatureBox recordId={`${sp.id}_siswa_2`} role="siswa" className="h-20 w-32 mx-auto" />
                              <p className="font-bold underline">( {sp.nama_siswa_2 || '....................................'} )</p>
                            </div>
                          </div>

                          <div className="text-center pt-2">
                            <p>Mengetahui,</p>
                            <p className="font-bold">{sp.jabatan_pengetahu || 'Guru BK / Wali Kelas'}</p>
                            <SignatureBox recordId={sp.id} role="guru_bk" className="h-20 w-32 mx-auto" />
                            <p className="font-bold underline">
                              {( ( sp.nama_guru_bk || getActiveGuruBK().nama )?.toString().replace(/S\.PD/g, 'S.Pd').replace(/S\.pd/g, 'S.Pd') )}
                            </p>
                            <p>NIP. {sp.nip_guru_bk || getActiveGuruBK().nip}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {isSPSiswa && (
                      <div className="space-y-3">
                        <p>Saya yang bertanda tangan dibawah ini:</p>
                        <table className="ml-5 border-collapse w-11/12">
                          <tbody>
                            <tr>
                              <td className="w-36 py-1">Nama</td>
                              <td className="w-5 py-1">:</td>
                              <td className="py-1 font-bold">{sp.nama_siswa}</td>
                            </tr>
                            <tr>
                              <td className="py-1">Kelas</td>
                              <td className="py-1">:</td>
                              <td className="py-1 font-bold">{sp.kelas}</td>
                            </tr>
                          </tbody>
                        </table>

                        <p className="pt-2">Berjanji dihadapan Orang Tua / Wali:</p>
                        <table className="ml-5 border-collapse w-11/12">
                          <tbody>
                            <tr>
                              <td className="w-36 py-1">Nama</td>
                              <td className="w-5 py-1">:</td>
                              <td className="py-1 font-bold">{sp.nama_orang_tua || '-'}</td>
                            </tr>
                            <tr>
                              <td className="py-1">Pekerjaan</td>
                              <td className="py-1">:</td>
                              <td className="py-1">{sp.pekerjaan_orang_tua || '-'}</td>
                            </tr>
                            <tr>
                              <td className="py-1">Alamat</td>
                              <td className="py-1">:</td>
                              <td className="py-1">{sp.alamat_orang_tua || '-'}</td>
                            </tr>
                          </tbody>
                        </table>

                        <p className="pt-2 font-semibold text-black">Untuk memenuhi Peraturan Sekolah sebagai berikut:</p>
                        <div className="ml-5 py-2 text-black whitespace-pre-wrap leading-relaxed text-sm">
                          {sp.peraturan_diketahui || '-'}
                        </div>

                        <p className="text-justify pt-2">
                          Demikian Surat Perjanjian ini dibuat tanpa ada paksaan dari pihak lain.
                        </p>

                        <div className="pt-8 grid grid-cols-2 text-center text-xs font-serif">
                          <div className="text-left">
                            <p>Mengetahui,</p>
                            <p className="font-bold">Orang Tua / Wali</p>
                            <SignatureBox recordId={sp.id} role="orang_tua" className="h-20 w-32 mx-auto" />
                            <p className="font-bold underline">( {sp.nama_orang_tua || '....................................'} )</p>
                          </div>

                          <div className="text-right">
                            <p>{sp.tempat_surat || 'Pasuruan'}, {tanggalIndo}</p>
                            <p className="font-bold">Siswa yang bersangkutan,</p>
                            <SignatureBox recordId={sp.id} role="siswa" className="h-20 w-32 mx-auto" />
                            <p className="font-bold underline">( {sp.nama_siswa} )</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {sp.jenis_sp === 'SP_ORTU_1' && (
                      <div className="space-y-3">
                        <p>Yang bertanda tangan dibawah ini:</p>
                        <table className="ml-5 border-collapse w-11/12">
                          <tbody>
                            <tr>
                              <td className="w-40 py-1">Nama</td>
                              <td className="w-5 py-1">:</td>
                              <td className="py-1 font-bold">{sp.nama_orang_tua || '-'}</td>
                            </tr>
                            <tr>
                              <td className="py-1">Alamat</td>
                              <td className="py-1">:</td>
                              <td className="py-1">{sp.alamat_orang_tua || '-'}</td>
                            </tr>
                            <tr>
                              <td className="py-1">Pekerjaan</td>
                              <td className="py-1">:</td>
                              <td className="py-1">{sp.pekerjaan_orang_tua || '-'}</td>
                            </tr>
                            <tr>
                              <td className="py-1">Hubungan Keluarga</td>
                              <td className="py-1">:</td>
                              <td className="py-1">{sp.hubungan_keluarga || 'Orang Tua / Wali'} dari Siswa <strong>{sp.nama_siswa}</strong> (Kelas {sp.kelas})</td>
                            </tr>
                          </tbody>
                        </table>

                        <p className="pt-2 font-semibold text-black">Pernyataan / Komitmen Orang Tua:</p>
                        <div className="py-2 text-black whitespace-pre-wrap leading-relaxed text-sm pl-4">
                          {sp.peraturan_diketahui || '-'}
                        </div>

                        <p className="text-justify pt-2">
                          Demikian pernyataan ini saya buat dengan sebenarnya untuk dapat dipergunakan sebagaimana diperlukan.
                        </p>

                        <div className="pt-8 grid grid-cols-2 text-xs font-serif">
                          <div />
                          <div className="text-right">
                            <p>{sp.tempat_surat || 'Pasuruan'}, {tanggalIndo}</p>
                            <p>Hormat saya,</p>
                            <p className="font-bold">Orang tua / wali siswa</p>
                            <SignatureBox recordId={sp.id} role="orang_tua" className="h-20 w-32 ml-auto" />
                            <p className="font-bold underline">( {sp.nama_orang_tua || '....................................'} )</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {sp.jenis_sp === 'SP_ORTU_2' && (
                      <div className="space-y-3">
                        <p>Yang bertanda tangan dibawah ini, kami orang tua murid atau wali:</p>
                        <table className="ml-5 border-collapse w-11/12">
                          <tbody>
                            <tr>
                              <td className="w-36 py-1">Nama</td>
                              <td className="w-5 py-1">:</td>
                              <td className="py-1 font-bold">{sp.nama_orang_tua || '-'}</td>
                            </tr>
                            <tr>
                              <td className="py-1">Alamat</td>
                              <td className="py-1">:</td>
                              <td className="py-1">{sp.alamat_orang_tua || '-'}</td>
                            </tr>
                            <tr>
                              <td className="py-1">Pekerjaan</td>
                              <td className="py-1">:</td>
                              <td className="py-1">{sp.pekerjaan_orang_tua || '-'}</td>
                            </tr>
                          </tbody>
                        </table>

                        <p className="pt-2">Adalah orang tua dari siswa:</p>
                        <table className="ml-5 border-collapse w-11/12">
                          <tbody>
                            <tr>
                              <td className="w-36 py-1">Nama</td>
                              <td className="w-5 py-1">:</td>
                              <td className="py-1 font-bold">{sp.nama_siswa}</td>
                            </tr>
                            <tr>
                              <td className="py-1">Kelas</td>
                              <td className="py-1">:</td>
                              <td className="py-1 font-bold">{sp.kelas}</td>
                            </tr>
                            <tr>
                              <td className="py-1">Alamat</td>
                              <td className="py-1">:</td>
                              <td className="py-1">{sp.alamat_orang_tua || '-'}</td>
                            </tr>
                          </tbody>
                        </table>

                        <p className="pt-2 font-semibold text-black">Pernyataan / Komitmen Orang Tua:</p>
                        <div className="py-2 text-black whitespace-pre-wrap leading-relaxed text-sm pl-4">
                          {sp.peraturan_diketahui || '-'}
                        </div>

                        <p className="text-justify pt-2">
                          Demikian surat pernyataan ini, kami buat dengan sebenar-benarnya dan tanpa ada unsur paksaan dari siapapun.
                        </p>

                        <div className="pt-8 grid grid-cols-2 text-xs font-serif">
                          <div className="text-left">
                            <p>Yang membuat pernyataan</p>
                            <p className="font-bold">Orang tua murid</p>
                            <SignatureBox recordId={sp.id} role="orang_tua" className="h-20 w-32 mr-auto" />
                            <p className="font-bold underline">( {sp.nama_orang_tua || '....................................'} )</p>
                          </div>

                          <div className="text-right">
                            <p>{sp.tempat_surat || 'Pasuruan'}, {tanggalIndo}</p>
                            <p className="font-bold">Siswa</p>
                            <SignatureBox recordId={sp.id} role="siswa" className="h-20 w-32 mx-auto" />
                            <p className="font-bold underline">( {sp.nama_siswa} )</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {sp.jenis_sp === 'SP_PENGUNDURAN_DIRI' && (
                      <div className="space-y-3">
                        <p>Yang bertanda tangan dibawah ini:</p>
                        <table className="ml-5 border-collapse w-11/12">
                          <tbody>
                            <tr>
                              <td className="w-36 py-1">Nama</td>
                              <td className="w-5 py-1">:</td>
                              <td className="py-1 font-bold">{sp.nama_orang_tua || '-'}</td>
                            </tr>
                            <tr>
                              <td className="py-1">Alamat</td>
                              <td className="py-1">:</td>
                              <td className="py-1">{sp.alamat_orang_tua || '-'}</td>
                            </tr>
                            <tr>
                              <td className="py-1">Pekerjaan</td>
                              <td className="py-1">:</td>
                              <td className="py-1">{sp.pekerjaan_orang_tua || '-'}</td>
                            </tr>
                          </tbody>
                        </table>

                        <p className="pt-2">Adalah orang tua dari siswa:</p>
                        <table className="ml-5 border-collapse w-11/12">
                          <tbody>
                            <tr>
                              <td className="w-36 py-1">Nama</td>
                              <td className="w-5 py-1">:</td>
                              <td className="py-1 font-bold">{sp.nama_siswa}</td>
                            </tr>
                            <tr>
                              <td className="py-1">Kelas</td>
                              <td className="py-1">:</td>
                              <td className="py-1 font-bold">{sp.kelas}</td>
                            </tr>
                            <tr>
                              <td className="py-1">Alamat</td>
                              <td className="py-1">:</td>
                              <td className="py-1">{sp.alamat_orang_tua || '-'}</td>
                            </tr>
                          </tbody>
                        </table>

                        <p className="text-justify pt-2">
                          Dengan ini menyatakan anak kami tersebut diatas mengundurkan diri dari <strong>UPT SMP NEGERI 7 PASURUAN</strong> dikarenakan: <strong>{sp.alasan_pengunduran || 'alasan pribadi / keluarga'}</strong>.
                        </p>

                        {sp.peraturan_diketahui && sp.peraturan_diketahui.trim().length > 0 && (
                          <div className="p-3.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 whitespace-pre-wrap leading-relaxed font-sans text-xs sm:text-sm">
                            {sp.peraturan_diketahui}
                          </div>
                        )}

                        <p className="text-justify pt-2">
                          Demikian surat pernyataan ini, kami buat dengan sebenar-benarnya dan hendaknya digunakan sebagaimana mestinya.
                        </p>

                        <div className="pt-8 grid grid-cols-2 text-xs font-serif">
                          <div className="text-left">
                            <p>Mengetahui,</p>
                            <p className="font-bold">Orang tua siswa</p>
                            <SignatureBox recordId={sp.id} role="orang_tua" className="h-20 w-32 mx-auto" />
                            <p className="font-bold underline">( {sp.nama_orang_tua || '....................................'} )</p>
                          </div>

                          <div className="text-right">
                            <p>{sp.tempat_surat || 'Pasuruan'}, {tanggalIndo}</p>
                            <p className="font-bold">Siswa</p>
                            <SignatureBox recordId={sp.id} role="siswa" className="h-20 w-32 mx-auto" />
                            <p className="font-bold underline">( {sp.nama_siswa} )</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                );
              })()
            ) : (
              <div className="p-8 text-center text-slate-500 italic">
                Data Surat Pernyataan tidak ditemukan.
              </div>
            )}
          </div>
        )}

        {/* 14. TABEL REKAP SURAT PERNYATAAN */}
        {docType === 'surat_pernyataan_tabel' && (
          <div className="overflow-x-auto my-4 print:my-0 print:overflow-visible">
            <h3 className="text-center text-base font-bold uppercase mb-4 underline print:mb-2 print:break-after-avoid">
              REKAPITULASI SURAT PERNYATAAN SISWA / ORANG TUA
            </h3>
            <table className="w-full text-left text-xs border-collapse border border-slate-900">
              <thead>
                <tr className="bg-slate-200 text-slate-950 font-bold border-b border-slate-900 text-[10px] uppercase text-center">
                  <th className="p-2 border border-slate-900 w-8">NO</th>
                  <th className="p-2 border border-slate-900 w-28">JENIS SP</th>
                  <th className="p-2 border border-slate-900 w-28">TANGGAL</th>
                  <th className="p-2 border border-slate-900 w-40">SISWA & KELAS</th>
                  <th className="p-2 border border-slate-900 w-40">ORANG TUA / WALI</th>
                  <th className="p-2 border border-slate-900">POIN PERNYATAAN / KOMITMEN</th>
                  <th className="p-2 border border-slate-900 w-24">KETERANGAN</th>
                </tr>
              </thead>
              <tbody>
                {suratPernyataanItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-slate-500 italic border border-slate-900">
                      Belum ada data Surat Pernyataan Siswa.
                    </td>
                  </tr>
                ) : (
                  suratPernyataanItems.map((item, idx) => (
                    <tr key={item.id} className="border-b border-slate-900">
                      <td className="p-2 text-center border border-slate-900 font-semibold">{idx + 1}</td>
                      <td className="p-2 border border-slate-900 font-bold text-center text-amber-900">
                        {item.jenis_sp === 'SP_DAMAI' ? 'SP DAMAI SISWA' : item.jenis_sp}
                      </td>
                      <td className="p-2 border border-slate-900 text-center font-medium">
                        {formatIndoDate(item.tanggal_surat)}
                      </td>
                      <td className="p-2 border border-slate-900">
                        <div className="font-bold">{item.jenis_sp === 'SP_DAMAI' ? `1. ${item.nama_siswa}` : item.nama_siswa}</div>
                        <div className="text-slate-700 font-semibold text-[11px]">Kelas: {item.kelas || '-'}</div>
                      </td>
                      <td className="p-2 border border-slate-900">
                        {item.jenis_sp === 'SP_DAMAI' ? (
                          <>
                            <div className="font-bold text-emerald-950">2. {item.nama_siswa_2 || '-'}</div>
                            <div className="text-emerald-800 font-semibold text-[11px]">Kelas: {item.kelas_2 || '-'}</div>
                          </>
                        ) : (
                          <>
                            <div className="font-medium">{item.nama_orang_tua || '-'}</div>
                            <div className="text-slate-600 text-[10px]">{item.pekerjaan_orang_tua || item.alamat_orang_tua || '-'}</div>
                          </>
                        )}
                      </td>
                      <td className="p-2 border border-slate-900 text-[11px]">
                        {item.jenis_sp === 'SP_DAMAI' && item.hari_tanggal_kejadian && (
                          <div className="font-semibold text-slate-900 mb-1">
                            Kejadian: {item.hari_tanggal_kejadian}
                          </div>
                        )}
                        <div className="whitespace-pre-wrap text-slate-800 font-sans">{item.peraturan_diketahui || '-'}</div>
                        {item.alasan_pengunduran && (
                          <div className="mt-1 text-rose-800 font-semibold">Alasan: {item.alasan_pengunduran}</div>
                        )}
                      </td>
                      <td className="p-2 border border-slate-900 text-center font-medium">
                        {item.keterangan || '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {/* SIGNATURE REKAP SURAT PERNYATAAN */}
            <div className="grid grid-cols-2 text-center pt-8 text-xs gap-4 font-serif print:break-inside-avoid mt-6">
              <div>
                <div>Mengetahui,</div>
                <div className="font-bold">Kepala SMP Negeri 7 Pasuruan</div>
                <SignatureBox recordId="surat_pernyataan_tabel_rekap" role="kepala_sekolah" className="h-20 w-32 mx-auto" />
                <div className="font-bold underline">NUR FADILAH, S.Pd,. M.Pd</div>
                <div>NIP. 19860410 201001 2 030</div>
              </div>
              <div>
                <div>Pasuruan, {todayStr}</div>
                <div className="font-bold">Guru Bimbingan dan Konseling</div>
                <SignatureBox recordId="surat_pernyataan_tabel_rekap" role="guru_bk" className="h-20 w-32 mx-auto" />
                <div className="font-bold underline">{( getActiveGuruBK().nama )?.toString().replace(/S\.PD/g, "S.Pd").replace(/S\.pd/g, "S.Pd")}</div>
                <div>NIP. {getActiveGuruBK().nip}</div>
              </div>
            </div>
          </div>
        )}

        {/* 15. TABEL REKAP KONFERENSI KASUS */}
        {docType === 'konferensi_kasus_tabel' && (
          <div className="overflow-x-auto my-4 font-serif print:my-0 print:overflow-visible">
            <h3 className="text-center text-base font-bold uppercase mb-4 underline print:mb-2 print:break-after-avoid">
              REKAPITULASI DOKUMEN KONFERENSI KASUS SISWA
            </h3>
            <table className="w-full text-left text-[11px] border-collapse border border-slate-900">
              <thead>
                <tr className="bg-slate-200 text-slate-950 font-bold border-b border-slate-900 uppercase text-center">
                  <th className="p-2 border border-slate-900 w-8">NO</th>
                  <th className="p-2 border border-slate-900 w-32">KONSILI / KELAS</th>
                  <th className="p-2 border border-slate-900 w-36">HARI / TGL / WAKTU</th>
                  <th className="p-2 border border-slate-900 w-44">MASALAH / PEMANDU</th>
                  <th className="p-2 border border-slate-900">SIMPULAN & HASIL RAPAT</th>
                  <th className="p-2 border border-slate-900 w-28">JUMLAH HADIR</th>
                  <th className="p-2 border border-slate-900 w-24">KETERANGAN</th>
                </tr>
              </thead>
              <tbody>
                {konferensiKasusItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-slate-500 italic border border-slate-900">
                      Belum ada data Konferensi Kasus Siswa.
                    </td>
                  </tr>
                ) : (
                  konferensiKasusItems.map((item, idx) => {
                    let count = 0;
                    try {
                      if (item.daftar_hadir_rows) {
                        const rows = JSON.parse(item.daftar_hadir_rows);
                        if (Array.isArray(rows)) count = rows.length;
                      }
                    } catch (e) {}
                    return (
                      <tr key={item.id} className="border-b border-slate-900 align-top">
                        <td className="p-2 text-center border border-slate-900 font-semibold">{idx + 1}</td>
                        <td className="p-2 border border-slate-900">
                          <div className="font-bold">{item.nama_konseli}</div>
                          <div className="text-slate-700 text-[10px] mt-0.5">Kelas: {item.kelas_ta || '-'}</div>
                        </td>
                        <td className="p-2 border border-slate-900 text-center font-medium">
                          <div>{item.hari_tgl_jam || '-'}</div>
                          <div className="text-slate-500 text-[9px] mt-1">Surat: {formatIndoDate(item.tanggal_surat)}</div>
                        </td>
                        <td className="p-2 border border-slate-900">
                          <div className="font-bold text-rose-900">{item.jenis_masalah}</div>
                          <div className="text-slate-600 text-[10px] mt-1">Pemandu: {item.pemandu_nama || '-'} ({item.pemandu_jabatan || '-'})</div>
                        </td>
                        <td className="p-2 border border-slate-900 text-[10px]">
                          <div className="font-semibold text-slate-800">Simpulan:</div>
                          <p className="line-clamp-2 italic mb-1 text-slate-700">"{item.data_diperoleh_simpulan || '-'}"</p>
                          <div className="font-semibold text-slate-800 mt-1">Hasil Rapat:</div>
                          <p className="line-clamp-2 font-sans text-slate-600">{item.rapat_hasil_pertemuan || '-'}</p>
                        </td>
                        <td className="p-2 border border-slate-900 text-center font-medium">
                          <div>{count || item.rapat_jumlah_hadir || '0'} orang</div>
                          <div className="text-[9px] text-slate-500 line-clamp-1 mt-1">{item.daftar_hadir_peserta_singkat || '-'}</div>
                        </td>
                        <td className="p-2 border border-slate-900 text-center font-semibold">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] border inline-block ${
                            item.keterpenuhan_kebutuhan_data === 'terpenuhi' 
                              ? 'bg-green-50 text-green-800 border-green-200' 
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}>
                            {item.keterpenuhan_kebutuhan_data === 'terpenuhi' ? 'Terpenuhi' : 'Belum Terpenuhi'}
                          </span>
                          <div className="text-[9px] text-slate-500 font-normal mt-1">{item.keterangan || '-'}</div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {/* SIGNATURE REKAP KONFERENSI KASUS */}
            <div className="grid grid-cols-2 text-center pt-8 text-xs gap-4 font-serif print:break-inside-avoid mt-6">
              <div>
                <div>Mengetahui,</div>
                <div className="font-bold">Kepala SMP Negeri 7 Pasuruan</div>
                <SignatureBox recordId="konferensi_kasus_tabel_rekap" role="kepala_sekolah" className="h-20 w-32 mx-auto" />
                <div className="font-bold underline">NUR FADILAH, S.Pd,. M.Pd</div>
                <div>NIP. 19860410 201001 2 030</div>
              </div>
              <div>
                <div>Pasuruan, {todayStr}</div>
                <div className="font-bold">Guru Bimbingan dan Konseling</div>
                <SignatureBox recordId="konferensi_kasus_tabel_rekap" role="guru_bk" className="h-20 w-32 mx-auto" />
                <div className="font-bold underline">{( getActiveGuruBK().nama )?.toString().replace(/S\.PD/g, "S.Pd").replace(/S\.pd/g, "S.Pd")}</div>
                <div>NIP. {getActiveGuruBK().nip}</div>
              </div>
            </div>
          </div>
        )}

        {/* 16. NOTULA KONFERENSI KASUS */}
        {docType === 'konferensi_kasus_notula' && currentKonferensiKasus && (
          <div className="space-y-4 text-sm leading-relaxed text-slate-950 font-serif">
            <div className="text-center my-3">
              <h2 className="text-base font-extrabold uppercase tracking-wide underline">
                NOTULA KONFERENSI KASUS SISWA
              </h2>
              <p className="text-xs font-bold uppercase mt-1">
                BIMBINGAN DAN KONSELING UPT SMP NEGERI 7 PASURUAN
              </p>
            </div>

            <table className="w-full border-collapse border border-black text-xs font-serif leading-relaxed my-4">
              <tbody>
                <tr className="border-b border-black">
                  <td className="p-2.5 border-r border-black font-bold text-center w-8">1</td>
                  <td className="p-2.5 border-r border-black font-bold w-56 sm:w-64">Nama Konseli / Siswa</td>
                  <td className="p-2.5 font-bold uppercase">{currentKonferensiKasus.nama_konseli}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-2.5 border-r border-black font-bold text-center">2</td>
                  <td className="p-2.5 border-r border-black font-bold">Kelas / Tahun Ajaran</td>
                  <td className="p-2.5 font-semibold">{currentKonferensiKasus.kelas_ta || '-'}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-2.5 border-r border-black font-bold text-center">3</td>
                  <td className="p-2.5 border-r border-black font-bold">Jenis Permasalahan</td>
                  <td className="p-2.5 font-bold text-rose-900">{currentKonferensiKasus.jenis_masalah}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-2.5 border-r border-black font-bold text-center">4</td>
                  <td className="p-2.5 border-r border-black font-bold">Hari / Tanggal / Jam Pelaksanaan</td>
                  <td className="p-2.5">{currentKonferensiKasus.hari_tgl_jam || '-'}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-2.5 border-r border-black font-bold text-center">5</td>
                  <td className="p-2.5 border-r border-black font-bold">Pemandu Konferensi Kasus</td>
                  <td className="p-2.5 font-semibold">
                    {currentKonferensiKasus.pemandu_nama || '-'} ({currentKonferensiKasus.pemandu_jabatan || '-'})
                  </td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-2.5 border-r border-black font-bold text-center">6</td>
                  <td className="p-2.5 border-r border-black font-bold">Data yang Ingin Diperoleh</td>
                  <td className="p-2.5 whitespace-pre-wrap leading-relaxed">{currentKonferensiKasus.data_ingin_diperoleh || '-'}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-2.5 border-r border-black font-bold text-center">7</td>
                  <td className="p-2.5 border-r border-black font-bold">Uraian Singkat Kegiatan Inti</td>
                  <td className="p-2.5 whitespace-pre-wrap leading-relaxed">{currentKonferensiKasus.uraian_kegiatan_inti || '-'}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-2.5 border-r border-black font-bold text-center">8</td>
                  <td className="p-2.5 border-r border-black font-bold">Kesimpulan / Data yang Diperoleh</td>
                  <td className="p-2.5 whitespace-pre-wrap leading-relaxed italic">{currentKonferensiKasus.data_diperoleh_simpulan || '-'}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-2.5 border-r border-black font-bold text-center">9</td>
                  <td className="p-2.5 border-r border-black font-bold">Keterpenuhan Kebutuhan Data</td>
                  <td className="p-2.5">
                    <span className="font-bold uppercase">
                      {currentKonferensiKasus.keterpenuhan_kebutuhan_data === 'terpenuhi' ? 'Terpenuhi' : 'Belum Terpenuhi'}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="p-2.5 border-r border-black font-bold text-center">10</td>
                  <td className="p-2.5 border-r border-black font-bold">Rujukan Pelayanan Lanjutan</td>
                  <td className="p-2.5 font-semibold">{currentKonferensiKasus.rujukan_pelayanan || '-'}</td>
                </tr>
              </tbody>
            </table>

            {/* Signatures */}
            <div className="grid grid-cols-2 text-center pt-8 text-xs gap-4 font-serif">
              <div>
                <div>Mengetahui,</div>
                <div>Kepala Sekolah</div>
                <SignatureBox recordId={currentKonferensiKasus.id} role="kepala_sekolah" className="h-20 w-32 mx-auto" />
                <div className="font-bold underline">
                  {formatKepalaSekolah(currentKonferensiKasus.nama_kepala_sekolah)}
                </div>
                <div>NIP. {currentKonferensiKasus.nip_kepala_sekolah || '19860410 201001 2 030'}</div>
              </div>
              <div>
                <div>{currentKonferensiKasus.tempat_surat || 'Pasuruan'}, {formatIndoDate(currentKonferensiKasus.tanggal_surat)}</div>
                <div>Notulis / Guru BK</div>
                <SignatureBox recordId={currentKonferensiKasus.id} role="guru_bk" className="h-20 w-32 mx-auto" />
                <div className="font-bold underline">
                  {( ( currentKonferensiKasus.nama_guru_bk || getActiveGuruBK().nama )?.toString().replace(/S\.PD/g, "S.Pd").replace(/S\.pd/g, "S.Pd") )?.toString().replace(/S\.PD/g, "S.Pd").replace(/S\.pd/g, "S.Pd")}
                </div>
                <div>NIP. {currentKonferensiKasus.nip_guru_bk || getActiveGuruBK().nip}</div>
              </div>
            </div>
          </div>
        )}

        {/* 17. NOTULEN RAPAT KONFERENSI KASUS */}
        {docType === 'konferensi_kasus_notulen_rapat' && currentKonferensiKasus && (
          <div className="space-y-4 text-sm leading-relaxed text-slate-950 font-serif">
            <div className="text-center my-3">
              <h2 className="text-base font-extrabold uppercase tracking-wide underline">
                NOTULEN RAPAT / PERTEMUAN KONFERENSI KASUS
              </h2>
              <p className="text-xs font-bold uppercase mt-1">
                {currentKonferensiKasus.rapat_nama_sekolah || 'UPT SMP NEGERI 7 PASURUAN'}
              </p>
              <p className="text-[11px] font-medium mt-0.5 italic text-slate-700">
                {currentKonferensiKasus.rapat_alamat || 'Jl. Simpang Slamet Riadi No.2 Sebani Gadingrejo'}
              </p>
            </div>

            <div className="border-t border-black my-2 pt-2" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-serif leading-relaxed mb-4">
              <div>
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td className="w-32 font-bold py-1">Sidang / Rapat</td>
                      <td className="w-4 py-1">:</td>
                      <td className="py-1">Rapat Koordinasi Konferensi Kasus Siswa</td>
                    </tr>
                    <tr>
                      <td className="font-bold py-1">Hari / Tanggal</td>
                      <td className="py-1">:</td>
                      <td className="py-1">{currentKonferensiKasus.hari_tgl_jam || '-'}</td>
                    </tr>
                    <tr>
                      <td className="font-bold py-1">Tempat</td>
                      <td className="py-1">:</td>
                      <td className="py-1">{currentKonferensiKasus.rapat_tempat || '-'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td className="w-32 font-bold py-1">Ketua Sidang</td>
                      <td className="w-4 py-1">:</td>
                      <td className="py-1">{currentKonferensiKasus.rapat_ketua || 'Konselor'}</td>
                    </tr>
                    <tr>
                      <td className="font-bold py-1">Waktu Pelaksanaan</td>
                      <td className="py-1">:</td>
                      <td className="py-1">{currentKonferensiKasus.rapat_dimulai_pukul || '10.30'} s/d {currentKonferensiKasus.rapat_diakhiri_pukul || '11.00'}</td>
                    </tr>
                    <tr>
                      <td className="font-bold py-1">Jumlah Hadir</td>
                      <td className="py-1">:</td>
                      <td className="py-1 font-semibold">{currentKonferensiKasus.rapat_jumlah_hadir || '-'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-2 border border-black p-4 rounded-lg bg-slate-50/20 text-xs">
              <h4 className="font-bold uppercase tracking-wide border-b border-black pb-1 mb-2">HASIL RAPAT / PERTEMUAN:</h4>
              <div className="whitespace-pre-wrap leading-relaxed font-sans text-slate-900 text-sm pl-2">
                {currentKonferensiKasus.rapat_hasil_pertemuan || 'Tidak ada uraian hasil pertemuan.'}
              </div>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-2 text-center pt-8 text-xs gap-4 font-serif">
              <div>
                {/* Left signature removed as per user attachment template (redundant duplication) */}
              </div>
              <div>
                <div>{currentKonferensiKasus.tempat_surat || 'Pasuruan'}, {formatIndoDate(currentKonferensiKasus.tanggal_surat)}</div>
                <div>Notulis Rapat</div>
                <SignatureBox recordId={currentKonferensiKasus.id} role="guru_bk" className="h-20 w-32 mx-auto" />
                <div className="font-bold underline">
                  {( ( currentKonferensiKasus.nama_guru_bk || getActiveGuruBK().nama )?.toString().replace(/S\.PD/g, "S.Pd").replace(/S\.pd/g, "S.Pd") )?.toString().replace(/S\.PD/g, "S.Pd").replace(/S\.pd/g, "S.Pd")}
                </div>
                <div>NIP. {currentKonferensiKasus.nip_guru_bk || getActiveGuruBK().nip}</div>
              </div>
            </div>
          </div>
        )}

        {/* 18. DAFTAR HADIR KONFERENSI KASUS */}
        {docType === 'konferensi_kasus_daftar_hadir' && currentKonferensiKasus && (
          <div className="space-y-4 text-sm leading-relaxed text-slate-950 font-serif">
            <div className="text-center my-3">
              <h2 className="text-base font-extrabold uppercase tracking-wide underline">
                DAFTAR HADIR PESERTA KONFERENSI KASUS
              </h2>
              <p className="text-xs font-bold uppercase mt-1">
                BIMBINGAN DAN KONSELING UPT SMP NEGERI 7 PASURUAN
              </p>
              <div className="mt-3 text-xs text-slate-800 space-y-1 text-left border border-slate-300 p-3 rounded-lg bg-slate-50/10">
                <p>Hari / Tanggal / Jam: <span className="font-semibold text-slate-900">{currentKonferensiKasus.hari_tgl_jam || '-'}</span></p>
                <p>Nama Konseli: <span className="font-semibold text-slate-900 uppercase">{currentKonferensiKasus.nama_konseli}</span> &nbsp;|&nbsp; Kelas: <span className="font-semibold text-slate-900">{currentKonferensiKasus.kelas_ta || '-'}</span></p>
                <p>Kasus: <span className="font-semibold italic text-rose-950">"{currentKonferensiKasus.jenis_masalah}"</span></p>
              </div>
            </div>

            <table className="w-full border-collapse border border-black text-xs font-serif leading-relaxed my-4 text-left">
              <thead>
                <tr className="bg-slate-100 border-b border-black text-center font-bold">
                  <th className="p-2 border border-black w-10">No</th>
                  <th className="p-2 border border-black">Nama Lengkap</th>
                  <th className="p-2 border border-black w-40">Jabatan / Peran</th>
                  <th className="p-2 border border-black w-16 text-center">Kelas</th>
                  <th className="p-2 border border-black">Instansi / Asal Sekolah</th>
                  <th className="p-2 border border-black w-32 text-center">Tanda Tangan</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  let parsedRows: DaftarHadirRow[] = [];
                  try {
                    if (currentKonferensiKasus.daftar_hadir_rows) {
                      parsedRows = JSON.parse(currentKonferensiKasus.daftar_hadir_rows);
                    }
                  } catch (e) {}

                  if (!Array.isArray(parsedRows) || parsedRows.length === 0) {
                    return (
                      <tr>
                        <td colSpan={6} className="p-4 text-center italic text-slate-500 border border-black">
                          Belum ada data peserta rapat.
                        </td>
                      </tr>
                    );
                  }

                  return parsedRows.map((row, index) => (
                    <tr key={index} className="border-b border-black">
                      <td className="p-2 border border-black text-center font-bold">{row.no || (index + 1)}</td>
                      <td className="p-2 border border-black font-semibold uppercase">{row.nama || '-'}</td>
                      <td className="p-2 border border-black">{row.jabatan || '-'}</td>
                      <td className="p-2 border border-black text-center">{row.kelas || '-'}</td>
                      <td className="p-2 border border-black">{row.asal_sekolah || '-'}</td>
                      <td className="p-2 border border-black font-semibold text-center italic text-green-900 bg-emerald-50/10">
                        {row.ttd === 'Ada' ? `${index + 1}. .........` : '-'}
                      </td>
                    </tr>
                  ));
                })()}
              </tbody>
            </table>

            {/* Signatures */}
            <div className="grid grid-cols-2 text-center pt-8 text-xs gap-4 font-serif">
              <div>
                <div>Mengetahui,</div>
                <div>Kepala Sekolah</div>
                <SignatureBox recordId={currentKonferensiKasus.id} role="kepala_sekolah" className="h-20 w-32 mx-auto" />
                <div className="font-bold underline">
                  {formatKepalaSekolah(currentKonferensiKasus.nama_kepala_sekolah)}
                </div>
                <div>NIP. {currentKonferensiKasus.nip_kepala_sekolah || '19860410 201001 2 030'}</div>
              </div>
              <div>
                <div>{currentKonferensiKasus.tempat_surat || 'Pasuruan'}, {formatIndoDate(currentKonferensiKasus.tanggal_surat)}</div>
                <div>Guru BK / Notulis</div>
                <SignatureBox recordId={currentKonferensiKasus.id} role="guru_bk" className="h-20 w-32 mx-auto" />
                <div className="font-bold underline">
                  {( ( currentKonferensiKasus.nama_guru_bk || getActiveGuruBK().nama )?.toString().replace(/S\.PD/g, "S.Pd").replace(/S\.pd/g, "S.Pd") )?.toString().replace(/S\.PD/g, "S.Pd").replace(/S\.pd/g, "S.Pd")}
                </div>
                <div>NIP. {currentKonferensiKasus.nip_guru_bk || getActiveGuruBK().nip}</div>
              </div>
            </div>
          </div>
        )}

        {/* 19. GABUNGAN SELURUH DOKUMEN KONFERENSI KASUS */}
        {docType === 'konferensi_kasus_gabungan' && currentKonferensiKasus && (
          <div className="space-y-12 font-serif text-sm">
            {/* Halaman 1: Notula */}
            <div className="print:break-after-page border-b-2 border-dashed border-slate-300 pb-10 print:border-none print:pb-0">
              <div className="text-center my-3">
                <h2 className="text-base font-extrabold uppercase tracking-wide underline">
                  NOTULA KONFERENSI KASUS SISWA
                </h2>
                <p className="text-xs font-bold uppercase mt-1">
                  BIMBINGAN DAN KONSELING UPT SMP NEGERI 7 PASURUAN
                </p>
              </div>

              <table className="w-full border-collapse border border-black text-xs font-serif leading-relaxed my-4 text-left">
                <tbody>
                  <tr className="border-b border-black">
                    <td className="p-2.5 border-r border-black font-bold text-center w-8">1</td>
                    <td className="p-2.5 border-r border-black font-bold w-56 sm:w-64">Nama Konseli / Siswa</td>
                    <td className="p-2.5 font-bold uppercase">{currentKonferensiKasus.nama_konseli}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-2.5 border-r border-black font-bold text-center">2</td>
                    <td className="p-2.5 border-r border-black font-bold">Kelas / Tahun Ajaran</td>
                    <td className="p-2.5 font-semibold">{currentKonferensiKasus.kelas_ta || '-'}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-2.5 border-r border-black font-bold text-center">3</td>
                    <td className="p-2.5 border-r border-black font-bold">Jenis Permasalahan</td>
                    <td className="p-2.5 font-bold text-rose-900">{currentKonferensiKasus.jenis_masalah}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-2.5 border-r border-black font-bold text-center">4</td>
                    <td className="p-2.5 border-r border-black font-bold">Hari / Tanggal / Jam Pelaksanaan</td>
                    <td className="p-2.5">{currentKonferensiKasus.hari_tgl_jam || '-'}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-2.5 border-r border-black font-bold text-center">5</td>
                    <td className="p-2.5 border-r border-black font-bold">Pemandu Konferensi Kasus</td>
                    <td className="p-2.5 font-semibold">
                      {currentKonferensiKasus.pemandu_nama || '-'} ({currentKonferensiKasus.pemandu_jabatan || '-'})
                    </td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-2.5 border-r border-black font-bold text-center">6</td>
                    <td className="p-2.5 border-r border-black font-bold">Data yang Ingin Diperoleh</td>
                    <td className="p-2.5 whitespace-pre-wrap leading-relaxed">{currentKonferensiKasus.data_ingin_diperoleh || '-'}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-2.5 border-r border-black font-bold text-center">7</td>
                    <td className="p-2.5 border-r border-black font-bold">Uraian Singkat Kegiatan Inti</td>
                    <td className="p-2.5 whitespace-pre-wrap leading-relaxed">{currentKonferensiKasus.uraian_kegiatan_inti || '-'}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-2.5 border-r border-black font-bold text-center">8</td>
                    <td className="p-2.5 border-r border-black font-bold">Kesimpulan / Data yang Diperoleh</td>
                    <td className="p-2.5 whitespace-pre-wrap leading-relaxed italic">{currentKonferensiKasus.data_diperoleh_simpulan || '-'}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-2.5 border-r border-black font-bold text-center">9</td>
                    <td className="p-2.5 border-r border-black font-bold">Keterpenuhan Kebutuhan Data</td>
                    <td className="p-2.5">
                      <span className="font-bold uppercase">
                        {currentKonferensiKasus.keterpenuhan_kebutuhan_data === 'terpenuhi' ? 'Terpenuhi' : 'Belum Terpenuhi'}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 border-r border-black font-bold text-center">10</td>
                    <td className="p-2.5 border-r border-black font-bold">Rujukan Pelayanan Lanjutan</td>
                    <td className="p-2.5 font-semibold">{currentKonferensiKasus.rujukan_pelayanan || '-'}</td>
                  </tr>
                </tbody>
              </table>

              {/* Signatures 1 */}
              <div className="grid grid-cols-2 text-center pt-6 text-xs gap-4 font-serif">
                <div>
                  <div>Mengetahui,</div>
                  <div>Kepala Sekolah</div>
                <SignatureBox recordId={currentKonferensiKasus.id} role="kepala_sekolah" className="h-20 w-32 mx-auto" />
                <div className="font-bold underline">
                  {formatKepalaSekolah(currentKonferensiKasus.nama_kepala_sekolah)}
                  </div>
                  <div>NIP. {currentKonferensiKasus.nip_kepala_sekolah || '19860410 201001 2 030'}</div>
                </div>
                <div>
                  <div>{currentKonferensiKasus.tempat_surat || 'Pasuruan'}, {formatIndoDate(currentKonferensiKasus.tanggal_surat)}</div>
                  <div>Notulis / Guru BK</div>
                <SignatureBox recordId={currentKonferensiKasus.id} role="guru_bk" className="h-20 w-32 mx-auto" />
                  <div className="font-bold underline">
                    {( ( currentKonferensiKasus.nama_guru_bk || getActiveGuruBK().nama )?.toString().replace(/S\.PD/g, "S.Pd").replace(/S\.pd/g, "S.Pd") )?.toString().replace(/S\.PD/g, "S.Pd").replace(/S\.pd/g, "S.Pd")}
                  </div>
                  <div>NIP. {currentKonferensiKasus.nip_guru_bk || getActiveGuruBK().nip}</div>
                </div>
              </div>
            </div>

            {/* Halaman 2: Notulen Rapat */}
            <div className="print:break-after-page border-b-2 border-dashed border-slate-300 pb-10 print:border-none print:pb-0 pt-10 print:pt-0">
              <div className="text-center my-3">
                <h2 className="text-base font-extrabold uppercase tracking-wide underline">
                  NOTULEN RAPAT / PERTEMUAN KONFERENSI KASUS
                </h2>
                <p className="text-xs font-bold uppercase mt-1">
                  {currentKonferensiKasus.rapat_nama_sekolah || 'UPT SMP NEGERI 7 PASURUAN'}
                </p>
                <p className="text-[11px] font-medium mt-0.5 italic text-slate-700">
                  {currentKonferensiKasus.rapat_alamat || 'Jl. Simpang Slamet Riadi No.2 Sebani Gadingrejo'}
                </p>
              </div>

              <div className="border-t border-black my-2 pt-2" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-serif leading-relaxed mb-4 text-left">
                <div>
                  <table className="w-full">
                    <tbody>
                      <tr>
                        <td className="w-32 font-bold py-1">Sidang / Rapat</td>
                        <td className="w-4 py-1">:</td>
                        <td className="py-1">Rapat Koordinasi Konferensi Kasus Siswa</td>
                      </tr>
                      <tr>
                        <td className="font-bold py-1">Hari / Tanggal</td>
                        <td className="py-1">:</td>
                        <td className="py-1">{currentKonferensiKasus.hari_tgl_jam || '-'}</td>
                      </tr>
                      <tr>
                        <td className="font-bold py-1">Tempat</td>
                        <td className="py-1">:</td>
                        <td className="py-1">{currentKonferensiKasus.rapat_tempat || '-'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <table className="w-full">
                    <tbody>
                      <tr>
                        <td className="w-32 font-bold py-1">Ketua Sidang</td>
                        <td className="w-4 py-1">:</td>
                        <td className="py-1">{currentKonferensiKasus.rapat_ketua || 'Konselor'}</td>
                      </tr>
                      <tr>
                        <td className="font-bold py-1">Waktu Pelaksanaan</td>
                        <td className="py-1">:</td>
                        <td className="py-1">{currentKonferensiKasus.rapat_dimulai_pukul || '10.30'} s/d {currentKonferensiKasus.rapat_diakhiri_pukul || '11.00'}</td>
                      </tr>
                      <tr>
                        <td className="font-bold py-1">Jumlah Hadir</td>
                        <td className="py-1">:</td>
                        <td className="py-1 font-semibold">{currentKonferensiKasus.rapat_jumlah_hadir || '-'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-2 border border-black p-4 rounded-lg bg-slate-50/20 text-xs text-left">
                <h4 className="font-bold uppercase tracking-wide border-b border-black pb-1 mb-2">HASIL RAPAT / PERTEMUAN:</h4>
                <div className="whitespace-pre-wrap leading-relaxed font-sans text-slate-900 text-sm pl-2">
                  {currentKonferensiKasus.rapat_hasil_pertemuan || 'Tidak ada uraian hasil pertemuan.'}
                </div>
              </div>

              {/* Signatures 2 */}
              <div className="grid grid-cols-2 text-center pt-8 text-xs gap-4 font-serif">
                <div>
                  {/* Left signature removed as per user attachment template (redundant duplication) */}
                </div>
                <div>
                  <div>{currentKonferensiKasus.tempat_surat || 'Pasuruan'}, {formatIndoDate(currentKonferensiKasus.tanggal_surat)}</div>
                  <div>Notulis Rapat</div>
                <SignatureBox recordId={currentKonferensiKasus.id} role="guru_bk" className="h-20 w-32 mx-auto" />
                  <div className="font-bold underline">
                    {( ( currentKonferensiKasus.nama_guru_bk || getActiveGuruBK().nama )?.toString().replace(/S\.PD/g, "S.Pd").replace(/S\.pd/g, "S.Pd") )?.toString().replace(/S\.PD/g, "S.Pd").replace(/S\.pd/g, "S.Pd")}
                  </div>
                  <div>NIP. {currentKonferensiKasus.nip_guru_bk || getActiveGuruBK().nip}</div>
                </div>
              </div>
            </div>

            {/* Halaman 3: Daftar Hadir */}
            <div className="pt-10 print:pt-0">
              <div className="text-center my-3">
                <h2 className="text-base font-extrabold uppercase tracking-wide underline">
                  DAFTAR HADIR PESERTA KONFERENSI KASUS
                </h2>
                <p className="text-xs font-bold uppercase mt-1">
                  BIMBINGAN DAN KONSELING UPT SMP NEGERI 7 PASURUAN
                </p>
                <div className="mt-3 text-xs text-slate-800 space-y-1 text-left border border-slate-300 p-3 rounded-lg bg-slate-50/10">
                  <p>Hari / Tanggal / Jam: <span className="font-semibold text-slate-900">{currentKonferensiKasus.hari_tgl_jam || '-'}</span></p>
                  <p>Nama Konseli: <span className="font-semibold text-slate-900 uppercase">{currentKonferensiKasus.nama_konseli}</span> &nbsp;|&nbsp; Kelas: <span className="font-semibold text-slate-900">{currentKonferensiKasus.kelas_ta || '-'}</span></p>
                  <p>Kasus: <span className="font-semibold italic text-rose-950">"{currentKonferensiKasus.jenis_masalah}"</span></p>
                </div>
              </div>

              <table className="w-full border-collapse border border-black text-xs font-serif leading-relaxed my-4 text-left">
                <thead>
                  <tr className="bg-slate-100 border-b border-black text-center font-bold">
                    <th className="p-2 border border-black w-10">No</th>
                    <th className="p-2 border border-black">Nama Lengkap</th>
                    <th className="p-2 border border-black w-40">Jabatan / Peran</th>
                    <th className="p-2 border border-black w-16 text-center">Kelas</th>
                    <th className="p-2 border border-black">Instansi / Asal Sekolah</th>
                    <th className="p-2 border border-black w-32 text-center">Tanda Tangan</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    let parsedRows: DaftarHadirRow[] = [];
                    try {
                      if (currentKonferensiKasus.daftar_hadir_rows) {
                        parsedRows = JSON.parse(currentKonferensiKasus.daftar_hadir_rows);
                      }
                    } catch (e) {}

                    if (!Array.isArray(parsedRows) || parsedRows.length === 0) {
                      return (
                        <tr>
                          <td colSpan={6} className="p-4 text-center italic text-slate-500 border border-black">
                            Belum ada data peserta rapat.
                          </td>
                        </tr>
                      );
                    }

                    return parsedRows.map((row, index) => (
                      <tr key={index} className="border-b border-black">
                        <td className="p-2 border border-black text-center font-bold">{row.no || (index + 1)}</td>
                        <td className="p-2 border border-black font-semibold uppercase">{row.nama || '-'}</td>
                        <td className="p-2 border border-black">{row.jabatan || '-'}</td>
                        <td className="p-2 border border-black text-center">{row.kelas || '-'}</td>
                        <td className="p-2 border border-black">{row.asal_sekolah || '-'}</td>
                        <td className="p-2 border border-black font-semibold text-center italic text-green-900 bg-emerald-50/10">
                          {row.ttd === 'Ada' ? `${index + 1}. .........` : '-'}
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>

              {/* Signatures 3 */}
              <div className="grid grid-cols-2 text-center pt-8 text-xs gap-4 font-serif">
                <div>
                  <div>Mengetahui,</div>
                  <div>Kepala Sekolah</div>
                <SignatureBox recordId={currentKonferensiKasus.id} role="kepala_sekolah" className="h-20 w-32 mx-auto" />
                <div className="font-bold underline">
                  {formatKepalaSekolah(currentKonferensiKasus.nama_kepala_sekolah)}
                </div>
                  <div>NIP. {currentKonferensiKasus.nip_kepala_sekolah || '19860410 201001 2 030'}</div>
                </div>
                <div>
                  <div>{currentKonferensiKasus.tempat_surat || 'Pasuruan'}, {formatIndoDate(currentKonferensiKasus.tanggal_surat)}</div>
                  <div>Guru BK / Notulis</div>
                <SignatureBox recordId={currentKonferensiKasus.id} role="guru_bk" className="h-20 w-32 mx-auto" />
                  <div className="font-bold underline">
                    {( ( currentKonferensiKasus.nama_guru_bk || getActiveGuruBK().nama )?.toString().replace(/S\.PD/g, "S.Pd").replace(/S\.pd/g, "S.Pd") )?.toString().replace(/S\.PD/g, "S.Pd").replace(/S\.pd/g, "S.Pd")}
                  </div>
                  <div>NIP. {currentKonferensiKasus.nip_guru_bk || getActiveGuruBK().nip}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* JURNAL BK DOKUMEN CETAK */}
        {docType === 'jurnal_bk_dokumen' && currentJurnalBK && (
          <div className="space-y-6">
            <div className="text-center my-3">
              <h2 className="text-base font-extrabold uppercase tracking-wide underline">
                JURNAL LAYANAN BIMBINGAN DAN KONSELING
              </h2>
              <p className="text-xs font-bold uppercase mt-1">
                UPT SMP NEGERI 7 PASURUAN
              </p>
            </div>

            <table className="w-full border-collapse border border-black text-xs font-serif leading-relaxed text-left">
              <tbody>
                <tr className="border-b border-black">
                  <td className="p-2.5 border border-black font-bold w-1/3 bg-slate-50">Hari / Tanggal / Jam</td>
                  <td className="p-2.5 border border-black">{currentJurnalBK.hari}, {formatIndoDate(currentJurnalBK.tanggal)} ({currentJurnalBK.jam_ke || '-'})</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-2.5 border border-black font-bold bg-slate-50">Kelas / Sasaran Peserta</td>
                  <td className="p-2.5 border border-black">{currentJurnalBK.kelas || '-'} ({currentJurnalBK.sasaran_peserta || '-'})</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-2.5 border border-black font-bold bg-slate-50">Materi Layanan BK</td>
                  <td className="p-2.5 border border-black font-bold">{currentJurnalBK.materi_layanan}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-2.5 border border-black font-bold bg-slate-50">Bidang Layanan BK</td>
                  <td className="p-2.5 border border-black">{currentJurnalBK.bidang_layanan}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-2.5 border border-black font-bold bg-slate-50">Jenis Layanan / Kegiatan</td>
                  <td className="p-2.5 border border-black">{currentJurnalBK.jenis_layanan}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-2.5 border border-black font-bold bg-slate-50">Fungsi Layanan BK</td>
                  <td className="p-2.5 border border-black">{currentJurnalBK.fungsi_layanan}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-2.5 border border-black font-bold bg-slate-50">Hasil yang Dicapai (BMB3)</td>
                  <td className="p-2.5 border border-black">{currentJurnalBK.hasil_layanan_bmb3 || '-'}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-2.5 border border-black font-bold bg-slate-50">Keterangan / Dokumentasi</td>
                  <td className="p-2.5 border border-black">
                    <div>{currentJurnalBK.keterangan || '-'}</div>
                    {currentJurnalBK.link_foto_kegiatan && (
                      <div className="mt-2">
                        <img
                          src={currentJurnalBK.link_foto_kegiatan}
                          alt="Dokumentasi Jurnal BK"
                          className="max-h-40 max-w-xs object-contain rounded border border-slate-300 print:max-h-32"
                          onError={(e) => {
                            const target = e.target as HTMLElement;
                            target.style.display = 'none';
                          }}
                        />
                        {currentJurnalBK.link_foto_kegiatan.startsWith('http') && (
                          <a href={currentJurnalBK.link_foto_kegiatan} target="_blank" rel="noreferrer" className="text-blue-700 underline text-xs block mt-1 print:hidden">
                            {currentJurnalBK.link_foto_kegiatan}
                          </a>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="text-xs font-bold uppercase mt-4 mb-2">
              Siswa / Konseli Yang Tidak Mengikuti Layanan BK:
            </div>
            <table className="w-full border-collapse border border-black text-xs font-serif leading-relaxed text-left">
              <thead>
                <tr className="bg-slate-100 border-b border-black text-center font-bold">
                  <th className="p-2 border border-black w-10">No</th>
                  <th className="p-2 border border-black">Nama Siswa</th>
                  <th className="p-2 border border-black">Alasan</th>
                  <th className="p-2 border border-black">Tindak Lanjut</th>
                </tr>
              </thead>
              <tbody>
                {currentJurnalBK.siswa_tidak_mengikuti && currentJurnalBK.siswa_tidak_mengikuti.length > 0 ? (
                  currentJurnalBK.siswa_tidak_mengikuti.map((absen, aIdx) => (
                    <tr key={aIdx} className="border-b border-black">
                      <td className="p-2 border border-black text-center font-bold">{aIdx + 1}</td>
                      <td className="p-2 border border-black font-semibold uppercase">{absen.nama_siswa}</td>
                      <td className="p-2 border border-black text-rose-900">{absen.alasan}</td>
                      <td className="p-2 border border-black">{absen.tindak_lanjut}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-3 text-center italic text-slate-600 border border-black">
                      Nihil (Seluruh konseli/siswa mengikuti layanan dengan lengkap).
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Signatures with Digital Signature Box */}
            <div className="grid grid-cols-2 text-center pt-8 text-xs gap-4 font-serif">
              <div>
                <div>Mengetahui,</div>
                <div>Kepala SMP Negeri 7 Pasuruan</div>
                <SignatureBox recordId={currentJurnalBK.id} role="kepala_sekolah" className="h-20 w-32 mx-auto" />
                <div className="font-bold underline">
                  {formatKepalaSekolah(currentJurnalBK.nama_kepala_sekolah)}
                </div>
                <div>NIP. {currentJurnalBK.nip_kepala_sekolah || '19860410 201001 2 030'}</div>
              </div>
              <div>
                <div>{currentJurnalBK.tempat_surat || 'Pasuruan'}, {formatIndoDate(currentJurnalBK.tanggal_surat || currentJurnalBK.tanggal)}</div>
                <div>Guru Bimbingan dan Konseling</div>
                <SignatureBox recordId={currentJurnalBK.id} role="guru_bk" className="h-20 w-32 mx-auto" />
                <div className="font-bold underline">
                  {( ( currentJurnalBK.nama_guru_bk || getActiveGuruBK().nama )?.toString().replace(/S\.PD/g, "S.Pd").replace(/S\.pd/g, "S.Pd") )?.toString().replace(/S\.PD/g, "S.Pd").replace(/S\.pd/g, "S.Pd")}
                </div>
                <div>NIP. {currentJurnalBK.nip_guru_bk || getActiveGuruBK().nip}</div>
              </div>
            </div>
          </div>
        )}

        {/* JURNAL BK TABEL REKAPITULASI CETAK */}
        {docType === 'jurnal_bk_tabel' && (
          <div className="space-y-6">
            <div className="text-center my-3">
              <h2 className="text-base font-extrabold uppercase tracking-wide underline">
                REKAPITULASI JURNAL LAYANAN BIMBINGAN DAN KONSELING
              </h2>
              <p className="text-xs font-bold uppercase mt-1">
                UPT SMP NEGERI 7 PASURUAN
              </p>
            </div>

            <table className="w-full border-collapse border border-black text-xs font-serif leading-relaxed text-left">
              <thead>
                <tr className="bg-slate-100 border-b border-black text-center font-bold">
                  <th className="p-2 border border-black w-8">No</th>
                  <th className="p-2 border border-black w-24">Hari, Tgl & Jam</th>
                  <th className="p-2 border border-black w-16">Kelas</th>
                  <th className="p-2 border border-black">Materi Layanan BK</th>
                  <th className="p-2 border border-black">Bidang & Jenis</th>
                  <th className="p-2 border border-black">Fungsi Layanan</th>
                  <th className="p-2 border border-black">Hasil BMB3</th>
                  <th className="p-2 border border-black w-20">Siswa Absen</th>
                </tr>
              </thead>
              <tbody>
                {jurnalBKItems.length > 0 ? (
                  jurnalBKItems.map((j, idx) => (
                    <tr key={j.id || idx} className="border-b border-black">
                      <td className="p-2 border border-black text-center font-bold">{idx + 1}</td>
                      <td className="p-2 border border-black">
                        <div>{j.hari}, {j.tanggal}</div>
                        <div className="text-[10px] italic">{j.jam_ke}</div>
                      </td>
                      <td className="p-2 border border-black text-center font-semibold">{j.kelas || '-'}</td>
                      <td className="p-2 border border-black font-semibold">{j.materi_layanan}</td>
                      <td className="p-2 border border-black">
                        <div className="font-bold">{j.bidang_layanan}</div>
                        <div className="text-[10px]">{j.jenis_layanan}</div>
                      </td>
                      <td className="p-2 border border-black text-[10px]">{j.fungsi_layanan}</td>
                      <td className="p-2 border border-black text-[10px]">{j.hasil_layanan_bmb3 || '-'}</td>
                      <td className="p-2 border border-black text-center font-medium">
                        {j.siswa_tidak_mengikuti && j.siswa_tidak_mengikuti.length > 0
                          ? `${j.siswa_tidak_mengikuti.length} Siswa`
                          : 'Nihil'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-4 text-center italic text-slate-500 border border-black">
                      Belum ada rekap data Jurnal BK.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Signatures with Digital Signature Box */}
            <div className="grid grid-cols-2 text-center pt-8 text-xs gap-4 font-serif">
              <div>
                <div>Mengetahui,</div>
                <div>Kepala SMP Negeri 7 Pasuruan</div>
                <SignatureBox recordId="jurnal_bk_rekap" role="kepala_sekolah" className="h-20 w-32 mx-auto" />
                <div className="font-bold underline">
                  NUR FADILAH, S.Pd,. M.Pd
                </div>
                <div>NIP. 19860410 201001 2 030</div>
              </div>
              <div>
                <div>Pasuruan, {todayStr}</div>
                <div>Guru Bimbingan dan Konseling</div>
                <SignatureBox recordId="jurnal_bk_rekap" role="guru_bk" className="h-20 w-32 mx-auto" />
                <div className="font-bold underline">
                  {getActiveGuruBK().nama}
                </div>
                <div>NIP. {getActiveGuruBK().nip}</div>
              </div>
            </div>
          </div>
        )}

        {/* 13. LAPORAN KUNJUNGAN SISWA ATS (ANAK TIDAK SEKOLAH) */}
        {docType === 'siswa_ats_laporan' && currentSiswaATS && (
          <div className="space-y-4 text-xs leading-relaxed text-black font-serif">
            <div className="text-center my-3">
              <h2 className="text-base sm:text-lg font-bold uppercase underline tracking-wider">
                LAPORAN HASIL KUNJUNGAN SISWA ATS (ANAK TIDAK SEKOLAH)
              </h2>
              <p className="text-xs font-semibold mt-1">
                TAHUN AJARAN {currentSiswaATS.tahun_ajaran || '2025/2026'}
              </p>
            </div>

            {/* Tabel Biodata dan Masalah ATS */}
            <table className="w-full border-collapse text-xs my-3 border border-black">
              <tbody>
                <tr className="border-b border-black">
                  <td className="p-2 w-44 font-semibold border-r border-black bg-slate-50 print:bg-transparent">Hari / Tanggal Kunjungan</td>
                  <td className="p-2">: {currentSiswaATS.hari}, {formatIndoDate(currentSiswaATS.tanggal)}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-2 font-semibold border-r border-black bg-slate-50 print:bg-transparent">Jam / Waktu Pelaksanaan</td>
                  <td className="p-2">: {currentSiswaATS.waktu}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-2 font-semibold border-r border-black bg-slate-50 print:bg-transparent">Tahun Ajaran</td>
                  <td className="p-2">: {currentSiswaATS.tahun_ajaran || '2025/2026'}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-2 font-semibold border-r border-black bg-slate-50 print:bg-transparent">Nama Siswa ATS</td>
                  <td className="p-2 font-bold uppercase">: {currentSiswaATS.nama_siswa}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-2 font-semibold border-r border-black bg-slate-50 print:bg-transparent">Kategori ATS</td>
                  <td className="p-2 font-bold">: {currentSiswaATS.kategori_ats}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-2 font-semibold border-r border-black bg-slate-50 print:bg-transparent">Kelas Terakhir Terdaftar</td>
                  <td className="p-2">: {currentSiswaATS.kelas || '-'}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-2 font-semibold border-r border-black bg-slate-50 print:bg-transparent">Alamat Lengkap Siswa</td>
                  <td className="p-2">: {currentSiswaATS.alamat}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-2 font-semibold border-r border-black bg-slate-50 print:bg-transparent align-top">
                    Faktor / Alasan Siswa ATS
                  </td>
                  <td className="p-2 leading-relaxed">
                    : <strong>{currentSiswaATS.alasan_ats}</strong>
                  </td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-2 font-semibold border-r border-black bg-slate-50 print:bg-transparent align-top">
                    Uraian Fakta Lapangan
                  </td>
                  <td className="p-2 italic">
                    : {currentSiswaATS.alasan_manual || '-'}
                  </td>
                </tr>
                {currentSiswaATS.keterangan && (
                  <tr className="border-b border-black">
                    <td className="p-2 font-semibold border-r border-black bg-slate-50 print:bg-transparent align-top">
                      Rencana Tindak Lanjut
                    </td>
                    <td className="p-2">
                      : {currentSiswaATS.keterangan}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Dokumentasi Foto Kunjungan & Bukti Fisik */}
            {(currentSiswaATS.foto_kunjungan_1 || currentSiswaATS.foto_bukti_fisik_2) && (
              <div className="my-4 pt-2 border-t border-black">
                <div className="font-bold text-xs uppercase mb-2">Dokumentasi Foto Kunjungan & Bukti Fisik Lapangan:</div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  {currentSiswaATS.foto_kunjungan_1 ? (
                    <div className="border border-black p-2 rounded">
                      <img
                        src={currentSiswaATS.foto_kunjungan_1}
                        alt="Foto Kunjungan 1"
                        className="w-full max-h-56 object-contain mx-auto"
                      />
                      <div className="text-[10px] font-semibold mt-1">Foto Kunjungan 1 (Kunjungan Rumah ATS)</div>
                    </div>
                  ) : (
                    <div className="border border-dashed border-black p-6 text-center text-xs italic">
                      [Foto Kunjungan 1 Tidak Dilampirkan]
                    </div>
                  )}

                  {currentSiswaATS.foto_bukti_fisik_2 ? (
                    <div className="border border-black p-2 rounded">
                      <img
                        src={currentSiswaATS.foto_bukti_fisik_2}
                        alt="Foto Bukti Fisik 2"
                        className="w-full max-h-56 object-contain mx-auto"
                      />
                      <div className="text-[10px] font-semibold mt-1">Foto Bukti Fisik 2 (Dokumen / Lingkungan)</div>
                    </div>
                  ) : (
                    <div className="border border-dashed border-black p-6 text-center text-xs italic">
                      [Foto Bukti Fisik 2 Tidak Dilampirkan]
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tanda Tangan Resmi (Orang Tua, Guru Kunjungan, Kepala Sekolah) */}
            <div className="grid grid-cols-2 text-center text-xs pt-6 gap-4 font-serif">
              <div>
                <div>Orang Tua / Wali Siswa,</div>
                <SignatureBox recordId={currentSiswaATS.id} role="orang_tua" className="h-20 w-32 mx-auto" />
                <div className="font-bold underline mt-1">
                  ( .................................................... )
                </div>
                <div>Wali dari: {currentSiswaATS.nama_siswa}</div>
              </div>

              <div>
                <div>{currentSiswaATS.tempat_laporan || 'Pasuruan'}, {formatIndoDate(currentSiswaATS.tanggal_laporan || currentSiswaATS.tanggal)}</div>
                <div className="font-semibold">Guru / Petugas Kunjungan,</div>
                <SignatureBox recordId={currentSiswaATS.id} role="guru_bk" className="h-20 w-32 mx-auto" />
                <div className="font-bold underline mt-1">
                  {currentSiswaATS.nama_guru_kunjungan}
                </div>
                <div>NIP. {currentSiswaATS.nip_guru_kunjungan}</div>
              </div>

              <div className="col-span-2 pt-4">
                <div>Mengetahui,</div>
                <div className="font-semibold">Kepala UPT SMP Negeri 7 Pasuruan</div>
                <SignatureBox recordId={currentSiswaATS.id} role="kepala_sekolah" className="h-20 w-32 mx-auto" />
                <div className="font-bold underline mt-1">
                  {formatKepalaSekolah(currentSiswaATS.nama_kepala_sekolah)}
                </div>
                <div>NIP. {currentSiswaATS.nip_kepala_sekolah || '19860410 201001 2 030'}</div>
              </div>
            </div>
          </div>
        )}

        {/* 14. REKAPITULASI TABEL SISWA ATS */}
        {docType === 'siswa_ats_tabel' && (
          <div className="space-y-4 text-xs leading-relaxed text-black font-serif">
            <div className="text-center my-3">
              <h2 className="text-base sm:text-lg font-bold uppercase underline tracking-wider">
                REKAPITULASI DATA SISWA ATS (ANAK TIDAK SEKOLAH)
              </h2>
              <p className="text-xs font-semibold mt-1">
                UPT SMP NEGERI 7 PASURUAN • LAYANAN KHUSUS BIMBINGAN DAN KONSELING
              </p>
            </div>

            <table className="w-full border-collapse text-[11px] my-3 border border-black">
              <thead>
                <tr className="bg-slate-100 print:bg-transparent font-bold text-center border-b border-black">
                  <th className="p-1.5 border border-black w-8">No</th>
                  <th className="p-1.5 border border-black w-24">Hari / Tanggal</th>
                  <th className="p-1.5 border border-black w-16">TA</th>
                  <th className="p-1.5 border border-black">Nama Siswa ATS</th>
                  <th className="p-1.5 border border-black w-20">Kategori</th>
                  <th className="p-1.5 border border-black w-12">Kelas</th>
                  <th className="p-1.5 border border-black">Alamat Siswa</th>
                  <th className="p-1.5 border border-black">Faktor / Alasan ATS</th>
                  <th className="p-1.5 border border-black w-32">Guru Kunjungan</th>
                </tr>
              </thead>
              <tbody>
                {siswaATSItems.length > 0 ? (
                  siswaATSItems.map((item, idx) => (
                    <tr key={item.id || idx} className="border-b border-black">
                      <td className="p-1.5 border border-black text-center font-bold">{idx + 1}</td>
                      <td className="p-1.5 border border-black">
                        <div>{item.hari}</div>
                        <div className="text-[10px] text-slate-600">{item.tanggal}</div>
                      </td>
                      <td className="p-1.5 border border-black text-center">{item.tahun_ajaran || '-'}</td>
                      <td className="p-1.5 border border-black font-bold uppercase">{item.nama_siswa}</td>
                      <td className="p-1.5 border border-black text-center font-semibold">{item.kategori_ats}</td>
                      <td className="p-1.5 border border-black text-center">{item.kelas || '-'}</td>
                      <td className="p-1.5 border border-black text-[10px]">{item.alamat}</td>
                      <td className="p-1.5 border border-black text-[10px]">
                        <div>{item.alasan_ats}</div>
                        {item.alasan_manual && (
                          <div className="italic text-slate-700 mt-0.5">&quot;{item.alasan_manual}&quot;</div>
                        )}
                      </td>
                      <td className="p-1.5 border border-black text-[10px]">
                        <div className="font-semibold">{item.nama_guru_kunjungan}</div>
                        <div className="text-[9px]">NIP. {item.nip_guru_kunjungan}</div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="p-4 text-center italic text-slate-500 border border-black">
                      Belum ada data Siswa ATS (Anak Tidak Sekolah).
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Signatures */}
            <div className="grid grid-cols-2 text-center pt-8 text-xs gap-4 font-serif">
              <div>
                <div>Mengetahui,</div>
                <div>Kepala UPT SMP Negeri 7 Pasuruan</div>
                <SignatureBox recordId="siswa_ats_rekap" role="kepala_sekolah" className="h-20 w-32 mx-auto" />
                <div className="font-bold underline mt-1">
                  NUR FADILAH, S.Pd,. M.Pd
                </div>
                <div>NIP. 19860410 201001 2 030</div>
              </div>
              <div>
                <div>Pasuruan, {todayStr}</div>
                <div>Guru Bimbingan dan Konseling</div>
                <SignatureBox recordId="siswa_ats_rekap" role="guru_bk" className="h-20 w-32 mx-auto" />
                <div className="font-bold underline mt-1">
                  WIWIK ISMIATI, S.Pd
                </div>
                <div>NIP. 19831116 200904 2 003</div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
