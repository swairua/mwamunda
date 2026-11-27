# PHP API Reference

`api.php` is the site's only backend. It is served from the same origin as the
site (`/api.php`) and talks to MySQL through `connection.php`.

Requires PHP 7.4+ with mysqli (mysqlnd).

## Who can do what

| Request                                              | Anyone                               | Signed-in admin        |
| ---------------------------------------------------- | ------------------------------------ | ---------------------- |
| `POST` `contacts`, `applications` (the public forms) | Yes: fixed columns, validated        | Yes                    |
| `GET` `careers`, `products`                          | Live postings / active products only | All rows               |
| `GET` `contacts`, `applications`, `users`            | 401                                  | Yes (never a password) |
| `POST`/`PUT`/`DELETE` `careers`, `products`          | 401                                  | Yes                    |
| `PUT`/`DELETE` `contacts`, `applications`            | 401                                  | Yes, listed columns    |
| `POST`/`PUT`/`DELETE` `users`                        | 401                                  | 405: use `create_user` |
| Any other table                                      | 404                                  | 404                    |

The tables, their columns, and which columns each kind of caller may write are
all listed in `api_schema()` at the top of `api.php`. Nothing outside that list
can be reached: table and column names are never taken from the request.

## Actions

Send as `POST` with a JSON body.

| Action             | Who    | Body                           | Result                                           |
| ------------------ | ------ | ------------------------------ | ------------------------------------------------ |
| `check_connection` | Anyone | -                              | `{ success, message }`                           |
| `login`            | Anyone | `email`, `password`            | Sets the session cookie; `{ success, user }`     |
| `logout`           | Anyone | -                              | Ends the session and clears the cookie           |
| `session`          | Admin  | - (also `GET ?action=session`) | `{ success, user }`, or 401 when not signed in   |
| `create_user`      | Admin  | `email`, `password`, `name`    | Creates another admin (password: 10 to 72 bytes) |

There is no public registration. The old `register`, `create_table` and
`init_*_table` actions were removed; they now answer `400 Unknown action`.

## Table requests

```http
GET    /api.php?table=careers
GET    /api.php?table=careers&id=3
GET    /api.php?table=products&orderBy=created_at&order=DESC&limit=5

POST   /api.php    { "table": "contacts", "data": { "name": "...", "email": "...", "subject": "...", "message": "..." } }
PUT    /api.php    { "table": "applications", "id": 12, "data": { "status": "approved", "approved_amount": 25000 } }
DELETE /api.php?table=careers&id=3
```

- `POST` and `PUT` must send `Content-Type: application/json`.
- `orderBy` must be a column of that table; `limit` is capped at 1000.
- Public form posts ignore fields a visitor may not set (`status`, notes,
  approved amount, and anything unknown). Admin writes reject unknown fields
  with a 400 naming the field.
- `status` is set by the server on public inserts (`new` for contacts,
  `pending` for applications). `response_sent_at` is set by the server when a
  contact's `response_email` is saved.

## Responses

Success: `200` (or `201` for a created record) with JSON.

Errors always carry a matching HTTP status and `{ "error": "..." }`:

| Status | Meaning                                                         |
| ------ | --------------------------------------------------------------- |
| 400    | Invalid input (the message says which field)                    |
| 401    | Not signed in, or wrong email/password                          |
| 403    | Origin not allowed, or the account is not an admin              |
| 404    | Unknown table, or record not found                              |
| 405    | Method not allowed for that table                               |
| 409    | Email already registered                                        |
| 415    | Body is not `application/json`                                  |
| 429    | Too many failed logins (see `Retry-After`)                      |
| 500    | Server error. Details go to the PHP error log, not the response |

## Sessions

- Signing in starts a PHP session. The cookie (`mwamunda_admin`) is `HttpOnly`,
  `Secure` and `SameSite=Strict`, so page scripts cannot read it and other
  sites cannot send it.
- A session ends after 30 minutes without activity, after 8 hours in any case,
  on logout, or as soon as the account is deleted or stops being an admin.
- Sign-in attempts are counted in the `login_attempts` table over 15 minutes.
  More than 10 for one email from one address answers 429 with `Retry-After`.
  The limit is per email and address together, so guesses from elsewhere
  cannot lock an admin out. Higher ceilings (200 per email from all
  addresses, 300 per address across all emails) only stop large-scale
  guessing.
- Attempts made while blocked are not recorded, old rows are deleted on every
  attempt, and a missing table is logged and does not stop logins.
- The address is `REMOTE_ADDR` unless `TRUSTED_PROXY_IP_HEADER` names a header
  set by your own proxy or CDN. See "Login rate limiting and the visitor's
  address" in `PRODUCTION_DEPLOYMENT.md` before setting it.

## Passwords

Passwords are stored with `password_hash()` (bcrypt) and must be 10 to 72
bytes long (bcrypt ignores anything after 72 bytes).

Accounts created before this used unsalted SHA-256, and the old API exposed
those hashes. Such a hash is never accepted: signing in fails exactly like a
wrong password (the refusal is written to the PHP error log), and the account
needs a new password from `php scripts/admin.php create-admin <email>`.

## Configuration

Set on the server (Apache `SetEnv`, the hosting control panel, or the
container environment):

| Variable                  | Default                                             | Purpose                                                                                    |
| ------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `DB_HOST`                 | `localhost`                                         | MySQL host                                                                                 |
| `DB_USER`                 | (required)                                          | MySQL user                                                                                 |
| `DB_PASSWORD`             | (empty)                                             | MySQL password                                                                             |
| `DB_NAME`                 | (required)                                          | Database name                                                                              |
| `ALLOWED_ORIGINS`         | `https://mwamunda.co.ke,https://www.mwamunda.co.ke` | Other origins allowed to call the API from a browser                                       |
| `APP_ENV`                 | `production`                                        | `development` lets the cookie work over plain http                                         |
| `TRUSTED_PROXY_IP_HEADER` | (unset)                                             | Header your own proxy or CDN sets with the visitor's address; used for login rate limiting |

Requests from the host that serves `api.php` are always accepted, so a normal
same-origin deployment needs no `ALLOWED_ORIGINS`. Do not add CORS headers in
`.htaccess`: a `Header set` there would override the API's own.

## Database and admin accounts

The schema lives in `database/schema.sql` (safe to re-run; it only creates
missing tables). Accounts are managed from the command line:

```bash
php scripts/admin.php init-schema                 # create missing tables
php scripts/admin.php list-users                  # who has an account
php scripts/admin.php create-admin you@example.com "Your Name"   # asks for a password
php scripts/admin.php remove-user old@example.com
```

`create-admin` on an existing email makes that account an admin and replaces
its password. Without shell access, run `database/schema.sql` in phpMyAdmin and
see "Admin accounts" in `PRODUCTION_DEPLOYMENT.md`.

## Adding a table

1. Add the `CREATE TABLE IF NOT EXISTS` statement to `database/schema.sql`.
2. Add an entry to `api_schema()` in `api.php` listing its columns and who may
   read, insert, update and delete.
3. Mirror the entry in `SCHEMA` in `api-server.js` so local development matches.
4. Add a client module in `client/lib/` that calls it through `apiFetch`.

## Local development

`npm run dev:api` starts `api-server.js`, a Node stand-in that follows the same
rules (tested in `api-server.spec.js`). With an empty `db.json` it creates a
local admin and prints its password once; set `DEV_ADMIN_EMAIL` and
`DEV_ADMIN_PASSWORD` to choose your own.

To run the real PHP API instead: `npm run dev:php` with a local MySQL database
and `APP_ENV=development`.
