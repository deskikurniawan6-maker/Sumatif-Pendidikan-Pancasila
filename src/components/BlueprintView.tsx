import { useMemo } from 'react';
import { ClipboardList, Download } from 'lucide-react';
import { APP_CONFIG } from '../constants/config';
import { Question } from '../types/exam';
import { exportBlueprintPdf } from '../utils/exportPdf';
import { buildBlueprintRows } from '../utils/itemAnalysis';

interface BlueprintViewProps {
  questions: Question[];
}

export function BlueprintView({ questions }: BlueprintViewProps) {
  const rows = useMemo(() => buildBlueprintRows(questions), [questions]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-blue-700" />
            <span>Kisi-Kisi Penulisan Soal ({rows.length} Butir)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {APP_CONFIG.SEKOLAH} · {APP_CONFIG.MATA_PELAJARAN} Kelas{' '}
            {APP_CONFIG.KELAS} · Materi: {APP_CONFIG.MATERI}
          </p>
        </div>

        <button
          type="button"
          onClick={() => exportBlueprintPdf(questions)}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Unduh Kisi-Kisi Resmi (PDF)</span>
        </button>
      </div>

      <div className="border border-slate-200 rounded-xl overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold">
              <th className="py-3 px-3 text-center w-12">No</th>
              <th className="py-3 px-3">Elemen</th>
              <th className="py-3 px-3 min-w-[220px]">Tujuan Pembelajaran</th>
              <th className="py-3 px-3">Materi Pokok</th>
              <th className="py-3 px-3 min-w-[240px]">Indikator Soal</th>
              <th className="py-3 px-3 text-center">Level</th>
              <th className="py-3 px-3 text-center">Kunci</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {rows.map((bp) => (
              <tr key={bp.noSoal} className="hover:bg-slate-50 align-top">
                <td className="py-3 px-3 text-center font-bold text-slate-800 tabular-nums">
                  {bp.noSoal}
                </td>
                <td className="py-3 px-3 font-semibold text-blue-700 whitespace-nowrap">
                  {bp.elemen}
                </td>
                <td className="py-3 px-3 text-slate-700 leading-relaxed">
                  {bp.tujuanPembelajaran}
                </td>
                <td className="py-3 px-3 font-medium text-slate-800">
                  {bp.materiPokok}
                </td>
                <td className="py-3 px-3 text-slate-700 leading-relaxed">
                  {bp.indikatorSoal}
                </td>
                <td className="py-3 px-3 text-center font-bold">
                  <span
                    className={
                      bp.levelKognitif === 'L1'
                        ? 'text-emerald-700'
                        : bp.levelKognitif === 'L2'
                        ? 'text-blue-700'
                        : 'text-amber-700'
                    }
                  >
                    {bp.levelKognitif}
                  </span>
                </td>
                <td className="py-3 px-3 text-center font-mono text-slate-800 whitespace-nowrap">
                  {bp.kunciJawaban}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
