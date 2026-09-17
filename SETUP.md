# Find It — Setup & Deployment Guide

This is your app for remembering where you hid things.

- Account with **email + password**, and **"forgot password"** recovery by email
- Home page with two options: **Add an item location** and **Find an item location**
- Language switch **EN / ΕΛ** in the top-right corner
- **Your saved items never go online** — they are stored only on the device
- Ready to become a real Android app via **Median.co** (with fingerprint unlock)

## Privacy model (important)

- **Firebase is used only for logging in** — it checks your email and password
  and sends the password-reset email. That is standard and safe.
- **Your items (name, description, location) are stored only on the phone**, in
  the app's private storage, and are **never uploaded** anywhere.
- Because items are on-device only: if you uninstall the app or lose/reset the
  phone, those items are gone (there is no online copy — that's the trade-off
  for keeping them private). The app lock + fingerprint (via Median) protect the
  device itself.

Follow the steps in order. You only do steps 1–2 once.

---

## Step 1 — Run it on your computer first

1. Open a terminal in this folder.
2. Install (safe to re-run):
   ```
   npm install
   ```
3. Start the app:
   ```
   npm run dev
   ```
4. Open the link it prints (usually http://localhost:5173).

Sign-up won't work until you add Firebase in Step 2. That's expected.

---

## Step 2 — Set up Firebase (login + password reset ONLY)

Firebase is Google's free service. Here it handles **only** account login and
the "forgot password" email. **You do NOT create any database** — your items
stay on the device.

### 2a. Create the project
1. Go to https://console.firebase.google.com
2. Click **Add project**, name it (e.g. `find-it`), finish the wizard.

### 2b. Register a web app
1. On the project home, click the **web icon** `</>`.
2. Nickname it (e.g. `find-it-web`), click **Register app**.
3. It shows a `firebaseConfig` block. Keep this page open.

### 2c. Paste your keys into the app
1. Open **`src/firebase.js`** in this project.
2. Replace the `YOUR_...` placeholder values with the ones Firebase gave you.

### 2d. Turn on Email/Password login
1. In Firebase, go to **Build → Authentication → Get started**.
2. Open the **Sign-in method** tab.
3. Click **Email/Password**, toggle it **On**, and **Save**.
   (Password-reset emails then work automatically.)

> That's all. **Do not** create a Firestore or Realtime Database — the app
> doesn't use one, on purpose.

4. Restart `npm run dev`. Now sign-up, login, forgot-password, add, and find
   all work. Items are saved on your computer's browser storage for now, and on
   the phone once it's an app.

---

## Step 3 — Put the code on GitHub

1. Create a free account at https://github.com if needed.
2. Create a **new repository** (e.g. `find-it`), empty (no README).
3. In a terminal in this folder, run these (replace `YOUR_USERNAME`):
   ```
   git init
   git add .
   git commit -m "Find It app"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/find-it.git
   git push -u origin main
   ```
   > `node_modules` is ignored automatically via `.gitignore`.
   > Note: only the app *code* goes to GitHub — never your saved items.

---

## Step 4 — Deploy to a live URL with Vercel (free)

Median needs a live web address. Vercel connects to your GitHub and
re-deploys automatically on every push.

1. Go to https://vercel.com and **Sign up with GitHub**.
2. **Add New → Project**, then **Import** your `find-it` repo.
3. Vercel auto-detects Vite. Keep defaults:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Click **Deploy**. You get a URL like `https://find-it-xxxx.vercel.app`.
5. Open it on your phone's browser and test it.

> The included `vercel.json` makes page navigation work correctly.
> Reminder: deploying the code does **not** expose any saved items — they only
> ever exist on each user's own device.

---

## Step 5 — Turn it into an Android app with Median.co

1. Go to https://median.co and create an account.
2. Start a **new app** and paste your **Vercel URL** from Step 4.
3. Set the app name (`Find It`) and an icon.
4. Median builds the app in the cloud and gives you the Android build / Google
   Play upload (no Android Studio needed).

### Fingerprint unlock (Android)

The app already has the fingerprint code built in. You just need to switch on
the matching Median plugin, then turn the lock on inside the app.

1. In **Median App Studio**, open the **Native Plugins** tab.
2. Find and **enable** the plugin named **"Face ID / Touch ID / Android
   Biometrics"** (Median's biometric authentication plugin).
3. Rebuild the Android app in Median and install it on your phone.
4. Make sure your phone already has a fingerprint enrolled
   (phone Settings → Security → Fingerprint).
5. Open the app, log in, and on the **Home** screen turn on the
   **"Fingerprint lock"** toggle (this toggle only appears inside the Median
   app, not in a web browser).

From then on, opening the app (or returning to it from the background) shows a
lock screen and asks for your fingerprint. If you turn the toggle off, the app
opens normally again.

> Note: fingerprint cannot be tested with `npm run dev` in a browser — there is
> no fingerprint reader there. It only works in the installed Android app.

---

## Everyday workflow after setup

1. Edit files here.
2. Test with `npm run dev`.
3. Push the change:
   ```
   git add .
   git commit -m "what you changed"
   git push
   ```
4. Vercel auto-redeploys; Median uses the same URL, so the app updates too.

---

## Where things live (to tweak text or colors)

- **All text (English + Greek):** `src/i18n.js`
- **Colors / styling:** `src/styles.css` (top `:root` block for colors)
- **Home page options:** `src/pages/Home.jsx`
- **Add item form:** `src/pages/AddItem.jsx`
- **Search page:** `src/pages/FindItem.jsx`
- **Where items are stored on the device:** `src/localItems.js`
- **Firebase (login) keys:** `src/firebase.js`
