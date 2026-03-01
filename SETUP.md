# Local Setup — 5 Minutes

Copy-paste these commands to get InnerLoop running on your machine.

---

## Step 1: Clone & Install

```bash
git clone https://github.com/InnerLoopChi/InnerLoop.git
cd InnerLoop
npm install
```

## Step 2: Firebase Setup

Go to [console.firebase.google.com](https://console.firebase.google.com/) and:

1. **Create a project** (any name, e.g. `innerloop-dev`)
2. **Register a web app** (click `</>` icon on project home)
3. **Enable Email/Password auth**: Authentication → Sign-in method → Email/Password → Enable
4. **Create Firestore database**: Firestore Database → Create → Start in test mode → Enable

## Step 3: Environment Variables

```bash
cp .env.example .env
```

Open `.env` and paste your Firebase config (from the web app registration screen):

```
VITE_FIREBASE_API_KEY=your-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## Step 4: Run

```bash
npm run dev
```

Open **http://localhost:5173** — done!

---

## Firestore Indexes

When you first use the feed or profile, you may see errors in the browser console about missing indexes. Each error includes a link — **just click the link** and Firebase will create the index for you. It takes about 2 minutes per index.

Alternatively, deploy all indexes at once:

```bash
npm install -g firebase-tools
firebase login
firebase use your-project-id
firebase deploy --only firestore:indexes
```

---

## Common Issues

| Problem | Solution |
|---|---|
| Blank page / white screen | Check `.env` has correct Firebase values. Open browser console for errors. |
| "Missing index" error | Click the link in the console error — Firebase auto-creates the index. |
| Auth errors on signup | Make sure Email/Password is enabled in Firebase Console → Authentication. |
| Posts don't load | Make sure Firestore is in test mode OR deploy `firestore.rules`. |
| Port 5173 in use | Run `npm run dev -- --port 3000` to use a different port. |

---

## Editing Tips

- **Hot reload** is on by default — save any file and the browser updates instantly
- All pages are in `src/pages/` — edit them directly
- Components are in `src/components/`
- Colors use Tailwind tokens: `loop-red`, `loop-purple`, `loop-gray`, `loop-green`, `loop-blue`
- To change the color palette, edit `tailwind.config.js`
- Firebase config is in `src/lib/firebase.js` (reads from `.env`)

---

## Build for Production

```bash
npm run build     # outputs to dist/
npm run preview   # preview the build locally
```
