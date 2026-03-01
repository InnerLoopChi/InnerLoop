# InnerLoop

**Helping the Inner as a Looper** — A hyper-local, interactive feed connecting Chicago's neighborhood ecosystem.

InnerLoop bridges the gap between everyday people (**Loopers**) and trusted local organizations (**Inners**) so neighborhoods thrive — one task, one hour, one connection at a time.

---

## Quick Start (Run Locally)

### Prerequisites

- **Node.js** 18+ — [Download](https://nodejs.org/)
- **npm** (comes with Node)
- A **Firebase project** (free tier works fine) — [Create one](https://console.firebase.google.com/)

### 1. Clone the repo

```bash
git clone https://github.com/InnerLoopChi/InnerLoop.git
cd InnerLoop
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Firebase

You need a Firebase project with **Authentication** and **Cloud Firestore** enabled.

#### a) Create a Firebase project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Add project** → name it (e.g. `innerloop-dev`) → create
3. In the project dashboard, click **Web** (</>) to register a web app
4. Copy the config values it shows you

#### b) Enable Authentication
1. In Firebase Console → **Build** → **Authentication** → **Get started**
2. Click **Email/Password** → **Enable** → **Save**

#### c) Enable Firestore
1. In Firebase Console → **Build** → **Firestore Database** → **Create database**
2. Choose **Start in test mode** (we'll deploy proper rules later)
3. Pick a region close to you → **Enable**

#### d) Create Firestore indexes
The app uses compound queries that require indexes. Either:
- **Option A**: Just run the app — Firebase will show index-creation links in the browser console when queries fail. Click each link to auto-create.
- **Option B**: Install Firebase CLI and deploy indexes:
  ```bash
  npm install -g firebase-tools
  firebase login
  firebase use --add  # select your project
  firebase deploy --only firestore:indexes
  ```

### 4. Create your `.env` file

Copy the example and fill in your Firebase config values:

```bash
cp .env.example .env
```

Edit `.env` with your values from step 3a:

```env
VITE_FIREBASE_API_KEY=AIzaSy...your-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 5. Run the dev server

```bash
npm run dev
```

The app will open at **http://localhost:5173**

That's it! You can now:
- Visit the landing page at `/`
- Sign up as a Looper or Inner at `/signup`
- Browse the feed at `/feed`
- View your profile at `/profile`

---

## Development Workflow

### Available Commands

| Command | What it does |
|---|---|
| `npm run dev` | Start Vite dev server with hot reload |
| `npm run build` | Build production bundle to `dist/` |
| `npm run preview` | Preview production build locally |

### Hot Reload

Vite provides instant hot module replacement. Just edit any file in `src/` and the browser updates immediately — no manual refresh needed.

### File Structure

```
InnerLoop/
├── index.html                  # Root HTML (loads fonts, mounts React)
├── package.json                # Dependencies & scripts
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind with InnerLoop color palette
├── postcss.config.js           # PostCSS for Tailwind
├── firebase.json               # Firebase CLI config (hosting + Firestore)
├── firestore.rules             # Firestore security rules
├── firestore.indexes.json      # Firestore compound query indexes
├── .env.example                # Template for Firebase env vars
├── ARCHITECTURE.md             # Firestore schema documentation
├── CHANGELOG.md                # Detailed change log by chunk
│
├── src/
│   ├── main.jsx                # React entry point
│   ├── App.jsx                 # Router + AuthProvider + route definitions
│   ├── index.css               # Tailwind directives + custom animations
│   │
│   ├── lib/
│   │   └── firebase.js         # Firebase init (Auth + Firestore)
│   │
│   ├── contexts/
│   │   └── AuthContext.jsx     # Auth state, signup/login/logout, Firestore profile
│   │
│   ├── pages/
│   │   ├── LandingPage.jsx     # "Helping the Inner as a Looper" landing site
│   │   ├── SignUpPage.jsx      # 2-step signup (role select → form)
│   │   ├── LoginPage.jsx       # Email/password login
│   │   ├── FeedPage.jsx        # Real-time local feed + Inner Loop toggle
│   │   └── ProfilePage.jsx     # Loop Wallet + reviews + editable tags
│   │
│   └── components/
│       ├── PostCard.jsx        # Feed post card (task capacity, waitlist, join)
│       ├── CreatePost.jsx      # New post modal (tags, task toggle, Inner-only)
│       └── ReviewModal.jsx     # Leave review (star rating, hours, 2x multiplier)
│
└── demo.jsx                    # Self-contained demo artifact (all views)
```

---

## Color Palette

All colors are tokenized as `loop-*` in Tailwind:

| Token | Hex | Usage |
|---|---|---|
| `loop-red` | `#f18989` | Warmth, Looper accent, CTAs |
| `loop-purple` | `#8B6897` | Trust, Inner accent, links |
| `loop-gray` | `#e8e6e6` | Backgrounds, neutrals |
| `loop-green` | `#0a3200` | Text, high contrast, primary buttons |
| `loop-blue` | `#aFD2E9` | Accents, highlights, tag backgrounds |

---

## Key Concepts

### Looper (Personal Account)
An everyday person who can give and ask for help. Browses tasks, earns verified hours and Loop Credits, builds a Star Rating.

### Inner (Business/Org Account)
A verified organization that posts structured tasks, manages capacity, verifies hours, and accesses the private Inner Loop feed.

### Waitlist & 2× Multiplier
When a task is full, Loopers can join a waitlist. If a spot opens and they complete the task, their verified hours and Loop Credits are **doubled**.

### Privacy
Loopers can never see full job details of tasks assigned to other Loopers. The Inner Loop is a private layer hidden from the public feed.

---

## Deployment

### Firebase Hosting (recommended)

```bash
npm install -g firebase-tools
firebase login
firebase use --add          # select your project
npm run build               # build production bundle
firebase deploy             # deploys hosting + Firestore rules + indexes
```

### Other Platforms

The `dist/` folder after `npm run build` is a static site. Deploy it anywhere:
- **Vercel**: `npx vercel --prod`
- **Netlify**: Drag `dist/` to Netlify dashboard
- **GitHub Pages**: Use `gh-pages` package

> **Note**: For SPA routing to work, configure your host to redirect all paths to `index.html` (already configured in `firebase.json`).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite 5 |
| Styling | Tailwind CSS 3 (custom `loop-*` palette) |
| Icons | lucide-react |
| Routing | react-router-dom 6 |
| Auth | Firebase Authentication (email/password) |
| Database | Cloud Firestore (real-time) |
| Fonts | Outfit (display) + DM Sans (body) via Google Fonts |

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes (keep chunks small — max 3 files at a time)
4. Build check: `npm run build`
5. Commit and push
6. Open a PR to `main`

---

## License

MIT — Built for Chicago neighborhoods.
