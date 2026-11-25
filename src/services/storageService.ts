import { APP_CONFIG, STORAGE_KEYS } from '../constants/config';
import { ExamResult } from '../types/exam';

function notifySyncChannel(message: Record<string, unknown>): void {
  try {
    if ('BroadcastChannel' in window) {
      const channel = new BroadcastChannel(STORAGE_KEYS.SYNC_CHANNEL);
      channel.postMessage(message);
      channel.close();
    }
  } catch {
    // Ignore channel errors on unsupported contexts
  }
}

export const storageService = {
  getGasUrl(): string {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GAS_URL);
      return saved || APP_CONFIG.GOOGLE_APPS_SCRIPT_URL;
    } catch {
      return APP_CONFIG.GOOGLE_APPS_SCRIPT_URL;
    }
  },

  setGasUrl(url: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.GAS_URL, url);
    } catch {
      // Ignore storage quota errors
    }
  },

  resetGasUrl(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.GAS_URL);
    } catch {
      // Ignore storage errors
    }
  },

  getLocalExamResults(): ExamResult[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.LOCAL_RESULTS);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  saveLocalExamResult(result: ExamResult): void {
    try {
      const current = this.getLocalExamResults();
      const idx = current.findIndex(
        (r) =>
          r.id === result.id ||
          (r.nama.trim().toLowerCase() === result.nama.trim().toLowerCase() &&
            r.noAbsen === result.noAbsen &&
            r.timestamp === result.timestamp)
      );
      if (idx >= 0) {
        current[idx] = result;
      } else {
        current.unshift(result);
      }
      localStorage.setItem(STORAGE_KEYS.LOCAL_RESULTS, JSON.stringify(current));
    } catch {
      // Ignore storage quota errors
    }
  },

  deleteLocalExamResult(timestamp: string, nama: string): void {
    try {
      const current = this.getLocalExamResults();
      const filtered = current.filter(
        (r) =>
          !(
            (timestamp && r.timestamp === timestamp) ||
            (nama && r.nama.trim().toLowerCase() === nama.trim().toLowerCase())
          )
      );
      localStorage.setItem(STORAGE_KEYS.LOCAL_RESULTS, JSON.stringify(filtered));
    } catch {
      // Ignore
    }
  },

  clearAllLocalExamResults(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.LOCAL_RESULTS);
    } catch {
      // Ignore
    }
  },

  async testGasConnection(
    urlToTest?: string
  ): Promise<{ success: boolean; message: string; rowCount?: number }> {
    const targetUrl = (urlToTest || this.getGasUrl()).trim();
    if (!targetUrl || !targetUrl.startsWith('http')) {
      return {
        success: false,
        message: 'URL Google Apps Script belum diisi atau tidak valid.',
      };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      const separator = targetUrl.includes('?') ? '&' : '?';
      const res = await fetch(`${targetUrl}${separator}action=read&t=${Date.now()}`, {
        method: 'GET',
        redirect: 'follow',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        return {
          success: false,
          message: `Server Google Apps Script merespons HTTP ${res.status}. Pastikan akses Web App diatur ke "Anyone" (Siapa saja).`,
        };
      }

      const json = await res.json();
      const rows = Array.isArray(json)
        ? json
        : Array.isArray(json?.data)
        ? json.data
        : Array.isArray(json?.rows)
        ? json.rows
        : [];

      return {
        success: true,
        message: `Koneksi berhasil! Terhubung ke Google Spreadsheet (${rows.length} baris data ditemukan).`,
        rowCount: rows.length,
      };
    } catch (error: unknown) {
      const err = error as Error;
      if (err?.name === 'AbortError') {
        return {
          success: false,
          message:
            'Koneksi waktu habis (Timeout 8 detik). Server Google Apps Script lambat merespons.',
        };
      }
      return {
        success: false,
        message:
          err?.message ||
          'Gagal terhubung ke Google Apps Script. Periksa koneksi internet atau hak akses Web App.',
      };
    }
  },

  async submitExamResult(
    result: ExamResult
  ): Promise<{ success: boolean; savedLocally: boolean; message: string }> {
    this.saveLocalExamResult(result);

    try {
      window.dispatchEvent(new CustomEvent('sd3_exam_submitted', { detail: result }));
      notifySyncChannel({
        type: 'NEW_SUBMISSION',
        studentName: result.nama,
        result,
      });
    } catch {
      // Ignore dispatch errors
    }

    const gasUrl = this.getGasUrl();
    if (!gasUrl || !gasUrl.startsWith('http')) {
      return {
        success: true,
        savedLocally: true,
        message: 'Hasil tes berhasil disimpan di perangkat ini.',
      };
    }

    const payload = {
      action: 'submit',
      id: result.id || `res-${Date.now()}`,
      timestamp: result.timestamp || new Date().toLocaleString('id-ID'),
      nama: result.nama,
      kelas: result.kelas || APP_CONFIG.KELAS,
      noAbsen: result.noAbsen,
      tglLahir: result.tglLahir || '',
      benar: result.benar,
      salah: result.salah,
      nilai: result.nilai,
      status: result.status,
      mataPelajaran: APP_CONFIG.MATA_PELAJARAN,
      sekolah: APP_CONFIG.SEKOLAH,
      studentName: result.nama,
      className: result.kelas || APP_CONFIG.KELAS,
      absenNumber: result.noAbsen,
      birthDate: result.tglLahir || '',
      correctCount: result.benar,
      incorrectCount: result.salah,
      totalQuestions: (result.benar || 0) + (result.salah || 0),
      finalScore: result.nilai,
      answers: result.detailJawaban || {},
      violationsCount: result.violationsCount || 0,
      pelanggaran: result.violationsCount || 0,
      violationLogs: result.violationLogs || [],
      submissionReason: result.submissionReason || 'normal',
      terminationNote: result.terminationNote || '',
    };

    try {
      const response = await fetch(gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        return {
          success: true,
          savedLocally: true,
          message: `Hasil tes tersimpan di perangkat ini. (Cloud respons HTTP ${response.status})`,
        };
      }

      const text = await response.text();
      let parsed: { message?: string } = {};
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = {};
      }

      return {
        success: true,
        savedLocally: true,
        message:
          parsed.message ||
          'Jawaban dan hasil tes berhasil disimpan ke Google Spreadsheet.',
      };
    } catch {
      return {
        success: true,
        savedLocally: true,
        message:
          'Hasil tes tersimpan di perangkat ini. (Sinkronisasi cloud tertunda)',
      };
    }
  },

  async fetchExamResults(): Promise<ExamResult[]> {
    const localData = this.getLocalExamResults();
    const gasUrl = this.getGasUrl();

    if (!gasUrl || !gasUrl.startsWith('http')) {
      return localData;
    }

    try {
      const sep = gasUrl.includes('?') ? '&' : '?';
      const url = `${gasUrl}${sep}action=read&t=${Date.now()}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);
      const res = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        return localData;
      }

      const json = await res.json();
      let rawRows: Array<Record<string, unknown>> = [];
      if (Array.isArray(json)) {
        rawRows = json;
      } else if (json && Array.isArray(json.data)) {
        rawRows = json.data;
      } else if (json && json.status === 'success' && Array.isArray(json.rows)) {
        rawRows = json.rows;
      }

      const remoteMapped: ExamResult[] = rawRows
        .filter((row) => {
          const name = row.Nama || row.nama || row.studentName || row['Nama Siswa'];
          return typeof name === 'string' && name.trim().length > 0;
        })
        .map((row, idx) => {
          const timestamp = String(
            row.Timestamp || row.timestamp || row.Waktu || ''
          );
          const nama = String(
            row.Nama || row.nama || row.studentName || row['Nama Siswa'] || ''
          ).trim();
          const kelas = String(
            row.Kelas || row.kelas || row.className || APP_CONFIG.KELAS
          );
          const noAbsen = String(
            row['Nomor Absen'] ??
              row.noAbsen ??
              row.absenNumber ??
              row.Absen ??
              ''
          );
          const benar = Number(row.Benar ?? row.benar ?? row.correctCount ?? 0);
          const salah = Number(row.Salah ?? row.salah ?? row.incorrectCount ?? 0);
          const nilai = Number(row.Nilai ?? row.nilai ?? row.finalScore ?? 0);
          const statusRaw = String(
            row.Status || row.status || (nilai >= APP_CONFIG.KKTP ? 'Lulus' : 'Belum Lulus')
          );
          const tglLahir = String(
            row['Tanggal Lahir'] || row.tglLahir || row.birthDate || ''
          );
          const violationsCount = Number(
            row.violationsCount ?? row.pelanggaran ?? row.Pelanggaran ?? 0
          );

          return {
            id: String(row.id || `gas-${idx}-${timestamp}`),
            timestamp,
            nama,
            kelas,
            noAbsen,
            tglLahir,
            benar,
            salah,
            nilai,
            status: statusRaw === 'Lulus' ? 'Lulus' : 'Belum Lulus',
            mataPelajaran: String(
              row['Mata Pelajaran'] ||
                row.mataPelajaran ||
                row.subject ||
                row._sheetSource ||
                APP_CONFIG.MATA_PELAJARAN
            ),
            violationsCount,
            violationLogs: Array.isArray(row.violationLogs)
              ? (row.violationLogs as ExamResult['violationLogs'])
              : [],
            submissionReason:
              row.submissionReason === 'violation_limit' || violationsCount >= 3
                ? 'violation_limit'
                : 'normal',
            terminationNote: String(
              row.terminationNote ||
                row['Catatan Keamanan'] ||
                row.catatan ||
                ''
            ),
          };
        });

      localData.forEach((loc) => {
        const exists = remoteMapped.some(
          (rem) =>
            rem.nama.trim().toLowerCase() === loc.nama.trim().toLowerCase() &&
            rem.noAbsen === loc.noAbsen &&
            (rem.mataPelajaran === loc.mataPelajaran || !loc.mataPelajaran)
        );
        if (!exists) {
          remoteMapped.push(loc);
        } else {
          // Enrich remote row with local itemResponses if available
          const match = remoteMapped.find(
            (rem) =>
              rem.nama.trim().toLowerCase() === loc.nama.trim().toLowerCase() &&
              rem.noAbsen === loc.noAbsen
          );
          if (match && !match.itemResponses && loc.itemResponses) {
            match.itemResponses = loc.itemResponses;
            match.detailJawaban = loc.detailJawaban;
            match.durasiPengerjaan = loc.durasiPengerjaan;
          }
        }
      });

      return remoteMapped;
    } catch {
      return localData;
    }
  },

  async deleteExamResult(
    timestamp: string,
    nama: string,
    mataPelajaran?: string
  ): Promise<boolean> {
    this.deleteLocalExamResult(timestamp, nama);
    notifySyncChannel({ type: 'DATA_DELETED' });

    const gasUrl = this.getGasUrl();
    if (!gasUrl || !gasUrl.startsWith('http')) return true;

    try {
      const res = await fetch(gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'delete',
          timestamp,
          nama,
          studentName: nama,
          mataPelajaran: mataPelajaran || APP_CONFIG.MATA_PELAJARAN,
        }),
      });
      return res.ok;
    } catch {
      return true;
    }
  },

  async clearAllExamResults(
    mataPelajaran?: string,
    allSheets = false
  ): Promise<{ success: boolean; clearedRemote: boolean; message: string }> {
    this.clearAllLocalExamResults();
    notifySyncChannel({ type: 'DATA_CLEARED' });

    const gasUrl = this.getGasUrl();
    if (!gasUrl || !gasUrl.startsWith('http')) {
      return {
        success: true,
        clearedRemote: false,
        message: 'Seluruh data nilai di penyimpanan lokal perangkat berhasil dibersihkan.',
      };
    }

    try {
      const res = await fetch(gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'clearAll',
          mataPelajaran: mataPelajaran || APP_CONFIG.MATA_PELAJARAN,
          allSheets,
        }),
      });

      if (res.ok) {
        return {
          success: true,
          clearedRemote: true,
          message:
            'Seluruh data nilai di Google Spreadsheet dan perangkat lokal berhasil dihapus.',
        };
      }
      return {
        success: true,
        clearedRemote: false,
        message:
          'Data nilai lokal berhasil dibersihkan. Server Spreadsheet merespons dengan kendala.',
      };
    } catch {
      return {
        success: true,
        clearedRemote: false,
        message:
          'Data lokal berhasil dihapus. Google Spreadsheet tidak dapat diakses saat ini (koneksi offline/URL tidak valid).',
      };
    }
  },

  async syncAllLocalToCloud(): Promise<{ total: number; success: number }> {
    const localData = this.getLocalExamResults();
    if (localData.length === 0) return { total: 0, success: 0 };
    let success = 0;
    for (const item of localData) {
      try {
        const res = await this.submitExamResult(item);
        if (res.success) success++;
      } catch {
        // Continue syncing remaining items
      }
    }
    return { total: localData.length, success };
  },
};
