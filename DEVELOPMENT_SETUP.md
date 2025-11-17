# Development Setup

This guide explains how to set up your development environment to work with the React frontend and PHP API locally.

## Prerequisites

- **Node.js** (v18+)
- **pnpm** package manager
- **PHP** (7.4+) with built-in server or Apache
- **MySQL** (optional - for local database testing)

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

This installs all Node.js packages needed for the React frontend.

### 2. Start Development Servers

You have two options:

#### Option A: Run PHP and Vite Together (Recommended)

```bash
pnpm dev:full
```

This command:
- Starts PHP server on `http://localhost:8000`
- Starts Vite dev server on `http://localhost:8080`
- Vite automatically proxies `/api.php` requests to PHP server
- Opens `http://localhost:8080` in your browser

#### Option B: Run Separately (If you prefer two terminals)

**Terminal 1 - Start PHP API server:**
```bash
pnpm dev:php
# or manually: php -S localhost:8000
```

**Terminal 2 - Start React dev server:**
```bash
pnpm dev
# Runs on http://localhost:8080
```

### 3. Access the Application

- **Frontend**: http://localhost:8080
- **API**: http://localhost:8000/api.php (direct)
- **API from Frontend**: `/api.php` (proxied by Vite)

## How the Proxy Works

During development:
1. React frontend makes a request to `/api.php`
2. Vite intercepts this request
3. Vite forwards it to `http://localhost:8000/api.php`
4. PHP server handles the request and returns JSON
5. Response is sent back to the frontend

This setup allows you to:
- Develop React and PHP independently
- Keep the dev experience smooth with Vite's HMR (Hot Module Reload)
- Test the full API locally without deploying

## Database Setup (Optional)

If you want to test with a local database:

1. **Create a database** (MySQL):
   ```bash
   mysql -u root -p
   > CREATE DATABASE mwamunda;
   > EXIT;
   ```

2. **Configure connection** in `connection.php`:
   ```php
   $servername = "localhost";
   $username = "root";
   $password = ""; // Your MySQL password
   $database = "mwamunda";
   ```

3. **Initialize tables** by visiting:
   - http://localhost:8080/admin/setup

   Or make a curl request:
   ```bash
   curl -X POST http://localhost:8000/api.php \
     -H "Content-Type: application/json" \
     -d '{"action": "init_users_table"}'
   ```

## Useful Commands

```bash
# Build frontend only
pnpm build

# Build frontend + copy API files (ready for deployment)
pnpm build:full

# Type checking
pnpm typecheck

# Run tests
pnpm test

# Format code
pnpm format.fix
```

## Troubleshooting

### Port Already in Use

If port 8000 or 8080 is already in use:

1. **Change PHP port:**
   ```bash
   php -S localhost:9000
   ```
   Then update `vite.config.ts`:
   ```typescript
   proxy: {
     "/api.php": {
       target: "http://localhost:9000",
       // ...
     }
   }
   ```

2. **Change Vite port:**
   ```bash
   pnpm dev -- --port 3000
   ```

### API Returns HTML Instead of JSON

If you see HTML error pages from PHP:
1. Ensure PHP server is running: `pnpm dev:php`
2. Check that `connection.php` has correct database credentials
3. Look at PHP error logs in terminal

### Database Connection Error

1. Verify MySQL is running
2. Check credentials in `connection.php`
3. Create database: `mysql -u root -e "CREATE DATABASE mwamunda;"`

### Vite Proxy Not Working

1. Restart Vite dev server
2. Check that PHP server is running on correct port
3. Verify `vite.config.ts` has correct target URL

## Project Structure

```
├── client/                 # React frontend source
│   ├── pages/             # Route components
│   ├── components/        # Reusable React components
│   └── lib/               # Utilities (API calls, config)
├── api.php                # PHP REST API
├── connection.php         # Database connection config
├── vite.config.ts         # Vite build config (with proxy)
├── package.json           # Node.js scripts and dependencies
└── dist/                  # Built output (after pnpm build:full)
```

## Next Steps

- **Backend**: Edit `api.php` to add new endpoints
- **Frontend**: Create new pages in `client/pages/` and add routes in `client/App.tsx`
- **Database**: Modify table structure by editing `init_*_table` actions in `api.php`

Happy coding! 🚀
