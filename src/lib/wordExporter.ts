import { UndanganOrangTua, HomeVisit } from '../types';

/**
 * Utility to generate Microsoft Word (.doc) document from HTML structure.
 * Standard HTML markup wrapped with Office schemas and Word-specific styles
 * opens natively and formatted cleanly in Microsoft Word.
 */

const DEFAULT_GURU_BK = 'WIWIK ISMIATI, S.Pd';
const DEFAULT_NIP_GURU_BK = '19831116 200904 2 003';
const DEFAULT_KEPALA_SEKOLAH = 'MAKHRUS SIDDIQ, S.Psi, M.Pd';
const DEFAULT_NIP_KEPALA_SEKOLAH = '19731018 200604 1 020';

function formatTanggalIndo(dateStr: string, bulanFallback: string = '', tahunFallback: string = ''): string {
  if (!dateStr) return `${bulanFallback} ${tahunFallback}`.trim();
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const MONTHS = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function generateSuratUndanganHTML(item: UndanganOrangTua): string {
  const tanggalIndo = formatTanggalIndo(item.tanggal, item.bulan, item.tahun);
  const todayIndo = formatTanggalIndo(new Date().toISOString().slice(0, 10));
  const nomorSurat = item.nomor_surat || `400/  /423.102.54/${item.tahun || '2026'}`;
  const guruBk = item.nama_guru_bk || DEFAULT_GURU_BK;
  const nipGuruBk = item.nip_guru_bk || DEFAULT_NIP_GURU_BK;

  return `
  <html xmlns:o='urn:schemas-microsoft-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
  <head>
    <meta charset="utf-8">
    <title>Surat Undangan Orang Tua - ${item.nama_siswa}</title>
    <style>
      @page {
        size: 8.5in 11in;
        margin: 1in 1in 1in 1in;
      }
      body {
        font-family: 'Times New Roman', Times, serif;
        font-size: 12pt;
        line-height: 1.3;
        color: #000000;
      }
      .header-kop {
        text-align: center;
        margin-bottom: 5px;
      }
      .header-kop h4 {
        margin: 0;
        font-size: 12pt;
        font-weight: bold;
      }
      .header-kop h3 {
        margin: 2px 0;
        font-size: 13pt;
        font-weight: bold;
      }
      .header-kop h2 {
        margin: 2px 0;
        font-size: 15pt;
        font-weight: bold;
      }
      .header-kop p {
        margin: 2px 0;
        font-size: 9pt;
      }
      .line-double {
        border-top: 3px double #000000;
        margin-top: 5px;
        margin-bottom: 20px;
      }
      .date-right {
        text-align: right;
        margin-bottom: 15px;
      }
      .meta-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 15px;
      }
      .meta-table td {
        padding: 2px 0;
        vertical-align: top;
      }
      .content {
        margin-top: 15px;
        margin-bottom: 15px;
        text-align: justify;
      }
      .detail-table {
        margin: 15px 0 15px 30px;
        border-collapse: collapse;
      }
      .detail-table td {
        padding: 4px 8px 4px 0;
        vertical-align: top;
      }
      .signature-box {
        margin-top: 30px;
        float: right;
        width: 250px;
        text-align: center;
      }
      .nb-box {
        clear: both;
        margin-top: 40px;
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <!-- KOP SURAT RESMI -->
    <div class="header-kop">
      <h4>PEMERINTAH KOTA PASURAN</h4>
      <h3>DINAS PENDIDIKAN DAN KEBUDAYAAN</h3>
      <h2>SMP NEGERI 7 PASURAN</h2>
      <p>Jl. Simpang Slamet Riyadi No. 2 Seboro Gadangrejo Pasuruan 07139 Telp. (0343) 426845</p>
    </div>
    <div class="line-double"></div>

    <!-- TANGGAL SURAT -->
    <div class="date-right">
      ${item.tempat_surat || 'Pasuruan'}, ${item.tanggal_surat ? formatTanggalIndo(item.tanggal_surat) : todayIndo}
    </div>

    <!-- METADATA SURAT -->
    <table class="meta-table">
      <tr>
        <td style="width: 80px;">No</td>
        <td style="width: 15px;">:</td>
        <td>${nomorSurat}</td>
      </tr>
      <tr>
        <td>Lamp</td>
        <td>:</td>
        <td>-</td>
      </tr>
      <tr>
        <td>Hal</td>
        <td>:</td>
        <td><b>Undangan Orang Tua</b></td>
      </tr>
    </table>

    <br/>
    <div>
      Kepada<br/>
      Yth. Bapak /Ibu /Wali Siswa <b>${item.nama_siswa.toUpperCase()}</b> &nbsp;&nbsp; <b>KELAS ${item.kelas}</b><br/>
      Di-<br/>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Tempat</b>
    </div>

    <br/>
    <div class="content">
      Assalamu'alaikum wr. wb.<br/>
      Mengharap dengan hormat kehadiran Bapak /Ibu /Wali Siswa SMP Negeri 7 Pasuruan pada:
    </div>

    <table class="detail-table">
      <tr>
        <td style="width: 90px;">Hari</td>
        <td style="width: 15px;">:</td>
        <td><b>${item.hari}</b></td>
      </tr>
      <tr>
        <td>Tanggal</td>
        <td>:</td>
        <td><b>${tanggalIndo}</b></td>
      </tr>
      <tr>
        <td>Jam</td>
        <td>:</td>
        <td><b>${item.waktu || '07.30 WIB'}</b></td>
      </tr>
      <tr>
        <td>Tempat</td>
        <td>:</td>
        <td>${item.tempat_pelaksanaan || 'SMP Negeri 7 Pasuruan'}</td>
      </tr>
      <tr>
        <td>Perihal</td>
        <td>:</td>
        <td>${item.perihal_undangan}</td>
      </tr>
    </table>

    <div class="content">
      Kehadiran Bapak /Ibu /Wali Siswa <b>mohon tidak diwakilkan</b> sangat kami harapkan demi pendidikan putra Bapak /Ibu.<br/>
      Demikian Surat panggilan ini, atas perhatian dan kerja sama yang baik kami ucapkan terima kasih.<br/>
      Wassalamu'alaikum wr. wb.
    </div>

    <!-- TANDA TANGAN -->
    <table style="width: 100%; margin-top: 30px;">
      <tr>
        <td style="width: 50%;"></td>
        <td style="width: 50%; text-align: center;">
          Guru BK<br/><br/><br/><br/><br/>
          <b><u>${guruBk}</u></b><br/>
          NIP. ${nipGuruBk}
        </td>
      </tr>
    </table>

    <div class="nb-box">
      NB: Beserta Putranya.
    </div>

  </body>
  </html>
  `;
}

export function generateLaporanKonsultasiHTML(item: UndanganOrangTua): string {
  const tanggalIndo = formatTanggalIndo(item.tanggal, item.bulan, item.tahun);
  const todayIndo = formatTanggalIndo(new Date().toISOString().slice(0, 10));
  const semesterStr = item.semester || `SEMESTER 1 (GANJIL) TAHUN PELAJARAN ${item.tahun || '2025-2026'}`;
  const guruBk = item.nama_guru_bk || DEFAULT_GURU_BK;
  const nipGuruBk = item.nip_guru_bk || DEFAULT_NIP_GURU_BK;
  const kepalaSekolah = item.nama_kepala_sekolah || DEFAULT_KEPALA_SEKOLAH;
  const nipKepalaSekolah = item.nip_kepala_sekolah || DEFAULT_NIP_KEPALA_SEKOLAH;

  return `
  <html xmlns:o='urn:schemas-microsoft-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
  <head>
    <meta charset="utf-8">
    <title>Laporan Konsultasi - ${item.nama_siswa}</title>
    <style>
      @page {
        size: 8.5in 11in;
        margin: 0.8in 0.8in 0.8in 0.8in;
      }
      body {
        font-family: 'Times New Roman', Times, serif;
        font-size: 11pt;
        line-height: 1.3;
        color: #000000;
      }
      .header-kop {
        text-align: center;
        margin-bottom: 5px;
      }
      .header-kop h4 {
        margin: 0;
        font-size: 11pt;
        font-weight: bold;
      }
      .header-kop h3 {
        margin: 2px 0;
        font-size: 12pt;
        font-weight: bold;
      }
      .header-kop h2 {
        margin: 2px 0;
        font-size: 14pt;
        font-weight: bold;
      }
      .header-kop p {
        margin: 2px 0;
        font-size: 9pt;
      }
      .line-double {
        border-top: 3px double #000000;
        margin-top: 5px;
        margin-bottom: 15px;
      }
      .title-box {
        text-align: center;
        margin-bottom: 15px;
      }
      .title-box h3 {
        margin: 0;
        font-size: 12pt;
        font-weight: bold;
        text-decoration: underline;
      }
      .title-box p {
        margin: 2px 0;
        font-size: 11pt;
        font-weight: bold;
      }
      .report-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }
      .report-table th, .report-table td {
        border: 1px solid #000000;
        padding: 6px 8px;
        vertical-align: top;
      }
      .report-table td.no-col {
        width: 30px;
        text-align: center;
        font-weight: bold;
      }
      .report-table td.label-col {
        width: 220px;
        font-weight: bold;
      }
      .sig-table {
        width: 100%;
        margin-top: 20px;
        border-collapse: collapse;
      }
      .sig-table td {
        vertical-align: top;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <!-- KOP SURAT RESMI -->
    <div class="header-kop">
      <h4>PEMERINTAH KOTA PASURAN</h4>
      <h3>DINAS PENDIDIKAN DAN KEBUDAYAAN</h3>
      <h2>SMP NEGERI 7 PASURAN</h2>
      <p>Jl. Simpang Slamet Riyadi No. 2 Seboro Gadangrejo Pasuruan 07139 Telp. (0343) 426845</p>
    </div>
    <div class="line-double"></div>

    <!-- JUDUL LAPORAN -->
    <div class="title-box">
      <h3>LAPORAN KONSULTASI DENGAN ORANG TUA SISWA</h3>
      <p>${semesterStr.toUpperCase()}</p>
    </div>

    <!-- TABEL KONSULTASI -->
    <table class="report-table">
      <tr>
        <td class="no-col">1</td>
        <td class="label-col">Nama peserta didik/konseli</td>
        <td><b>${item.nama_siswa.toUpperCase()}</b></td>
      </tr>
      <tr>
        <td class="no-col">2</td>
        <td class="label-col">Kelas / Semester</td>
        <td><b>${item.kelas} / GANJIL</b></td>
      </tr>
      <tr>
        <td class="no-col">3</td>
        <td class="label-col">Hari/Tanggal</td>
        <td><b>${item.hari} / ${tanggalIndo}</b></td>
      </tr>
      <tr>
        <td class="no-col">4</td>
        <td class="label-col">Waktu</td>
        <td><b>${item.waktu || '08.00 WIB'}</b></td>
      </tr>
      <tr>
        <td class="no-col">5</td>
        <td class="label-col">Topik pembahasan</td>
        <td>${item.perihal_undangan}</td>
      </tr>
      <tr>
        <td class="no-col">6</td>
        <td class="label-col">Konsultan/Nara Sumber</td>
        <td>
          1. ${guruBk} (Konselor)<br/>
          2. ${item.nama_orang_tua || 'Orang Tua / Wali Siswa'} ${item.pekerjaan_orang_tua ? `(${item.pekerjaan_orang_tua})` : ''}
        </td>
      </tr>
      <tr>
        <td class="no-col">7</td>
        <td class="label-col">Peran Guru Bimbingan dan Konseling atau Konselor</td>
        <td>
          <p style="margin: 0 0 6px 0;">
            Peran konselor adalah untuk membina hubungan dengan orang tua, dalam kedudukannya sebagai konsultan. Konselor mengambil inisiatif memanggil orang tua ke sekolah.
          </p>
          <p style="margin: 0 0 6px 0;">
            Hal yang dibicarakan menyangkut kemajuan anak dalam belajar, sikap, dan perilaku anak di rumah maupun di sekolah.
          </p>
          ${item.uraian_permasalahan ? `
            <p style="margin: 0 0 6px 0;">
              <b>Uraian Permasalahan:</b><br/>
              ${item.uraian_permasalahan}
            </p>
          ` : ''}
          ${item.tindak_lanjut ? `
            <p style="margin: 0 0 6px 0;">
              <b>Hasil / Kesepakatan / Tindak Lanjut:</b><br/>
              ${item.tindak_lanjut}
            </p>
          ` : ''}
          <p style="margin: 0;">
            Hasil yang diharapkan dari pembicaraan orang tua dan konselor sekolah adalah pengetahuan pemahaman tentang keadaan siswa. Bagi orang tua, hasil ini akan membawa komunikasi yang baik dengan anak.
          </p>
        </td>
      </tr>
    </table>

    <!-- TANDA TANGAN 3 BAGIAN -->
    <table class="sig-table">
      <tr>
        <td style="width: 50%;"></td>
        <td style="width: 50%;">${item.tempat_surat || 'Pasuruan'}, ${item.tanggal_surat ? formatTanggalIndo(item.tanggal_surat) : todayIndo}</td>
      </tr>
      <tr>
        <td>Guru BK/ Konselor</td>
        <td>Konsultan/ Narasumber</td>
      </tr>
      <tr>
        <td style="height: 60px;"></td>
        <td></td>
      </tr>
      <tr>
        <td>
          <b><u>${guruBk}</u></b><br/>
          NIP. ${nipGuruBk}
        </td>
        <td>
          <b><u>${item.nama_orang_tua || 'Orang Tua Siswa'}</u></b><br/>
          Wali Siswa
        </td>
      </tr>
    </table>

    <br/>
    <table class="sig-table">
      <tr>
        <td style="width: 100%;">
          Mengetahui,<br/>
          Kepala Sekolah SMPN 7 Pasuruan<br/><br/><br/><br/>
          <b><u>${kepalaSekolah}</u></b><br/>
          NIP. ${nipKepalaSekolah}
        </td>
      </tr>
    </table>

  </body>
  </html>
  `;
}

function triggerWordDownload(htmlContent: string, filename: string) {
  const blob = new Blob(['\ufeff', htmlContent], {
    type: 'application/msword'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadSuratUndanganWord(item: UndanganOrangTua) {
  const html = generateSuratUndanganHTML(item);
  const cleanName = item.nama_siswa.replace(/[^a-zA-Z0-9]/g, '_');
  triggerWordDownload(html, `Surat_Undangan_Ortu_${cleanName}_SMPN7.doc`);
}

export function downloadLaporanKonsultasiWord(item: UndanganOrangTua) {
  const html = generateLaporanKonsultasiHTML(item);
  const cleanName = item.nama_siswa.replace(/[^a-zA-Z0-9]/g, '_');
  triggerWordDownload(html, `Laporan_Konsultasi_Ortu_${cleanName}_SMPN7.doc`);
}

export function downloadBulkSuratUndanganWord(items: UndanganOrangTua[]) {
  if (items.length === 0) return;
  const combinedHTML = items.map(generateSuratUndanganHTML).join('<div style="page-break-before: always;"></div>');
  triggerWordDownload(combinedHTML, `Kumpulan_Surat_Undangan_Ortu_SMPN7_${new Date().toISOString().slice(0, 10)}.doc`);
}

export function downloadBulkLaporanKonsultasiWord(items: UndanganOrangTua[]) {
  if (items.length === 0) return;
  const combinedHTML = items.map(generateLaporanKonsultasiHTML).join('<div style="page-break-before: always;"></div>');
  triggerWordDownload(combinedHTML, `Kumpulan_Laporan_Konsultasi_Ortu_SMPN7_${new Date().toISOString().slice(0, 10)}.doc`);
}

export function generateLaporanHomeVisitHTML(item: HomeVisit): string {
  const tanggalIndo = formatTanggalIndo(item.tanggal, item.bulan, item.tahun);
  const todayIndo = formatTanggalIndo(new Date().toISOString().slice(0, 10));
  const guruBk = item.nama_guru_bk || DEFAULT_GURU_BK;
  const nipGuruBk = item.nip_guru_bk || DEFAULT_NIP_GURU_BK;
  const kepalaSekolah = item.nama_kepala_sekolah || DEFAULT_KEPALA_SEKOLAH;
  const nipKepalaSekolah = item.nip_kepala_sekolah || DEFAULT_NIP_KEPALA_SEKOLAH;

  return `
  <html xmlns:o='urn:schemas-microsoft-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
  <head>
    <meta charset="utf-8">
    <title>Laporan Home Visit - ${item.nama_siswa}</title>
    <style>
      @page {
        size: 8.5in 11in;
        margin: 0.8in;
      }
      body {
        font-family: 'Times New Roman', Times, serif;
        font-size: 11pt;
        line-height: 1.4;
        color: #000000;
      }
      .header-kop {
        text-align: center;
        margin-bottom: 5px;
      }
      .header-kop h4 { margin: 0; font-size: 11pt; font-weight: bold; }
      .header-kop h3 { margin: 2px 0; font-size: 12pt; font-weight: bold; }
      .header-kop h2 { margin: 2px 0; font-size: 14pt; font-weight: bold; }
      .header-kop p { margin: 2px 0; font-size: 9pt; }
      .line-double {
        border-top: 3px double #000000;
        margin-top: 5px;
        margin-bottom: 15px;
      }
      .title-doc {
        text-align: center;
        font-size: 13pt;
        font-weight: bold;
        text-decoration: underline;
        margin-bottom: 15px;
        text-transform: uppercase;
      }
      .grid-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 15px;
      }
      .grid-table th, .grid-table td {
        border: 1px solid #000000;
        padding: 6px 8px;
        vertical-align: top;
      }
      .grid-table th {
        background-color: #f2f2f2;
        font-weight: bold;
      }
      .sig-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 25px;
        text-align: center;
      }
      .sig-table td {
        vertical-align: top;
        padding: 4px;
      }
    </style>
  </head>
  <body>
    <div class="header-kop">
      <h4>PEMERINTAH KOTA PASURUAN</h4>
      <h3>DINAS PENDIDIKAN DAN KEBUDAYAAN</h3>
      <h2>UPT SMP NEGERI 7 PASURUAN</h2>
      <p>Jl. SPG No. 4 Telp. (0343) 424265 Pasuruan, Kode Pos 67126</p>
    </div>
    <div class="line-double"></div>

    <div class="title-doc">
      LAPORAN PELAKSANAAN HOME VISIT / KUNJUNGAN RUMAH<br/>
      BIMBINGAN DAN KONSELING
    </div>

    <table class="grid-table">
      <tr>
        <th style="width: 30%;">HARI / TANGGAL</th>
        <td>${item.hari}, ${tanggalIndo}</td>
      </tr>
      <tr>
        <th>WAKTU / JAM</th>
        <td>${item.waktu}</td>
      </tr>
      <tr>
        <th>NAMA SISWA</th>
        <td><b>${item.nama_siswa}</b> (Kelas: ${item.kelas})</td>
      </tr>
      <tr>
        <th>ORANG TUA / WALI</th>
        <td>${item.nama_orang_tua || '-'} (Pekerjaan: ${item.pekerjaan_orang_tua || '-'})</td>
      </tr>
      <tr>
        <th>ALAMAT RUMAH</th>
        <td>${item.alamat || '-'}</td>
      </tr>
      <tr>
        <th>PERIHAL HOME VISIT</th>
        <td><b>${item.perihal_home_visit}</b></td>
      </tr>
      <tr>
        <th>URAIAN PERMASALAHAN</th>
        <td>${item.uraian_permasalahan || '-'}</td>
      </tr>
      <tr>
        <th>TINDAK LANJUT / HASIL</th>
        <td>${item.tindak_lanjut || '-'}</td>
      </tr>
      <tr>
        <th>KETERANGAN</th>
        <td>${item.keterangan || '-'}</td>
      </tr>
    </table>

    <br/>
    <table class="sig-table">
      <tr>
        <td style="width: 50%;"></td>
        <td style="width: 50%;">${item.tempat_surat || 'Pasuruan'}, ${item.tanggal_surat ? formatTanggalIndo(item.tanggal_surat) : todayIndo}</td>
      </tr>
      <tr>
        <td>Guru BK/ Konselor</td>
        <td>Orang Tua / Wali Siswa</td>
      </tr>
      <tr>
        <td style="height: 60px;"></td>
        <td></td>
      </tr>
      <tr>
        <td>
          <b><u>${guruBk}</u></b><br/>
          NIP. ${nipGuruBk}
        </td>
        <td>
          <b><u>${item.nama_orang_tua || 'Orang Tua Siswa'}</u></b><br/>
          Wali Siswa
        </td>
      </tr>
    </table>

    <br/>
    <table class="sig-table">
      <tr>
        <td style="width: 100%;">
          Mengetahui,<br/>
          Kepala Sekolah SMPN 7 Pasuruan<br/><br/><br/><br/>
          <b><u>${kepalaSekolah}</u></b><br/>
          NIP. ${nipKepalaSekolah}
        </td>
      </tr>
    </table>

  </body>
  </html>
  `;
}

export function generateSuratTugasHomeVisitHTML(item: HomeVisit): string {
  const tanggalIndo = formatTanggalIndo(item.tanggal, item.bulan, item.tahun);
  const todayIndo = formatTanggalIndo(new Date().toISOString().slice(0, 10));
  const tanggalSurat = item.tanggal_surat ? formatTanggalIndo(item.tanggal_surat) : todayIndo;
  
  const nomorSuratTugas = item.nomor_surat_tugas || '015';
  const petugas1 = item.petugas_1 || item.nama_guru_bk || DEFAULT_GURU_BK;
  const petugas2 = item.petugas_2 || '';
  const jabatanPetugas1 = item.jabatan_petugas_1 || 'Guru Bimbingan dan Konseling';
  const jabatanPetugas2 = item.jabatan_petugas_2 || 'Wali Kelas / Waka Kesiswaan';
  const nisSiswa = item.nis_siswa || '-';
  const kepalaSekolah = item.nama_kepala_sekolah || 'NUR FADILAH, S.Pd';
  const nipKepalaSekolah = item.nip_kepala_sekolah || 'NIP. 19860410 201001 2 030';
  const namaOrangTua = item.nama_orang_tua || '....................................';

  return `
  <html xmlns:o='urn:schemas-microsoft-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
  <head>
    <meta charset="utf-8">
    <title>Surat Tugas Kunjungan Rumah - ${item.nama_siswa}</title>
    <style>
      @page {
        size: 8.5in 11in;
        margin: 1in 1in 1in 1in;
      }
      body {
        font-family: 'Times New Roman', Times, serif;
        font-size: 12pt;
        line-height: 1.3;
        color: #000000;
      }
      .header-kop {
        text-align: center;
        margin-bottom: 5px;
      }
      .header-kop h4 { margin: 0; font-size: 11pt; font-weight: bold; }
      .header-kop h3 { margin: 2px 0; font-size: 12pt; font-weight: bold; }
      .header-kop h2 { margin: 2px 0; font-size: 14pt; font-weight: bold; }
      .header-kop p { margin: 2px 0; font-size: 9pt; }
      .line-double {
        border-top: 3px double #000000;
        margin-top: 5px;
        margin-bottom: 20px;
      }
      p { margin: 6px 0; }
      u { text-decoration: underline; }
    </style>
  </head>
  <body>
    <div class="header-kop">
      <h4>PEMERINTAH KOTA PASURUAN</h4>
      <h3>DINAS PENDIDIKAN DAN KEBUDAYAAN</h3>
      <h2>SMP NEGERI 7 PASURUAN</h2>
      <p>Jl. Simpang Slamet Riyadi No. 2 Sebani Gadingrejo Pasuruan 67139 Telp. (0343) 426845</p>
    </div>
    <div class="line-double"></div>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
      <tr>
        <td style="vertical-align: top; width: 60%;">
          No : 400/ <u><b>${nomorSuratTugas}</b></u> /423.102.54/2026<br/>
          Hal : Kunjungan Rumah
        </td>
        <td style="vertical-align: top; text-align: right; width: 40%;">
          Pasuruan, <u><b>${tanggalSurat}</b></u>
        </td>
      </tr>
    </table>

    <div style="margin-bottom: 15px;">
      Kepada<br/>
      Yth. Bapk /Ibu /WaliSiswa <u><b>${namaOrangTua}</b></u><br/>
      Di<br/>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tempat
    </div>

    <p>DenganHormat.</p>
    <p>Dengan ini kami menugaskan :</p>
    <table style="margin-left: 20px; margin-bottom: 10px;">
      <tr>
        <td style="width: 50px;">Sdr.</td>
        <td>: <u><b>${petugas1}</b></u></td>
      </tr>
      <tr>
        <td>Sdr</td>
        <td>: <u><b>${petugas2 || '....................................'}</b></u></td>
      </tr>
    </table>

    <p style="text-align: justify; line-height: 1.5;">
      Selaku Konselor (<u><b>${jabatanPetugas1}</b></u>) dan <u><b>${jabatanPetugas2}</b></u> /Guru Mata Pelajaran disekolah tersebut untuk mengadakan kunjungan kerumah saudara pada :
    </p>

    <table style="margin-left: 20px; margin-bottom: 10px;">
      <tr>
        <td style="width: 80px;">Hari</td>
        <td>: <u><b>${item.hari}</b></u></td>
      </tr>
      <tr>
        <td>Tanggal</td>
        <td>: <u><b>${tanggalIndo}</b></u></td>
      </tr>
      <tr>
        <td>Jam</td>
        <td>: <u><b>${item.waktu}</b></u></td>
      </tr>
    </table>

    <p style="text-align: justify; line-height: 1.5;">
      Dalam rangka usaha kami di bidang Bimbingan dan Konseling guna membicarakan masalah putra /putri saudara :
    </p>

    <table style="margin-left: 20px; margin-bottom: 10px;">
      <tr>
        <td style="width: 80px;">Nama</td>
        <td>: <u><b>${item.nama_siswa}</b></u></td>
      </tr>
      <tr>
        <td>Kelas</td>
        <td>: <u><b>${item.kelas}</b></u></td>
      </tr>
      <tr>
        <td>Nis</td>
        <td>: <u><b>${nisSiswa}</b></u></td>
      </tr>
    </table>

    <p style="text-align: justify; line-height: 1.5;">
      Kami mengharap agar saudara bersedia untuk menerima kunjungan para petugas kami tersebut diatas dan mengizinkan kembali surat yang kami lampirkan ini.
    </p>
    <p>Atas kesediaan saudara kami sampaikan terima kasih.</p>

    <table style="width: 100%; margin-top: 30px; border-collapse: collapse;">
      <tr>
        <td style="width: 50%;"></td>
        <td style="width: 50%; text-align: center;">
          Mengetahui,<br/>
          Kepala SMP Negeri 7 Pasuruan<br/><br/><br/><br/>
          <b><u>${kepalaSekolah}</u></b><br/>
          ${nipKepalaSekolah.startsWith('NIP') ? nipKepalaSekolah : `NIP. ${nipKepalaSekolah}`}
        </td>
      </tr>
    </table>

  </body>
  </html>
  `;
}

export function downloadSuratTugasHomeVisitWord(item: HomeVisit) {
  const html = generateSuratTugasHomeVisitHTML(item);
  const cleanName = item.nama_siswa.replace(/[^a-zA-Z0-9]/g, '_');
  triggerWordDownload(html, `Surat_Tugas_Kunjungan_Rumah_${cleanName}_SMPN7.doc`);
}

export function downloadBulkSuratTugasHomeVisitWord(items: HomeVisit[]) {
  if (items.length === 0) return;
  const combinedHTML = items.map(generateSuratTugasHomeVisitHTML).join('<div style="page-break-before: always;"></div>');
  triggerWordDownload(combinedHTML, `Kumpulan_Surat_Tugas_Home_Visit_SMPN7_${new Date().toISOString().slice(0, 10)}.doc`);
}

export function downloadLaporanHomeVisitWord(item: HomeVisit) {
  const html = generateLaporanHomeVisitHTML(item);
  const cleanName = item.nama_siswa.replace(/[^a-zA-Z0-9]/g, '_');
  triggerWordDownload(html, `Laporan_Home_Visit_${cleanName}_SMPN7.doc`);
}

export function downloadBulkLaporanHomeVisitWord(items: HomeVisit[]) {
  if (items.length === 0) return;
  const combinedHTML = items.map(generateLaporanHomeVisitHTML).join('<div style="page-break-before: always;"></div>');
  triggerWordDownload(combinedHTML, `Kumpulan_Laporan_Home_Visit_SMPN7_${new Date().toISOString().slice(0, 10)}.doc`);
}

export function generateSuratKesediaanOrtuHTML(item: HomeVisit): string {
  const tanggalIndo = formatTanggalIndo(item.tanggal, item.bulan, item.tahun);
  const todayIndo = formatTanggalIndo(new Date().toISOString().slice(0, 10));
  
  const namaOrangTua = item.nama_orang_tua || '....................................';
  const alamat = item.alamat || '....................................';
  const namaSiswa = item.nama_siswa || '....................................';
  const nisSiswa = item.nis_siswa || '....................';
  
  const petugasPenerimaKunjungan = item.petugas_penerima_kunjungan || item.petugas_1 || item.nama_guru_bk || DEFAULT_GURU_BK;
  const nomorSuratTugas = item.nomor_surat_tugas || '015';
  const tanggalSuratTugas = item.tanggal_surat_tugas ? formatTanggalIndo(item.tanggal_surat_tugas) : (item.tanggal_surat ? formatTanggalIndo(item.tanggal_surat) : todayIndo);
  const tanggalPernyataanOrtu = item.tanggal_pernyataan_ortu ? formatTanggalIndo(item.tanggal_pernyataan_ortu) : todayIndo;

  return `
  <html xmlns:o='urn:schemas-microsoft-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
  <head>
    <meta charset="utf-8">
    <title>Surat Kesediaan Menerima Kunjungan Orang Tua - ${item.nama_siswa}</title>
    <style>
      @page {
        size: 8.5in 11in;
        margin: 1in 1in 1in 1in;
      }
      body {
        font-family: 'Times New Roman', Times, serif;
        font-size: 12pt;
        line-height: 1.4;
        color: #000000;
      }
      p { margin: 8px 0; }
      u { text-decoration: underline; font-weight: bold; }
    </style>
  </head>
  <body>
    <div style="margin-bottom: 25px; line-height: 1.3;">
      Kepada<br/>
      Kepala Sekolah<br/>
      SMP Negeri 7 Pasuruan<br/>
      Di Pasuruan
    </div>

    <p style="margin-top: 20px;">Dengan Hormat</p>
    <p>Kami yang bertanda tangan dibawahini :</p>

    <table style="margin-left: 20px; margin-bottom: 12px; border-collapse: collapse; width: 90%;">
      <tr>
        <td style="width: 100px; vertical-align: top;">Nama</td>
        <td style="width: 20px; vertical-align: top;">:</td>
        <td><u>${namaOrangTua}</u></td>
      </tr>
      <tr>
        <td style="vertical-align: top;">Alamat</td>
        <td style="vertical-align: top;">:</td>
        <td><u>${alamat}</u></td>
      </tr>
    </table>

    <p style="margin-top: 15px;">Orangtua /Wali Siswa dari tersebut di bawahini :</p>

    <table style="margin-left: 20px; margin-bottom: 12px; border-collapse: collapse; width: 90%;">
      <tr>
        <td style="width: 100px; vertical-align: top;">Nama</td>
        <td style="width: 20px; vertical-align: top;">:</td>
        <td><u>${namaSiswa}</u></td>
      </tr>
      <tr>
        <td style="vertical-align: top;">Nis</td>
        <td style="vertical-align: top;">:</td>
        <td><u>${nisSiswa}</u></td>
      </tr>
    </table>

    <p style="text-align: justify; line-height: 1.5; margin-top: 15px;">
      Dengan ini menyatakan kesediaan kami untuk menerima kunjungan saudara :<br/>
      ........................................ <u>${petugasPenerimaKunjungan}</u> ........................................<br/>
      Kerumah kami pada :
    </p>

    <table style="margin-left: 20px; margin-bottom: 12px; border-collapse: collapse; width: 90%;">
      <tr>
        <td style="width: 100px;">Hari</td>
        <td style="width: 20px;">:</td>
        <td><u>${item.hari}</u></td>
      </tr>
      <tr>
        <td>Tanggal</td>
        <td>:</td>
        <td><u>${tanggalIndo}</u></td>
      </tr>
      <tr>
        <td>Jam</td>
        <td>:</td>
        <td><u>${item.waktu}</u></td>
      </tr>
    </table>

    <p style="text-align: justify; line-height: 1.5; margin-top: 15px;">
      Untuk membicarakan masalah yang di hadapi oleh putra /putri kami tersebut diatas sesuai dengan<br/>
      Surat Tugas nomor <u>${nomorSuratTugas}</u> tanggal <u>${tanggalSuratTugas}</u>
    </p>

    <table style="width: 100%; margin-top: 40px; border-collapse: collapse;">
      <tr>
        <td style="width: 45%;"></td>
        <td style="width: 55%; text-align: center;">
          Pasuruan, <u>${tanggalPernyataanOrtu}</u><br/><br/>
          HormatKami,<br/>
          Orang Tua /Walisiswa<br/><br/><br/><br/><br/>
          ( <u>${namaOrangTua}</u> )
        </td>
      </tr>
    </table>

  </body>
  </html>
  `;
}

export function downloadSuratKesediaanOrtuWord(item: HomeVisit) {
  const html = generateSuratKesediaanOrtuHTML(item);
  const cleanName = item.nama_siswa.replace(/[^a-zA-Z0-9]/g, '_');
  triggerWordDownload(html, `Surat_Kesediaan_Ortu_Home_Visit_${cleanName}_SMPN7.doc`);
}

export function downloadBulkSuratKesediaanOrtuWord(items: HomeVisit[]) {
  if (items.length === 0) return;
  const combinedHTML = items.map(generateSuratKesediaanOrtuHTML).join('<div style="page-break-before: always;"></div>');
  triggerWordDownload(combinedHTML, `Kumpulan_Surat_Kesediaan_Ortu_Home_Visit_SMPN7_${new Date().toISOString().slice(0, 10)}.doc`);
}


