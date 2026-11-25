export type QuestionType = 'pg' | 'pgk' | 'pgk_kategori';

export type CognitiveLevel = 'L1' | 'L2' | 'L3';

export type DifficultyLevel = 'Mudah' | 'Sedang' | 'Sukar';

export interface QuestionOption {
  id: string;
  text: string;
}

export interface QuestionStatement {
  id: string;
  text: string;
  correctAnswer: boolean;
}

export interface Question {
  id: number;
  type: QuestionType;
  topic: string;
  difficulty: DifficultyLevel | string;
  elemen?: string;
  levelKognitif?: CognitiveLevel;
  imageSvg?: string;
  imageUrl?: string;
  imageAlt?: string;
  text: string;
  options?: QuestionOption[];
  statements?: QuestionStatement[];
  correctAnswer: string | string[];
  explanation: string;
  shuffledOptions?: QuestionOption[];
}

export interface QuestionBlueprint {
  elemen: string;
  tujuanPembelajaran: string;
  indikatorSoal: string;
  levelKognitif: CognitiveLevel;
  bobotSkor: number;
}

export interface BlueprintRow extends QuestionBlueprint {
  noSoal: number;
  materiPokok: string;
  bentukSoal: string;
  kunciJawaban: string;
}

export interface StudentIdentity {
  nama: string;
  noAbsen: string;
  tglLahir: {
    hari: string;
    bulan: string;
    tahun: string;
  };
}

export interface ViolationLog {
  timestamp: string;
  reason: string;
}

export interface ItemResponse {
  questionId: number;
  isCorrect: boolean;
  score: number;
  maxScore: number;
  status: 'benar' | 'salah' | 'sebagian';
  userAnswerText: string;
}

export interface ExamResult {
  id: string;
  timestamp: string;
  nama: string;
  kelas: string;
  noAbsen: string;
  tglLahir: string;
  benar: number;
  salah: number;
  nilai: number;
  status: 'Lulus' | 'Belum Lulus';
  mataPelajaran: string;
  durasiPengerjaan?: string;
  detailJawaban?: Record<number, unknown>;
  itemResponses?: Record<number, ItemResponse>;
  violationsCount?: number;
  violationLogs?: ViolationLog[];
  submissionReason?: 'normal' | 'violation_limit';
  terminationNote?: string;
}

export interface ItemStat {
  questionId: number;
  questionNumber: number;
  topic: string;
  elemen: string;
  type: QuestionType;
  levelKognitif: CognitiveLevel;
  difficulty: string;
  correctCount: number;
  partialCount: number;
  wrongCount: number;
  totalStudents: number;
  persentaseKetercapaian: number;
  klasifikasiKesukaran: 'Mudah' | 'Sedang' | 'Sukar';
  dayaPembeda: number;
  dayaPembedaLabel: string;
  kunciJawaban: string;
  bobot: number;
}

export interface StudentDiagnostic {
  isPassed: boolean;
  correctNumbers: number[];
  partialNumbers: number[];
  wrongNumbers: number[];
  weakTopics: Array<{
    topic: string;
    elemen: string;
    wrongQuestions: number[];
  }>;
  recommendations: string[];
  wrongIndicators: string[];
}
