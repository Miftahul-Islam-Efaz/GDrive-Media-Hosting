<img src="https://lh3.googleusercontent.com/d/1DdZPoHWWqGJNypGCXBk1JVRF-AIC_1Mx" /><p align="center">
  <img src="https://img.shields.io/github/stars/Miftahul-Islam-Efaz/GDrive-Media-Hosting?style=for-the-badge&logo=github&color=4899ff" alt="GitHub Stars" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Google%20Drive%20API-v3-blue?style=for-the-badge&logo=google-drive" alt="Google Drive API" />
  <img src="https://img.shields.io/badge/Hosting-100%25%20Free-brightgreen?style=for-the-badge" alt="Free Hosting" />
</p>

<h1 align="center">📁 GDrive Media Hosting</h1>

<p align="center">
  <strong>Turn your personal Google Drive into a free media CDN for images and videos.</strong><br/>
  Upload files, get instant public URLs, embed anywhere — no bandwidth limits from third-party tiers.
</p>

<p align="center">
  <a href="#-demo">Demo</a> •
  <a href="#-why-this-exists">Why This Exists</a> •
  <a href="#-features">Features</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-how-it-works">How It Works</a> •
  <a href="#-known-limitations">Known Limitations</a> •
  <a href="#-faq">FAQ</a>
</p>

---

## 🎯 Why This Exists

Free media hosting tiers break projects. You've been there:

- **Cloudinary** hits its 25GB storage or 25GB bandwidth limit and your images 404.
- **Imgur** bans hotlinking from non-Imgur domains.
- **Vercel Blob / Supabase Storage** free tiers cap out fast for side projects.
- **imgbb, PostImages** — unreliable uptime, random key bans.

**GDrive Media Hosting bypasses all of this.** It uses Google's own storage (15GB free per account, expandable) and Google's own CDN delivery infrastructure — the same infrastructure that serves billions of Gmail attachments and Google Photos every day.

You own the files. They live in your Drive. No third party holds your media hostage.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🖼️ **Direct Image Hotlinks** | Converts images to `lh3.googleusercontent.com/d/FILE_ID` — embeddable in any `<img>` tag, Markdown, or blog |
| 🎬 **Video Embed Codes** | Generates `<iframe>` embed codes for videos using Google Drive's built-in preview player |
| ⬆️ **Multi-file Upload** | Drag-and-drop or click-to-browse with real-time per-file progress tracking |
| 🔍 **Instant Search** | Filter your hosted files by name in real time |
| 🔃 **Sort & Filter** | Sort by newest, oldest, or filename — filter by All / Images / Videos tabs |
| ✏️ **Rename Files** | Rename files directly in the UI, synced back to your Drive |
| 🗑️ **Bulk Delete** | Multi-select files and delete them all in one click |
| 🔐 **Client-Side Auth Only** | OAuth 2.0 token flow — your tokens are stored in `sessionStorage` only and never touch any server |
| 🎉 **Copy URL with Confetti** | Because why not make it satisfying |

---

## 🚀 Quick Start

### Option 1: Use the Hosted Version (Instant)

Visit the deployed app and connect your Google Account. No setup required.

> The app uses a shared Google OAuth Client ID by default. If you hit quota limits from heavy use, follow Option 2 to use your own.

### Option 2: Self-Host with Your Own OAuth Credentials (Recommended for Production)

**Prerequisites:** Node.js 18+, a Google Cloud project

#### 1. Clone the repository

```bash
git clone https://github.com/Miftahul-Islam-Efaz/GDrive-Media-Hosting.git
cd GDrive-Media-Hosting
npm install
```

#### 2. Create a Google Cloud OAuth 2.0 Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use an existing one)
3. Navigate to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth 2.0 Client ID**
5. Select **Web Application**
6. Add your domain to **Authorized JavaScript Origins**:
   - For local development: `http://localhost:3000`
   - For production: `https://yourdomain.com`
7. Copy your **Client ID**

#### 3. Enable the Google Drive API

In Google Cloud Console → **APIs & Services → Library** → Search for **Google Drive API** → Enable it.

#### 4. Run locally

```bash
npm run dev
```

Open `http://localhost:3000`, go to **Settings**, paste your Client ID, and reconnect.

#### 5. Deploy

```bash
npm run build
```

Deploy the `.next` output to Vercel, Netlify, Cloudflare Pages, or any static/Node host.

---

## 🔧 How It Works

```
User → Connects Google Account (OAuth 2.0 Token Flow)
     → App requests drive.file scope (access only to files it creates)
     → On first connect, creates a "GDrive Media Host" folder in Drive
     → Uploads go directly to Google Drive via Drive API v3 (multipart upload)
     → Each file is automatically set to "Anyone with link → Viewer" permissions
     → Image URLs are served via Google's lh3.googleusercontent.com CDN
     → Video embeds use Google Drive's built-in preview iframe player
     → All tokens stored in browser sessionStorage only — cleared on tab close
```

**No backend server. No database. No proxy.** Every API call goes directly from your browser to Google's APIs.

---

## 🖼️ Embedding Your Hosted Media

### Images — Direct Hotlink

```html
<img src="https://lh3.googleusercontent.com/d/YOUR_FILE_ID" alt="My Image" />
```

```markdown
![Alt text](https://lh3.googleusercontent.com/d/YOUR_FILE_ID)
```

### Videos — iframe Embed

```html
<iframe 
  src="https://drive.google.com/file/d/YOUR_FILE_ID/preview" 
  width="640" 
  height="480" 
  allow="autoplay"
></iframe>
```

> ⚠️ Videos **cannot** be embedded in native HTML5 `<video>` tags due to CORS restrictions on Google Drive's streaming endpoints. Use the iframe embed method above.

---

## ⚠️ Known Limitations

Be honest with yourself about these before using this in production:

| Limitation | Details |
|---|---|
| **Google Drive storage cap** | Free accounts get 15GB. This is not "infinite" — plan accordingly or use a paid Google One plan. |
| **`lh3` hotlinks are unofficial** | Google doesn't officially document the `lh3.googleusercontent.com/d/` CDN URL format. It has worked reliably for years, but could change without notice. |
| **Videos are iframe-only** | CORS blocks native `<video>` tag streaming from Drive. Embeds only. |
| **15 min OAuth sessions** | Google's token expires every ~60 minutes. The app auto-warns you and prompts a reconnect. |
| **Not for high-traffic production assets** | Google may throttle files that receive millions of requests per day from a personal account. Use Google Cloud CDN + Cloud Storage for that scale. |
| **All files are public** | Every file you upload is set to "Anyone with link can view." Do not upload private content. |

---

## 🔒 Security & Privacy

- The app requests only the `drive.file` scope — it can only see and manage **files it created itself**. It cannot access your existing Google Drive files.
- Your OAuth access token is stored in `sessionStorage` (cleared when you close the tab) and `localStorage` for configuration only (folder ID, preferences).
- No token, no email, no file data is ever sent to any third-party server. All Drive API calls go directly from your browser to `googleapis.com`.
- This is a fully client-side application.

---

## ❓ FAQ

**Q: Why does the image URL use `lh3.googleusercontent.com` instead of `drive.google.com`?**

Drive's regular shareable links redirect through a viewer page. The `lh3` endpoint serves the raw image bytes directly, making it usable as a hotlink in `<img>` tags without a redirect.

**Q: Can I use this for my portfolio or blog images?**

Yes. This is the primary use case. Just be aware of the unofficial nature of the `lh3` URL format and keep backups of important images.

**Q: Can I use this for video hosting at scale?**

No. For high-traffic video serving, use Cloudflare Stream, Bunny.net, or Mux. This tool is for personal projects and side projects, not production video platforms.

**Q: Will Google ever break this?**

Possibly. The `lh3` URL format has been stable for years, but it's not an officially supported API. If it breaks, the fallback is Google Drive's standard shareable viewer link.

**Q: Is this free forever?**

As long as you stay within your Google Drive storage quota (15GB free), yes. Google Drive storage has been free at 15GB since 2012.

---

## 🗂️ Project Structure

```
GDrive-Media-Hosting/
├── src/
│   └── app/
│       ├── page.js          # Main application (all UI + Drive API logic)
│       ├── layout.js        # Next.js root layout
│       ├── globals.css      # All styles (Google Drive-inspired light theme)
│       └── about/           # About page
├── next.config.mjs
├── package.json
└── README.md
```

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'feat: add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## ⭐ Support This Project

If GDrive Media Hosting saved your project from a broken Cloudinary quota or an Imgur ban, please **star this repository**. It costs nothing and helps other developers find this tool.

[![Star on GitHub](https://img.shields.io/github/stars/Miftahul-Islam-Efaz/GDrive-Media-Hosting?style=social)](https://github.com/Miftahul-Islam-Efaz/GDrive-Media-Hosting)

---

## 📄 License

MIT — free to use, fork, and build on.

---

<p align="center">
  Built by <a href="https://github.com/Miftahul-Islam-Efaz">Miftahul Islam Efaz</a> — Autodidact Entrepreneur, Vibe-Coder & AI Orchestrator
</p>
