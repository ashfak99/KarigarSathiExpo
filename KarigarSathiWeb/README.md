<div align="center">

# 🔧 Karigar Sathi

### कारीगर साथी

**India's first multilingual resume builder for blue-collar workers**

*Electrician, Plumber, Carpenter, Driver — sabke liye professional English resume, sirf ₹20 mein*

[![Made with React Native](https://img.shields.io/badge/React%20Native-0.86-61DAFB?logo=react&logoColor=white)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK%2057-000020?logo=expo&logoColor=white)](https://expo.dev/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Payment-0C2451?logo=razorpay&logoColor=white)](https://razorpay.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.0.0-blue.svg)]()
[![Platform](https://img.shields.io/badge/Platform-Android-3DDC84?logo=android&logoColor=white)]()

[Download APK](#-download) · [Features](#-features) · [Tech Stack](#-tech-stack) · [Setup](#-development-setup)

</div>

---

## 📖 Table of Contents

- [About](#-about)
- [The Problem](#-the-problem)
- [The Solution](#-the-solution)
- [Features](#-features)
- [Supported Professions](#-supported-professions)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Development Setup](#-development-setup)
- [Environment Variables](#-environment-variables)
- [Backend Setup](#-backend-setup)
- [Building APK](#-building-apk)
- [Payment Flow](#-payment-flow)
- [Download](#-download)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🎯 About

**Karigar Sathi** is a free-to-try Android app that helps Indian blue-collar workers create professional English resumes in minutes. It's built for **electricians, plumbers, carpenters, welders, painters, drivers, cooks, and other skilled workers** who need a formal resume to apply for jobs but don't know how to make one.

The app bridges the gap between **Hindi-speaking workers** and **English-speaking employers** by providing:

- **Hindi/English bilingual UI** — worker easily understands the form
- **Professional English resume output** — employers can easily read it
- **Offline-first design** — internet only needed for payment
- **Affordable pricing** — just ₹20 to download the final PDF

---

## 😔 The Problem

India has **over 50 crore blue-collar workers** — electricians, plumbers, masons, drivers, cooks, and countless other skilled professionals.

**Yet 90% of them don't have a proper resume.**

When they apply for jobs in metros, factories, or abroad:

- ❌ Employers demand a **formal English resume**
- ❌ They can't afford **₹500–₹2000 for a designer**
- ❌ Online resume builders are **all in English**
- ❌ They don't know **what to write** in a resume
- ❌ No affordable **offline solution** exists

Result: **They lose jobs to people with resumes, not better skills.**

---

## ✨ The Solution

Karigar Sathi solves this with a **simple 6-step flow**:

```
1. Select profession (12 options)
2. Fill form in Hindi/English
3. See live preview
4. Pay ₹20 via Razorpay
5. Download professional PDF
6. Share directly on WhatsApp
```

**What makes it special:**

| Feature | Benefit |
|---------|---------|
| 🌍 Bilingual UI | Hindi workers easily understand |
| 📄 English output | Professional, employer-friendly |
| 📴 100% offline | Works without internet |
| 💰 ₹20 only | Affordable for everyone |
| 🎨 8 color themes | Personalized resume |
| 📱 WhatsApp share | Instant job applications |

---

## 🚀 Features

### 🎨 User Experience
- **Multi-language UI** — Hindi + English with bilingual labels
- **Terms & Conditions in 5 languages** — Hindi, English, Bengali, Punjabi, Haryanvi
- **First-time onboarding** — scroll-to-accept terms flow
- **Clean, modern UI** — Material Design inspired
- **8 color themes** — personalized resume look
- **Live preview** — see resume before paying

### 📝 Resume Building
- **12 professions supported** — with icons
- **Dynamic forms** — personal + professional details
- **Photo upload** — optional profile picture
- **Multiple experiences** — add work history
- **Multiple educations** — add qualifications
- **Skills multi-select** — preset + custom
- **Languages multi-select** — preset + custom
- **Passport details** — for overseas jobs

### 💾 Data & Privacy
- **100% local storage** — AsyncStorage
- **No cloud upload** — data stays on device
- **No account needed** — no signup, no login
- **Per-resume payment tracking** — each resume independently paid

### 💳 Payment
- **Razorpay integration** — UPI, Card, NetBanking, Wallet
- **Backend verification** — HMAC-SHA256 signature
- **Payment recovery** — auto-recover if app closes mid-payment
- **Test mode ready** — easy switch to live mode

### 📤 Output
- **Professional PDF** — A4 size, Times New Roman
- **Auto font scaling** — fits content beautifully
- **WhatsApp share** — one tap
- **Save to device** — Downloads folder
- **No watermark** after payment

### 🌐 Offline-First
- **Everything works offline** — except payment
- **No API dependency** — resumes generated on device
- **PDF generation local** — via `expo-print`
- **Storage local** — via AsyncStorage

---

## 👷 Supported Professions

| # | Category | Subcategory | Hindi |
|---|----------|-------------|-------|
| 1 | ⚡ Electrical | Electrician | इलेक्ट्रीशियन |
| 2 | ❄️ Electrical | AC & Refrigeration Technician | AC टेक्नीशियन |
| 3 | 🚰 Plumbing | Plumber | प्लंबर |
| 4 | 🔧 Plumbing | Pipe Fitter | पाइप फिटर |
| 5 | 🔥 Mechanical | Welder | वेल्डर |
| 6 | 🚗 Automobile | Auto Mechanic | ऑटो मैकेनिक |
| 7 | 🧱 Construction | Mason | राजमिस्त्री |
| 8 | 🪚 Construction | Carpenter | सुथार |
| 9 | 🎨 Construction | Painter | पेंटर |
| 10 | 👷 Construction | Helper | हेल्पर |
| 11 | 🍳 Services | Cook | रसोइया |
| 12 | 🚕 Services | Driver | ड्राइवर |

**More professions coming soon** — Beautician, Security Guard, Gardener, Delivery, etc.

---

## 🛠️ Tech Stack

### 📱 Mobile App

| Technology | Version | Purpose |
|------------|---------|---------|
| React Native | 0.86.3 | Mobile framework |
| Expo | SDK 57 | Development platform |
| Expo Router | 57.x | File-based navigation |
| TypeScript | 6.0 | Type safety |
| React | 19.2.3 | UI library |
| AsyncStorage | 2.2.0 | Local persistence |
| React i18next | 17.x | Multi-language |
| expo-print | 57.x | HTML → PDF |
| expo-sharing | 57.x | Share PDF |
| expo-file-system | 57.x | File I/O |
| expo-image-picker | 57.x | Photo select |
| react-native-webview | Latest | HTML preview |
| react-native-razorpay | 3.0 | Payments |

### ☁️ Backend

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express | Web framework |
| Razorpay SDK | Payment API |
| CORS | Cross-origin |
| dotenv | Env variables |

### 🌐 Website

| Technology | Version |
|------------|---------|
| React | 19.x |
| Vite | 6.x |
| Tailwind CSS | 4.x |

### 🚀 DevOps

- **EAS Build** — Cloud APK/AAB builds
- **Render** — Backend hosting (free tier)
- **Vercel** — Website hosting (free tier)
- **GitHub Releases** — APK distribution

---

## 📂 Project Structure

```
karigar-sathi/
│
├── 📱 app/                          # Expo Router screens
│   ├── _layout.tsx                  # Root stack navigator
│   ├── index.tsx                    # Home + Terms
│   ├── category.tsx                 # Category selection
│   ├── subcategory.tsx              # Profession selection
│   ├── form/
│   │   ├── personal.tsx             # Personal details form
│   │   └── professional.tsx         # Professional details form
│   ├── preview.tsx                  # Resume preview + color picker
│   ├── payment.tsx                  # Razorpay payment
│   └── download.tsx                 # Final PDF download
│
├── 🧠 src/
│   ├── utils/
│   │   ├── i18n.ts                  # Language configuration
│   │   ├── storage.ts               # AsyncStorage wrappers
│   │   ├── categories.ts            # Category helpers
│   │   ├── resumeHtml.ts            # PDF HTML generator
│   │   ├── pdf.ts                   # PDF create/save/share
│   │   ├── razorpay.ts              # Razorpay service
│   │   └── terms.ts                 # T&C in 5 languages
│   └── types/
│       └── razorpay.d.ts            # TS declarations
│
├── 🎨 assets/
│   ├── data/
│   │   └── categories.json          # Category/subcategory data
│   ├── icon.png                     # App icon (1024x1024)
│   ├── adaptive-icon.png            # Android adaptive
│   ├── splash-icon.png              # Splash screen
│   └── favicon.png                  # Web favicon
│
├── 🌍 locales/
│   ├── en.json                      # English translations
│   └── hi.json                      # Hindi translations
│
├── ☁️ server/                        # Backend (Node.js)
│   ├── index.js                     # Express + Razorpay
│   ├── package.json
│   └── .env                         # Razorpay keys (git-ignored)
│
├── app.json                         # Expo config
├── eas.json                         # EAS Build config
├── tsconfig.json                    # TypeScript config
├── .env                             # Local env (git-ignored)
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Development Setup

### Prerequisites

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **JDK 17** ([Adoptium Temurin](https://adoptium.net/))
- **Android SDK** (via Android Studio or Command Line Tools)
- **EAS CLI** — `npm install -g eas-cli`
- **Git**

### Clone Repository

```bash
git clone https://github.com/YOUR-USERNAME/karigar-sathi.git
cd karigar-sathi
```

### Install Dependencies

```bash
npm install --legacy-peer-deps
```

> **Note:** `.npmrc` file already has `legacy-peer-deps=true`, so npm install should just work.

### Environment Setup

Create `.env` file in project root:

```env
EXPO_PUBLIC_API_URL=https://your-backend.onrender.com
```

> **Important:** No trailing slash. Use `https://` — HTTP will not work.

### Run Development Build

```bash
# First time only (native build)
npx expo prebuild --clean
npx expo run:android

# Subsequent runs
npx expo start --dev-client
```

### Run on Expo Go (Limited)

```bash
npx expo start
```

> ⚠️ **Note:** Razorpay **will not work** in Expo Go — it's a native module. Use a development build for payment testing.

---

## 🔐 Environment Variables

### Mobile App (`.env`)

```env
# Backend API URL (Razorpay order creation + verification)
EXPO_PUBLIC_API_URL=https://your-backend.onrender.com
```

### Backend (`server/.env`)

```env
# Razorpay credentials (from dashboard)
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXXXXXXXX

# Server port
PORT=5000
```

### EAS Build (`eas.json`)

```json
{
  "build": {
    "development": {
      "env": {
        "EXPO_PUBLIC_API_URL": "https://your-backend.onrender.com"
      }
    }
  }
}
```

---

## ☁️ Backend Setup

### Quick Start (Local)

```bash
cd server
npm install
node index.js
```

Server runs at `http://localhost:5000`

### Endpoints

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| GET | `/health` | — | `{ status: 'ok' }` |
| POST | `/create-order` | `{ resumeId }` | `{ success, orderId, amount, currency, keyId }` |
| POST | `/verify-payment` | `{ ...rzpData, resumeId }` | `{ paid: true }` |
| POST | `/order-status` | `{ orderId, resumeId }` | `{ paid: boolean }` |

### Deploy to Render (Free)

1. Push `server/` folder to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect repo
4. Set:
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`
5. Add environment variables (Razorpay keys)
6. Deploy → Get URL like `https://karigar-sathi.onrender.com`

> **Cold start warning:** Render free tier sleeps after 15 min inactivity. First request takes ~30-50 seconds. Use `warmUpServer()` on preview screen.

---

## 📦 Building APK

### Development Build (for testing)

```bash
eas build --platform android --profile development
```

- Size: ~200 MB
- Includes dev tools
- Hot reload works

### Preview Build (lightweight testing)

```bash
eas build --platform android --profile preview
```

- Size: ~60 MB
- No dev tools
- For internal testing

### Production Build (for distribution)

```bash
eas build --platform android --profile production
```

- Size: ~40 MB
- Signed for distribution
- Ready for APKPure / direct download

> **Important:** To get an **APK** (not AAB), ensure `eas.json` has `"buildType": "apk"` under the profile you're using.

---

## 💳 Payment Flow

```
┌─────────────────────────────────────────────────────────┐
│                    USER APP                             │
│                                                         │
│  1. User taps "Pay ₹20"                                 │
│         ↓                                               │
│  2. App → Backend: POST /create-order { resumeId }      │
│         ↓                                               │
│  3. Backend → Razorpay API: Create order                │
│         ↓                                               │
│  4. Backend → App: { orderId, amount, keyId }           │
│         ↓                                               │
│  5. App opens Razorpay Checkout                         │
│         ↓                                               │
│  6. User pays via UPI/Card/NetBanking                   │
│         ↓                                               │
│  7. Razorpay → App: { payment_id, signature }           │
│         ↓                                               │
│  8. App → Backend: POST /verify-payment                 │
│         ↓                                               │
│  9. Backend verifies HMAC-SHA256 signature              │
│         ↓                                               │
│  10. Backend → App: { paid: true }                      │
│         ↓                                               │
│  11. App saves paid=true in draft                       │
│         ↓                                               │
│  12. User redirected to Download screen                 │
│         ↓                                               │
│  13. PDF generated without watermark ✅                 │
└─────────────────────────────────────────────────────────┘
```

### Payment Recovery

If the app crashes or user closes it mid-payment:

1. Order ID is saved in AsyncStorage (`pending_order:{resumeId}`)
2. On next open, `recoverPendingPayment()` calls `/order-status`
3. If Razorpay confirms payment, `paid=true` is set automatically

---

## 📥 Download

### Latest Release

**[Karigar Sathi v1.0.0 →](https://github.com/YOUR-USERNAME/karigar-sathi/releases/latest)**

### Installation

1. **Download APK** from the link above
2. On phone: **Settings → Security → Unknown Sources** → Enable
3. Open the downloaded APK file
4. Tap **Install**
5. Open the app and create your first resume!

### Requirements

- **Android:** 7.0 (Nougat) or higher
- **Storage:** 60 MB free space
- **Internet:** Only for payment (optional otherwise)

---

## 🗺️ Roadmap

### ✅ v1.0.0 — Current Release

- [x] 12 professions
- [x] Hindi + English UI
- [x] 8 color themes
- [x] PDF generation
- [x] Razorpay integration
- [x] WhatsApp share
- [x] Terms in 5 languages
- [x] Offline-first

### 🚧 v1.1.0 — Coming Soon

- [ ] 20+ professions (Beautician, Security, etc.)
- [ ] Resume templates (3+ designs)
- [ ] Tamil, Telugu, Marathi UI
- [ ] In-app PDF viewer

### 🔮 v1.2.0 — Future

- [ ] Save multiple resumes
- [ ] Cloud backup (optional)
- [ ] Referral system
- [ ] Google Play Store launch
- [ ] iOS version

---

## 🤝 Contributing

Contributions are welcome! If you'd like to help improve Karigar Sathi:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add some amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Guidelines

- Follow existing code style
- Add comments for complex logic
- Test on real device before submitting
- Update README if needed

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2026 Karigar Sathi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📞 Contact

<div align="center">

**Karigar Sathi**

📧 **Email:** [support@karigarsathi.com](mailto:support@karigarsathi.com)

🐛 **Bug Reports:** [GitHub Issues](https://github.com/YOUR-USERNAME/karigar-sathi/issues)

💬 **Discussions:** [GitHub Discussions](https://github.com/YOUR-USERNAME/karigar-sathi/discussions)

</div>

---

## 🙏 Acknowledgments

- **Expo Team** — for an amazing development platform
- **Razorpay** — for affordable payment integration
- **React Native Community** — for excellent libraries
- **Adoptium** — for open-source JDK
- **Indian Workers** — for inspiring this project

---

<div align="center">

### ⭐ If this project helped you, please give it a star!

**Made with ❤️ for the 50 crore Karigars of India**

[⬆ Back to Top](#-karigar-sathi)

</div>