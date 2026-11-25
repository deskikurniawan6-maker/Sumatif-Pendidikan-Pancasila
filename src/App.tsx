/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Header } from './components/Header';
import { QuizScreen } from './components/QuizScreen';
import { ResultScreen } from './components/ResultScreen';
import { StudentIdentityForm } from './components/StudentIdentityForm';
import { TeacherAuthModal } from './components/TeacherAuthModal';
import { TeacherPanel } from './components/TeacherPanel';
import { APP_CONFIG, STORAGE_KEYS } from './constants/config';
import { DEFAULT_QUESTIONS } from './data/questions';
import { ExamResult, Question, StudentIdentity } from './types/exam';

export default function App() {
  const [stage, setStage] = useState<number>(1);
  const [prevStudentStage, setPrevStudentStage] = useState<number>(1);
  const [studentIdentity, setStudentIdentity] =
    useState<StudentIdentity | null>(null);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);

  const [questions, setQuestions] = useState<Question[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_QUESTIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === DEFAULT_QUESTIONS.length) {
          return parsed;
        }
      }
    } catch {
      // Fallback to default questions
    }
    return DEFAULT_QUESTIONS;
  });

  const [allowReview, setAllowReview] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ALLOW_REVIEW) === 'true';
    } catch {
      return false;
    }
  });

  const [strictSecurityMode, setStrictSecurityMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STRICT_MODE);
      if (saved !== null) return saved === 'true';
    } catch {
      // Default to true
    }
    return true;
  });

  const [isTeacherAuthed, setIsTeacherAuthed] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleOpenTeacherPanel = () => {
    if (isTeacherAuthed) {
      setPrevStudentStage(stage);
      setStage(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setShowAuthModal(true);
    }
  };

  const handleBackToStudentView = () => {
    setStage(prevStudentStage === 4 ? 1 : prevStudentStage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateQuestion = (updated: Question) => {
    setQuestions((prev) => {
      const next = prev.map((q) => (q.id === updated.id ? updated : q));
      try {
        localStorage.setItem(STORAGE_KEYS.CUSTOM_QUESTIONS, JSON.stringify(next));
      } catch {
        // Ignore storage error
      }
      return next;
    });
  };

  const handleResetDefaultQuestions = () => {
    setQuestions(DEFAULT_QUESTIONS);
    try {
      localStorage.setItem(
        STORAGE_KEYS.CUSTOM_QUESTIONS,
        JSON.stringify(DEFAULT_QUESTIONS)
      );
    } catch {
      // Ignore storage error
    }
  };

  const handleToggleAllowReview = (val: boolean) => {
    setAllowReview(val);
    try {
      localStorage.setItem(STORAGE_KEYS.ALLOW_REVIEW, String(val));
    } catch {
      // Ignore
    }
  };

  const handleToggleStrictSecurityMode = (val: boolean) => {
    setStrictSecurityMode(val);
    try {
      localStorage.setItem(STORAGE_KEYS.STRICT_MODE, String(val));
    } catch {
      // Ignore
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-700 selection:text-white">
      <Header
        currentStage={stage}
        onOpenTeacherPanel={handleOpenTeacherPanel}
        onBackToStudentView={handleBackToStudentView}
      />

      <main className="flex-1">
        {stage === 1 && (
          <StudentIdentityForm
            onStartExam={(identity) => {
              setStudentIdentity(identity);
              setStage(2);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            initialIdentity={studentIdentity || undefined}
            strictSecurityMode={strictSecurityMode}
          />
        )}

        {stage === 2 && studentIdentity && (
          <QuizScreen
            student={studentIdentity}
            questions={questions}
            onFinishExam={(result) => {
              setExamResult(result);
              setStage(3);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            strictSecurityMode={strictSecurityMode}
          />
        )}

        {stage === 3 && examResult && (
          <ResultScreen
            result={examResult}
            questions={questions}
            allowReview={allowReview}
            onRestart={() => {
              setExamResult(null);
              setStudentIdentity(null);
              setStage(1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {stage === 4 && (
          <TeacherPanel
            questions={questions}
            onUpdateQuestion={handleUpdateQuestion}
            onResetDefaultQuestions={handleResetDefaultQuestions}
            allowReview={allowReview}
            onToggleAllowReview={handleToggleAllowReview}
            strictSecurityMode={strictSecurityMode}
            onToggleStrictSecurityMode={handleToggleStrictSecurityMode}
          />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-semibold text-slate-700">
            {APP_CONFIG.SEKOLAH} · Guru Kelas VI: {APP_CONFIG.GURU}
          </p>
          <p>
            Mata Pelajaran: {APP_CONFIG.MATA_PELAJARAN} ({APP_CONFIG.MATERI}) ·
            Kelas {APP_CONFIG.KELAS} · KKTP: {APP_CONFIG.KKTP}
          </p>
        </div>
      </footer>

      <TeacherAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setIsTeacherAuthed(true);
          setShowAuthModal(false);
          setPrevStudentStage(stage);
          setStage(4);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
