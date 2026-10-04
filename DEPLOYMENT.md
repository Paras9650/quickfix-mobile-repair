# 🚀 Free Deployment Guide for QuickFix

This application is fully optimized for **100% Free Hosting** on **Vercel**, **GitHub Pages**, and **Netlify** with zero configuration required.

---

## ⚡ Option 1: Instant Drag-and-Drop (No Git or Terminal needed)

The entire frontend builds into a self-contained static folder: `dist/`.

1. Run the build command (already built and ready):
   ```bash
   npm run build
   ```
2. Open either:
   - **Netlify Drop**: [app.netlify.com/drop](https://app.netlify.com/drop)
   - **Vercel Drop**: [vercel.com/new](https://vercel.com/new)
3. Drag and drop the **`dist`** folder directly into your browser window.
4. Your site is live immediately with a free HTTPS URL!

---

## 🌐 Option 2: Direct Vercel Deployment (Recommended)

1. Push this project to your GitHub repository.
2. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New Project"**.
3. Select your repository. Vercel will automatically detect `vercel.json` and configure:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. *(Optional)* In the **Environment Variables** section, add:
   - `GEMINI_API_KEY`: *Your Google AI Studio Gemini API Key*
5. Click **Deploy**. Your app is live!

---

## 🐙 Option 3: GitHub Pages Deployment

1. In your GitHub repository, go to **Settings** > **Pages**.
2. Under **Build and deployment**:
   - Source: **Deploy from a branch**
   - Branch: select `main` (or `gh-pages`) and folder `/dist` or `/root`.
3. The included `.nojekyll` file ensures GitHub Pages serves all assets and styles properly.
4. Because all asset paths in `dist/index.html` use relative `./assets/` paths, your app works under any GitHub subpath (e.g., `https://username.github.io/quickfix-app/`).

---

## 🛡️ Built-in Static & Offline Fallback Engine

If you host the app as a pure static drag-and-drop website without a Node backend server, the built-in **Client-Side Assistant Engine** (`src/utils/clientChatEngine.ts`) automatically kicks in:
- Step-by-step Hinglish chat flow
- Dynamic cost estimation in INR (₹)
- Strict 6-digit Pincode & Landmark address validation
- Certified technician assignment (Rahul Kumar)
- Structured JSON output & live interactive confirmation cards
- In-App UPI Payment QR simulation
- Admin fleet radar and Technician Job App with anti-spoofing and Rapido-style alert!
