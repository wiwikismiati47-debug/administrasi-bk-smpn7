import { getActiveGuruBK } from './guruBk';
import { UndanganOrangTua, HomeVisit, RekamPermasalahan, KonselingIndividu, KonselingKelompok, SuratPernyataan, JurnalBK } from '../types';

/**
 * Utility to generate Microsoft Word (.doc) document from HTML structure.
 * Standard HTML markup wrapped with Office schemas and Word-specific styles
 * opens natively and formatted cleanly in Microsoft Word.
 */

const DEFAULT_GURU_BK = getActiveGuruBK().nama;
const DEFAULT_NIP_GURU_BK = getActiveGuruBK().nip;
const DEFAULT_KEPALA_SEKOLAH = 'NUR FADILAH, S.Pd,. M.Pd';
const DEFAULT_NIP_KEPALA_SEKOLAH = '19860410 201001 2 030';

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

function getKopSuratWordHTML(): string {
  return `
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 5px; border: none;">
      <tr>
        <td style="width: 18%; text-align: left; vertical-align: middle; border: none;">
          <img src="https://i.ibb.co.com/677QPVHY/logo.png" width="75" height="75" alt="Logo Kota Pasuruan" />
        </td>
        <td style="width: 64%; text-align: center; vertical-align: middle; border: none;">
          <h4 style="margin: 0; font-size: 11pt; font-weight: bold; font-family: 'Times New Roman', Times, serif;">PEMERINTAH KOTA PASURAN</h4>
          <h2 style="margin: 2px 0; font-size: 15pt; font-weight: bold; font-family: 'Times New Roman', Times, serif;">UPT SMP NEGERI 7</h2>
          <p style="margin: 2px 0; font-size: 8.5pt; font-family: 'Times New Roman', Times, serif;">Jalan Simpang Slamet Riadi Nomor 2, Kota Pasuruan, Jawa Timur, 67139</p>
          <p style="margin: 2px 0; font-size: 8.5pt; font-family: 'Times New Roman', Times, serif;">Telepon (0343) 426845</p>
          <p style="margin: 2px 0; font-size: 8pt; font-family: 'Times New Roman', Times, serif;">Pos-el <i>smp7pas@yahoo.co.id</i>, Laman <i>www.smpn7pasuruan.sch.id</i></p>
        </td>
        <td style="width: 18%; text-align: right; vertical-align: middle; border: none;">
          <img src="https://image2url.com/r2/default/images/1772189169508-8d8beaf3-1640-4a9f-bf4f-ebdeb6048a5b.png" width="75" height="75" alt="Logo SMPN 7 Pasuruan" />
        </td>
      </tr>
    </table>
    <div class="line-double" style="border-top: 3px double #000000; margin-top: 5px; margin-bottom: 15px;"></div>
  `;
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
      .nb-box {
        clear: both;
        margin-top: 40px;
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <!-- KOP SURAT RESMI -->
    ${getKopSuratWordHTML()}

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
    ${getKopSuratWordHTML()}

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

    <!-- TANDA TANGAN 2 BAGIAN -->
    <table class="sig-table">
      <tr>
        <td style="width: 50%;">
          Mengetahui,<br/>
          Kepala Sekolah SMPN 7 Pasuruan<br/><br/><br/><br/>
          <b><u>${kepalaSekolah}</u></b><br/>
          NIP. ${nipKepalaSekolah}
        </td>
        <td style="width: 50%;">
          ${item.tempat_surat || 'Pasuruan'}, ${item.tanggal_surat ? formatTanggalIndo(item.tanggal_surat) : todayIndo}<br/>
          Guru BK/ Konselor<br/><br/><br/><br/>
          <b><u>${guruBk}</u></b><br/>
          NIP. ${nipGuruBk}
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

  const semesterLaporan = item.semester_laporan || 'SEMESTER 1 (GANJIL) TAHUN PELAJARAN 2026-2027';
  const bidangLayanan = item.bidang_layanan || 'Pribadi / Belajar';
  const topikPermasalahan = item.topik_permasalahan || item.perihal_home_visit || '-';
  const fungsiLayanan = item.fungsi_layanan || 'Pemahaman/Pencegahan/Penyembuhan';
  const pihakTerlibat = item.pihak_terlibat || '1. Konselor\n2. Wali Kelas';
  const tujuanKegiatan = item.tujuan_kegiatan || 'a) Membangun hubungan baik dengan orangtua/wali peserta didik/konseli\nb) Melengkapi dan klarifikasi data tentang peserta didik/konseli\nc) Mengkonsultasikan serta membangun kolaborasi untuk pemecahan masalah peserta didik/konseli';
  const gambaranRingkasMasalah = item.gambaran_ringkas_masalah || item.uraian_permasalahan || '-';
  const alamatKunjungan = item.alamat_kunjungan || item.alamat || '-';
  const hariTanggalLamaKunjungan = item.hari_tanggal_lama_kunjungan || `${item.hari}, ${tanggalIndo} (${item.waktu})`;
  const anggotaKeluargaDikunjungi = item.anggota_keluarga_dikunjungi || `Ayah : ${item.nama_orang_tua || '-'}`;
  const rencanaEvaluasi = item.rencana_evaluasi || 'a) Konfirmasi kebenaran tentang siswa bersama orangtua\nb) Kualitas hubungan dengan keluarga';
  const tindakLanjut = item.tindak_lanjut || '-';
  const catatanKhusus = item.catatan_khusus || item.keterangan || '-';

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
        line-height: 1.3;
        color: #000000;
      }
      .title-doc {
        text-align: center;
        font-size: 12pt;
        font-weight: bold;
        margin-bottom: 2px;
        text-transform: uppercase;
      }
      .subtitle-doc {
        text-align: center;
        font-size: 10pt;
        font-weight: bold;
        margin-bottom: 12px;
        text-transform: uppercase;
      }
      .report-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 15px;
      }
      .report-table td {
        border: 1px solid #000000;
        padding: 5px 8px;
        vertical-align: top;
        font-size: 10.5pt;
      }
      .report-table td.no-col {
        width: 25px;
        text-align: center;
        font-weight: bold;
      }
      .report-table td.label-col {
        width: 210px;
        font-weight: bold;
      }
      .sig-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
        text-align: center;
        font-size: 11pt;
      }
      .sig-table td {
        vertical-align: top;
        padding: 4px;
      }
    </style>
  </head>
  <body>
    ${getKopSuratWordHTML()}

    <div class="title-doc">
      LAPORAN KUNJUNGAN RUMAH
    </div>
    <div class="subtitle-doc">
      ${semesterLaporan}
    </div>

    <table class="report-table">
      <tr>
        <td class="no-col">1</td>
        <td class="label-col">Nama peserta didik/konseli</td>
        <td><b>${item.nama_siswa.toUpperCase()}</b></td>
      </tr>
      <tr>
        <td class="no-col">2</td>
        <td class="label-col">Kelas /Semester</td>
        <td><b>${item.kelas} / ${semesterLaporan.includes('GANJIL') ? 'Ganjil' : 'Genap'}</b></td>
      </tr>
      <tr>
        <td class="no-col">3</td>
        <td class="label-col">Bidang Layanan</td>
        <td>${bidangLayanan}</td>
      </tr>
      <tr>
        <td class="no-col">4</td>
        <td class="label-col">Topik /Permasalahan</td>
        <td>${topikPermasalahan.replace(/\n/g, '<br/>')}</td>
      </tr>
      <tr>
        <td class="no-col">5</td>
        <td class="label-col">Fungsi layanan</td>
        <td>${fungsiLayanan}</td>
      </tr>
      <tr>
        <td class="no-col">6</td>
        <td class="label-col">Pihak yang Terlibat</td>
        <td>${pihakTerlibat.replace(/\n/g, '<br/>')}</td>
      </tr>
      <tr>
        <td class="no-col">7</td>
        <td class="label-col">Tujuan Kegiatan</td>
        <td>${tujuanKegiatan.replace(/\n/g, '<br/>')}</td>
      </tr>
      <tr>
        <td class="no-col">8</td>
        <td class="label-col">Gambaran ringkas masalah</td>
        <td>${gambaranRingkasMasalah.replace(/\n/g, '<br/>')}</td>
      </tr>
      <tr>
        <td class="no-col">9</td>
        <td class="label-col">Alamat Kunjungan</td>
        <td>${alamatKunjungan}</td>
      </tr>
      <tr>
        <td class="no-col">10</td>
        <td class="label-col">Hari/Tanggal dan lama kunjungan</td>
        <td>${hariTanggalLamaKunjungan}</td>
      </tr>
      <tr>
        <td class="no-col">11</td>
        <td class="label-col">Anggota keluarga yang dikunjungi</td>
        <td>${anggotaKeluargaDikunjungi}</td>
      </tr>
      <tr>
        <td class="no-col">12</td>
        <td class="label-col">Rencana Evaluasi</td>
        <td>${rencanaEvaluasi.replace(/\n/g, '<br/>')}</td>
      </tr>
      <tr>
        <td class="no-col">13</td>
        <td class="label-col">Tindaklanjut</td>
        <td>${tindakLanjut.replace(/\n/g, '<br/>')}</td>
      </tr>
      <tr>
        <td class="no-col">14</td>
        <td class="label-col">Catatan Khusus</td>
        <td>${catatanKhusus.replace(/\n/g, '<br/>')}</td>
      </tr>
    </table>

    <table class="sig-table">
      <tr>
        <td style="width: 50%;">Guru BK/ Konselor</td>
        <td style="width: 50%;">
          Pasuruan, ${item.tanggal_surat ? formatTanggalIndo(item.tanggal_surat) : todayIndo}<br/>
          Orang Tua / Wali Siswa
        </td>
      </tr>
      <tr>
        <td style="height: 50px;"></td>
        <td></td>
      </tr>
      <tr>
        <td>
          <b><u>${guruBk.toUpperCase().replace(/S\.PD/g, 'S.Pd')}</u></b><br/>
          NIP. ${nipGuruBk}
        </td>
        <td>
          <b><u>${(item.nama_orang_tua || 'Orang Tua Siswa').toUpperCase()}</u></b><br/>
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
          <b><u>${kepalaSekolah.toUpperCase().replace(/S\.PD/g, 'S.Pd')}</u></b><br/>
          ${nipKepalaSekolah}
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
  const kepalaSekolah = item.nama_kepala_sekolah || DEFAULT_KEPALA_SEKOLAH;
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
    ${getKopSuratWordHTML()}

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
      Yth. Bapak / Ibu / Wali Siswa <u><b>${item.nama_siswa || '....................................'}</b></u><br/>
      Di<br/>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tempat
    </div>

    <p>Dengan Hormat,</p>
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
  const rawNomorSuratTugas = item.nomor_surat_tugas || '015';
  const nomorSuratTugas = rawNomorSuratTugas.includes('/423.')
    ? rawNomorSuratTugas
    : `400/ ${rawNomorSuratTugas} /423.102.54/${item.tahun || '2026'}`;
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

    <p style="margin-top: 20px;">Dengan Hormat,</p>
    <p>Kami yang bertanda tangan di bawah ini :</p>

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

    <p style="margin-top: 15px;">Orang Tua / Wali Siswa dari siswa tersebut di bawah ini :</p>

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
      Untuk membicarakan masalah yang dihadapi oleh putra / putri kami tersebut di atas sesuai dengan<br/>
      Surat Tugas nomor <u>${nomorSuratTugas}</u> tanggal <u>${tanggalSuratTugas}</u>
    </p>

    <table style="width: 100%; margin-top: 40px; border-collapse: collapse;">
      <tr>
        <td style="width: 45%;"></td>
        <td style="width: 55%; text-align: center;">
          Pasuruan, <u>${tanggalPernyataanOrtu}</u><br/><br/>
          Hormat Kami,<br/>
          Orang Tua / Wali Siswa<br/><br/><br/><br/><br/>
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

export function generateRekamPermasalahanHTML(item: RekamPermasalahan): string {
  const tanggalIndo = formatTanggalIndo(item.tanggal, item.bulan, item.tahun);
  const todayIndo = formatTanggalIndo(new Date().toISOString().slice(0, 10));

  return `
  <html xmlns:o='urn:schemas-microsoft-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
  <head>
    <meta charset="utf-8">
    <title>Rekam Permasalahan Siswa - ${item.nama_siswa}</title>
    <style>
      @page {
        size: 8.5in 11in;
        margin: 0.8in;
      }
      body {
        font-family: 'Times New Roman', Times, serif;
        font-size: 11pt;
        line-height: 1.3;
        color: #000000;
      }
      .title-doc {
        text-align: center;
        font-size: 13pt;
        font-weight: bold;
        margin-bottom: 4px;
        text-transform: uppercase;
      }
      .subtitle-doc {
        text-align: center;
        font-size: 10pt;
        font-weight: bold;
        margin-bottom: 15px;
        text-transform: uppercase;
      }
      .report-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }
      .report-table td {
        border: 1px solid #000000;
        padding: 6px 10px;
        vertical-align: top;
        font-size: 11pt;
      }
      .report-table td.no-col {
        width: 30px;
        text-align: center;
        font-weight: bold;
      }
      .report-table td.label-col {
        width: 210px;
        font-weight: bold;
      }
      .sig-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 30px;
        text-align: center;
        font-size: 11pt;
      }
      .sig-table td {
        vertical-align: top;
        padding: 4px;
      }
    </style>
  </head>
  <body>
    ${getKopSuratWordHTML()}

    <div class="title-doc">
      REKAM PERMASALAHAN SISWA
    </div>
    <div class="subtitle-doc">
      BIMBINGAN DAN KONSELING UPT SMP NEGERI 7 PASURUAN
    </div>

    <table class="report-table">
      <tr>
        <td class="no-col">1</td>
        <td class="label-col">Hari / Tanggal / Waktu</td>
        <td><b>${item.hari}, ${tanggalIndo} (${item.waktu || '08.00 WIB'})</b></td>
      </tr>
      <tr>
        <td class="no-col">2</td>
        <td class="label-col">Kelas</td>
        <td><b>Kelas ${item.kelas}</b></td>
      </tr>
      <tr>
        <td class="no-col">3</td>
        <td class="label-col">Nama Siswa</td>
        <td><b>${item.nama_siswa.toUpperCase()}</b></td>
      </tr>
      <tr>
        <td class="no-col">4</td>
        <td class="label-col">Nama Orang Tua / Wali</td>
        <td>${item.nama_orang_tua || '-'}</td>
      </tr>
      <tr>
        <td class="no-col">5</td>
        <td class="label-col">Pekerjaan Orang Tua</td>
        <td>${item.pekerjaan_orang_tua || '-'}</td>
      </tr>
      <tr>
        <td class="no-col">6</td>
        <td class="label-col">Alamat</td>
        <td>${item.alamat || '-'}</td>
      </tr>
      <tr>
        <td class="no-col">7</td>
        <td class="label-col">Ringkasan Uraian Permasalahan Siswa</td>
        <td>${(item.ringkasan_uraian_permasalahan || '-').replace(/\n/g, '<br/>')}</td>
      </tr>
      <tr>
        <td class="no-col">8</td>
        <td class="label-col">Upaya Yang Sudah Dilakukan Oleh Konselor, Wali Kelas</td>
        <td>${(item.upaya_konselor_walikelas || '-').replace(/\n/g, '<br/>')}</td>
      </tr>
      <tr>
        <td class="no-col">9</td>
        <td class="label-col">Hasil Dan Kesimpulan</td>
        <td>${(item.hasil_dan_kesimpulan || '-').replace(/\n/g, '<br/>')}</td>
      </tr>
      <tr>
        <td class="no-col">10</td>
        <td class="label-col">Dokumentasi / Foto Kegiatan</td>
        <td>${item.link_foto_kegiatan ? (item.link_foto_kegiatan.startsWith('data:image') || item.link_foto_kegiatan.startsWith('http') ? `<img src="${item.link_foto_kegiatan}" style="max-height: 160px; max-width: 250px; object-fit: contain;" alt="Foto Kegiatan" />` : `<a href="${item.link_foto_kegiatan}">Lihat Foto</a>`) : '-'}</td>
      </tr>
      <tr>
        <td class="no-col">11</td>
        <td class="label-col">Keterangan</td>
        <td>${item.keterangan || '-'}</td>
      </tr>
    </table>

    <table class="sig-table">
      <tr>
        <td style="width: 50%;">
          Mengetahui,<br/>
          Kepala SMP Negeri 7 Pasuruan<br/><br/><br/><br/>
          <b><u>${DEFAULT_KEPALA_SEKOLAH}</u></b><br/>
          NIP. ${DEFAULT_NIP_KEPALA_SEKOLAH}
        </td>
        <td style="width: 50%;">
          Pasuruan, ${todayIndo}<br/>
          Guru Bimbingan dan Konseling<br/><br/><br/><br/>
          <b><u>${DEFAULT_GURU_BK}</u></b><br/>
          NIP. ${DEFAULT_NIP_GURU_BK}
        </td>
      </tr>
    </table>

  </body>
  </html>
  `;
}

export function downloadRekamPermasalahanWord(item: RekamPermasalahan) {
  const html = generateRekamPermasalahanHTML(item);
  const cleanName = item.nama_siswa.replace(/[^a-zA-Z0-9]/g, '_');
  triggerWordDownload(html, `Rekam_Permasalahan_${cleanName}_SMPN7.doc`);
}

export function downloadBulkRekamPermasalahanWord(items: RekamPermasalahan[]) {
  if (items.length === 0) return;
  const combinedHTML = items.map(generateRekamPermasalahanHTML).join('<div style="page-break-before: always;"></div>');
  triggerWordDownload(combinedHTML, `Kumpulan_Rekam_Permasalahan_SMPN7_${new Date().toISOString().slice(0, 10)}.doc`);
}

// Rencana Konseling Individu Exporters
export function generateKonselingIndividuHTML(item: KonselingIndividu): string {
  const tanggalIndo = formatTanggalIndo(item.tanggal, item.bulan, item.tahun);
  const todayIndo = formatTanggalIndo(new Date().toISOString().slice(0, 10));

  return `
  <html xmlns:o='urn:schemas-microsoft-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
  <head>
    <meta charset="utf-8">
    <title>Rencana Konseling Individu - ${item.nama_siswa}</title>
    <style>
      @page {
        size: 8.5in 11in;
        margin: 0.8in;
      }
      body {
        font-family: 'Times New Roman', Times, serif;
        font-size: 11pt;
        line-height: 1.3;
        color: #000000;
      }
      .title-doc {
        text-align: center;
        font-size: 13pt;
        font-weight: bold;
        margin-bottom: 4px;
        text-transform: uppercase;
      }
      .subtitle-doc {
        text-align: center;
        font-size: 10pt;
        font-weight: bold;
        margin-bottom: 15px;
        text-transform: uppercase;
      }
      .report-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }
      .report-table td {
        border: 1px solid #000000;
        padding: 6px 10px;
        vertical-align: top;
        font-size: 11pt;
      }
      .report-table td.no-col {
        width: 30px;
        text-align: center;
        font-weight: bold;
      }
      .report-table td.label-col {
        width: 210px;
        font-weight: bold;
      }
      .sig-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 30px;
        text-align: center;
        font-size: 11pt;
      }
      .sig-table td {
        vertical-align: top;
        padding: 4px;
      }
    </style>
  </head>
  <body>
    ${getKopSuratWordHTML()}

    <div class="title-doc">
      RENCANA KONSELING INDIVIDU
    </div>
    <div class="subtitle-doc">
      BIMBINGAN DAN KONSELING UPT SMP NEGERI 7 PASURUAN
    </div>

    <table class="report-table">
      <tr>
        <td class="no-col">1</td>
        <td class="label-col">Hari / Tanggal / Waktu</td>
        <td><b>${item.hari}, ${tanggalIndo} (${item.waktu || '08.00 WIB'})</b></td>
      </tr>
      <tr>
        <td class="no-col">2</td>
        <td class="label-col">Kelas</td>
        <td><b>Kelas ${item.kelas}</b></td>
      </tr>
      <tr>
        <td class="no-col">3</td>
        <td class="label-col">Nama Siswa</td>
        <td><b>${item.nama_siswa.toUpperCase()}</b></td>
      </tr>
      <tr>
        <td class="no-col">4</td>
        <td class="label-col">Topik Permasalahan</td>
        <td><b>${item.topik_permasalahan || '-'}</b></td>
      </tr>
      <tr>
        <td class="no-col">5</td>
        <td class="label-col">Media yang Diperlukan</td>
        <td>${item.media_yang_diperlukan || '-'}</td>
      </tr>
      <tr>
        <td class="no-col">6</td>
        <td class="label-col">Ringkasan Uraian Permasalahan Siswa</td>
        <td>${(item.ringkasan_uraian_permasalahan || '-').replace(/\n/g, '<br/>')}</td>
      </tr>
      <tr>
        <td class="no-col">7</td>
        <td class="label-col">Pendekatan dan Teknik Konseling</td>
        <td>${(item.pendekatan_dan_teknik_konseling || '-').replace(/\n/g, '<br/>')}</td>
      </tr>
      <tr>
        <td class="no-col">8</td>
        <td class="label-col">Hasil yang Dicapai</td>
        <td>${(item.hasil_yang_dicapai || '-').replace(/\n/g, '<br/>')}</td>
      </tr>
      <tr>
        <td class="no-col">9</td>
        <td class="label-col">Dokumentasi / Foto Kegiatan</td>
        <td>${item.link_foto_kegiatan ? (item.link_foto_kegiatan.startsWith('data:image') || item.link_foto_kegiatan.startsWith('http') ? `<img src="${item.link_foto_kegiatan}" style="max-height: 160px; max-width: 250px; object-fit: contain;" alt="Foto Kegiatan" />` : `<a href="${item.link_foto_kegiatan}">Lihat Foto</a>`) : '-'}</td>
      </tr>
      <tr>
        <td class="no-col">10</td>
        <td class="label-col">Keterangan</td>
        <td>${item.keterangan || '-'}</td>
      </tr>
    </table>

    <table class="sig-table">
      <tr>
        <td style="width: 50%;">
          Mengetahui,<br/>
          Kepala SMP Negeri 7 Pasuruan<br/><br/><br/><br/>
          <b><u>${DEFAULT_KEPALA_SEKOLAH}</u></b><br/>
          NIP. ${DEFAULT_NIP_KEPALA_SEKOLAH}
        </td>
        <td style="width: 50%;">
          Pasuruan, ${todayIndo}<br/>
          Guru Bimbingan dan Konseling<br/><br/><br/><br/>
          <b><u>${DEFAULT_GURU_BK}</u></b><br/>
          NIP. ${DEFAULT_NIP_GURU_BK}
        </td>
      </tr>
    </table>

  </body>
  </html>
  `;
}

export function downloadKonselingIndividuWord(item: KonselingIndividu) {
  const html = generateKonselingIndividuHTML(item);
  const cleanName = item.nama_siswa.replace(/[^a-zA-Z0-9]/g, '_');
  triggerWordDownload(html, `Rencana_Konseling_Individu_${cleanName}_SMPN7.doc`);
}

export function downloadBulkKonselingIndividuWord(items: KonselingIndividu[]) {
  if (items.length === 0) return;
  const combinedHTML = items.map(generateKonselingIndividuHTML).join('<div style="page-break-before: always;"></div>');
  triggerWordDownload(combinedHTML, `Kumpulan_Konseling_Individu_SMPN7_${new Date().toISOString().slice(0, 10)}.doc`);
}

// Rencana Konseling Kelompok Exporters
export function generateKonselingKelompokHTML(item: KonselingKelompok): string {
  const tanggalIndo = formatTanggalIndo(item.tanggal, item.bulan, item.tahun);
  const todayIndo = formatTanggalIndo(new Date().toISOString().slice(0, 10));

  return `
  <html xmlns:o='urn:schemas-microsoft-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
  <head>
    <meta charset="utf-8">
    <title>Rencana Konseling Kelompok - ${item.kelas}</title>
    <style>
      @page {
        size: 8.5in 11in;
        margin: 0.8in;
      }
      body {
        font-family: 'Times New Roman', Times, serif;
        font-size: 11pt;
        line-height: 1.3;
        color: #000000;
      }
      .title-doc {
        text-align: center;
        font-size: 13pt;
        font-weight: bold;
        margin-bottom: 4px;
        text-transform: uppercase;
      }
      .subtitle-doc {
        text-align: center;
        font-size: 10pt;
        font-weight: bold;
        margin-bottom: 15px;
        text-transform: uppercase;
      }
      .report-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }
      .report-table td {
        border: 1px solid #000000;
        padding: 6px 10px;
        vertical-align: top;
        font-size: 11pt;
      }
      .report-table td.no-col {
        width: 30px;
        text-align: center;
        font-weight: bold;
      }
      .report-table td.label-col {
        width: 210px;
        font-weight: bold;
      }
      .sig-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 30px;
        text-align: center;
        font-size: 11pt;
      }
      .sig-table td {
        vertical-align: top;
        padding: 4px;
      }
    </style>
  </head>
  <body>
    ${getKopSuratWordHTML()}

    <div class="title-doc">
      RENCANA KONSELING KELOMPOK
    </div>
    <div class="subtitle-doc">
      BIMBINGAN DAN KONSELING UPT SMP NEGERI 7 PASURUAN
    </div>

    <table class="report-table">
      <tr>
        <td class="no-col">1</td>
        <td class="label-col">Hari / Tanggal / Waktu</td>
        <td><b>${item.hari}, ${tanggalIndo} (${item.waktu || '08.00 WIB'})</b></td>
      </tr>
      <tr>
        <td class="no-col">2</td>
        <td class="label-col">Kelas</td>
        <td><b>Kelas ${item.kelas}</b></td>
      </tr>
      <tr>
        <td class="no-col">3</td>
        <td class="label-col">Nama Siswa / Anggota Kelompok</td>
        <td>${(item.nama_siswa || '-').replace(/\n/g, '<br/>')}</td>
      </tr>
      <tr>
        <td class="no-col">4</td>
        <td class="label-col">Topik Permasalahan</td>
        <td><b>${item.topik_permasalahan || '-'}</b></td>
      </tr>
      <tr>
        <td class="no-col">5</td>
        <td class="label-col">Media yang Diperlukan</td>
        <td>${item.media_yang_diperlukan || '-'}</td>
      </tr>
      <tr>
        <td class="no-col">6</td>
        <td class="label-col">Ringkasan Uraian Permasalahan Siswa</td>
        <td>${(item.ringkasan_uraian_permasalahan || '-').replace(/\n/g, '<br/>')}</td>
      </tr>
      <tr>
        <td class="no-col">7</td>
        <td class="label-col">Pendekatan dan Teknik Konseling</td>
        <td>${(item.pendekatan_dan_teknik_konseling || '-').replace(/\n/g, '<br/>')}</td>
      </tr>
      <tr>
        <td class="no-col">8</td>
        <td class="label-col">Hasil yang Dicapai</td>
        <td>${(item.hasil_yang_dicapai || '-').replace(/\n/g, '<br/>')}</td>
      </tr>
      <tr>
        <td class="no-col">9</td>
        <td class="label-col">Dokumentasi / Foto Kegiatan</td>
        <td>${item.link_foto_kegiatan ? (item.link_foto_kegiatan.startsWith('data:image') || item.link_foto_kegiatan.startsWith('http') ? `<img src="${item.link_foto_kegiatan}" style="max-height: 160px; max-width: 250px; object-fit: contain;" alt="Foto Kegiatan" />` : `<a href="${item.link_foto_kegiatan}">Lihat Foto</a>`) : '-'}</td>
      </tr>
      <tr>
        <td class="no-col">10</td>
        <td class="label-col">Keterangan</td>
        <td>${item.keterangan || '-'}</td>
      </tr>
    </table>

    <table class="sig-table">
      <tr>
        <td style="width: 50%;">
          Mengetahui,<br/>
          Kepala SMP Negeri 7 Pasuruan<br/><br/><br/><br/>
          <b><u>${DEFAULT_KEPALA_SEKOLAH}</u></b><br/>
          NIP. ${DEFAULT_NIP_KEPALA_SEKOLAH}
        </td>
        <td style="width: 50%;">
          Pasuruan, ${todayIndo}<br/>
          Guru Bimbingan dan Konseling<br/><br/><br/><br/>
          <b><u>${DEFAULT_GURU_BK}</u></b><br/>
          NIP. ${DEFAULT_NIP_GURU_BK}
        </td>
      </tr>
    </table>

  </body>
  </html>
  `;
}

export function downloadKonselingKelompokWord(item: KonselingKelompok) {
  const html = generateKonselingKelompokHTML(item);
  const cleanClass = item.kelas.replace(/[^a-zA-Z0-9]/g, '_');
  triggerWordDownload(html, `Rencana_Konseling_Kelompok_Kelas_${cleanClass}_SMPN7.doc`);
}

export function downloadBulkKonselingKelompokWord(items: KonselingKelompok[]) {
  if (items.length === 0) return;
  const combinedHTML = items.map(generateKonselingKelompokHTML).join('<div style="page-break-before: always;"></div>');
  triggerWordDownload(combinedHTML, `Kumpulan_Konseling_Kelompok_SMPN7_${new Date().toISOString().slice(0, 10)}.doc`);
}

// Surat Pernyataan Siswa / Orang Tua Exporters
export function generateSuratPernyataanWordHTML(item: SuratPernyataan): string {
  const tanggalIndo = formatTanggalIndo(item.tanggal_surat);
  const titleHeader =
    item.jenis_sp === 'SP_DAMAI'
      ? 'SURAT PERNYATAAN DAMAI SISWA'
      : item.jenis_sp === 'SP_PENGUNDURAN_DIRI'
      ? 'SURAT PERNYATAAN PENGUNDURAN DIRI'
      : item.jenis_sp.startsWith('SP_ORTU')
      ? 'SURAT PERNYATAAN'
      : 'SURAT PERNYATAAN SISWA';

  let bodyContent = '';

  if (item.jenis_sp === 'SP_DAMAI') {
    const poinDamai =
      item.peraturan_diketahui ||
      `1. Saling memaafkan dengan tulus dan tidak akan mengungkit atau memperpanjang masalah ini lagi.\n2. Kembali berteman dengan baik serta tidak akan saling mengejek, mengancam, memprovokasi, atau melakukan kekerasan dalam bentuk apa pun.\n3. Siap menerima sanksi tegas dari pihak sekolah sesuai dengan aturan yang berlaku apabila melanggar janji ini.`;

    bodyContent = `
      <div style="text-align: center; margin-top: -20px; margin-bottom: 25px;">
        <div style="font-size: 13pt; font-weight: bold;">SMP NEGERI 7 PASURUAN</div>
        <div style="font-size: 11pt; font-weight: bold;">Tahun Ajaran ${item.tahun_ajaran || '2026-2027'}</div>
      </div>

      <p style="margin-bottom: 12px;">Pada hari ini, <b>${tanggalIndo}</b>, kami yang bertanda tangan di bawah ini:</p>
      <table style="margin-left: 20px; border-collapse: collapse; width: 95%; margin-bottom: 15px;">
        <tr>
          <td style="width: 180px; padding: 3px 0;">Nama Siswa Pertama</td>
          <td style="width: 20px; padding: 3px 0;">:</td>
          <td style="padding: 3px 0;"><b>${item.nama_siswa}</b></td>
        </tr>
        <tr>
          <td style="padding: 3px 0;">Kelas</td>
          <td style="padding: 3px 0;">:</td>
          <td style="padding: 3px 0;"><b>${item.kelas}</b></td>
        </tr>
        <tr>
          <td style="padding: 3px 0;">Nama Siswa Kedua</td>
          <td style="padding: 3px 0;">:</td>
          <td style="padding: 3px 0;"><b>${item.nama_siswa_2 || '....................................'}</b></td>
        </tr>
        <tr>
          <td style="padding: 3px 0;">Kelas</td>
          <td style="padding: 3px 0;">:</td>
          <td style="padding: 3px 0;"><b>${item.kelas_2 || '................'}</b></td>
        </tr>
        <tr>
          <td style="padding: 3px 0;">Hari, Tanggal Kejadian</td>
          <td style="padding: 3px 0;">:</td>
          <td style="padding: 3px 0;"><b>${item.hari_tanggal_kejadian || '................, ....................'}</b></td>
        </tr>
      </table>

      <p style="text-align: justify; line-height: 1.5; margin-bottom: 12px;">
        Menyatakan bahwa kami telah bersepakat untuk damai dan menyelesaikan perselisihan yang pernah terjadi secara kekeluargaan.
      </p>

      <p style="margin-bottom: 8px;"><b>Dengan ini kami berjanji:</b></p>
      <div style="margin-left: 20px; margin-bottom: 15px; line-height: 1.5;">
        ${poinDamai.replace(/\n/g, '<br/>')}
      </div>

      <p style="text-align: justify; line-height: 1.5; margin-bottom: 25px;">
        Demikian surat pernyataan damai ini kami buat dengan penuh kesadaran dan tanpa paksaan dari pihak mana pun.
      </p>

      <table style="width: 100%; border-collapse: collapse; text-align: center; margin-top: 20px;">
        <tr>
          <td style="width: 50%; vertical-align: top;">
            <br/>
            <b>Siswa Pertama</b><br/><br/><br/><br/><br/>
            ( <u>${item.nama_siswa}</u> )
          </td>
          <td style="width: 50%; vertical-align: top;">
            ${item.tempat_surat || 'Pasuruan'}, ${tanggalIndo}<br/>
            <b>Siswa Kedua</b><br/><br/><br/><br/><br/>
            ( <u>${item.nama_siswa_2 || '....................................'}</u> )
          </td>
        </tr>
      </table>

      <br/><br/>
      <table style="width: 100%; border-collapse: collapse; text-align: center;">
        <tr>
          <td>
            Mengetahui,<br/>
            <b>${item.jabatan_pengetahu || 'Guru BK / Wali Kelas'}</b><br/><br/><br/><br/><br/>
            <b><u>${(item.nama_guru_bk || DEFAULT_GURU_BK).toUpperCase().replace(/S\.PD/g, 'S.Pd')}</u></b><br/>
            NIP. ${item.nip_guru_bk || DEFAULT_NIP_GURU_BK}
          </td>
        </tr>
      </table>
    `;
  } else if (item.jenis_sp.startsWith('SP_1') || item.jenis_sp.startsWith('SP_2') || item.jenis_sp.startsWith('SP_3')) {
    bodyContent = `
      <p style="margin-bottom: 12px;">Saya yang bertanda tangan dibawah ini:</p>
      <table style="margin-left: 20px; border-collapse: collapse; width: 90%; margin-bottom: 15px;">
        <tr>
          <td style="width: 120px; padding: 3px 0;">Nama</td>
          <td style="width: 20px; padding: 3px 0;">:</td>
          <td style="padding: 3px 0;"><b>${item.nama_siswa}</b></td>
        </tr>
        <tr>
          <td style="padding: 3px 0;">Kelas</td>
          <td style="padding: 3px 0;">:</td>
          <td style="padding: 3px 0;"><b>${item.kelas}</b></td>
        </tr>
      </table>

      <p style="margin-bottom: 12px;">Berjanji dihadapan Orang Tua /Wali:</p>
      <table style="margin-left: 20px; border-collapse: collapse; width: 90%; margin-bottom: 20px;">
        <tr>
          <td style="width: 120px; padding: 3px 0;">Nama</td>
          <td style="width: 20px; padding: 3px 0;">:</td>
          <td style="padding: 3px 0;"><b>${item.nama_orang_tua || '-'}</b></td>
        </tr>
        <tr>
          <td style="padding: 3px 0;">Pekerjaan</td>
          <td style="padding: 3px 0;">:</td>
          <td style="padding: 3px 0;">${item.pekerjaan_orang_tua || '-'}</td>
        </tr>
        <tr>
          <td style="padding: 3px 0;">Alamat</td>
          <td style="padding: 3px 0;">:</td>
          <td style="padding: 3px 0;">${item.alamat_orang_tua || '-'}</td>
        </tr>
      </table>

      <p style="margin-bottom: 12px;">Untuk memenuhi Peraturan Sekolah sebagai berikut:</p>
      <div style="margin-left: 20px; margin-bottom: 20px; white-space: pre-wrap; line-height: 1.5;">${item.peraturan_diketahui}</div>

      <p style="text-align: justify; line-height: 1.5; margin-bottom: 20px;">
        Demikian Surat Perjanjian ini dibuat tanpa ada paksaan dari pihak lain.
      </p>

      <table style="width: 100%; margin-top: 40px; border-collapse: collapse;">
        <tr>
          <td style="width: 50%; vertical-align: top; text-align: left;">
            Mengetahui<br/>
            Orang Tua /Wali<br/><br/><br/><br/><br/>
            ( <u>${item.nama_orang_tua || '....................................'}</u> )
          </td>
          <td style="width: 50%; vertical-align: top; text-align: right;">
            ${item.tempat_surat || 'Pasuruan'}, ${tanggalIndo}<br/><br/>
            Siswa yang bersangkutan<br/><br/><br/><br/><br/>
            ( <u>${item.nama_siswa}</u> )
          </td>
        </tr>
      </table>
    `;
  } else if (item.jenis_sp === 'SP_ORTU_1') {
    bodyContent = `
      <p style="margin-bottom: 12px;">Yang bertanda tangan dibawah ini :</p>
      <table style="margin-left: 20px; border-collapse: collapse; width: 90%; margin-bottom: 20px;">
        <tr>
          <td style="width: 140px; padding: 3px 0;">Nama</td>
          <td style="width: 20px; padding: 3px 0;">:</td>
          <td style="padding: 3px 0;"><b>${item.nama_orang_tua || '-'}</b></td>
        </tr>
        <tr>
          <td style="padding: 3px 0;">Alamat</td>
          <td style="padding: 3px 0;">:</td>
          <td style="padding: 3px 0;">${item.alamat_orang_tua || '-'}</td>
        </tr>
        <tr>
          <td style="padding: 3px 0;">Pekerjaan</td>
          <td style="padding: 3px 0;">:</td>
          <td style="padding: 3px 0;">${item.pekerjaan_orang_tua || '-'}</td>
        </tr>
        <tr>
          <td style="padding: 3px 0;">Hubungan Keluarga</td>
          <td style="padding: 3px 0;">:</td>
          <td style="padding: 3px 0;">${item.hubungan_keluarga || 'Orang Tua / Wali'} dari Siswa <b>${item.nama_siswa}</b> (Kelas ${item.kelas})</td>
        </tr>
      </table>

      <p style="text-align: justify; line-height: 1.6; margin-bottom: 20px;">
        ${item.peraturan_diketahui}
      </p>

      <p style="text-align: justify; line-height: 1.6; margin-bottom: 30px;">
        Demikian pernyataan ini saya buat dengan sebenarnya untuk dapat dipergunakan sebagaimana diperlukan.
      </p>

      <table style="width: 100%; margin-top: 40px; border-collapse: collapse;">
        <tr>
          <td style="width: 50%;"></td>
          <td style="width: 50%; text-align: right;">
            ${item.tempat_surat || 'Pasuruan'}, ${tanggalIndo}<br/><br/>
            Hormat saya,<br/>
            Orang tua /wali siswa<br/><br/><br/><br/><br/>
            ( <u>${item.nama_orang_tua || '....................................'}</u> )
          </td>
        </tr>
      </table>
    `;
  } else if (item.jenis_sp === 'SP_ORTU_2') {
    bodyContent = `
      <p style="margin-bottom: 12px;">Yang bertanda tangan dibawah ini, kami orang tua murid atau wali :</p>
      <table style="margin-left: 20px; border-collapse: collapse; width: 90%; margin-bottom: 15px;">
        <tr>
          <td style="width: 120px; padding: 3px 0;">Nama</td>
          <td style="width: 20px; padding: 3px 0;">:</td>
          <td style="padding: 3px 0;"><b>${item.nama_orang_tua || '-'}</b></td>
        </tr>
        <tr>
          <td style="padding: 3px 0;">Alamat</td>
          <td style="padding: 3px 0;">:</td>
          <td style="padding: 3px 0;">${item.alamat_orang_tua || '-'}</td>
        </tr>
        <tr>
          <td style="padding: 3px 0;">Pekerjaan</td>
          <td style="padding: 3px 0;">:</td>
          <td style="padding: 3px 0;">${item.pekerjaan_orang_tua || '-'}</td>
        </tr>
      </table>

      <p style="margin-bottom: 12px;">Adalah orang tua dari siswa :</p>
      <table style="margin-left: 20px; border-collapse: collapse; width: 90%; margin-bottom: 20px;">
        <tr>
          <td style="width: 120px; padding: 3px 0;">Nama</td>
          <td style="width: 20px; padding: 3px 0;">:</td>
          <td style="padding: 3px 0;"><b>${item.nama_siswa}</b></td>
        </tr>
        <tr>
          <td style="padding: 3px 0;">Kelas</td>
          <td style="padding: 3px 0;">:</td>
          <td style="padding: 3px 0;"><b>${item.kelas}</b></td>
        </tr>
        <tr>
          <td style="padding: 3px 0;">Alamat</td>
          <td style="padding: 3px 0;">:</td>
          <td style="padding: 3px 0;">${item.alamat_orang_tua || '-'}</td>
        </tr>
      </table>

      <p style="text-align: justify; line-height: 1.6; margin-bottom: 20px;">
        ${item.peraturan_diketahui}
      </p>

      <p style="text-align: justify; line-height: 1.6; margin-bottom: 30px;">
        Demikian surat pernyataan ini, kami buat dengan sebenar-benarnya dan tanpa ada unsur paksaan dari siapapun.
      </p>

      <table style="width: 100%; margin-top: 40px; border-collapse: collapse;">
        <tr>
          <td style="width: 50%; vertical-align: top; text-align: left;">
            Yang membuat pernyataan<br/>
            Orang tua murid<br/><br/><br/><br/><br/>
            ( <u>${item.nama_orang_tua || '....................................'}</u> )
          </td>
          <td style="width: 50%; vertical-align: top; text-align: right;">
            ${item.tempat_surat || 'Pasuruan'}, ${tanggalIndo}<br/><br/>
            Siswa<br/><br/><br/><br/><br/>
            ( <u>${item.nama_siswa}</u> )
          </td>
        </tr>
      </table>
    `;
  } else {
    // SP_PENGUNDURAN_DIRI
    bodyContent = `
      <p style="margin-bottom: 12px;">Yang bertanda tangan dibawah ini :</p>
      <table style="margin-left: 20px; border-collapse: collapse; width: 90%; margin-bottom: 15px;">
        <tr>
          <td style="width: 120px; padding: 3px 0;">Nama</td>
          <td style="width: 20px; padding: 3px 0;">:</td>
          <td style="padding: 3px 0;"><b>${item.nama_orang_tua || '-'}</b></td>
        </tr>
        <tr>
          <td style="padding: 3px 0;">Alamat</td>
          <td style="padding: 3px 0;">:</td>
          <td style="padding: 3px 0;">${item.alamat_orang_tua || '-'}</td>
        </tr>
        <tr>
          <td style="padding: 3px 0;">Pekerjaan</td>
          <td style="padding: 3px 0;">:</td>
          <td style="padding: 3px 0;">${item.pekerjaan_orang_tua || '-'}</td>
        </tr>
      </table>

      <p style="margin-bottom: 12px;">Adalah orang tua dari siswa :</p>
      <table style="margin-left: 20px; border-collapse: collapse; width: 90%; margin-bottom: 20px;">
        <tr>
          <td style="width: 120px; padding: 3px 0;">Nama</td>
          <td style="width: 20px; padding: 3px 0;">:</td>
          <td style="padding: 3px 0;"><b>${item.nama_siswa}</b></td>
        </tr>
        <tr>
          <td style="padding: 3px 0;">Kelas</td>
          <td style="padding: 3px 0;">:</td>
          <td style="padding: 3px 0;"><b>${item.kelas}</b></td>
        </tr>
        <tr>
          <td style="padding: 3px 0;">Alamat</td>
          <td style="padding: 3px 0;">:</td>
          <td style="padding: 3px 0;">${item.alamat_orang_tua || '-'}</td>
        </tr>
      </table>

      <p style="text-align: justify; line-height: 1.6; margin-bottom: 20px;">
        Dengan ini menyatakan anak kami tersebut diatas mengundurkan diri dari <b>UPT SMP NEGERI 7 PASURUAN</b> dikarenakan: ${item.alasan_pengunduran || 'alasan pribadi / keluarga'}.
      </p>

      <p style="text-align: justify; line-height: 1.6; margin-bottom: 30px;">
        Demikian surat pernyataan ini, kami buat dengan sebenar-benarnya dan hendaknya digunakan sebagaimana mestinya.
      </p>

      <table style="width: 100%; margin-top: 40px; border-collapse: collapse;">
        <tr>
          <td style="width: 50%; vertical-align: top; text-align: left;">
            Mengetahui,<br/>
            Orang tua siswa<br/><br/><br/><br/><br/>
            ( <u>${item.nama_orang_tua || '....................................'}</u> )
          </td>
          <td style="width: 50%; vertical-align: top; text-align: right;">
            ${item.tempat_surat || 'Pasuruan'}, ${tanggalIndo}<br/><br/>
            Siswa<br/><br/><br/><br/><br/>
            ( <u>${item.nama_siswa}</u> )
          </td>
        </tr>
      </table>
    `;
  }

  return `
  <html xmlns:o='urn:schemas-microsoft-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
  <head>
    <meta charset="utf-8">
    <title>${titleHeader} - ${item.nama_siswa}</title>
    <style>
      @page {
        size: 8.5in 11in;
        margin: 1in;
      }
      body {
        font-family: 'Times New Roman', Times, serif;
        font-size: 12pt;
        line-height: 1.4;
        color: #000000;
      }
      .title-doc {
        text-align: center;
        font-size: 16pt;
        font-weight: bold;
        margin-bottom: 35px;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      u { text-underline-offset: 3px; }
    </style>
  </head>
  <body>
    <div class="title-doc">
      ${titleHeader}
    </div>

    ${bodyContent}
  </body>
  </html>
  `;
}

export function downloadSuratPernyataanWord(item: SuratPernyataan) {
  const html = generateSuratPernyataanWordHTML(item);
  const cleanName = item.nama_siswa.replace(/[^a-zA-Z0-9]/g, '_');
  triggerWordDownload(html, `Surat_Pernyataan_${item.jenis_sp}_${cleanName}_SMPN7.doc`);
}

export function downloadBulkSuratPernyataanWord(items: SuratPernyataan[]) {
  if (items.length === 0) return;
  const combinedHTML = items.map(generateSuratPernyataanWordHTML).join('<div style="page-break-before: always;"></div>');
  triggerWordDownload(combinedHTML, `Kumpulan_Surat_Pernyataan_Siswa_SMPN7_${new Date().toISOString().slice(0, 10)}.doc`);
}

export function generateJurnalBKHTML(item: JurnalBK): string {
  const tglIndo = formatTanggalIndo(item.tanggal, item.bulan, item.tahun);
  const guruBk = item.nama_guru_bk || DEFAULT_GURU_BK;
  const nipGuruBk = item.nip_guru_bk || DEFAULT_NIP_GURU_BK;
  const ks = item.nama_kepala_sekolah || DEFAULT_KEPALA_SEKOLAH;
  const nipKs = item.nip_kepala_sekolah || DEFAULT_NIP_KEPALA_SEKOLAH;

  const countAbsen = item.siswa_tidak_mengikuti?.length || 0;
  const rowsAbsen = countAbsen > 0
    ? item.siswa_tidak_mengikuti.map((s, idx) => `
      <tr>
        <td style="text-align: center; border: 1px solid #000; padding: 4px;">${idx + 1}</td>
        <td style="border: 1px solid #000; padding: 4px;">${s.nama_siswa}</td>
        <td style="border: 1px solid #000; padding: 4px;">${s.alasan}</td>
        <td style="border: 1px solid #000; padding: 4px;">${s.tindak_lanjut}</td>
      </tr>
    `).join('')
    : `
      <tr>
        <td colspan="4" style="text-align: center; border: 1px solid #000; padding: 8px; font-style: italic;">
          Nihil (Seluruh konseli/siswa mengikuti layanan dengan lengkap)
        </td>
      </tr>
    `;

  return `
  <html xmlns:o='urn:schemas-microsoft-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
  <head>
    <meta charset="utf-8">
    <title>Jurnal Layanan BK - ${item.materi_layanan}</title>
    <style>
      @page { size: 8.5in 11in; margin: 0.75in 0.75in 0.75in 0.75in; }
      body { font-family: 'Times New Roman', Times, serif; font-size: 11pt; line-height: 1.3; color: #000; }
      .kop { text-align: center; font-weight: bold; margin-bottom: 10px; border-bottom: 3px double #000; padding-bottom: 5px; }
      .kop-title { font-size: 14pt; text-transform: uppercase; }
      .kop-sub { font-size: 11pt; font-weight: normal; }
      .doc-title { text-align: center; font-size: 12pt; font-weight: bold; margin: 15px 0; text-transform: uppercase; text-decoration: underline; }
      .table-info, .table-absen { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
      .table-info td { padding: 5px 8px; vertical-align: top; border: 1px solid #000; }
      .table-absen th { border: 1px solid #000; padding: 6px; background-color: #f0f0f0; font-weight: bold; text-align: center; }
      .sig-table { width: 100%; border-collapse: collapse; margin-top: 30px; text-align: center; font-size: 11pt; }
      .sig-table td { width: 50%; vertical-align: top; padding: 10px; }
    </style>
  </head>
  <body>
    <div class="kop">
      <div class="kop-title">PEMERINTAH KOTA PASURUAN</div>
      <div class="kop-title">DINAS PENDIDIKAN DAN KEBUDAYAAN</div>
      <div class="kop-title" style="font-size: 15pt;">SMP NEGERI 7 PASURUAN</div>
      <div class="kop-sub">Jl. Sunan Ampel No. 12 Pasuruan | Telp. (0343) 424888</div>
    </div>

    <div class="doc-title">JURNAL LAYANAN BIMBINGAN DAN KONSELING</div>

    <table class="table-info">
      <tr>
        <td style="width: 25%; font-weight: bold; background-color: #f9f9f9;">Hari / Tanggal / Jam</td>
        <td>${item.hari}, ${tglIndo} (${item.jam_ke || '-'})</td>
      </tr>
      <tr>
        <td style="font-weight: bold; background-color: #f9f9f9;">Kelas / Sasaran</td>
        <td>${item.kelas || '-'} (${item.sasaran_peserta || '-'})</td>
      </tr>
      <tr>
        <td style="font-weight: bold; background-color: #f9f9f9;">Materi Layanan BK</td>
        <td><strong>${item.materi_layanan}</strong></td>
      </tr>
      <tr>
        <td style="font-weight: bold; background-color: #f9f9f9;">Bidang Layanan BK</td>
        <td>${item.bidang_layanan}</td>
      </tr>
      <tr>
        <td style="font-weight: bold; background-color: #f9f9f9;">Jenis Layanan / Kegiatan</td>
        <td>${item.jenis_layanan}</td>
      </tr>
      <tr>
        <td style="font-weight: bold; background-color: #f9f9f9;">Fungsi Layanan BK</td>
        <td>${item.fungsi_layanan}</td>
      </tr>
      <tr>
        <td style="font-weight: bold; background-color: #f9f9f9;">Hasil yang Dicapai (BMB3)</td>
        <td>${item.hasil_layanan_bmb3 || '-'}</td>
      </tr>
      <tr>
        <td style="font-weight: bold; background-color: #f9f9f9;">Keterangan / Catatan</td>
        <td>${item.keterangan || '-'}</td>
      </tr>
    </table>

    <div style="font-weight: bold; font-size: 11pt; margin-top: 15px; margin-bottom: 5px;">
      SISWA / KONSELI YANG TIDAK MENGIKUTI LAYANAN BK:
    </div>
    <table class="table-absen">
      <thead>
        <tr>
          <th style="width: 35px;">NO</th>
          <th>NAMA SISWA</th>
          <th>ALASAN</th>
          <th>TINDAK LANJUT</th>
        </tr>
      </thead>
      <tbody>
        ${rowsAbsen}
      </tbody>
    </table>

    <table class="sig-table">
      <tr>
        <td>
          Mengetahui,<br>
          <strong>Kepala SMP Negeri 7 Pasuruan</strong><br><br><br><br><br>
          <u><strong>${ks}</strong></u><br>
          NIP. ${nipKs}
        </td>
        <td>
          Pasuruan, ${tglIndo}<br>
          <strong>Guru Bimbingan dan Konseling</strong><br><br><br><br><br>
          <u><strong>${guruBk}</strong></u><br>
          NIP. ${nipGuruBk}
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

export function downloadJurnalBKWord(item: JurnalBK) {
  const html = generateJurnalBKHTML(item);
  const cleanMateri = (item.materi_layanan || 'Jurnal_BK').slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_');
  triggerWordDownload(html, `Jurnal_BK_${item.tanggal}_${cleanMateri}_SMPN7.doc`);
}

export function downloadBulkJurnalBKWord(items: JurnalBK[]) {
  if (items.length === 0) return;
  const combinedHTML = items.map(generateJurnalBKHTML).join('<div style="page-break-before: always;"></div>');
  triggerWordDownload(combinedHTML, `Kumpulan_Jurnal_Layanan_BK_SMPN7_${new Date().toISOString().slice(0, 10)}.doc`);
}





