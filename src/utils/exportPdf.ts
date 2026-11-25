import jsPDF from 'jspdf';
import { APP_CONFIG } from '../constants/config';
import {
  ExamResult,
  ItemStat,
  Question,
  StudentDiagnostic,
} from '../types/exam';
import {
  buildBlueprintRows,
  computeItemAnalysis,
  formatIndonesianDate,
} from './itemAnalysis';

function sanitizeFilePart(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]+/g, '_').replace(/^_+|_+$/g, '');
}

function drawSchoolHeader(doc: jsPDF, title: string, subtitle: string): number {
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setFillColor(29, 78, 216);
  doc.rect(14, 12, pageWidth - 28, 22, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(APP_CONFIG.SEKOLAH.toUpperCase(), pageWidth / 2, 20, {
    align: 'center',
  });

  doc.setFontSize(10);
  doc.text(title, pageWidth / 2, 26.5, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(subtitle, pageWidth / 2, 31.5, { align: 'center' });

  doc.setTextColor(15, 23, 42);
  return 40;
}

function drawSignatures(doc: jsPDF, startY: number, leftMargin = 24): void {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let y = startY;

  if (y + 34 > pageHeight - 14) {
    doc.addPage();
    y = 20;
  }

  const rightX = pageWidth - leftMargin - 55;
  const today = formatIndonesianDate();

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text('Mengetahui,', leftMargin, y);
  doc.text('Kepala Sekolah,', leftMargin, y + 4.5);
  doc.text(`${APP_CONFIG.KOTA}, ${today}`, rightX, y);
  doc.text('Guru Mata Pelajaran,', rightX, y + 4.5);

  const nameY = y + 21;
  doc.setFont('helvetica', 'bold');
  doc.text(APP_CONFIG.KEPALA_SEKOLAH, leftMargin, nameY);
  doc.line(leftMargin, nameY + 1, leftMargin + 55, nameY + 1);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`NIP. ${APP_CONFIG.NIP_KEPALA_SEKOLAH}`, leftMargin, nameY + 5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(APP_CONFIG.GURU, rightX, nameY);
  doc.line(rightX, nameY + 1, rightX + 55, nameY + 1);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`NIPPPK. ${APP_CONFIG.NIP_GURU}`, rightX, nameY + 5);
}

export function exportExamQuestionsPdf(questions: Question[]): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  let y = drawSchoolHeader(
    doc,
    `NASKAH SOAL TES SUMATIF ${APP_CONFIG.MATA_PELAJARAN} KELAS ${APP_CONFIG.KELAS}`,
    `Materi Pokok: ${APP_CONFIG.MATERI} • Jumlah: ${questions.length} Soal • KKTP: ${APP_CONFIG.KKTP}`
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(
    'Petunjuk: Pilihlah jawaban yang paling tepat pada lembar aplikasi ujian.',
    14,
    y
  );
  y += 6;

  questions.forEach((q, idx) => {
    const cleanText = q.text.replace(/\n+/g, ' ');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    const questionLines = doc.splitTextToSize(
      `${idx + 1}. [${q.topic}] ${cleanText}`,
      pageWidth - 28
    );
    const optionLinesCount =
      q.type === 'pg' || q.type === 'pgk' ? (q.options?.length || 0) : (q.statements?.length || 0);
    const neededHeight = questionLines.length * 4.5 + optionLinesCount * 4.5 + 8;

    if (y + neededHeight > pageHeight - 16) {
      doc.addPage();
      y = 18;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(questionLines, 14, y);
    y += questionLines.length * 4.4 + 1.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);

    if ((q.type === 'pg' || q.type === 'pgk') && q.options) {
      q.options.forEach((opt) => {
        const optLines = doc.splitTextToSize(
          `${opt.id}. ${opt.text}`,
          pageWidth - 36
        );
        doc.text(optLines, 20, y);
        y += optLines.length * 4.1;
      });
    } else if (q.type === 'pgk_kategori' && q.statements) {
      q.statements.forEach((st, sIdx) => {
        const stLines = doc.splitTextToSize(
          `(${sIdx + 1}) ${st.text} [Benar / Salah]`,
          pageWidth - 36
        );
        doc.text(stLines, 20, y);
        y += stLines.length * 4.1;
      });
    }

    y += 3;
  });

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(`${APP_CONFIG.SEKOLAH} • Naskah Soal ${APP_CONFIG.MATA_PELAJARAN} Kelas ${APP_CONFIG.KELAS}`, 14, pageHeight - 8);
    doc.text(`Halaman ${i} dari ${totalPages}`, pageWidth - 14, pageHeight - 8, {
      align: 'right',
    });
  }

  doc.save(`Naskah_Soal_Pendidikan_Pancasila_Kelas_${APP_CONFIG.KELAS}.pdf`);
}

export function exportStudentResultPdf(result: ExamResult): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const isPassed =
    result.status === 'Lulus' || result.nilai >= APP_CONFIG.KKTP;

  let y = drawSchoolHeader(
    doc,
    `LAPORAN HASIL TES SUMATIF ${APP_CONFIG.MATA_PELAJARAN}`,
    `${APP_CONFIG.SEKOLAH} • Kelas ${result.kelas || APP_CONFIG.KELAS} • Materi: ${APP_CONFIG.MATERI}`
  );

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, y, pageWidth - 28, 44, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('Identitas Peserta Didik', 20, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const infoRows: Array<[string, string]> = [
    ['Nama Lengkap', result.nama],
    ['Nomor Absen / Kelas', `${result.noAbsen} / Kelas ${result.kelas || APP_CONFIG.KELAS}`],
    ['Tanggal Lahir', result.tglLahir || '-'],
    ['Waktu Selesai', result.timestamp || '-'],
    ['Durasi Pengerjaan', result.durasiPengerjaan || '-'],
  ];

  infoRows.forEach(([label, value], idx) => {
    const rowY = y + 15 + idx * 5.5;
    doc.setTextColor(100, 116, 139);
    doc.text(label, 20, rowY);
    doc.setTextColor(15, 23, 42);
    doc.text(`: ${value}`, 62, rowY);
  });

  y += 52;

  doc.setFillColor(isPassed ? 236 : 255, isPassed ? 253 : 251, isPassed ? 245 : 235);
  doc.setDrawColor(isPassed ? 167 : 252, isPassed ? 243 : 211, isPassed ? 208 : 77);
  doc.roundedRect(14, y, pageWidth - 28, 36, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  doc.text('NILAI AKHIR TES SUMATIF', 20, y + 9);

  doc.setFontSize(26);
  if (isPassed) {
    doc.setTextColor(5, 150, 105);
  } else {
    doc.setTextColor(217, 119, 6);
  }
  doc.text(String(result.nilai), 20, y + 23);

  doc.setFontSize(10);
  doc.text(
    isPassed
      ? `LULUS (Mencapai KKTP ${APP_CONFIG.KKTP})`
      : `BELUM LULUS (Di Bawah KKTP ${APP_CONFIG.KKTP})`,
    20,
    y + 30.5
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text(`Jawaban Benar : ${result.benar} butir`, pageWidth - 75, y + 14);
  doc.text(`Jawaban Salah : ${result.salah} butir`, pageWidth - 75, y + 21);
  doc.text(
    `Integritas    : ${
      result.submissionReason === 'violation_limit'
        ? '3x Auto-Submit'
        : result.violationsCount
        ? `${result.violationsCount}x Peringatan`
        : 'Tertib'
    }`,
    pageWidth - 75,
    y + 28
  );

  y += 46;
  drawSignatures(doc, y, 24);

  doc.save(
    `Hasil_Sumatif_${sanitizeFilePart(result.nama)}_Absen_${sanitizeFilePart(
      result.noAbsen
    )}.pdf`
  );
}

export function exportRecapPdf(results: ExamResult[]): void {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  let y = drawSchoolHeader(
    doc,
    `REKAPITULASI NILAI TES SUMATIF ${APP_CONFIG.MATA_PELAJARAN} KELAS ${APP_CONFIG.KELAS}`,
    `${APP_CONFIG.SEKOLAH} • Materi: ${APP_CONFIG.MATERI} • KKTP: ${APP_CONFIG.KKTP} • Total Peserta: ${results.length} Siswa`
  );

  const cols = [
    { label: 'No', width: 12, align: 'center' as const },
    { label: 'Nama Siswa', width: 64, align: 'left' as const },
    { label: 'Absen', width: 16, align: 'center' as const },
    { label: 'Tgl Lahir', width: 34, align: 'left' as const },
    { label: 'Benar', width: 18, align: 'center' as const },
    { label: 'Salah', width: 18, align: 'center' as const },
    { label: 'Nilai', width: 20, align: 'center' as const },
    { label: 'Status', width: 30, align: 'center' as const },
    { label: 'Integritas', width: 32, align: 'center' as const },
    { label: 'Waktu Selesai', width: pageWidth - 28 - 244, align: 'left' as const },
  ];

  const drawHeaderRow = (posY: number) => {
    doc.setFillColor(30, 41, 59);
    doc.rect(14, posY, pageWidth - 28, 7.5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    let x = 14;
    cols.forEach((c) => {
      const tx = c.align === 'center' ? x + c.width / 2 : x + 2;
      doc.text(c.label, tx, posY + 5, { align: c.align });
      x += c.width;
    });
  };

  drawHeaderRow(y);
  y += 7.5;

  results.forEach((res, idx) => {
    if (y + 7 > pageHeight - 36) {
      doc.addPage();
      y = 16;
      drawHeaderRow(y);
      y += 7.5;
    }

    const rowHeight = 7;
    const isEven = idx % 2 === 0;
    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.rect(14, y, pageWidth - 28, rowHeight, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(14, y, pageWidth - 28, rowHeight, 'S');

    const isPassed = res.status === 'Lulus' || res.nilai >= APP_CONFIG.KKTP;
    const integritas =
      res.submissionReason === 'violation_limit'
        ? '3x Auto-Submit'
        : res.violationsCount && res.violationsCount > 0
        ? `${res.violationsCount}x Peringatan`
        : 'Tertib';

    const cells = [
      String(idx + 1),
      res.nama.slice(0, 32),
      String(res.noAbsen),
      (res.tglLahir || '-').slice(0, 18),
      String(res.benar),
      String(res.salah),
      String(res.nilai),
      res.status,
      integritas,
      (res.timestamp || '-').slice(0, 20),
    ];

    let x = 14;
    cols.forEach((c, cIdx) => {
      doc.setFont('helvetica', cIdx === 6 || cIdx === 7 ? 'bold' : 'normal');
      doc.setFontSize(7.8);
      if (cIdx === 6 || cIdx === 7) {
        if (isPassed) doc.setTextColor(5, 150, 105);
        else doc.setTextColor(217, 119, 6);
      } else {
        doc.setTextColor(30, 41, 59);
      }
      const tx = c.align === 'center' ? x + c.width / 2 : x + 2;
      doc.text(cells[cIdx], tx, y + 4.8, { align: c.align });
      x += c.width;
    });

    y += rowHeight;
  });

  drawSignatures(doc, y + 8, 24);
  doc.save(`Rekap_Nilai_Pendidikan_Pancasila_Kelas_${APP_CONFIG.KELAS}.pdf`);
}

export function exportBlueprintPdf(questions: Question[]): void {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const tableWidth = pageWidth - 28;

  let y = drawSchoolHeader(
    doc,
    `KISI-KISI PENULISAN SOAL TES SUMATIF ${APP_CONFIG.MATA_PELAJARAN} KELAS ${APP_CONFIG.KELAS}`,
    `${APP_CONFIG.SEKOLAH} • Materi: ${APP_CONFIG.MATERI} • Kurikulum Merdeka • Total ${questions.length} Butir Soal`
  );

  const blueprints = buildBlueprintRows(questions);

  const cols = [
    { key: 'no', title: 'No', width: 10, align: 'center' as const },
    { key: 'elemen', title: 'Elemen', width: 22, align: 'left' as const },
    { key: 'tp', title: 'Tujuan Pembelajaran', width: 62, align: 'left' as const },
    { key: 'materi', title: 'Materi Pokok', width: 38, align: 'left' as const },
    { key: 'indikator', title: 'Indikator Soal', width: 70, align: 'left' as const },
    { key: 'level', title: 'Level', width: 14, align: 'center' as const },
    { key: 'bentuk', title: 'Bentuk Soal', width: 28, align: 'center' as const },
    { key: 'kunci', title: 'Kunci', width: tableWidth - 244, align: 'center' as const },
  ];

  const drawHeaderRow = (posY: number) => {
    doc.setFillColor(30, 41, 59);
    doc.rect(14, posY, tableWidth, 7, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.8);
    let x = 14;
    cols.forEach((c) => {
      const tx = c.align === 'center' ? x + c.width / 2 : x + 2;
      doc.text(c.title, tx, posY + 4.8, { align: c.align });
      x += c.width;
    });
    doc.setTextColor(0, 0, 0);
  };

  drawHeaderRow(y);
  y += 7;

  blueprints.forEach((bp, idx) => {
    const tpLines = doc.splitTextToSize(bp.tujuanPembelajaran, cols[2].width - 3);
    const indLines = doc.splitTextToSize(bp.indikatorSoal, cols[4].width - 3);
    const matLines = doc.splitTextToSize(bp.materiPokok, cols[3].width - 3);
    const maxLines = Math.max(tpLines.length, indLines.length, matLines.length, 1);
    const rowH = Math.max(8, maxLines * 3.5 + 2.5);

    if (y + rowH > pageHeight - 34) {
      doc.addPage();
      y = 14;
      drawHeaderRow(y);
      y += 7;
    }

    const isEven = idx % 2 === 0;
    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.rect(14, y, tableWidth, rowH, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(14, y, tableWidth, rowH, 'S');

    let x = 14;
    cols.forEach((c) => {
      doc.setDrawColor(226, 232, 240);
      doc.line(x, y, x, y + rowH);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.2);
      doc.setTextColor(30, 41, 59);

      if (c.key === 'no') {
        doc.setFont('helvetica', 'bold');
        doc.text(String(bp.noSoal), x + c.width / 2, y + 4.5, { align: 'center' });
      } else if (c.key === 'elemen') {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(29, 78, 216);
        doc.text(bp.elemen, x + 2, y + 4.5);
      } else if (c.key === 'tp') {
        doc.text(tpLines, x + 2, y + 3.8);
      } else if (c.key === 'materi') {
        doc.text(matLines, x + 2, y + 3.8);
      } else if (c.key === 'indikator') {
        doc.text(indLines, x + 2, y + 3.8);
      } else if (c.key === 'level') {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(bp.levelKognitif === 'L1' ? 16 : 37, bp.levelKognitif === 'L1' ? 185 : 99, bp.levelKognitif === 'L1' ? 129 : 235);
        doc.text(bp.levelKognitif, x + c.width / 2, y + 4.5, { align: 'center' });
      } else if (c.key === 'bentuk') {
        const shortBentuk = bp.bentukSoal.includes('Kategori')
          ? 'PGK Kategori'
          : bp.bentukSoal.includes('Kompleks')
          ? 'PGK Kompleks'
          : 'Pilihan Ganda';
        doc.text(shortBentuk, x + c.width / 2, y + 4.5, { align: 'center' });
      } else if (c.key === 'kunci') {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(bp.kunciJawaban.slice(0, 14), x + c.width / 2, y + 4.2, {
          align: 'center',
        });
      }
      x += c.width;
    });

    y += rowH;
  });

  drawSignatures(doc, y + 8, 28);
  doc.save(`Kisi_Kisi_Pendidikan_Pancasila_Kelas_${APP_CONFIG.KELAS}.pdf`);
}

export function exportItemAnalysisPdf(
  results: ExamResult[],
  questions: Question[],
  itemStats?: ItemStat[]
): void {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const tableWidth = pageWidth - 28;
  const stats = itemStats || computeItemAnalysis(results, questions).itemStats;

  let y = drawSchoolHeader(
    doc,
    `ANALISIS BUTIR SOAL EMPIRIS - ${APP_CONFIG.MATA_PELAJARAN} KELAS ${APP_CONFIG.KELAS}`,
    `${APP_CONFIG.SEKOLAH} • Jumlah Peserta: ${results.length} Siswa • Total Butir Soal: ${stats.length}`
  );

  const cols = [
    { key: 'no', title: 'No', width: 12, align: 'center' as const },
    { key: 'elemen', title: 'Elemen', width: 24, align: 'left' as const },
    { key: 'topic', title: 'Topik / Materi', width: 60, align: 'left' as const },
    { key: 'level', title: 'Level', width: 16, align: 'center' as const },
    { key: 'benar', title: 'Benar', width: 18, align: 'center' as const },
    { key: 'salah', title: 'Salah', width: 18, align: 'center' as const },
    { key: 'persen', title: 'Tuntas %', width: 22, align: 'center' as const },
    { key: 'sukar', title: 'Tingkat Kesukaran', width: 32, align: 'center' as const },
    { key: 'dp', title: 'Daya Pembeda', width: 26, align: 'center' as const },
    { key: 'ket', title: 'Keterangan Mutu', width: tableWidth - 228, align: 'left' as const },
  ];

  const drawHeaderRow = (posY: number) => {
    doc.setFillColor(30, 41, 59);
    doc.rect(14, posY, tableWidth, 7.5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.8);
    let x = 14;
    cols.forEach((c) => {
      const tx = c.align === 'center' ? x + c.width / 2 : x + 2;
      doc.text(c.title, tx, posY + 5, { align: c.align });
      x += c.width;
    });
  };

  drawHeaderRow(y);
  y += 7.5;

  stats.forEach((item, idx) => {
    if (y + 7 > pageHeight - 36) {
      doc.addPage();
      y = 14;
      drawHeaderRow(y);
      y += 7.5;
    }

    const rowH = 7;
    const isEven = idx % 2 === 0;
    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.rect(14, y, tableWidth, rowH, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(14, y, tableWidth, rowH, 'S');

    const values: Record<string, string> = {
      no: String(item.questionNumber),
      elemen: item.elemen,
      topic: item.topic.slice(0, 34),
      level: item.levelKognitif,
      benar: String(item.correctCount),
      salah: String(item.wrongCount),
      persen: `${item.persentaseKetercapaian}%`,
      sukar: item.klasifikasiKesukaran,
      dp: item.dayaPembeda.toFixed(2),
      ket: item.dayaPembedaLabel,
    };

    let x = 14;
    cols.forEach((c) => {
      doc.setFont('helvetica', c.key === 'no' || c.key === 'persen' ? 'bold' : 'normal');
      doc.setFontSize(7.6);
      doc.setTextColor(30, 41, 59);
      const tx = c.align === 'center' ? x + c.width / 2 : x + 2;
      doc.text(values[c.key], tx, y + 4.8, { align: c.align });
      x += c.width;
    });

    y += rowH;
  });

  drawSignatures(doc, y + 8, 24);

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Dokumen Analisis Butir Soal Empiris • ${APP_CONFIG.SEKOLAH}`,
      14,
      pageHeight - 6
    );
    doc.text(`Halaman ${i} dari ${totalPages}`, pageWidth - 14, pageHeight - 6, {
      align: 'right',
    });
  }

  doc.save(`Analisis_Butir_Soal_Pendidikan_Pancasila_Kelas_${APP_CONFIG.KELAS}.pdf`);
}

export function exportStudentDiagnosticPdf(
  result: ExamResult,
  diagnostic: StudentDiagnostic
): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  let y = drawSchoolHeader(
    doc,
    'LAPORAN DIAGNOSTIK & TINDAK LANJUT PEMBELAJARAN',
    `${APP_CONFIG.SEKOLAH} • ${APP_CONFIG.MATA_PELAJARAN} Kelas ${APP_CONFIG.KELAS}`
  );

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(`Nama Siswa: ${result.nama} (Absen ${result.noAbsen})`, 14, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(
    `Nilai Akhir: ${result.nilai} • Status: ${result.status} • KKTP: ${APP_CONFIG.KKTP}`,
    14,
    y + 5.5
  );
  y += 14;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('Rekomendasi Tindak Lanjut:', 14, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.8);
  diagnostic.recommendations.forEach((rec) => {
    const lines = doc.splitTextToSize(`• ${rec}`, pageWidth - 28);
    if (y + lines.length * 4.5 > pageHeight - 25) {
      doc.addPage();
      y = 18;
    }
    doc.text(lines, 16, y);
    y += lines.length * 4.5 + 2;
  });

  if (diagnostic.wrongIndicators.length > 0) {
    y += 4;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text('Indikator Soal yang Perlu Penguatan:', 14, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    diagnostic.wrongIndicators.forEach((ind) => {
      const lines = doc.splitTextToSize(`- ${ind}`, pageWidth - 30);
      if (y + lines.length * 4.2 > pageHeight - 20) {
        doc.addPage();
        y = 18;
      }
      doc.text(lines, 16, y);
      y += lines.length * 4.2 + 1.5;
    });
  }

  drawSignatures(doc, y + 8, 24);
  doc.save(
    `Diagnostik_${sanitizeFilePart(result.nama)}_Absen_${sanitizeFilePart(
      result.noAbsen
    )}.pdf`
  );
}
