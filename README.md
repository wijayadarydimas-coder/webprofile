# Wijaya Dary Dimas — Personal Digital Hub & Portfolio

> Modern, full-stack personal digital hub featuring an interactive Three.js 3D hero, deep engineering case studies, thesis research viewer with hybrid editor, grounded Google Gemini AI assistant, community discussion forum, and a dynamic admin CMS.

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-Dark_Matter_3D-black?style=flat-square&logo=three.js)](https://threejs.org/)
[![Database](https://img.shields.io/badge/PostgreSQL-Supabase-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![AI](https://img.shields.io/badge/AI_Assistant-Google_Gemini-4285F4?style=flat-square&logo=google)](https://aistudio.google.com/)
[![Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com/)

---

## ⚡ Highlights

- **Interactive 3D Dark Matter Experience**: Built with Three.js, featuring pointer-reactive geometry, floating cosmic particle atmosphere, and automatic low-power/reduced-motion fallbacks.
- **Engineering Case Studies (`/projects`)**: Structured case studies (Problem, Technical Approach, Results) with integrated badges for 37+ developer and AI platforms (GitHub, Hugging Face, Roboflow, Kaggle, etc.).
- **Thesis & Research Documentation (`/research`)**: Two-column layout with sticky desktop Table of Contents (TOC), scrollspy tracking, executive summary header, and PDF viewing.
- **Hybrid Research Editor (`/admin/research`)**: Split-screen Markdown editor with live preview, section management, pre-configured research templates, and a Gemini-powered AI writing assistant.
- **Grounded AI Assistant (`/api/ai/chat`)**: Virtual portfolio assistant powered by Google Gemini with multi-turn conversation memory and customizable personas.
- **Two-Way Community Discussions (`/community`)**: Threaded discussion board with visitor account registration, bcrypt password hashing, HttpOnly JWT cookies, and admin moderation.
- **Comprehensive Admin CMS (`/admin`)**: Complete management dashboard for profile identity, projects, research, work experience, formal education, media uploads (with automatic WebP compression), and system settings.
- **Adaptive Storage Fallback**: Runs out of the box with zero external setup using a local adaptive JSON store (`.data/db.json`), seamlessly upgrading to Supabase PostgreSQL when credentials are provided.

---

## 🛠️ Tech Stack

| Category | Technology | Details |
| :--- | :--- | :--- |
| **Framework** | Next.js 16.4+ | App Router, Server Components, Turbopack |
| **Language** | TypeScript 5.x | Strict type safety across frontend and API |
| **Styling** | Tailwind CSS v4 | Dark Matter design system, HSL color tokens |
| **3D Graphics** | Three.js | Custom procedural geometry & particle simulation |
| **Database** | PostgreSQL / Supabase | Relational data layer with local JSON store fallback |
| **Authentication** | Jose & Bcryptjs | HttpOnly JWT session cookies & salted password hashing |
| **AI Integration** | Google Gemini API | `gemini-1.5-flash` / `gemini-2.0-flash` with grounding |
| **Schema Validation**| Zod | Runtime validation for forms and API routes |
| **Icons** | Lucide React | Clean, lightweight UI icons |

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js**: v18.18 or higher (v20+ recommended)
- **Package Manager**: `npm` (included with Node.js)

### 2. Clone and Install

```bash
git clone https://github.com/wijayadarydimas-coder/webprofile.git
cd webprofile
npm install
```

### 3. Configure Environment Variables

Create your local environment file:

```bash
# On Linux / macOS
cp .env.example .env.local

# On Windows (PowerShell)
Copy-Item .env.example .env.local
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> [!NOTE]
> The application is immediately operational! Even without connecting Supabase or Gemini, it will use the built-in local store (`.data/db.json`) and graceful AI fallbacks.

---

## 🔑 Environment Variables

Configure the following variables in `.env.local`:

| Variable | Required | Default / Example | Purpose |
| :--- | :---: | :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | **Yes** | `http://localhost:3000` | Canonical URLs, sitemaps, and Open Graph previews. |
| `AUTH_SECRET` | **Yes** | `min-32-char-random-secret` | Cryptographic secret for signing JWT session cookies. |
| `ADMIN_EMAIL` | Optional | `admin@wijayadarydimas.dev` | Initial administrator login email for `/admin/login`. |
| `ADMIN_PASSWORD` | Optional | `SetYourStrongPasswordHere!` | Initial administrator login password. |
| `DATABASE_URL` | Optional | `postgresql://postgres:[pass]@[host]:6543/postgres` | Supabase PostgreSQL connection string (Transaction Pooler or Direct). |
| `AI_PROVIDER` | Optional | `gemini` | AI provider selector (`gemini` recommended). |
| `GEMINI_API_KEY` | Optional | `AIzaSy...` | Google Gemini API key from [Google AI Studio](https://aistudio.google.com/). |
| `GEMINI_MODEL` | Optional | `gemini-1.5-flash` | Gemini model identifier (`gemini-2.0-flash` also supported). |

---

## 🗄️ Database Setup (Supabase PostgreSQL)

To migrate from the local store to a cloud PostgreSQL database:

1. **Create a Supabase Project**: Go to [Supabase](https://supabase.com/) and create a new project.
2. **Copy Connection String**: In your Supabase dashboard, go to **Project Settings > Database > Connection string > URI** and paste it into `DATABASE_URL` in `.env.local`.
3. **Run Automatic Migrations**:
   ```bash
   node scripts/db-setup.mjs
   ```
   This executes all SQL migration files in `database/migrations/` sequentially (`001` through `008`).
4. **Seed Administrator Account**:
   ```bash
   node scripts/create-admin.mjs
   ```

---

## 🤖 Google Gemini AI Setup

1. Obtain a free API key from [Google AI Studio](https://aistudio.google.com/).
2. Add your key to `.env.local`:
   ```env
   AI_PROVIDER="gemini"
   GEMINI_API_KEY="AIzaSyYourActualApiKeyHere"
   GEMINI_MODEL="gemini-1.5-flash"
   ```
3. Restart your dev server (`npm run dev`).
4. Click the floating **Ask AI** button at the bottom-right corner of the website.
5. In `/admin/settings`, you can customize the assistant's persona (e.g. *Friendly & Casual*, *Academic & Researcher*) and custom system instructions.

---

## 🔐 Admin Panel Access

1. Navigate to `/admin/login` (or click **Admin Panel** in the footer).
2. Sign in with the credentials defined in `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
3. Available admin modules:
   - **Overview (`/admin`)**: Activity counters, quick management shortcuts, and visitor message inbox.
   - **Profile & Hero (`/admin/profile`)**: Update branding, headline, bio, About section highlight card selection, and social media/CV links.
   - **Projects (`/admin/projects`)**: Manage case studies, publish/feature toggles, and connect 37+ platform providers.
   - **Research & Thesis (`/admin/research`)**: Full thesis documentation CMS with the hybrid split-screen Markdown editor and AI assistant.
   - **Experience (`/admin/experience`)**: Manage professional career milestones and formal education.
   - **Media Library (`/admin/media`)**: Secure asset uploader with instant URL copying and format validation.
   - **Comments & Moderation (`/admin/comments`)**: Review, restore, hide, or delete community forum comments.
   - **AI & Settings (`/admin/settings`)**: Configure Gemini model, greeting message, persona presets, and security settings.

---

## 🚀 Deployment to Vercel

1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete portfolio application"
   git push origin main
   ```
2. Go to the [Vercel Dashboard](https://vercel.com/) and click **Add New Project**.
3. Import the `webprofile` repository.
4. Add the environment variables:
   - `NEXT_PUBLIC_SITE_URL` (e.g. `https://your-domain.vercel.app`)
   - `AUTH_SECRET`
   - `DATABASE_URL`
   - `ADMIN_EMAIL` & `ADMIN_PASSWORD`
   - `GEMINI_API_KEY`
5. Click **Deploy**.

---

## 📂 Project Structure

```text
webprofile/
├── .data/                      # Local adaptive store fallback (db.json)
├── database/
│   ├── migrations/             # Sequential SQL migration files (001 - 008)
│   └── README.md               # Database architecture and RLS security notes
├── public/                     # Static media assets and uploaded files
├── scripts/
│   ├── db-setup.mjs            # Automatic database migration runner
│   └── create-admin.mjs        # Database administrator account generator
├── src/
│   ├── app/                    # Next.js App Router (pages and API routes)
│   │   ├── admin/              # Admin CMS portal routes
│   │   ├── api/                # REST endpoints (auth, ai, comments, contact, upload)
│   │   ├── community/          # Community discussion board page
│   │   ├── contact/            # Contact and collaboration page
│   │   ├── projects/           # Portfolio showcase & case study detail [slug]
│   │   ├── research/           # Thesis research technical documentation viewer
│   │   └── page.tsx            # Main landing page (Hero, About, Timeline, etc.)
│   ├── components/             # Modular React components
│   │   ├── admin/              # Hybrid research editor & external link manager
│   │   ├── ai/                 # Floating AI chat assistant modal
│   │   ├── community/          # Comment composer, threaded replies, auth modal
│   │   ├── hero/               # Three.js 3D geometry & cosmic particle systems
│   │   ├── layout/             # Navbar, Footer, AppShell, and AdminSidebar
│   │   ├── projects/           # Project cards, category filters, search bar
│   │   └── ui/                 # Provider badges, icons, buttons
│   ├── lib/                    # Core backend and utility functions
│   │   ├── ai/                 # Gemini API integration & prompt engineering
│   │   ├── auth/               # JWT token management & session verification
│   │   ├── constants/          # 37-provider registry & site metadata
│   │   └── db/                 # Database abstraction layer (PostgreSQL + Local store)
│   └── types/                  # TypeScript interface definitions
├── .env.example                # Environment variable configuration template
└── README.md                   # Project documentation
```

---

## 📜 Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server with Turbopack. |
| `npm run build` | Validates TypeScript types and creates an optimized production bundle. |
| `npm run start` | Runs the production server after building. |
| `npm run lint` | Runs ESLint checks across the codebase. |

---

## 📄 License

&copy; 2026 **Wijaya Dary Dimas**. All rights reserved.  
Designed and engineered as a high-performance **Personal Digital Hub & Interactive Portfolio**.
