import { ArrowLeft, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  currentStage: number;
  onOpenTeacherPanel: () => void;
  onBackToStudentView: () => void;
}

export function Header({
  currentStage,
  onOpenTeacherPanel,
  onBackToStudentView,
}: HeaderProps) {
  const steps = [
    { id: 1, label: '1. Identitas' },
    { id: 2, label: '2. Lembar Soal' },
    { id: 3, label: '3. Hasil Tes' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-element Brand Wordmark */}
        <span className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0">
          Tes Sumatif Pendidikan Pancasila VI
        </span>

        {/* Zone 2: Concise single-line stage links */}
        <nav
          aria-label="Tahapan Tes Sumatif"
          className="hidden md:flex items-center gap-6 text-sm font-medium"
        >
          {steps.map((step) => {
            const isActive = currentStage === step.id;
            const isDone = currentStage > step.id && currentStage !== 4;
            return (
              <span
                key={step.id}
                className={`whitespace-nowrap shrink-0 pb-0.5 transition-colors ${
                  isActive
                    ? 'text-blue-700 font-bold border-b-2 border-blue-700'
                    : isDone
                    ? 'text-emerald-700 font-semibold'
                    : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            );
          })}
        </nav>

        {/* Zone 3: Single primary action */}
        <div className="flex items-center shrink-0">
          {currentStage === 4 ? (
            <button
              id="btn-back-student"
              type="button"
              onClick={onBackToStudentView}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-300 cursor-pointer whitespace-nowrap shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Halaman Ujian Siswa</span>
            </button>
          ) : (
            <button
              id="btn-open-teacher-panel"
              type="button"
              onClick={onOpenTeacherPanel}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
              title="Masuk ke Panel Guru"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Panel Guru</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
