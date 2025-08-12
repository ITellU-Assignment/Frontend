````markdown
# iTellU Frontend (Next.js 14 + CSS Modules)

## Overview
Admin panel to view, filter, search, and paginate lesson invites.

**Features:**
- Sign-in via NextAuth (Credentials Provider)  
- List and filter by status (pending, accepted, rejected)  
- Debounced search by teacher or student name  
- Pagination for large data sets  
- Responsive table on narrow screens  

## Tech Stack
- Next.js 14 (App Router)  
- NextAuth for authentication  
- CSS Modules for styling  
- Fetches from **http://localhost:5000** API  

---

## Setup & Run

1. **Install dependencies**  
   ```bash
   cd frontend
   npm install
````

2. **Environment variables**
   Create a file `.env` in the `frontend/` folder with the following content:

   ```env
   # API base URL
   NEXT_PUBLIC_API_URL=http://localhost:5000

   # Admin credentials for NextAuth
   ADMIN_USER=admin
   ADMIN_PASS=admin123

   # NextAuth secret (use a long random string in production
   NEXTAUTH_SECRET=your_nextauth_secret_here
   ```

   ***Note: This `.env.local` is shown **only** to allow testing of the assignment.
   To log in, use the exact `ADMIN_USER` and `ADMIN_PASS` values defined above.***

3. **Start development server**

   ```bash
   npm run dev
   ```

   The app is available at **[http://localhost:3000](http://localhost:3000)**.

4. **Sign in**

   * Navigate to **[http://localhost:3000/](http://localhost:3000/)**
   * Click **Sign In** and enter the credentials from `.env.local`.

---

## Project Structure

```
frontend/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/route.ts
│   ├── invites/
│   │   ├── components/
│   │   │   ├── FilterControls.tsx
│   │   │   ├── SearchBox.tsx
│   │   │   ├── InviteTable.tsx
│   │   │   └── Pagination.tsx
│   │   ├── invites.module.css
│   │   └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── public/
├── .env
├── next.config.js
├── package.json
└── tsconfig.json
```

---

## Assumptions

* Single hard-coded admin user via environment variables.
* CORS is enabled on the backend for `localhost:3000`.
* No production-grade security headers beyond basic auth.
* This panel is for demonstration; in real deployments you'd secure routes and secrets appropriately.

```
```
