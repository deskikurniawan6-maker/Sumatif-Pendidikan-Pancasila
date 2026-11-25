import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Hash,
  ShieldAlert,
  User,
} from 'lucide-react';
import { APP_CONFIG, BULAN_LIST } from '../constants/config';
import { StudentIdentity } from '../types/exam';
import { requestExamFullscreen } from '../utils/fullscreen';

interface StudentIdentityFormProps {
  onStartExam: (identity: StudentIdentity) => void;
  initialIdentity?: StudentIdentity;
  strictSecurityMode: boolean;
}

export function StudentIdentityForm({
  onStartExam,
  initialIdentity,
  strictSecurityMode,
}: StudentIdentityFormProps) {
  const [nama, setNama] = useState(initialIdentity?.nama || '');
  const [noAbsen, setNoAbsen] = useState(initialIdentity?.noAbsen || '');
  const [hari, setHari] = useState(initialIdentity?.tglLahir.hari || '');
  const [bulan, setBulan] = useState(initialIdentity?.tglLahir.bulan || '');
  const [tahun, setTahun] = useState(initialIdentity?.tglLahir.tahun || '');
  const [error, setError] = useState('');

  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => String(currentYear - 16 + i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) {
      setError('Silakan isi Nama Lengkap terlebih dahulu.');
      return;
    }
    if (!noAbsen.trim()) {
      setError('Silakan isi Nomor Absen.');
      return;
    }
    if (!hari || !bulan || !tahun) {
      setError('Silakan lengkapi data Tanggal Lahir (Hari, Bulan, dan Tahun).');
      return;
    }

    setError('');
    if (strictSecurityMode) {
      await requestExamFullscreen();
    }

    onStartExam({
      nama: nama.trim(),
      noAbsen: noAbsen.trim(),
      tglLahir: { hari, bulan, tahun },
    });
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      <div className="text-center mb-8 space-y-2">
        <p className="text-xs font-semibold text-blue-700 tracking-wide">
          {APP_CONFIG.SEKOLAH} · Kelas {APP_CONFIG.KELAS} · KKTP {APP_CONFIG.KKTP}
        </p>
        <h1
          className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mx-auto max-w-2xl"
          style={{ textWrap: 'balance' }}
        >
          Tes Sumatif {APP_CONFIG.MATA_PELAJARAN} Kelas {APP_CONFIG.KELAS}
        </h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          Materi Pokok:{' '}
          <span className="font-semibold text-slate-800">{APP_CONFIG.MATERI}</span>.
          Lengkapi identitas Anda dengan benar sebelum memulai pengerjaan soal.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                01. Formulir Identitas Siswa
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Seluruh kolom bertanda bintang (<span className="text-rose-600">*</span>) wajib diisi
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 whitespace-nowrap">
              Peserta Kelas {APP_CONFIG.KELAS}
            </span>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="input-nama-lengkap"
                className="block text-xs font-bold text-slate-700 mb-1.5"
              >
                Nama Lengkap Siswa <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="input-nama-lengkap"
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: I Putu Agus Wirawan"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all font-medium text-slate-800 placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="input-no-absen"
                className="block text-xs font-bold text-slate-700 mb-1.5"
              >
                Nomor Absen Siswa <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Hash className="w-4 h-4" />
                </div>
                <input
                  id="input-no-absen"
                  type="number"
                  min={1}
                  max={60}
                  value={noAbsen}
                  onChange={(e) => setNoAbsen(e.target.value)}
                  placeholder="Contoh: 15"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all font-medium text-slate-800 placeholder:text-slate-400 tabular-nums"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Tanggal Lahir Siswa <span className="text-rose-600">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                <select
                  id="select-tgl-hari"
                  aria-label="Hari lahir"
                  value={hari}
                  onChange={(e) => setHari(e.target.value)}
                  className="w-full px-2.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800 font-medium tabular-nums"
                  required
                >
                  <option value="">Hari</option>
                  {days.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <select
                  id="select-tgl-bulan"
                  aria-label="Bulan lahir"
                  value={bulan}
                  onChange={(e) => setBulan(e.target.value)}
                  className="w-full px-2.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800 font-medium"
                  required
                >
                  <option value="">Bulan</option>
                  {BULAN_LIST.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                <select
                  id="select-tgl-tahun"
                  aria-label="Tahun lahir"
                  value={tahun}
                  onChange={(e) => setTahun(e.target.value)}
                  className="w-full px-2.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800 font-medium tabular-nums"
                  required
                >
                  <option value="">Tahun</option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
              <p className="mt-1.5 text-xs text-slate-500">
                Pilih tanggal, bulan, dan tahun kelahiran Anda.
              </p>
            </div>

            <div className="pt-2">
              <button
                id="btn-mulai-tes"
                type="submit"
                className="w-full py-3.5 px-5 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base"
              >
                <span>Mulai Tes Sekarang</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6">
            <h3 className="text-xs font-bold tracking-wide text-slate-300 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span>Komposisi & Format Soal</span>
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                <span>1. Makna, Keterkaitan &amp; Pengamalan Sila Pancasila</span>
                <span className="font-bold text-blue-300 tabular-nums shrink-0 ml-2">
                  15 Butir
                </span>
              </div>
              <div className="flex items-center justify-between bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                <span>2. Pancasila: Dasar Negara, Pandangan Hidup &amp; Ideologi</span>
                <span className="font-bold text-emerald-300 tabular-nums shrink-0 ml-2">
                  10 Butir
                </span>
              </div>
              <div className="flex items-center justify-between bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                <span>3. Norma, Hak &amp; Kewajiban Anak, serta Perilaku Jujur</span>
                <span className="font-bold text-indigo-300 tabular-nums shrink-0 ml-2">
                  15 Butir
                </span>
              </div>
              <div className="flex items-center justify-between bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                <span>4. Arti, Ciri, Tata Cara &amp; Praktik Musyawarah</span>
                <span className="font-bold text-amber-300 tabular-nums shrink-0 ml-2">
                  10 Butir
                </span>
              </div>
              <div className="flex items-center justify-between pt-2.5 border-t border-slate-800 text-slate-300">
                <span>Total Butir Soal (Pilihan Ganda):</span>
                <span className="font-extrabold text-white text-sm tabular-nums">
                  50 Soal
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-300 space-y-2">
              <p className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  Soal dan opsi jawaban diacak otomatis untuk setiap peserta ujian.
                </span>
              </p>
              <p className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Hasil ujian tersimpan otomatis ke Google Spreadsheet guru pengampu.
                </span>
              </p>
            </div>
          </div>

          {strictSecurityMode && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 text-xs text-amber-950 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-900">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Pengawasan Ujian Aktif (Anti-Curang)</span>
              </div>
              <p className="text-amber-800 leading-relaxed">
                Saat ujian dimulai, halaman masuk ke mode layar penuh. Berpindah tab,
                keluar layar penuh, atau menyalin teks dicatat sistem. Batas toleransi
                adalah <strong>3 kali pelanggaran</strong> sebelum jawaban dikirim
                otomatis.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
