# SkinSimple AI — First Prototype Implementation Plan

This plan turns the current mock-driven design build into a genuinely functional first prototype. It does not add new screens or change the UI — it replaces the fake logic behind existing screens with real logic, per the decisions below.

## Scope decisions (confirmed)

| Area | Decision |
|---|---|
| Auth & data persistence | Real backend — accounts and skin profiles are stored server-side, not just on-device |
| Product scanning | Real barcode scan via the phone camera; the barcode is looked up against a small seeded/mocked product dataset (not a live universal barcode database) |
| Compatibility scoring | Real AI call — an LLM evaluates the scanned product's ingredients against the user's skin profile and returns a score + reasons, not a hardcoded result |

## Assumptions carried into this plan (flag if wrong)

- **Backend provider: Supabase.** Reasoning: built-in email/password auth (directly replaces `MockAuthService`), a Postgres database for profiles/products, and Edge Functions to make the AI call server-side so no API key ships in the app. Swappable for Firebase or another provider if you'd rather — the plan's phases stay the same either way, only Phase 1/2's specific SDK calls change.
- **Alternatives ("Better matches for you") stays mocked in this pass.** You didn't ask to change it, and CLAUDE.md already documents that Recent Scans and Personalized Recommendations were deliberately removed — this plan does not reintroduce anything like that. Say the word if you want Alternatives wired to real data too.
- **Scan results are not saved to a history list.** Per CLAUDE.md, Recent Scans was intentionally removed; this plan keeps it removed. The backend will still have a `scans` table (see Phase 1) so a history feature is easy to add later, but no UI surfaces it in this pass.
- **AI provider: Claude (Anthropic API).** Called from a Supabase Edge Function, never from the client directly.

## What this plan does NOT touch

Navigation structure, screen layouts, styling/theme, the onboarding/quiz UI itself, and the iOS-only publish target are all unchanged. This is a swap of the logic layer (`src/services/*`, `src/context/*`), not a redesign.

---

## Phase 1 — Backend project setup

**Goal:** a running Supabase project with the schema this app needs, before any app code changes.

1. Create a Supabase project (supabase.com), note the project URL and anon key.
2. Design and create tables:
   - `profiles` — one row per user: `user_id` (FK to Supabase auth user), `skin_type`, `sensitive`, `concerns` (text array), `other_concern`, `budget`.
   - `products` — the mocked barcode dataset: `barcode` (unique), `name`, `brand`, `price`, `ingredients` (text array or text blob).
   - `scans` — one row per scan performed: `user_id`, `product_id`, `match_percent`, `match_label`, `reasons` (jsonb), `created_at`. (Populated for future use; not read by any screen yet, per the assumption above.)
3. Set Row Level Security (RLS) policies so a user can only read/write their own `profiles` and `scans` rows; `products` is publicly readable.
4. Seed `products` with ~10–15 real barcodes + made-up-but-plausible ingredient lists (enough to demo the scan flow meaningfully — e.g. a couple of "bad match" and a couple of "good match" products for a typical sensitive-skin profile).
5. Store an `ANTHROPIC_API_KEY` as a Supabase Edge Function secret (Phase 5 needs it; doing it now so it's not forgotten).

**New project dependencies:** `@supabase/supabase-js`, `react-native-url-polyfill`, `@react-native-async-storage/async-storage`, `react-native-get-random-values` (supabase-js requires these polyfills in a React Native runtime).

**Verification:** can query the seeded `products` table from the Supabase dashboard/SQL editor; RLS policies tested with the dashboard's policy simulator.

---

## Phase 2 — Real authentication

**Goal:** replace `MockAuthService` with a Supabase-backed implementation behind the exact same `AuthService` interface, so no screen code changes.

1. Add a `src/services/supabaseClient.ts` that creates the Supabase client (URL + anon key from env vars, using the AsyncStorage adapter for session persistence).
2. Add a `SupabaseAuthService implements AuthService` in `authService.ts` (or a new file) implementing `signUp`/`logIn`/`logOut` via `supabase.auth.signUp` / `signInWithPassword` / `signOut`, translating Supabase errors into the existing `AuthError` type so `SignupScreen`/`LoginScreen`'s error-hint logic keeps working unchanged.
3. Swap the exported `authService` singleton to the new class.
4. Update `AuthContext` to restore a persisted session on app start (Supabase session is auto-persisted via AsyncStorage; on mount, check `supabase.auth.getSession()` and populate `user` if one exists) instead of always starting logged-out. Add a brief loading state while this check happens, gating `RootNavigator`.

**Verification:** sign up on-device, force-quit the app, reopen — still logged in. Check the Supabase dashboard's Auth users table shows the new account.

---

## Phase 3 — Persisted skin profile

**Goal:** quiz answers survive app restarts and are tied to the real account, not just React state.

1. On successful login/signup (or session restore), fetch the user's `profiles` row (if any) and initialize `SkinProfileContext`'s state from it instead of the current hardcoded blank profile.
2. On each quiz-answer change (or on "Continue" at each step — simpler and fewer writes), upsert the `profiles` row for the current user.
3. Handle the "no profile yet" case (brand-new signup) the same way it works today — quiz shows nothing selected, `isTypeStepValid` etc. stay false until answered.

**Verification:** complete the quiz, force-quit, reopen, log back in — profile answers (and their Home/Profile summaries) are exactly as left.

---

## Phase 4 — Real barcode scanning

**Goal:** `ScanScreen`'s camera view actually reads a barcode instead of a static illustration + fake "Scan Product" tap.

1. Add `expo-camera` (SDK 54's `CameraView` includes built-in barcode scanning — no separate/deprecated barcode-scanner package needed).
2. Request camera permission on first visit to the Scan tab (`useCameraPermissions` hook), with a simple "camera access needed" fallback state if denied.
3. Replace the static viewfinder illustration in `ScanScreen` with a live `CameraView` configured for common barcode formats (EAN-13/UPC-A at minimum, since real products use those), using `onBarcodeScanned` to capture the value once and stop scanning (avoid double-fires).
4. On a successful scan, pass the barcode value forward instead of the current no-argument `scanService.scanProduct()` call.

**Verification:** point the camera at a real product barcode (any household item) and confirm the raw barcode value is captured correctly (can temporarily log/display it before Phase 5 wires up the lookup).

---

## Phase 5 — Mocked product lookup

**Goal:** a scanned barcode resolves to a product + ingredient list from the seeded `products` table.

1. Update `ScanService.scanProduct` to accept the scanned barcode and query Supabase's `products` table for a match.
2. Handle the "barcode not in our seeded set" case explicitly — a clear "Product not recognized yet" result screen state (this will happen often in a demo, since only ~10–15 real barcodes are seeded), rather than crashing or silently showing a wrong product.
3. On a match, the found product + its ingredients feed into Phase 6's scoring call.

**Verification:** scan one of the seeded barcodes — the product name/brand shown matches the seed data. Scan an unseeded product — the "not recognized" state shows instead of a wrong/blank result.

---

## Phase 6 — Real AI ingredient-compatibility scoring

**Goal:** the match percentage, label, and reasons come from an actual model call, driven by the real skin profile and real ingredient list — not `MOCK_SCAN_RESULT`.

1. Write a Supabase Edge Function (e.g. `analyze-ingredients`) that accepts `{ ingredients, skinProfile }`, calls the Claude API server-side with a prompt asking for a structured response (match percent 0–100, a short label, and 2–4 reasons each tagged positive/negative), and returns that as JSON. Keep the prompt/response contract matching the existing `ScanResult`/`ScanReason` types exactly so no screen changes are needed.
3. `ScanService.scanProduct` calls this Edge Function (passing the product's ingredients from Phase 5 and the current user's profile from Phase 3) instead of returning `MOCK_SCAN_RESULT`.
4. Add basic resilience: a timeout and a graceful fallback message on the Result screen if the AI call fails or returns malformed data (real network calls fail sometimes; the current mock never did).

**Verification:** scan the same seeded product with two different skin profiles (e.g. oily vs. dry, or sensitive vs. not) and confirm the match percent/reasons genuinely differ and make sense for each — this is the core "does the AI part actually work" check.

---

## Phase 7 — Async UX pass

**Goal:** every screen that's now doing real network calls (auth, profile save, scan lookup, AI scoring) shows appropriate loading/error states, since none of this was ever asynchronous-feeling before.

1. `SignupScreen`/`LoginScreen`: disable the submit button and show a loading indicator while the real network call is in flight (today's mock resolved instantly).
2. `ScanScreen`: loading state while the barcode lookup + AI call run (this could take a few seconds now, unlike the instant mock) — the existing "Scanning…" button label already anticipates this, just needs to actually cover the longer real duration.
3. `ResultScreen`: handle the "product not recognized" and "AI call failed" states from Phases 5–6 with clear messaging and a way back to Scan, rather than assuming a result always exists.
4. `HomeScreen`/quiz screens: brief loading state while the persisted profile loads in on login (Phase 3), so the UI doesn't flash "Not set" before real data arrives.

---

## Phase 8 — Manual verification checklist

There's no automated test suite in this repo (per CLAUDE.md), so verification is manual, on-device, covering:

- [ ] Sign up, force-quit, reopen → still logged in (Phase 2)
- [ ] Complete quiz, force-quit, reopen, log back in → same answers restored (Phase 3)
- [ ] Log out and log back into the same account → same profile, not reset (Phase 2+3)
- [ ] Scan a seeded barcode → correct product identified (Phase 5)
- [ ] Scan a non-seeded barcode → clear "not recognized" state, no crash (Phase 5)
- [ ] Same product, two different skin profiles → visibly different AI match results (Phase 6)
- [ ] Turn on Airplane Mode mid-scan → graceful error, not a silent hang or crash (Phase 6+7)
- [ ] `npm run typecheck` clean after every phase

---

## Suggested order of execution

Phases 1 → 2 → 3 → 4 → 5 → 6 → 7, each one leaving the app in a runnable, demoable state before starting the next (e.g. after Phase 2 you have real accounts but a still-fake scan flow; after Phase 5 you have a real scan flow but a fake compatibility score; etc.). Phase 8 isn't a separate build step — re-run relevant checklist items after each phase, not just at the end.
