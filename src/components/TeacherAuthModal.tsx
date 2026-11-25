import React, { useState } from 'react';
import { Lock, ShieldCheck, X } from 'lucide-react';
import { APP_CONFIG } from '../constants/config';

interface TeacherAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function TeacherAuthModal({
  isOpen,
  onClose,
  onSuccess,
}: TeacherAuthModalProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim() === APP_CONFIG.ADMIN_PASSWORD) {
      setError('');
      setPassword('');
      onSuccess();
    } else {
      setError('Kata sandi salah. Silakan periksa kembali.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 relative">
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Masuk Panel Guru
            </h3>
            <p className="text-xs text-slate-500">
              Khusus Guru Kelas {APP_CONFIG.KELAS} ({APP_CONFIG.GURU})
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="input-teacher-password"
              className="block text-xs font-bold text-slate-700 mb-1.5"
            >
              Kata Sandi Panel Guru
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="input-teacher-password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Masukkan kata sandi..."
                autoFocus
                className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-slate-900"
              />
            </div>
            {error && <p className="text-xs text-rose-600 font-medium mt-1.5">{error}</p>}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
            >
              Batal
            </button>
            <button
              id="btn-submit-teacher-auth"
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl cursor-pointer"
            >
              Masuk Panel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
