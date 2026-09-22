export interface ResumeData {
  categoryId?: string;
  categoryName?: string;
  subcategoryId?: string;
  subcategoryName?: string;

  name?: string;
  fatherName?: string;
  mobile?: string;
  email?: string;
  dob?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  photo?: string;
  nationality?: string;
  gender?: string;
  maritalStatus?: string;

  passportNumber?: string;
  passportIssueDate?: string;
  passportExpiryDate?: string;
  passportIssuePlace?: string;

  experiences?: Array<{
    company: string;
    country: string;
    position: string;
    startDate: string;
    endDate: string;
    isPresent: boolean;
  }>;

  educations?: Array<{
    qualification: string;
    board: string;
    institute: string;
    year: string;
  }>;

  skills?: string[];
  customSkills?: string[];

  languages?: string[];
  customLanguages?: string[];

  aboutMe?: string;

  // ✅ NAYA FIELD — har resume ka apna paid status
  paid?: boolean;
  resumeId?:string;
}

export interface ResumeColor {
  id: string;
  name: string;
  primary: string;
  light: string;
  dark: string;
}

export const COLOR_OPTIONS: ResumeColor[] = [
  { id: 'black',  name: 'Black',  primary: '#000000', light: '#F5F5F5', dark: '#000000' },
  { id: 'blue',   name: 'Blue',   primary: '#1E88E5', light: '#E3F2FD', dark: '#1565C0' },
  { id: 'green',  name: 'Green',  primary: '#2E7D32', light: '#E8F5E9', dark: '#1B5E20' },
  { id: 'red',    name: 'Red',    primary: '#C62828', light: '#FFEBEE', dark: '#8E0000' },
  { id: 'purple', name: 'Purple', primary: '#6A1B9A', light: '#F3E5F5', dark: '#4A148C' },
  { id: 'orange', name: 'Orange', primary: '#E65100', light: '#FFF3E0', dark: '#BF360C' },
  { id: 'teal',   name: 'Teal',   primary: '#00695C', light: '#E0F2F1', dark: '#004D40' },
  { id: 'maroon', name: 'Maroon', primary: '#7F0000', light: '#FFEBEE', dark: '#4A0000' },
];

export const DEFAULT_COLOR: ResumeColor = COLOR_OPTIONS[0];

const EDUCATION_MAP: Record<string, string> = {
  below_10: 'Below 10th',
  '10th': '10th Passed',
  '12th': '12th Passed',
  iti: 'ITI / Diploma',
  graduate: 'Graduate',
  other: 'Other',
};

const LANGUAGE_MAP: Record<string, string> = {
  hindi: 'Hindi',
  english: 'English',
  marathi: 'Marathi',
  tamil: 'Tamil',
  telugu: 'Telugu',
  bengali: 'Bengali',
  gujarati: 'Gujarati',
  punjabi: 'Punjabi',
  kannada: 'Kannada',
  malayalam: 'Malayalam',
  odia: 'Odia',
  urdu: 'Urdu',
};

/* ============================================================
   CONTENT SCORE + SCALE
============================================================ */

const calculateContentScore = (data: ResumeData): number => {
  let score = 0;

  const expCount = (data.experiences || []).filter(
    (e) => e.company || e.position
  ).length;
  score += expCount * 3.5;

  const eduCount = (data.educations || []).filter(
    (e) => e.qualification || e.board || e.institute
  ).length;
  score += eduCount * 2.5;

  const skillCount =
    (data.skills?.length || 0) + (data.customSkills?.length || 0);
  score += skillCount * 0.6;

  const langCount =
    (data.languages?.length || 0) + (data.customLanguages?.length || 0);
  score += langCount * 0.3;

  if (data.passportNumber) score += 3;

  if (data.aboutMe) {
    const len = data.aboutMe.length;
    if (len > 300) score += 4;
    else if (len > 200) score += 2.5;
    else if (len > 100) score += 1;
  }

  if (data.address && data.address.length > 80) score += 1;

  return score;
};

/**
 * Naya scale — bada aur readable
 */
const getScale = (score: number): number => {
  if (score <= 3)  return 1.3;
  if (score <= 6)  return 1.25;
  if (score <= 10) return 1.18;
  if (score <= 14) return 1.12;
  if (score <= 18) return 1.06;
  if (score <= 22) return 1.0;
  if (score <= 27) return 0.96;
  if (score <= 33) return 0.92;
  if (score <= 40) return 0.88;
  return 0.84;
};

/* ============================================================
   HELPERS
============================================================ */

const calculateAge = (dob?: string): number | null => {
  if (!dob) return null;
  let birthDate: Date | null = null;

  const dmyMatch = dob.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/);
  if (dmyMatch) {
    const [, d, m, y] = dmyMatch;
    birthDate = new Date(Number(y), Number(m) - 1, Number(d));
  }

  const ymdMatch = dob.match(/^(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})$/);
  if (ymdMatch) {
    const [, y, m, d] = ymdMatch;
    birthDate = new Date(Number(y), Number(m) - 1, Number(d));
  }

  if (!birthDate || isNaN(birthDate.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  if (age < 0 || age > 120) return null;
  return age;
};

const formatDate = (date: Date = new Date()): string => {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
};

const safe = (text?: string): string => {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

export interface GenerateOptions {
  showWatermark?: boolean;
  color?: ResumeColor;
}

export const generateResumeHtml = (
  data: ResumeData,
  options: boolean | GenerateOptions = true
): string => {
  let showWatermark = true;
  let color: ResumeColor = DEFAULT_COLOR;

  if (typeof options === 'boolean') {
    showWatermark = options;
  } else {
    showWatermark = options.showWatermark ?? true;
    color = options.color ?? DEFAULT_COLOR;
  }

  const contentScore = calculateContentScore(data);
  const scale = getScale(contentScore);

  console.log(
    `📊 Content score: ${contentScore.toFixed(1)}, scale: ${scale}`
  );

  const px = (val: number): string => `${(val * scale).toFixed(2)}px`;

  /* === Photo === */
  const initial = (data.name || 'K').trim().charAt(0).toUpperCase();
  const hasPhoto = !!data.photo;

  console.log(
    '🔍 Photo in data:',
    hasPhoto ? `YES (${(data.photo!.length / 1024).toFixed(1)} KB)` : 'NO'
  );

  const photoHtml = hasPhoto
    ? `<img src="${data.photo}" class="photo" alt="Photo" />`
    : `<div class="photo-placeholder">${initial}</div>`;

  /* === Skills === */
  const allSkills = [
    ...(data.skills || []),
    ...(data.customSkills || []),
  ]
    .filter((s) => s && String(s).trim())
    .map((s) => String(s).trim());

  const skillsHtml = allSkills
    .map((s) => `<li>${safe(s)}</li>`)
    .join('');

  /* === Languages === */
  const allLanguages = [
    ...(data.languages || []).map((l) => LANGUAGE_MAP[l] || l),
    ...(data.customLanguages || []),
  ].filter(Boolean);

  const languagesHtml = allLanguages.join(', ');

  /* === Address === */
  const fullAddress = [data.address, data.city, data.state, data.pincode]
    .filter((x) => x && String(x).trim())
    .map((x) => safe(String(x).trim()))
    .join(', ');

  /* === Age === */
  const age = calculateAge(data.dob);
  const ageHtml = age !== null ? ` (${age} yrs)` : '';

  /* === Career Objective === */
  const careerObjective =
    data.aboutMe && data.aboutMe.trim()
      ? safe(data.aboutMe)
      : `Looking for entry into a world class highly professional organization and wish to work in an environment, which provides me with ample opportunities and nurture my talents for a bright future ahead.`;

  /* === Experience rows === */
  const validExperiences = (data.experiences || []).filter(
    (e) => e.company || e.position
  );

  const experienceRows = validExperiences
    .map((exp) => {
      const endDate = exp.isPresent
        ? 'Continue'
        : exp.endDate || 'Continue';
      const period = `${exp.startDate || ''}${
        exp.startDate ? ' To ' : ''
      }${endDate}`;
      const company =
        [exp.company, exp.country].filter(Boolean).join(' (') +
        (exp.country ? ')' : '');

      return `
        <tr>
          <td>${safe(company)}</td>
          <td class="center">${safe(exp.position || 'Worker')}</td>
          <td class="center">${safe(period)}</td>
        </tr>
      `;
    })
    .join('');

  /* === Education rows === */
  const validEducations = (data.educations || []).filter(
    (e) => e.qualification || e.board || e.institute
  );

  const educationRows = validEducations
    .map((edu) => {
      const qualText =
        EDUCATION_MAP[edu.qualification] ||
        safe(edu.qualification) ||
        '-';
      const boardText = safe(edu.board) || safe(edu.institute) || '-';
      const yearText = safe(edu.year) || '-';

      return `
        <tr>
          <td>${qualText}</td>
          <td>${boardText}</td>
          <td class="center">${yearText}</td>
        </tr>
      `;
    })
    .join('');

  /* === Watermark === */
  const watermarkHtml = showWatermark
    ? `<div class="watermark">
        <div class="watermark-text">KARIGAR SATHI</div>
        <div class="watermark-sub">DEMO — PAY TO REMOVE</div>
       </div>`
    : '';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CV - ${safe(data.name || 'Karigar')}</title>
  <style>
    :root {
      --primary: ${color.primary};
      --light: ${color.light};
      --dark: ${color.dark};
    }

    @page { size: A4; margin: 0; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      font-family: 'Times New Roman', 'Georgia', serif;
      background: #fff;
      color: #000;
      font-size: ${px(13)};
      line-height: 1.4;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .page {
      width: 210mm;
      min-height: 297mm;
      padding: 10mm 12mm;
      margin: 0 auto;
      background: #fff;
      position: relative;
    }

    /* ===== Watermark ===== */
    .watermark {
      position: fixed;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%) rotate(-32deg);
      z-index: 9999;
      pointer-events: none;
      text-align: center;
      white-space: nowrap;
    }
    .watermark-text {
      font-size: 72px;
      font-weight: 900;
      color: rgba(30, 136, 229, 0.10);
      letter-spacing: 10px;
    }
    .watermark-sub {
      font-size: 16px;
      font-weight: 700;
      color: rgba(244, 67, 54, 0.18);
      letter-spacing: 4px;
      margin-top: 6px;
    }

    /* ===== Top Heading ===== */
    .main-title {
      text-align: center;
      font-size: ${px(18)};
      font-weight: bold;
      color: var(--primary);
      text-decoration: underline;
      text-decoration-color: var(--primary);
      text-underline-offset: 3px;
      letter-spacing: 2.5px;
      margin-bottom: ${px(12)};
      font-family: 'Times New Roman', serif;
    }

    /* ===== Header ===== */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: ${px(12)};
      margin-bottom: ${px(5)};
      padding-bottom: ${px(8)};
      border-bottom: 1.8px solid var(--primary);
    }
    .header-left { flex: 1; }
    .name {
      font-size: ${px(17)};
      font-weight: bold;
      color: var(--primary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: ${px(4)};
    }
    .contact-line {
      font-size: ${px(12)};
      color: #000;
      margin-bottom: ${px(2)};
    }
    .contact-line b {
      font-weight: bold;
      color: var(--primary);
    }

    /* ===== Photo ===== */
    .photo, .photo-placeholder {
      width: ${px(82)};
      height: ${px(98)};
      max-width: ${px(82)};
      max-height: ${px(98)};
      display: block;
      object-fit: cover;
      border: 1.2px solid var(--primary);
      flex-shrink: 0;
      background: #fff;
    }
    .photo-placeholder {
      background: var(--light);
      color: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: ${px(36)};
      font-weight: bold;
    }

    /* ===== Sections ===== */
    .section { margin-top: ${px(8)}; }
    .section-title {
      font-size: ${px(12.5)};
      font-weight: bold;
      color: var(--primary);
      text-decoration: underline;
      text-decoration-color: var(--primary);
      text-underline-offset: 3px;
      margin-bottom: ${px(5)};
      letter-spacing: 0.4px;
      font-family: 'Times New Roman', serif;
    }

    /* ===== Post Applied For ===== */
    .post-applied {
      display: flex;
      align-items: baseline;
      gap: ${px(16)};
      margin-bottom: ${px(8)};
      padding-bottom: ${px(6)};
      border-bottom: 1.2px solid var(--primary);
    }
    .post-applied .label {
      font-weight: bold;
      font-size: ${px(12.5)};
      color: var(--primary);
      text-decoration: underline;
      text-underline-offset: 3px;
      white-space: nowrap;
    }
    .post-applied .value {
      font-size: ${px(12.5)};
      font-weight: bold;
      color: #000;
    }

    /* ===== Objective ===== */
    .objective-text {
      font-size: ${px(12)};
      color: #000;
      line-height: 1.45;
      text-align: justify;
      font-family: 'Times New Roman', serif;
    }

    /* ===== Personal Details ===== */
    .personal-table {
      width: 100%;
      border-collapse: collapse;
    }
    .personal-table td {
      padding: ${px(2.5)} 0;
      font-size: ${px(12)};
      vertical-align: top;
      line-height: 1.4;
    }
    .personal-table td.label {
      width: 32%;
      font-weight: bold;
      color: var(--primary);
      white-space: nowrap;
    }
    .personal-table td.colon {
      width: ${px(14)};
      text-align: center;
      color: var(--primary);
      font-weight: bold;
    }
    .personal-table td.value { color: #000; }

    /* ===== Data Tables ===== */
    .data-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: ${px(3)};
      font-size: ${px(11.5)};
      font-family: 'Times New Roman', serif;
    }
    .data-table th {
      background: var(--light);
      border: 1px solid var(--primary);
      padding: ${px(5)} ${px(7)};
      text-align: left;
      font-weight: bold;
      font-size: ${px(11)};
      color: var(--dark);
    }
    .data-table td {
      border: 1px solid #000;
      padding: ${px(5)} ${px(7)};
      vertical-align: top;
      color: #000;
      font-size: ${px(11.5)};
    }
    .data-table td.center { text-align: center; }
    .data-table th.center { text-align: center; }

    /* ===== Skills ===== */
    .skills-list {
      display: flex;
      flex-wrap: wrap;
      gap: ${px(3)} ${px(20)};
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .skills-list li {
      font-size: ${px(12)};
      color: #000;
      line-height: 1.55;
      padding-left: ${px(13)};
      position: relative;
      white-space: nowrap;
      font-family: 'Times New Roman', serif;
    }
    .skills-list li::before {
      content: '•';
      color: var(--primary);
      font-weight: bold;
      position: absolute;
      left: 0;
      font-size: ${px(15)};
    }

    /* ===== Footer ===== */
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: ${px(22)};
      padding-top: ${px(8)};
      font-size: ${px(12)};
      color: #000;
      font-family: 'Times New Roman', serif;
    }
    .footer-left {
      display: flex;
      flex-direction: column;
      gap: ${px(6)};
    }
    .footer-left b {
      font-weight: bold;
      color: var(--primary);
    }
    .signature-block { text-align: center; }
    .signature-name {
      font-weight: bold;
      font-size: ${px(12.5)};
      color: var(--primary);
      letter-spacing: 0.5px;
      margin-top: ${px(3)};
    }

    /* ===== Natural page break rules ===== */
    .section { page-break-inside: avoid; }
    .footer { page-break-inside: avoid; }
    tr { page-break-inside: avoid; }

    @media print {
      body { background: #fff; }
      .page { margin: 0; box-shadow: none; }
    }
  </style>
</head>
<body>
  ${watermarkHtml}
  <div class="page">

    <div class="main-title">CURRICULUM VITAE</div>

    <div class="header">
      <div class="header-left">
        <div class="name">${safe(data.name || 'Your Name')}</div>
        ${
          data.mobile
            ? `<div class="contact-line"><b>Mobile No:-</b> +91-${safe(data.mobile)}</div>`
            : ''
        }
        ${
          data.email
            ? `<div class="contact-line"><b>Email:-</b> ${safe(data.email)}</div>`
            : ''
        }
      </div>
      ${photoHtml}
    </div>

    ${
      data.subcategoryName
        ? `<div class="post-applied">
      <span class="label">POST APPLIED FOR:-</span>
      <span class="value">"${safe(data.subcategoryName.toUpperCase())}"</span>
    </div>`
        : ''
    }

    <div class="section">
      <div class="section-title">CAREER OBJECTIVES:-</div>
      <div class="objective-text">${careerObjective}</div>
    </div>

    <div class="section">
      <div class="section-title">PERSONAL DETAILS:-</div>
      <table class="personal-table">
        ${
          data.fatherName
            ? `<tr>
          <td class="label">Father's Name</td>
          <td class="colon">:</td>
          <td class="value">${safe(data.fatherName)}</td>
        </tr>`
            : ''
        }
        <tr>
          <td class="label">Nationality</td>
          <td class="colon">:</td>
          <td class="value">${safe(data.nationality) || 'Indian'}</td>
        </tr>
        ${
          data.dob
            ? `<tr>
          <td class="label">Date Of Birth</td>
          <td class="colon">:</td>
          <td class="value">${safe(data.dob)}${ageHtml}</td>
        </tr>`
            : ''
        }
        ${
          data.gender
            ? `<tr>
          <td class="label">Gender</td>
          <td class="colon">:</td>
          <td class="value">${safe(data.gender)}</td>
        </tr>`
            : ''
        }
        ${
          data.maritalStatus
            ? `<tr>
          <td class="label">Marital Status</td>
          <td class="colon">:</td>
          <td class="value">${safe(data.maritalStatus)}</td>
        </tr>`
            : ''
        }
        ${
          languagesHtml
            ? `<tr>
          <td class="label">Language Known</td>
          <td class="colon">:</td>
          <td class="value">${languagesHtml}</td>
        </tr>`
            : ''
        }
        ${
          fullAddress
            ? `<tr>
          <td class="label">Permanent Address</td>
          <td class="colon">:</td>
          <td class="value">${fullAddress}</td>
        </tr>`
            : ''
        }
      </table>
    </div>

    ${
      educationRows
        ? `<div class="section">
      <div class="section-title">EDUCATIONAL QUALIFICATION:-</div>
      <table class="data-table">
        <thead>
          <tr>
            <th style="width: 30%;">Education</th>
            <th>Board / Institute</th>
            <th class="center" style="width: 18%;">Year</th>
          </tr>
        </thead>
        <tbody>
          ${educationRows}
        </tbody>
      </table>
    </div>`
        : ''
    }

    ${
      data.passportNumber
        ? `<div class="section">
      <div class="section-title">PASSPORT DETAIL:-</div>
      <table class="data-table">
        <thead>
          <tr>
            <th>PASSPORT NO.</th>
            <th>PLACE OF ISSUE</th>
            <th>DATE OF ISSUE</th>
            <th>DATE OF EXPIRY</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><b>${safe(data.passportNumber)}</b></td>
            <td>${safe(data.passportIssuePlace) || '-'}</td>
            <td>${safe(data.passportIssueDate) || '-'}</td>
            <td>${safe(data.passportExpiryDate) || '-'}</td>
          </tr>
        </tbody>
      </table>
    </div>`
        : ''
    }

    ${
      experienceRows
        ? `<div class="section">
      <div class="section-title">TOTAL WORK EXPERIENCE:-</div>
      <table class="data-table">
        <thead>
          <tr>
            <th style="width: 42%;">Name of Company's</th>
            <th class="center" style="width: 25%;">Designation</th>
            <th class="center">Period of Service</th>
          </tr>
        </thead>
        <tbody>
          ${experienceRows}
        </tbody>
      </table>
    </div>`
        : ''
    }

    ${
      skillsHtml
        ? `<div class="section">
      <div class="section-title">SKILLS:-</div>
      <ul class="skills-list">${skillsHtml}</ul>
    </div>`
        : ''
    }

    <div class="footer">
      <div class="footer-left">
        <div><b>Date:</b> ${formatDate()}</div>
        <div><b>Place:</b> ${safe(data.city) || '-'}</div>
      </div>
      <div class="signature-block">
        <div class="signature-name">(${safe(data.name || '').toUpperCase()})</div>
      </div>
    </div>

  </div>
</body>
</html>
  `.trim();
};