# ACR
Stack: nextjs-supabase-vercel-stripe
Created: 2026-05-23

## Decisions
- **Design System**: Editorial dark UI with felt poker theme (#0a0f0a bg, #1a5f1a accents), oklch color tokens, Fraunces display serif + Inter body + JetBrains Mono code, gradient backgrounds, card shadows, refined spacing and typography hierarchy, animated gradient orbs, decorative poker chip elements
- **Screen Capture**: Browser Screen Capture API for live video stream with 2fps frame extraction, no native desktop recording
- **OCR Engine**: Tesseract.js browser OCR with region cropping and contrast preprocessing for card/amount/action extraction
- **GTO Solver**: Heuristic equity-based solver with preflop ranges and postflop decision frequencies, fast 7-card evaluator
- **Auth**: Dev-mode bypass with stubbed auth flows — no real authentication required, login/signup pages redirect immediately to dashboard for local development
- **Database**: Client-side localStorage for hand history persistence, no server-side database or Supabase queries
- **Deployment**: Vercel Edge with static optimization
- **Type System**: Strict contract enforcement across OCR/parser/solver/UI layers with standardized GameState fields (betToCall, isHeroTurn, timestamp, rawText, hero.holeCards), GTODecision fields (action, raiseSize), OCRLine[] return type
- **Landing Layout**: Centered hero section with headline and live status indicator above asymmetric dashboard grid with polished poker aesthetics
- **Component Exports**: Default exports for all page components following Next.js conventions (HomePage, HistoryPage, AuthCard, AuthDivider, etc.)

## Components
- **Layout**: Root layout with Sidebar (poker-spade branding only), TopBar (live status indicator)
- **Landing Page**: HomePage component (default export) with centered hero section, status indicator, and polished asymmetric dashboard grid (ScreenCapture + GameStatePanel + GTORecommendation + ActionHistory) featuring gradient backgrounds, card shadows, refined spacing
- **Auth Pages**: Polished /login and /signup pages with atmospheric gradient backgrounds, refined card styling, AuthCard/AuthDivider/LoginForm/SignupForm/OAuthButtons components, dev-mode bypass stubbing auth flows to redirect to dashboard
- **Live Capture**: ScreenCapture component with Screen Capture API video stream, useScreenCapture hook extracting frames, polished card UI with shadows and gradients
- **Game State**: useGameState hook orchestrating frame→OCR→parse→GTO pipeline with standardized GameState contract, storing hands to localStorage, GameStatePanel rendering cards/pot/players with editorial styling, gradient backgrounds, refined typography
- **OCR Pipeline**: screen-reader.ts (Tesseract) returning OCRLine[], game-parser.ts (card/amount/position extraction) producing standardized GameState, hand-evaluator.ts (equity/strength)
- **GTO Engine**: solver.ts with action frequencies + EV estimates using GameState.betToCall/isHeroTurn, GTORecommendation UI with primary action + frequency bars consuming GTODecision.action/raiseSize, polished card styling with shadows and professional layout
- **History**: Client component reading from localStorage, HandTable with sortable columns + pagination, ActionHistory list with professional card styling, shadows, color-coded EV indicators, refined typography and spacing, stats cards on history page
- **Settings**: Two-column SettingsNav layout, CaptureSettings (OCR confidence/fps/region), PokerSiteTemplates (6 pre-configured sites)
- **UI Primitives**: Skeleton, EmptyState
- **Types**: Comprehensive game-state types (Card, Player, GameState with betToCall/isHeroTurn/timestamp/rawText/hero.holeCards, GTODecision with action/raiseSize, OCRLine)
- **Infra**: localStorage persistence layer, favicon
- **Type Safety**: All OCR→parser→solver→UI contracts aligned, no prop mismatches, standardized field access patterns across 10+ files, consistent default exports for page components
- **Visual Polish**: Editorial-grade dashboard components with gradient backgrounds, card shadows, refined spacing, professional typography hierarchy, color-coded indicators, felt-inspired accents, smooth animations