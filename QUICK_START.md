# 🚀 Quick Start Guide - Phone Number Management System

## Langkah Super Cepat (5 Menit Setup!)

### 1️⃣ Setup Neon DB
1. Buka https://neon.tech → Sign up (gratis)
2. Create new project → Name: "phone-management"
3. Copy connection string
4. Paste ke `.env` → `DATABASE_URL=...`

### 2️⃣ Setup Google OAuth
1. Buka https://console.cloud.google.com
2. Create Project → Name: "Phone Manager"
3. APIs & Services → Credentials → Create OAuth Client ID
4. Application type: Web application
5. Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID dan Client Secret
7. Paste ke `.env`

### 3️⃣ Generate Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```
Paste hasil ke `.env` → `NEXTAUTH_SECRET=...`

### 4️⃣ Database Migration
```bash
npx prisma db push
```

### 5️⃣ Run!
```bash
npm run dev
```

Buka http://localhost:3000 🎉

---

## 📋 Checklist Setup

- [ ] Neon DB connection string di DATABASE_URL
- [ ] Google Client ID di GOOGLE_CLIENT_ID
- [ ] Google Client Secret di GOOGLE_CLIENT_SECRET
- [ ] NEXTAUTH_SECRET generated
- [ ] NEXTAUTH_URL = http://localhost:3000
- [ ] Run `npx prisma db push`
- [ ] Run `npm run dev`

---

## 🌐 Deploy ke Vercel (5 Menit!)

### Via GitHub
```bash
git init
git add .
git commit -m "Phone management system"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Vercel Dashboard
1. https://vercel.com → Import Project
2. Connect GitHub repo
3. Add Environment Variables:
   - `DATABASE_URL` (sama dari .env)
   - `NEXTAUTH_SECRET` (sama dari .env)
   - `GOOGLE_CLIENT_ID` (sama dari .env)
   - `GOOGLE_CLIENT_SECRET` (sama dari .env)
   - `NEXTAUTH_URL` = https://your-app.vercel.app
4. Deploy!

### Update Google OAuth
1. Kembali ke Google Cloud Console
2. Edit OAuth Client
3. Add Authorized redirect URI: `https://your-app.vercel.app/api/auth/callback/google`
4. Save

**Done! 🚀**

---

## 🎯 First Steps After Deploy

1. **Sign In** → Anda jadi ADMIN otomatis
2. **Add Numbers** → Test generate 100 numbers
3. **Mark as USED** → Assign ke client
4. **View History** → Check timeline
5. **Invite Team** → Share link, approve di User Management

---

## 📖 Features Cheat Sheet

### Untuk Admin:
- `+` Add Numbers → Generate blocks
- Click nomor → Toggle FREE/USED
- Click blok → Delete entire block
- Users menu → Approve pending users

### Untuk Semua User:
- Search → By nomor atau nama client
- Clients → View all clients
- Click client → View detail phones
- Clock icon → View history

---

## 🆘 Troubleshooting

**"Error connecting to database"**
→ Cek DATABASE_URL di .env, pastikan Neon DB aktif

**"Error: OAuth callback error"**
→ Cek redirect URI di Google Console matches NEXTAUTH_URL

**"Prisma Client not generated"**
→ Run: `npx prisma generate`

**Build error di Vercel**
→ Pastikan semua ENV vars sudah di-set

---

**Need Help?** Check README.md atau walkthrough.md untuk detail lengkap!
