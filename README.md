# RainerTek EchoAI — Enterprise AI Voice Platform

<div align="center">
  <img src="public/logo.png" alt="RainerTek EchoAI Logo" width="120" />
  <h3>Real-Time AI Voice Assistant & Telephony Management Platform</h3>
  <p>Powered by Next.js 16, TypeScript, Tailwind CSS & Sarvam AI</p>
</div>

---

## 🌟 Overview

**RainerTek EchoAI** is a real-time enterprise AI voice assistant web platform. It connects directly with **Sarvam AI** for multilingual speech synthesis (Bulbul model) and speech-to-text recognition, providing interactive voice calls, knowledge context grounding, and call history tracking.

---

## 🚀 Key Features

- 🎙️ **Live Voice Assistant**: Real-time microphone listening via Web Speech API and spoken audio replies using Sarvam AI Text-to-Speech (with browser voice fallback).
- 🧠 **Dynamic Knowledge Context**: Easily configure prompt instructions, company guidelines, and FAQs that ground the assistant's spoken replies in real time.
- 📞 **Hotline & Telephony Display**: Configurable phone numbers, language accents (`en-IN`, `hi-IN`, `ta-IN`, `te-IN`, `kn-IN`), and persona selection (Meera, Pavithra, Arvind, Bulbul).
- 📜 **Call Session Ledger**: Real conversational session history with duration, timestamps, and full speaker turn transcripts.
- 🎨 **Modern White Theme UI**: Clean, light enterprise dashboard with transparent logo integration, responsive layout, and intuitive controls.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide Icons
- **Voice Engine**: Sarvam AI API (`/api/sarvam/tts` & `/api/sarvam/chat`)
- **State Management**: Reactive React Context with `localStorage` persistence

---

## ⚡ Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/mrbanoth/rainertek-echoai.git
cd rainertek-echoai
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Sarvam API key:
```env
# Get your API key from https://www.sarvam.ai/
SARVAM_API_KEY=your_sarvam_api_key_here

# Hotline Phone Number displayed to callers
NEXT_PUBLIC_HOTLINE_NUMBER=+91 80 4718 9000

# Default Voice Model & Language
NEXT_PUBLIC_DEFAULT_VOICE=meera
NEXT_PUBLIC_DEFAULT_LANG=en-IN
```

*(Note: You can also enter or update your Sarvam API Key directly in the UI under **Sarvam & Phone Setup**).*

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
├── public/
│   ├── logo.png               # Transparent logo
│   └── logo.jpg               # Original brand asset
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── sarvam/
│   │   │       ├── chat/      # Context-grounded conversation endpoint
│   │   │       └── tts/       # Sarvam AI Text-to-Speech integration
│   │   ├── calls/             # Call history & session transcripts
│   │   ├── knowledge/         # Knowledge context editor & presets
│   │   ├── settings/          # Sarvam API key, hotline & setup guide
│   │   ├── globals.css        # White/light theme styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Live Voice Assistant & web dialer
│   ├── components/
│   │   └── layout/
│   │       ├── AppLayout.tsx  # Application wrapper
│   │       ├── Header.tsx     # Top navigation
│   │       └── Sidebar.tsx    # Responsive navigation sidebar
│   ├── context/
│   │   └── AppContext.tsx     # Global state management
│   └── lib/
│       └── utils.ts           # Utility helpers
├── .env.example               # Environment variables template
└── README.md
```

---

## 📄 License

Proprietary — RainerTek Enterprise.
