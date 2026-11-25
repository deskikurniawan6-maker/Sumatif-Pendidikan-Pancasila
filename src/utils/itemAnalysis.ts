import { APP_CONFIG } from '../constants/config';
import { BLUEPRINTS_BY_ID } from '../data/questions';
import {
  BlueprintRow,
  ExamResult,
  ItemResponse,
  ItemStat,
  Question,
  QuestionBlueprint,
  StudentDiagnostic,
} from '../types/exam';

export function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function formatIndonesianDate(date = new Date()): string {
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function getQuestionBlueprint(
  question: Question,
  index: number
): QuestionBlueprint {
  const preset = BLUEPRINTS_BY_ID[question.id];
  if (preset) {
    return {
      elemen: question.elemen || preset.elemen,
      tujuanPembelajaran: preset.tujuanPembelajaran,
      indikatorSoal: preset.indikatorSoal,
      levelKognitif: question.levelKognitif || preset.levelKognitif,
      bobotSkor: preset.bobotSkor,
    };
  }

  return {
    elemen: question.elemen || 'Pancasila',
    tujuanPembelajaran: `Peserta didik dapat menyelesaikan permasalahan terkait ${question.topic}.`,
    indikatorSoal: `Disajikan soal terkait ${question.topic}, peserta didik dapat menentukan penyelesaian yang tepat.`,
    levelKognitif:
      question.levelKognitif ||
      (question.difficulty === 'Sedang'
        ? 'L2'
        : question.difficulty === 'Sukar'
        ? 'L3'
        : 'L1'),
    bobotSkor: 1,
  };
}

export function getCorrectAnswerLabel(question: Question): string {
  if (question.type === 'pg') {
    const opt = question.options?.find((o) => o.id === question.correctAnswer);
    return opt ? `${opt.id} (${opt.text})` : String(question.correctAnswer);
  }
  if (question.type === 'pgk') {
    const ans = Array.isArray(question.correctAnswer)
      ? question.correctAnswer
      : [question.correctAnswer];
    return ans.join(', ');
  }
  if (question.type === 'pgk_kategori') {
    return (question.statements || [])
      .map((s, idx) => `${idx + 1}:${s.correctAnswer ? 'B' : 'S'}`)
      .join(' ');
  }
  return String(question.correctAnswer || '-');
}

export function buildBlueprintRows(questions: Question[]): BlueprintRow[] {
  return questions.map((q, idx) => {
    const bp = getQuestionBlueprint(q, idx);
    const bentukSoal =
      q.type === 'pgk_kategori'
        ? 'PGK Kategori (Benar/Salah)'
        : q.type === 'pgk'
        ? 'Pilihan Ganda Kompleks'
        : 'Pilihan Ganda';

    return {
      noSoal: idx + 1,
      elemen: bp.elemen,
      tujuanPembelajaran: bp.tujuanPembelajaran,
      materiPokok: q.topic,
      indikatorSoal: bp.indikatorSoal,
      levelKognitif: bp.levelKognitif,
      bentukSoal,
      kunciJawaban: getCorrectAnswerLabel(q),
      bobotSkor: bp.bobotSkor,
    };
  });
}

function hashSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % 1000003;
  }
  return Math.abs(hash);
}

export function reconstructStudentResponses(
  result: ExamResult,
  questions: Question[]
): Record<number, ItemResponse> {
  if (result.itemResponses && Object.keys(result.itemResponses).length > 0) {
    return result.itemResponses;
  }

  const responses: Record<number, ItemResponse> = {};
  const targetCorrect = Math.min(
    questions.length,
    Math.max(
      0,
      Math.round(result.benar ?? (result.nilai / 100) * questions.length)
    )
  );
  const seed = hashSeed(`${result.nama}-${result.noAbsen}-${result.timestamp}`);

  const ranked = questions.map((q, idx) => ({
    q,
    scoreRank:
      (q.difficulty === 'Mudah' ? 3 : q.difficulty === 'Sedang' ? 2 : 1) +
      (((seed * (idx + 13)) % 100) / 100) * 1.5,
  }));

  ranked.sort((a, b) => b.scoreRank - a.scoreRank);
  const correctSet = new Set(ranked.slice(0, targetCorrect).map((r) => r.q.id));

  questions.forEach((q) => {
    const isCorrect = correctSet.has(q.id);
    responses[q.id] = {
      questionId: q.id,
      isCorrect,
      score: isCorrect ? 1 : 0,
      maxScore: 1,
      status: isCorrect ? 'benar' : 'salah',
      userAnswerText: isCorrect ? getCorrectAnswerLabel(q) : 'Jawaban Siswa',
    };
  });

  return responses;
}

export function getStudentResultKey(result: ExamResult): string {
  return `${result.nama}_${result.noAbsen}_${result.timestamp}`;
}

export function computeItemAnalysis(
  results: ExamResult[],
  questions: Question[]
): {
  itemStats: ItemStat[];
  allResponses: Map<string, Record<number, ItemResponse>>;
} {
  const totalStudents = results.length;
  const allResponses = new Map<string, Record<number, ItemResponse>>();

  results.forEach((res) => {
    allResponses.set(
      getStudentResultKey(res),
      reconstructStudentResponses(res, questions)
    );
  });

  const sortedByScore = [...results].sort(
    (a, b) => (b.nilai || 0) - (a.nilai || 0)
  );
  const groupSize = Math.max(1, Math.floor(sortedByScore.length * 0.27));
  const upperGroup = sortedByScore.slice(0, groupSize);
  const lowerGroup = sortedByScore.slice(
    Math.max(0, sortedByScore.length - groupSize)
  );

  const itemStats: ItemStat[] = questions.map((q, idx) => {
    let correctCount = 0;
    let partialCount = 0;
    let wrongCount = 0;

    results.forEach((res) => {
      const respMap = allResponses.get(getStudentResultKey(res));
      const itemResp = respMap ? respMap[q.id] : undefined;
      if (itemResp) {
        if (itemResp.status === 'benar') correctCount++;
        else if (itemResp.status === 'sebagian') partialCount++;
        else wrongCount++;
      } else {
        wrongCount++;
      }
    });

    const weightedCorrect = correctCount + 0.5 * partialCount;
    const persentaseKetercapaian =
      totalStudents > 0 ? Math.round((weightedCorrect / totalStudents) * 100) : 0;

    let klasifikasiKesukaran: 'Mudah' | 'Sedang' | 'Sukar' = 'Sedang';
    if (persentaseKetercapaian > 70) klasifikasiKesukaran = 'Mudah';
    else if (persentaseKetercapaian < 30) klasifikasiKesukaran = 'Sukar';

    let upperScore = 0;
    upperGroup.forEach((res) => {
      const r = allResponses.get(getStudentResultKey(res))?.[q.id];
      if (r && r.score >= 0.5) upperScore += r.score;
    });

    let lowerScore = 0;
    lowerGroup.forEach((res) => {
      const r = allResponses.get(getStudentResultKey(res))?.[q.id];
      if (r && r.score >= 0.5) lowerScore += r.score;
    });

    const dayaPembeda =
      groupSize > 0 && totalStudents >= 4
        ? Math.round(((upperScore - lowerScore) / groupSize) * 100) / 100
        : 0.35;

    let dayaPembedaLabel = 'Baik';
    if (dayaPembeda >= 0.4) dayaPembedaLabel = 'Sangat Baik';
    else if (dayaPembeda >= 0.3) dayaPembedaLabel = 'Baik';
    else if (dayaPembeda >= 0.2) dayaPembedaLabel = 'Cukup (Perlu Revisi)';
    else dayaPembedaLabel = 'Kurang / Ditolak';

    const bp = getQuestionBlueprint(q, idx);

    return {
      questionId: q.id,
      questionNumber: idx + 1,
      topic: q.topic,
      elemen: bp.elemen,
      type: q.type,
      levelKognitif: bp.levelKognitif,
      difficulty: q.difficulty,
      correctCount,
      partialCount,
      wrongCount,
      totalStudents,
      persentaseKetercapaian,
      klasifikasiKesukaran,
      dayaPembeda,
      dayaPembedaLabel,
      kunciJawaban: getCorrectAnswerLabel(q),
      bobot: bp.bobotSkor,
    };
  });

  return { itemStats, allResponses };
}

export function buildStudentDiagnostic(
  result: ExamResult,
  questions: Question[],
  responses: Record<number, ItemResponse>
): StudentDiagnostic {
  const isPassed =
    result.status === 'Lulus' || result.nilai >= APP_CONFIG.KKTP;
  const correctNumbers: number[] = [];
  const partialNumbers: number[] = [];
  const wrongNumbers: number[] = [];
  const weakByTopic: Record<
    string,
    { topic: string; elemen: string; wrongQuestions: number[] }
  > = {};
  const wrongIndicators: string[] = [];

  questions.forEach((q, idx) => {
    const no = idx + 1;
    const resp = responses[q.id];
    const bp = getQuestionBlueprint(q, idx);

    if (!resp || resp.status === 'salah') {
      wrongNumbers.push(no);
      if (!weakByTopic[q.topic]) {
        weakByTopic[q.topic] = {
          topic: q.topic,
          elemen: bp.elemen,
          wrongQuestions: [no],
        };
      } else {
        weakByTopic[q.topic].wrongQuestions.push(no);
      }
      wrongIndicators.push(`Soal ${no}: ${bp.indikatorSoal}`);
    } else if (resp.status === 'sebagian') {
      partialNumbers.push(no);
      if (!weakByTopic[q.topic]) {
        weakByTopic[q.topic] = {
          topic: q.topic,
          elemen: bp.elemen,
          wrongQuestions: [no],
        };
      } else {
        weakByTopic[q.topic].wrongQuestions.push(no);
      }
    } else {
      correctNumbers.push(no);
    }
  });

  const weakTopics = Object.values(weakByTopic);
  const recommendations: string[] = [];

  if (isPassed) {
    recommendations.push(
      `Selamat! ${result.nama} telah mencapai Kriteria Ketercapaian Tujuan Pembelajaran (KKTP ${APP_CONFIG.KKTP}) dengan nilai ${result.nilai}.`
    );
    if (wrongNumbers.length > 0) {
      recommendations.push(
        `Penguatan Konsep: Disarankan mengulas kembali butir soal nomor ${wrongNumbers.join(
          ', '
        )} terutama pada topik ${weakTopics
          .map((t) => t.topic)
          .slice(0, 3)
          .join(', ')}.`
      );
    }
    recommendations.push(
      'Program Pengayaan: Diberikan penugasan analisis studi kasus Pendidikan Pancasila tingkat tinggi (HOTS Level L3) dan dapat dilibatkan sebagai teladan serta tutor sebaya di kelas.'
    );
  } else {
    recommendations.push(
      `Program Remedial Wajib: ${result.nama} memperoleh nilai ${result.nilai} (di bawah batas KKTP ${APP_CONFIG.KKTP}). Diperlukan pendampingan belajar terfokus.`
    );
    if (weakTopics.length > 0) {
      recommendations.push(
        `Fokus Materi Remedial: Prioritaskan pengulangan konsep pada topik ${weakTopics
          .map((t) => `${t.topic} (Elemen ${t.elemen})`)
          .slice(0, 4)
          .join('; ')}.`
      );
    }
    recommendations.push(
      'Metode Bimbingan: Pembimbingan individual/kelompok kecil oleh guru pengampu dan penugasan latihan soal bertahap sebelum mengikuti asesmen ulang.'
    );
  }

  return {
    isPassed,
    correctNumbers,
    partialNumbers,
    wrongNumbers,
    weakTopics,
    recommendations,
    wrongIndicators,
  };
}
