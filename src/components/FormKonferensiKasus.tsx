import { getActiveGuruBK, PRESET_GURU_BK } from '../lib/guruBk';
import React, { useState, useEffect, useMemo } from 'react';
import { KonferensiKasus, FormKonferensiKasusData, DaftarHadirRow, Siswa } from '../types';
import { SiswaSelector } from './SiswaSelector';
import { FileText, Save, RefreshCw, Sparkles, User, AlertCircle, Calendar, Clock, MapPin, ClipboardList, Plus, Trash2, Check, ShieldCheck, HelpCircle, X, CheckCircle2, ChevronRight, Search, Target, GraduationCap, Users, UserPlus, CheckSquare, Square, Filter, UserCheck } from 'lucide-react';

const NAMA_HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const NAMA_BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export const formatHariTanggalJam = (tglIso: string, jamStr: string): string => {
  if (!tglIso) return '';
  const parts = tglIso.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const d = new Date(year, month, day);
    if (!isNaN(d.getTime())) {
      const hari = NAMA_HARI[d.getDay()];
      const bulan = NAMA_BULAN[month];
      let jamClean = (jamStr || '').trim();
      if (jamClean) {
        if (!jamClean.toLowerCase().startsWith('jam')) {
          jamClean = `Jam ${jamClean}`;
        }
      }
      return `${hari}, ${day} ${bulan} ${year}${jamClean ? ' ' + jamClean : ''}`;
    }
  }
  return tglIso;
};

export const parseHariTglJam = (text: string): { date: string; time: string } => {
  if (!text) return { date: new Date().toISOString().slice(0, 10), time: '10.30 WIB' };

  // Check if text has YYYY-MM-DD
  const isoMatch = text.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    const timeMatch = text.match(/(\d{1,2}[:.]\d{2})/);
    return {
      date: isoMatch[0],
      time: timeMatch ? `${timeMatch[0].replace(':', '.')} WIB` : '10.30 WIB'
    };
  }

  // Indonesian date text: "8 September 2016" or "08 September 2026"
  const monthMap: Record<string, string> = {
    januari: '01', februari: '02', maret: '03', april: '04', mei: '05', juni: '06',
    juli: '07', agustus: '08', september: '09', oktober: '10', november: '11', desember: '12'
  };

  const idMatch = text.match(/(\d{1,2})\s+([a-zA-Z]+)\s+(\d{4})/);
  let foundDate = new Date().toISOString().slice(0, 10);
  if (idMatch) {
    const day = idMatch[1].padStart(2, '0');
    const monthName = idMatch[2].toLowerCase();
    const year = idMatch[3];
    const monthNum = monthMap[monthName];
    if (monthNum) {
      foundDate = `${year}-${monthNum}-${day}`;
    }
  }

  // Extract time from text
  const timeMatch = text.match(/(?:jam\s*)?(\d{1,2}[:.]\d{2}(?:\s*wib)?)/i);
  let foundTime = '10.30 WIB';
  if (timeMatch) {
    let t = timeMatch[1].trim();
    if (!t.toUpperCase().includes('WIB')) {
      t = `${t.replace(':', '.')} WIB`;
    }
    foundTime = t;
  }

  return { date: foundDate, time: foundTime };
};

export interface TujuanKonferensiPreset {
  id: string;
  judul: string;
  kategori: string;
  badgeColor: string;
  deskripsi: string;
}

export const PRESET_TUJUAN_KONFERENSI: TujuanKonferensiPreset[] = [
  {
    id: 'perselisihan',
    judul: 'Perselisihan Antar Siswa',
    kategori: 'Hubungan Sosial / Interpersonal',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    deskripsi: 'Bertujuan untuk menggali pemicu dan sudut pandang dari kedua belah pihak secara objektif, meredakan ketegangan demi menciptakan suasana kelas yang kondusif, serta melatih siswa agar mampu menyelesaikan perbedaan pendapat secara damai.'
  },
  {
    id: 'perkelahian',
    judul: 'Perkelahian Antar Siswa',
    kategori: 'Perilaku Agresif / Fisik',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    deskripsi: 'Diarahkan untuk menghentikan tindakan kekerasan secara tegas namun tetap edukatif, menyelidiki akar pemicu masalah, serta memberikan sanksi pembinaan mental agar siswa dapat mengelola emosi dengan lebih baik ke depannya.'
  },
  {
    id: 'bullying',
    judul: 'Tindakan Perundungan (Bullying)',
    kategori: 'Perlindungan & Disiplin',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    deskripsi: 'Difokuskan untuk memberikan perlindungan serta pemulihan psikologis bagi korban, menyadarkan pelaku mengenai dampak buruk tindakannya, sekaligus membangun kembali budaya sekolah yang aman dan bebas dari intimidasi.'
  },
  {
    id: 'miras',
    judul: 'Membawa Minuman Keras (Miras) ke Sekolah',
    kategori: 'Zat Adiktif & Tata Tertib',
    badgeColor: 'bg-red-100 text-red-800 border-red-300',
    deskripsi: 'Bertujuan untuk menyelidiki sumber perolehan dan motif siswa, memberikan edukasi mendalam mengenai bahaya zat adiktif bagi kesehatan remaja, serta memperkuat intervensi dan pengawasan ketat dari pihak keluarga.'
  },
  {
    id: 'merokok',
    judul: 'Merokok di Lingkungan Sekolah',
    kategori: 'Kesehatan & Kebiasaan',
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
    deskripsi: 'Dilaksanakan untuk menegakkan tata tertib sekolah, memberikan penyuluhan kesehatan terkait dampak buruk rokok, serta melakukan konseling perilaku untuk menghentikan kebiasaan tersebut.'
  },
  {
    id: 'pencurian',
    judul: 'Mengambil Barang Milik Teman (Pencurian)',
    kategori: 'Integritas & Moralitas',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    deskripsi: 'Bertujuan untuk mengembalikan hak milik korban, menggali motif di balik tindakan siswa (faktor ekonomi, lingkungan, atau psikologis), serta menanamkan kembali nilai-nilai kejujuran dan rasa tanggung jawab moral.'
  }
];

export interface UraianKegiatanPreset {
  id: string;
  judul: string;
  kategori: string;
  badgeColor: string;
  items: string[];
  fullText: string;
}

export const PRESET_URAIAN_KEGIATAN: UraianKegiatanPreset[] = [
  {
    id: 'perselisihan',
    judul: 'Perselisihan Antar Siswa',
    kategori: 'Hubungan Sosial / Interpersonal',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    items: [
      'Memanggil dan mempertemukan siswa yang berselisih secara terpisah terlebih dahulu, kemudian bersama-sama dalam sesi mediasi.',
      'Mendengarkan keterangan dari masing-masing pihak secara adil tanpa menghakimi.',
      'Memberikan pemahaman tentang pentingnya menghargai perbedaan pendapat dan memfasilitasi proses perdamaian serta penandatanganan kesepakatan damai.'
    ],
    fullText: 'a. Memanggil dan mempertemukan siswa yang berselisih secara terpisah terlebih dahulu, kemudian bersama-sama dalam sesi mediasi.\n\nb. Mendengarkan keterangan dari masing-masing pihak secara adil tanpa menghakimi.\n\nc. Memberikan pemahaman tentang pentingnya menghargai perbedaan pendapat dan memfasilitasi proses perdamaian serta penandatanganan kesepakatan damai.'
  },
  {
    id: 'perkelahian',
    judul: 'Perkelahian Antar Siswa',
    kategori: 'Perilaku Agresif / Fisik',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    items: [
      'Mengamankan situasi dan memisahkan siswa yang terlibat perkelahian guna mencegah perluasan konflik.',
      'Melakukan investigasi singkat bersama guru piket/wali kelas untuk mengetahui kronologi kejadian.',
      'Memberikan sanksi mendidik sesuai tata tertib sekolah serta memberikan konseling manajemen amarah (anger management) kepada siswa.'
    ],
    fullText: 'a. Mengamankan situasi dan memisahkan siswa yang terlibat perkelahian guna mencegah perluasan konflik.\n\nb. Melakukan investigasi singkat bersama guru piket/wali kelas untuk mengetahui kronologi kejadian.\n\nc. Memberikan sanksi mendidik sesuai tata tertib sekolah serta memberikan konseling manajemen amarah (anger management) kepada siswa.'
  },
  {
    id: 'bullying',
    judul: 'Bullying (Perundungan)',
    kategori: 'Perlindungan & Disiplin',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    items: [
      'Memberikan perlindungan dan ruang aman bagi korban, serta penanganan psikologis awal untuk memulihkan rasa percaya diri.',
      'Memanggil pelaku untuk mengonfirmasi tindakan, menyadarkan tentang dampak emosional korban, dan memberikan sanksi pembinaan.',
      'Melibatkan pihak keluarga pelaku dan korban serta memperketat pengawasan di area rawan sekolah.'
    ],
    fullText: 'a. Memberikan perlindungan dan ruang aman bagi korban, serta penanganan psikologis awal untuk memulihkan rasa percaya diri.\n\nb. Memanggil pelaku untuk mengonfirmasi tindakan, menyadarkan tentang dampak emosional korban, dan memberikan sanksi pembinaan.\n\nc. Melibatkan pihak keluarga pelaku dan korban serta memperketat pengawasan di area rawan sekolah.'
  },
  {
    id: 'miras',
    judul: 'Membawa Minuman Keras (Miras) ke Sekolah',
    kategori: 'Zat Adiktif & Tata Tertib',
    badgeColor: 'bg-red-100 text-red-800 border-red-300',
    items: [
      'Mengamankan barang bukti berupa miras dan mencatat temuan secara administratif.',
      'Memanggil orang tua/wali murid ke sekolah untuk menyampaikan temuan secara transparan.',
      'Melakukan asesmen mendalam terkait alasan siswa membawa miras (pengaruh pergaulan atau coba-coba) serta memberikan pembinaan khusus dan surat perjanjian bermaterai.'
    ],
    fullText: 'a. Mengamankan barang bukti berupa miras dan mencatat temuan secara administratif.\n\nb. Memanggil orang tua/wali murid ke sekolah untuk menyampaikan temuan secara transparan.\n\nc. Melakukan asesmen mendalam terkait alasan siswa membawa miras (pengaruh pergaulan atau coba-coba) serta memberikan pembinaan khusus dan surat perjanjian bermaterai.'
  },
  {
    id: 'merokok',
    judul: 'Merokok di Lingkungan Sekolah',
    kategori: 'Kesehatan & Kebiasaan',
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
    items: [
      'Mengamankan siswa yang kedapatan merokok beserta barang bukti (rokok/korek) di area sekolah.',
      'Memberikan teguran lisan maupun tertulis sesuai tingkat pelanggaran tata tertib sekolah.',
      'Memberikan edukasi kesehatan tentang bahaya merokok bagi remaja dan mewajibkan siswa membuat surat pernyataan tidak mengulangi.'
    ],
    fullText: 'a. Mengamankan siswa yang kedapatan merokok beserta barang bukti (rokok/korek) di area sekolah.\n\nb. Memberikan teguran lisan maupun tertulis sesuai tingkat pelanggaran tata tertib sekolah.\n\nc. Memberikan edukasi kesehatan tentang bahaya merokok bagi remaja dan mewajibkan siswa membuat surat pernyataan tidak mengulangi.'
  },
  {
    id: 'pencurian',
    judul: 'Mengambil Barang Milik Temannya (Pencurian)',
    kategori: 'Integritas & Moralitas',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    items: [
      'Mengklarifikasi temuan laporan kehilangan secara bijak dan privat untuk menjaga kerahasiaan serta mental siswa.',
      'Mengembalikan barang yang diambil kepada pemiliknya secara sah.',
      'Menggali motif di balik tindakan siswa, memberikan teguran keras yang edukatif, serta menanamkan nilai moral kejujuran melalui bimbingan konseling intensif.'
    ],
    fullText: 'a. Mengklarifikasi temuan laporan kehilangan secara bijak dan privat untuk menjaga kerahasiaan serta mental siswa.\n\nb. Mengembalikan barang yang diambil kepada pemiliknya secara sah.\n\nc. Menggali motif di balik tindakan siswa, memberikan teguran keras yang edukatif, serta menanamkan nilai moral kejujuran melalui bimbingan konseling intensif.'
  }
];

export interface KesimpulanDataPreset {
  id: string;
  judul: string;
  kategori: string;
  badgeColor: string;
  kesimpulan: string;
  data: string;
  fullText: string;
}

export const PRESET_KESIMPULAN_DATA: KesimpulanDataPreset[] = [
  {
    id: 'perselisihan',
    judul: 'Perselisihan Antar Siswa',
    kategori: 'Hubungan Sosial / Interpersonal',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    kesimpulan: 'Masalah terjadi karena salah paham dan emosi remaja.',
    data: 'Kedua siswa sepakat berdamai dan berjanji tidak bertengkar lagi.',
    fullText: 'Kesimpulan: Masalah terjadi karena salah paham dan emosi remaja.\n\nData: Kedua siswa sepakat berdamai dan berjanji tidak bertengkar lagi.'
  },
  {
    id: 'perkelahian',
    judul: 'Perkelahian Antar Siswa',
    kategori: 'Perilaku Agresif / Fisik',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    kesimpulan: 'Perkelahian disebabkan oleh emosi sesaat dan provokasi teman.',
    data: 'Diketahui kronologi kejadian, siswa diberi sanksi pembinaan, dan wajib mengikuti konseling amarah.',
    fullText: 'Kesimpulan: Perkelahian disebabkan oleh emosi sesaat dan provokasi teman.\n\nData: Diketahui kronologi kejadian, siswa diberi sanksi pembinaan, dan wajib mengikuti konseling amarah.'
  },
  {
    id: 'bullying',
    judul: 'Bullying (Perundungan)',
    kategori: 'Perlindungan & Disiplin',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    kesimpulan: 'Pelaku ingin mendominasi, sedangkan korban butuh pemulihan mental.',
    data: 'Korban mendapat pendampingan, pelaku diberi sanksi pembinaan, dan pengawasan sekolah diperketat.',
    fullText: 'Kesimpulan: Pelaku ingin mendominasi, sedangkan korban butuh pemulihan mental.\n\nData: Korban mendapat pendampingan, pelaku diberi sanksi pembinaan, dan pengawasan sekolah diperketat.'
  },
  {
    id: 'miras',
    judul: 'Membawa Minuman Keras (Miras) ke Sekolah',
    kategori: 'Zat Adiktif & Tata Tertib',
    badgeColor: 'bg-red-100 text-red-800 border-red-300',
    kesimpulan: 'Siswa terpengaruh pergaulan luar dan kurang pengawasan.',
    data: 'Asal miras diketahui, siswa diberi pembinaan keras, dan orang tua berjanji lebih ketat mengawasi di rumah.',
    fullText: 'Kesimpulan: Siswa terpengaruh pergaulan luar dan kurang pengawasan.\n\nData: Asal miras diketahui, siswa diberi pembinaan keras, dan orang tua berjanji lebih ketat mengawasi di rumah.'
  },
  {
    id: 'merokok',
    judul: 'Merokok di Lingkungan Sekolah',
    kategori: 'Kesehatan & Kebiasaan',
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
    kesimpulan: 'Siswa melanggar aturan karena ikut-ikutan teman atau coba-coba.',
    data: 'Titik merokok terdeteksi, siswa diberi sanksi teguran, dan membuat surat pernyataan.',
    fullText: 'Kesimpulan: Siswa melanggar aturan karena ikut-ikutan teman atau coba-coba.\n\nData: Titik merokok terdeteksi, siswa diberi sanksi teguran, dan membuat surat pernyataan.'
  },
  {
    id: 'pencurian',
    judul: 'Mengambil Barang Milik Teman (Pencurian)',
    kategori: 'Integritas & Moralitas',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    kesimpulan: 'Tindakan dilakukan karena dorongan sesaat dan kurangnya pemahaman kejujuran.',
    data: 'Barang berhasil dikembalikan ke pemiliknya, dan siswa diberi pembinaan moral agar tidak mengulanginya.',
    fullText: 'Kesimpulan: Tindakan dilakukan karena dorongan sesaat dan kurangnya pemahaman kejujuran.\n\nData: Barang berhasil dikembalikan ke pemiliknya, dan siswa diberi pembinaan moral agar tidak mengulanginya.'
  }
];

export interface KeputusanRapatPreset {
  id: string;
  judul: string;
  kategori: string;
  badgeColor: string;
  jalannyaRapat: string;
  hasilKeputusan: string;
  fullText: string;
}

export const PRESET_KEPUTUSAN_RAPAT: KeputusanRapatPreset[] = [
  {
    id: 'perselisihan',
    judul: 'Perselisihan Antar Siswa',
    kategori: 'Hubungan Sosial / Interpersonal',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    jalannyaRapat: 'Mempertemukan kedua siswa yang berselisih didampingi guru BK dan wali kelas untuk membahas akar kesalahpahaman.',
    hasilKeputusan: 'Kedua siswa sepakat untuk berdamai, saling memaafkan, dan menandatangani surat perdamaian agar hubungan kembali kondusif.',
    fullText: 'a. Jalannya Rapat: Mempertemukan kedua siswa yang berselisih didampingi guru BK dan wali kelas untuk membahas akar kesalahpahaman.\n\nb. Hasil Keputusan: Kedua siswa sepakat untuk berdamai, saling memaafkan, dan menandatangani surat perdamaian agar hubungan kembali kondusif.'
  },
  {
    id: 'perkelahian',
    judul: 'Perkelahian Antar Siswa',
    kategori: 'Perilaku Agresif / Fisik',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    jalannyaRapat: 'Membahas kronologi perkelahian bersama pihak sekolah, orang tua, dan siswa yang terlibat untuk mengevaluasi tindakan kekerasan yang terjadi.',
    hasilKeputusan: 'Siswa diberikan sanksi pembinaan tata tertib sekolah, wajib mengikuti konseling manajemen emosi, dan orang tua sepakat meningkatkan pengawasan di rumah.',
    fullText: 'a. Jalannya Rapat: Membahas kronologi perkelahian bersama pihak sekolah, orang tua, dan siswa yang terlibat untuk mengevaluasi tindakan kekerasan yang terjadi.\n\nb. Hasil Keputusan: Siswa diberikan sanksi pembinaan tata tertib sekolah, wajib mengikuti konseling manajemen emosi, dan orang tua sepakat meningkatkan pengawasan di rumah.'
  },
  {
    id: 'bullying',
    judul: 'Bullying (Perundungan)',
    kategori: 'Perlindungan & Disiplin',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    jalannyaRapat: 'Mengevaluasi laporan perundungan, mendengarkan keterangan korban dan pelaku, serta melibatkan orang tua masing-masing pihak.',
    hasilKeputusan: 'Pelaku diberikan sanksi tegas yang mendidik, korban mendapat pendampingan psikologis untuk pemulihan, dan pihak sekolah memperketat pengawasan di area rawan.',
    fullText: 'a. Jalannya Rapat: Mengevaluasi laporan perundungan, mendengarkan keterangan korban dan pelaku, serta melibatkan orang tua masing-masing pihak.\n\nb. Hasil Keputusan: Pelaku diberikan sanksi tegas yang mendidik, korban mendapat pendampingan psikologis untuk pemulihan, dan pihak sekolah memperketat pengawasan di area rawan.'
  },
  {
    id: 'miras',
    judul: 'Membawa Minuman Keras (Miras) ke Sekolah',
    kategori: 'Zat Adiktif & Tata Tertib',
    badgeColor: 'bg-red-100 text-red-800 border-red-300',
    jalannyaRapat: 'Rapat khusus antara pihak sekolah (Kepala Sekolah, Guru BK, Wali Kelas) dan orang tua siswa untuk membahas temuan pelanggaran berat tersebut.',
    hasilKeputusan: 'Siswa diberi pembinaan keras dan peringatan terakhir, membuat surat perjanjian bermaterai, serta orang tua menyatakan kesanggupannya untuk mengawasi pergaulan anak di luar sekolah.',
    fullText: 'a. Jalannya Rapat: Rapat khusus antara pihak sekolah (Kepala Sekolah, Guru BK, Wali Kelas) dan orang tua siswa untuk membahas temuan pelanggaran berat tersebut.\n\nb. Hasil Keputusan: Siswa diberi pembinaan keras dan peringatan terakhir, membuat surat perjanjian bermaterai, serta orang tua menyatakan kesanggupannya untuk mengawasi pergaulan anak di luar sekolah.'
  },
  {
    id: 'merokok',
    judul: 'Merokok di Lingkungan Sekolah',
    kategori: 'Kesehatan & Kebiasaan',
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
    jalannyaRapat: 'Membahas temuan pelanggaran aturan larangan merokok di area sekolah berdasarkan laporan guru piket.',
    hasilKeputusan: 'Siswa diberikan teguran resmi, diminta membuat surat pernyataan untuk tidak mengulangi perbuatannya, serta diberikan edukasi bahaya merokok oleh Guru BK.',
    fullText: 'a. Jalannya Rapat: Membahas temuan pelanggaran aturan larangan merokok di area sekolah berdasarkan laporan guru piket.\n\nb. Hasil Keputusan: Siswa diberikan teguran resmi, diminta membuat surat pernyataan untuk tidak mengulangi perbuatannya, serta diberikan edukasi bahaya merokok oleh Guru BK.'
  },
  {
    id: 'pencurian',
    judul: 'Mengambil Barang Milik Teman (Pencurian)',
    kategori: 'Integritas & Moralitas',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    jalannyaRapat: 'Membahas kasus kehilangan barang milik siswa dengan mengklarifikasi pihak terkait secara tertutup untuk menjaga kerahasiaan dan mental anak.',
    hasilKeputusan: 'Barang bukti dikembalikan kepada pemilik sahnya, siswa yang mengambil diberi pembinaan moral intensif tentang kejujuran, dan orang tua diinformasikan untuk mendampingi di rumah.',
    fullText: 'a. Jalannya Rapat: Membahas kasus kehilangan barang milik siswa dengan mengklarifikasi pihak terkait secara tertutup untuk menjaga kerahasiaan dan mental anak.\n\nb. Hasil Keputusan: Barang bukti dikembalikan kepada pemilik sahnya, siswa yang mengambil diberi pembinaan moral intensif tentang kejujuran, dan orang tua diinformasikan untuk mendampingi di rumah.'
  }
];

interface FormKonferensiKasusProps {
  initialData?: KonferensiKasus | null;
  onSubmit: (data: Partial<KonferensiKasus> & FormKonferensiKasusData) => Promise<void>;
  isSubmitting?: boolean;
  onCancelEdit?: () => void;
  existingItems?: KonferensiKasus[];
  siswaItems?: Siswa[];
}

const DEFAULT_ROWS: DaftarHadirRow[] = [
  { no: 1, nama: 'Wiwik Ismiati, S.Pd', jabatan: 'Konselor Sekolah', kelas: '-', asal_sekolah: 'UPT SMPN 7 Pasuruan', ttd: 'Ada' },
  { no: 2, nama: 'Guru Kelas / Wali Kelas', jabatan: 'Wali Kelas', kelas: '9E', asal_sekolah: 'UPT SMPN 7 Pasuruan', ttd: 'Ada' },
  { no: 3, nama: 'Guru Mata Pelajaran', jabatan: 'Guru Mapel', kelas: '-', asal_sekolah: 'UPT SMPN 7 Pasuruan', ttd: 'Ada' },
  { no: 4, nama: 'Siswa Bersangkutan', jabatan: 'Siswa / Konseli', kelas: '9E', asal_sekolah: 'UPT SMPN 7 Pasuruan', ttd: 'Ada' },
  { no: 5, nama: 'Orang Tua / Wali Siswa', jabatan: 'Orang Tua', kelas: '-', asal_sekolah: '-', ttd: 'Ada' }
];

export const FormKonferensiKasus: React.FC<FormKonferensiKasusProps> = ({
  initialData,
  onSubmit,
  isSubmitting = false,
  onCancelEdit,
  existingItems = [],
  siswaItems = [],
}) => {
  // Tabs: 'notula' | 'rapat' | 'daftar_hadir' | 'ttd'
  const [activeTab, setActiveTab] = useState<'notula' | 'rapat' | 'daftar_hadir' | 'ttd'>('notula');

  // --- State Fields ---
  // 1. Notula & Common Info
  const [namaKonseli, setNamaKonseli] = useState('');
  const [kelasTa, setKelasTa] = useState('');
  const [selectedKelas, setSelectedKelas] = useState('');
  const [selectedTahunAjaran, setSelectedTahunAjaran] = useState('2026/2027');

  const handleSelectKelas = (k: string) => {
    setSelectedKelas(k);
    if (k && selectedTahunAjaran) {
      setKelasTa(`${k} / ${selectedTahunAjaran}`);
    } else if (k) {
      setKelasTa(k);
    }
  };

  const handleSelectTahunAjaran = (ta: string) => {
    setSelectedTahunAjaran(ta);
    if (selectedKelas && ta) {
      setKelasTa(`${selectedKelas} / ${ta}`);
    } else if (ta) {
      setKelasTa(ta);
    }
  };
  const [jenisMasalah, setJenisMasalah] = useState('');
  const [tanggalKejadian, setTanggalKejadian] = useState(new Date().toISOString().slice(0, 10));
  const [jamKejadian, setJamKejadian] = useState('10.30 WIB');
  const [hariTglJam, setHariTglJam] = useState(formatHariTanggalJam(new Date().toISOString().slice(0, 10), '10.30 WIB'));

  const updateHariTglJam = (tgl: string, jam: string) => {
    const formatted = formatHariTanggalJam(tgl, jam);
    setHariTglJam(formatted);
    // Keep rapatDimulaiPukul aligned if appropriate
    if (jam.trim()) {
      setRapatDimulaiPukul(jam.trim());
    }
  };
  const [pemanduKonferensi, setPemanduKonferensi] = useState('Konselor Sekolah');
  const [pemanduNama, setPemanduNama] = useState('Wiwik Ismiati, S.Pd');
  const [pemanduJabatan, setPemanduJabatan] = useState('Konselor');
  const [dataInginDiperoleh, setDataInginDiperoleh] = useState('');
  const [uraianKegiatanInti, setUraianKegiatanInti] = useState('');
  const [dataDiperolehSimpulan, setDataDiperolehSimpulan] = useState('');
  const [keterpenuhanKebutuhanData, setKeterpenuhanKebutuhanData] = useState('terpenuhi');
  const [rujukanPelayanan, setRujukanPelayanan] = useState('Guru Mata Pelajaran, Wali Kelas, Konselor Sekolah');

  // 2. Notulen Rapat
  const [rapatNamaSekolah, setRapatNamaSekolah] = useState('UPT SMPN 7 PASURUAN');
  const [rapatAlamat, setRapatAlamat] = useState('Jl. Simpang Slamet Riadi No.2 Sebani Gadingrejo');
  const [rapatTempat, setRapatTempat] = useState('UPT SMPN 7 PASURUAN');
  const [rapatKetua, setRapatKetua] = useState('Konselor');
  const [rapatJumlahHadir, setRapatJumlahHadir] = useState('5 orang');
  const [rapatDimulaiPukul, setRapatDimulaiPukul] = useState('10.30 WIB');
  const [rapatDiakhiriPukul, setRapatDiakhiriPukul] = useState('11.00 WIB');
  const [rapatHasilPertemuan, setRapatHasilPertemuan] = useState('');

  // 3. Daftar Hadir
  const [daftarHadirPesertaSingkat, setDaftarHadirPesertaSingkat] = useState('');
  const [daftarHadirRows, setDaftarHadirRows] = useState<DaftarHadirRow[]>(DEFAULT_ROWS);

  // Meta & Signatures
  const [tanggalSurat, setTanggalSurat] = useState(new Date().toISOString().slice(0, 10));
  const [tempatSurat, setTempatSurat] = useState('Pasuruan');
  const [namaGuruBk, setNamaGuruBk] = useState(getActiveGuruBK().nama);
  const [nipGuruBk, setNipGuruBk] = useState(getActiveGuruBK().nip);
  const [namaKepalaSekolah, setNamaKepalaSekolah] = useState('NUR FADILAH, S.Pd,. M.Pd');
  const [nipKepalaSekolah, setNipKepalaSekolah] = useState('19860410 201001 2 030');
  const [keterangan, setKeterangan] = useState('');

  const [autoUpdatedNotice, setAutoUpdatedNotice] = useState(false);
  const [showTujuanModal, setShowTujuanModal] = useState(false);
  const [searchTujuanPreset, setSearchTujuanPreset] = useState('');
  const [selectedTujuanId, setSelectedTujuanId] = useState<string | null>(null);

  const [showUraianModal, setShowUraianModal] = useState(false);
  const [searchUraianPreset, setSearchUraianPreset] = useState('');
  const [selectedUraianId, setSelectedUraianId] = useState<string | null>(null);

  const [showKesimpulanModal, setShowKesimpulanModal] = useState(false);
  const [searchKesimpulanPreset, setSearchKesimpulanPreset] = useState('');
  const [selectedKesimpulanId, setSelectedKesimpulanId] = useState<string | null>(null);

  const [showKeputusanModal, setShowKeputusanModal] = useState(false);
  const [searchKeputusanPreset, setSearchKeputusanPreset] = useState('');
  const [selectedKeputusanId, setSelectedKeputusanId] = useState<string | null>(null);

  // Popup Modal Pemilihan Siswa & Kelas untuk Daftar Hadir
  const [showSiswaModalDaftarHadir, setShowSiswaModalDaftarHadir] = useState(false);
  const [targetRowIndexForSiswa, setTargetRowIndexForSiswa] = useState<number | null>(null);
  const [modalSiswaFilterKelas, setModalSiswaFilterKelas] = useState<string>('Semua Kelas');
  const [modalSiswaSearchQuery, setModalSiswaSearchQuery] = useState<string>('');
  const [modalSelectedStudentIds, setModalSelectedStudentIds] = useState<string[]>([]);

  // Daftar opsi kelas yang tersedia
  const classOptions = useMemo(() => {
    const DEFAULT_CLASSES = [
      '7A', '7B', '7C', '7D', '7E', '7F', '7G', '7H',
      '8A', '8B', '8C', '8D', '8E', '8F', '8G', '8H',
      '9A', '9B', '9C', '9D', '9E', '9F', '9G', '9H'
    ];
    const fromItems = (siswaItems || [])
      .map((s) => (s.kelas || '').trim())
      .filter((k) => k.length > 0);
    const set = new Set<string>();
    fromItems.forEach((k) => set.add(k));
    DEFAULT_CLASSES.forEach((k) => set.add(k));
    return Array.from(set).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }, [siswaItems]);

  // Filter daftar siswa pada modal
  const filteredStudentsInDaftarHadirModal = useMemo(() => {
    let list = siswaItems || [];
    if (modalSiswaFilterKelas && modalSiswaFilterKelas !== 'Semua Kelas' && modalSiswaFilterKelas !== 'ALL') {
      const targetClean = modalSiswaFilterKelas.toLowerCase().replace(/[\s\-_]/g, '');
      list = list.filter((s) => {
        const kClean = (s.kelas || '').toLowerCase().replace(/[\s\-_]/g, '');
        return kClean.includes(targetClean) || targetClean.includes(kClean);
      });
    }
    if (modalSiswaSearchQuery.trim()) {
      const q = modalSiswaSearchQuery.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.nama_siswa.toLowerCase().includes(q) ||
          (s.nis && s.nis.toLowerCase().includes(q)) ||
          (s.kelas && s.kelas.toLowerCase().includes(q))
      );
    }
    return list;
  }, [siswaItems, modalSiswaFilterKelas, modalSiswaSearchQuery]);

  const handleSelectTujuanPreset = (preset: TujuanKonferensiPreset) => {
    setDataInginDiperoleh(preset.deskripsi);
    setSelectedTujuanId(preset.id);
    if (!jenisMasalah || jenisMasalah.trim() === '') {
      setJenisMasalah(preset.judul);
    }
    setShowTujuanModal(false);
  };

  const handleSelectUraianPreset = (preset: UraianKegiatanPreset) => {
    setUraianKegiatanInti(preset.fullText);
    setSelectedUraianId(preset.id);
    if (!jenisMasalah || jenisMasalah.trim() === '') {
      setJenisMasalah(preset.judul.replace(' (Perundungan)', '').replace(' (Pencurian)', ''));
    }
    setShowUraianModal(false);
  };

  const handleSelectKesimpulanPreset = (preset: KesimpulanDataPreset) => {
    setDataDiperolehSimpulan(preset.fullText);
    setSelectedKesimpulanId(preset.id);
    if (!jenisMasalah || jenisMasalah.trim() === '') {
      setJenisMasalah(preset.judul.replace(' (Perundungan)', '').replace(' (Pencurian)', ''));
    }
    setShowKesimpulanModal(false);
  };

  const handleSelectKeputusanPreset = (preset: KeputusanRapatPreset) => {
    setRapatHasilPertemuan(preset.fullText);
    setSelectedKeputusanId(preset.id);
    if (!jenisMasalah || jenisMasalah.trim() === '') {
      setJenisMasalah(preset.judul.replace(' (Bullying)', '').replace(' (Perundungan)', '').replace(' (Pencurian)', ''));
    }
    setShowKeputusanModal(false);
  };

  const filteredTujuanPresets = PRESET_TUJUAN_KONFERENSI.filter((p) => {
    if (!searchTujuanPreset.trim()) return true;
    const query = searchTujuanPreset.toLowerCase();
    return (
      p.judul.toLowerCase().includes(query) ||
      p.kategori.toLowerCase().includes(query) ||
      p.deskripsi.toLowerCase().includes(query)
    );
  });

  const filteredUraianPresets = PRESET_URAIAN_KEGIATAN.filter((p) => {
    if (!searchUraianPreset.trim()) return true;
    const query = searchUraianPreset.toLowerCase();
    return (
      p.judul.toLowerCase().includes(query) ||
      p.kategori.toLowerCase().includes(query) ||
      p.fullText.toLowerCase().includes(query)
    );
  });

  const filteredKesimpulanPresets = PRESET_KESIMPULAN_DATA.filter((p) => {
    if (!searchKesimpulanPreset.trim()) return true;
    const query = searchKesimpulanPreset.toLowerCase();
    return (
      p.judul.toLowerCase().includes(query) ||
      p.kategori.toLowerCase().includes(query) ||
      p.kesimpulan.toLowerCase().includes(query) ||
      p.data.toLowerCase().includes(query) ||
      p.fullText.toLowerCase().includes(query)
    );
  });

  const filteredKeputusanPresets = PRESET_KEPUTUSAN_RAPAT.filter((p) => {
    if (!searchKeputusanPreset.trim()) return true;
    const query = searchKeputusanPreset.toLowerCase();
    return (
      p.judul.toLowerCase().includes(query) ||
      p.kategori.toLowerCase().includes(query) ||
      p.jalannyaRapat.toLowerCase().includes(query) ||
      p.hasilKeputusan.toLowerCase().includes(query) ||
      p.fullText.toLowerCase().includes(query)
    );
  });

  // Load Initial Data
  useEffect(() => {
    if (initialData) {
      setNamaKonseli(initialData.nama_konseli || '');
      setKelasTa(initialData.kelas_ta || '');
      setJenisMasalah(initialData.jenis_masalah || '');

      const parsedTgl = parseHariTglJam(initialData.hari_tgl_jam || '');
      setTanggalKejadian(parsedTgl.date);
      setJamKejadian(parsedTgl.time);
      setHariTglJam(initialData.hari_tgl_jam || formatHariTanggalJam(parsedTgl.date, parsedTgl.time));

      setPemanduKonferensi(initialData.pemandu_konferensi || 'Konselor Sekolah');
      setPemanduNama(initialData.pemandu_nama || '');
      setPemanduJabatan(initialData.pemandu_jabatan || '');
      setDataInginDiperoleh(initialData.data_ingin_diperoleh || '');
      setUraianKegiatanInti(initialData.uraian_kegiatan_inti || '');
      setDataDiperolehSimpulan(initialData.data_diperoleh_simpulan || '');
      setKeterpenuhanKebutuhanData(initialData.keterpenuhan_kebutuhan_data || 'terpenuhi');
      setRujukanPelayanan(initialData.rujukan_pelayanan || 'Guru Mata Pelajaran, Wali Kelas, Konselor Sekolah');

      setRapatNamaSekolah(initialData.rapat_nama_sekolah || 'UPT SMPN 7 PASURUAN');
      setRapatAlamat(initialData.rapat_alamat || 'Jl. Simpang Slamet Riadi No.2 Sebani Gadingrejo');
      setRapatTempat(initialData.rapat_tempat || 'UPT SMPN 7 PASURUAN');
      setRapatKetua(initialData.rapat_ketua || 'Konselor');
      setRapatJumlahHadir(initialData.rapat_jumlah_hadir || '');
      setRapatDimulaiPukul(initialData.rapat_dimulai_pukul || parsedTgl.time || '10.30 WIB');
      setRapatDiakhiriPukul(initialData.rapat_diakhiri_pukul || '11.00 WIB');
      setRapatHasilPertemuan(initialData.rapat_hasil_pertemuan || '');

      setDaftarHadirPesertaSingkat(initialData.daftar_hadir_peserta_singkat || '');
      if (initialData.daftar_hadir_rows) {
        try {
          setDaftarHadirRows(JSON.parse(initialData.daftar_hadir_rows));
        } catch {
          setDaftarHadirRows(DEFAULT_ROWS);
        }
      } else {
        setDaftarHadirRows(DEFAULT_ROWS);
      }

      setTanggalSurat(initialData.tanggal_surat || new Date().toISOString().slice(0, 10));
      setTempatSurat(initialData.tempat_surat || 'Pasuruan');
      setNamaGuruBk(initialData.nama_guru_bk || getActiveGuruBK().nama);
      setNipGuruBk(initialData.nip_guru_bk || getActiveGuruBK().nip);
      setNamaKepalaSekolah(initialData.nama_kepala_sekolah || 'NUR FADILAH, S.Pd,. M.Pd');
      setNipKepalaSekolah(initialData.nip_kepala_sekolah || '19860410 201001 2 030');
      setKeterangan(initialData.keterangan || '');
    }
  }, [initialData]);

  const updateSummaryFromRows = (rows: DaftarHadirRow[]) => {
    const count = rows.length;
    setRapatJumlahHadir(`${count} orang`);

    const names = rows
      .map((row, idx) => {
        const clsSuffix = row.kelas && row.kelas !== '-' ? ` (${row.kelas})` : '';
        return `${idx + 1}. ${row.nama || '...'}${clsSuffix}`;
      })
      .filter(n => !n.includes('...'))
      .join(', ');
    setDaftarHadirPesertaSingkat(names);
  };

  // Participant inline edit helpers
  const handleAddParticipant = () => {
    const newNo = daftarHadirRows.length + 1;
    const newRow: DaftarHadirRow = {
      no: newNo,
      nama: '',
      jabatan: '',
      kelas: '',
      asal_sekolah: rapatNamaSekolah || 'UPT SMPN 7 Pasuruan',
      ttd: 'Ada'
    };
    const updated = [...daftarHadirRows, newRow];
    setDaftarHadirRows(updated);
    updateSummaryFromRows(updated);
  };

  const handleAddParticipantWithData = (nama: string, jabatan: string, kelas: string = '', asal: string = '') => {
    const newNo = daftarHadirRows.length + 1;
    const newRow: DaftarHadirRow = {
      no: newNo,
      nama: nama.trim(),
      jabatan: jabatan.trim(),
      kelas: kelas.trim(),
      asal_sekolah: (asal || rapatNamaSekolah || 'UPT SMPN 7 Pasuruan').trim(),
      ttd: 'Ada'
    };
    const updated = [...daftarHadirRows, newRow];
    setDaftarHadirRows(updated);
    updateSummaryFromRows(updated);
  };

  const handleResetToDefaultParticipants = () => {
    setDaftarHadirRows(DEFAULT_ROWS);
    updateSummaryFromRows(DEFAULT_ROWS);
  };

  const handleRemoveParticipant = (index: number) => {
    const updated = daftarHadirRows.filter((_, idx) => idx !== index).map((row, idx) => ({
      ...row,
      no: idx + 1
    }));
    setDaftarHadirRows(updated);
    updateSummaryFromRows(updated);
  };

  const handleRowChange = (index: number, field: keyof DaftarHadirRow, value: string | number) => {
    const updated = [...daftarHadirRows];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    setDaftarHadirRows(updated);
    updateSummaryFromRows(updated);
  };

  // Popup Modal Handlers for Student & Class Selection in Daftar Hadir
  const handleOpenSiswaModalForNewRow = () => {
    setTargetRowIndexForSiswa(null);
    setModalSelectedStudentIds([]);
    setModalSiswaSearchQuery('');
    if (selectedKelas && selectedKelas !== 'Semua Kelas') {
      setModalSiswaFilterKelas(selectedKelas);
    } else {
      setModalSiswaFilterKelas('Semua Kelas');
    }
    setShowSiswaModalDaftarHadir(true);
  };

  const handleOpenSiswaModalForRow = (rowIndex: number) => {
    setTargetRowIndexForSiswa(rowIndex);
    setModalSelectedStudentIds([]);
    setModalSiswaSearchQuery('');
    const row = daftarHadirRows[rowIndex];
    if (row && row.kelas && row.kelas !== '-') {
      setModalSiswaFilterKelas(row.kelas);
    } else if (selectedKelas && selectedKelas !== 'Semua Kelas') {
      setModalSiswaFilterKelas(selectedKelas);
    } else {
      setModalSiswaFilterKelas('Semua Kelas');
    }
    setShowSiswaModalDaftarHadir(true);
  };

  const handleToggleStudentInDaftarHadirModal = (student: Siswa) => {
    if (modalSelectedStudentIds.includes(student.id)) {
      setModalSelectedStudentIds((prev) => prev.filter((id) => id !== student.id));
    } else {
      setModalSelectedStudentIds((prev) => [...prev, student.id]);
    }
  };

  const handleSelectAllVisibleStudentsInDaftarHadirModal = () => {
    const visibleIds = filteredStudentsInDaftarHadirModal.map((s) => s.id);
    const allSelected = visibleIds.every((id) => modalSelectedStudentIds.includes(id));
    if (allSelected) {
      setModalSelectedStudentIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      const merged = new Set([...modalSelectedStudentIds, ...visibleIds]);
      setModalSelectedStudentIds(Array.from(merged));
    }
  };

  const handleSelectSingleStudentForDaftarHadir = (student: Siswa) => {
    if (targetRowIndexForSiswa !== null && targetRowIndexForSiswa >= 0 && targetRowIndexForSiswa < daftarHadirRows.length) {
      const updated = [...daftarHadirRows];
      const existing = updated[targetRowIndexForSiswa];
      updated[targetRowIndexForSiswa] = {
        ...existing,
        nama: student.nama_siswa,
        kelas: student.kelas || existing.kelas || '-',
        jabatan: existing.jabatan && existing.jabatan !== '-' ? existing.jabatan : 'Siswa / Konseli',
        asal_sekolah: existing.asal_sekolah && existing.asal_sekolah !== '-' ? existing.asal_sekolah : (rapatNamaSekolah || 'UPT SMPN 7 Pasuruan'),
        ttd: existing.ttd || 'Ada'
      };
      setDaftarHadirRows(updated);
      updateSummaryFromRows(updated);
    } else {
      const newNo = daftarHadirRows.length + 1;
      const newRow: DaftarHadirRow = {
        no: newNo,
        nama: student.nama_siswa,
        jabatan: 'Siswa / Konseli',
        kelas: student.kelas || '-',
        asal_sekolah: rapatNamaSekolah || 'UPT SMPN 7 Pasuruan',
        ttd: 'Ada'
      };
      const updated = [...daftarHadirRows, newRow];
      setDaftarHadirRows(updated);
      updateSummaryFromRows(updated);
    }
    setShowSiswaModalDaftarHadir(false);
  };

  const handleApplySelectedStudentsForDaftarHadir = () => {
    const chosen = (siswaItems || []).filter((s) => modalSelectedStudentIds.includes(s.id));
    if (chosen.length === 0) {
      setShowSiswaModalDaftarHadir(false);
      return;
    }

    if (targetRowIndexForSiswa !== null && targetRowIndexForSiswa >= 0 && targetRowIndexForSiswa < daftarHadirRows.length && chosen.length === 1) {
      handleSelectSingleStudentForDaftarHadir(chosen[0]);
      return;
    }

    let updated = [...daftarHadirRows];
    chosen.forEach((student) => {
      const newNo = updated.length + 1;
      updated.push({
        no: newNo,
        nama: student.nama_siswa,
        jabatan: 'Siswa / Konseli',
        kelas: student.kelas || '-',
        asal_sekolah: rapatNamaSekolah || 'UPT SMPN 7 Pasuruan',
        ttd: 'Ada'
      });
    });

    updated = updated.map((r, idx) => ({ ...r, no: idx + 1 }));
    setDaftarHadirRows(updated);
    updateSummaryFromRows(updated);
    setShowSiswaModalDaftarHadir(false);
  };

  const handleFillFromKonseli = () => {
    if (!namaKonseli) return;
    const cleanKelas = selectedKelas || (kelasTa.split('/')[0] || '').trim() || '-';
    
    // Find if there is an existing student matching or use row 4 / target row
    let targetIdx = targetRowIndexForSiswa;
    if (targetIdx === null) {
      // Find row with 'Siswa' in jabatan or generic 'Siswa Bersangkutan'
      const foundIdx = daftarHadirRows.findIndex((r) => 
        r.nama.toLowerCase().includes('siswa bersangkutan') ||
        r.jabatan.toLowerCase().includes('siswa') ||
        r.jabatan.toLowerCase().includes('konseli')
      );
      if (foundIdx !== -1) {
        targetIdx = foundIdx;
      }
    }

    if (targetIdx !== null && targetIdx >= 0 && targetIdx < daftarHadirRows.length) {
      const updated = [...daftarHadirRows];
      updated[targetIdx] = {
        ...updated[targetIdx],
        nama: namaKonseli,
        kelas: cleanKelas,
        jabatan: 'Siswa / Konseli',
        asal_sekolah: rapatNamaSekolah || 'UPT SMPN 7 Pasuruan',
        ttd: 'Ada'
      };
      setDaftarHadirRows(updated);
      updateSummaryFromRows(updated);
    } else {
      const newNo = daftarHadirRows.length + 1;
      const newRow: DaftarHadirRow = {
        no: newNo,
        nama: namaKonseli,
        jabatan: 'Siswa / Konseli',
        kelas: cleanKelas,
        asal_sekolah: rapatNamaSekolah || 'UPT SMPN 7 Pasuruan',
        ttd: 'Ada'
      };
      const updated = [...daftarHadirRows, newRow];
      setDaftarHadirRows(updated);
      updateSummaryFromRows(updated);
    }
    setShowSiswaModalDaftarHadir(false);
  };

  const resetForm = () => {
    setNamaKonseli('');
    setKelasTa('');
    setJenisMasalah('');
    
    const today = new Date().toISOString().slice(0, 10);
    setTanggalKejadian(today);
    setJamKejadian('10.30 WIB');
    setHariTglJam(formatHariTanggalJam(today, '10.30 WIB'));

    setPemanduKonferensi('Konselor Sekolah');
    setPemanduNama('Wiwik Ismiati, S.Pd');
    setPemanduJabatan('Konselor');
    setDataInginDiperoleh('');
    setUraianKegiatanInti('');
    setDataDiperolehSimpulan('');
    setKeterpenuhanKebutuhanData('terpenuhi');
    setRujukanPelayanan('Guru Mata Pelajaran, Wali Kelas, Konselor Sekolah');

    setRapatNamaSekolah('UPT SMPN 7 PASURUAN');
    setRapatAlamat('Jl. Simpang Slamet Riadi No.2 Sebani Gadingrejo');
    setRapatTempat('UPT SMPN 7 PASURUAN');
    setRapatKetua('Konselor');
    setRapatJumlahHadir('5 orang');
    setRapatDimulaiPukul('10.30 WIB');
    setRapatDiakhiriPukul('11.00 WIB');
    setRapatHasilPertemuan('');

    setDaftarHadirPesertaSingkat('');
    setDaftarHadirRows(DEFAULT_ROWS);

    setTanggalSurat(new Date().toISOString().slice(0, 10));
    setTempatSurat('Pasuruan');
    setNamaGuruBk(getActiveGuruBK().nama);
    setNipGuruBk(getActiveGuruBK().nip);
    setNamaKepalaSekolah('NUR FADILAH, S.Pd,. M.Pd');
    setNipKepalaSekolah('19860410 201001 2 030');
    setKeterangan('');
    setActiveTab('notula');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaKonseli.trim()) {
      alert('Nama Siswa / Konseli wajib diisi.');
      return;
    }

    const payload: Partial<KonferensiKasus> & FormKonferensiKasusData = {
      ...(initialData?.id ? { id: initialData.id } : {}),
      nama_konseli: namaKonseli.trim(),
      kelas_ta: kelasTa.trim(),
      jenis_masalah: jenisMasalah.trim(),
      hari_tgl_jam: hariTglJam.trim(),
      pemandu_konferensi: pemanduKonferensi.trim(),
      pemandu_nama: pemanduNama.trim(),
      pemandu_jabatan: pemanduJabatan.trim(),
      data_ingin_diperoleh: dataInginDiperoleh.trim(),
      uraian_kegiatan_inti: uraianKegiatanInti.trim(),
      data_diperoleh_simpulan: dataDiperolehSimpulan.trim(),
      keterpenuhan_kebutuhan_data: keterpenuhanKebutuhanData,
      rujukan_pelayanan: rujukanPelayanan.trim(),

      rapat_nama_sekolah: rapatNamaSekolah.trim(),
      rapat_alamat: rapatAlamat.trim(),
      rapat_tempat: rapatTempat.trim(),
      rapat_ketua: rapatKetua.trim(),
      rapat_jumlah_hadir: rapatJumlahHadir.trim(),
      rapat_dimulai_pukul: rapatDimulaiPukul.trim(),
      rapat_diakhiri_pukul: rapatDiakhiriPukul.trim(),
      rapat_hasil_pertemuan: rapatHasilPertemuan.trim(),

      daftar_hadir_peserta_singkat: daftarHadirPesertaSingkat.trim() || 
        daftarHadirRows.map((row, idx) => `${idx + 1}. ${row.nama || '...'}`).join(', '),
      daftar_hadir_rows: JSON.stringify(daftarHadirRows),

      tanggal_surat: tanggalSurat || new Date().toISOString().slice(0, 10),
      tempat_surat: tempatSurat.trim() || 'Pasuruan',
      nama_guru_bk: namaGuruBk.trim(),
      nip_guru_bk: nipGuruBk.trim(),
      nama_kepala_sekolah: namaKepalaSekolah.trim(),
      nip_kepala_sekolah: nipKepalaSekolah.trim(),
      keterangan: keterangan.trim(),
    };

    await onSubmit(payload);
    if (!initialData) {
      resetForm();
    }
  };

  return (
    <div className="bg-slate-50/50 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-600 text-white rounded-lg">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {initialData ? 'Edit Data Konferensi Kasus' : 'Buat Baru Data Konferensi Kasus'}
            </h2>
            <p className="text-xs text-slate-500">
              Satu formulir terpadu mencakup Notula, Notulen Rapat, dan Daftar Hadir Konferensi Kasus.
            </p>
          </div>
        </div>

        {/* Quick Header Save Action Button */}
        <div className="flex items-center gap-2">
          {onCancelEdit && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl border transition-all"
            >
              Batal
            </button>
          )}
          <button
            type="button"
            onClick={(e) => {
              handleSubmit(e as unknown as React.FormEvent);
            }}
            disabled={isSubmitting}
            className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md hover:shadow-rose-500/20 disabled:opacity-50 transition-all cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Sekarang</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-1 mb-6 bg-slate-100 p-1.5 rounded-xl border border-slate-200/80">
        <button
          type="button"
          onClick={() => setActiveTab('notula')}
          className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'notula'
              ? 'bg-white text-rose-700 shadow-md shadow-slate-200/50 border border-rose-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          1. Notula Konferensi
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('rapat')}
          className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'rapat'
              ? 'bg-white text-rose-700 shadow-md shadow-slate-200/50 border border-rose-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Calendar className="w-4 h-4" />
          2. Notulen Rapat
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('daftar_hadir')}
          className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'daftar_hadir'
              ? 'bg-white text-rose-700 shadow-md shadow-slate-200/50 border border-rose-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          3. Daftar Hadir
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('ttd')}
          className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'ttd'
              ? 'bg-white text-rose-700 shadow-md shadow-slate-200/50 border border-rose-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Tanda Tangan & Meta
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* --- SECTION 1: NOTULA --- */}
        {activeTab === 'notula' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-700 border-b pb-2 mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-rose-600" />
                Informasi Siswa (Konseli) & Kasus
              </h3>
              
              <SiswaSelector
                siswaItems={siswaItems}
                selectedKelas={selectedKelas}
                onSelectKelas={handleSelectKelas}
                selectedTahunAjaran={selectedTahunAjaran}
                onSelectTahunAjaran={handleSelectTahunAjaran}
                showTahunAjaran={true}
                selectedNamaSiswa={namaKonseli}
                onSelectNamaSiswa={(val) => setNamaKonseli(val)}
                isMultiSelect={true}
                kelasLabel="Kelas Siswa"
                taLabel="Tahun Ajaran"
                siswaLabel="Nama Siswa (Konseli)"
                themeColor="rose"
                required={true}
              />

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Jenis Masalah / Deskripsi Singkat Kasus
                  </label>
                  <input
                    type="text"
                    value={jenisMasalah}
                    onChange={(e) => setJenisMasalah(e.target.value)}
                    placeholder="e.g. Berkelahi karena salah paham"
                    className="w-full text-xs rounded-xl border-slate-200 focus:border-rose-500 focus:ring-rose-500 px-3.5 py-2 border outline-none"
                  />
                </div>
              </div>

              {/* Kalender & Jam Kejadian / Pelaksanaan Konferensi */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50/80 via-amber-50/40 to-slate-50 border border-rose-200/90 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-rose-600" />
                    <span>Hari, Tanggal &amp; Jam Kejadian / Pelaksanaan Konferensi</span>
                    <span className="text-rose-600 font-bold">*</span>
                  </label>
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-100/90 px-2.5 py-0.5 rounded-full border border-rose-200 shadow-2xs">
                    📅 Kalender &amp; Jam Otomatis
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* 1. Pemilih Tanggal (Kalender) */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-rose-600" />
                        PILIH TANGGAL (KALENDER) <span className="text-rose-600 font-bold">*</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const today = new Date().toISOString().slice(0, 10);
                          setTanggalKejadian(today);
                          updateHariTglJam(today, jamKejadian);
                        }}
                        className="text-[10px] text-rose-600 hover:text-rose-800 font-bold hover:underline cursor-pointer bg-white px-2 py-0.5 rounded-md border border-rose-200"
                      >
                        Hari Ini
                      </button>
                    </label>
                    <input
                      type="date"
                      value={tanggalKejadian}
                      onChange={(e) => {
                        setTanggalKejadian(e.target.value);
                        updateHariTglJam(e.target.value, jamKejadian);
                      }}
                      required
                      className="w-full text-xs font-medium rounded-xl border-slate-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 px-3.5 py-2.5 bg-white border outline-none shadow-2xs cursor-pointer"
                    />
                  </div>

                  {/* 2. Pemilih Jam Kejadian */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>JAM KEJADIAN / WAKTU</span>
                    </label>
                    <input
                      type="text"
                      value={jamKejadian}
                      onChange={(e) => {
                        setJamKejadian(e.target.value);
                        updateHariTglJam(tanggalKejadian, e.target.value);
                      }}
                      placeholder="Contoh: 10.30 WIB atau 09.00 WIB"
                      className="w-full text-xs font-medium rounded-xl border-slate-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 px-3.5 py-2.5 bg-white border outline-none shadow-2xs"
                    />
                  </div>
                </div>

                {/* Quick Chip Presets for Jam */}
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tombol Jam Cepat:</span>
                  {['08.00 WIB', '09.00 WIB', '09.30 WIB', '10.30 WIB', '11.00 WIB', '12.30 WIB', '13.00 WIB'].map((presetTime) => (
                    <button
                      key={presetTime}
                      type="button"
                      onClick={() => {
                        setJamKejadian(presetTime);
                        updateHariTglJam(tanggalKejadian, presetTime);
                      }}
                      className={`text-[10px] px-2.5 py-1 rounded-lg border font-semibold transition-all cursor-pointer ${
                        jamKejadian === presetTime
                          ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                          : 'bg-white hover:bg-rose-50 text-slate-700 border-slate-200 hover:border-rose-300'
                      }`}
                    >
                      {presetTime}
                    </button>
                  ))}
                </div>

                {/* Live Hasil Format Output */}
                <div className="p-2.5 bg-white rounded-xl border border-rose-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-bold text-slate-500 shrink-0">Hasil Hari, Tanggal &amp; Jam:</span>
                    <span className="font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                      {hariTglJam || '-'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        const custom = prompt('Ubah teks format hari, tanggal & jam secara manual:', hariTglJam);
                        if (custom !== null) {
                          setHariTglJam(custom);
                        }
                      }}
                      className="text-[10px] text-slate-500 hover:text-slate-800 underline font-medium cursor-pointer"
                    >
                      Edit Manual Teks
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Pemandu Konferensi
                  </label>
                  <input
                    type="text"
                    value={pemanduKonferensi}
                    onChange={(e) => setPemanduKonferensi(e.target.value)}
                    placeholder="e.g. Konselor Sekolah"
                    className="w-full text-xs rounded-xl border-slate-200 focus:border-rose-500 focus:ring-rose-500 px-3.5 py-2 border outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Nama Pemandu
                  </label>
                  <input
                    type="text"
                    value={pemanduNama}
                    onChange={(e) => setPemanduNama(e.target.value)}
                    placeholder="e.g. Wiwik Ismiati, S.Pd"
                    className="w-full text-xs rounded-xl border-slate-200 focus:border-rose-500 focus:ring-rose-500 px-3.5 py-2 border outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Jabatan Pemandu
                  </label>
                  <input
                    type="text"
                    value={pemanduJabatan}
                    onChange={(e) => setPemanduJabatan(e.target.value)}
                    placeholder="e.g. Konselor"
                    className="w-full text-xs rounded-xl border-slate-200 focus:border-rose-500 focus:ring-rose-500 px-3.5 py-2 border outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-700 border-b pb-2 mb-3">
                Proses & Hasil Notula
              </h3>

              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-rose-600" />
                    <span>Data yang Ingin Diperoleh (Tujuan Konferensi)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTujuanPreset('');
                      setShowTujuanModal(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-500/20 transition-all cursor-pointer active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                    <span>Buka Popup Pilihan Tujuan (6 Kasus)</span>
                  </button>
                </div>

                {/* Dropdown Menu Langsung */}
                <div className="mb-2.5">
                  <select
                    value={PRESET_TUJUAN_KONFERENSI.find((p) => p.deskripsi === dataInginDiperoleh)?.id || ''}
                    onChange={(e) => {
                      const selected = PRESET_TUJUAN_KONFERENSI.find((p) => p.id === e.target.value);
                      if (selected) {
                        handleSelectTujuanPreset(selected);
                      }
                    }}
                    className="w-full text-xs font-medium bg-rose-50/60 hover:bg-rose-50 text-slate-800 rounded-xl border border-rose-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 px-3 py-2.5 outline-none cursor-pointer"
                  >
                    <option value="" className="text-slate-400">
                      🔽 Klik untuk Pilih Jenis Kasus / Tujuan Konferensi Otomatis...
                    </option>
                    {PRESET_TUJUAN_KONFERENSI.map((preset, idx) => (
                      <option key={preset.id} value={preset.id} className="text-slate-800 py-1">
                        {idx + 1}. {preset.judul} ({preset.kategori})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quick Chip Buttons */}
                <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tombol Cepat:</span>
                  {PRESET_TUJUAN_KONFERENSI.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectTujuanPreset(preset)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border font-semibold transition-all cursor-pointer ${
                        selectedTujuanId === preset.id || dataInginDiperoleh === preset.deskripsi
                          ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                          : 'bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 border-slate-300 hover:border-rose-300'
                      }`}
                    >
                      {preset.judul.replace(' (Bullying)', '').replace(' (Miras)', '').replace(' (Pencurian)', '')}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <textarea
                    rows={4}
                    value={dataInginDiperoleh}
                    onChange={(e) => setDataInginDiperoleh(e.target.value)}
                    placeholder="Contoh: Bertujuan untuk menggali pemicu dan sudut pandang dari kedua belah pihak secara objektif..."
                    className="w-full text-xs rounded-xl border-slate-300 focus:border-rose-500 focus:ring-rose-500 px-3.5 py-2.5 border outline-none leading-relaxed shadow-2xs"
                  />
                  {dataInginDiperoleh && (
                    <button
                      type="button"
                      onClick={() => {
                        setDataInginDiperoleh('');
                        setSelectedTujuanId(null);
                      }}
                      className="absolute right-2.5 bottom-2.5 px-2 py-1 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md font-medium transition-colors cursor-pointer"
                    >
                      Kosongkan Teks
                    </button>
                  )}
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <ClipboardList className="w-4 h-4 text-indigo-600" />
                    <span>Uraian Singkat Kegiatan Inti</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchUraianPreset('');
                      setShowUraianModal(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-500/20 transition-all cursor-pointer active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                    <span>Buka Popup Uraian Kegiatan (6 Kasus)</span>
                  </button>
                </div>

                {/* Dropdown Menu Langsung */}
                <div className="mb-2.5">
                  <select
                    value={PRESET_URAIAN_KEGIATAN.find((p) => p.fullText === uraianKegiatanInti)?.id || ''}
                    onChange={(e) => {
                      const selected = PRESET_URAIAN_KEGIATAN.find((p) => p.id === e.target.value);
                      if (selected) {
                        handleSelectUraianPreset(selected);
                      }
                    }}
                    className="w-full text-xs font-medium bg-indigo-50/60 hover:bg-indigo-50 text-slate-800 rounded-xl border border-indigo-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 px-3 py-2.5 outline-none cursor-pointer"
                  >
                    <option value="" className="text-slate-400">
                      🔽 Klik untuk Pilih Jenis Kasus / Uraian Kegiatan Inti Otomatis...
                    </option>
                    {PRESET_URAIAN_KEGIATAN.map((preset, idx) => (
                      <option key={preset.id} value={preset.id} className="text-slate-800 py-1">
                        {idx + 1}. {preset.judul} ({preset.kategori})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quick Chip Buttons */}
                <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tombol Cepat:</span>
                  {PRESET_URAIAN_KEGIATAN.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectUraianPreset(preset)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border font-semibold transition-all cursor-pointer ${
                        selectedUraianId === preset.id || uraianKegiatanInti === preset.fullText
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border-slate-300 hover:border-indigo-300'
                      }`}
                    >
                      {preset.judul.replace(' (Perundungan)', '').replace(' (Miras)', '').replace(' (Pencurian)', '')}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <textarea
                    rows={6}
                    value={uraianKegiatanInti}
                    onChange={(e) => setUraianKegiatanInti(e.target.value)}
                    placeholder="Contoh: a. Memanggil dan mempertemukan siswa yang berselisih secara terpisah terlebih dahulu..."
                    className="w-full text-xs rounded-xl border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 px-3.5 py-2.5 border outline-none leading-relaxed shadow-2xs font-mono"
                  />
                  {uraianKegiatanInti && (
                    <button
                      type="button"
                      onClick={() => {
                        setUraianKegiatanInti('');
                        setSelectedUraianId(null);
                      }}
                      className="absolute right-2.5 bottom-2.5 px-2 py-1 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md font-medium transition-colors cursor-pointer"
                    >
                      Kosongkan Teks
                    </button>
                  )}
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Kesimpulan / Data yang Diperoleh</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchKesimpulanPreset('');
                      setShowKesimpulanModal(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-500/20 transition-all cursor-pointer active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                    <span>Buka Popup Kesimpulan (6 Kasus)</span>
                  </button>
                </div>

                {/* Dropdown Menu Langsung */}
                <div className="mb-2.5">
                  <select
                    value={PRESET_KESIMPULAN_DATA.find((p) => p.fullText === dataDiperolehSimpulan)?.id || ''}
                    onChange={(e) => {
                      const selected = PRESET_KESIMPULAN_DATA.find((p) => p.id === e.target.value);
                      if (selected) {
                        handleSelectKesimpulanPreset(selected);
                      }
                    }}
                    className="w-full text-xs font-medium bg-emerald-50/60 hover:bg-emerald-50 text-slate-800 rounded-xl border border-emerald-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 px-3 py-2.5 outline-none cursor-pointer"
                  >
                    <option value="" className="text-slate-400">
                      🔽 Klik untuk Pilih Jenis Kasus / Kesimpulan & Data Otomatis...
                    </option>
                    {PRESET_KESIMPULAN_DATA.map((preset, idx) => (
                      <option key={preset.id} value={preset.id} className="text-slate-800 py-1">
                        {idx + 1}. {preset.judul} ({preset.kategori})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quick Chip Buttons */}
                <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tombol Cepat:</span>
                  {PRESET_KESIMPULAN_DATA.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectKesimpulanPreset(preset)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border font-semibold transition-all cursor-pointer ${
                        selectedKesimpulanId === preset.id || dataDiperolehSimpulan === preset.fullText
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border-slate-300 hover:border-emerald-300'
                      }`}
                    >
                      {preset.judul.replace(' (Bullying)', '').replace(' (Miras)', '').replace(' (Pencurian)', '')}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <textarea
                    rows={5}
                    value={dataDiperolehSimpulan}
                    onChange={(e) => setDataDiperolehSimpulan(e.target.value)}
                    placeholder="Contoh: Kesimpulan: Masalah terjadi karena salah paham dan emosi remaja.&#10;&#10;Data: Kedua siswa sepakat berdamai dan berjanji tidak bertengkar lagi."
                    className="w-full text-xs rounded-xl border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 px-3.5 py-2.5 border outline-none leading-relaxed shadow-2xs font-mono"
                  />
                  {dataDiperolehSimpulan && (
                    <button
                      type="button"
                      onClick={() => {
                        setDataDiperolehSimpulan('');
                        setSelectedKesimpulanId(null);
                      }}
                      className="absolute right-2.5 bottom-2.5 px-2 py-1 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md font-medium transition-colors cursor-pointer"
                    >
                      Kosongkan Teks
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Keterpenuhan Kebutuhan Data
                  </label>
                  <select
                    value={keterpenuhanKebutuhanData}
                    onChange={(e) => setKeterpenuhanKebutuhanData(e.target.value)}
                    className="w-full text-xs rounded-xl border-slate-200 focus:border-rose-500 focus:ring-rose-500 px-3 py-2 border outline-none bg-white"
                  >
                    <option value="terpenuhi">Terpenuhi</option>
                    <option value="belum_terpenuhi">Belum Terpenuhi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Rujukan Pelayanan Lanjutan
                  </label>
                  <input
                    type="text"
                    value={rujukanPelayanan}
                    onChange={(e) => setRujukanPelayanan(e.target.value)}
                    placeholder="e.g. Wali Kelas, Guru Mata Pelajaran, Konselor"
                    className="w-full text-xs rounded-xl border-slate-200 focus:border-rose-500 focus:ring-rose-500 px-3.5 py-2 border outline-none"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Dipisahkan dengan koma jika lebih dari satu.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">
              <button
                type="button"
                onClick={(e) => handleSubmit(e as unknown as React.FormEvent)}
                disabled={isSubmitting}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Simpan Langsung
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('rapat')}
                className="w-full sm:w-auto bg-rose-600 text-white font-semibold text-xs px-5 py-2.5 rounded-xl hover:bg-rose-700 shadow transition-all cursor-pointer"
              >
                Lanjut ke Notulen Rapat &gt;
              </button>
            </div>
          </div>
        )}

        {/* --- SECTION 2: NOTULEN RAPAT --- */}
        {activeTab === 'rapat' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-700 border-b pb-2 mb-3">
                Kop & Lokasi Pertemuan Rapat
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Nama Sekolah
                  </label>
                  <input
                    type="text"
                    value={rapatNamaSekolah}
                    onChange={(e) => setRapatNamaSekolah(e.target.value)}
                    placeholder="e.g. UPT SMPN 7 PASURUAN"
                    className="w-full text-xs rounded-xl border-slate-200 focus:border-rose-500 focus:ring-rose-500 px-3.5 py-2 border outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Alamat Sekolah
                  </label>
                  <input
                    type="text"
                    value={rapatAlamat}
                    onChange={(e) => setRapatAlamat(e.target.value)}
                    placeholder="e.g. Jl. Simpang Slamet Riadi No.2 Sebani Gadingrejo"
                    className="w-full text-xs rounded-xl border-slate-200 focus:border-rose-500 focus:ring-rose-500 px-3.5 py-2 border outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Tempat Rapat
                  </label>
                  <input
                    type="text"
                    value={rapatTempat}
                    onChange={(e) => setRapatTempat(e.target.value)}
                    placeholder="e.g. Ruang BK SMPN 7 Pasuruan"
                    className="w-full text-xs rounded-xl border-slate-200 focus:border-rose-500 focus:ring-rose-500 px-3.5 py-2 border outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Ketua Sidang / Rapat
                  </label>
                  <input
                    type="text"
                    value={rapatKetua}
                    onChange={(e) => setRapatKetua(e.target.value)}
                    placeholder="e.g. Konselor Sekolah"
                    className="w-full text-xs rounded-xl border-slate-200 focus:border-rose-500 focus:ring-rose-500 px-3.5 py-2 border outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Jumlah Hadir
                  </label>
                  <input
                    type="text"
                    value={rapatJumlahHadir}
                    onChange={(e) => setRapatJumlahHadir(e.target.value)}
                    placeholder="e.g. 5 orang"
                    className="w-full text-xs rounded-xl border-slate-200 focus:border-rose-500 focus:ring-rose-500 px-3.5 py-2 border outline-none bg-slate-50"
                    readOnly
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Otomatis dihitung dari jumlah Daftar Hadir.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Dimulai Pukul
                  </label>
                  <input
                    type="text"
                    value={rapatDimulaiPukul}
                    onChange={(e) => setRapatDimulaiPukul(e.target.value)}
                    placeholder="e.g. 10.30 WIB"
                    className="w-full text-xs rounded-xl border-slate-200 focus:border-rose-500 focus:ring-rose-500 px-3.5 py-2 border outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Diakhiri Pukul
                  </label>
                  <input
                    type="text"
                    value={rapatDiakhiriPukul}
                    onChange={(e) => setRapatDiakhiriPukul(e.target.value)}
                    placeholder="e.g. 11.00 WIB"
                    className="w-full text-xs rounded-xl border-slate-200 focus:border-rose-500 focus:ring-rose-500 px-3.5 py-2 border outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-700 border-b pb-2 mb-3">
                Hasil Keputusan / Jalannya Rapat
              </h3>

              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-rose-600" />
                    <span>Uraian Hasil Pertemuan Rapat</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchKeputusanPreset('');
                      setShowKeputusanModal(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-500/20 transition-all cursor-pointer active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                    <span>Buka Popup Keputusan Rapat (6 Kasus)</span>
                  </button>
                </div>

                {/* Dropdown Menu Langsung */}
                <div className="mb-2.5">
                  <select
                    value={PRESET_KEPUTUSAN_RAPAT.find((p) => p.fullText === rapatHasilPertemuan)?.id || ''}
                    onChange={(e) => {
                      const selected = PRESET_KEPUTUSAN_RAPAT.find((p) => p.id === e.target.value);
                      if (selected) {
                        handleSelectKeputusanPreset(selected);
                      }
                    }}
                    className="w-full text-xs font-medium bg-rose-50/60 hover:bg-rose-50 text-slate-800 rounded-xl border border-rose-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 px-3 py-2.5 outline-none cursor-pointer"
                  >
                    <option value="" className="text-slate-400">
                      🔽 Klik untuk Pilih Jenis Kasus / Jalannya Rapat & Keputusan Otomatis...
                    </option>
                    {PRESET_KEPUTUSAN_RAPAT.map((preset, idx) => (
                      <option key={preset.id} value={preset.id} className="text-slate-800 py-1">
                        {idx + 1}. {preset.judul} ({preset.kategori})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quick Chip Buttons */}
                <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tombol Cepat:</span>
                  {PRESET_KEPUTUSAN_RAPAT.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectKeputusanPreset(preset)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border font-semibold transition-all cursor-pointer ${
                        selectedKeputusanId === preset.id || rapatHasilPertemuan === preset.fullText
                          ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                          : 'bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 border-slate-300 hover:border-rose-300'
                      }`}
                    >
                      {preset.judul.replace(' (Bullying)', '').replace(' (Miras)', '').replace(' (Pencurian)', '')}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <textarea
                    rows={8}
                    value={rapatHasilPertemuan}
                    onChange={(e) => setRapatHasilPertemuan(e.target.value)}
                    placeholder="a. Jalannya Rapat: Mempertemukan kedua siswa...&#10;&#10;b. Hasil Keputusan: Kedua siswa sepakat berdamai..."
                    className="w-full text-xs font-mono rounded-xl border-slate-300 focus:border-rose-500 focus:ring-rose-500 px-3.5 py-2.5 border outline-none leading-relaxed shadow-2xs"
                  />
                  {rapatHasilPertemuan && (
                    <button
                      type="button"
                      onClick={() => {
                        setRapatHasilPertemuan('');
                        setSelectedKeputusanId(null);
                      }}
                      className="absolute right-2.5 bottom-2.5 px-2 py-1 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md font-medium transition-colors cursor-pointer"
                    >
                      Kosongkan Teks
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Gunakan baris baru (Enter) untuk membedakan butir-butir keputusan agar tercetak rapi.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('notula')}
                className="w-full sm:w-auto bg-slate-200 text-slate-700 font-semibold text-xs px-5 py-2.5 rounded-xl hover:bg-slate-300 transition-all cursor-pointer"
              >
                &lt; Kembali ke Notula
              </button>
              <div className="flex w-full sm:w-auto gap-2">
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e as unknown as React.FormEvent)}
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  Simpan Langsung
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('daftar_hadir')}
                  className="flex-1 sm:flex-initial bg-rose-600 text-white font-semibold text-xs px-5 py-2.5 rounded-xl hover:bg-rose-700 shadow transition-all cursor-pointer"
                >
                  Lanjut ke Daftar Hadir &gt;
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- SECTION 3: DAFTAR HADIR --- */}
        {activeTab === 'daftar_hadir' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 mb-2">
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-rose-600" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <span>Daftar Hadir Peserta Konferensi Kasus</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                        {daftarHadirRows.length} Peserta
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Kelola daftar peserta rapat, peran/jabatan, kelas siswa, dan status tanda tangan kehadiran.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Quick button to use Student from Tab 1 */}
                  {namaKonseli && (
                    <button
                      type="button"
                      onClick={handleFillFromKonseli}
                      className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                      title={`Isi otomatis baris peserta dengan data siswa konseli: ${namaKonseli}`}
                    >
                      <UserCheck className="w-3.5 h-3.5 text-amber-600" />
                      <span>+ Konseli: {namaKonseli.split(' ')[0]}</span>
                    </button>
                  )}

                  {/* POPUP PILIH SISWA & KELAS */}
                  <button
                    type="button"
                    onClick={handleOpenSiswaModalForNewRow}
                    className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white border border-rose-600 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                    title="Buka popup untuk memilih nama siswa dan kelas dari basis data master"
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>+ Pilih Siswa (Popup)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleAddParticipant}
                    className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                    title="Tambah 1 baris kosong untuk diisi manual"
                  >
                    <Plus className="w-3.5 h-3.5 text-slate-700" />
                    <span>+ Tambah Baris Manual</span>
                  </button>
                </div>
              </div>

              {/* Quick Preset Buttons for Common Roles */}
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between gap-2 flex-wrap text-xs">
                <span className="font-bold text-slate-600 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  <span>Tambah Cepat Peran Rapat:</span>
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleAddParticipantWithData(namaGuruBk || getActiveGuruBK().nama, 'Konselor / Guru BK', '-', rapatNamaSekolah || 'UPT SMPN 7 Pasuruan')}
                    className="px-2.5 py-1 bg-white hover:bg-rose-50 hover:text-rose-700 text-slate-700 font-semibold rounded-lg border border-slate-200 text-[11px] transition-all cursor-pointer shadow-2xs"
                  >
                    + Guru BK
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddParticipantWithData('', 'Wali Kelas', selectedKelas || (kelasTa.split('/')[0] || '').trim() || '-', rapatNamaSekolah || 'UPT SMPN 7 Pasuruan')}
                    className="px-2.5 py-1 bg-white hover:bg-rose-50 hover:text-rose-700 text-slate-700 font-semibold rounded-lg border border-slate-200 text-[11px] transition-all cursor-pointer shadow-2xs"
                  >
                    + Wali Kelas
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddParticipantWithData('', 'Guru Mata Pelajaran', '-', rapatNamaSekolah || 'UPT SMPN 7 Pasuruan')}
                    className="px-2.5 py-1 bg-white hover:bg-rose-50 hover:text-rose-700 text-slate-700 font-semibold rounded-lg border border-slate-200 text-[11px] transition-all cursor-pointer shadow-2xs"
                  >
                    + Guru Mapel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddParticipantWithData('', 'Orang Tua / Wali Murid', selectedKelas || (kelasTa.split('/')[0] || '').trim() || '-', 'Wali Murid')}
                    className="px-2.5 py-1 bg-white hover:bg-rose-50 hover:text-rose-700 text-slate-700 font-semibold rounded-lg border border-slate-200 text-[11px] transition-all cursor-pointer shadow-2xs"
                  >
                    + Orang Tua / Wali
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddParticipantWithData(namaKepalaSekolah || 'NUR FADILAH, S.Pd,. M.Pd', 'Kepala Sekolah', '-', rapatNamaSekolah || 'UPT SMPN 7 Pasuruan')}
                    className="px-2.5 py-1 bg-white hover:bg-rose-50 hover:text-rose-700 text-slate-700 font-semibold rounded-lg border border-slate-200 text-[11px] transition-all cursor-pointer shadow-2xs"
                  >
                    + Kepala Sekolah
                  </button>
                  <button
                    type="button"
                    onClick={handleResetToDefaultParticipants}
                    className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg text-[11px] transition-all cursor-pointer ml-1"
                    title="Kembalikan daftar peserta standar (5 baris)"
                  >
                    Reset Standar (5 Peserta)
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto -mx-4 sm:-mx-5">
                <table className="w-full min-w-[680px] border-collapse text-xs text-left">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <th className="p-3 w-12 text-center">No</th>
                      <th className="p-3">Nama Lengkap</th>
                      <th className="p-3">Jabatan / Peran</th>
                      <th className="p-3 w-28 text-center">Kelas</th>
                      <th className="p-3">Instansi / Asal Sekolah</th>
                      <th className="p-3 w-28 text-center">Tanda Tangan</th>
                      <th className="p-3 w-20 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {daftarHadirRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3 text-center text-slate-500 font-bold">{row.no}</td>
                        <td className="p-2">
                          <div className="relative flex items-center">
                            <input
                              type="text"
                              value={row.nama}
                              onChange={(e) => handleRowChange(idx, 'nama', e.target.value)}
                              placeholder="Nama lengkap peserta / nama siswa..."
                              className="w-full text-xs rounded-lg border-slate-300 focus:border-rose-500 focus:ring-rose-500 pl-2.5 pr-8 py-1.5 border outline-none font-semibold text-slate-800 bg-white"
                            />
                            <button
                              type="button"
                              onClick={() => handleOpenSiswaModalForRow(idx)}
                              title="Pilih nama siswa dari basis data master untuk baris ini"
                              className="absolute right-1 text-slate-400 hover:text-rose-600 p-1 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                            >
                              <GraduationCap className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={row.jabatan}
                            onChange={(e) => handleRowChange(idx, 'jabatan', e.target.value)}
                            placeholder="e.g. Konselor / Wali Kelas / Siswa"
                            className="w-full text-xs rounded-lg border-slate-300 focus:border-rose-500 focus:ring-rose-500 px-2.5 py-1.5 border outline-none font-medium text-slate-700 bg-white"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={row.kelas}
                            onChange={(e) => handleRowChange(idx, 'kelas', e.target.value)}
                            placeholder="e.g. 9E atau -"
                            className="w-full text-xs rounded-lg border-slate-300 focus:border-rose-500 focus:ring-rose-500 px-2 py-1.5 border outline-none text-center font-bold text-slate-800 bg-white"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={row.asal_sekolah}
                            onChange={(e) => handleRowChange(idx, 'asal_sekolah', e.target.value)}
                            placeholder="e.g. UPT SMPN 7 Pasuruan"
                            className="w-full text-xs rounded-lg border-slate-300 focus:border-rose-500 focus:ring-rose-500 px-2.5 py-1.5 border outline-none text-slate-700 bg-white"
                          />
                        </td>
                        <td className="p-2">
                          <select
                            value={row.ttd}
                            onChange={(e) => handleRowChange(idx, 'ttd', e.target.value)}
                            className="w-full text-xs rounded-lg border-slate-300 focus:border-rose-500 focus:ring-rose-500 px-2 py-1.5 border outline-none bg-white font-semibold text-slate-800 cursor-pointer"
                          >
                            <option value="Ada">Ada (Hadir)</option>
                            <option value="-">- (Absen)</option>
                          </select>
                        </td>
                        <td className="p-2 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenSiswaModalForRow(idx)}
                              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Pilih Siswa & Kelas untuk baris ini"
                            >
                              <GraduationCap className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveParticipant(idx)}
                              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Hapus baris peserta ini"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {daftarHadirRows.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-xs border border-dashed rounded-xl bg-slate-50 space-y-2">
                  <p className="font-semibold text-slate-600">Belum ada baris peserta konferensi kasus.</p>
                  <div className="flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={handleAddParticipant}
                      className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs shadow-xs cursor-pointer"
                    >
                      + Tambah Baris Pertama
                    </button>
                    <button
                      type="button"
                      onClick={handleResetToDefaultParticipants}
                      className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-bold text-xs cursor-pointer"
                    >
                      Gunakan Format Standar (5 Peserta)
                    </button>
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ringkasan Peserta Hadir (Otomatis untuk tampilan agenda notula)
                </label>
                <input
                  type="text"
                  value={daftarHadirPesertaSingkat}
                  onChange={(e) => setDaftarHadirPesertaSingkat(e.target.value)}
                  placeholder="e.g. 1. Wiwik Ismiati, S.Pd (Guru BK), 2. Nama Wali Kelas, 3. Nama Siswa (9E)..."
                  className="w-full text-xs rounded-xl border-slate-300 focus:border-rose-500 focus:ring-rose-500 px-3.5 py-2 border outline-none font-medium text-slate-800 bg-white"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Kolom ini diperbarui otomatis setiap kali Anda menambah atau mengedit nama di tabel peserta di atas.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('rapat')}
                className="w-full sm:w-auto bg-slate-200 text-slate-700 font-semibold text-xs px-5 py-2.5 rounded-xl hover:bg-slate-300 transition-all cursor-pointer"
              >
                &lt; Kembali ke Notulen Rapat
              </button>
              <div className="flex w-full sm:w-auto gap-2">
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e as unknown as React.FormEvent)}
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  Simpan Langsung
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('ttd')}
                  className="flex-1 sm:flex-initial bg-rose-600 text-white font-semibold text-xs px-5 py-2.5 rounded-xl hover:bg-rose-700 shadow transition-all cursor-pointer"
                >
                  Lanjut ke Penandatangan &gt;
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- SECTION 4: SIGNATURES & META --- */}
        {activeTab === 'ttd' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-700 border-b pb-2 mb-3">
                Waktu & Tempat Penandatanganan
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Tempat Pembuatan Surat / Notula
                  </label>
                  <input
                    type="text"
                    value={tempatSurat}
                    onChange={(e) => setTempatSurat(e.target.value)}
                    placeholder="e.g. Pasuruan"
                    className="w-full text-xs rounded-xl border-slate-200 focus:border-rose-500 focus:ring-rose-500 px-3.5 py-2 border outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Tanggal Surat / Notula
                  </label>
                  <input
                    type="date"
                    value={tanggalSurat}
                    onChange={(e) => setTanggalSurat(e.target.value)}
                    className="w-full text-xs rounded-xl border-slate-200 focus:border-rose-500 focus:ring-rose-500 px-3.5 py-2 border outline-none bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-700 border-b pb-2 mb-3">
                Identitas Pejabat Penandatangan
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Nama Guru BK / Konselor
                  </label>
                  <select
                    value={namaGuruBk}
                    onChange={(e) => {
                      setNamaGuruBk(e.target.value);
                      const preset = PRESET_GURU_BK.find(g => g.nama === e.target.value);
                      if (preset) setNipGuruBk(preset.nip);
                    }}
                    className="w-full text-xs rounded-xl border-slate-200 focus:border-rose-500 focus:ring-rose-500 px-3.5 py-2 border outline-none cursor-pointer"
                  >
                    {PRESET_GURU_BK.map(g => (
                      <option key={g.nip} value={g.nama}>{g.nama}</option>
                    ))}
                    {!PRESET_GURU_BK.some(g => g.nama === namaGuruBk) && (
                      <option value={namaGuruBk}>{namaGuruBk}</option>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    NIP Guru BK / Konselor
                  </label>
                  <select
                    value={nipGuruBk}
                    onChange={(e) => {
                      setNipGuruBk(e.target.value);
                      const preset = PRESET_GURU_BK.find(g => g.nip === e.target.value);
                      if (preset) setNamaGuruBk(preset.nama);
                    }}
                    className="w-full text-xs rounded-xl border-slate-200 focus:border-rose-500 focus:ring-rose-500 px-3.5 py-2 border outline-none cursor-pointer"
                  >
                    {PRESET_GURU_BK.map(g => (
                      <option key={g.nip} value={g.nip}>{g.nip}</option>
                    ))}
                    {!PRESET_GURU_BK.some(g => g.nip === nipGuruBk) && (
                      <option value={nipGuruBk}>{nipGuruBk}</option>
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Nama Kepala Sekolah
                  </label>
                  <input
                    type="text"
                    value={namaKepalaSekolah}
                    onChange={(e) => setNamaKepalaSekolah(e.target.value)}
                    placeholder="e.g. NUR FADILAH, S.Pd,. M.Pd"
                    className="w-full text-xs rounded-xl border-slate-200 focus:border-rose-500 focus:ring-rose-500 px-3.5 py-2 border outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    NIP Kepala Sekolah
                  </label>
                  <input
                    type="text"
                    value={nipKepalaSekolah}
                    onChange={(e) => setNipKepalaSekolah(e.target.value)}
                    placeholder="e.g. 19860410 201001 2 030"
                    className="w-full text-xs rounded-xl border-slate-200 focus:border-rose-500 focus:ring-rose-500 px-3.5 py-2 border outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Keterangan / Catatan Tambahan (Opsional)
                </label>
                <input
                  type="text"
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  placeholder="e.g. Konferensi kasus diselesaikan dengan lancar."
                  className="w-full text-xs rounded-xl border-slate-200 focus:border-rose-500 focus:ring-rose-500 px-3.5 py-2 border outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('daftar_hadir')}
                className="w-full sm:w-auto bg-slate-200 text-slate-700 font-semibold text-xs px-5 py-2.5 rounded-xl hover:bg-slate-300 transition-all"
              >
                &lt; Kembali ke Daftar Hadir
              </button>
              
              <div className="flex w-full sm:w-auto gap-2">
                {onCancelEdit && (
                  <button
                    type="button"
                    onClick={onCancelEdit}
                    className="flex-1 sm:flex-initial bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-2.5 rounded-xl border transition-all"
                  >
                    Batal Edit
                  </button>
                )}
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-lg hover:shadow-rose-500/20 disabled:opacity-50 transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Simpan Data (Upsert)
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      </form>

      {/* MODAL POPUP: PILIHAN TUJUAN KONFERENSI KASUS */}
      {showTujuanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-up">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-rose-500/10 via-pink-500/5 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-500/20 shrink-0">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Pilihan Tujuan Konferensi Kasus
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pilih salah satu kasus di bawah untuk otomatis mengisi <em>Data yang Ingin Diperoleh</em>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowTujuanModal(false)}
                className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search / Filter */}
            <div className="p-3.5 bg-slate-50/80 border-b border-slate-200">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTujuanPreset}
                  onChange={(e) => setSearchTujuanPreset(e.target.value)}
                  placeholder="Cari jenis kasus (misal: perselisihan, perkelahian, bullying, miras, merokok, pencurian)..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none"
                />
              </div>
            </div>

            {/* List of 6 Presets */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1 bg-slate-50/30">
              {filteredTujuanPresets.map((preset) => {
                const isSelected = dataInginDiperoleh === preset.deskripsi;
                return (
                  <div
                    key={preset.id}
                    onClick={() => handleSelectTujuanPreset(preset)}
                    className={`group p-4 rounded-2xl border transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-rose-50/80 border-rose-400 ring-2 ring-rose-300 shadow-sm'
                        : 'bg-white hover:bg-rose-50/30 border-slate-200 hover:border-rose-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-rose-700 transition-colors">
                            {preset.judul}
                          </h4>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${preset.badgeColor}`}>
                            {preset.kategori}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {preset.deskripsi}
                        </p>
                      </div>

                      <div className="shrink-0 flex items-center justify-center pt-1">
                        {isSelected ? (
                          <span className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
                            <Check className="w-4 h-4" />
                          </span>
                        ) : (
                          <span className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-rose-100 text-slate-400 group-hover:text-rose-600 flex items-center justify-center transition-colors">
                            <ChevronRight className="w-4 h-4" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredTujuanPresets.length === 0 && (
                <div className="text-center py-10 text-slate-400 text-xs">
                  Tidak ditemukan pilihan tujuan yang cocok dengan "{searchTujuanPreset}".
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Total {PRESET_TUJUAN_KONFERENSI.length} template resmi tersedia
              </span>
              <button
                type="button"
                onClick={() => setShowTujuanModal(false)}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL POPUP: PILIHAN URAIAN SINGKAT KEGIATAN INTI */}
      {showUraianModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-up">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-500/10 via-blue-500/5 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Pilihan Uraian Singkat Kegiatan Inti
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pilih salah satu kasus untuk otomatis mengisi langkah-langkah kegiatan inti (a, b, c)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowUraianModal(false)}
                className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search / Filter */}
            <div className="p-3.5 bg-slate-50/80 border-b border-slate-200">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchUraianPreset}
                  onChange={(e) => setSearchUraianPreset(e.target.value)}
                  placeholder="Cari jenis kasus (misal: perselisihan, perkelahian, bullying, miras, merokok, pencurian)..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            {/* List of 6 Presets */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1 bg-slate-50/30">
              {filteredUraianPresets.map((preset) => {
                const isSelected = uraianKegiatanInti === preset.fullText;
                return (
                  <div
                    key={preset.id}
                    onClick={() => handleSelectUraianPreset(preset)}
                    className={`group p-4 rounded-2xl border transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-indigo-50/80 border-indigo-400 ring-2 ring-indigo-300 shadow-sm'
                        : 'bg-white hover:bg-indigo-50/30 border-slate-200 hover:border-indigo-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-2.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                            {preset.judul}
                          </h4>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${preset.badgeColor}`}>
                            {preset.kategori}
                          </span>
                        </div>

                        <div className="space-y-1.5 pl-1">
                          {preset.items.map((item, idx) => {
                            const letter = String.fromCharCode(97 + idx); // a, b, c
                            return (
                              <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                                <span className="font-bold text-indigo-600 shrink-0">{letter}.</span>
                                <span className="leading-relaxed">{item}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center justify-center pt-1">
                        {isSelected ? (
                          <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                            <Check className="w-4 h-4" />
                          </span>
                        ) : (
                          <span className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-indigo-100 text-slate-400 group-hover:text-indigo-600 flex items-center justify-center transition-colors">
                            <ChevronRight className="w-4 h-4" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredUraianPresets.length === 0 && (
                <div className="text-center py-10 text-slate-400 text-xs">
                  Tidak ditemukan pilihan uraian kegiatan yang cocok dengan "{searchUraianPreset}".
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Total {PRESET_URAIAN_KEGIATAN.length} template resmi tersedia
              </span>
              <button
                type="button"
                onClick={() => setShowUraianModal(false)}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL POPUP: PILIHAN KESIMPULAN / DATA YANG DIPEROLEH */}
      {showKesimpulanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-up">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Pilihan Kesimpulan / Data yang Diperoleh
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pilih salah satu kasus untuk mengisi teks Kesimpulan & Data hasil konferensi secara otomatis
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowKesimpulanModal(false)}
                className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search / Filter */}
            <div className="p-3.5 bg-slate-50/80 border-b border-slate-200">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchKesimpulanPreset}
                  onChange={(e) => setSearchKesimpulanPreset(e.target.value)}
                  placeholder="Cari jenis kasus (misal: perselisihan, perkelahian, bullying, miras, merokok, pencurian)..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            {/* List of 6 Presets */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1 bg-slate-50/30">
              {filteredKesimpulanPresets.map((preset) => {
                const isSelected = dataDiperolehSimpulan === preset.fullText;
                return (
                  <div
                    key={preset.id}
                    onClick={() => handleSelectKesimpulanPreset(preset)}
                    className={`group p-4 rounded-2xl border transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-300 shadow-sm'
                        : 'bg-white hover:bg-emerald-50/30 border-slate-200 hover:border-emerald-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                            {preset.judul}
                          </h4>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${preset.badgeColor}`}>
                            {preset.kategori}
                          </span>
                        </div>

                        <div className="space-y-1.5 pl-1 text-xs">
                          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                            <div className="flex items-start gap-1.5">
                              <span className="font-bold text-emerald-700 shrink-0">Kesimpulan:</span>
                              <span className="text-slate-700 leading-relaxed">{preset.kesimpulan}</span>
                            </div>
                            <div className="flex items-start gap-1.5">
                              <span className="font-bold text-teal-700 shrink-0">Data:</span>
                              <span className="text-slate-700 leading-relaxed">{preset.data}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center justify-center pt-1">
                        {isSelected ? (
                          <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                            <Check className="w-4 h-4" />
                          </span>
                        ) : (
                          <span className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-emerald-100 text-slate-400 group-hover:text-emerald-600 flex items-center justify-center transition-colors">
                            <ChevronRight className="w-4 h-4" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredKesimpulanPresets.length === 0 && (
                <div className="text-center py-10 text-slate-400 text-xs">
                  Tidak ditemukan pilihan kesimpulan yang cocok dengan "{searchKesimpulanPreset}".
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Total {PRESET_KESIMPULAN_DATA.length} template resmi tersedia
              </span>
              <button
                type="button"
                onClick={() => setShowKesimpulanModal(false)}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL POPUP: PILIHAN HASIL KEPUTUSAN / JALANNYA RAPAT */}
      {showKeputusanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-up">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-rose-500/10 via-pink-500/5 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-500/20 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Pilihan Hasil Keputusan / Jalannya Rapat
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pilih salah satu kasus untuk mengisi Jalannya Rapat (a) &amp; Hasil Keputusan (b) secara otomatis
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowKeputusanModal(false)}
                className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search / Filter */}
            <div className="p-3.5 bg-slate-50/80 border-b border-slate-200">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchKeputusanPreset}
                  onChange={(e) => setSearchKeputusanPreset(e.target.value)}
                  placeholder="Cari jenis kasus (misal: perselisihan, perkelahian, bullying, miras, merokok, pencurian)..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none"
                />
              </div>
            </div>

            {/* List of 6 Presets */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1 bg-slate-50/30">
              {filteredKeputusanPresets.map((preset) => {
                const isSelected = rapatHasilPertemuan === preset.fullText;
                return (
                  <div
                    key={preset.id}
                    onClick={() => handleSelectKeputusanPreset(preset)}
                    className={`group p-4 rounded-2xl border transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-rose-50/80 border-rose-400 ring-2 ring-rose-300 shadow-sm'
                        : 'bg-white hover:bg-rose-50/30 border-slate-200 hover:border-rose-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-rose-700 transition-colors">
                            {preset.judul}
                          </h4>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${preset.badgeColor}`}>
                            {preset.kategori}
                          </span>
                        </div>

                        <div className="space-y-1.5 pl-1 text-xs">
                          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                            <div className="flex items-start gap-1.5">
                              <span className="font-bold text-rose-700 shrink-0">a. Jalannya Rapat:</span>
                              <span className="text-slate-700 leading-relaxed">{preset.jalannyaRapat}</span>
                            </div>
                            <div className="flex items-start gap-1.5">
                              <span className="font-bold text-pink-700 shrink-0">b. Hasil Keputusan:</span>
                              <span className="text-slate-700 leading-relaxed">{preset.hasilKeputusan}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center justify-center pt-1">
                        {isSelected ? (
                          <span className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
                            <Check className="w-4 h-4" />
                          </span>
                        ) : (
                          <span className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-rose-100 text-slate-400 group-hover:text-rose-600 flex items-center justify-center transition-colors">
                            <ChevronRight className="w-4 h-4" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredKeputusanPresets.length === 0 && (
                <div className="text-center py-10 text-slate-400 text-xs">
                  Tidak ditemukan pilihan keputusan rapat yang cocok dengan "{searchKeputusanPreset}".
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Total {PRESET_KEPUTUSAN_RAPAT.length} template resmi tersedia
              </span>
              <button
                type="button"
                onClick={() => setShowKeputusanModal(false)}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL POPUP: PILIH NAMA SISWA & KELAS (DAFTAR HADIR) */}
      {showSiswaModalDaftarHadir && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-up">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-rose-500/10 via-amber-500/5 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-500/20 shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Pilih Nama Siswa &amp; Kelas (Daftar Hadir)
                  </h3>
                  <p className="text-xs text-slate-500">
                    {targetRowIndexForSiswa !== null
                      ? `Mengisi data untuk baris ke-${targetRowIndexForSiswa + 1} (${daftarHadirRows[targetRowIndexForSiswa]?.jabatan || 'Peserta'})`
                      : 'Pilih siswa untuk ditambahkan ke daftar hadir konferensi kasus'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSiswaModalDaftarHadir(false)}
                className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Fill from Konseli Notice */}
            {namaKonseli && (
              <div className="px-4 py-2.5 bg-rose-50/80 border-b border-rose-100 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-rose-800">
                  <UserCheck className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>
                    Siswa Konseli Kasus ini: <strong className="font-bold">{namaKonseli}</strong> {selectedKelas || kelasTa ? `(${selectedKelas || kelasTa})` : ''}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleFillFromKonseli}
                  className="bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold px-3 py-1 rounded-lg transition-all shadow-2xs shrink-0 cursor-pointer"
                >
                  Pilih Konseli Ini
                </button>
              </div>
            )}

            {/* Filter and Search Bar */}
            <div className="p-3.5 bg-slate-50/90 border-b border-slate-200 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Filter Kelas */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                    <Filter className="w-3 h-3 text-rose-600" />
                    <span>Filter Kelas</span>
                  </label>
                  <select
                    value={modalSiswaFilterKelas}
                    onChange={(e) => setModalSiswaFilterKelas(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  >
                    <option value="Semua Kelas">Semua Kelas ({siswaItems.length} Siswa)</option>
                    {classOptions.map((k) => (
                      <option key={k} value={k}>
                        Kelas {k}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Search Box */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                    <Search className="w-3 h-3 text-rose-600" />
                    <span>Cari Nama / NIS</span>
                  </label>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={modalSiswaSearchQuery}
                      onChange={(e) => setModalSiswaSearchQuery(e.target.value)}
                      placeholder="Cari nama siswa atau NIS..."
                      className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons: Select All & Counters */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={handleSelectAllVisibleStudentsInDaftarHadirModal}
                  className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 bg-white hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                >
                  <CheckSquare className="w-3.5 h-3.5 text-slate-600" />
                  <span>
                    Pilih Semua ({filteredStudentsInDaftarHadirModal.length} Siswa Tampak)
                  </span>
                </button>

                <span className="text-xs font-bold text-slate-600">
                  Terpilih: <strong className="text-rose-600 font-extrabold">{modalSelectedStudentIds.length}</strong> Siswa
                </span>
              </div>
            </div>

            {/* List of Students */}
            <div className="p-3 sm:p-4 overflow-y-auto space-y-2 flex-1 bg-slate-50/40">
              {filteredStudentsInDaftarHadirModal.map((student) => {
                const isSelected = modalSelectedStudentIds.includes(student.id);
                return (
                  <div
                    key={student.id}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                      isSelected
                        ? 'bg-rose-50/80 border-rose-400 shadow-sm ring-1 ring-rose-300'
                        : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div
                      onClick={() => handleToggleStudentInDaftarHadirModal(student)}
                      className="flex items-center gap-3 flex-1 cursor-pointer"
                    >
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                          isSelected
                            ? 'bg-rose-600 border-rose-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-xs font-bold text-slate-900">{student.nama_siswa}</p>
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                            Kelas {student.kelas || '-'}
                          </span>
                          {student.jenis_kelamin && (
                            <span className="text-[10px] text-slate-500 font-medium">
                              ({student.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'})
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                          {student.nis ? `NIS: ${student.nis}` : 'NIS: -'} {student.keterangan ? `• ${student.keterangan}` : ''}
                        </p>
                      </div>
                    </div>

                    {/* Direct Quick Pick Button */}
                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      <button
                        type="button"
                        onClick={() => handleSelectSingleStudentForDaftarHadir(student)}
                        className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition-all shadow-xs flex items-center gap-1 cursor-pointer active:scale-95"
                      >
                        <Check className="w-3 h-3" />
                        <span>Pilih</span>
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredStudentsInDaftarHadirModal.length === 0 && (
                <div className="text-center py-10 px-4 text-slate-500 text-xs bg-white rounded-2xl border border-dashed border-slate-300 space-y-3">
                  <GraduationCap className="w-10 h-10 text-slate-300 mx-auto" />
                  <div>
                    <p className="font-bold text-slate-700">
                      {siswaItems.length === 0
                        ? 'Data master siswa belum dimuat atau kosong.'
                        : 'Tidak ada data siswa yang cocok dengan filter atau kata kunci.'}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {modalSiswaSearchQuery
                        ? `Pencarian: "${modalSiswaSearchQuery}" pada ${modalSiswaFilterKelas}`
                        : 'Anda dapat langsung mengetik nama siswa dan kelas di tabel daftar hadir, atau tambahkan siswa langsung di bawah.'}
                    </p>
                  </div>
                  {modalSiswaSearchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        handleSelectSingleStudentForDaftarHadir({
                          id: `custom-${Date.now()}`,
                          nama_siswa: modalSiswaSearchQuery.trim(),
                          nis: '',
                          jenis_kelamin: 'L',
                          kelas: modalSiswaFilterKelas !== 'Semua Kelas' ? modalSiswaFilterKelas : (selectedKelas || '9E')
                        });
                      }}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambahkan "{modalSiswaSearchQuery}" sebagai Siswa Baru</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 bg-white border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setModalSelectedStudentIds([])}
                className="text-xs font-bold text-slate-500 hover:text-slate-700 px-3 py-1.5 cursor-pointer"
              >
                Reset Pilihan
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowSiswaModalDaftarHadir(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleApplySelectedStudentsForDaftarHadir}
                  disabled={modalSelectedStudentIds.length === 0}
                  className="px-5 py-2 text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>
                    {targetRowIndexForSiswa !== null && modalSelectedStudentIds.length === 1
                      ? 'Terapkan pada Baris Ini'
                      : `Tambahkan (${modalSelectedStudentIds.length} Siswa)`}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
