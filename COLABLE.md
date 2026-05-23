# ACR
Stack: nextjs-supabase-vercel-stripe
Created: 2026-05-23

## Decisions
- **Design System**: Editorial dark UI with felt poker theme (#0a0f0a bg, #1a5f1a accents), oklch color tokens, Fraunces display serif + Inter body + JetBrains Mono code
- **Screen Capture**: Browser Screen Capture API for live video stream with 2fps frame extraction, no native desktop recording
- **OCR Engine**: Tesseract.js browser OCR with region cropping and contrast preprocessing for card/amount/action extraction
- **GTO Solver**: Heuristic equity-based solver with preflop ranges and postflop decision frequencies, fast 7-card evaluator
- **Auth**: Supabase email/password + OAuth (Google) with SSR middleware protecting dashboard/settings/history
- **Database**: Supabase Postgres with schema isolation, hands table with RLS, sortable/paginated hand history
- **Deployment**: Vercel Edge with SUPABASE_SHARED_SCHEMA env var for multi-tenant isolation
- **Type System**: Strict contract enforcement across OCR/parser/solver/UI layers with standardized GameState fields (betToCall, isHeroTurn, timestamp, rawText, hero.holeCards), GTODecision fields (action, raiseSize), OCRLine[] return type

## Components
- **Layout**: Root layout with Sidebar (poker-spade branding), TopBar (live status indicator), dashboard grid (asymmetric ScreenCapture + GameStatePanel + GTORecommendation + ActionHistory)
- **Live Capture**: ScreenCapture component with Screen Capture API video stream, useScreenCapture hook extracting frames
- **Game State**: useGameState hook orchestrating frame→OCR→parse→GTO pipeline with standardized GameState contract, GameStatePanel rendering cards/pot/players
- **OCR Pipeline**: screen-reader.ts (Tesseract) returning OCRLine[], game-parser.ts (card/amount/position extraction) producing standardized GameState, hand-evaluator.ts (equity/strength)
- **GTO Engine**: solver.ts with action frequencies + EV estimates using GameState.betToCall/isHeroTurn, GTORecommendation UI with primary action + frequency bars consuming GTODecision.action/raiseSize
- **History**: HandTable with sortable columns + pagination consuming entries prop, ActionHistory list consuming entries prop, stats cards on history page
- **Settings**: Two-column SettingsNav layout, CaptureSettings (OCR confidence/fps/region), PokerSiteTemplates (6 pre-configured sites)
- **Auth**: AuthCard scaffold, LoginForm/SignupForm with validation, OAuthButtons (Google logo), AuthDivider
- **UI Primitives**: Skeleton, EmptyState
- **Types**: Comprehensive game-state types (Card, Player, GameState with betToCall/isHeroTurn/timestamp/rawText/hero.holeCards, GTODecision with action/raiseSize, OCRLine)
- **Infra**: Supabase client/server helpers, SSR middleware, OAuth callback, hands migration, favicon
- **Type Safety**: All OCR→parser→solver→UI contracts aligned, no prop mismatches, standardized field access patterns across 10+ files