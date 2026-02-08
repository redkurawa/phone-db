# 📱 Phone Number Management System

Aplikasi web modern untuk mengelola nomor telepon perusahaan dengan tracking status, history lengkap, dan manajemen client.

## ✨ Fitur Utama

- 🔐 **Authentication**: Google OAuth dengan NextAuth v5
- 👥 **Role-based Access**: Admin dan Viewer dengan permissions berbeda  
- 📞 **Phone Management**: Generate, edit, delete nomor dengan bulk operations
- 🏢 **Client Management**: Track nomor untuk setiap client
- 📊 **Statistics**: Real-time stats (total, free, used numbers)
- 🔍 **Smart Search**: Cari by nomor atau nama client
- 📜 **History Tracking**: Timeline lengkap setiap perubahan nomor
- 🎨 **Modern UI**: Gradient design dengan Framer Motion animations
- ⚡ **Smooth Animations**: Add/Edit/Delete dengan animasi halus

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Neon DB (PostgreSQL)
- **ORM**: Prisma
- **Authentication**: NextAuth v5
- **UI**: Shadcn UI + Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 🚀 Setup Lokal

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Neon DB

1. Buat akun di [https://neon.tech](https://neon.tech)
2. Buat database baru
3. Copy connection string

### 3. Setup Google OAuth

1. Buka [Google Cloud Console](https://console.cloud.google.com)
2. Buat project baru atau pilih existing
3. Enable Google+ API
4. Buat OAuth 2.0 Credentials
5. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://your-domain.vercel.app/api/auth/callback/google` (untuk production)

### 4. Environment Variables

Buat file `.env` di root folder:

```bash
# Database (Neon DB Connection String)
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-random-secret-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 5. Database Migration

```bash
npx prisma db push
```

### 6. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## 🌐 Deploy ke Vercel

### 1. Push ke GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main
```

### 2. Import ke Vercel

1. Buka [vercel.com](https://vercel.com)
2. Import repository
3. Set environment variables (sama seperti `.env` lokal)
4. Update `NEXTAUTH_URL` dengan URL Vercel Anda
5. Deploy!

### 3. Update Google OAuth

Tambahkan Vercel URL ke Authorized redirect URIs di Google Cloud Console:
```
https://your-app.vercel.app/api/auth/callback/google
```

## 📖 User Guide

### First Time Setup

1. **Sign in** dengan Google
2. User pertama otomatis jadi **ADMIN**
3. User selanjutnya perlu **approval** dari admin

### Admin Features

- ✅ Generate nomor (Standard Block 100 / Custom Range)
- ✅ Toggle status FREE ↔ USED
- ✅ Assign client ke nomor
- ✅ Delete entire blocks
- ✅ Approve/reject new users
- ✅ View all statistics

### Viewer Features

- ✅ View semua nomor dan status
- ✅ Search by number atau client
- ✅ View history setiap nomor
- ✅ View client list dan detail

## 🎯 Keyboard Shortcuts

- `/` - Focus on search bar
- `Esc` - Close any dialog/modal

## 🔧 Available Scripts

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database commands
npx prisma studio       # Open database GUI
npx prisma db push      # Push schema changes
npx prisma generate     # Generate Prisma Client

# Linting
npm run lint
```

## 📂 Project Structure

```
/app
  /actions          - Server actions (API logic)
  /api/auth        - NextAuth API routes
  /clients         - Client pages
  /dashboard       - Main dashboard
  /users           - User management
  /pending         - Pending approval page
  page.tsx         - Login page
  layout.tsx       - Root layout
  globals.css      - Global styles
  
/components
  /ui              - Shadcn UI components
  dashboard-client.tsx
  phone-block.tsx
  phone-number-card.tsx
  add-numbers-dialog.tsx
  history-modal.tsx
  header.tsx
  ...

/lib
  db.ts            - Prisma client
  utils.ts         - Utility functions

/prisma
  schema.prisma    - Database schema

auth.ts            - NextAuth configuration
middleware.ts      - Route protection
```

## 🎨 Animations

Semua animasi menggunakan Framer Motion:

- **Add Numbers**: Scale-in + fade (0.3s)
- **Delete Block**: Slide-out (0.3s)
- **Toggle Status**: Flip animation (0.2s)
- **Phone Cards**: Hover lift effect
- **Stats Cards**: Count-up spring animation
- **Loading States**: Pulse animation

## 📊 Database Schema

**User**
- id, email, name, image, role (ADMIN/VIEWER)
- isApproved, createdAt, updatedAt

**PhoneNumber**
- id, number (unique), status (FREE/USED)
- currentClient, initialDate
- createdAt, updatedAt

**NumberHistory**
- id, phoneNumberId, status, clientName
- changeDate, createdAt

## 🔒 Security

- ✅ OAuth 2.0 authentication
- ✅ Role-based access control (RBAC)
- ✅ Server-side authorization checks
- ✅ CSRF protection (NextAuth)
- ✅ SQL injection protection (Prisma)
- ✅ XSS protection (React)

## 🐛 Troubleshooting

**Database connection error:**
- Cek DATABASE_URL di `.env`
- Pastikan Neon DB aktif
- Test connection: `npx prisma studio`

**Google OAuth error:**
- Cek GOOGLE_CLIENT_ID dan SECRET
- Pastikan redirect URI sesuai
- Enable Google+ API di Cloud Console

**Build error:**
- Clear cache: `rm -rf .next`
- Reinstall: `rm -rf node_modules && npm install`

## 📝 License

MIT License - Feel free to use for your projects!

## 👨‍💻 Support

Untuk pertanyaan atau issue, buat GitHub issue atau contact developer.

---

**Made with ❤️ using Next.js 14 + Neon DB**
