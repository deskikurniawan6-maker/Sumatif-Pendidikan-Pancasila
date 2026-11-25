import { useState } from 'react';
import {
  AlertTriangle,
  BookOpen,
  Check,
  CheckCircle2,
  CloudUpload,
  Copy,
  Download,
  Loader2,
  RefreshCw,
  RotateCcw,
  Save,
  Trash2,
  User,
  X,
} from 'lucide-react';
import { APP_CONFIG, GAS_TEMPLATE_CODE } from '../constants/config';
import { storageService } from '../services/storageService';
import { ExamResult } from '../types/exam';
import { exportStudentResultPdf } from '../utils/exportPdf';

interface GasSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenGasGuide: () => void;
  onDataSynced: () => void;
}

export function GasSettingsModal({
  isOpen,
  onClose,
  onOpenGasGuide,
  onDataSynced,
}: GasSettingsModalProps) {
  const [urlInput, setUrlInput] = useState(() => storageService.getGasUrl());
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [savedNotice, setSavedNotice] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const localCount = storageService.getLocalExamResults().length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Pengaturan Google Spreadsheet
            </h3>
            <p className="text-xs text-slate-500">
              Hubungkan aplikasi dengan Google Apps Script Web App
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <label
            htmlFor="input-gas-url"
            className="block text-xs font-bold text-slate-700 mb-1.5"
          >
            URL Google Apps Script (/exec)
          </label>
          <input
            id="input-gas-url"
            type="url"
            value={urlInput}
            onChange={(e) => {
              setUrlInput(e.target.value);
              setTestResult(null);
            }}
            placeholder="https://script.google.com/macros/s/.../exec"
            className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
          />
          <p className="mt-1.5 text-xs text-slate-500">
            Dapatkan URL ini setelah menerapkan (Deploy) skrip di spreadsheet Anda
            dengan akses “Anyone”.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={async () => {
              setIsTesting(true);
              setTestResult(null);
              setSavedNotice(false);
              const res = await storageService.testGasConnection(urlInput.trim());
              setIsTesting(false);
              setTestResult(res);
            }}
            disabled={isTesting || !urlInput.trim()}
            className="px-3 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-300 transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
            <span>{isTesting ? 'Menguji...' : 'Uji Koneksi'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              storageService.setGasUrl(urlInput.trim());
              setSavedNotice(true);
              setTimeout(() => {
                setSavedNotice(false);
                onDataSynced();
              }, 1500);
            }}
            disabled={!urlInput.trim()}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Simpan URL</span>
          </button>

          <button
            type="button"
            onClick={() => {
              storageService.resetGasUrl();
              setUrlInput(APP_CONFIG.GOOGLE_APPS_SCRIPT_URL);
              setTestResult(null);
              setSavedNotice(true);
              setTimeout(() => {
                setSavedNotice(false);
                onDataSynced();
              }, 1500);
            }}
            className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
            title="Kembalikan ke URL default"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenGasGuide();
            }}
            className="ml-auto px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Buka Panduan Skrip</span>
          </button>
        </div>

        {savedNotice && (
          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>URL Google Apps Script berhasil disimpan!</span>
          </div>
        )}

        {testResult && (
          <div
            className={`p-3.5 rounded-xl border text-xs space-y-1 ${
              testResult.success
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-rose-50 border-rose-200 text-rose-950'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold">
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>
                {testResult.success ? 'Koneksi Berhasil!' : 'Koneksi Gagal'}
              </span>
            </div>
            <p className="text-xs leading-relaxed pl-5">{testResult.message}</p>
          </div>
        )}

        <div className="pt-3 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-slate-800 block tabular-nums">
                Sinkronisasi Data Siswa ({localCount} Tersimpan di Perangkat)
              </span>
              <span className="text-xs text-slate-500">
                Unggah semua nilai siswa lokal ke spreadsheet
              </span>
            </div>
            <button
              type="button"
              onClick={async () => {
                setIsSyncing(true);
                setSyncNotice(null);
                const res = await storageService.syncAllLocalToCloud();
                setIsSyncing(false);
                if (res.total === 0) {
                  setSyncNotice(
                    'Tidak ada data hasil tes offline yang perlu disinkronkan.'
                  );
                } else {
                  setSyncNotice(
                    `Berhasil menyinkronkan ${res.success} dari ${res.total} data siswa ke Google Spreadsheet!`
                  );
                  onDataSynced();
                }
              }}
              disabled={isSyncing || localCount === 0}
              className="px-3 py-2 text-xs font-bold text-slate-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-300 transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shrink-0"
            >
              <CloudUpload className="w-4 h-4 text-emerald-700" />
              <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkronkan Sekarang'}</span>
            </button>
          </div>
          {syncNotice && (
            <div className="p-2.5 bg-slate-50 rounded-lg text-xs text-slate-700 border border-slate-200">
              {syncNotice}
            </div>
          )}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

interface GasGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GasGuideModal({ isOpen, onClose }: GasGuideModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(GAS_TEMPLATE_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Panduan Skrip Google Apps Script (Multi-Mapel)
            </h3>
            <p className="text-xs text-slate-500">
              Salin kode berikut ke Google Sheets → Ekstensi → Apps Script lalu Deploy
              sebagai Web App (Akses: Anyone)
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-4 flex-1 overflow-y-auto rounded-xl bg-slate-900 text-slate-100 p-4 font-mono text-[11px] leading-relaxed">
          <pre className="whitespace-pre-wrap">{GAS_TEMPLATE_CODE}</pre>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Kode Tersalin!' : 'Salin Seluruh Kode'}</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

interface ResultDetailModalProps {
  result: ExamResult | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ResultDetailModal({
  result,
  isOpen,
  onClose,
}: ResultDetailModalProps) {
  if (!isOpen || !result) return null;

  const isPassed =
    result.status === 'Lulus' || result.nilai >= APP_CONFIG.KKTP;
  const violationsCount = result.violationsCount || 0;
  const isViolationAutoSubmit = result.submissionReason === 'violation_limit';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{result.nama}</h3>
              <p className="text-xs text-slate-500 tabular-nums">
                Absen {result.noAbsen} · Kelas {result.kelas || APP_CONFIG.KELAS}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-5 space-y-4 text-xs sm:text-sm">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 block">
                Nilai Tes Sumatif
              </span>
              <span className="text-xs text-slate-500 tabular-nums">
                KKTP: {APP_CONFIG.KKTP}
              </span>
            </div>
            <div className="text-right">
              <span
                className={`text-3xl font-black block tabular-nums ${
                  isPassed ? 'text-emerald-600' : 'text-amber-600'
                }`}
              >
                {result.nilai}
              </span>
              <span
                className={`text-xs font-bold ${
                  isPassed ? 'text-emerald-700' : 'text-amber-700'
                }`}
              >
                {result.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="text-emerald-700 block">Jawaban Benar</span>
              <span className="font-bold text-emerald-900 text-base tabular-nums">
                {result.benar} Soal
              </span>
            </div>
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
              <span className="text-rose-700 block">Jawaban Salah</span>
              <span className="font-bold text-rose-900 text-base tabular-nums">
                {result.salah} Soal
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Waktu Pengerjaan:</span>
              <span className="font-medium text-slate-800 tabular-nums">
                {result.timestamp}
              </span>
            </div>
            {result.tglLahir && (
              <div className="flex justify-between">
                <span className="text-slate-500">Tanggal Lahir:</span>
                <span className="font-medium text-slate-800">
                  {result.tglLahir}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Integritas Ujian:</span>
              <span
                className={`font-bold ${
                  isViolationAutoSubmit
                    ? 'text-rose-600'
                    : violationsCount > 0
                    ? 'text-amber-600'
                    : 'text-emerald-700'
                }`}
              >
                {isViolationAutoSubmit
                  ? '3x Auto-Submit'
                  : violationsCount > 0
                  ? `${violationsCount}x Peringatan`
                  : 'Tertib (0 Pelanggaran)'}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => exportStudentResultPdf(result)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh PDF Hasil</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

interface DeleteConfirmModalProps {
  target: ExamResult | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmModal({
  target,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  if (!target) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Hapus Data Nilai Siswa?
            </h3>
            <p className="text-xs text-slate-500">
              Data milik <strong>{target.nama}</strong> (Absen {target.noAbsen}) akan
              dihapus dari perangkat dan Google Spreadsheet.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl cursor-pointer disabled:opacity-60"
          >
            {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{isDeleting ? 'Menghapus...' : 'Ya, Hapus'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

interface ClearAllConfirmModalProps {
  isOpen: boolean;
  totalCount: number;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ClearAllConfirmModal({
  isOpen,
  totalCount,
  isDeleting,
  onClose,
  onConfirm,
}: ClearAllConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Bersihkan Semua Data Nilai ({totalCount})?
            </h3>
            <p className="text-xs text-slate-500">
              Seluruh rekapan nilai pada mata pelajaran{' '}
              <strong>{APP_CONFIG.MATA_PELAJARAN}</strong> akan dikosongkan
              (header tabel Spreadsheet tetap aman).
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl cursor-pointer disabled:opacity-60"
          >
            {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{isDeleting ? 'Membersihkan...' : 'Ya, Kosongkan Semua'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
