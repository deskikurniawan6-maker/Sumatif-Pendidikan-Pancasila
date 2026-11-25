import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Loader2,
  Maximize2,
  Send,
  ShieldAlert,
  ShieldCheck,
  User,
} from 'lucide-react';
import { APP_CONFIG } from '../constants/config';
import { storageService } from '../services/storageService';
import {
  ExamResult,
  ItemResponse,
  Question,
  StudentIdentity,
  ViolationLog,
} from '../types/exam';
import { exportExamQuestionsPdf } from '../utils/exportPdf';
import {
  exitExamFullscreen,
  isFullscreenActive,
  requestExamFullscreen,
} from '../utils/fullscreen';
import { getCorrectAnswerLabel, shuffleArray } from '../utils/itemAnalysis';

interface QuizScreenProps {
  student: StudentIdentity;
  questions: Question[];
  onFinishExam: (result: ExamResult) => void;
  strictSecurityMode?: boolean;
}

type AnswerValue = string | string[] | Record<string, boolean>;

export function QuizScreen({
  student,
  questions,
  onFinishExam,
  strictSecurityMode = true,
}: QuizScreenProps) {
  const preparedQuestions = useMemo(() => {
    const labels = ['A', 'B', 'C', 'D'];
    return shuffleArray(questions).map((q) => {
      if ((q.type === 'pg' || q.type === 'pgk') && q.options && q.options.length > 0) {
        const shuffled = shuffleArray(q.options).map((opt, idx) => ({
          id: labels[idx] || opt.id,
          text: opt.text,
        }));
        return { ...q, shuffledOptions: shuffled };
      }
      return { ...q };
    });
  }, [questions]);

  const totalCount = preparedQuestions.length;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, AnswerValue>>({});
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [bannerWarning, setBannerWarning] = useState<string | null>(null);

  const [needsFullscreenPrompt, setNeedsFullscreenPrompt] = useState(false);
  const [violationsCount, setViolationsCount] = useState(0);
  const [violationLogs, setViolationLogs] = useState<ViolationLog[]>([]);
  const [activeViolationModal, setActiveViolationModal] = useState<{
    level: number;
    reason: string;
  } | null>(null);
  const [autoSubmittingOverlay, setAutoSubmittingOverlay] = useState(false);

  const startTimeRef = useRef<number>(Date.now());
  const finishedRef = useRef<boolean>(false);
  const strictRef = useRef<boolean>(strictSecurityMode);
  const wasFullscreenRef = useRef<boolean>(false);
  const violationsCountRef = useRef<number>(0);
  const violationLogsRef = useRef<ViolationLog[]>([]);
  const lastViolationTsRef = useRef<number>(0);

  strictRef.current = strictSecurityMode;

  const isQuestionAnswered = useCallback(
    (idx: number) => {
      const q = preparedQuestions[idx];
      const ans = answers[idx];
      if (!q || ans == null) return false;
      if (q.type === 'pg') {
        return typeof ans === 'string' && ans.length > 0;
      }
      if (q.type === 'pgk') {
        return Array.isArray(ans) && ans.length > 0;
      }
      if (q.type === 'pgk_kategori') {
        const stmtCount = q.statements?.length || 0;
        const obj = typeof ans === 'object' && !Array.isArray(ans) ? ans : {};
        return Object.keys(obj).length === stmtCount;
      }
      return false;
    },
    [answers, preparedQuestions]
  );

  const answeredCount = useMemo(() => {
    let count = 0;
    for (let i = 0; i < totalCount; i++) {
      if (isQuestionAnswered(i)) count++;
    }
    return count;
  }, [totalCount, isQuestionAnswered]);

  const progressPercent =
    totalCount > 0 ? Math.round((answeredCount / totalCount) * 100) : 0;
  const allAnswered = answeredCount === totalCount;
  const currentQuestion = preparedQuestions[currentIdx];

  const computeExamResult = useCallback(
    (
      reason: 'normal' | 'violation_limit' = 'normal',
      finalViolations = violationsCountRef.current,
      finalLogs = violationLogsRef.current
    ): ExamResult => {
      let totalScore = 0;
      const detailJawaban: Record<number, unknown> = {};
      const itemResponses: Record<number, ItemResponse> = {};

      preparedQuestions.forEach((q, idx) => {
        const ans = answers[idx];
        detailJawaban[q.id] = ans;

        if (q.type === 'pg') {
          const correctOpt = q.options?.find((o) => o.id === q.correctAnswer);
          const isCorrect =
            typeof ans === 'string' &&
            (ans === q.correctAnswer ||
              (correctOpt !== undefined && ans === correctOpt.text));
          if (isCorrect) totalScore += 1;

          itemResponses[q.id] = {
            questionId: q.id,
            isCorrect,
            score: isCorrect ? 1 : 0,
            maxScore: 1,
            status: isCorrect ? 'benar' : 'salah',
            userAnswerText: typeof ans === 'string' ? ans : '-',
          };
        } else if (q.type === 'pgk') {
          const correctIds = Array.isArray(q.correctAnswer)
            ? q.correctAnswer
            : [];
          const correctTexts = (q.options || [])
            .filter((o) => correctIds.includes(o.id))
            .map((o) => o.text);
          const selected = Array.isArray(ans) ? ans : [];

          const exactMatch =
            (correctIds.length === selected.length &&
              correctIds.every((id) => selected.includes(id))) ||
            (correctTexts.length === selected.length &&
              correctTexts.every((t) => selected.includes(t)));
          const partialMatches = selected.filter(
            (val) => correctIds.includes(val) || correctTexts.includes(val)
          ).length;

          if (exactMatch) {
            totalScore += 1;
            itemResponses[q.id] = {
              questionId: q.id,
              isCorrect: true,
              score: 1,
              maxScore: 1,
              status: 'benar',
              userAnswerText: selected.join(', '),
            };
          } else if (partialMatches > 0) {
            totalScore += 0.5;
            itemResponses[q.id] = {
              questionId: q.id,
              isCorrect: false,
              score: 0.5,
              maxScore: 1,
              status: 'sebagian',
              userAnswerText: selected.join(', '),
            };
          } else {
            itemResponses[q.id] = {
              questionId: q.id,
              isCorrect: false,
              score: 0,
              maxScore: 1,
              status: 'salah',
              userAnswerText: selected.length > 0 ? selected.join(', ') : 'Kosong',
            };
          }
        } else if (q.type === 'pgk_kategori') {
          const stmts = q.statements || [];
          const ansObj =
            typeof ans === 'object' && ans !== null && !Array.isArray(ans)
              ? ans
              : {};
          let matched = 0;
          stmts.forEach((st) => {
            if (ansObj[st.id] === st.correctAnswer) matched += 1;
          });

          if (matched === stmts.length && stmts.length > 0) {
            totalScore += 1;
            itemResponses[q.id] = {
              questionId: q.id,
              isCorrect: true,
              score: 1,
              maxScore: 1,
              status: 'benar',
              userAnswerText: 'Semua Benar',
            };
          } else if (matched > 0) {
            const frac = Math.round((matched / stmts.length) * 100) / 100;
            totalScore += frac;
            itemResponses[q.id] = {
              questionId: q.id,
              isCorrect: false,
              score: frac,
              maxScore: 1,
              status: 'sebagian',
              userAnswerText: `${matched}/${stmts.length} Benar`,
            };
          } else {
            itemResponses[q.id] = {
              questionId: q.id,
              isCorrect: false,
              score: 0,
              maxScore: 1,
              status: 'salah',
              userAnswerText: 'Salah Semua',
            };
          }
        } else {
          itemResponses[q.id] = {
            questionId: q.id,
            isCorrect: false,
            score: 0,
            maxScore: 1,
            status: 'salah',
            userAnswerText: getCorrectAnswerLabel(q),
          };
        }
      });

      const benar = Math.round(totalScore * 10) / 10;
      const salah = Math.max(0, Math.round((totalCount - totalScore) * 10) / 10);
      const nilai =
        totalCount > 0 ? Math.round((totalScore / totalCount) * 100) : 0;
      const status: 'Lulus' | 'Belum Lulus' =
        nilai >= APP_CONFIG.KKTP ? 'Lulus' : 'Belum Lulus';
      const elapsedSec = Math.max(
        1,
        Math.round((Date.now() - startTimeRef.current) / 1000)
      );
      const durasiPengerjaan = `${Math.floor(elapsedSec / 60)} menit ${
        elapsedSec % 60
      } detik`;
      const tglLahir = `${student.tglLahir.hari} ${student.tglLahir.bulan} ${student.tglLahir.tahun}`;
      const timestamp = new Date().toLocaleString('id-ID');

      return {
        id: `res-${Date.now()}`,
        timestamp,
        nama: student.nama,
        kelas: APP_CONFIG.KELAS,
        noAbsen: student.noAbsen,
        tglLahir,
        benar,
        salah,
        nilai,
        status,
        mataPelajaran: APP_CONFIG.MATA_PELAJARAN,
        durasiPengerjaan,
        detailJawaban,
        itemResponses,
        violationsCount: finalViolations,
        violationLogs: finalLogs,
        submissionReason: reason,
        terminationNote:
          reason === 'violation_limit'
            ? `Ujian dihentikan otomatis oleh sistem setelah tercatat ${finalViolations}x pelanggaran keluar tab atau layar penuh.`
            : '',
      };
    },
    [answers, preparedQuestions, student, totalCount]
  );

  const registerViolation = useCallback(
    async (reason: string) => {
      if (!strictRef.current || finishedRef.current) return;
      const now = Date.now();
      if (now - lastViolationTsRef.current < 1200) return;
      lastViolationTsRef.current = now;

      const nextCount = violationsCountRef.current + 1;
      violationsCountRef.current = nextCount;
      setViolationsCount(nextCount);

      const logEntry: ViolationLog = {
        timestamp: new Date().toLocaleTimeString('id-ID'),
        reason,
      };
      const updatedLogs = [...violationLogsRef.current, logEntry];
      violationLogsRef.current = updatedLogs;
      setViolationLogs(updatedLogs);

      if (nextCount >= 3) {
        finishedRef.current = true;
        setActiveViolationModal(null);
        setNeedsFullscreenPrompt(false);
        setAutoSubmittingOverlay(true);
        const result = computeExamResult('violation_limit', nextCount, updatedLogs);
        try {
          await storageService.submitExamResult(result);
        } catch {
          // Local copy already saved
        }
        await exitExamFullscreen();
        onFinishExam(result);
      } else {
        setActiveViolationModal({ level: nextCount, reason });
      }
    },
    [computeExamResult, onFinishExam]
  );

  useEffect(() => {
    if (!strictSecurityMode) return;

    if (isFullscreenActive()) {
      wasFullscreenRef.current = true;
      setNeedsFullscreenPrompt(false);
    } else {
      setNeedsFullscreenPrompt(true);
    }

    const onVisibility = () => {
      if (document.hidden && !finishedRef.current) {
        void registerViolation('Berpindah tab atau meminimalkan jendela browser');
      }
    };
    const onBlur = () => {
      if (!finishedRef.current) {
        void registerViolation('Jendela ujian kehilangan fokus / berpindah aplikasi');
      }
    };
    const onFsChange = () => {
      if (!isFullscreenActive() && wasFullscreenRef.current && !finishedRef.current) {
        setNeedsFullscreenPrompt(true);
        void registerViolation('Keluar dari mode layar penuh');
      } else if (isFullscreenActive()) {
        wasFullscreenRef.current = true;
        setNeedsFullscreenPrompt(false);
      }
    };

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('blur', onBlur);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('blur', onBlur);
      document.removeEventListener('fullscreenchange', onFsChange);
    };
  }, [strictSecurityMode, registerViolation]);

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!finishedRef.current) {
        e.preventDefault();
        e.returnValue =
          'Ujian sedang berlangsung. Jika Anda keluar atau memuat ulang, data Anda dapat terganggu.';
        return e.returnValue;
      }
    };
    const onContext = (e: MouseEvent) => {
      if (strictRef.current) {
        e.preventDefault();
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (!strictRef.current) return;
      const key = e.key.toLowerCase();
      if (
        (e.key === 'Escape' || e.key === 'Esc' || e.code === 'Escape') &&
        wasFullscreenRef.current
      ) {
        void registerViolation('Keluar dari mode layar penuh (Menekan tombol Esc)');
        setNeedsFullscreenPrompt(true);
      }
      if (
        ((e.ctrlKey || e.metaKey) &&
          ['c', 'v', 'x', 'u', 'p', 's', 'r'].includes(key)) ||
        e.key === 'F12' ||
        e.key === 'F5' ||
        e.key === 'F11' ||
        ((e.ctrlKey || e.metaKey) &&
          e.shiftKey &&
          ['i', 'j', 'c'].includes(key))
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    window.addEventListener('beforeunload', onBeforeUnload);
    window.addEventListener('contextmenu', onContext);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
      window.removeEventListener('contextmenu', onContext);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [registerViolation]);

  const handleSelectPg = (text: string) => {
    setBannerWarning(null);
    setAnswers((prev) => ({ ...prev, [currentIdx]: text }));
  };

  const handleTogglePgk = (text: string) => {
    setBannerWarning(null);
    setAnswers((prev) => {
      const current = Array.isArray(prev[currentIdx])
        ? (prev[currentIdx] as string[])
        : [];
      const updated = current.includes(text)
        ? current.filter((item) => item !== text)
        : [...current, text];
      return { ...prev, [currentIdx]: updated };
    });
  };

  const handleSelectCategory = (stmtId: string, val: boolean) => {
    setBannerWarning(null);
    setAnswers((prev) => {
      const currentObj =
        typeof prev[currentIdx] === 'object' &&
        prev[currentIdx] !== null &&
        !Array.isArray(prev[currentIdx])
          ? (prev[currentIdx] as Record<string, boolean>)
          : {};
      return {
        ...prev,
        [currentIdx]: { ...currentObj, [stmtId]: val },
      };
    });
  };

  const handleFinalSubmit = async () => {
    if (!allAnswered) {
      setBannerWarning(
        `Masih ada ${totalCount - answeredCount} butir soal yang belum dijawab. Harap jawab seluruh soal terlebih dahulu.`
      );
      setShowSubmitModal(false);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    finishedRef.current = true;
    const result = computeExamResult('normal');

    try {
      await storageService.submitExamResult(result);
      await exitExamFullscreen();
      setIsSubmitting(false);
      setShowSubmitModal(false);
      onFinishExam(result);
    } catch (err: unknown) {
      const errorObj = err as Error;
      finishedRef.current = false;
      setIsSubmitting(false);
      setSubmitError(
        errorObj?.message ||
          'Gagal mengirim data ke server. Periksa koneksi internet atau konfigurasi Google Apps Script.'
      );
    }
  };

  const optionsToRender =
    currentQuestion?.shuffledOptions || currentQuestion?.options || [];

  return (
    <div
      className="max-w-6xl mx-auto py-6 px-4 sm:px-6 select-none"
      onContextMenu={(e) => {
        if (strictSecurityMode) e.preventDefault();
      }}
    >
      {/* Student & Progress Header Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                <span className="text-sm font-bold text-slate-900">
                  {student.nama}
                </span>
                <span className="text-slate-300" aria-hidden="true">
                  ·
                </span>
                <span className="font-semibold text-slate-700 tabular-nums">
                  Absen {student.noAbsen}
                </span>
                <span className="text-slate-300" aria-hidden="true">
                  ·
                </span>
                <span className="font-semibold text-blue-700">
                  Kelas {APP_CONFIG.KELAS}
                </span>
                <span className="text-slate-300" aria-hidden="true">
                  ·
                </span>
                {strictSecurityMode ? (
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Pengawasan Aktif</span>
                  </span>
                ) : (
                  <span className="text-slate-500 font-medium">Mode Fleksibel</span>
                )}
                {strictSecurityMode && violationsCount > 0 && (
                  <>
                    <span className="text-slate-300" aria-hidden="true">
                      ·
                    </span>
                    <span className="inline-flex items-center gap-1 text-rose-700 font-extrabold tabular-nums">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Pelanggaran: {violationsCount}/3</span>
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {APP_CONFIG.SEKOLAH} · {APP_CONFIG.MATA_PELAJARAN} ({APP_CONFIG.MATERI})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              id="btn-download-questions-pdf"
              type="button"
              onClick={() => exportExamQuestionsPdf(questions)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-300 cursor-pointer whitespace-nowrap"
              title="Unduh Lembar Naskah Soal dalam bentuk PDF"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Unduh Soal (PDF)</span>
            </button>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
            <span className="text-slate-600">
              Progres Pengerjaan:{' '}
              <span className="text-blue-700 font-bold tabular-nums">
                {answeredCount}
              </span>{' '}
              dari <span className="tabular-nums">{totalCount}</span> Soal Terjawab
            </span>
            <span className="text-blue-700 font-bold tabular-nums">
              {progressPercent}%
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-700 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {bannerWarning && (
        <div className="mb-6 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-semibold">{bannerWarning}</span>
          </div>
          <button
            type="button"
            onClick={() => setBannerWarning(null)}
            className="text-amber-700 hover:text-amber-900 font-bold cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {strictSecurityMode && needsFullscreenPrompt && !activeViolationModal && (
        <div className="mb-6 p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-950 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Maximize2 className="w-4 h-4 text-blue-700 shrink-0" />
            <span>
              Disarankan mengaktifkan mode layar penuh selama ujian berlangsung agar
              tidak tercatat keluar fokus.
            </span>
          </div>
          <button
            type="button"
            onClick={() => void requestExamFullscreen()}
            className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
          >
            Aktifkan Layar Penuh
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Question Area */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs min-h-[440px] flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="text-sm sm:text-base font-extrabold px-3 py-1 bg-blue-700 text-white rounded-xl tabular-nums">
                    Soal No. {currentIdx + 1}
                  </span>
                  <span className="text-xs font-semibold text-slate-600">
                    {currentQuestion?.type === 'pg' && 'Pilihan Ganda'}
                    {currentQuestion?.type === 'pgk' && 'Pilihan Ganda Kompleks'}
                    {currentQuestion?.type === 'pgk_kategori' &&
                      'PGK Kategori (Benar / Salah)'}
                  </span>
                </div>
                <span className="text-xs font-medium text-slate-500">
                  {currentQuestion?.topic}
                </span>
              </div>

              <p className="mb-4 text-xs font-medium text-blue-800 bg-blue-50/70 border border-blue-100 px-3 py-2 rounded-lg">
                {currentQuestion?.type === 'pg' &&
                  'Pilihlah salah satu jawaban yang paling tepat.'}
                {currentQuestion?.type === 'pgk' &&
                  'Pilihlah seluruh pernyataan yang bernilai benar (bisa lebih dari satu).'}
                {currentQuestion?.type === 'pgk_kategori' &&
                  'Tentukan pilihan Benar atau Salah untuk setiap pernyataan di bawah ini.'}
              </p>

              {currentQuestion?.imageUrl && (
                <div className="mb-5 p-3 sm:p-4 rounded-xl bg-slate-50 border border-slate-200 flex justify-center">
                  <img
                    src={currentQuestion.imageUrl}
                    alt={currentQuestion.imageAlt || currentQuestion.topic}
                    referrerPolicy="no-referrer"
                    className="max-h-72 w-auto rounded-lg object-contain shadow-xs"
                  />
                </div>
              )}

              {currentQuestion?.imageSvg && (
                <div
                  className="mb-5 p-3 sm:p-4 rounded-xl bg-slate-50 border border-slate-200 flex justify-center overflow-x-auto"
                  dangerouslySetInnerHTML={{ __html: currentQuestion.imageSvg }}
                />
              )}

              <div className="text-sm sm:text-base text-slate-900 leading-relaxed font-medium whitespace-pre-line mb-6">
                {currentQuestion?.text}
              </div>

              {currentQuestion?.type === 'pg' && (
                <div className="space-y-2.5">
                  {optionsToRender.map((opt) => {
                    const isSelected = answers[currentIdx] === opt.text;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectPg(opt.text)}
                        className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-colors flex items-start gap-3.5 cursor-pointer ${
                          isSelected
                            ? 'border-blue-700 bg-blue-50 text-blue-950 font-semibold ring-1 ring-blue-600'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-blue-700 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {opt.id}
                        </div>
                        <span className="text-xs sm:text-sm mt-0.5 leading-normal flex-1">
                          {opt.text}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {currentQuestion?.type === 'pgk' && (
                <div className="space-y-2.5">
                  {optionsToRender.map((opt) => {
                    const currentArr = Array.isArray(answers[currentIdx])
                      ? (answers[currentIdx] as string[])
                      : [];
                    const isSelected = currentArr.includes(opt.text);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleTogglePgk(opt.text)}
                        className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-colors flex items-start gap-3.5 cursor-pointer ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold ring-1 ring-emerald-500'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {isSelected ? <Check className="w-4 h-4" /> : opt.id}
                        </div>
                        <span className="text-xs sm:text-sm mt-0.5 leading-normal flex-1">
                          {opt.text}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {currentQuestion?.type === 'pgk_kategori' && (
                <div className="space-y-3">
                  {(currentQuestion.statements || []).map((stmt, sIdx) => {
                    const currentObj =
                      typeof answers[currentIdx] === 'object' &&
                      answers[currentIdx] !== null &&
                      !Array.isArray(answers[currentIdx])
                        ? (answers[currentIdx] as Record<string, boolean>)
                        : {};
                    const val = currentObj[stmt.id];
                    return (
                      <div
                        key={stmt.id}
                        className="p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-slate-50/70"
                      >
                        <p className="text-xs sm:text-sm text-slate-800 font-medium mb-3">
                          <span className="font-bold text-blue-700 mr-1.5">
                            {sIdx + 1}.
                          </span>
                          {stmt.text}
                        </p>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleSelectCategory(stmt.id, true)}
                            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border cursor-pointer ${
                              val === true
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                            }`}
                          >
                            Benar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSelectCategory(stmt.id, false)}
                            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border cursor-pointer ${
                              val === false
                                ? 'bg-rose-600 text-white border-rose-600'
                                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                            }`}
                          >
                            Salah
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100">
              <button
                type="button"
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>

              {currentIdx < totalCount - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentIdx((i) => Math.min(totalCount - 1, i + 1))}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl transition-colors cursor-pointer"
                >
                  <span>Berikutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  id="btn-finish-bottom"
                  type="button"
                  onClick={() => setShowSubmitModal(true)}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Jawaban</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Question Navigator Sidebar */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs lg:sticky lg:top-20">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900">Navigasi Nomor Soal</h3>
            <span className="text-xs font-semibold text-slate-500 tabular-nums">
              {answeredCount}/{totalCount}
            </span>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-5 gap-2">
            {preparedQuestions.map((q, idx) => {
              const answered = isQuestionAnswered(idx);
              const isCurrent = idx === currentIdx;
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setCurrentIdx(idx)}
                  className={`h-9 rounded-lg text-xs font-bold tabular-nums transition-colors cursor-pointer border ${
                    isCurrent
                      ? 'bg-blue-700 text-white border-blue-700 ring-2 ring-blue-200'
                      : answered
                      ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-blue-700 shrink-0" />
              <span>Sedang Dikerjakan</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-emerald-600 shrink-0" />
              <span className="tabular-nums">Sudah Dijawab ({answeredCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-slate-200 shrink-0" />
              <span className="tabular-nums">
                Belum Dijawab ({totalCount - answeredCount})
              </span>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100">
            <button
              id="btn-sidebar-submit"
              type="button"
              onClick={() => setShowSubmitModal(true)}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                allAnswered
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Selesai & Kirim Jawaban</span>
            </button>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              Konfirmasi Pengumpulan Jawaban
            </h3>
            {allAnswered ? (
              <p className="text-sm text-slate-600 leading-relaxed">
                Seluruh{' '}
                <strong className="text-slate-900 tabular-nums">
                  {totalCount} butir soal
                </strong>{' '}
                telah dijawab. Apakah Anda yakin ingin mengakhiri ujian dan mengirim
                hasilnya sekarang?
              </p>
            ) : (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                Masih terdapat{' '}
                <strong className="tabular-nums">
                  {totalCount - answeredCount} soal
                </strong>{' '}
                yang belum dijawab. Harap lengkapi seluruh nomor soal sebelum
                mengirim jawaban.
              </div>
            )}

            {submitError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
                {submitError}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
              >
                Periksa Kembali
              </button>
              {allAnswered && (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleFinalSubmit}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Mengirim...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Ya, Kirim Sekarang</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Violation Warning Modal */}
      {activeViolationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-rose-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-rose-900">
                  Peringatan Pelanggaran ({activeViolationModal.level}/3)
                </h3>
                <p className="text-xs text-rose-700">
                  Sistem Pengawasan Integritas Ujian
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-1.5">
              <p className="font-bold">Terdeteksi aktivitas mencurigakan:</p>
              <p>{activeViolationModal.reason}</p>
              <p className="pt-1 text-rose-700">
                Jika mencapai <strong>3 kali pelanggaran</strong>, sistem akan
                otomatis mengunci dan mengirim jawaban Anda.
              </p>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={async () => {
                  setActiveViolationModal(null);
                  if (strictSecurityMode && !isFullscreenActive()) {
                    await requestExamFullscreen();
                  }
                }}
                className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl cursor-pointer"
              >
                Kembali ke Ujian
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auto-submitting overlay */}
      {autoSubmittingOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-rose-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">
              Mengunci & Mengirim Jawaban...
            </h3>
            <p className="text-xs text-slate-600">
              Batas 3x pelanggaran tercapai. Sistem sedang menyimpan hasil tes Anda.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
