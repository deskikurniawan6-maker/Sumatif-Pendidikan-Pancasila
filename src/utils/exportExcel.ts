import * as XLSX from 'xlsx';
import { APP_CONFIG } from '../constants/config';
import { ExamResult, ItemStat, Question } from '../types/exam';
import { computeItemAnalysis } from './itemAnalysis';

export function exportRecapExcel(
  results: ExamResult[],
  questions: Question[]
): void {
  const wb = XLSX.utils.book_new();

  const recapRows = results.map((res, idx) => ({
    No: idx + 1,
    'Waktu Selesai': res.timestamp,
    'Nama Siswa': res.nama,
    Kelas: res.kelas || APP_CONFIG.KELAS,
    'Nomor Absen': res.noAbsen,
    'Tanggal Lahir': res.tglLahir || '-',
    'Mata Pelajaran': res.mataPelajaran || APP_CONFIG.MATA_PELAJARAN,
    Benar: res.benar,
    Salah: res.salah,
    Nilai: res.nilai,
    Status: res.status,
    Integritas:
      res.submissionReason === 'violation_limit'
        ? '3x Auto-Submit'
        : res.violationsCount && res.violationsCount > 0
        ? `${res.violationsCount}x Peringatan`
        : 'Tertib',
  }));

  const wsRecap = XLSX.utils.json_to_sheet(recapRows);
  XLSX.utils.book_append_sheet(wb, wsRecap, 'Rekap Nilai');

  const { itemStats } = computeItemAnalysis(results, questions);
  const itemRows = itemStats.map((stat: ItemStat) => ({
    'No Soal': stat.questionNumber,
    Elemen: stat.elemen,
    Topik: stat.topic,
    'Level Kognitif': stat.levelKognitif,
    'Kunci Jawaban': stat.kunciJawaban,
    Benar: stat.correctCount,
    Salah: stat.wrongCount,
    'Ketercapaian (%)': stat.persentaseKetercapaian,
    'Tingkat Kesukaran': stat.klasifikasiKesukaran,
    'Daya Pembeda': stat.dayaPembeda,
    'Mutu Soal': stat.dayaPembedaLabel,
  }));

  const wsAnalysis = XLSX.utils.json_to_sheet(itemRows);
  XLSX.utils.book_append_sheet(wb, wsAnalysis, 'Analisis Butir Soal');

  XLSX.writeFile(
    wb,
    `Rekap_Sumatif_Pendidikan_Pancasila_Kelas_${APP_CONFIG.KELAS}.xlsx`
  );
}
