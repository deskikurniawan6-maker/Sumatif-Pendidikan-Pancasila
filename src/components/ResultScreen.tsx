import { useState } from 'react';
import {
  AlertTriangle,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Download,
  RotateCcw,
  ShieldAlert,
  XCircle,
} from 'lucide-react';
import { APP_CONFIG } from '../constants/config';
import { ExamResult, Question } from '../types/exam';
import { exportStudentResultPdf } from '../utils/exportPdf';

interface ResultScreenProps {
  result: ExamResult;
  questions: Question[];
  allowReview: boolean;
  onRestart: () => void;
}

export function ResultScreen({
  result,
  questions,
  allowReview,
  onRestart,
}: ResultScreenProps) {
  const [showReview, setShowReview] = useState(false);

  const isPassed =
    result.status === 'Lulus' || result.nilai >= APP_CONFIG.KKTP;
  const violationsCount = result.violationsCount || 0;
  const isViolationAutoSubmit = result.submissionReason === 'violation_limit';

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs text-center relative overflow-hidden">
        <div
          className={`absolute top-0 left-0 right-0 h-2.5 ${
            isViolationAutoSubmit
              ? 'bg-rose-600'
              : isPassed
              ? 'bg-emerald-600'
              : 'bg-amber-500'
          }`}
        />

        <div className="inline-flex items-center justify-center mt-2 mb-4">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center ${
              isViolationAutoSubmit
                ? 'bg-rose-100 text-rose-600'
                : isPassed
                ? 'bg-emerald-100 text-emerald-600'
                : 'bg-amber-100 text-amber-600'
            }`}
          >
            {isViolationAutoSubmit ? (
              <ShieldAlert className="w-10 h-10" />
            ) : isPassed ? (
              <Award className="w-10 h-10" />
            ) : (
              <AlertTriangle className="w-10 h-10" />
            )}
          </div>
        </div>

        <p className="text-xs font-semibold text-blue-700 mb-1">
          {APP_CONFIG.SEKOLAH} · Kelas {APP_CONFIG.KELAS}
        </p>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Laporan Hasil Tes Sumatif
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {APP_CONFIG.MATA_PELAJARAN} ({APP_CONFIG.MATERI})
        </p>

        {isViolationAutoSubmit ? (
          <div className="my-6 max-w-xl mx-auto p-4 rounded-2xl bg-rose-50 border border-rose-300 text-left space-y-2">
            <div className="flex items-center gap-2 text-rose-800 font-extrabold text-sm">
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
              <span>Ujian Dihentikan Otomatis oleh Sistem (Auto-Submit)</span>
            </div>
            <p className="text-xs text-rose-700 leading-relaxed">
              {result.terminationNote ||
                'Siswa terdeteksi meninggalkan halaman atau berpindah tab sebanyak 3 kali (batas maksimum toleransi tercapai). Jawaban yang telah terisi telah dikunci dan diserahkan secara otomatis.'}
            </p>
            {result.violationLogs && result.violationLogs.length > 0 && (
              <div className="pt-2 border-t border-rose-200 text-xs text-rose-800 space-y-1">
                <span className="font-bold block">Riwayat Waktu Insiden:</span>
                {result.violationLogs.map((log, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 font-mono text-[11px]"
                  >
                    <span className="font-bold">{i + 1}.</span>
                    <span>{log.timestamp}</span>
                    <span className="text-rose-700">- {log.reason}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : violationsCount > 0 ? (
          <div className="my-5 max-w-xl mx-auto p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs text-left flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Catatan Integritas Ujian:</span>
              <span>
                Tercatat <strong>{violationsCount} kali peringatan</strong>{' '}
                berpindah tab/aplikasi selama pengerjaan soal berlangsung.
              </span>
            </div>
          </div>
        ) : null}

        <div className="my-6 max-w-sm mx-auto p-6 rounded-2xl bg-slate-50 border border-slate-200">
          <p className="text-xs font-bold tracking-wide text-slate-500 mb-1">
            Nilai Akhir Ujian
          </p>
          <div
            className={`text-5xl sm:text-6xl font-black my-2 tabular-nums ${
              isPassed ? 'text-emerald-600' : 'text-amber-600'
            }`}
          >
            {result.nilai}
          </div>
          <div className="mt-2 flex items-center justify-center gap-1.5 text-xs font-extrabold">
            {isPassed ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-700">
                <CheckCircle2 className="w-4 h-4" />
                <span>LULUS (Mencapai KKTP)</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-amber-700">
                <AlertTriangle className="w-4 h-4" />
                <span>BELUM LULUS (Perlu Remedial)</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-2 tabular-nums">
            Standar Kriteria Ketercapaian Tujuan Pembelajaran (KKTP):{' '}
            <span className="font-bold text-slate-700">{APP_CONFIG.KKTP}</span>
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto mb-8 text-left">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500 block">Nama Siswa</span>
            <span className="font-bold text-slate-800 text-xs sm:text-sm truncate block mt-0.5">
              {result.nama}
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500 block">Absen · Kelas</span>
            <span className="font-bold text-slate-800 text-xs sm:text-sm block mt-0.5 tabular-nums">
              {result.noAbsen} · Kelas {result.kelas || APP_CONFIG.KELAS}
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="text-xs text-emerald-700 block">Jawaban Benar</span>
            <span className="font-bold text-emerald-900 text-sm sm:text-base block mt-0.5 tabular-nums">
              {result.benar} Soal
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200">
            <span className="text-xs text-rose-700 block">Jawaban Salah</span>
            <span className="font-bold text-rose-900 text-sm sm:text-base block mt-0.5 tabular-nums">
              {result.salah} Soal
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            id="btn-download-result-pdf"
            type="button"
            onClick={() => exportStudentResultPdf(result)}
            className="inline-flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Bukti Hasil Tes (PDF)</span>
          </button>

          {allowReview && (
            <button
              type="button"
              onClick={() => setShowReview((prev) => !prev)}
              className="inline-flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>{showReview ? 'Tutup Pembahasan' : 'Lihat Pembahasan Soal'}</span>
              {showReview ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          )}

          <button
            id="btn-restart-exam"
            type="button"
            onClick={onRestart}
            className="inline-flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Siswa Berikutnya</span>
          </button>
        </div>
      </div>

      {allowReview && showReview && (
        <div className="mt-6 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">
              Pembahasan Kunci Jawaban
            </h3>
            <p className="text-xs text-slate-500">
              Tinjau kembali jawaban Anda beserta penjelasan langkah penyelesaiannya.
            </p>
          </div>

          <div className="space-y-4">
            {questions.map((q, idx) => {
              const resp = result.itemResponses?.[q.id];
              const isCorrect = resp?.isCorrect ?? false;
              return (
                <div
                  key={q.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 tabular-nums">
                      Soal No. {idx + 1} · {q.topic}
                    </span>
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Benar</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700">
                        <XCircle className="w-4 h-4" />
                        <span>Salah</span>
                      </span>
                    )}
                  </div>

                  {q.imageUrl && (
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex justify-center">
                      <img
                        src={q.imageUrl}
                        alt={q.imageAlt || q.topic}
                        referrerPolicy="no-referrer"
                        className="max-h-52 w-auto rounded-lg object-contain"
                      />
                    </div>
                  )}

                  {q.imageSvg && (
                    <div
                      className="p-2.5 rounded-lg bg-white border border-slate-200 flex justify-center overflow-x-auto"
                      dangerouslySetInnerHTML={{ __html: q.imageSvg }}
                    />
                  )}

                  <p className="text-xs sm:text-sm text-slate-800 font-medium">
                    {q.text}
                  </p>

                  <div className="text-xs text-slate-600 flex flex-wrap gap-4">
                    <span>
                      Jawaban Anda:{' '}
                      <strong className="text-slate-900">
                        {resp?.userAnswerText || '-'}
                      </strong>
                    </span>
                    <span>
                      Kunci:{' '}
                      <strong className="text-emerald-700">
                        {q.options?.find((o) => o.id === q.correctAnswer)?.text ||
                          String(q.correctAnswer)}
                      </strong>
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                    <strong className="text-slate-900 block mb-0.5">
                      Pembahasan:
                    </strong>
                    {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
