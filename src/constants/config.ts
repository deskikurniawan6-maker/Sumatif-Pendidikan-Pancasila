export const APP_CONFIG = {
  SEKOLAH: 'SD Negeri 2 Loloan Timur',
  ALAMAT_SEKOLAH: 'Jembrana',
  KOTA: 'Jembrana',
  KELAS: 'VI',
  MATA_PELAJARAN: 'Pendidikan Pancasila',
  MATERI: 'Pancasila, Norma, Hak dan Kewajiban, dan Bermusyawarah',
  GURU: 'Deski Kurniawan, S.Pd',
  NIP_GURU: '199805092024212036',
  KEPALA_SEKOLAH: 'Drs. H. Ali Fauzi, M.Pd.I',
  NIP_KEPALA_SEKOLAH: '196612311989041006',
  KKTP: 70,
  ADMIN_PASSWORD: 'GURUADMIN',
  GOOGLE_APPS_SCRIPT_URL:
    'https://script.google.com/macros/s/AKfycbxgTyBH9nJ3TGTRp5twLzUQsFbn9qr2kTVLdiG38KCd3CsdS8D3no_vspwT7e--d4VW/exec',
} as const;

export const BULAN_LIST = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
] as const;

export const STORAGE_KEYS = {
  LOCAL_RESULTS: 'sd2_loloan_timur_pp_results_v1',
  GAS_URL: 'sd3_loloan_timur_gas_url_v6',
  CUSTOM_QUESTIONS: 'sd2_loloan_timur_pp_questions_v2',
  ALLOW_REVIEW: 'sd2_loloan_timur_pp_allow_review',
  STRICT_MODE: 'sd3_strict_exam_mode',
  SYNC_CHANNEL: 'sd2_pp_exam_sync_channel',
} as const;

export const GAS_TEMPLATE_CODE = `/**
 * SKRIP GOOGLE APPS SCRIPT UNTUK REKAP MULTI-MAPEL & MULTI-APLIKASI
 * DALAM 1 FILE GOOGLE SPREADSHEET (SEKOLAH DASAR - JEMBRANA)
 *
 * FITUR UNGGULAN:
 * 1. Mendukung berbagai Mata Pelajaran (Matematika, IPAS, Bahasa Indonesia, Pendidikan Pancasila, dll.)
 * 2. Mendukung banyak Aplikasi Web yang mengarah ke 1 URL Spreadsheet yang sama.
 * 3. AUTO TAB-ROUTING: Data otomatis masuk ke Tab Sheet sesuai nama Mapel.
 * 4. AUTO-CREATE TAB: Jika Tab Sheet mapel belum ada, skrip OTOMATIS membuatkan Tab baru
 *    lengkap dengan Baris Header berwarna biru profesional dan Freeze Baris 1!
 * 5. Fitur Read Fleksibel: Bisa membaca satu mapel tertentu atau membaca seluruh tab mapel.
 *
 * PANDUAN PEMASANGAN (HANYA 2 MENIT):
 * 1. Buat Spreadsheet baru di https://sheets.new
 * 2. Beri nama file: "Rekap Nilai Siswa - Seluruh Mata Pelajaran"
 * 3. Buka menu "Ekstensi" (Extensions) -> "Apps Script"
 * 4. Hapus semua kode bawaan, lalu tempel SELURUH KODE di bawah ini
 * 5. Klik ikon Simpan (Save)
 * 6. Klik tombol biru "Terapkan" (Deploy) -> "Penerapan Baru" (New Deployment)
 * 7. Pilih jenis: "Aplikasi Web" (Web App)
 * 8. PENGATURAN WAJIB:
 *    - Jalankan sebagai (Execute as): "Saya" (Me)
 *    - Siapa yang memiliki akses (Who has access): "Siapa saja" (Anyone) -> WAJIB!
 * 9. Klik "Terapkan", berikan Otorisasi Akun Google Anda
 * 10. Salin URL Aplikasi Web (berakhiran /exec) dan pasang di aplikasi web Anda.
 */
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var targetSheetName = (e && e.parameter && (e.parameter.mataPelajaran || e.parameter.sheet))
      ? String(e.parameter.mataPelajaran || e.parameter.sheet).trim()
      : "";
    var sheetsToRead = [];
    if (targetSheetName && targetSheetName.toUpperCase() !== "ALL") {
      var s = ss.getSheetByName(targetSheetName);
      if (s) {
        sheetsToRead.push(s);
      } else {
        var all = ss.getSheets();
        for (var m = 0; m < all.length; m++) {
          if (all[m].getName().toUpperCase() === targetSheetName.toUpperCase()) {
            sheetsToRead.push(all[m]);
            break;
          }
        }
        if (sheetsToRead.length === 0) {
          sheetsToRead.push(ss.getActiveSheet());
        }
      }
    } else {
      sheetsToRead = ss.getSheets();
    }
    var allResults = [];
    for (var k = 0; k < sheetsToRead.length; k++) {
      var currentSheet = sheetsToRead[k];
      var sheetName = currentSheet.getName();
      var data = currentSheet.getDataRange().getValues();
      if (data.length <= 1) continue;
      var headers = data[0];
      for (var i = 1; i < data.length; i++) {
        var row = data[i];
        if (!row[1] && !row[0]) continue;
        var item = { _sheetSource: sheetName };
        for (var j = 0; j < headers.length; j++) {
          var headerKey = String(headers[j]).trim();
          item[headerKey] = row[j];
        }
        if (!item["Mata Pelajaran"] && !item["mataPelajaran"]) {
          item["Mata Pelajaran"] = sheetName;
        }
        allResults.push(item);
      }
    }
    return ContentService.createTextOutput(JSON.stringify({ success: true, data: allResults }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    var raw = e.postData ? e.postData.contents : "{}";
    var contents = JSON.parse(raw);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var rawSubject = contents.mataPelajaran || contents.subject || "PENDIDIKAN_PANCASILA";
    var sheetName = String(rawSubject).trim().toUpperCase().replace(/[^A-Z0-9_]/g, "_");
    if (!sheetName) sheetName = "PENDIDIKAN_PANCASILA";
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      var headerRow = [
        "Timestamp",
        "Nama",
        "Kelas",
        "Nomor Absen",
        "Tanggal Lahir",
        "Benar",
        "Salah",
        "Nilai",
        "Status",
        "Mata Pelajaran",
        "Sekolah"
      ];
      sheet.appendRow(headerRow);
      var headerRange = sheet.getRange(1, 1, 1, headerRow.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#1d4ed8");
      headerRange.setFontColor("#ffffff");
      headerRange.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    }
    if (contents.action === "delete") {
      var data = sheet.getDataRange().getValues();
      var targetTimestamp = String(contents.timestamp || "").trim();
      var targetNama = String(contents.nama || contents.studentName || "").trim().toLowerCase();
      for (var i = data.length - 1; i >= 1; i--) {
        var rowTime = String(data[i][0]).trim();
        var rowName = String(data[i][1]).trim().toLowerCase();
        if ((targetTimestamp && rowTime === targetTimestamp) || (targetNama && rowName === targetNama)) {
          sheet.deleteRow(i + 1);
          return ContentService.createTextOutput(JSON.stringify({
            success: true,
            message: "Data siswa berhasil dihapus dari tab [" + sheetName + "]"
          })).setMimeType(ContentService.MimeType.JSON);
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ success: false, message: "Data tidak ditemukan di tab " + sheetName }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    if (contents.action === "clearAll" || contents.action === "deleteAll") {
      if (contents.allSheets === true) {
        var allSheets = ss.getSheets();
        for (var sIdx = 0; sIdx < allSheets.length; sIdx++) {
          var s = allSheets[sIdx];
          var lRow = s.getLastRow();
          if (lRow > 1) {
            s.deleteRows(2, lRow - 1);
          }
        }
        return ContentService.createTextOutput(JSON.stringify({
          success: true,
          message: "Seluruh data siswa di SEMUA tab mata pelajaran berhasil dihapus (Header tetap tersimpan)."
        })).setMimeType(ContentService.MimeType.JSON);
      } else {
        var lastRow = sheet.getLastRow();
        if (lastRow > 1) {
          sheet.deleteRows(2, lastRow - 1);
        }
        return ContentService.createTextOutput(JSON.stringify({
          success: true,
          message: "Seluruh data siswa pada tab [" + sheetName + "] berhasil dihapus (Header tetap tersimpan)."
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    var timestamp = contents.timestamp || Utilities.formatDate(new Date(), "GMT+8", "dd/MM/yyyy HH:mm:ss");
    var nama = contents.studentName || contents.nama || "";
    var kelas = contents.className || contents.kelas || "VI";
    var noAbsen = contents.absenNumber || contents.noAbsen || "";
    var tglLahir = contents.birthDate || contents.tglLahir || "";
    var benar = contents.correctCount !== undefined ? contents.correctCount : (contents.benar || 0);
    var salah = contents.incorrectCount !== undefined ? contents.incorrectCount : (contents.salah || 0);
    var nilai = contents.finalScore !== undefined ? contents.finalScore : (contents.nilai || 0);
    var status = contents.status || (Number(nilai) >= 70 ? "Lulus" : "Belum Lulus");
    var mapel = contents.mataPelajaran || contents.subject || sheetName;
    var sekolah = contents.sekolah || "SD Negeri 2 Loloan Timur";
    sheet.appendRow([
      timestamp,
      nama,
      kelas,
      noAbsen,
      tglLahir,
      benar,
      salah,
      nilai,
      status,
      mapel,
      sekolah
    ]);
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: "Nilai berhasil disimpan ke tab [" + sheetName + "]"
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}`;
