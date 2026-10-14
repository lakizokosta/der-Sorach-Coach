# Der SprachCoach — Android

A native Android app (Kotlin, Jetpack Compose) built from the website
specification in [`specification/`](../../../specification/README.md). It uses
the same question bank and the same backend as the website.

| Screen | Spec | What it does |
|---|---|---|
| Landing | [01-landing](../../../specification/pages/01-landing.md) | Hero, DE · RU · EN switcher, account chip, XP/streak summary and daily goal, A1–B2 level picker, Einstufungstest, Premium training hub (locked preview for free users), activity calendar, Schwächen card, legal links |
| Trainer | [02-trainer](../../../specification/pages/02-trainer.md) | Level, topic, Wortschatz, Schwächen and placement sessions; all five question types; adaptive queue; XP (±1, Premium ±2); daily goal, streak (Premium freezes), bonus tiers; free 10-minute countdown, Premium count-up, no timer for Basis; Grammatik-Tipp and dictionary for Premium; result screen with wrong-topic training and placement result |
| Account | [03-premium](../../../specification/pages/03-premium.md) (activation part) | Status, e-mail login link, activation code, sign-out |
| Profile | [04-profile](../../../specification/pages/04-profile.md) | Mini profile for Free/Basis; full profile for Premium (freezes, medals, placement result, topic mastery) |
| Legal | [05-legal](../../../specification/pages/05-legal.md) | AGB, Datenschutz, Impressum from `docs/extra.md` |

## Premium in the app

The app **sells nothing** (no prices, no checkout links), which keeps it within
Google Play's payments policy. Premium bought on the website is unlocked in the
app in one of two ways:

1. **E-mail login.** The user enters the e-mail they bought with. The backend
   (`requestMagicLink`) e-mails a link `https://lernziel-deutsch.de/?mltoken=…`.
   The user pastes the link on the account screen, or opens it with the app (see
   below). The login works on up to 2 devices per e-mail and also syncs XP,
   streak and daily goal with the website (`loadProgressByEmail` /
   `saveProgressByEmail`, merged like `src/site/utils/progressMerge.js`).
2. **Activation code.** Only works for a code that hasn't been activated yet:
   the backend binds a code to the first device that uses it
   (`validateCode`). Codes already used on the website need option 1.

Entitlements are checked again on every app start (`refreshMagicSession` and/or
`validateCode`). When the server can't be reached, the last known status stays
valid until its expiry date.

The backend URL comes from `SCRIPT_URL` in `src/site/data/payment.js` (exported
to `assets/config.json`), so the app always talks to the same Apps Script as
the website.

### Opening login links directly in the app

The manifest declares an auto-verified App Link for
`https://lernziel-deutsch.de/` (and `www.`). It only takes effect once the site
serves `https://lernziel-deutsch.de/.well-known/assetlinks.json` with the
**release** signing certificate's SHA-256 fingerprint:

```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "de.lernziel.sprachcoach",
    "sha256_cert_fingerprints": ["<SHA-256 of the release key>"]
  }
}]
```

The file can go in `public/.well-known/assetlinks.json` of the website. Until
it's published, tapping the link opens the browser and signs the user in on the
website instead (the token works only once). That's why the account screen
explains how to copy and paste the link. Note that a verified link for `/` sends
**every** `https://lernziel-deutsch.de/` link to the app if it's installed.

## Build

Requirements: JDK 17+, Android SDK with platform 37, and **Node.js**. The build
runs `scripts/export-android-assets.mjs`, which exports from `src/site`, with the
website's own code:

- the grammar and vocabulary banks;
- the topic catalogue and grammar hints;
- a precomputed dictionary;
- the legal texts;
- the backend URL.

The generated assets are not committed.

```bash
cd src/app/android
./gradlew :app:assembleDebug        # APK → app/build/outputs/apk/debug/
./gradlew :app:installDebug         # install on a running emulator/device
./gradlew :app:testDebugUnitTest    # unit tests
./gradlew :app:assembleRelease      # minified, unsigned; sign with your release key
```

Or open `src/app/android` in Android Studio.

### Trying Premium screens in a debug build

Debug builds (only) accept a tier override, so the Premium UI can be checked
without a real code:

```bash
adb shell am force-stop de.lernziel.sprachcoach
adb shell run-as de.lernziel.sprachcoach cat shared_prefs/account.xml \
  | sed 's#</map>#<string name="debug_tier">PREMIUM</string></map>#' > /tmp/account.xml
adb shell "run-as de.lernziel.sprachcoach sh -c 'cat > shared_prefs/account.xml'" < /tmp/account.xml
# then start the app again
```

Use `BASIS` or `FREE` for the other tiers; remove the entry to go back to the
real status. Release builds ignore it.

## Layout

```
app/src/main/java/de/lernziel/sprachcoach/
├── MainActivity.kt             # navigation; receives login links
├── SprachCoachApplication.kt   # app-wide repository, progress, account; entitlement check on start
├── account/
│   ├── Backend.kt              # Apps Script client (GET query / POST text-plain JSON, one retry)
│   └── AccountStore.kt         # tier, magic-link login, codes, progress sync
├── data/
│   ├── Question.kt             # question model + hub catalogue + dictionary entry
│   ├── QuestionRepository.kt   # reads the exported assets
│   └── ProgressStore.kt        # XP, topics, goal, streak, bonus tiers, CEFR level, free minutes; merge rules
├── trainer/
│   ├── Session.kt              # session modes; placement order and evaluation
│   ├── AdaptiveQueue.kt        # port of src/site/utils/queue.js
│   ├── TrainerViewModel.kt     # session rules (spec 02-trainer §4, §8)
│   ├── TrainerScreen.kt        # question, result, empty and locked screens
│   ├── GrammarTip.kt           # 📚 Grammatik-Tipp (RU/DE/EN)
│   └── widgets/                # MultipleChoice, MultiSelect, FillBlank, DragDrop, TextGaps, Dictionary
└── ui/                         # theme, landing, hub, dashboard cards, account, profile, legal, locale switcher
```

## Differences from the website

- No purchase flow, upsell hints or conversion sheets (see above).
- Wrong-topic training and the placement test's "▶ X trainieren" work for every
  Premium session; `returnTo` doesn't exist because navigation uses the back stack.
- Questions always come from the bundled bank (the website fetches Premium
  sessions from `/api/questions`; both are exported from `src/site/questions`).
- The timer only runs while the trainer is on screen.
- The result "+XP" chip shows net XP for the session (the web shows correct × rate).
- Not built: share card, nickname, bonus missions card, daily-goal detail
  modal, contact form, preposition picture hints.
