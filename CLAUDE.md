# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Product context

SkinSimple AI helps teenagers pick skincare products. Users set up a skin profile (skin type, sensitivity, concerns, budget), then scan a product (barcode / name / image) to get an AI-driven compatibility rating against their profile, with alternative product suggestions when a product is a poor match. Target users are teens with acne/sensitive skin, skincare newcomers, and anyone overwhelmed by ingredient lists or worried about wasting money on the wrong product. Planned (not yet built) expansions: skin progress tracking over time, and a "dupes" finder for cheaper alternatives to premium products. Open question from product: what scanning method (barcode vs. image vs. name search) and what ingredient-analysis accuracy is realistically achievable.

The UI was originally designed as a Claude Design prototype (`SkinSimpleAI Prototype (standalone).html` in the repo root — a self-contained bundler export, kept only as a visual reference, not part of the app). The current codebase is a from-scratch Expo/React Native port of that design, not a wrapper around the HTML.

**Publish target is iOS only.** The web build (`expo start --web` / pressing `w`) and Android are dev-time conveniences for quickly previewing UI changes — neither is a real ship target. Don't add Android- or web-specific features/polish unless asked; don't treat a web or Android quirk as a release blocker.

## Code quality rules

- **Build only what was asked.** No extra features, config options, toggles, or "while I'm in here" improvements. If you notice something else worth doing, say so in your reply — don't add it to the diff.
- **No speculative abstractions.** Don't add a new file, interface, or generic helper for a single call site "in case it's needed later." Three similar lines beat a premature abstraction.
- **A bug fix changes only what's needed to fix the bug.** No drive-by refactors, renames, or reformatting mixed into an unrelated change.
- **Match existing patterns instead of inventing new ones.** New services follow the `AuthService`/`ScanService` interface-plus-mock pattern; new screens compose `Screen`/`ScreenHeader`; new colors/spacing come from `theme.ts`, not inline values.
- **Delete dead code when you remove a feature.** If a component, context, type, or asset has no remaining importer after your change, delete it — don't leave it "just in case."
- **No comments that restate the code.** Only comment on non-obvious *why* (a workaround, a hidden constraint). If removing a comment wouldn't confuse a reader, remove it.
- **`npm run typecheck` must be clean after every change** — zero errors. This is the only automated gate in this repo, so it's non-negotiable.
- Before calling a change done, re-read your own diff once specifically looking for: unused imports, unused variables, and orphaned files.

## Commands

```bash
npm install              # install deps
npm start                # expo start (interactive: press i/a/w for simulator/emulator/web)
npm run ios              # expo start --ios
npm run android          # expo start --android
npm run web              # expo start --web
npm run typecheck        # tsc --noEmit — run this after any change, it's the only automated check in this repo
```

There is no test runner or lint script configured in this repo — don't assume `npm test`/`npm run lint` exist.

If dependency versions drift, use `npx expo install --fix` (not raw `npm install <pkg>@latest`) so native module versions stay matched to the installed Expo SDK.

### Verifying a change actually works

There's no simulator/device access in most sessions. The reliable way to confirm a change compiles (imports resolve, JSX/TS is valid, Metro can bundle it) without a device:

```bash
npm run typecheck
CI=1 npx expo start --port 8090 --clear > /tmp/expo.log 2>&1 &
# wait for "Waiting on http://localhost:8090" in /tmp/expo.log, then:
curl -s "http://localhost:8090/App.bundle?platform=ios&dev=true" -o /tmp/bundle.js -w "%{http_code} %{size_download}\n"
pkill -f "expo start"
```
HTTP 200 with a multi-MB bundle and no `Unable to resolve module` / `SyntaxError` in the response body means the app is sound end-to-end. This does not verify runtime/visual behavior, only that it builds.

## Architecture

**Stack:** Expo SDK 54 (React Native 0.81.5, React 19), TypeScript (strict), `styled-components/native` for styling, React Navigation (native-stack + bottom-tabs). No state management library — plain React Context.

### Navigation is the trickiest part of this codebase

`src/navigation/RootNavigator.tsx` is a single native-stack `Navigator` that conditionally renders **two different sets of `Stack.Screen`s** based on `useAuth().isAuthenticated` (the standard react-navigation "auth flow" pattern — not two separate navigators). The important subtlety: `QuizType`/`QuizConcerns`/`QuizBudget` are registered in **both** branches, because they're reused for two different flows:
- **Onboarding** (unauthenticated): Welcome → QuizType → QuizConcerns → QuizBudget → Signup, with no `returnTo` param.
- **Editing** (authenticated, from Home or Profile "Edit" links): pushed directly onto the stack on top of `MainTabs` with a `returnTo: 'HomeTab' | 'ProfileTab'` param. Continuing through the quiz (or tapping "Exit", which only renders when `returnTo` is set) navigates back into `MainTabs` at that tab instead of going to Signup.

`MainTabNavigator` hosts three bottom tabs; `ScanTab` and `ProfileTab` each wrap their own nested native-stack (`ScanStackNavigator`, `ProfileStackNavigator`) so Result/Alternatives and Privacy/Help keep the tab bar visible. Screens reach into a sibling tab's nested stack with the nested-params form, e.g. `navigation.navigate('ScanTab', { screen: 'Result', params: { result } })` — this relies on React Navigation's automatic bubbling to the parent navigator when a route name isn't found locally, which is why `navigation.navigate('MainTabs', { screen: 'HomeTab' })` works correctly even from a screen three navigators deep (e.g. `ScanScreen`).

Param list types live in `src/navigation/types.ts` (`RootStackParamList`, `MainTabParamList`, `ScanStackParamList`, `ProfileStackParamList`).

### Mock-backed service layer

`src/services/authService.ts` and `src/services/scanService.ts` define interfaces (`AuthService`, `ScanService`) with `Mock*` implementations exported as singletons (`authService`, `scanService`). Screens and contexts only ever import the interface-typed singleton, never the `Mock*` class directly — swapping in a real backend later means writing a new class that implements the same interface, no call-site changes. `MockAuthService` is a single in-memory "account" (signup overwrites it; login checks against it) — there is no multi-user support and it doesn't persist across app restarts.

### State layout

Four context providers, composed in `src/context/AppProviders.tsx` (order matters only in that `SkinProfileProvider` and `SettingsProvider` don't depend on `AuthContext`, but are nested inside it anyway):
- `AuthContext` — current user / isAuthenticated, drives `RootNavigator`'s branch choice.
- `SkinProfileContext` — the quiz answers (skin type, sensitivity, concerns, budget) plus derived validity flags (`isTypeStepValid` etc.) and summary strings used on Home/Profile.
- `SettingsContext` — account-level toggles (currently just `notificationsOn`).

There used to be a `ScanHistoryContext` (Recent Scans on Home) and a `personalizedOn` setting; both were deliberately removed — don't reintroduce a "recent scans" list or a "personalized recommendations" toggle without being asked, and don't be surprised if old conversation/design references mention them.

### Theming

`src/theme/theme.ts` exports a single `theme` object (colors/fonts/fontSize/radius/spacing) passed to styled-components' `ThemeProvider` in `App.tsx`. `src/theme/styled.d.ts` augments `styled-components/native`'s `DefaultTheme` with this shape via module augmentation — every `styled.View`/`styled.Text` template gets a typed `theme` prop from this alone. **Do not add `@types/styled-components` or `@types/styled-components-react-native` as a dependency** — styled-components v6 ships its own types, and the legacy DefinitelyTyped packages silently shadow the `styled.d.ts` augmentation, making every themed style prop implicitly `any` under `strict` mode (this happened once already; removing the package fixed it instantly).

Fonts (DM Sans, Manrope) are loaded via `@expo-google-fonts/*` in `App.tsx` with `useFonts`; the app renders nothing until they resolve. DM Sans only ships 400/500/700 weights (no 600) — `theme.fonts.bodySemibold` maps to `DMSans_700Bold` for that reason, not a typo.

### Known environment gotchas (learned the hard way in this project)

- `babel-preset-expo` must be an explicit `devDependency` — it's not reliably pulled in transitively, and its absence fails Metro's transform step with a confusing `Cannot find module` error that looks unrelated to Babel config.
- Expo Go's public App Store/Play Store build is currently pinned to **SDK 54** (Expo changed distribution models in May 2026; newer SDKs need `eas go` custom builds with a paid Apple dev account, or simulator-only CLI installs). Do not upgrade the `expo` package past the SDK that Expo Go's store build actually supports without checking first — SDK 57 was tried and is unusable with a normal phone install as of this writing.
- If `npx expo start` can't reach a phone over local Wi-Fi ("could not connect to server"), use `npx expo start --tunnel` (requires `@expo/ngrok`, already a devDependency here) rather than debugging the router/firewall.

### Assets

`assets/images/` contains real photos (hero image, profile banner) extracted directly from the original design prototype's embedded asset bundle, not placeholders — reuse them via `src/data/mockProducts.ts`'s exports (`heroImage`, `profileBanner`) rather than re-deriving from the HTML prototype file.
