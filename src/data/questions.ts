import { Question, QuestionBlueprint } from '../types/exam';

function svgLambangSila(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="560" height="165" viewBox="0 0 560 165">
  <rect x="0" y="0" width="560" height="165" rx="14" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.2"/>
  <text x="280" y="24" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#0f172a">Simbol Sila-Sila dalam Perisai Garuda Pancasila</text>

  <!-- Sila 1: Bintang -->
  <g transform="translate(64, 82)">
    <rect x="-42" y="-42" width="84" height="84" rx="12" fill="#0f172a" stroke="#ca8a04" stroke-width="2"/>
    <polygon points="0,-24 6.8,-7.5 24,-5.5 11.2,6.2 14.5,23 0,14.5 -14.5,23 -11.2,6.2 -24,-5.5 -6.8,-7.5" fill="#facc15" stroke="#fde047" stroke-width="1.2" stroke-linejoin="round"/>
    <text x="0" y="56" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="bold" fill="#334155">Sila ke-1</text>
  </g>

  <!-- Sila 2: Rantai -->
  <g transform="translate(172, 82)">
    <rect x="-42" y="-42" width="84" height="84" rx="12" fill="#991b1b" stroke="#ca8a04" stroke-width="2"/>
    <circle cx="-12" cy="-12" r="10" fill="none" stroke="#facc15" stroke-width="4"/>
    <rect x="2" y="-20" width="18" height="16" rx="3" fill="none" stroke="#facc15" stroke-width="4"/>
    <rect x="-20" y="4" width="18" height="16" rx="3" fill="none" stroke="#facc15" stroke-width="4"/>
    <circle cx="12" cy="12" r="10" fill="none" stroke="#facc15" stroke-width="4"/>
    <text x="0" y="56" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="bold" fill="#334155">Sila ke-2</text>
  </g>

  <!-- Sila 3: Pohon Beringin -->
  <g transform="translate(280, 82)">
    <rect x="-42" y="-42" width="84" height="84" rx="12" fill="#ffffff" stroke="#ca8a04" stroke-width="2"/>
    <rect x="-5" y="4" width="10" height="22" rx="2" fill="#78350f"/>
    <path d="M-24,6 C-28,-12 -14,-26 0,-26 C14,-26 28,-12 24,6 C18,12 -18,12 -24,6 Z" fill="#15803d"/>
    <line x1="-14" y1="6" x2="-14" y2="20" stroke="#78350f" stroke-width="1.5"/>
    <line x1="14" y1="6" x2="14" y2="20" stroke="#78350f" stroke-width="1.5"/>
    <text x="0" y="56" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="bold" fill="#334155">Sila ke-3</text>
  </g>

  <!-- Sila 4: Kepala Banteng -->
  <g transform="translate(388, 82)">
    <rect x="-42" y="-42" width="84" height="84" rx="12" fill="#b91c1c" stroke="#ca8a04" stroke-width="2"/>
    <path d="M-24,-18 C-26,-4 -18,2 -12,0 L-10,16 L0,22 L10,16 L12,0 C18,2 26,-4 24,-18 C20,-8 14,-6 10,-8 L-10,-8 C-14,-6 -20,-8 -24,-18 Z" fill="#1e293b" stroke="#f8fafc" stroke-width="1.4"/>
    <circle cx="-6" cy="2" r="2" fill="#f8fafc"/>
    <circle cx="6" cy="2" r="2" fill="#f8fafc"/>
    <text x="0" y="56" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="bold" fill="#334155">Sila ke-4</text>
  </g>

  <!-- Sila 5: Padi dan Kapas -->
  <g transform="translate(496, 82)">
    <rect x="-42" y="-42" width="84" height="84" rx="12" fill="#ffffff" stroke="#ca8a04" stroke-width="2"/>
    <path d="M-16,22 Q-22,0 -10,-20" fill="none" stroke="#eab308" stroke-width="3" stroke-linecap="round"/>
    <circle cx="-16" cy="8" r="3.5" fill="#facc15"/>
    <circle cx="-17" cy="-2" r="3.5" fill="#facc15"/>
    <circle cx="-14" cy="-12" r="3.5" fill="#facc15"/>
    <path d="M16,22 Q22,0 10,-20" fill="none" stroke="#16a34a" stroke-width="3" stroke-linecap="round"/>
    <circle cx="16" cy="6" r="5" fill="#f1f5f9" stroke="#16a34a" stroke-width="1.4"/>
    <circle cx="15" cy="-6" r="5" fill="#f1f5f9" stroke="#16a34a" stroke-width="1.4"/>
    <circle cx="11" cy="-16" r="4.5" fill="#f1f5f9" stroke="#16a34a" stroke-width="1.4"/>
    <text x="0" y="56" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="bold" fill="#334155">Sila ke-5</text>
  </g>
</svg>`;
}

function svgKeterkaitanSila(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="540" height="190" viewBox="0 0 540 190">
  <rect x="0" y="0" width="540" height="190" rx="14" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.2"/>
  <text x="270" y="24" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#0f172a">Bagan Kesatuan Organik &amp; Saling Menjiwai Sila Pancasila</text>

  <rect x="195" y="38" width="150" height="24" rx="8" fill="#1d4ed8"/>
  <text x="270" y="54" text-anchor="middle" font-family="sans-serif" font-size="10.5" font-weight="bold" fill="#ffffff">Sila 1: Ketuhanan YME</text>

  <rect x="155" y="68" width="230" height="24" rx="8" fill="#2563eb"/>
  <text x="270" y="84" text-anchor="middle" font-family="sans-serif" font-size="10.5" font-weight="bold" fill="#ffffff">Sila 2: Kemanusiaan Adil &amp; Beradab</text>

  <rect x="115" y="98" width="310" height="24" rx="8" fill="#0284c7"/>
  <text x="270" y="114" text-anchor="middle" font-family="sans-serif" font-size="10.5" font-weight="bold" fill="#ffffff">Sila 3: Persatuan Indonesia</text>

  <rect x="75" y="128" width="390" height="24" rx="8" fill="#0d9488"/>
  <text x="270" y="144" text-anchor="middle" font-family="sans-serif" font-size="10.5" font-weight="bold" fill="#ffffff">Sila 4: Kerakyatan / Musyawarah Perwakilan</text>

  <rect x="35" y="158" width="470" height="24" rx="8" fill="#059669"/>
  <text x="270" y="174" text-anchor="middle" font-family="sans-serif" font-size="10.5" font-weight="bold" fill="#ffffff">Sila 5: Keadilan Sosial bagi Seluruh Rakyat Indonesia</text>
</svg>`;
}

function svgKedudukanPancasila(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="540" height="170" viewBox="0 0 540 170">
  <rect x="0" y="0" width="540" height="170" rx="14" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.2"/>
  <rect x="170" y="14" width="200" height="32" rx="10" fill="#1e293b"/>
  <text x="270" y="34" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff">KEDUDUKAN PANCASILA</text>

  <line x1="270" y1="46" x2="270" y2="62" stroke="#64748b" stroke-width="2"/>
  <line x1="95" y1="62" x2="445" y2="62" stroke="#64748b" stroke-width="2"/>
  <line x1="95" y1="62" x2="95" y2="78" stroke="#64748b" stroke-width="2"/>
  <line x1="270" y1="62" x2="270" y2="78" stroke="#64748b" stroke-width="2"/>
  <line x1="445" y1="62" x2="445" y2="78" stroke="#64748b" stroke-width="2"/>

  <rect x="20" y="78" width="150" height="74" rx="10" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="95" y="100" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="bold" fill="#1d4ed8">1. Dasar Negara</text>
  <text x="95" y="118" text-anchor="middle" font-family="sans-serif" font-size="9.5" fill="#334155">Sumber segala sumber</text>
  <text x="95" y="132" text-anchor="middle" font-family="sans-serif" font-size="9.5" fill="#334155">hukum &amp; penyelenggaraan</text>
  <text x="95" y="145" text-anchor="middle" font-family="sans-serif" font-size="9.5" fill="#334155">negara (UUD 1945)</text>

  <rect x="195" y="78" width="150" height="74" rx="10" fill="#ecfdf5" stroke="#10b981" stroke-width="1.5"/>
  <text x="270" y="100" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="bold" fill="#047857">2. Pandangan Hidup</text>
  <text x="270" y="118" text-anchor="middle" font-family="sans-serif" font-size="9.5" fill="#334155">Pedoman bersikap &amp;</text>
  <text x="270" y="132" text-anchor="middle" font-family="sans-serif" font-size="9.5" fill="#334155">berperilaku warga</text>
  <text x="270" y="145" text-anchor="middle" font-family="sans-serif" font-size="9.5" fill="#334155">dalam sehari-hari</text>

  <rect x="370" y="78" width="150" height="74" rx="10" fill="#fffbeb" stroke="#f59e0b" stroke-width="1.5"/>
  <text x="445" y="100" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="bold" fill="#b45309">3. Ideologi Bangsa</text>
  <text x="445" y="118" text-anchor="middle" font-family="sans-serif" font-size="9.5" fill="#334155">Cita-cita luhur &amp;</text>
  <text x="445" y="132" text-anchor="middle" font-family="sans-serif" font-size="9.5" fill="#334155">tujuan bersama bangsa</text>
  <text x="445" y="145" text-anchor="middle" font-family="sans-serif" font-size="9.5" fill="#334155">Indonesia yang terbuka</text>
</svg>`;
}

function svgNormaLaluLintas(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="540" height="165" viewBox="0 0 540 165">
  <rect x="0" y="0" width="540" height="165" rx="14" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.2"/>
  <text x="270" y="24" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#0f172a">Ilustrasi Kepatuhan terhadap Aturan Tertulis di Jalan Raya</text>

  <!-- Traffic Light -->
  <rect x="52" y="42" width="44" height="98" rx="10" fill="#1e293b"/>
  <circle cx="74" cy="64" r="10" fill="#ef4444"/>
  <circle cx="74" cy="91" r="10" fill="#475569"/>
  <circle cx="74" cy="118" r="10" fill="#475569"/>
  <rect x="70" y="140" width="8" height="16" fill="#475569"/>

  <!-- Road & Zebra Cross -->
  <rect x="135" y="54" width="210" height="90" rx="10" fill="#334155"/>
  <rect x="160" y="64" width="38" height="10" rx="2" fill="#f8fafc"/>
  <rect x="160" y="84" width="38" height="10" rx="2" fill="#f8fafc"/>
  <rect x="160" y="104" width="38" height="10" rx="2" fill="#f8fafc"/>
  <rect x="160" y="124" width="38" height="10" rx="2" fill="#f8fafc"/>
  <rect x="242" y="76" width="80" height="44" rx="8" fill="#2563eb"/>
  <rect x="252" y="84" width="34" height="28" rx="4" fill="#bfdbfe"/>
  <text x="282" y="136" text-anchor="middle" font-family="sans-serif" font-size="9.5" font-weight="bold" fill="#f8fafc">BERHENTI</text>

  <!-- Sign Info -->
  <rect x="368" y="46" width="148" height="100" rx="12" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2"/>
  <text x="442" y="70" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="bold" fill="#0f172a">Ciri Aturan Ini:</text>
  <text x="380" y="90" font-family="sans-serif" font-size="9.5" fill="#334155">1. Dibuat oleh negara</text>
  <text x="380" y="107" font-family="sans-serif" font-size="9.5" fill="#334155">2. Bersifat memaksa</text>
  <text x="380" y="124" font-family="sans-serif" font-size="9.5" fill="#334155">3. Sanksi tegas (tilang/</text>
  <text x="392" y="137" font-family="sans-serif" font-size="9.5" fill="#334155">denda tertulis)</text>
</svg>`;
}

function svgHakKewajibanDiagram(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="540" height="170" viewBox="0 0 540 170">
  <rect x="0" y="0" width="540" height="170" rx="14" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.2"/>
  <text x="270" y="24" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#0f172a">Keseimbangan Kewajiban dan Hak Anak di Sekolah</text>

  <rect x="24" y="44" width="214" height="106" rx="12" fill="#eff6ff" stroke="#2563eb" stroke-width="1.5"/>
  <text x="131" y="65" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="bold" fill="#1d4ed8">KEWAJIBAN SISWA</text>
  <text x="38" y="86" font-family="sans-serif" font-size="10" fill="#1e293b">• Belajar dengan sungguh-sungguh</text>
  <text x="38" y="104" font-family="sans-serif" font-size="10" fill="#1e293b">• Menjaga kebersihan kelas</text>
  <text x="38" y="122" font-family="sans-serif" font-size="10" fill="#1e293b">• Mematuhi tata tertib sekolah</text>
  <text x="38" y="140" font-family="sans-serif" font-size="10" fill="#1e293b">• Menghormati guru dan teman</text>

  <polygon points="256,90 280,90 280,82 296,97 280,112 280,104 256,104" fill="#10b981"/>

  <rect x="306" y="44" width="210" height="106" rx="12" fill="#ecfdf5" stroke="#059669" stroke-width="1.5"/>
  <text x="411" y="65" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="bold" fill="#047857">HAK SISWA</text>
  <text x="320" y="86" font-family="sans-serif" font-size="10" fill="#1e293b">• Mendapat bimbingan belajar</text>
  <text x="320" y="104" font-family="sans-serif" font-size="10" fill="#1e293b">• Belajar di kelas yang nyaman</text>
  <text x="320" y="122" font-family="sans-serif" font-size="10" fill="#1e293b">• Menggunakan fasilitas sekolah</text>
  <text x="320" y="140" font-family="sans-serif" font-size="10" fill="#1e293b">• Mendapat nilai secara adil</text>
</svg>`;
}

function svgAlurMusyawarah(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="540" height="160" viewBox="0 0 540 160">
  <rect x="0" y="0" width="540" height="160" rx="14" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.2"/>
  <text x="270" y="24" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#0f172a">Alur Tata Cara Musyawarah yang Baik</text>

  <rect x="18" y="46" width="114" height="88" rx="10" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.4"/>
  <text x="75" y="66" text-anchor="middle" font-family="sans-serif" font-size="10.5" font-weight="bold" fill="#1d4ed8">1. Membahas</text>
  <text x="75" y="84" text-anchor="middle" font-family="sans-serif" font-size="9.5" fill="#334155">Menentukan</text>
  <text x="75" y="98" text-anchor="middle" font-family="sans-serif" font-size="9.5" fill="#334155">masalah demi</text>
  <text x="75" y="112" text-anchor="middle" font-family="sans-serif" font-size="9.5" fill="#334155">kepentingan umum</text>

  <path d="M135,90 L147,90" stroke="#64748b" stroke-width="2" marker-end="url(#arrow)"/>

  <rect x="150" y="46" width="114" height="88" rx="10" fill="#f0fdf4" stroke="#22c55e" stroke-width="1.4"/>
  <text x="207" y="66" text-anchor="middle" font-family="sans-serif" font-size="10.5" font-weight="bold" fill="#15803d">2. Berpendapat</text>
  <text x="207" y="84" text-anchor="middle" font-family="sans-serif" font-size="9.5" fill="#334155">Angkat tangan,</text>
  <text x="207" y="98" text-anchor="middle" font-family="sans-serif" font-size="9.5" fill="#334155">sampaikan usul</text>
  <text x="207" y="112" text-anchor="middle" font-family="sans-serif" font-size="9.5" fill="#334155">dengan santun</text>

  <path d="M267,90 L279,90" stroke="#64748b" stroke-width="2"/>

  <rect x="282" y="46" width="114" height="88" rx="10" fill="#fffbeb" stroke="#f59e0b" stroke-width="1.4"/>
  <text x="339" y="66" text-anchor="middle" font-family="sans-serif" font-size="10.5" font-weight="bold" fill="#b45309">3. Mufakat</text>
  <text x="339" y="84" text-anchor="middle" font-family="sans-serif" font-size="9.5" fill="#334155">Menghargai beda</text>
  <text x="339" y="98" text-anchor="middle" font-family="sans-serif" font-size="9.5" fill="#334155">pendapat &amp; cari</text>
  <text x="339" y="112" text-anchor="middle" font-family="sans-serif" font-size="9.5" fill="#334155">kata sepakat</text>

  <path d="M399,90 L411,90" stroke="#64748b" stroke-width="2"/>

  <rect x="414" y="46" width="108" height="88" rx="10" fill="#ecfeff" stroke="#0891b2" stroke-width="1.4"/>
  <text x="468" y="66" text-anchor="middle" font-family="sans-serif" font-size="10.5" font-weight="bold" fill="#0e7490">4. Laksanakan</text>
  <text x="468" y="84" text-anchor="middle" font-family="sans-serif" font-size="9.5" fill="#334155">Jalankan hasil</text>
  <text x="468" y="98" text-anchor="middle" font-family="sans-serif" font-size="9.5" fill="#334155">keputusan dengan</text>
  <text x="468" y="112" text-anchor="middle" font-family="sans-serif" font-size="9.5" fill="#334155">penuh tanggung jawab</text>
</svg>`;
}

export const DEFAULT_QUESTIONS: Question[] = [
  // ============================================================================
  // BAGIAN 1 (Soal 1-15): Makna, Keterkaitan, Pengamalan & Sikap Sila Pancasila
  // ============================================================================
  {
    id: 1,
    type: 'pg',
    topic: 'Makna & Pengamalan Sila Pancasila',
    difficulty: 'Mudah',
    elemen: 'Pancasila',
    levelKognitif: 'L1',
    text: 'Sila pertama Pancasila berbunyi "Ketuhanan Yang Maha Esa". Contoh pengamalan sila pertama dalam kehidupan sehari-hari di lingkungan sekolah adalah...',
    options: [
      { id: 'A', text: 'Memaksa teman untuk mengikuti cara ibadah kita' },
      { id: 'B', text: 'Berdoa sebelum dan sesudah pelajaran sesuai agama masing-masing' },
      { id: 'C', text: 'Membagi tugas piket kelas secara adil' },
      { id: 'D', text: 'Mengutamakan produk buatan dalam negeri' },
    ],
    correctAnswer: 'B',
    explanation:
      'Berdoa sebelum dan sesudah belajar sesuai keyakinan masing-masing merupakan wujud keimanan dan ketakwaan kepada Tuhan Yang Maha Esa (Sila ke-1).',
  },
  {
    id: 2,
    type: 'pg',
    topic: 'Makna & Pengamalan Sila Pancasila',
    difficulty: 'Mudah',
    elemen: 'Pancasila',
    levelKognitif: 'L1',
    imageSvg: svgLambangSila(),
    text: 'Perhatikan gambar simbol sila-sila Pancasila di atas! Simbol yang melambangkan bahwa setiap manusia memiliki derajat, hak, dan kewajiban yang sama sehingga harus saling mencintai dan bertenggang rasa ditunjukkan oleh simbol...',
    options: [
      { id: 'A', text: 'Sila ke-1 (Bintang Emas)' },
      { id: 'B', text: 'Sila ke-2 (Rantai Emas)' },
      { id: 'C', text: 'Sila ke-3 (Pohon Beringin)' },
      { id: 'D', text: 'Sila ke-4 (Kepala Banteng)' },
    ],
    correctAnswer: 'B',
    explanation:
      'Simbol Rantai Emas pada Sila ke-2 (Kemanusiaan yang Adil dan Beradab) tersusun dari mata rantai persegi dan lingkaran yang saling mengait, melambangkan hubungan antarmanusia yang saling membantu, setara, dan penuh tenggang rasa.',
  },
  {
    id: 3,
    type: 'pg',
    topic: 'Makna & Pengamalan Sila Pancasila',
    difficulty: 'Mudah',
    elemen: 'Pancasila',
    levelKognitif: 'L1',
    text: 'Makna simbol Pohon Beringin pada sila ketiga Pancasila adalah...',
    options: [
      { id: 'A', text: 'Cahaya kerohanian dari Tuhan bagi seluruh rakyat Indonesia' },
      { id: 'B', text: 'Tempat berteduh dan bersatunya berbagai suku bangsa di bawah naungan NKRI' },
      { id: 'C', text: 'Kebutuhan pokok sandang dan pangan bagi seluruh rakyat' },
      { id: 'D', text: 'Hewan sosial yang gemar berkumpul untuk berdiskusi' },
    ],
    correctAnswer: 'B',
    explanation:
      'Pohon beringin merupakan pohon besar berakar tunggang dan rindang, melambangkan bangsa Indonesia sebagai tempat berteduh yang kokoh bagi beragam suku, agama, dan budaya dalam kesatuan.',
  },
  {
    id: 4,
    type: 'pg',
    topic: 'Makna & Pengamalan Sila Pancasila',
    difficulty: 'Mudah',
    elemen: 'Pancasila',
    levelKognitif: 'L1',
    text: 'Berikut ini yang merupakan sikap yang sesuai dengan sila kelima Pancasila "Keadilan Sosial bagi Seluruh Rakyat Indonesia" adalah...',
    options: [
      { id: 'A', text: 'Menghargai teman yang sedang merayakan hari raya agamanya' },
      { id: 'B', text: 'Menggunakan uang jajan secara hemat dan tidak bergaya hidup mewah' },
      { id: 'C', text: 'Menyanyikan lagu kebangsaan Indonesia Raya dengan khidmat' },
      { id: 'D', text: 'Menghormati hasil pemilihan ketua kelas' },
    ],
    correctAnswer: 'B',
    explanation:
      'Hidup hemat, tidak boros, bekerja keras, dan menghargai hasil karya orang lain termasuk pengamalan Sila ke-5 Pancasila.',
  },
  {
    id: 5,
    type: 'pg',
    topic: 'Makna & Pengamalan Sila Pancasila',
    difficulty: 'Mudah',
    elemen: 'Pancasila',
    levelKognitif: 'L1',
    imageUrl: '/src/assets/images/gotong_royong_pancasila_1795643530024.jpg',
    imageAlt: 'Siswa SD bergotong royong membersihkan taman sekolah dan menolong teman yang terjatuh',
    text: 'Amati gambar kegiatan siswa di sekolah tersebut! Sikap menolong teman yang terjatuh dan bekerja sama merawat taman sekolah tanpa membedakan asal suku maupun agama mencerminkan pengamalan Pancasila, terutama sila...',
    options: [
      { id: 'A', text: 'Pertama dan Keempat' },
      { id: 'B', text: 'Kedua dan Ketiga' },
      { id: 'C', text: 'Keempat dan Kelima' },
      { id: 'D', text: 'Pertama dan Kelima' },
    ],
    correctAnswer: 'B',
    explanation:
      'Menolong teman yang terjatuh merupakan sikap peduli dan kemanusiaan (Sila ke-2), sedangkan bergotong royong bersama teman yang beragam mencerminkan persatuan dan kerukunan (Sila ke-3).',
  },
  {
    id: 6,
    type: 'pg',
    topic: 'Makna & Pengamalan Sila Pancasila',
    difficulty: 'Mudah',
    elemen: 'Pancasila',
    levelKognitif: 'L1',
    text: 'Simbol Padi dan Kapas pada sila kelima Pancasila melambangkan...',
    options: [
      { id: 'A', text: 'Keberanian dan semangat pantang menyerah' },
      { id: 'B', text: 'Kesejahteraan pangan dan sandang yang merata bagi rakyat' },
      { id: 'C', text: 'Kebebasan berpendapat di muka umum' },
      { id: 'D', text: 'Kekuatan persatuan di tengah keberagaman budaya' },
    ],
    correctAnswer: 'B',
    explanation:
      'Padi melambangkan kebutuhan pangan dan kapas melambangkan kebutuhan sandang sebagai simbol kemakmuran dan keadilan sosial bagi seluruh rakyat Indonesia.',
  },
  {
    id: 7,
    type: 'pg',
    topic: 'Makna & Pengamalan Sila Pancasila',
    difficulty: 'Sedang',
    elemen: 'Pancasila',
    levelKognitif: 'L2',
    text: 'Edha dan Emil beragama Hindu, sedangkan Pradipta beragama Islam. Ketika Pradipta sedang menjalankan ibadah puasa di sekolah, Edha dan Emil tidak makan dan minum di hadapan Pradipta sebagai bentuk penghormatan. Sikap Edha dan Emil tersebut sekaligus menunjukkan keterkaitan antara...',
    options: [
      { id: 'A', text: 'Sila ke-1 (toleransi beragama) dan Sila ke-2 (tenggang rasa sesama manusia)' },
      { id: 'B', text: 'Sila ke-3 (cinta tanah air) dan Sila ke-4 (musyawarah mufakat)' },
      { id: 'C', text: 'Sila ke-4 (hak suara) dan Sila ke-5 (hemat energi)' },
      { id: 'D', text: 'Sila ke-1 (beribadah) dan Sila ke-5 (kerja keras)' },
    ],
    correctAnswer: 'A',
    explanation:
      'Menghormati teman yang menjalankan ibadah agama merupakan pengamalan Sila ke-1, yang juga diwujudkan melalui sikap tepa selira/tenggang rasa terhadap sesama manusia sesuai Sila ke-2.',
  },
  {
    id: 8,
    type: 'pg',
    topic: 'Makna & Pengamalan Sila Pancasila',
    difficulty: 'Sedang',
    elemen: 'Pancasila',
    levelKognitif: 'L2',
    text: 'Di kelas VI diadakan penggalangan dana sukarela untuk membantu korban bencana banjir di kabupaten tetangga. Seluruh siswa menyisihkan sebagian uang sakunya dengan ikhlas, kemudian hasilnya disalurkan melalui posko bantuan. Sikap para siswa tersebut mencerminkan nilai sila kedua karena...',
    options: [
      { id: 'A', text: 'Mengutamakan kepentingan pribadi di atas kepentingan umum' },
      { id: 'B', text: 'Menunjukkan rasa empati, kepedulian, dan solidaritas kemanusiaan' },
      { id: 'C', text: 'Memaksakan kehendak agar semua siswa menyumbang dalam jumlah sama' },
      { id: 'D', text: 'Hanya membantu warga yang berasal dari daerah yang sama' },
    ],
    correctAnswer: 'B',
    explanation:
      'Membantu korban bencana alam dengan tulus menunjukkan pengakuan harkat dan martabat manusia serta rasa empati sosial yang menjadi inti Sila ke-2 Pancasila.',
  },
  {
    id: 9,
    type: 'pg',
    topic: 'Makna & Pengamalan Sila Pancasila',
    difficulty: 'Sedang',
    elemen: 'Pancasila',
    levelKognitif: 'L2',
    text: 'Saat pentas seni sekolah, kelompok kelas VI sepakat menampilkan tari daerah dari berbagai provinsi di Indonesia dengan bangga. Sikap tersebut menunjukkan pengamalan sila ketiga Pancasila, yaitu...',
    options: [
      { id: 'A', text: 'Menganggap budaya daerah sendiri paling unggul dari daerah lain' },
      { id: 'B', text: 'Menumbuhkan rasa cinta tanah air dan menghargai keberagaman budaya bangsa' },
      { id: 'C', text: 'Meniru budaya asing secara berlebihan agar terlihat modern' },
      { id: 'D', text: 'Menolak tampil jika tidak membawakan tarian daerah asalnya' },
    ],
    correctAnswer: 'B',
    explanation:
      'Mempelajari, melestarikan, dan bangga terhadap keberagaman budaya Nusantara memperkuat persatuan dan kesatuan bangsa sesuai Sila ke-3.',
  },
  {
    id: 10,
    type: 'pg',
    topic: 'Makna & Pengamalan Sila Pancasila',
    difficulty: 'Sedang',
    elemen: 'Pancasila',
    levelKognitif: 'L2',
    imageSvg: svgKeterkaitanSila(),
    text: 'Perhatikan bagan keterkaitan sila-sila Pancasila di atas! Pancasila merupakan satu kesatuan yang utuh dan saling menjiwai. Pernyataan yang tepat berdasarkan bagan tersebut adalah...',
    options: [
      { id: 'A', text: 'Setiap sila berdiri sendiri dan tidak ada hubungannya dengan sila lainnya' },
      { id: 'B', text: 'Sila pertama menjiwai sila kedua, ketiga, keempat, dan kelima secara berkesinambungan' },
      { id: 'C', text: 'Sila kelima lebih tinggi kedudukannya daripada sila pertama hingga keempat' },
      { id: 'D', text: 'Warga negara cukup mengamalkan satu sila saja yang paling mudah dilakukan' },
    ],
    correctAnswer: 'B',
    explanation:
      'Sila-sila Pancasila bersifat hierarkis piramidal dan merupakan kesatuan organik: Sila ke-1 menjiwai sila ke-2, ke-3, ke-4, dan ke-5, sedangkan sila ke-5 dijiwai oleh keempat sila sebelumnya.',
  },
  {
    id: 11,
    type: 'pg',
    topic: 'Makna & Pengamalan Sila Pancasila',
    difficulty: 'Sedang',
    elemen: 'Pancasila',
    levelKognitif: 'L2',
    text: 'Ketua regu piket membagi tugas menyapu, mengepel, dan merapikan buku secara merata kepada semua anggota regu tanpa pilih kasih, termasuk dirinya sendiri ikut bekerja. Perilaku ketua regu tersebut paling tepat dikaitkan dengan pengamalan sila...',
    options: [
      { id: 'A', text: 'Pertama: menjalankan kewajiban ibadah' },
      { id: 'B', text: 'Ketiga: menjaga keutuhan wilayah negara' },
      { id: 'C', text: 'Keempat: menerima hasil pemungutan suara' },
      { id: 'D', text: 'Kelima: bersikap adil terhadap sesama anggota kelompok' },
    ],
    correctAnswer: 'D',
    explanation:
      'Membagi tugas dan tanggung jawab secara adil tanpa pilih kasih serta ikut bekerja bersama mencerminkan nilai keadilan sosial (Sila ke-5).',
  },
  {
    id: 12,
    type: 'pg',
    topic: 'Makna & Pengamalan Sila Pancasila',
    difficulty: 'Sukar',
    elemen: 'Pancasila',
    levelKognitif: 'L3',
    text: 'Dalam rapat RT untuk menentukan jadwal kerja bakti, warga tidak langsung menentukan hari, melainkan mempertimbangkan waktu ibadah umat beragama pada hari Jumat dan Minggu agar seluruh warga dapat ikut serta dengan tenang. Kebijakan warga RT tersebut membuktikan adanya keterkaitan erat antara...',
    options: [
      { id: 'A', text: 'Sila ke-4 (musyawarah) yang dijiwai oleh nilai Sila ke-1 (menghormati ibadah) dan Sila ke-3 (persatuan warga)' },
      { id: 'B', text: 'Sila ke-2 (hak asasi) yang bertentangan dengan Sila ke-5 (keadilan sosial)' },
      { id: 'C', text: 'Sila ke-5 (hidup hemat) yang memisahkan kepentingan warga beragama' },
      { id: 'D', text: 'Sila ke-3 (cinta produk lokal) yang mengabaikan Sila ke-4' },
    ],
    correctAnswer: 'A',
    explanation:
      'Warga bermusyawarah (Sila ke-4) sambil menghargai waktu ibadah umat beragama (Sila ke-1) demi terciptanya kebersamaan dan kerukunan seluruh warga (Sila ke-3).',
  },
  {
    id: 13,
    type: 'pg',
    topic: 'Makna & Pengamalan Sila Pancasila',
    difficulty: 'Sukar',
    elemen: 'Pancasila',
    levelKognitif: 'L3',
    imageUrl: '/src/assets/images/gotong_royong_pancasila_1795643530024.jpg',
    imageAlt: 'Ilustrasi siswa bergotong royong merawat kebun sekolah dan menolong teman',
    text: 'Berdasarkan gambar kegiatan di halaman sekolah tersebut, jika ada seorang siswa yang menolak ikut kerja bakti karena merasa berasal dari keluarga kaya dan menganggap tugas membersihkan halaman adalah pekerjaan petugas kebersihan, maka sikap siswa tersebut bertentangan dengan keterkaitan sila...',
    options: [
      { id: 'A', text: 'Sila ke-1 dan Sila ke-4 tentang kebebasan memilih agama' },
      { id: 'B', text: 'Sila ke-2 (merendahkan martabat sesama), Sila ke-3 (merusak kekompakan), dan Sila ke-5 (tidak mau bergotong royong)' },
      { id: 'C', text: 'Sila ke-1 (berdoa sebelum belajar) dan Sila ke-4 (pemungutan suara)' },
      { id: 'D', text: 'Sila ke-4 (kebebasan berpendapat) dan Sila ke-1 (toleransi umat)' },
    ],
    correctAnswer: 'B',
    explanation:
      'Merendahkan pekerjaan orang lain bertentangan dengan Sila ke-2, menolak kerja sama merusak persatuan (Sila ke-3), dan enggan bergotong royong bertentangan dengan nilai kekeluargaan serta keadilan sosial (Sila ke-5).',
  },
  {
    id: 14,
    type: 'pg',
    topic: 'Makna & Pengamalan Sila Pancasila',
    difficulty: 'Sukar',
    elemen: 'Pancasila',
    levelKognitif: 'L3',
    text: 'Bayangkan sebuah pemilihan ketua kelas berlangsung tertib melalui musyawarah (Sila ke-4), namun pemenangnya kemudian bersikap semena-mena dan hanya membela teman dekatnya saat terjadi masalah di kelas. Mengapa hal tersebut menunjukkan pengamalan Pancasila yang belum utuh?',
    options: [
      { id: 'A', text: 'Karena Sila ke-4 hanya berlaku saat pemilihan berlangsung, bukan setelah terpilih' },
      { id: 'B', text: 'Karena pelaksanaan Sila ke-4 seharusnya dijiwai oleh Sila ke-2 (adil dan beradab) serta bertujuan mewujudkan Sila ke-5 (keadilan bagi semua)' },
      { id: 'C', text: 'Karena ketua kelas berhak menentukan aturan sendiri tanpa persetujuan guru' },
      { id: 'D', text: 'Karena Sila ke-3 melarang adanya pemilihan pemimpin di lingkungan sekolah' },
    ],
    correctAnswer: 'B',
    explanation:
      'Dalam kesatuan sila-sila Pancasila, proses demokrasi (Sila ke-4) harus dijalankan secara beradab (Sila ke-2) dan menghasilkan keadilan bagi seluruh warga kelas tanpa pilih kasih (Sila ke-5).',
  },
  {
    id: 15,
    type: 'pg',
    topic: 'Makna & Pengamalan Sila Pancasila',
    difficulty: 'Sukar',
    elemen: 'Pancasila',
    levelKognitif: 'L3',
    text: 'Najwa menemukan dua sikap berbeda di lingkungannya: (1) Tetangga menyalakan musik terlalu keras saat tetangga lain sedang beribadah, dan (2) Warga berdiskusi mencari solusi agar acara hajatan tetap meriah tanpa mengganggu ketenangan lingkungan. Pasangan sila Pancasila yang paling tepat untuk menilai kedua peristiwa tersebut adalah...',
    options: [
      { id: 'A', text: 'Peristiwa (1) melanggar Sila ke-1 dan ke-2; Peristiwa (2) mengamalkan Sila ke-3 dan ke-4' },
      { id: 'B', text: 'Peristiwa (1) mengamalkan Sila ke-5; Peristiwa (2) melanggar Sila ke-1' },
      { id: 'C', text: 'Peristiwa (1) melanggar Sila ke-4; Peristiwa (2) mengamalkan Sila ke-1 saja' },
      { id: 'D', text: 'Keduanya merupakan wujud kebebasan pribadi sesuai Sila ke-5' },
    ],
    correctAnswer: 'A',
    explanation:
      'Mengganggu orang beribadah melanggar toleransi (Sila ke-1) dan tenggang rasa (Sila ke-2), sedangkan berdiskusi mencari jalan tengah demi kerukunan warga mengamalkan musyawarah (Sila ke-4) dan persatuan (Sila ke-3).',
  },

  // ============================================================================
  // BAGIAN 2 (Soal 16-25): Pancasila sebagai Dasar Negara, Pandangan Hidup & Ideologi
  // ============================================================================
  {
    id: 16,
    type: 'pg',
    topic: 'Kedudukan & Fungsi Pancasila',
    difficulty: 'Mudah',
    elemen: 'Pancasila',
    levelKognitif: 'L1',
    text: 'Pancasila berkedudukan sebagai dasar negara Republik Indonesia. Artinya Pancasila berfungsi sebagai...',
    options: [
      { id: 'A', text: 'Hiasan lambang negara pada gedung-gedung pemerintahan saja' },
      { id: 'B', text: 'Landasan dan sumber dari segala sumber hukum dalam penyelenggaraan negara' },
      { id: 'C', text: 'Buku cerita sejarah perjuangan kemerdekaan Indonesia' },
      { id: 'D', text: 'Aturan khusus yang hanya berlaku bagi anggota TNI dan Polri' },
    ],
    correctAnswer: 'B',
    explanation:
      'Sebagai dasar negara, Pancasila merupakan fondasi penyelenggaraan negara dan sumber dari segala sumber hukum di Indonesia.',
  },
  {
    id: 17,
    type: 'pg',
    topic: 'Kedudukan & Fungsi Pancasila',
    difficulty: 'Mudah',
    elemen: 'Pancasila',
    levelKognitif: 'L1',
    text: 'Kedudukan Pancasila sebagai pandangan hidup bangsa Indonesia bermakna bahwa Pancasila dijadikan sebagai...',
    options: [
      { id: 'A', text: 'Pedoman dan petunjuk arah bagi warga negara dalam bersikap dan bertingkah laku sehari-hari' },
      { id: 'B', text: 'Syarat administrasi untuk mengikuti perlombaan olahraga internasional' },
      { id: 'C', text: 'Dokumen rahasia negara yang tidak boleh diketahui masyarakat umum' },
      { id: 'D', text: 'Pengganti seluruh adat istiadat daerah di Indonesia' },
    ],
    correctAnswer: 'A',
    explanation:
      'Sebagai pandangan hidup (way of life), Pancasila menuntun cara berpikir, bersikap, dan bertindak seluruh rakyat Indonesia dalam kehidupan bermasyarakat.',
  },
  {
    id: 18,
    type: 'pg',
    topic: 'Kedudukan & Fungsi Pancasila',
    difficulty: 'Mudah',
    elemen: 'Pancasila',
    levelKognitif: 'L1',
    imageUrl: '/src/assets/images/upacara_dasar_negara_1795643531283.jpg',
    imageAlt: 'Siswa SD melaksanakan upacara bendera hari Senin dengan tertib dan khidmat',
    text: 'Perhatikan gambar kegiatan upacara bendera di sekolah tersebut! Mengikuti upacara bendera dengan khidmat dan tertib setiap hari Senin merupakan praktik sikap yang sesuai dengan nilai Pancasila sebagai...',
    options: [
      { id: 'A', text: 'Alat pemecah belah antar daerah' },
      { id: 'B', text: 'Dasar negara dan ideologi pemersatu bangsa yang menumbuhkan nasionalisme' },
      { id: 'C', text: 'Aturan bermain saat jam istirahat sekolah' },
      { id: 'D', text: 'Kepentingan kelompok tertentu di lingkungan sekolah' },
    ],
    correctAnswer: 'B',
    explanation:
      'Melaksanakan upacara bendera dengan khidmat menumbuhkan rasa cinta tanah air, disiplin, dan penghormatan terhadap simbol negara sesuai nilai Pancasila sebagai dasar negara dan ideologi pemersatu bangsa.',
  },
  {
    id: 19,
    type: 'pg',
    topic: 'Kedudukan & Fungsi Pancasila',
    difficulty: 'Mudah',
    elemen: 'Pancasila',
    levelKognitif: 'L1',
    text: 'Pancasila disepakati secara resmi sebagai dasar negara Indonesia oleh PPKI pada tanggal...',
    options: [
      { id: 'A', text: '1 Juni 1945' },
      { id: 'B', text: '17 Agustus 1945' },
      { id: 'C', text: '18 Agustus 1945' },
      { id: 'D', text: '1 Oktober 1965' },
    ],
    correctAnswer: 'C',
    explanation:
      'Pada 18 Agustus 1945, PPKI mengesahkan UUD 1945 yang di dalam Pembukaannya (alinea ke-4) memuat rumusan resmi Pancasila sebagai dasar negara.',
  },
  {
    id: 20,
    type: 'pg',
    topic: 'Kedudukan & Fungsi Pancasila',
    difficulty: 'Sedang',
    elemen: 'Pancasila',
    levelKognitif: 'L2',
    text: 'Pancasila disebut sebagai ideologi terbuka bagi bangsa Indonesia karena nilai-nilai dasarnya...',
    options: [
      { id: 'A', text: 'Dapat diganti kapan saja sesuai keinginan negara asing' },
      { id: 'B', text: 'Tetap teguh namun mampu menyesuaikan diri dengan perkembangan zaman dan teknologi' },
      { id: 'C', text: 'Berasal dari hasil tiruan ideologi negara-negara lain di dunia' },
      { id: 'D', text: 'Tidak memiliki aturan yang jelas dalam kehidupan berbangsa' },
    ],
    correctAnswer: 'B',
    explanation:
      'Ideologi terbuka berarti nilai dasar Pancasila bersifat tetap, tetapi penjabarannya dinamis dan mampu menjawab tantangan perkembangan ilmu pengetahuan serta zaman.',
  },
  {
    id: 21,
    type: 'pg',
    topic: 'Kedudukan & Fungsi Pancasila',
    difficulty: 'Sedang',
    elemen: 'Pancasila',
    levelKognitif: 'L2',
    imageSvg: svgKedudukanPancasila(),
    text: 'Perhatikan bagan tiga kedudukan Pancasila di atas! Contoh perilaku warga sekolah yang paling tepat menggambarkan praktik Pancasila sebagai pandangan hidup bangsa (kotak nomor 2) adalah...',
    options: [
      { id: 'A', text: 'Pemerintah daerah menerbitkan peraturan tentang wajib belajar' },
      { id: 'B', text: 'Siswa menyapa guru dengan santun, antre di kantin, dan tidak membully teman' },
      { id: 'C', text: 'DPR membahas rancangan undang-undang pendidikan nasional' },
      { id: 'D', text: 'Mahkamah Konstitusi menguji kesesuaian undang-undang terhadap UUD 1945' },
    ],
    correctAnswer: 'B',
    explanation:
      'Menyapa dengan santun, tertib mengantre, dan saling menyayangi merupakan perilaku nyata sehari-hari yang berpedoman pada Pancasila sebagai pandangan hidup bangsa.',
  },
  {
    id: 22,
    type: 'pg',
    topic: 'Kedudukan & Fungsi Pancasila',
    difficulty: 'Sedang',
    elemen: 'Pancasila',
    levelKognitif: 'L2',
    text: 'Di era digital saat ini, banyak siswa kelas VI menggunakan media sosial atau grup percakapan kelas. Praktik sikap yang mencerminkan nilai Pancasila sebagai ideologi bangsa saat menggunakan internet adalah...',
    options: [
      { id: 'A', text: 'Menyebarkan berita yang belum jelas kebenarannya agar grup menjadi ramai' },
      { id: 'B', text: 'Menggunakan kata-kata santun, memeriksa kebenaran informasi, dan menghargai privasi teman' },
      { id: 'C', text: 'Menuliskan komentar mengejek teman yang kurang mahir menggunakan gawai' },
      { id: 'D', text: 'Menghabiskan seluruh waktu belajar untuk bermain gim daring' },
    ],
    correctAnswer: 'B',
    explanation:
      'Bersikap bijak, santun, antihoaks, dan menjaga persatuan di ruang digital merupakan wujud mempraktikkan Pancasila sebagai ideologi yang relevan di era modern.',
  },
  {
    id: 23,
    type: 'pg',
    topic: 'Kedudukan & Fungsi Pancasila',
    difficulty: 'Sukar',
    elemen: 'Pancasila',
    levelKognitif: 'L3',
    text: 'Apa akibat yang dapat terjadi apabila suatu peraturan tata tertib sekolah atau peraturan daerah dibuat tanpa berpedoman pada Pancasila sebagai dasar negara?',
    options: [
      { id: 'A', text: 'Peraturan tersebut akan lebih cepat dihafal oleh seluruh siswa' },
      { id: 'B', text: 'Peraturan berpotensi tidak adil, diskriminatif, serta bertentangan dengan nilai kemanusiaan dan persatuan' },
      { id: 'C', text: 'Sekolah akan mendapatkan penghargaan sebagai sekolah paling modern' },
      { id: 'D', text: 'Seluruh siswa otomatis menjadi lebih disiplin tanpa pengawasan' },
    ],
    correctAnswer: 'B',
    explanation:
      'Sebagai dasar negara dan sumber segala sumber hukum, Pancasila menjamin setiap peraturan selaras dengan nilai ketuhanan, kemanusiaan, persatuan, demokrasi, dan keadilan sosial.',
  },
  {
    id: 24,
    type: 'pg',
    topic: 'Kedudukan & Fungsi Pancasila',
    difficulty: 'Sukar',
    elemen: 'Pancasila',
    levelKognitif: 'L3',
    text: 'Perhatikan pernyataan berikut:\n1) Tata tertib sekolah mewajibkan siswa menghormati warga sekolah tanpa membeda-bedakan latar belakang ekonomi.\n2) Siswa membiasakan senyum, salam, sapa, dan meminta izin sebelum meminjam barang teman.\n3) Seluruh elemen bangsa berpegang pada cita-cita mewujudkan masyarakat yang adil dan makmur.\n\nUrutan penerapan kedudukan Pancasila yang tepat dari pernyataan (1), (2), dan (3) adalah...',
    options: [
      { id: 'A', text: 'Pandangan Hidup – Dasar Negara – Ideologi Bangsa' },
      { id: 'B', text: 'Dasar Negara – Pandangan Hidup – Ideologi Bangsa' },
      { id: 'C', text: 'Ideologi Bangsa – Dasar Negara – Pandangan Hidup' },
      { id: 'D', text: 'Dasar Negara – Ideologi Bangsa – Pandangan Hidup' },
    ],
    correctAnswer: 'B',
    explanation:
      '(1) Tata tertib/aturan resmi mencerminkan Dasar Negara, (2) kebiasaan perilaku sehari-hari mencerminkan Pandangan Hidup, dan (3) cita-cita luhur bersama mencerminkan Ideologi Bangsa.',
  },
  {
    id: 25,
    type: 'pg',
    topic: 'Kedudukan & Fungsi Pancasila',
    difficulty: 'Sukar',
    elemen: 'Pancasila',
    levelKognitif: 'L3',
    text: 'Mengapa bangsa Indonesia tidak boleh mengganti Pancasila dengan ideologi lain yang hanya mementingkan kebebasan individu tanpa batas ataupun yang mengekang kebebasan beragama?',
    options: [
      { id: 'A', text: 'Karena Pancasila digali dari jati diri luhur bangsa Indonesia yang menyeimbangkan hak individu, tanggung jawab sosial, dan nilai religius' },
      { id: 'B', text: 'Karena bangsa Indonesia tidak mengenal perkembangan ilmu pengetahuan dari luar negeri' },
      { id: 'C', text: 'Karena ideologi lain lebih sulit diucapkan dalam upacara bendera' },
      { id: 'D', text: 'Karena Pancasila hanya cocok digunakan oleh generasi terdahulu sebelum merdeka' },
    ],
    correctAnswer: 'A',
    explanation:
      'Pancasila lahir dari kepribadian dan budaya bangsa Indonesia sendiri yang menjunjung tinggi ketuhanan, kemanusiaan, persatuan, musyawarah, serta keseimbangan hak dan kewajiban sosial.',
  },

  // ============================================================================
  // BAGIAN 3 (Soal 26-40): Norma, Hak dan Kewajiban Anak, serta Perilaku Jujur
  // ============================================================================
  {
    id: 26,
    type: 'pg',
    topic: 'Norma, Hak, Kewajiban & Kejujuran',
    difficulty: 'Mudah',
    elemen: 'UUD NRI Tahun 1945',
    levelKognitif: 'L1',
    text: 'Norma yang bersumber dari wahyu Tuhan Yang Maha Esa yang berisi perintah dan larangan bagi umat-Nya disebut norma...',
    options: [
      { id: 'A', text: 'Norma Kesusilaan' },
      { id: 'B', text: 'Norma Agama' },
      { id: 'C', text: 'Norma Kesopanan' },
      { id: 'D', text: 'Norma Hukum' },
    ],
    correctAnswer: 'B',
    explanation:
      'Norma agama berasal dari ajaran Tuhan Yang Maha Esa yang tercantum dalam kitab suci setiap agama.',
  },
  {
    id: 27,
    type: 'pg',
    topic: 'Norma, Hak, Kewajiban & Kejujuran',
    difficulty: 'Mudah',
    elemen: 'UUD NRI Tahun 1945',
    levelKognitif: 'L1',
    text: 'Mengetuk pintu dan mengucapkan salam sebelum masuk ke rumah orang lain, serta berbicara lembut kepada orang tua merupakan contoh penerapan norma...',
    options: [
      { id: 'A', text: 'Norma Kesopanan' },
      { id: 'B', text: 'Norma Hukum' },
      { id: 'C', text: 'Norma Ekonomi' },
      { id: 'D', text: 'Norma Teknologi' },
    ],
    correctAnswer: 'A',
    explanation:
      'Norma kesopanan adalah aturan pergaulan hidup yang timbul dari kebiasaan masyarakat setempat, seperti tata krama bertamu dan bertutur kata santun.',
  },
  {
    id: 28,
    type: 'pg',
    topic: 'Norma, Hak, Kewajiban & Kejujuran',
    difficulty: 'Mudah',
    elemen: 'UUD NRI Tahun 1945',
    levelKognitif: 'L1',
    imageSvg: svgNormaLaluLintas(),
    text: 'Perhatikan gambar aturan lalu lintas di atas! Peraturan yang dibuat oleh lembaga negara resmi, bersifat memaksa, dan memiliki sanksi tegas seperti denda atau tilang disebut...',
    options: [
      { id: 'A', text: 'Norma Agama' },
      { id: 'B', text: 'Norma Kesusilaan' },
      { id: 'C', text: 'Norma Kesopanan' },
      { id: 'D', text: 'Norma Hukum' },
    ],
    correctAnswer: 'D',
    explanation:
      'Norma hukum adalah aturan tertulis yang dibuat oleh lembaga negara yang berwenang, bersifat mengikat seluruh warga negara, dan memberikan sanksi tegas bagi pelanggarnya.',
  },
  {
    id: 29,
    type: 'pg',
    topic: 'Norma, Hak, Kewajiban & Kejujuran',
    difficulty: 'Mudah',
    elemen: 'UUD NRI Tahun 1945',
    levelKognitif: 'L1',
    text: 'Sanksi yang dirasakan seseorang ketika melanggar norma kesusilaan (hati nurani), misalnya berbohong atau menyontek, adalah...',
    options: [
      { id: 'A', text: 'Denda uang tunai dari polisi' },
      { id: 'B', text: 'Perasaan bersalah, gelisah, dan menyesal dalam hati' },
      { id: 'C', text: 'Hukuman penjara dari pengadilan negeri' },
      { id: 'D', text: 'Pemutusan aliran listrik rumah' },
    ],
    correctAnswer: 'B',
    explanation:
      'Norma kesusilaan bersumber dari hati nurani manusia, sehingga sanksinya berupa rasa penyesalan, malu, atau bersalah di dalam batin.',
  },
  {
    id: 30,
    type: 'pg',
    topic: 'Norma, Hak, Kewajiban & Kejujuran',
    difficulty: 'Mudah',
    elemen: 'UUD NRI Tahun 1945',
    levelKognitif: 'L1',
    text: 'Berikut ini yang termasuk contoh HAK anak di lingkungan keluarga (rumah) adalah...',
    options: [
      { id: 'A', text: 'Membantu orang tua merapikan tempat tidur setiap pagi' },
      { id: 'B', text: 'Mendapatkan kasih sayang, perlindungan, dan makanan bergizi' },
      { id: 'C', text: 'Mematuhi nasihat ayah dan ibu dengan penuh hormat' },
      { id: 'D', text: 'Menjaga kebersihan ruang tamu dan halaman rumah' },
    ],
    correctAnswer: 'B',
    explanation:
      'Hak adalah sesuatu yang pantas diterima anak, seperti kasih sayang, makanan sehat, tempat tinggal, dan perlindungan; sedangkan membantu orang tua dan menaati nasihat adalah kewajiban.',
  },
  {
    id: 31,
    type: 'pg',
    topic: 'Norma, Hak, Kewajiban & Kejujuran',
    difficulty: 'Mudah',
    elemen: 'UUD NRI Tahun 1945',
    levelKognitif: 'L1',
    text: 'Contoh KEWAJIBAN seorang siswa saat berada di lingkungan sekolah adalah...',
    options: [
      { id: 'A', text: 'Memperoleh nilai ulangan secara objektif dari guru' },
      { id: 'B', text: 'Meminjam buku bacaan di perpustakaan sekolah' },
      { id: 'C', text: 'Mengenakan seragam rapi sesuai jadwal dan datang tepat waktu' },
      { id: 'D', text: 'Bermain bersama teman pada jam istirahat' },
    ],
    correctAnswer: 'C',
    explanation:
      'Mengenakan seragam sesuai ketentuan dan datang tepat waktu merupakan kewajiban siswa dalam menaati tata tertib sekolah.',
  },
  {
    id: 32,
    type: 'pg',
    topic: 'Norma, Hak, Kewajiban & Kejujuran',
    difficulty: 'Sedang',
    elemen: 'UUD NRI Tahun 1945',
    levelKognitif: 'L2',
    imageUrl: '/src/assets/images/norma_kejujuran_sekolah_1795643531343.jpg',
    imageAlt: 'Seorang siswa menyerahkan dompet temuan kepada guru sementara teman lain antre tertib',
    text: 'Amati gambar peristiwa di koridor sekolah tersebut! Seorang siswa menemukan dompet jatuh lalu langsung menyerahkannya kepada guru, sedangkan siswa lain mengantre dengan tertib. Dua nilai utama yang ditunjukkan pada gambar tersebut adalah...',
    options: [
      { id: 'A', text: 'Perilaku jujur menjaga amanah dan kepatuhan terhadap norma kesopanan/ketertiban' },
      { id: 'B', text: 'Sikap acuh tak acuh dan mencari pujian dari guru kelas' },
      { id: 'C', text: 'Menuntut hak sebelum melaksanakan kewajiban di sekolah' },
      { id: 'D', text: 'Kebebasan mengambil barang siapa saja yang tertinggal di kelas' },
    ],
    correctAnswer: 'A',
    explanation:
      'Mengembalikan barang temuan yang bukan milik kita adalah praktik perilaku jujur (sesuai norma kesusilaan dan agama), dan mengantre dengan teratur menunjukkan kepatuhan pada norma ketertiban/kesopanan.',
  },
  {
    id: 33,
    type: 'pg',
    topic: 'Norma, Hak, Kewajiban & Kejujuran',
    difficulty: 'Sedang',
    elemen: 'UUD NRI Tahun 1945',
    levelKognitif: 'L2',
    text: 'Ibu memberi uang Rp10.000 kepada Mila untuk membeli buku tulis seharga Rp7.500 di koperasi sekolah. Setelah membeli buku, sikap jujur yang harus dilakukan Mila adalah...',
    options: [
      { id: 'A', text: 'Menggunakan sisa uang Rp2.500 untuk jajan tanpa memberi tahu Ibu' },
      { id: 'B', text: 'Mengatakan kepada Ibu bahwa harga buku tulisnya pas Rp10.000' },
      { id: 'C', text: 'Mengembalikan sisa uang Rp2.500 kepada Ibu dan melaporkan harga buku sebenarnya' },
      { id: 'D', text: 'Menyimpan sisa uang tersebut di laci meja agar tidak diketahui siapa pun' },
    ],
    correctAnswer: 'C',
    explanation:
      'Jujur berarti berkata dan bertindak apa adanya sesuai kenyataan, termasuk mengembalikan uang kembalian yang bukan hak kita tanpa izin.',
  },
  {
    id: 34,
    type: 'pg',
    topic: 'Norma, Hak, Kewajiban & Kejujuran',
    difficulty: 'Sedang',
    elemen: 'UUD NRI Tahun 1945',
    levelKognitif: 'L2',
    text: 'Saat mengikuti tes sumatif di kelas, seorang teman duduk di sebelahmu meminta contekan karena belum sempat belajar tadi malam. Tindakan yang mencerminkan perilaku jujur dan menegakkan norma adalah...',
    options: [
      { id: 'A', text: 'Memberikan jawaban secara diam-diam agar dianggap teman setia' },
      { id: 'B', text: 'Menolak dengan halus untuk memberi contekan dan mengajak teman belajar bersama setelah tes' },
      { id: 'C', text: 'Memarahi teman tersebut dengan suara keras sehingga mengganggu kelas' },
      { id: 'D', text: 'Menukar lembar jawaban agar bisa saling menyalin' },
    ],
    correctAnswer: 'B',
    explanation:
      'Menyontek maupun memberi contekan adalah tindakan tidak jujur. Menolak dengan santun dan menawarkan bantuan belajar di luar waktu ujian adalah sikap jujur sekaligus peduli.',
  },
  {
    id: 35,
    type: 'pg',
    topic: 'Norma, Hak, Kewajiban & Kejujuran',
    difficulty: 'Sedang',
    elemen: 'UUD NRI Tahun 1945',
    levelKognitif: 'L2',
    text: 'Setiap warga masyarakat berhak menikmati lingkungan kampung yang bersih, sehat, dan bebas dari banjir. Agar hak tersebut dapat terwujud dengan baik, kewajiban warga yang harus dilakukan terlebih dahulu adalah...',
    options: [
      { id: 'A', text: 'Membuang sampah di selokan ketika tidak ada orang yang melihat' },
      { id: 'B', text: 'Menunggu petugas kebersihan kota datang membersihkan halaman rumah masing-masing' },
      { id: 'C', text: 'Membuang sampah pada tempatnya dan rutin membersihkan saluran air bersama' },
      { id: 'D', text: 'Menyalahkan tetangga setiap kali terjadi genangan air' },
    ],
    correctAnswer: 'C',
    explanation:
      'Hak atas lingkungan bersih hanya terwujud apabila warga menjalankan kewajiban menjaga kebersihan, memilah sampah, dan merawat saluran air secara bersama.',
  },
  {
    id: 36,
    type: 'pg',
    topic: 'Norma, Hak, Kewajiban & Kejujuran',
    difficulty: 'Sedang',
    elemen: 'UUD NRI Tahun 1945',
    levelKognitif: 'L2',
    text: 'Di bawah ini, pasangan contoh pelanggaran norma dan jenis normanya yang paling tepat adalah...',
    options: [
      { id: 'A', text: 'Tidak memakai helm saat berkendara di jalan raya – melanggar Norma Hukum' },
      { id: 'B', text: 'Berbicara kasar kepada guru – melanggar Norma Hukum Pidana' },
      { id: 'C', text: 'Mencuri uang kas kelas – melanggar Norma Kesopanan saja' },
      { id: 'D', text: 'Tidak berdoa sebelum makan – melanggar Norma Lalu Lintas' },
    ],
    correctAnswer: 'A',
    explanation:
      'Kewajiban memakai helm standar SNI saat mengendarai sepeda motor diatur dalam Undang-Undang Lalu Lintas, sehingga pelanggarannya termasuk pelanggaran Norma Hukum.',
  },
  {
    id: 37,
    type: 'pg',
    topic: 'Norma, Hak, Kewajiban & Kejujuran',
    difficulty: 'Sukar',
    elemen: 'UUD NRI Tahun 1945',
    levelKognitif: 'L3',
    text: 'Beni secara tidak sengaja memecahkan vas bunga di ruang kelas saat bermain bola di dalam ruangan. Tidak ada teman maupun guru yang melihat kejadian itu. Jika Beni memilih untuk diam dan menyalahkan angin kencang saat ditanya wali kelas, dampak jangka panjang dari perilaku tidak jujur tersebut adalah...',
    options: [
      { id: 'A', text: 'Beni menjadi anak paling berani dan disegani teman-temannya' },
      { id: 'B', text: 'Kepercayaan guru dan teman berkurang, serta muncul rasa bersalah terus-menerus' },
      { id: 'C', text: 'Masalah vas pecah langsung selesai tanpa menimbulkan kerugian apa pun' },
      { id: 'D', text: 'Beni mendapat hak istimewa untuk tidak mengikuti pelajaran' },
    ],
    correctAnswer: 'B',
    explanation:
      'Ketidakjujuran merusak kepercayaan orang lain dan melanggar norma kesusilaan sehingga menimbulkan beban batin; sebaliknya mengakui kesalahan dengan jujur melatih tanggung jawab.',
  },
  {
    id: 38,
    type: 'pg',
    topic: 'Norma, Hak, Kewajiban & Kejujuran',
    difficulty: 'Sukar',
    elemen: 'UUD NRI Tahun 1945',
    levelKognitif: 'L3',
    imageSvg: svgHakKewajibanDiagram(),
    text: 'Perhatikan diagram keseimbangan kewajiban dan hak siswa di atas! Apabila seorang siswa selalu menuntut haknya mendapat nilai tinggi dan kelas yang nyaman, namun sering bolos piket dan tidak pernah mengerjakan tugas, maka sikap siswa tersebut menunjukkan bahwa...',
    options: [
      { id: 'A', text: 'Pelaksanaan hak dan kewajibannya sudah berjalan seimbang' },
      { id: 'B', text: 'Ia mengabaikan kewajiban yang menjadi syarat terwujudnya hak secara adil' },
      { id: 'C', text: 'Guru wajib memberikan nilai tertinggi karena itu hak mutlak anak' },
      { id: 'D', text: 'Kewajiban kebersihan kelas hanya menjadi tugas ketua kelas' },
    ],
    correctAnswer: 'B',
    explanation:
      'Hak dan kewajiban bersifat timbal balik dan seimbang. Untuk memperoleh lingkungan nyaman dan hasil belajar baik, siswa wajib ikut menjaga kebersihan serta rajin belajar.',
  },
  {
    id: 39,
    type: 'pg',
    topic: 'Norma, Hak, Kewajiban & Kejujuran',
    difficulty: 'Sukar',
    elemen: 'UUD NRI Tahun 1945',
    levelKognitif: 'L3',
    text: 'Mengapa dalam kehidupan bermasyarakat diperlukan keempat macam norma (agama, kesusilaan, kesopanan, dan hukum) sekaligus, bukan hanya norma hukum saja?',
    options: [
      { id: 'A', text: 'Karena norma hukum tidak bisa menjangkau niat batin, tata krama pergaulan, maupun ketakwaan spiritual manusia' },
      { id: 'B', text: 'Karena norma hukum hanya berlaku pada malam hari saat petugas ronda berjaga' },
      { id: 'C', text: 'Karena norma kesopanan lebih berat sanksinya dibandingkan norma hukum' },
      { id: 'D', text: 'Karena norma agama dan kesusilaan tidak memiliki pengaruh apa pun terhadap perilaku manusia' },
    ],
    correctAnswer: 'A',
    explanation:
      'Keempat norma saling melengkapi: norma agama membina ketakwaan, norma kesusilaan menjaga hati nurani, norma kesopanan mengatur tata krama, dan norma hukum memberi kepastian sanksi tegas.',
  },
  {
    id: 40,
    type: 'pg',
    topic: 'Norma, Hak, Kewajiban & Kejujuran',
    difficulty: 'Sukar',
    elemen: 'UUD NRI Tahun 1945',
    levelKognitif: 'L3',
    text: 'Pada jam istirahat, kantin sekolah sedang ramai. Sita sangat lapar dan buru-buru ingin membeli makanan sebelum bel masuk berbunyi, tetapi antrean cukup panjang. Tindakan Sita yang tepat dalam menyeimbangkan hak sebagai pembeli dengan kewajiban mematuhi norma di sekolah adalah...',
    options: [
      { id: 'A', text: 'Menyerobot antrean teman adik kelas agar cepat dilayani' },
      { id: 'B', text: 'Berdiri antre sesuai urutan kedatangan sambil tetap menjaga ketertiban' },
      { id: 'C', text: 'Mengambil makanan tanpa membayar lalu membayarnya besok tanpa izin penjual' },
      { id: 'D', text: 'Meminta teman yang berada di barisan depan untuk membelikan barang miliknya secara paksa' },
    ],
    correctAnswer: 'B',
    explanation:
      'Setiap siswa memiliki hak yang sama untuk membeli makanan di kantin, sehingga harus dibarengi kewajiban menghormati hak teman lain dengan mengantre tertib.',
  },

  // ============================================================================
  // BAGIAN 4 (Soal 41-50): Arti, Ciri, Tata Cara & Praktik Musyawarah
  // ============================================================================
  {
    id: 41,
    type: 'pg',
    topic: 'Musyawarah untuk Mufakat',
    difficulty: 'Mudah',
    elemen: 'Pancasila',
    levelKognitif: 'L1',
    text: 'Musyawarah merupakan kegiatan membahas suatu persoalan bersama-sama yang bertujuan untuk mencapai...',
    options: [
      { id: 'A', text: 'Kemenangan pendapat kelompok yang paling keras suaranya' },
      { id: 'B', text: 'Keputusan bersama (mufakat) demi kepentingan bersama' },
      { id: 'C', text: 'Perselisihan antarwarga yang berbeda pandangan' },
      { id: 'D', text: 'Keuntungan pribadi bagi pemimpin rapat' },
    ],
    correctAnswer: 'B',
    explanation:
      'Musyawarah adalah pembahasan bersama suatu masalah dengan maksud mencapai keputusan atau kesepakatan bersama (mufakat) untuk kebaikan bersama.',
  },
  {
    id: 42,
    type: 'pg',
    topic: 'Musyawarah untuk Mufakat',
    difficulty: 'Mudah',
    elemen: 'Pancasila',
    levelKognitif: 'L1',
    text: 'Salah satu ciri utama pelaksanaan musyawarah yang sesuai dengan nilai Pancasila adalah...',
    options: [
      { id: 'A', text: 'Pemimpin rapat memaksakan keputusannya kepada seluruh peserta' },
      { id: 'B', text: 'Setiap peserta memiliki kesempatan yang sama untuk menyampaikan pendapat secara santun' },
      { id: 'C', text: 'Hanya orang yang paling tua atau paling kaya yang boleh berbicara' },
      { id: 'D', text: 'Peserta boleh memotong pembicaraan orang lain jika tidak setuju' },
    ],
    correctAnswer: 'B',
    explanation:
      'Ciri musyawarah Pancasila antara lain dilandasi semangat kekeluargaan, mengutamakan kepentingan bersama, dan memberi kesempatan setara bagi setiap peserta untuk berpendapat.',
  },
  {
    id: 43,
    type: 'pg',
    topic: 'Musyawarah untuk Mufakat',
    difficulty: 'Mudah',
    elemen: 'NKRI',
    levelKognitif: 'L1',
    imageUrl: '/src/assets/images/musyawarah_warga_desa_1795643530608.jpg',
    imageAlt: 'Warga desa duduk melingkar bermusyawarah di balai desa sambil mengangkat tangan menyampaikan pendapat',
    text: 'Perhatikan gambar musyawarah warga di balai desa tersebut! Tata cara yang benar saat ingin menyampaikan usulan dalam musyawarah seperti tampak pada gambar adalah...',
    options: [
      { id: 'A', text: 'Berteriak agar semua warga segera menoleh dan mendengarkan' },
      { id: 'B', text: 'Mengangkat tangan terlebih dahulu, menunggu dipersilakan, dan berbicara dengan bahasa santun' },
      { id: 'C', text: 'Berbicara berbisik-bisik dengan teman di sebelah saat warga lain berpendapat' },
      { id: 'D', text: 'Meninggalkan ruangan jika usulannya belum langsung disetujui' },
    ],
    correctAnswer: 'B',
    explanation:
      'Dalam musyawarah yang tertib, peserta mengacungkan tangan terlebih dahulu, menunggu izin pimpinan musyawarah, lalu menyampaikan pendapat dengan jelas dan sopan.',
  },
  {
    id: 44,
    type: 'pg',
    topic: 'Musyawarah untuk Mufakat',
    difficulty: 'Mudah',
    elemen: 'NKRI',
    levelKognitif: 'L1',
    text: 'Contoh kegiatan musyawarah yang sering dipraktikkan di lingkungan masyarakat sekitar adalah...',
    options: [
      { id: 'A', text: 'Rapat warga RT membahas jadwal siskamling dan kerja bakti lingkungan' },
      { id: 'B', text: 'Mengerjakan soal ulangan harian secara mandiri di kelas' },
      { id: 'C', text: 'Menentukan menu sarapan pribadi di pagi hari' },
      { id: 'D', text: 'Mengikuti perlombaan lari cepat tingkat kecamatan' },
    ],
    correctAnswer: 'A',
    explanation:
      'Rapat warga RT/RW untuk membahas keamanan lingkungan (siskamling), kebersihan desa, atau kegiatan peringatan hari besar merupakan praktik nyata musyawarah di masyarakat.',
  },
  {
    id: 45,
    type: 'pg',
    topic: 'Musyawarah untuk Mufakat',
    difficulty: 'Sedang',
    elemen: 'Pancasila',
    levelKognitif: 'L2',
    text: 'Dalam musyawarah kelas VI untuk menentukan tujuan karya wisata, ternyata usulanmu tidak terpilih sebagai keputusan akhir karena sebagian besar teman lebih memilih lokasi lain. Sikap terbaik yang harus kamu tunjukkan adalah...',
    options: [
      { id: 'A', text: 'Menolak ikut karya wisata dan mengajak teman dekat untuk protes' },
      { id: 'B', text: 'Menerima hasil keputusan dengan lapang dada dan tetap ikut berpartisipasi dengan semangat' },
      { id: 'C', text: 'Menjelek-jelekkan lokasi yang terpilih selama perjalanan' },
      { id: 'D', text: 'Meminta musyawarah diulang berkali-kali sampai usulanmu menang' },
    ],
    correctAnswer: 'B',
    explanation:
      'Salah satu prinsip penting musyawarah adalah berjiwa besar menerima dan melaksanakan keputusan bersama dengan penuh tanggung jawab meskipun berbeda dari usul pribadi.',
  },
  {
    id: 46,
    type: 'pg',
    topic: 'Musyawarah untuk Mufakat',
    difficulty: 'Sedang',
    elemen: 'Pancasila',
    levelKognitif: 'L2',
    imageSvg: svgAlurMusyawarah(),
    text: 'Perhatikan bagan alur tata cara musyawarah di atas! Apabila pada tahap ke-3 (Mufakat) sudah dilakukan diskusi mendalam dengan berbagai pertimbangan namun belum juga tercapai kata sepakat, langkah terakhir yang sah dan demokratis adalah...',
    options: [
      { id: 'A', text: 'Membubarkan musyawarah tanpa mengambil keputusan apa pun' },
      { id: 'B', text: 'Melakukan pemungutan suara terbanyak (voting) secara adil dan terbuka' },
      { id: 'C', text: 'Menyerahkan keputusan sepenuhnya kepada peserta yang suaranya paling lantang' },
      { id: 'D', text: 'Mengabaikan persoalan tersebut selamanya' },
    ],
    correctAnswer: 'B',
    explanation:
      'Musyawarah selalu mengutamakan mufakat terlebih dahulu. Jika mufakat tidak tercapai setelah upaya maksimal, pengambilan keputusan dapat dilakukan melalui pemungutan suara (voting).',
  },
  {
    id: 47,
    type: 'pg',
    topic: 'Musyawarah untuk Mufakat',
    difficulty: 'Sedang',
    elemen: 'NKRI',
    levelKognitif: 'L2',
    text: 'Warga Kelurahan Loloan Timur bermusyawarah membangun pos ronda baru. Agar keputusan musyawarah tersebut benar-benar berkualitas dan bisa dilaksanakan seluruh warga, pertimbangan utama dalam mengambil keputusan adalah...',
    options: [
      { id: 'A', text: 'Manfaatnya bagi seluruh warga, kemampuan dana bersama, dan keamanan lingkungan' },
      { id: 'B', text: 'Dekat tidaknya lokasi pos ronda dengan rumah ketua panitia saja' },
      { id: 'C', text: 'Keinginan satu atau dua orang tokoh yang paling banyak berbicara' },
      { id: 'D', text: 'Meniru desain bangunan dari desa lain tanpa melihat kebutuhan warga' },
    ],
    correctAnswer: 'A',
    explanation:
      'Keputusan musyawarah harus dapat dipertanggungjawabkan secara moral, masuk akal, adil, dan mengutamakan kemaslahatan serta kemampuan masyarakat luas.',
  },
  {
    id: 48,
    type: 'pg',
    topic: 'Musyawarah untuk Mufakat',
    difficulty: 'Sukar',
    elemen: 'Bhinneka Tunggal Ika',
    levelKognitif: 'L3',
    text: 'Perhatikan kondisi berikut pada sebuah rapat karang taruna kampung:\n1) Pemimpin rapat mencatat semua usulan warga tanpa menyela.\n2) Beberapa peserta mengejek usulan pemuda baru karena dianggap kurang berpengalaman.\n3) Sebagian peserta bersedia menurunkan egonya agar tercapai titik temu.\n4) Keputusan rapat hanya menguntungkan warga di gang depan saja.\n\nManakah pernyataan yang menunjukkan Ciri Musyawarah yang Benar sesuai nilai Pancasila?',
    options: [
      { id: 'A', text: 'Pernyataan (1) dan (2)' },
      { id: 'B', text: 'Pernyataan (1) dan (3)' },
      { id: 'C', text: 'Pernyataan (2) dan (4)' },
      { id: 'D', text: 'Pernyataan (3) dan (4)' },
    ],
    correctAnswer: 'B',
    explanation:
      'Menghargai dan mencatat setiap usul (1) serta bersedia berkompromi demi titik temu bersama (3) adalah ciri musyawarah yang sehat; mengejek pendapat orang (2) dan keputusan yang tidak adil (4) menyalahi semangat musyawarah.',
  },
  {
    id: 49,
    type: 'pg',
    topic: 'Musyawarah untuk Mufakat',
    difficulty: 'Sukar',
    elemen: 'NKRI',
    levelKognitif: 'L3',
    text: 'Dalam rapat warga membahas pengelolaan sampah kampung, muncul dua usulan berbeda: Kelompok A mengusulkan iuran bulanan untuk membayar petugas angkut sampah, sedangkan Kelompok B mengusulkan sistem bank sampah dan piket pilah sampah mandiri karena sebagian warga kurang mampu membayar iuran tinggi. Sebagai pemimpin musyawarah, solusi mufakat terbaik yang memadukan kedua gagasan secara adil adalah...',
    options: [
      { id: 'A', text: 'Menolak usul Kelompok B karena dianggap terlalu merepotkan' },
      { id: 'B', text: 'Menggabungkan keduanya: warga memilah sampah bernilai jual lewat bank sampah agar biaya iuran angkut menjadi sangat ringan bagi semua warga' },
      { id: 'C', text: 'Menetapkan iuran paling mahal tanpa meminta persetujuan Kelompok B' },
      { id: 'D', text: 'Menunda rapat hingga tahun depan tanpa program pengelolaan sampah' },
    ],
    correctAnswer: 'B',
    explanation:
      'Inti musyawarah mufakat adalah mencari titik temu yang adil dan saling menguntungkan (win-win solution) dengan mempertimbangkan aspirasi serta kondisi seluruh pihak.',
  },
  {
    id: 50,
    type: 'pg',
    topic: 'Musyawarah untuk Mufakat',
    difficulty: 'Sukar',
    elemen: 'NKRI',
    levelKognitif: 'L3',
    text: 'Mengapa keputusan yang diambil melalui musyawarah mufakat lebih kuat menjaga persatuan masyarakat dibandingkan keputusan sepihak oleh pemimpin?',
    options: [
      { id: 'A', text: 'Karena keputusan musyawarah lahir dari kesepakatan bersama sehingga semua warga merasa dihargai, memiliki keputusan itu, dan ikhlas melaksanakannya' },
      { id: 'B', text: 'Karena keputusan musyawarah selalu membebaskan warga dari segala kewajiban' },
      { id: 'C', text: 'Karena musyawarah menjamin tidak akan pernah ada perbedaan pendapat lagi selamanya' },
      { id: 'D', text: 'Karena pemimpin tidak perlu bertanggung jawab jika hasil keputusan tidak berjalan' },
    ],
    correctAnswer: 'A',
    explanation:
      'Ketika warga dilibatkan dalam pengambilan keputusan secara adil, tumbuh rasa memiliki dan tanggung jawab bersama sehingga pelaksanaan keputusan berjalan rukun dan berkelanjutan.',
  },
];

export const BLUEPRINTS_BY_ID: Record<number, QuestionBlueprint> = {
  1: {
    elemen: 'Pancasila',
    tujuanPembelajaran:
      'Peserta didik dapat mengamalkan nilai-nilai sila pertama Pancasila dalam kehidupan sehari-hari di sekolah.',
    indikatorSoal:
      'Disajikan pernyataan tentang makna sila pertama Pancasila, peserta didik dapat menentukan contoh pengamalan sila pertama di sekolah dengan tepat.',
    levelKognitif: 'L1',
    bobotSkor: 1,
  },
  2: {
    elemen: 'Pancasila',
    tujuanPembelajaran:
      'Peserta didik dapat mengurai makna simbol sila-sila dalam Pancasila.',
    indikatorSoal:
      'Disajikan gambar simbol-simbol sila Pancasila, peserta didik dapat mengidentifikasi simbol sila kedua beserta maknanya.',
    levelKognitif: 'L1',
    bobotSkor: 1,
  },
  3: {
    elemen: 'Pancasila',
    tujuanPembelajaran:
      'Peserta didik dapat mengurai makna simbol sila ketiga Pancasila.',
    indikatorSoal:
      'Peserta didik dapat menjelaskan makna simbol Pohon Beringin pada sila ketiga Pancasila.',
    levelKognitif: 'L1',
    bobotSkor: 1,
  },
  4: {
    elemen: 'Pancasila',
    tujuanPembelajaran:
      'Peserta didik dapat menunjukkan sikap yang sesuai dengan nilai sila kelima Pancasila.',
    indikatorSoal:
      'Peserta didik dapat memilih contoh perilaku hidup hemat dan adil yang mencerminkan sila kelima Pancasila.',
    levelKognitif: 'L1',
    bobotSkor: 1,
  },
  5: {
    elemen: 'Pancasila',
    tujuanPembelajaran:
      'Peserta didik dapat mengidentifikasi sikap pengamalan nilai-nilai sila Pancasila melalui ilustrasi kegiatan di sekolah.',
    indikatorSoal:
      'Disajikan gambar kegiatan gotong royong dan menolong teman yang terjatuh di sekolah, peserta didik dapat menentukan sila Pancasila yang diamalkan.',
    levelKognitif: 'L1',
    bobotSkor: 1,
  },
  6: {
    elemen: 'Pancasila',
    tujuanPembelajaran:
      'Peserta didik dapat mengurai makna simbol sila kelima Pancasila.',
    indikatorSoal:
      'Peserta didik dapat menjelaskan makna simbol Padi dan Kapas pada sila kelima Pancasila.',
    levelKognitif: 'L1',
    bobotSkor: 1,
  },
  7: {
    elemen: 'Pancasila',
    tujuanPembelajaran:
      'Peserta didik dapat mengidentifikasi keterkaitan antar sila dalam sikap toleransi sehari-hari.',
    indikatorSoal:
      'Disajikan cerita singkat sikap menghormati teman yang sedang berpuasa, peserta didik dapat menguraikan keterkaitan antara Sila ke-1 dan Sila ke-2.',
    levelKognitif: 'L2',
    bobotSkor: 1,
  },
  8: {
    elemen: 'Pancasila',
    tujuanPembelajaran:
      'Peserta didik dapat menunjukkan sikap kepedulian kemanusiaan sesuai sila kedua Pancasila.',
    indikatorSoal:
      'Disajikan ilustrasi penggalangan dana bagi korban bencana banjir di sekolah, peserta didik dapat menjelaskan alasan sikap tersebut mencerminkan Sila ke-2.',
    levelKognitif: 'L2',
    bobotSkor: 1,
  },
  9: {
    elemen: 'Pancasila',
    tujuanPembelajaran:
      'Peserta didik dapat mengamalkan nilai persatuan dan cinta budaya bangsa sesuai sila ketiga Pancasila.',
    indikatorSoal:
      'Disajikan kasus kegiatan pentas seni budaya daerah di sekolah, peserta didik dapat menentukan sikap yang mencerminkan Sila ke-3.',
    levelKognitif: 'L2',
    bobotSkor: 1,
  },
  10: {
    elemen: 'Pancasila',
    tujuanPembelajaran:
      'Peserta didik dapat menguraikan keterkaitan dan kesatuan organik antar sila-sila Pancasila.',
    indikatorSoal:
      'Disajikan bagan keterkaitan sila-sila Pancasila, peserta didik dapat menyimpulkan hubungan saling menjiwai antar sila dengan tepat.',
    levelKognitif: 'L2',
    bobotSkor: 1,
  },
  11: {
    elemen: 'Pancasila',
    tujuanPembelajaran:
      'Peserta didik dapat menerapkan sikap adil dalam kerja kelompok sesuai nilai sila kelima.',
    indikatorSoal:
      'Disajikan ilustrasi pembagian tugas piket oleh ketua regu secara adil tanpa pilih kasih, peserta didik dapat mengaitkannya dengan pengamalan Sila ke-5.',
    levelKognitif: 'L2',
    bobotSkor: 1,
  },
  12: {
    elemen: 'Pancasila',
    tujuanPembelajaran:
      'Peserta didik dapat menganalisis keterkaitan nilai sila-sila Pancasila dalam pengambilan keputusan di masyarakat.',
    indikatorSoal:
      'Disajikan studi kasus penetapan jadwal kerja bakti RT yang mempertimbangkan waktu ibadah umat beragama, peserta didik dapat menganalisis keterkaitan sila-sila Pancasila.',
    levelKognitif: 'L3',
    bobotSkor: 1,
  },
  13: {
    elemen: 'Pancasila',
    tujuanPembelajaran:
      'Peserta didik dapat mengevaluasi sikap yang bertentangan dengan keterkaitan sila-sila Pancasila.',
    indikatorSoal:
      'Disajikan gambar kegiatan gotong royong dan kasus siswa yang menolak bekerja bakti karena status ekonomi, peserta didik dapat menganalisis sila-sila yang dilanggar.',
    levelKognitif: 'L3',
    bobotSkor: 1,
  },
  14: {
    elemen: 'Pancasila',
    tujuanPembelajaran:
      'Peserta didik dapat menelaah keutuhan pengamalan sila-sila Pancasila dalam kepemimpinan di kelas.',
    indikatorSoal:
      'Disajikan kasus ketua kelas terpilih yang bersikap tidak adil setelah pemilihan, peserta didik dapat menyimpulkan alasan ketidaksesuaiannya dengan kesatuan sila Pancasila.',
    levelKognitif: 'L3',
    bobotSkor: 1,
  },
  15: {
    elemen: 'Pancasila',
    tujuanPembelajaran:
      'Peserta didik dapat membedakan sikap yang sesuai dan bertentangan dengan keterkaitan sila-sila Pancasila.',
    indikatorSoal:
      'Disajikan dua peristiwa sosial di lingkungan tempat tinggal, peserta didik dapat menilai keterkaitan sila Pancasila pada masing-masing peristiwa.',
    levelKognitif: 'L3',
    bobotSkor: 1,
  },
  16: {
    elemen: 'Pancasila',
    tujuanPembelajaran:
      'Peserta didik dapat menguraikan makna Pancasila sebagai dasar negara.',
    indikatorSoal:
      'Peserta didik dapat menjelaskan arti kedudukan Pancasila sebagai dasar negara Republik Indonesia.',
    levelKognitif: 'L1',
    bobotSkor: 1,
  },
  17: {
    elemen: 'Pancasila',
    tujuanPembelajaran:
      'Peserta didik dapat menguraikan makna Pancasila sebagai pandangan hidup bangsa.',
    indikatorSoal:
      'Peserta didik dapat menentukan pengertian Pancasila sebagai pandangan hidup bangsa Indonesia.',
    levelKognitif: 'L1',
    bobotSkor: 1,
  },
  18: {
    elemen: 'Pancasila',
    tujuanPembelajaran:
      'Peserta didik dapat mengidentifikasi praktik sikap sesuai nilai Pancasila sebagai dasar negara dan ideologi pemersatu.',
    indikatorSoal:
      'Disajikan gambar pelaksanaan upacara bendera di sekolah, peserta didik dapat menentukan makna sikap disiplin upacara terhadap kedudukan Pancasila.',
    levelKognitif: 'L1',
    bobotSkor: 1,
  },
  19: {
    elemen: 'Pancasila',
    tujuanPembelajaran:
      'Peserta didik dapat mengetahui sejarah penetapan Pancasila sebagai dasar negara.',
    indikatorSoal:
      'Peserta didik dapat menyebutkan tanggal pengesahan resmi Pancasila sebagai dasar negara oleh PPKI.',
    levelKognitif: 'L1',
    bobotSkor: 1,
  },
  20: {
    elemen: 'Pancasila',
    tujuanPembelajaran:
      'Peserta didik dapat menguraikan makna Pancasila sebagai ideologi bangsa yang terbuka.',
    indikatorSoal:
      'Peserta didik dapat menjelaskan alasan Pancasila disebut sebagai ideologi terbuka bagi bangsa Indonesia.',
    levelKognitif: 'L2',
    bobotSkor: 1,
  },
  21: {
    elemen: 'Pancasila',
    tujuanPembelajaran:
      'Peserta didik dapat membedakan penerapan Pancasila sebagai dasar negara, pandangan hidup, dan ideologi bangsa.',
    indikatorSoal:
      'Disajikan bagan tiga kedudukan Pancasila, peserta didik dapat menentukan contoh praktik Pancasila sebagai pandangan hidup bangsa di sekolah.',
    levelKognitif: 'L2',
    bobotSkor: 1,
  },
  22: {
    elemen: 'Pancasila',
    tujuanPembelajaran:
      'Peserta didik dapat mempraktikkan sikap yang sesuai nilai Pancasila sebagai ideologi di era digital.',
    indikatorSoal:
      'Disajikan situasi penggunaan media sosial dan grup kelas oleh siswa, peserta didik dapat menentukan sikap bijak sesuai nilai ideologi Pancasila.',
    levelKognitif: 'L2',
    bobotSkor: 1,
  },
  23: {
    elemen: 'Pancasila',
    tujuanPembelajaran:
      'Peserta didik dapat menganalisis peran Pancasila sebagai dasar negara dalam penyusunan peraturan.',
    indikatorSoal:
      'Peserta didik dapat menganalisis akibat yang timbul apabila peraturan dibuat tanpa berpedoman pada Pancasila sebagai dasar negara.',
    levelKognitif: 'L3',
    bobotSkor: 1,
  },
  24: {
    elemen: 'Pancasila',
    tujuanPembelajaran:
      'Peserta didik dapat mengklasifikasikan contoh nyata kedudukan Pancasila sebagai dasar negara, pandangan hidup, dan ideologi.',
    indikatorSoal:
      'Disajikan tiga pernyataan tentang penerapan nilai Pancasila, peserta didik dapat mengurutkan kedudukan Pancasila yang sesuai dengan tepat.',
    levelKognitif: 'L3',
    bobotSkor: 1,
  },
  25: {
    elemen: 'Pancasila',
    tujuanPembelajaran:
      'Peserta didik dapat mengevaluasi alasan Pancasila menjadi ideologi yang paling sesuai bagi bangsa Indonesia.',
    indikatorSoal:
      'Peserta didik dapat menyimpulkan alasan bangsa Indonesia mempertahankan Pancasila dibandingkan ideologi lain.',
    levelKognitif: 'L3',
    bobotSkor: 1,
  },
  26: {
    elemen: 'UUD NRI Tahun 1945',
    tujuanPembelajaran:
      'Peserta didik dapat memahami pengertian dan bentuk-bentuk norma dalam masyarakat.',
    indikatorSoal:
      'Peserta didik dapat mengidentifikasi norma yang bersumber dari wahyu Tuhan Yang Maha Esa.',
    levelKognitif: 'L1',
    bobotSkor: 1,
  },
  27: {
    elemen: 'UUD NRI Tahun 1945',
    tujuanPembelajaran:
      'Peserta didik dapat mengidentifikasi contoh penerapan norma kesopanan.',
    indikatorSoal:
      'Disajikan contoh sikap bertamu dan bertutur kata santun, peserta didik dapat menentukan bentuk norma yang diterapkan.',
    levelKognitif: 'L1',
    bobotSkor: 1,
  },
  28: {
    elemen: 'UUD NRI Tahun 1945',
    tujuanPembelajaran:
      'Peserta didik dapat memahami ciri-ciri dan bentuk norma hukum melalui ilustrasi visual.',
    indikatorSoal:
      'Disajikan gambar aturan lalu lintas dan ciri-cirinya, peserta didik dapat mengidentifikasi norma hukum dengan benar.',
    levelKognitif: 'L1',
    bobotSkor: 1,
  },
  29: {
    elemen: 'UUD NRI Tahun 1945',
    tujuanPembelajaran:
      'Peserta didik dapat memahami sanksi dari pelanggaran norma kesusilaan.',
    indikatorSoal:
      'Peserta didik dapat menentukan sanksi batin yang muncul apabila seseorang melanggar norma kesusilaan.',
    levelKognitif: 'L1',
    bobotSkor: 1,
  },
  30: {
    elemen: 'UUD NRI Tahun 1945',
    tujuanPembelajaran:
      'Peserta didik dapat mengenal contoh-contoh hak anak di lingkungan keluarga.',
    indikatorSoal:
      'Peserta didik dapat mengidentifikasi contoh hak anak di rumah di antara pilihan kewajiban.',
    levelKognitif: 'L1',
    bobotSkor: 1,
  },
  31: {
    elemen: 'UUD NRI Tahun 1945',
    tujuanPembelajaran:
      'Peserta didik dapat mengenal contoh-contoh kewajiban anak di lingkungan sekolah.',
    indikatorSoal:
      'Peserta didik dapat memilih contoh kewajiban siswa dalam menaati tata tertib sekolah.',
    levelKognitif: 'L1',
    bobotSkor: 1,
  },
  32: {
    elemen: 'UUD NRI Tahun 1945',
    tujuanPembelajaran:
      'Peserta didik dapat mempraktikkan perilaku jujur dan kepatuhan norma di sekolah.',
    indikatorSoal:
      'Disajikan gambar siswa mengembalikan dompet temuan kepada guru dan antre tertib, peserta didik dapat mengidentifikasi nilai kejujuran dan norma yang tampak.',
    levelKognitif: 'L2',
    bobotSkor: 1,
  },
  33: {
    elemen: 'UUD NRI Tahun 1945',
    tujuanPembelajaran:
      'Peserta didik dapat menerapkan perilaku jujur dalam kehidupan sehari-hari di rumah dan sekolah.',
    indikatorSoal:
      'Disajikan soal cerita pembelian buku dengan uang kembalian, peserta didik dapat menentukan tindakan jujur yang tepat.',
    levelKognitif: 'L2',
    bobotSkor: 1,
  },
  34: {
    elemen: 'UUD NRI Tahun 1945',
    tujuanPembelajaran:
      'Peserta didik dapat menunjukkan sikap jujur saat menghadapi ujian di sekolah.',
    indikatorSoal:
      'Disajikan situasi teman meminta contekan saat tes sumatif, peserta didik dapat menentukan sikap jujur sekaligus santun.',
    levelKognitif: 'L2',
    bobotSkor: 1,
  },
  35: {
    elemen: 'UUD NRI Tahun 1945',
    tujuanPembelajaran:
      'Peserta didik dapat menghubungkan pelaksanaan kewajiban warga dengan perolehan hak atas lingkungan bersih.',
    indikatorSoal:
      'Disajikan permasalahan lingkungan kampung bersih, peserta didik dapat menentukan kewajiban warga yang harus dipenuhi.',
    levelKognitif: 'L2',
    bobotSkor: 1,
  },
  36: {
    elemen: 'UUD NRI Tahun 1945',
    tujuanPembelajaran:
      'Peserta didik dapat mengidentifikasi jenis norma yang dilanggar dalam suatu peristiwa.',
    indikatorSoal:
      'Peserta didik dapat menentukan pasangan pelanggaran dan jenis norma yang tepat.',
    levelKognitif: 'L2',
    bobotSkor: 1,
  },
  37: {
    elemen: 'UUD NRI Tahun 1945',
    tujuanPembelajaran:
      'Peserta didik dapat menganalisis dampak perilaku tidak jujur dalam kehidupan sehari-hari.',
    indikatorSoal:
      'Disajikan studi kasus siswa yang menyembunyikan kesalahannya saat memecahkan vas kelas, peserta didik dapat menganalisis akibat jangka panjang ketidakjujuran.',
    levelKognitif: 'L3',
    bobotSkor: 1,
  },
  38: {
    elemen: 'UUD NRI Tahun 1945',
    tujuanPembelajaran:
      'Peserta didik dapat menganalisis keseimbangan hak dan kewajiban siswa di sekolah.',
    indikatorSoal:
      'Disajikan diagram keseimbangan kewajiban dan hak siswa serta kasus siswa yang lalai kewajiban, peserta didik dapat menyimpulkan ketimpangan tersebut.',
    levelKognitif: 'L3',
    bobotSkor: 1,
  },
  39: {
    elemen: 'UUD NRI Tahun 1945',
    tujuanPembelajaran:
      'Peserta didik dapat mengevaluasi peran keempat macam norma yang saling melengkapi di masyarakat.',
    indikatorSoal:
      'Peserta didik dapat menyimpulkan alasan diperlukannya norma agama, kesusilaan, kesopanan, dan hukum secara bersamaan.',
    levelKognitif: 'L3',
    bobotSkor: 1,
  },
  40: {
    elemen: 'UUD NRI Tahun 1945',
    tujuanPembelajaran:
      'Peserta didik dapat memecahkan masalah keseimbangan hak dan kewajiban dalam situasi antrean di sekolah.',
    indikatorSoal:
      'Disajikan kasus antrean kantin pada jam istirahat yang terbatas, peserta didik dapat menentukan tindakan yang menghormati hak sesama dan norma ketertiban.',
    levelKognitif: 'L3',
    bobotSkor: 1,
  },
  41: {
    elemen: 'Pancasila',
    tujuanPembelajaran:
      'Peserta didik dapat memahami arti dan tujuan pelaksanaan musyawarah.',
    indikatorSoal:
      'Peserta didik dapat menentukan tujuan utama dari kegiatan musyawarah bersama.',
    levelKognitif: 'L1',
    bobotSkor: 1,
  },
  42: {
    elemen: 'Pancasila',
    tujuanPembelajaran:
      'Peserta didik dapat mengenal ciri-ciri musyawarah yang sesuai nilai Pancasila.',
    indikatorSoal:
      'Peserta didik dapat memilih ciri utama musyawarah yang menjunjung kesetaraan dan kesantunan.',
    levelKognitif: 'L1',
    bobotSkor: 1,
  },
  43: {
    elemen: 'NKRI',
    tujuanPembelajaran:
      'Peserta didik dapat memahami tata cara menyampaikan pendapat dalam musyawarah.',
    indikatorSoal:
      'Disajikan gambar musyawarah warga di balai desa, peserta didik dapat menentukan etika yang benar saat hendak menyampaikan pendapat.',
    levelKognitif: 'L1',
    bobotSkor: 1,
  },
  44: {
    elemen: 'NKRI',
    tujuanPembelajaran:
      'Peserta didik dapat mengidentifikasi praktik kegiatan musyawarah di lingkungan masyarakat.',
    indikatorSoal:
      'Peserta didik dapat menentukan contoh kegiatan musyawarah yang berlangsung di lingkungan masyarakat.',
    levelKognitif: 'L1',
    bobotSkor: 1,
  },
  45: {
    elemen: 'Pancasila',
    tujuanPembelajaran:
      'Peserta didik dapat mempraktikkan sikap berjiwa besar menerima hasil keputusan musyawarah.',
    indikatorSoal:
      'Disajikan situasi usulan siswa tidak terpilih dalam musyawarah kelas, peserta didik dapat menentukan sikap terbaik yang harus ditunjukkan.',
    levelKognitif: 'L2',
    bobotSkor: 1,
  },
  46: {
    elemen: 'Pancasila',
    tujuanPembelajaran:
      'Peserta didik dapat memahami tata cara pengambilan keputusan apabila mufakat belum tercapai.',
    indikatorSoal:
      'Disajikan bagan alur tata cara musyawarah, peserta didik dapat menentukan langkah demokratis saat mufakat mengalami jalan buntu.',
    levelKognitif: 'L2',
    bobotSkor: 1,
  },
  47: {
    elemen: 'NKRI',
    tujuanPembelajaran:
      'Peserta didik dapat menentukan dasar pertimbangan keputusan dalam musyawarah masyarakat.',
    indikatorSoal:
      'Disajikan konteks musyawarah pembangunan pos ronda kelurahan, peserta didik dapat menentukan pertimbangan utama keputusan bersama.',
    levelKognitif: 'L2',
    bobotSkor: 1,
  },
  48: {
    elemen: 'Bhinneka Tunggal Ika',
    tujuanPembelajaran:
      'Peserta didik dapat menganalisis ciri-ciri musyawarah yang baik dan yang menyimpang.',
    indikatorSoal:
      'Disajikan empat kondisi rapat karang taruna, peserta didik dapat mengidentifikasi dua pernyataan yang menunjukkan ciri musyawarah yang benar.',
    levelKognitif: 'L3',
    bobotSkor: 1,
  },
  49: {
    elemen: 'NKRI',
    tujuanPembelajaran:
      'Peserta didik dapat merumuskan solusi mufakat yang adil atas perbedaan pendapat di masyarakat.',
    indikatorSoal:
      'Disajikan kasus perbedaan usulan warga dalam musyawarah pengelolaan sampah, peserta didik dapat memilih jalan tengah mufakat yang paling adil.',
    levelKognitif: 'L3',
    bobotSkor: 1,
  },
  50: {
    elemen: 'NKRI',
    tujuanPembelajaran:
      'Peserta didik dapat mengevaluasi dampak positif musyawarah mufakat terhadap persatuan masyarakat.',
    indikatorSoal:
      'Peserta didik dapat menyimpulkan alasan keputusan musyawarah mufakat lebih kuat menjaga persatuan dibandingkan keputusan sepihak.',
    levelKognitif: 'L3',
    bobotSkor: 1,
  },
};
