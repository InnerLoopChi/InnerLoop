# Hosting InnerLoop on GitHub Pages (Free)

## Overview
InnerLoop is hosted for free on GitHub Pages with automated deploys via GitHub Actions.
Every push to `main` triggers a build and deploy.

**Live URL**: `https://innerloopchi.github.io`

---

## One-Time Setup (5 minutes)

### Step 1: Add Firebase Secrets to GitHub

Your Firebase config must be stored as GitHub repository secrets so the build can access them.

1. Go to your repo: `https://github.com/InnerLoopChi/InnerLoop/settings/secrets/actions`
2. Click **"New repository secret"** for each of these:

| Secret Name | Value (from your Firebase config) |
|---|---|
| `VITE_FIREBASE_API_KEY` | Your API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | `your-project.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Your project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | `your-project.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Your sender ID |
| `VITE_FIREBASE_APP_ID` | Your app ID |

### Step 2: Enable GitHub Pages

1. Go to repo **Settings** → **Pages**
2. Under **Source**, select **"GitHub Actions"**
3. Save

### Step 3: Push to Deploy

```bash
git push origin main
```

GitHub Actions will automatically:
1. Install dependencies
2. Build with your Firebase secrets
3. Deploy to GitHub Pages

Check the **Actions** tab to monitor the deploy.

---

## After Deployment

### Seed Demo Data
1. Visit `https://innerloopchi.github.io/seed`
2. Click **"Run Seed"** to create demo accounts and posts
3. Go to `/login` and use the quick demo login buttons

### Demo Accounts
| Email | Password | Role |
|---|---|---|
| `looper@demo.com` | `demo1234` | Maria G. (Looper) |
| `looper2@demo.com` | `demo1234` | Darius W. (Looper) |
| `inner@demo.com` | `demo1234` | Pilsen Community Center (Verified Inner) |
| `inner2@demo.com` | `demo1234` | Logan Square Food Pantry (Verified Inner) |

---

## Custom Domain (Optional)

To use a custom domain like `innerloop.chicago`:

1. Go to repo **Settings** → **Pages** → **Custom domain**
2. Enter your domain
3. Add these DNS records at your registrar:
   - `A` record → `185.199.108.153`
   - `A` record → `185.199.109.153`
   - `A` record → `185.199.110.153`
   - `A` record → `185.199.111.153`
   - `CNAME` record for `www` → `innerloopchi.github.io`
4. Enable **"Enforce HTTPS"**

---

## Troubleshooting

| Issue | Fix |
|---|---|
| Build fails | Check Actions tab for error. Usually missing secrets. |
| Blank page after deploy | Verify all 6 Firebase secrets are set in repo settings. |
| Routes show 404 | The `404.html` SPA redirect should handle this. If not, check `public/404.html` exists. |
| Demo login fails | Visit `/seed` first to create demo accounts. |
| Firebase errors in console | Make sure Auth + Firestore are enabled in your Firebase project. |
