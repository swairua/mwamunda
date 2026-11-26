# Fusion Starter

A production-ready React SPA application template with PHP backend API, featuring React Router 6 SPA mode, TypeScript, Vitest, TailwindCSS and modern tooling.

This project uses a PHP backend API (api.php) for all data operations. The system calls the PHP API directly from the frontend without an intermediary Node.js server.

## Tech Stack

- **PNPM**: Prefer pnpm
- **Frontend**: React 18 + React Router 6 (SPA) + TypeScript + Vite + TailwindCSS 3
- **Backend**: PHP API (api.php) - Direct REST API calls from frontend
- **Database**: MySQL
- **Testing**: Vitest
- **UI**: Radix UI + TailwindCSS 3 + Lucide React icons

## Project Structure

```
client/                   # React SPA frontend
├── pages/                # Route components (Index.tsx = home)
├── components/ui/        # Pre-built UI component library
├── lib/                   # Utility functions and API clients
├── App.tsx                # App entry point and with SPA routing setup
└── global.css            # TailwindCSS 3 theming and global styles

api.php                   # PHP Backend API - handles database operations
connection.php            # Database connection configuration
shared/                   # Shared types and utilities
```

## Key Features

## SPA Routing System

The routing system is powered by React Router 6:

- `client/pages/Index.tsx` represents the home page.
- Routes are defined in `client/App.tsx` using the `react-router-dom` import
- Route files are located in the `client/pages/` directory

For example, routes can be defined with:

```typescript
import { BrowserRouter, Routes, Route } from "react-router-dom";

<Routes>
  <Route path="/" element={<Index />} />
  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
  <Route path="*" element={<NotFound />} />
</Routes>;
```

### Styling System

- **Primary**: TailwindCSS 3 utility classes
- **Theme and design tokens**: Configure in `client/global.css`
- **UI components**: Pre-built library in `client/components/ui/`
- **Utility**: `cn()` function combines `clsx` + `tailwind-merge` for conditional classes

```typescript
// cn utility usage
className={cn(
  "base-classes",
  { "conditional-class": condition },
  props.className  // User overrides
)}
```

### PHP API Integration

- **API Location**: `api.php` in the root directory
- **Database**: MySQL database configured in `connection.php`
- **Access control**: Every table and column a request can touch is listed in `api_schema()` in `api.php`. Public (no login): `POST` to `contacts` and `applications`, `GET` of active `careers` and `products`. Everything else needs a signed-in admin
- **Authentication**: PHP sessions (HttpOnly, Secure, SameSite=Strict cookie); passwords hashed with `password_hash`/`password_verify`
- **CORS**: Limited to the site's own origins (`ALLOWED_ORIGINS`); never add `Access-Control-Allow-Origin: *`
- **Errors**: Real HTTP status codes (400/401/403/404/405/429/500) with `{ "error": "..." }`; database errors are logged, not returned
- **Direct Frontend Calls**: Frontend calls the PHP API directly from the browser, always through `apiFetch` in `client/lib/config.ts` (it sends the session cookie and handles 401)
- **Full reference**: `PHP_API_README.md`

#### Authentication Endpoints

The PHP API provides the following authentication actions via POST requests:

- `action=login` - Sign in with email and password (rate limited); sets the session cookie
- `action=logout` - End the session
- `action=session` - Return the signed-in admin, or 401 (also `GET /api.php?action=session`)
- `action=create_user` - Create another admin (signed-in admin only)

There is no public registration, and the API does not create tables: the schema lives in `database/schema.sql` and the first admin is created with `php scripts/admin.php create-admin <email>`.

#### CRUD Operations

The PHP API supports CRUD on the allow-listed tables only (`contacts`, `applications`, `careers`, `products`, and read-only `users`):

- `GET /api.php?table=careers` - Fetch rows (public: active rows only; admin: all)
- `GET /api.php?table=careers&id=1` - Fetch a specific row
- `POST /api.php` - Create a record (include `table` and `data` in JSON body)
- `PUT /api.php` - Update a record (admin; include `table`, `id`, and `data` in JSON body)
- `DELETE /api.php?table=careers&id=1` - Delete a record (admin)

### Frontend API Clients

Located in `client/lib/`:

- `config.ts` - `apiFetch` (sends the session cookie, returns to `/admin/login` on 401)
- `auth.ts` - Login, logout, session check and admin user functions
- `contacts.ts` - Contact form submission and admin functions

Admin routes in `client/App.tsx` sit inside `<RequireAdmin />`, which asks the server for the session before rendering anything. The profile cached in `localStorage` is for display only and grants nothing.

Path aliases:

- `@/*` - Client folder

## Development Commands

```bash
pnpm dev        # Start dev server (client only - Vite)
pnpm build      # Production build (generates dist/spa/)
pnpm typecheck  # TypeScript validation
pnpm test       # Run Vitest tests
pnpm format.fix # Format code with Prettier
```

## Adding Features

### Add new colors to the theme

Open `client/global.css` and `tailwind.config.ts` and add new tailwind colors.

### Adding a New PHP Database Table

1. Add a `CREATE TABLE IF NOT EXISTS` statement to `database/schema.sql` (run it with `php scripts/admin.php init-schema` or in phpMyAdmin)
2. Add the table to `api_schema()` in `api.php`: its columns with validation rules, and which columns the public and admins may insert, update and delete. A table that is not listed cannot be reached
3. Mirror the entry in `SCHEMA` in `api-server.js` so local development behaves the same
4. Create a client library in `client/lib/` that calls the API through `apiFetch`:

```typescript
import { apiFetch, getApiUrl } from "./config";

const response = await apiFetch(`${getApiUrl()}?table=products`, {
  method: "GET",
});
const products = await response.json();
```

### Extending Authentication

To add custom authentication logic:

1. Add new actions to the `switch ($action)` block in `api.php` (e.g., `action=change_password`); call `require_admin($conn)` first for anything that is not public
2. Mirror the action in `api-server.js` and cover it in `api-server.spec.js`
3. Update the authentication functions in `client/lib/auth.ts`
4. Always use `password_hash` / `password_verify` for passwords

### New Page Route

1. Create component in `client/pages/MyPage.tsx`
2. Add route in `client/App.tsx`:

```typescript
<Route path="/my-page" element={<MyPage />} />
```

## Production Deployment

- **Frontend Build**: `pnpm build` - Generates optimized SPA in `dist/spa/`
- **Deployment Options**:
  - **Static Hosting** (Netlify, Vercel, GitHub Pages): Deploy the `dist/spa/` folder
  - **PHP Server Hosting**: Ensure PHP 7.4+ and MySQL are available
- **Required Files for Production**:
  - `dist/spa/` - Built React application
  - `api.php` - PHP API backend
  - `connection.php` - Database connection configuration
  - `public/` - Static assets
- **Environment Setup**:
  - Configure MySQL database settings in `connection.php`
  - Host the frontend and `api.php` on the same origin (the session cookie is SameSite=Strict); list any other browser origin in `ALLOWED_ORIGINS`
  - Create tables with `database/schema.sql` and the first admin with `scripts/admin.php` (see `PRODUCTION_DEPLOYMENT.md`)

## Architecture Notes

- **Frontend-Only Development**: Vite dev server runs on port 8080 for the React SPA
- **Direct Backend Calls**: Frontend communicates directly with PHP API (no intermediary Node server)
- **TypeScript Frontend**: Full TypeScript support for the client application
- **Hot Module Reload**: Rapid development with Vite's HMR
- **MySQL Database**: All data persisted in MySQL via PHP API
- **REST-style API**: Standard HTTP methods and status codes
- **Authentication**: Server-side PHP sessions; the browser only holds an HttpOnly cookie
- **Local API**: `api-server.js` mirrors the PHP API's rules for development (`npm run dev:api`); keep the two in step
