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
- **CORS**: Enabled for all origins in `api.php`
- **Authentication**: Password hashing using SHA-256
- **Direct Frontend Calls**: Frontend calls the PHP API directly from the browser

#### Authentication Endpoints
The PHP API provides the following authentication actions via POST requests:
- `action=register` - Register a new user with email and password
- `action=login` - Login a user with email and password
- `action=init_users_table` - Initialize the users database table
- `action=init_contacts_table` - Initialize the contacts database table

#### CRUD Operations
The PHP API supports standard CRUD operations:
- `GET /api.php?table=users` - Fetch all users
- `GET /api.php?table=users&id=1` - Fetch a specific user
- `POST /api.php` - Create a new record (include `table` and `data` in JSON body)
- `PUT /api.php` - Update a record (include `table`, `id`, and `data` in JSON body)
- `DELETE /api.php?table=users&id=1` - Delete a record

### Frontend API Clients
Located in `client/lib/`:
- `auth.ts` - Authentication and user management functions
- `contacts.ts` - Contact form submission and admin functions

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
1. Define the table structure in `api.php` using the `init_*_table` action pattern
2. For example, to add a "products" table, you would call the PHP API with:
```javascript
const response = await fetch('api.php', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'init_products_table',
    // The action handler would create the table structure
  })
});
```

3. Extend `api.php` to handle the new table's CRUD operations
4. Create a client library in `client/lib/` to call the PHP API
5. Use in React components:
```typescript
const response = await fetch('api.php?table=products', {
  method: 'GET'
});
const products = await response.json();
```

### Extending Authentication
To add custom authentication logic:
1. Add new actions to `api.php` (e.g., `action=logout`, `action=change_password`)
2. Update the authentication functions in `client/lib/auth.ts`
3. Implement password hashing and verification using SHA-256 (or upgrade to bcrypt in PHP)

### New Page Route
1. Create component in `client/pages/MyPage.tsx`
2. Add route in `client/App.tsx`:
```typescript
<Route path="/my-page" element={<MyPage />} />
```

## Production Deployment

- **Standard**: `pnpm build`
- **Binary**: Self-contained executables (Linux, macOS, Windows)
- **Cloud Deployment**: Use either Netlify or Vercel via their MCP integrations for easy deployment. Both providers work well with this starter template.

## Architecture Notes

- Single-port development with Vite + Express integration
- TypeScript throughout (client, server, shared)
- Full hot reload for rapid development
- Production-ready with multiple deployment options
- Comprehensive UI component library included
- Type-safe API communication via shared interfaces
