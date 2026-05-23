# PokerVision — Live GTO Screen Reader

A real-time poker assistant that reads your screen as you play online poker, parses the game state via OCR, and delivers GTO-optimal decisions instantly.

## How It Works

1. **Screen Capture** — Uses the browser's native Screen Capture API (`navigator.mediaDevices.getDisplayMedia`) to grab live frames from your poker client window. No browser extension. No injection. No reading game memory. Just pixels on your screen.
2. **OCR Parsing** — Tesseract.js runs in-browser on each frame to extract text from the poker table: hole cards, community cards, pot size, stack sizes, positions, and current action.
3. **GTO Engine** — The parsed game state is fed into a GTO solver that computes optimal action frequencies (fold / check / call / raise) and EV for the current decision point.
4. **Live Recommendation** — Decisions are surfaced in the dashboard with sub-second latency, side-by-side with the live capture preview.

The tool is strictly forward-looking: it only acts on what is currently visible on screen. Nothing is replayed from history at decision time.

## Stack

- **Next.js 14** (App Router) + React Server Components
- **Supabase** (auth + hand history persistence, isolated schema)
- **Tesseract.js** (in-browser OCR)
- **Framer Motion** (UI motion)
- **Tailwind CSS** + design tokens (oklch)
- **Vercel** (deploy target)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

Required variables:

- `NEXT_PUBLIC_SUPABASE_URL` — Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` — Service role key (server-side only)
- `SUPABASE_SCHEMA` — Isolated schema name for this project (e.g. `pokervision`)
- `NEXT_PUBLIC_SUPABASE_SCHEMA` — Mirror of `SUPABASE_SCHEMA` for browser clients

### 3. Run migrations

Apply the SQL migration in `supabase/migrations/001_hands_table.sql` against your Supabase project. The migration creates the `hands` table inside your isolated schema with appropriate RLS policies.

### 4. Enable Google OAuth (optional but recommended)

In the Supabase dashboard → **Authentication → Providers → Google**, enable Google sign-in and add your OAuth credentials. Google sign-in is wired into the login/signup screens by default.

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Using the Screen Reader

1. Sign in (Google or email/password).
2. From the **Dashboard**, click **Start Capture**.
3. Your browser will prompt you to select a screen, window, or tab — choose your poker client window for best results.
4. Once capture is active, the live preview, parsed game state, and GTO recommendation panels begin updating in real time.
5. Tune OCR sensitivity, frame rate, and poker site templates in **Settings → Capture Settings**.

### Supported Poker Sites

Preconfigured OCR region templates ship for:

- PokerStars
- GGPoker
- 888poker
- WPT Global
- Generic (fallback — manual region tuning required)

Select your site in **Settings → Poker Sites** to load the matching template.

## Browser Requirements

The Screen Capture API requires a modern Chromium-based browser (Chrome, Edge, Brave, Arc) or Firefox 100+. Safari support is partial. The site **must be served over HTTPS** (localhost is exempt) for `getDisplayMedia` to be available.

## Privacy & Fair Play

- All OCR runs **locally in your browser**. No screen frames leave your machine.
- Only the parsed, structured game state (cards, pot, action) is persisted to Supabase — and only when you have an active session and opt into history tracking.
- Using real-time assistance tools may violate the terms of service of your poker operator. This project is built for the hackathon as a technical demonstration of live screen parsing + GTO inference. **Use against play money or training tables only.**

## Project Structure

```
app/
  (auth)/        Login & signup
  auth/callback  OAuth handler
  settings/      Capture, sites, danger zone
  history/       Hand history table
  page.tsx       Live dashboard
components/
  dashboard/     ScreenCapture, GameStatePanel, GTORecommendation, ActionHistory
  layout/        Sidebar, TopBar
  settings/      Settings shell + forms
  history/       HandTable
  auth/          AuthCard + forms
  ui/            Skeleton, EmptyState
lib/
  ocr/           screen-reader, game-parser
  gto/           solver, hand-evaluator
  hooks/         use-screen-capture, use-game-state
  supabase/      client, server
  types/         game-state
supabase/
  migrations/    001_hands_table.sql
```

## Scripts

- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run start` — Run production build
- `npm run lint` — Lint codebase

## License

MIT — hackathon submission, use freely.
