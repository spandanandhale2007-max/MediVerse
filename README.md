# MediVerse

A unified hospitalisation-services platform: one place for hospital and doctor
search, live bed availability, appointment booking, personal health records,
medication and vaccination reminders, emergency help and government health
schemes — instead of the dozen disconnected sites and apps an Indian patient
normally has to juggle.

Runs as a responsive web app, installs as a PWA, and ships as an Android APK
built from the same codebase.

**Author:** Spandan Vithoba Andhale — MIT ADT University, Loni Kalbhor, Pune
**Status:** Academic project. Copyright in the source subsists with the author
(Copyright Act 1957, s.17); see `MediVerse-Copyright-Declaration.pdf`.

---

## Quick start

Requires Node.js 18 or newer.

```bash
npm install
npm run dev          # http://localhost:5173
```

That is enough to browse the whole app. No backend, no API keys, no Supabase
project needed — sign-in falls back to an on-screen code (see *Sign-in* below).

```bash
npm run build        # production bundle into dist/
npm run build:demo   # presentation build: sign-in code shown on screen
npm run preview      # serve the built bundle
npm run lint         # oxlint
```

### No Node? Two offline alternatives

| Path | Command | What it shows |
| --- | --- | --- |
| `jury-demo/` | `node run.js` | The app's real core logic (auth, OTP, appointments, beds, triage) in a terminal. Zero dependencies, zero network. |
| `cpp/` | `g++ -std=c++17 main.cpp -o mediverse` | A standalone C++ re-implementation of the same booking, bed and auth logic. |

---

## Sign-in and roles

Three roles, each with its own view:

| Role | How you get in | Lands on |
| --- | --- | --- |
| **Patient** | Email one-time code. With no mail provider configured the 6-digit code is printed on screen. | `/` |
| **Doctor / Ward** | Username + password (`src/lib/auth.js`) | `/ward` |
| **Admin** | Work email + password, stored as a SHA-256 hash | `/admin` |

> **Honest limitation.** This is a front-end-only build, so the role check runs
> in the browser and is **not real authentication** — anyone can bypass it by
> setting one `localStorage` key. This is documented in the code itself at the
> top of `src/lib/auth.js`. Closing it needs a server that verifies credentials;
> `supabase/schema.sql` contains the Postgres schema and Row Level Security
> policies written as the intended replacement.

---

## Screens

16 routes across the three roles.

**Patient** — Home, Appointments, Doctors, Bed Availability, Medications,
Vaccinations, Campaigns, Specialists, Real Hospitals, Emergency, My Reports,
Profile, Support
**Ward staff** — Ward Dashboard (occupancy, today's appointment queue)
**Admin** — Overview, Hospital directory, Doctors, Support reports, Activity,
Settings

Plus a built-in assistant (`src/components/ChatAssistant.jsx`) that reads a
stated concern and routes to the right screen, handling emergencies first.

---

## Tech stack

| Layer | Choice |
| --- | --- |
| UI | React 19, React Router 7 |
| Build | Vite 8 |
| Styling | Tailwind CSS 4 |
| Data / auth | Supabase (PostgreSQL + Row Level Security) |
| Mobile | Capacitor 8 → Android APK |
| Hosting | Netlify (`netlify.toml`, SPA redirect) |
| Lint | oxlint |

Roughly 17,000 lines of original source across 90 files (`src/`, `cpp/`,
`jury-demo/`, `supabase/`).

---

## Repository layout

```
src/                 React application
  pages/             one file per route
  components/        shared UI, admin console, illustrations
  context/           auth, admin and appointments providers
  hooks/             bed availability, medications, health profile, PWA install
  data/              hospital directory, vaccination schedule, gov schemes
  lib/               auth, OTP, reports, Supabase client, service worker
supabase/            schema.sql (tables + RLS policies), seed.sql
cpp/                 standalone C++ implementation of the core logic
jury-demo/           zero-dependency Node CLI walkthrough of the core logic
android/             Capacitor Android project
public/              PWA manifest, icons, service worker, mediverse.apk
assets/              app icon and splash sources
Poster maps Mediverse/   UML and architecture poster artwork
```

---

## Configuration (optional)

Only needed to point the app at a real Supabase project:

```bash
cp .env.example .env.local   # then fill in the values
```

`.env.example` documents every variable. Two things worth repeating:

- Vite inlines every `VITE_*` variable into the client bundle, so nothing there
  is secret. Keeping values out of git is all it buys.
- The Supabase **publishable** key is public by design; RLS decides what it can
  read. A `sb_secret_...` key bypasses RLS entirely and must never go in these
  files.

No `.env` file is committed. `.env.example` holds placeholders only.

---

## Project documentation

The submitted write-ups live in the repository root:

| File | Contents |
| --- | --- |
| `MediVerse-Complete-Project-Report.pdf` | Full project report |
| `MediVerse-Final-Project-Report.pdf` | Final report, guideline format |
| `MediVerse-SRS.pdf` | Software requirements specification |
| `MediVerse-Research-Paper.pdf` | Research paper |
| `MediVerse-Case-Study.pdf` / `.pptx` | Case study and presentation |
| `MediVerse-UML-Posters.pdf` | UML diagrams and architecture posters |
| `MediVerse-Explained.pdf` | Plain-language walkthrough |
| `MediVerse-Synopsis.docx` / `MediVerse-Final-Synopsis.docx` | Synopsis |
| `MediVerse-SourceCode-Copyright-*.pdf` | Source listing for copyright filing |
| `MediVerse-Copyright-Declaration.pdf` | Declaration of authorship |

---

## Android build

```bash
npm run build
npx cap sync android
npx cap open android      # then Build > Build APK in Android Studio
```

A pre-built APK is at `public/mediverse.apk`, also offered as an install
prompt from the running web app.
