# ACR
Stack: nextjs-supabase-vercel-stripe
Created: 2026-05-23

## Decisions
- **Design System**: Editorial dark UI with felt poker theme (#0a0f0a bg, #1a5f1a accents), oklch color tokens, Fraunces display serif + Inter body + JetBrains Mono code, gradient backgrounds, card shadows, refined spacing and typography hierarchy, animated gradient orbs, decorative poker chip elements
- **Screen Capture**: Browser Screen Capture API for live video stream with 2fps frame extraction, no native desktop recording
- **OCR Engine**: Tesseract.js browser OCR with region cropping and contrast preprocessing for card/amount/action extraction
- **GTO Solver**: Heuristic equity-based solver with preflop ranges and postflop decision frequencies, fast 7-card evaluator
- **Auth**: Supabase email/password + OAuth (Google) with SSR middleware protecting dashboard/settings/history, force-dynamic export on auth pages for createClient compatibility, polished poker-themed auth UI with felt-inspired gradients, refined card shadows, editorial typography, smooth hover/focus transitions
- **Database**: Supabase Postgres with **hardcoded 'acr' schema** across all client/server/middleware contexts (no env vars), hands table with RLS policies + auth.users foreign key (cascade delete), sortable/paginated hand history, **manual migration deployment via Dashboard SQL Editor** (bypasses CLI 403 errors), **default exports in client/server modules for Next.js compatibility**, **qualified table names 'acr.hands' in all queries**
- **Deployment**: Vercel Edge with static optimization disabled on auth routes
- **Type System**: Strict contract enforcement across OCR/parser/solver/UI layers with standardized GameState fields (betToCall, isHeroTurn, timestamp, rawText, hero.holeCards), GTODecision fields (action, raiseSize), OCRLine[] return type
- **Landing Layout**: Centered hero section with headline and live status indicator above asymmetric dashboard grid with polished poker aesthetics
- **Component Exports**: Default exports for all page components following Next.js conventions (HomePage, LoginPage, SignupPage, etc.)

## Components
- **Layout**: Root layout with Sidebar (poker-spade branding), TopBar (live status indicator)
- **Landing Page**: HomePage component (default export) with centered hero section, status indicator, and polished asymmetric dashboard grid (ScreenCapture + GameStatePanel + GTORecommendation + ActionHistory) featuring gradient backgrounds, card shadows, refined spacing
- **Live Capture**: ScreenCapture component with Screen Capture API video stream, useScreenCapture hook extracting frames, polished card UI with shadows and gradients
- **Game State**: useGameState hook orchestrating frame→OCR→parse→GTO pipeline with standardized GameState contract, **inserting hands to acr.hands via qualified table name**, GameStatePanel rendering cards/pot/players with editorial styling, gradient backgrounds, refined typography
- **OCR Pipeline**: screen-reader.ts (Tesseract) returning OCRLine[], game-parser.ts (card/amount/position extraction) producing standardized GameState, hand-evaluator.ts (equity/strength)
- **GTO Engine**: solver.ts with action frequencies + EV estimates using GameState.betToCall/isHeroTurn, GTORecommendation UI with primary action + frequency bars consuming GTODecision.action/raiseSize, polished card styling with shadows and professional layout
- **History**: **Server component querying acr.hands via qualified table name**, HandTable with sortable columns + pagination consuming entries prop, ActionHistory list consuming entries prop with professional card styling, shadows, color-coded EV indicators, refined typography and spacing, stats cards on history page
- **Settings**: Two-column SettingsNav layout, CaptureSettings (OCR confidence/fps/region), PokerSiteTemplates (6 pre-configured sites)
- **Auth**: AuthCard scaffold with felt-inspired gradient backgrounds, animated gradient orbs, decorative poker chip elements, refined card shadows; async server LoginForm/SignupForm with force-dynamic export and default exports, createClient imports, validation, smooth hover/focus transitions, emerald accent colors; OAuthButtons with Google logo, polished styling; AuthDivider; cohesive poker-themed visual language across all auth components
- **UI Primitives**: Skeleton, EmptyState
- **Types**: Comprehensive game-state types (Card, Player, GameState with betToCall/isHeroTurn/timestamp/rawText/hero.holeCards, GTODecision with action/raiseSize, OCRLine)
- **Infra**: **Default-exported createClient functions in client.ts/server.ts**, **Hardcoded 'acr' schema in all Supabase clients (client.ts/server.ts/middleware.ts)**, **Qualified 'acr.hands' table names in all .from() queries**, SSR middleware, OAuth callback, hands migration with qualified names + auth.users FK, favicon, **README migration instructions for manual SQL execution in Dashboard**
- **Type Safety**: All OCR→parser→solver→UI contracts aligned, no prop mismatches, standardized field access patterns across 10+ files, consistent default exports for page components
- **Visual Polish**: Editorial-grade dashboard components with gradient backgrounds, card shadows, refined spacing, professional typography hierarchy, color-coded indicators, felt-inspired accents, smooth animations; polished poker-themed auth pages with animated gradient orbs, decorative poker chip elements, cohesive emerald accent colors, refined hover/focus states