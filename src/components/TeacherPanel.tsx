import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowUpDown,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Database,
  Download,
  Eye,
  FileSpreadsheet,
  RefreshCw,
  Search,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Users,
} from 'lucide-react';
import { APP_CONFIG, STORAGE_KEYS } from '../constants/config';
import { storageService } from '../services/storageService';
import { ExamResult, Question } from '../types/exam';
import { exportRecapExcel } from '../utils/exportExcel';
import { exportRecapPdf } from '../utils/exportPdf';
import { BlueprintView } from './BlueprintView';
import {
  ClearAllConfirmModal,
  DeleteConfirmModal,
  GasGuideModal,
  GasSettingsModal,
  ResultDetailModal,
} from './GasModals';
import { ItemAnalysisView } from './ItemAnalysisView';
import {
  QuestionBankView,
  QuestionEditorModal,
  ResetQuestionsConfirmModal,
} from './QuestionBankView';

interface TeacherPanelProps {
  questions: Question[];
  onUpdateQuestion: (updated: Question) => void;
  onResetDefaultQuestions: () => void;
  allowReview: boolean;
  onToggleAllowReview: (val: boolean) => void;
  strictSecurityMode: boolean;
  onToggleStrictSecurityMode: (val: boolean) => void;
}

type TeacherTab = 'rekap' | 'analisis' | 'kisi-kisi' | 'soal';
type SortKey = 'timestamp' | 'nama' | 'noAbsen' | 'nilai';

export function TeacherPanel({
  questions,
  onUpdateQuestion,
  onResetDefaultQuestions,
  allowReview,
  onToggleAllowReview,
  strictSecurityMode,
  onToggleStrictSecurityMode,
}: TeacherPanelProps) {
  const [activeTab, setActiveTab] = useState<TeacherTab>('rekap');
  const [results, setResults] = useState<ExamResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Semua' | 'Lulus' | 'Belum Lulus'>('Semua');
  const [sortKey, setSortKey] = useState<SortKey>('timestamp');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedDetail, setSelectedDetail] = useState<ExamResult | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ExamResult | null>(null);
  const [isDeletingSingle, setIsDeletingSingle] = useState(false);
  const [showClearAllModal, setShowClearAllModal] = useState(false);
  const [isClearingAll, setIsClearingAll] = useState(false);

  const [showGasSettings, setShowGasSettings] = useState(false);
  const [showGasGuide, setShowGasGuide] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showResetQuestionsModal, setShowResetQuestionsModal] = useState(false);
  const [newSubmissionToast, setNewSubmissionToast] = useState<{
    count: number;
    name: string;
  } | null>(null);

  const prevCountRef = useRef<number>(0);

  const loadData = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    const data = await storageService.fetchExamResults();
    if (
      silent &&
      prevCountRef.current > 0 &&
      data.length > prevCountRef.current
    ) {
      const diff = data.length - prevCountRef.current;
      const latestName = data[0]?.nama || 'Siswa';
      setNewSubmissionToast({ count: diff, name: latestName });
    }
    prevCountRef.current = data.length;
    setResults(data);
    if (!silent) setIsLoading(false);
  }, []);

  useEffect(() => {
    void loadData(false);

    const intervalId = setInterval(() => {
      void loadData(true);
    }, 15000);

    const onLocalSubmit = (e: Event) => {
      const custom = e as CustomEvent<ExamResult>;
      setNewSubmissionToast({
        count: 1,
        name: custom.detail?.nama || 'Siswa',
      });
      void loadData(true);
    };
    window.addEventListener('sd3_exam_submitted', onLocalSubmit);

    let channel: BroadcastChannel | null = null;
    try {
      if ('BroadcastChannel' in window) {
        channel = new BroadcastChannel(STORAGE_KEYS.SYNC_CHANNEL);
        channel.onmessage = (msg) => {
          if (msg.data?.type === 'NEW_SUBMISSION') {
            setNewSubmissionToast({
              count: 1,
              name: msg.data.studentName || 'Siswa',
            });
            void loadData(true);
          } else if (
            msg.data?.type === 'DATA_DELETED' ||
            msg.data?.type === 'DATA_CLEARED'
          ) {
            void loadData(true);
          }
        };
      }
    } catch {
      // Ignore BroadcastChannel unavailability
    }

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('sd3_exam_submitted', onLocalSubmit);
      if (channel) channel.close();
    };
  }, [loadData]);

  const stats = useMemo(() => {
    const total = results.length;
    const passed = results.filter(
      (r) => r.status === 'Lulus' || r.nilai >= APP_CONFIG.KKTP
    ).length;
    const remedial = total - passed;
    const avg =
      total > 0
        ? Math.round(results.reduce((acc, r) => acc + (r.nilai || 0), 0) / total)
        : 0;
    return { total, passed, remedial, avg };
  }, [results]);

  const filteredResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const filtered = results.filter((r) => {
      const matchQuery =
        !q ||
        r.nama.toLowerCase().includes(q) ||
        String(r.noAbsen).toLowerCase().includes(q);
      const isPass = r.status === 'Lulus' || r.nilai >= APP_CONFIG.KKTP;
      const matchStatus =
        statusFilter === 'Semua' ||
        (statusFilter === 'Lulus' && isPass) ||
        (statusFilter === 'Belum Lulus' && !isPass);
      return matchQuery && matchStatus;
    });

    filtered.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'nama') {
        cmp = a.nama.localeCompare(b.nama, 'id');
      } else if (sortKey === 'noAbsen') {
        cmp = Number(a.noAbsen || 0) - Number(b.noAbsen || 0);
      } else if (sortKey === 'nilai') {
        cmp = (a.nilai || 0) - (b.nilai || 0);
      } else {
        cmp = String(a.timestamp || '').localeCompare(String(b.timestamp || ''));
      }
      return sortAsc ? cmp : -cmp;
    });

    return filtered;
  }, [results, searchQuery, statusFilter, sortKey, sortAsc]);

  const pageSize = 15;
  const totalPages = Math.max(1, Math.ceil(filteredResults.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedRows = useMemo(
    () => filteredResults.slice((safePage - 1) * pageSize, safePage * pageSize),
    [filteredResults, safePage]
  );

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc((prev) => !prev);
    } else {
      setSortKey(key);
      setSortAsc(key === 'nama' || key === 'noAbsen');
    }
  };

  const handleConfirmDeleteSingle = async () => {
    if (!deleteTarget) return;
    setIsDeletingSingle(true);
    await storageService.deleteExamResult(
      deleteTarget.timestamp,
      deleteTarget.nama,
      deleteTarget.mataPelajaran
    );
    setIsDeletingSingle(false);
    setDeleteTarget(null);
    await loadData(false);
  };

  const handleConfirmClearAll = async () => {
    setIsClearingAll(true);
    await storageService.clearAllExamResults(APP_CONFIG.MATA_PELAJARAN, false);
    setIsClearingAll(false);
    setShowClearAllModal(false);
    await loadData(false);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Teacher Dashboard Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div>
          <p className="text-xs font-semibold text-blue-700">
            Panel Guru · {APP_CONFIG.SEKOLAH} · Kelas {APP_CONFIG.KELAS}
          </p>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Manajemen Tes Sumatif {APP_CONFIG.MATA_PELAJARAN}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Guru Pengampu: <strong className="text-slate-700">{APP_CONFIG.GURU}</strong>{' '}
            · KKTP: <strong className="text-slate-700 tabular-nums">{APP_CONFIG.KKTP}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={allowReview}
              onChange={(e) => onToggleAllowReview(e.target.checked)}
              className="rounded border-slate-300 text-blue-700 focus:ring-blue-600"
            />
            <span>Pembahasan Siswa</span>
          </label>

          <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={strictSecurityMode}
              onChange={(e) => onToggleStrictSecurityMode(e.target.checked)}
              className="rounded border-slate-300 text-blue-700 focus:ring-blue-600"
            />
            <span>Pengawasan Ketat</span>
          </label>

          <button
            type="button"
            onClick={() => setShowGasSettings(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-300 transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4 text-slate-700" />
            <span>Spreadsheet</span>
          </button>

          <button
            type="button"
            onClick={() => void loadData(false)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Sinkronkan</span>
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Total Peserta Masuk</span>
            <Users className="w-4 h-4 text-blue-700" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 tabular-nums">
            {stats.total}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Rata-Rata Kelas</span>
            <BarChart3 className="w-4 h-4 text-indigo-700" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-blue-700 mt-1 tabular-nums">
            {stats.avg}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-emerald-700">
            <span>Lulus (≥ KKTP {APP_CONFIG.KKTP})</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1 tabular-nums">
            {stats.passed}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-amber-700">
            <span>Perlu Remedial</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-700 mt-1 tabular-nums">
            {stats.remedial}
          </p>
        </div>
      </div>

      {/* Navigation Tabs + Content Panel */}
      <div>
        <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1.5 rounded-t-2xl border border-b-0 border-slate-200">
          {(
            [
              { id: 'rekap', label: 'Rekap Nilai Siswa', icon: Database },
              { id: 'analisis', label: 'Analisis Butir Soal', icon: BarChart3 },
              { id: 'kisi-kisi', label: 'Kisi-Kisi Soal', icon: ClipboardList },
              { id: 'soal', label: 'Bank Soal', icon: BookOpen },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {activeTab === 'rekap' && (
          <div className="bg-white rounded-b-2xl p-5 sm:p-6 border border-slate-200 space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Cari nama atau nomor absen..."
                    className="pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 w-60"
                  />
                </div>

                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
                  {(['Semua', 'Lulus', 'Belum Lulus'] as const).map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => {
                        setStatusFilter(status);
                        setCurrentPage(1);
                      }}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${
                        statusFilter === status
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={results.length === 0}
                  onClick={() => exportRecapExcel(filteredResults, questions)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Unduh Excel</span>
                </button>

                <button
                  type="button"
                  disabled={results.length === 0}
                  onClick={() => exportRecapPdf(filteredResults)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh Rekap PDF</span>
                </button>

                <button
                  type="button"
                  disabled={results.length === 0}
                  onClick={() => setShowClearAllModal(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Kosongkan</span>
                </button>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold">
                    <th className="py-3 px-3 text-center w-12">No</th>
                    <th
                      className="py-3 px-3 cursor-pointer hover:bg-slate-200/70 transition-colors"
                      onClick={() => toggleSort('timestamp')}
                    >
                      <div className="flex items-center gap-1">
                        <span>Waktu</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th
                      className="py-3 px-3 cursor-pointer hover:bg-slate-200/70 transition-colors"
                      onClick={() => toggleSort('nama')}
                    >
                      <div className="flex items-center gap-1">
                        <span>Nama Siswa</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th className="py-3 px-3">Mata Pelajaran</th>
                    <th className="py-3 px-3">Kelas</th>
                    <th
                      className="py-3 px-3 cursor-pointer hover:bg-slate-200/70 transition-colors text-center"
                      onClick={() => toggleSort('noAbsen')}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>Absen</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th className="py-3 px-3 text-center text-emerald-700">
                      Benar
                    </th>
                    <th className="py-3 px-3 text-center text-rose-700">
                      Salah
                    </th>
                    <th
                      className="py-3 px-3 cursor-pointer hover:bg-slate-200/70 transition-colors text-center"
                      onClick={() => toggleSort('nilai')}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>Nilai</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 text-center">Integritas</th>
                    <th className="py-3 px-3 text-center w-32">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan={12} className="py-12 text-center text-slate-500">
                        <div className="inline-flex items-center gap-2">
                          <RefreshCw className="w-4 h-4 animate-spin text-blue-700" />
                          <span>Mengambil data dari Google Spreadsheet...</span>
                        </div>
                      </td>
                    </tr>
                  ) : paginatedRows.length === 0 ? (
                    <tr>
                      <td colSpan={12} className="py-12 text-center text-slate-500">
                        <div className="max-w-xs mx-auto space-y-1">
                          <p className="font-semibold text-slate-700">
                            {results.length === 0
                              ? 'Belum ada data nilai di Google Spreadsheet.'
                              : 'Tidak ada data siswa yang cocok dengan filter pencarian.'}
                          </p>
                          <p className="text-xs text-slate-400">
                            {results.length === 0
                              ? 'Data dari siswa akan otomatis tercatat di sini setelah pengerjaan tes selesai.'
                              : 'Silakan sesuaikan kata kunci pencarian atau filter Anda.'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedRows.map((row, idx) => {
                      const rowNum = (safePage - 1) * pageSize + idx + 1;
                      const isPass =
                        row.status === 'Lulus' || row.nilai >= APP_CONFIG.KKTP;
                      return (
                        <tr
                          key={row.id || `${row.timestamp}-${row.nama}-${idx}`}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="py-3 px-3 text-center font-mono text-slate-500 tabular-nums">
                            {rowNum}
                          </td>
                          <td className="py-3 px-3 text-slate-600 font-mono text-[11px] whitespace-nowrap tabular-nums">
                            {row.timestamp}
                          </td>
                          <td className="py-3 px-3 font-semibold text-slate-900">
                            {row.nama}
                          </td>
                          <td className="py-3 px-3 font-semibold text-blue-700">
                            {row.mataPelajaran || APP_CONFIG.MATA_PELAJARAN}
                          </td>
                          <td className="py-3 px-3 text-slate-700 font-medium">
                            {row.kelas || APP_CONFIG.KELAS}
                          </td>
                          <td className="py-3 px-3 text-center font-mono text-slate-700 font-semibold tabular-nums">
                            {row.noAbsen}
                          </td>
                          <td className="py-3 px-3 text-center font-bold text-emerald-700 tabular-nums">
                            {row.benar}
                          </td>
                          <td className="py-3 px-3 text-center font-bold text-rose-700 tabular-nums">
                            {row.salah}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span
                              className={`font-black text-sm tabular-nums ${
                                isPass ? 'text-emerald-700' : 'text-amber-700'
                              }`}
                            >
                              {row.nilai}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center font-bold">
                            <span
                              className={
                                isPass ? 'text-emerald-700' : 'text-amber-700'
                              }
                            >
                              {row.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center">
                            {row.submissionReason === 'violation_limit' ? (
                              <span className="inline-flex items-center gap-1 text-rose-700 font-bold">
                                <ShieldAlert className="w-3.5 h-3.5" />
                                <span>3x Auto-Submit</span>
                              </span>
                            ) : row.violationsCount && row.violationsCount > 0 ? (
                              <span className="inline-flex items-center gap-1 text-amber-700 font-bold tabular-nums">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                <span>{row.violationsCount}x Peringatan</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span>Tertib</span>
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                id={`btn-detail-${idx}`}
                                type="button"
                                onClick={() => setSelectedDetail(row)}
                                className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                title="Lihat Detail Hasil"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                id={`btn-download-pdf-${idx}`}
                                type="button"
                                onClick={() => exportRecapPdf([row])}
                                className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                                title="Download PDF Lembar Hasil"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                              <button
                                id={`btn-delete-${idx}`}
                                type="button"
                                onClick={() => setDeleteTarget(row)}
                                className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                title="Hapus Data Siswa"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-3 text-xs text-slate-600">
                <span className="tabular-nums">
                  Menampilkan {(safePage - 1) * pageSize + 1} -{' '}
                  {Math.min(safePage * pageSize, filteredResults.length)} dari{' '}
                  {filteredResults.length} data
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={safePage === 1}
                    className="p-1.5 rounded-lg border border-slate-300 disabled:opacity-40 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-2 font-bold text-slate-800 tabular-nums">
                    {safePage} / {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={safePage === totalPages}
                    className="p-1.5 rounded-lg border border-slate-300 disabled:opacity-40 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'analisis' && (
          <div className="bg-white rounded-b-2xl p-6 border border-slate-200">
            <ItemAnalysisView results={results} questions={questions} />
          </div>
        )}

        {activeTab === 'kisi-kisi' && (
          <div className="bg-white rounded-b-2xl p-6 border border-slate-200">
            <BlueprintView questions={questions} />
          </div>
        )}

        {activeTab === 'soal' && (
          <div className="bg-white rounded-b-2xl p-6 border border-slate-200">
            <QuestionBankView
              questions={questions}
              onEditQuestion={(q) => setEditingQuestion(q)}
              onRequestResetQuestions={() => setShowResetQuestionsModal(true)}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      <GasSettingsModal
        isOpen={showGasSettings}
        onClose={() => setShowGasSettings(false)}
        onOpenGasGuide={() => setShowGasGuide(true)}
        onDataSynced={() => void loadData(false)}
      />

      <GasGuideModal
        isOpen={showGasGuide}
        onClose={() => setShowGasGuide(false)}
      />

      <ResultDetailModal
        result={selectedDetail}
        isOpen={!!selectedDetail}
        onClose={() => setSelectedDetail(null)}
      />

      <DeleteConfirmModal
        target={deleteTarget}
        isDeleting={isDeletingSingle}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void handleConfirmDeleteSingle()}
      />

      <ClearAllConfirmModal
        isOpen={showClearAllModal}
        totalCount={results.length}
        isDeleting={isClearingAll}
        onClose={() => setShowClearAllModal(false)}
        onConfirm={() => void handleConfirmClearAll()}
      />

      <QuestionEditorModal
        key={editingQuestion?.id || 'edit-none'}
        question={editingQuestion}
        isOpen={!!editingQuestion}
        onClose={() => setEditingQuestion(null)}
        onSave={(updated) => {
          onUpdateQuestion(updated);
          setEditingQuestion(null);
        }}
      />

      <ResetQuestionsConfirmModal
        isOpen={showResetQuestionsModal}
        onClose={() => setShowResetQuestionsModal(false)}
        onConfirm={onResetDefaultQuestions}
      />

      {newSubmissionToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm">
          <div className="bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <div className="text-left flex-1 min-w-0">
              <p className="text-xs font-extrabold">
                Jawaban Siswa Masuk (+{newSubmissionToast.count} Data Baru)
              </p>
              <p className="text-xs opacity-90 truncate">
                <span className="font-bold underline">
                  {newSubmissionToast.name}
                </span>{' '}
                baru saja menyelesaikan ujian. Rekap otomatis diperbarui.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setNewSubmissionToast(null)}
              className="text-white hover:text-emerald-100 font-bold cursor-pointer px-1"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
