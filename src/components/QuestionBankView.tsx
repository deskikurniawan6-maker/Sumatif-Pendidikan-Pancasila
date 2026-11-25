import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  Download,
  Edit3,
  RotateCcw,
  Save,
  Search,
  X,
} from 'lucide-react';
import { Question } from '../types/exam';
import { exportExamQuestionsPdf } from '../utils/exportPdf';

interface QuestionBankViewProps {
  questions: Question[];
  onEditQuestion: (q: Question) => void;
  onRequestResetQuestions: () => void;
}

export function QuestionBankView({
  questions,
  onEditQuestion,
  onRequestResetQuestions,
}: QuestionBankViewProps) {
  const [search, setSearch] = useState('');
  const [topicFilter, setTopicFilter] = useState('Semua');

  const topics = useMemo(() => {
    const unique = Array.from(new Set(questions.map((q) => q.topic)));
    return ['Semua', ...unique];
  }, [questions]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return questions.filter((q) => {
      const matchTopic = topicFilter === 'Semua' || q.topic === topicFilter;
      const matchSearch =
        !s ||
        q.text.toLowerCase().includes(s) ||
        q.topic.toLowerCase().includes(s);
      return matchTopic && matchSearch;
    });
  }, [questions, search, topicFilter]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-700" />
            <span>Bank Soal & Kunci Jawaban ({questions.length} Butir)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Anda dapat menyunting redaksi soal, pilihan jawaban, kunci, dan
            pembahasan secara langsung.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => exportExamQuestionsPdf(questions)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh Naskah Soal (PDF)</span>
          </button>
          <button
            type="button"
            onClick={onRequestResetQuestions}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Soal Asli</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari isi soal atau topik..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <select
          aria-label="Filter topik soal"
          value={topicFilter}
          onChange={(e) => setTopicFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
        >
          {topics.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {filtered.map((q) => (
          <div
            key={q.id}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="text-xs text-slate-500 font-medium">
                <span className="font-bold text-slate-900 tabular-nums">
                  No. {q.id}
                </span>{' '}
                · <span>{q.topic}</span> · <span>{q.difficulty}</span> ·{' '}
                <span className="text-blue-700 font-semibold">
                  {q.levelKognitif || 'L1'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onEditQuestion(q)}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 cursor-pointer shrink-0"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>

            {q.imageUrl && (
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex justify-center">
                <img
                  src={q.imageUrl}
                  alt={q.imageAlt || q.topic}
                  referrerPolicy="no-referrer"
                  className="max-h-56 w-auto rounded-lg object-contain"
                />
              </div>
            )}

            {q.imageSvg && (
              <div
                className="p-2.5 rounded-lg bg-white border border-slate-200 flex justify-center overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: q.imageSvg }}
              />
            )}

            <p className="text-xs sm:text-sm font-medium text-slate-900 whitespace-pre-line">
              {q.text}
            </p>

            {q.options && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                {q.options.map((opt) => {
                  const isKey = opt.id === q.correctAnswer;
                  return (
                    <div
                      key={opt.id}
                      className={`px-3 py-1.5 rounded-lg border ${
                        isKey
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      {opt.id}. {opt.text}
                    </div>
                  );
                })}
              </div>
            )}

            <p className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200 whitespace-pre-line">
              <strong className="text-slate-800">Pembahasan:</strong>{' '}
              {q.explanation}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

interface QuestionEditorModalProps {
  question: Question | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: Question) => void;
}

export function QuestionEditorModal({
  question,
  isOpen,
  onClose,
  onSave,
}: QuestionEditorModalProps) {
  const [text, setText] = useState(question?.text || '');
  const [topic, setTopic] = useState(question?.topic || '');
  const [explanation, setExplanation] = useState(question?.explanation || '');
  const [correctAnswer, setCorrectAnswer] = useState<string>(
    typeof question?.correctAnswer === 'string' ? question.correctAnswer : 'A'
  );
  const [options, setOptions] = useState(question?.options || []);

  if (!isOpen || !question) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...question,
      text: text.trim(),
      topic: topic.trim(),
      explanation: explanation.trim(),
      correctAnswer,
      options,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">
            Edit Soal No. {question.id}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Topik / Materi
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Teks Pertanyaan
            </label>
            <textarea
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          {options.length > 0 && (
            <div className="space-y-2">
              <label className="block font-bold text-slate-700">
                Pilihan Jawaban & Kunci Benar
              </label>
              {options.map((opt, idx) => (
                <div key={opt.id} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correctAnswerKey"
                    checked={correctAnswer === opt.id}
                    onChange={() => setCorrectAnswer(opt.id)}
                    aria-label={`Jadikan ${opt.id} kunci jawaban`}
                  />
                  <span className="font-bold w-5 text-slate-700">{opt.id}.</span>
                  <input
                    type="text"
                    value={opt.text}
                    onChange={(e) => {
                      const next = [...options];
                      next[idx] = { ...opt, text: e.target.value };
                      setOptions(next);
                    }}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
              ))}
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Pembahasan
            </label>
            <textarea
              rows={3}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface ResetQuestionsConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ResetQuestionsConfirmModal({
  isOpen,
  onClose,
  onConfirm,
}: ResetQuestionsConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Kembalikan Bank Soal Standar?
            </h3>
            <p className="text-xs text-slate-500">
              Seluruh perubahan edit soal akan dikembalikan ke 50 butir asli.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl cursor-pointer"
          >
            Ya, Reset Soal
          </button>
        </div>
      </div>
    </div>
  );
}
