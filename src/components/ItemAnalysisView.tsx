import { useMemo, useState } from 'react';
import {
  BarChart3,
  Download,
  Eye,
  FileText,
  Search,
  X,
} from 'lucide-react';
import { APP_CONFIG } from '../constants/config';
import { ExamResult, Question } from '../types/exam';
import {
  exportItemAnalysisPdf,
  exportStudentDiagnosticPdf,
} from '../utils/exportPdf';
import {
  buildStudentDiagnostic,
  computeItemAnalysis,
  getStudentResultKey,
} from '../utils/itemAnalysis';

interface ItemAnalysisViewProps {
  results: ExamResult[];
  questions: Question[];
}

export function ItemAnalysisView({
  results,
  questions,
}: ItemAnalysisViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Semua' | 'Tuntas' | 'Remedial'>('Semua');
  const [selectedStudent, setSelectedStudent] = useState<ExamResult | null>(null);

  const { itemStats, allResponses } = useMemo(
    () => computeItemAnalysis(results, questions),
    [results, questions]
  );

  const summary = useMemo(() => {
    const avgKetercapaian =
      itemStats.length > 0
        ? Math.round(
            itemStats.reduce((acc, s) => acc + s.persentaseKetercapaian, 0) /
              itemStats.length
          )
        : 0;
    const mudahCount = itemStats.filter(
      (s) => s.klasifikasiKesukaran === 'Mudah'
    ).length;
    const sedangCount = itemStats.filter(
      (s) => s.klasifikasiKesukaran === 'Sedang'
    ).length;
    const sukarCount = itemStats.filter(
      (s) => s.klasifikasiKesukaran === 'Sukar'
    ).length;
    const sorted = [...itemStats].sort(
      (a, b) => a.persentaseKetercapaian - b.persentaseKetercapaian
    );
    return {
      avgKetercapaian,
      mudahCount,
      sedangCount,
      sukarCount,
      hardest: sorted[0] || null,
      easiest: sorted[sorted.length - 1] || null,
    };
  }, [itemStats]);

  const filteredStudents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return results.filter((res) => {
      const matchesQuery =
        !q ||
        res.nama.toLowerCase().includes(q) ||
        String(res.noAbsen).toLowerCase().includes(q);
      const passed = res.status === 'Lulus' || res.nilai >= APP_CONFIG.KKTP;
      const matchesStatus =
        statusFilter === 'Semua' ||
        (statusFilter === 'Tuntas' && passed) ||
        (statusFilter === 'Remedial' && !passed);
      return matchesQuery && matchesStatus;
    });
  }, [results, searchQuery, statusFilter]);

  const selectedDiagnostic = useMemo(() => {
    if (!selectedStudent) return null;
    const responses =
      allResponses.get(getStudentResultKey(selectedStudent)) || {};
    return buildStudentDiagnostic(selectedStudent, questions, responses);
  }, [selectedStudent, allResponses, questions]);

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <span>Analisis Butir Soal Empiris & Diagnostik Siswa</span>
          </h3>
          <p className="text-xs text-slate-300">
            Menghitung ketercapaian klasikal, indeks kesukaran, daya pembeda
            (Kelompok Atas/Bawah 27%), dan rekomendasi tindak lanjut.
          </p>
        </div>

        <button
          type="button"
          onClick={() => exportItemAnalysisPdf(results, questions, itemStats)}
          disabled={results.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-colors cursor-pointer disabled:opacity-50 shrink-0 self-start lg:self-auto"
        >
          <Download className="w-4 h-4 text-blue-700" />
          <span>Unduh Analisis Butir Soal (PDF)</span>
        </button>
      </div>

      {/* Summary KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-xs text-slate-500 block">
            Rata-Rata Ketercapaian Soal
          </span>
          <span className="text-2xl font-black text-blue-700 tabular-nums mt-1 block">
            {summary.avgKetercapaian}%
          </span>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-xs text-slate-500 block">
            Distribusi Kesukaran
          </span>
          <span className="text-xs font-bold text-slate-800 mt-2 block tabular-nums">
            Mudah {summary.mudahCount} · Sedang {summary.sedangCount} · Sukar{' '}
            {summary.sukarCount}
          </span>
        </div>
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
          <span className="text-xs text-emerald-700 block">
            Soal Paling Dikuasai
          </span>
          <span className="text-sm font-bold text-emerald-950 mt-1 block tabular-nums">
            {summary.easiest
              ? `No. ${summary.easiest.questionNumber} (${summary.easiest.persentaseKetercapaian}%)`
              : '-'}
          </span>
        </div>
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
          <span className="text-xs text-rose-700 block">
            Soal Perlu Penguatan
          </span>
          <span className="text-sm font-bold text-rose-950 mt-1 block tabular-nums">
            {summary.hardest
              ? `No. ${summary.hardest.questionNumber} (${summary.hardest.persentaseKetercapaian}%)`
              : '-'}
          </span>
        </div>
      </div>

      {/* Item Stats Table */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-800">
            Matriks Statistik {questions.length} Butir Soal
          </h4>
          <span className="text-xs text-slate-500 tabular-nums">
            Basis Sampel: {results.length} Peserta
          </span>
        </div>
        <div className="overflow-x-auto max-h-[420px]">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 bg-slate-100 text-slate-700 border-b border-slate-200 z-10">
              <tr>
                <th className="py-2.5 px-3 text-center w-12">No</th>
                <th className="py-2.5 px-3">Elemen · Topik</th>
                <th className="py-2.5 px-3 text-center">Level</th>
                <th className="py-2.5 px-3 text-center">Kunci</th>
                <th className="py-2.5 px-3 text-center text-emerald-700">Benar</th>
                <th className="py-2.5 px-3 text-center text-rose-700">Salah</th>
                <th className="py-2.5 px-3 text-center">Tuntas</th>
                <th className="py-2.5 px-3 text-center">Kesukaran</th>
                <th className="py-2.5 px-3 text-center">Daya Pembeda</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {itemStats.map((stat) => (
                <tr key={stat.questionId} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 text-center font-bold text-slate-800 tabular-nums">
                    {stat.questionNumber}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-semibold text-slate-900 block">
                      {stat.topic}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Elemen {stat.elemen}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold text-blue-700">
                    {stat.levelKognitif}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-slate-700">
                    {stat.kunciJawaban.split(' ')[0]}
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold text-emerald-700 tabular-nums">
                    {stat.correctCount}
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold text-rose-700 tabular-nums">
                    {stat.wrongCount}
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold text-slate-900 tabular-nums">
                    {stat.persentaseKetercapaian}%
                  </td>
                  <td className="py-2.5 px-3 text-center font-semibold">
                    <span
                      className={
                        stat.klasifikasiKesukaran === 'Mudah'
                          ? 'text-emerald-700'
                          : stat.klasifikasiKesukaran === 'Sukar'
                          ? 'text-rose-700'
                          : 'text-amber-700'
                      }
                    >
                      {stat.klasifikasiKesukaran}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center tabular-nums">
                    <span className="font-bold text-slate-800 block">
                      {stat.dayaPembeda.toFixed(2)}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {stat.dayaPembedaLabel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Individual Student Diagnostic List */}
      <div className="border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Diagnostik & Tindak Lanjut Individual Siswa
            </h4>
            <p className="text-xs text-slate-500">
              Klik detail untuk melihat rekomendasi pengayaan atau remedial setiap
              peserta didik.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama/absen..."
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              {(['Semua', 'Tuntas', 'Remedial'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setStatusFilter(tab)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md cursor-pointer transition-colors ${
                    statusFilter === tab
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredStudents.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">
            Belum ada data siswa yang sesuai filter.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredStudents.map((res, idx) => {
              const passed =
                res.status === 'Lulus' || res.nilai >= APP_CONFIG.KKTP;
              return (
                <div
                  key={res.id || `${res.nama}-${idx}`}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {res.nama}
                    </p>
                    <p className="text-[11px] text-slate-500 tabular-nums mt-0.5">
                      Absen {res.noAbsen} · Nilai{' '}
                      <strong
                        className={passed ? 'text-emerald-700' : 'text-amber-700'}
                      >
                        {res.nilai}
                      </strong>{' '}
                      · {passed ? 'Pengayaan' : 'Remedial'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedStudent(res)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 cursor-pointer shrink-0"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Diagnostik</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Diagnostic Detail Modal */}
      {selectedStudent && selectedDiagnostic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Laporan Diagnostik: {selectedStudent.nama}
                </h3>
                <p className="text-xs text-slate-500 tabular-nums">
                  Absen {selectedStudent.noAbsen} · Nilai {selectedStudent.nilai}{' '}
                  ({selectedDiagnostic.isPassed ? 'Tuntas KKTP' : 'Perlu Remedial'})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-700" />
                  <span>Rekomendasi Tindak Lanjut Guru</span>
                </h4>
                <ul className="space-y-1.5 text-slate-700 list-disc pl-4">
                  {selectedDiagnostic.recommendations.map((rec, i) => (
                    <li key={i} className="leading-relaxed">
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              {selectedDiagnostic.weakTopics.length > 0 && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
                  <h4 className="font-bold text-amber-950">
                    Topik Materi yang Perlu Penguatan
                  </h4>
                  <div className="space-y-1.5">
                    {selectedDiagnostic.weakTopics.map((wt) => (
                      <div
                        key={wt.topic}
                        className="flex items-center justify-between bg-white/80 px-3 py-2 rounded-lg border border-amber-200"
                      >
                        <span className="font-semibold text-slate-900">
                          {wt.topic} ({wt.elemen})
                        </span>
                        <span className="font-mono text-amber-900 tabular-nums">
                          Soal No. {wt.wrongQuestions.join(', ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() =>
                  exportStudentDiagnosticPdf(selectedStudent, selectedDiagnostic)
                }
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh PDF Diagnostik</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
