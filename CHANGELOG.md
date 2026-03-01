# InnerLoop — CHANGELOG

## [0.2.0] — 2026-02-28 — Chunk 2: Auth System + Routing

### Overview
Added Firebase Authentication, React Router, auth pages (signup with role selection + login), and Firestore user document creation on signup.

### Files Created / Modified

| File | Action | Purpose |
|---|---|---|
| `src/contexts/AuthContext.jsx` | **Created** | Auth context provider — wraps app, tracks Firebase auth state, exposes `signup()`, `login()`, `logout()`, provides `user` (Firebase) + `profile` (Firestore doc) |
| `src/pages/SignUpPage.jsx` | **Created** | Two-step signup: Step 1 = Looper/Inner role selection cards, Step 2 = name/email/password form. Creates Firebase Auth user + Firestore `users` doc with full schema fields |
| `src/pages/LoginPage.jsx` | **Created** | Email/password login form with error handling for invalid credentials, too many attempts, etc. |
| `src/App.jsx` | **Rewritten** | Now wraps app in `BrowserRouter` + `AuthProvider`. Routes: `/` (landing), `/signup` (guest), `/login` (guest), `/feed` (protected). Includes `ProtectedRoute` + `GuestRoute` guards, temp `FeedPlaceholder` with profile stats |
| `src/pages/LandingPage.jsx` | **Modified** | CTA buttons now use `<Link to="/signup">` instead of anchor tags. Added `react-router-dom` Link import |
| `src/index.css` | **Modified** | Added `animate-fadeIn` keyframe for auth page transitions |

### Auth Flow
1. User lands on `/` → clicks "Join the Loop" or CTA buttons → navigates to `/signup`
2. Signup Step 1: Choose Looper or Inner role (visual cards)
3. Signup Step 2: Fill name, email, password → `createUserWithEmailAndPassword` + `setDoc` to Firestore
4. On success → redirect to `/feed` (placeholder shows profile stats)
5. Login at `/login` → `signInWithEmailAndPassword` → redirect to `/feed`
6. Auth state persists via `onAuthStateChanged` listener
7. Protected routes redirect to `/login` if not authenticated
8. Auth pages redirect to `/feed` if already logged in

### Firestore User Document (created on signup)
```js
{
  name, role, tags: [], isVerified: false, location: null,
  ageVerification: false, starRating: null, verifiedHours: 0,
  loopCredits: 0, createdAt: serverTimestamp()
}
```

---

## [0.1.0] — 2026-02-28 — Batch 1: Project Init + Landing Page

### Overview
Initialized the InnerLoop React project and built the full "Helping the Inner as a Looper" one-page landing site.

### Files Created

| File | Purpose |
|---|---|
| `package.json` | Project manifest — React 18, Vite 5, Tailwind 3, lucide-react icons, react-router-dom |
| `vite.config.js` | Vite dev server config with React plugin |
| `tailwind.config.js` | Tailwind theme extended with the **strict InnerLoop color palette** (`loop-red`, `loop-purple`, `loop-gray`, `loop-green`, `loop-blue`) and custom fonts (Inter, Outfit) |
| `postcss.config.js` | PostCSS wiring for Tailwind + Autoprefixer |
| `index.html` | Root HTML — loads Google Fonts (Inter + Outfit), sets base `<body>` classes |
| `src/main.jsx` | React entry point — mounts `<App />` into `#root` |
| `src/index.css` | Global styles — Tailwind directives, `.btn-primary`, `.btn-secondary`, `.section-padding` utility classes |
| `src/App.jsx` | App root component — currently renders `<LandingPage />` |
| `src/pages/LandingPage.jsx` | **Full landing page** with 8 sections (see below) |

### Landing Page Sections (`LandingPage.jsx`)

1. **Navbar** — Fixed top nav with logo, anchor links, mobile hamburger menu
2. **Hero** — "Helping the Inner as a Looper" headline, tagline, CTAs, mock feed card illustration, social proof strip
3. **Mission** — Three-pillar value props (Hyper-Local, Trust Built-In, Real Rewards)
4. **How It Works** — Side-by-side Looper vs. Inner explainer cards with feature lists
5. **Rewards** — Star Rating, Verified Hours, Loop Credits breakdown + **Waitlist 2× Multiplier** callout
6. **Privacy & Fairness** — Explains task-detail privacy for Loopers + Inner Loop private layer for Inners
7. **FAQ** — Accordion with 4 common questions
8. **Join CTA** — Dual sign-up buttons (Looper / Inner)
9. **Footer** — Logo, copyright, nav links

### Design Decisions
- All colors strictly use the `loop-*` Tailwind tokens — no raw hex in components
- Fonts: **Outfit** for display headings, **Inter** for body text
- Responsive: mobile-first grid layouts, collapsible nav
- Icons from `lucide-react` (tree-shakeable, lightweight)

### How It Connects to the Broader System
- `react-router-dom` is installed but not yet wired — will be used in Batch 2 for routing to Auth/Feed/Profile views
- The CTA buttons ("Sign Up as Looper" / "Register as Inner") are placeholder `<button>`s that will link to the auth flow
- The mock feed card in the hero previews the actual feed card component we'll build for the Local Feed view
