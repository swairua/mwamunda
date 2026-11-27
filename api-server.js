/**
 * Local development stand-in for api.php.
 *
 * It follows the same rules as the PHP API so the front end behaves the same
 * against either: the same table allow-list, the same public/admin split, the
 * same status codes, cookie sessions, and login rate limiting. Data lives in
 * db.json (git-ignored); login attempts are kept in memory. Never deploy this
 * file.
 *
 *   npm run dev:api
 *
 * First run: if no admin exists, one is created and its password is printed
 * once in this terminal. Set DEV_ADMIN_EMAIL and DEV_ADMIN_PASSWORD to choose
 * your own.
 */
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import net from "net";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SESSION_COOKIE = "mwamunda_admin";
const SESSION_IDLE_MS = 30 * 60 * 1000;
const SESSION_MAX_MS = 8 * 60 * 60 * 1000;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
// Login attempts allowed per window before further ones are refused.
// Same numbers as api.php.
export const LOGIN_LIMITS = {
  perPair: 10, // one email from one address: the working limit
  perEmail: 200, // one email from every address together
  perIp: 300, // one address across every email
};
const PASSWORD_MIN_LENGTH = 10;
const PASSWORD_MAX_BYTES = 72; // api.php uses bcrypt, which stops at 72 bytes
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const READ_ONLY_COLUMNS = ["id", "created_at", "updated_at"];
const DEFAULT_ALLOWED_ORIGINS = "http://localhost:8080,http://127.0.0.1:8080";

/* ------------------------------------------------------------------
   Schema: mirrors api_schema() in api.php
   ------------------------------------------------------------------ */

const str = (max, required = false) => ({ type: "string", max, required });
const text = (max, required = false) => ({ type: "text", max, required });
const email = (required = false) => ({ type: "email", max: 255, required });
const slug = (max, required = false) => ({ type: "slug", max, required });
const decimal = () => ({ type: "decimal" });
const date = () => ({ type: "date" });
const url = (max) => ({ type: "url", max });

const APPLICATION_FORM_COLUMNS = [
  "product_type",
  "full_name",
  "email",
  "phone",
  "national_id",
  "date_of_birth",
  "residential_address",
  "business_type",
  "business_name",
  "business_registration",
  "monthly_income",
  "requested_amount",
  "loan_purpose",
  "employment_status",
  "nearest_branch",
  "bank_account",
  "bank_name",
  "additional_info",
];

const CAREER_COLUMNS = [
  "position_title",
  "department",
  "description",
  "qualifications",
  "responsibilities",
  "job_type",
  "experience_level",
  "application_email",
  "application_phone",
  "image_url",
  "validity_start_date",
  "validity_end_date",
  "status",
];

const PRODUCT_COLUMNS = [
  "name",
  "description",
  "category",
  "price",
  "features",
  "image_url",
  "status",
];

const today = () => new Date().toISOString().slice(0, 10);

const SCHEMA = {
  contacts: {
    columns: {
      name: str(255, true),
      email: email(true),
      phone: str(50),
      subject: str(255, true),
      message: text(5000, true),
      status: slug(50),
      internal_notes: text(10000),
      response_email: text(10000),
    },
    publicInsert: ["name", "email", "phone", "subject", "message"],
    insertDefaults: { status: "new" },
    adminInsert: ["name", "email", "phone", "subject", "message", "status"],
    adminUpdate: ["status", "internal_notes", "response_email"],
    adminDelete: true,
    ignored: ["response_sent_at"],
  },
  applications: {
    columns: {
      product_type: slug(100, true),
      full_name: str(255, true),
      email: email(true),
      phone: str(50, true),
      national_id: str(50),
      date_of_birth: date(),
      residential_address: text(2000),
      business_type: str(100),
      business_name: str(255),
      business_registration: str(100),
      monthly_income: decimal(),
      requested_amount: decimal(),
      loan_purpose: text(5000),
      employment_status: str(50),
      nearest_branch: str(100),
      bank_account: str(50),
      bank_name: str(100),
      additional_info: text(5000),
      status: slug(50),
      admin_notes: text(10000),
      approved_amount: decimal(),
      rejection_reason: text(10000),
    },
    publicInsert: APPLICATION_FORM_COLUMNS,
    insertDefaults: { status: "pending" },
    adminInsert: [...APPLICATION_FORM_COLUMNS, "status"],
    adminUpdate: [
      "status",
      "admin_notes",
      "approved_amount",
      "rejection_reason",
    ],
    adminDelete: true,
  },
  careers: {
    columns: {
      position_title: str(255, true),
      department: str(100),
      description: text(20000, true),
      qualifications: text(20000, true),
      responsibilities: text(20000),
      job_type: str(50),
      experience_level: str(50),
      application_email: email(),
      application_phone: str(50),
      image_url: url(500),
      validity_start_date: date(),
      validity_end_date: date(),
      status: slug(50),
    },
    publicFilter: (row) =>
      row.status === "active" &&
      (!row.validity_end_date || row.validity_end_date >= today()),
    publicColumns: ["id", ...CAREER_COLUMNS, "created_at"],
    insertDefaults: { status: "active" },
    adminInsert: CAREER_COLUMNS,
    adminUpdate: CAREER_COLUMNS,
    adminDelete: true,
  },
  products: {
    columns: {
      name: str(255, true),
      description: text(20000),
      category: str(100),
      price: decimal(),
      features: text(20000),
      image_url: url(500),
      status: slug(50),
    },
    publicFilter: (row) => row.status === "active",
    publicColumns: ["id", ...PRODUCT_COLUMNS, "created_at", "updated_at"],
    insertDefaults: { status: "active" },
    adminInsert: PRODUCT_COLUMNS,
    adminUpdate: PRODUCT_COLUMNS,
    adminDelete: true,
  },
  users: {
    columns: {},
    adminColumns: ["id", "email", "name", "role", "created_at", "updated_at"],
  },
};

/* ------------------------------------------------------------------
   Validation
   ------------------------------------------------------------------ */

class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function cleanValue(column, rule, raw) {
  let value = typeof raw === "string" ? raw.trim() : raw;
  if (value === null || value === undefined || value === "") {
    if (rule.required) throw new ApiError(400, `${column} is required`);
    return null;
  }
  if (typeof value !== "string" && typeof value !== "number") {
    throw new ApiError(400, `${column} has an invalid value`);
  }

  if (rule.type === "decimal") {
    const number = Number(value);
    if (!Number.isFinite(number)) {
      throw new ApiError(400, `${column} must be a number`);
    }
    if (number < 0 || number > 9999999999.99) {
      throw new ApiError(400, `${column} is out of range`);
    }
    return number.toFixed(2);
  }

  if (rule.type === "date") {
    const day = String(value).slice(0, 10);
    const parsed = new Date(`${day}T00:00:00Z`);
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(day) ||
      Number.isNaN(parsed.getTime()) ||
      parsed.toISOString().slice(0, 10) !== day
    ) {
      throw new ApiError(400, `${column} must be a date (YYYY-MM-DD)`);
    }
    return day;
  }

  value = String(value);
  if (rule.max && [...value].length > rule.max) {
    throw new ApiError(
      400,
      `${column} is too long (max ${rule.max} characters)`,
    );
  }
  if (rule.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    throw new ApiError(400, `${column} must be a valid email address`);
  }
  if (rule.type === "slug" && !/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(value)) {
    throw new ApiError(400, `${column} has an invalid value`);
  }
  if (
    rule.type === "url" &&
    (!/^(https?:\/\/|\/)/i.test(value) || /[\s<>"']/.test(value))
  ) {
    throw new ApiError(400, `${column} must be an http(s) URL`);
  }
  return value;
}

/**
 * Picks and validates writable columns. `strict` rejects unknown fields
 * (admin writes); otherwise they are dropped (public form posts).
 */
function cleanRow(def, allowed, data, { strict, requireAll }) {
  const ignored = [...READ_ONLY_COLUMNS, ...(def.ignored || [])];
  const clean = {};

  for (const [column, value] of Object.entries(data)) {
    if (ignored.includes(column)) continue;
    if (!allowed.includes(column)) {
      if (strict) {
        const safeName = column.replace(/[^A-Za-z0-9_]/g, "").slice(0, 64);
        throw new ApiError(400, `Unknown or read-only field: ${safeName}`);
      }
      continue;
    }
    clean[column] = cleanValue(column, def.columns[column], value);
  }

  if (requireAll) {
    for (const column of allowed) {
      if (def.columns[column].required && clean[column] == null) {
        throw new ApiError(400, `${column} is required`);
      }
    }
  }
  return clean;
}

function positiveId(value) {
  const ok =
    (typeof value === "number" && Number.isInteger(value)) ||
    (typeof value === "string" && /^\d+$/.test(value));
  if (!ok || Number(value) < 1) {
    throw new ApiError(400, "A valid id is required");
  }
  return Number(value);
}

/* ------------------------------------------------------------------
   Passwords (scrypt here; api.php uses password_hash)
   ------------------------------------------------------------------ */

export function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, 64);
  return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`;
}

function isLegacyHash(stored) {
  return /^[a-f0-9]{64}$/i.test(stored);
}

function verifyPassword(password, stored) {
  if (typeof stored !== "string") return false;
  // A legacy unsalted SHA-256 hash is never accepted (see login below).
  if (isLegacyHash(stored)) return false;
  const [scheme, saltHex, hashHex] = stored.split("$");
  if (scheme !== "scrypt" || !saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  const candidate = crypto.scryptSync(
    password,
    Buffer.from(saltHex, "hex"),
    expected.length,
  );
  return crypto.timingSafeEqual(candidate, expected);
}

/* ------------------------------------------------------------------
   Login attempts (stands in for the login_attempts table)
   ------------------------------------------------------------------ */

export function createMemoryAttemptStore() {
  let rows = []; // { id, email, ip, at }
  let nextId = 1;
  return {
    /** Forget attempts at or before `cutoff` (a timestamp in ms). */
    prune(cutoff) {
      rows = rows.filter((row) => row.at > cutoff);
    },
    counts(email, ip) {
      return {
        byPair: rows.filter((r) => r.email === email && r.ip === ip).length,
        byEmail: rows.filter((r) => r.email === email).length,
        byIp: rows.filter((r) => r.ip === ip).length,
      };
    },
    add(email, ip, at) {
      const id = nextId++;
      rows.push({ id, email, ip, at });
      return id;
    },
    remove(id) {
      rows = rows.filter((row) => row.id !== id);
    },
    clearPair(email, ip) {
      rows = rows.filter((row) => !(row.email === email && row.ip === ip));
    },
    size() {
      return rows.length;
    },
  };
}

/* ------------------------------------------------------------------
   App
   ------------------------------------------------------------------ */

export function createApp({
  dbPath = path.join(__dirname, "db.json"),
  allowedOrigins = (process.env.ALLOWED_ORIGINS || DEFAULT_ALLOWED_ORIGINS)
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  log = console.log,
  // The three below exist so tests can stand in for the database table, the
  // passage of time, and a proxy in front of the server.
  attemptStore = createMemoryAttemptStore(),
  clock = Date.now,
  trustedProxyIpHeader = process.env.TRUSTED_PROXY_IP_HEADER || "",
} = {}) {
  let database = {};
  if (fs.existsSync(dbPath)) {
    try {
      database = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
    } catch {
      log("Could not load db.json, starting fresh");
    }
  }
  for (const table of Object.keys(SCHEMA)) {
    if (!Array.isArray(database[table])) database[table] = [];
  }

  const save = () =>
    fs.writeFileSync(dbPath, JSON.stringify(database, null, 2));
  const now = () => new Date().toISOString();
  const nextId = (table) =>
    Math.max(0, ...database[table].map((row) => row.id || 0)) + 1;

  // A first admin for local work, so there is never a shared default password.
  const usableAdmin = (user) =>
    user.role === "admin" && !isLegacyHash(String(user.password));
  if (!database.users.some(usableAdmin)) {
    const adminEmail = (
      process.env.DEV_ADMIN_EMAIL || "admin@example.test"
    ).toLowerCase();
    const adminPassword =
      process.env.DEV_ADMIN_PASSWORD ||
      crypto.randomBytes(12).toString("base64url");
    database.users = database.users.filter((u) => u.email !== adminEmail);
    database.users.push({
      id: nextId("users"),
      email: adminEmail,
      password: hashPassword(adminPassword),
      name: "Local Admin",
      role: "admin",
      created_at: now(),
      updated_at: now(),
    });
    save();
    log(`Created local admin: ${adminEmail}`);
    if (!process.env.DEV_ADMIN_PASSWORD) {
      log(`Password (shown once, local only): ${adminPassword}`);
    }
  }

  const sessions = new Map(); // token -> { userId, started, lastSeen }

  const publicUser = ({ password, ...user }) => user;

  function readCookie(req, name) {
    const header = req.headers.cookie || "";
    for (const part of header.split(";")) {
      const [key, ...rest] = part.trim().split("=");
      if (key === name) return rest.join("=");
    }
    return null;
  }

  function setSessionCookie(res, token) {
    const expires = token ? "" : "; Expires=Thu, 01 Jan 1970 00:00:00 GMT";
    res.append(
      "Set-Cookie",
      `${SESSION_COOKIE}=${token || ""}; Path=/; HttpOnly; SameSite=Strict${expires}`,
    );
  }

  /** The logged-in admin for this request, or null. */
  function currentAdmin(req, res) {
    if (req.admin !== undefined) return req.admin;
    req.admin = null;

    const token = readCookie(req, SESSION_COOKIE);
    if (!token) return null;

    const session = sessions.get(token);
    const time = Date.now();
    const user = session && database.users.find((u) => u.id === session.userId);
    const expired =
      !session ||
      time - session.lastSeen > SESSION_IDLE_MS ||
      time - session.started > SESSION_MAX_MS;

    if (expired || !user || user.role !== "admin") {
      sessions.delete(token);
      setSessionCookie(res, null);
      return null;
    }

    session.lastSeen = time;
    req.admin = publicUser(user);
    return req.admin;
  }

  function requireAdmin(req, res) {
    const admin = currentAdmin(req, res);
    if (!admin) throw new ApiError(401, "Authentication required");
    return admin;
  }

  function tableDefinition(table) {
    if (typeof table !== "string" || !Object.hasOwn(SCHEMA, table)) {
      throw new ApiError(404, "Unknown resource");
    }
    return SCHEMA[table];
  }

  /* ---- actions ---- */

  /**
   * The caller's address for rate limiting: the socket's, unless a header set
   * by a trusted proxy has been named. Never trusted by default.
   */
  function clientIp(req) {
    if (trustedProxyIpHeader) {
      const value = req.headers[trustedProxyIpHeader.toLowerCase()];
      if (typeof value === "string") {
        // In a list, the last entry is the one the proxy added.
        const candidate = value.split(",").pop().trim();
        if (net.isIP(candidate)) return candidate;
      }
    }
    return req.socket.remoteAddress || "unknown";
  }

  /** `own` is 1 when the counts already include the attempt being judged. */
  function limitReached(counts, own) {
    return (
      counts.byPair >= LOGIN_LIMITS.perPair + own ||
      counts.byEmail >= LOGIN_LIMITS.perEmail + own ||
      counts.byIp >= LOGIN_LIMITS.perIp + own
    );
  }

  /**
   * Applies the login limits and records this attempt; throws a 429 when a
   * limit has been reached. The working limit is per email AND address, so
   * someone hammering an admin's email from elsewhere cannot lock the admin
   * out. If the store fails, the login goes ahead unlimited (and is logged).
   */
  function beginLoginAttempt(res, emailKey, ip) {
    let blocked = false;
    try {
      // Nothing older than the window is needed again.
      attemptStore.prune(clock() - LOGIN_WINDOW_MS);

      if (limitReached(attemptStore.counts(emailKey, ip), 0)) {
        // Already blocked: record nothing, so further tries neither pile up
        // nor push the block further out.
        blocked = true;
      } else {
        // Record first, then count again with this attempt included.
        const id = attemptStore.add(emailKey, ip, clock());
        if (limitReached(attemptStore.counts(emailKey, ip), 1)) {
          attemptStore.remove(id);
          blocked = true;
        }
      }
    } catch (error) {
      log(`[api-server] Login rate limiting is unavailable: ${error.message}`);
      return;
    }

    if (blocked) {
      res.set("Retry-After", String(LOGIN_WINDOW_MS / 1000));
      throw new ApiError(
        429,
        "Too many login attempts. Try again in 15 minutes.",
      );
    }
  }

  function clearLoginAttempts(emailKey, ip) {
    try {
      attemptStore.clearPair(emailKey, ip);
    } catch (error) {
      log(`[api-server] Could not clear login attempts: ${error.message}`);
    }
  }

  function login(req, res) {
    const { email: rawEmail, password } = req.body;
    if (
      typeof rawEmail !== "string" ||
      typeof password !== "string" ||
      !rawEmail.trim() ||
      !password
    ) {
      throw new ApiError(400, "Email and password are required");
    }

    const emailKey = rawEmail.trim().toLowerCase();
    // None of these can match an account.
    if (
      emailKey.length > 255 ||
      !EMAIL_PATTERN.test(emailKey) ||
      Buffer.byteLength(password) > PASSWORD_MAX_BYTES ||
      password.includes("\0")
    ) {
      throw new ApiError(401, "Invalid email or password");
    }
    const ip = clientIp(req);

    beginLoginAttempt(res, emailKey, ip);

    const user = database.users.find(
      (u) => String(u.email).toLowerCase() === emailKey,
    );
    if (user && isLegacyHash(String(user.password))) {
      // The old API exposed these hashes, so one is never accepted. The
      // caller gets the same answer as for a wrong password.
      log(
        `[api-server] Login refused for user id ${user.id}: the account still has a legacy password hash.`,
      );
    }
    if (!user || !verifyPassword(password, user.password)) {
      throw new ApiError(401, "Invalid email or password");
    }

    clearLoginAttempts(emailKey, ip);

    if (user.role !== "admin") {
      throw new ApiError(403, "This account does not have admin access");
    }

    const token = crypto.randomBytes(32).toString("hex");
    sessions.set(token, {
      userId: user.id,
      started: Date.now(),
      lastSeen: Date.now(),
    });
    setSessionCookie(res, token);
    res.json({
      success: true,
      message: "Login successful",
      user: publicUser(user),
    });
  }

  function logout(req, res) {
    const token = readCookie(req, SESSION_COOKIE);
    if (token) {
      sessions.delete(token);
      setSessionCookie(res, null);
    }
    res.json({ success: true, message: "Logged out" });
  }

  function session(req, res) {
    res.json({ success: true, user: requireAdmin(req, res) });
  }

  function createUser(req, res) {
    requireAdmin(req, res);
    const { email: rawEmail, password, name: rawName = "" } = req.body;
    if (
      typeof rawEmail !== "string" ||
      typeof password !== "string" ||
      typeof rawName !== "string"
    ) {
      throw new ApiError(400, "Email and password are required");
    }
    const userEmail = rawEmail.trim().toLowerCase();
    if (userEmail.length > 255 || !EMAIL_PATTERN.test(userEmail)) {
      throw new ApiError(400, "A valid email address is required");
    }
    if (password.length < PASSWORD_MIN_LENGTH) {
      throw new ApiError(
        400,
        `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
      );
    }
    if (Buffer.byteLength(password) > PASSWORD_MAX_BYTES) {
      throw new ApiError(
        400,
        `Password is too long: the limit is ${PASSWORD_MAX_BYTES} bytes (72 plain characters; fewer with accents or emoji)`,
      );
    }
    if (rawName.length > 255) {
      throw new ApiError(400, "Name is too long");
    }
    if (password.includes("\0")) {
      throw new ApiError(400, "Password contains an invalid character");
    }
    if (
      database.users.some((u) => String(u.email).toLowerCase() === userEmail)
    ) {
      throw new ApiError(409, "Email already registered");
    }

    const user = {
      id: nextId("users"),
      email: userEmail,
      password: hashPassword(password),
      name: rawName.trim() || userEmail.split("@")[0],
      role: "admin",
      created_at: now(),
      updated_at: now(),
    };
    database.users.push(user);
    save();
    res
      .status(201)
      .json({ success: true, message: "Admin user created", userId: user.id });
  }

  /* ---- table operations ---- */

  function readTable(req, res) {
    const { table, id, orderBy, order, limit } = req.query;
    const def = tableDefinition(table);
    const admin = currentAdmin(req, res);

    if (!admin && !def.publicFilter) {
      throw new ApiError(401, "Authentication required");
    }

    let rows = [...database[table]];
    if (!admin) rows = rows.filter(def.publicFilter);
    if (id !== undefined) {
      const wanted = positiveId(id);
      rows = rows.filter((row) => row.id === wanted);
    }

    const visible = admin ? def.adminColumns : def.publicColumns;
    const sortable = visible || [
      ...READ_ONLY_COLUMNS,
      ...Object.keys(def.columns),
    ];
    let sortKey = "id";
    let descending = false;
    if (orderBy !== undefined) {
      if (typeof orderBy !== "string" || !sortable.includes(orderBy)) {
        throw new ApiError(400, "Cannot sort by that field");
      }
      sortKey = orderBy;
      descending = String(order).toUpperCase() !== "ASC";
    }
    rows.sort((a, b) => {
      const left = a[sortKey] ?? "";
      const right = b[sortKey] ?? "";
      const result =
        typeof left === "number" && typeof right === "number"
          ? left - right
          : String(left).localeCompare(String(right));
      return descending ? -result : result;
    });

    if (limit !== undefined) {
      const count = Math.max(1, Math.min(1000, parseInt(limit, 10) || 0));
      rows = rows.slice(0, count);
    }

    if (visible) {
      rows = rows.map((row) =>
        Object.fromEntries(
          visible.map((column) => [column, row[column] ?? null]),
        ),
      );
    }
    res.json(rows);
  }

  function insertRow(req, res) {
    const table = req.body.table ?? req.query.table;
    const { data } = req.body;
    const def = tableDefinition(table);
    const admin = currentAdmin(req, res);

    const allowed = admin ? def.adminInsert : def.publicInsert;
    if (!allowed) {
      throw admin
        ? new ApiError(405, "Records cannot be created here")
        : new ApiError(401, "Authentication required");
    }
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      throw new ApiError(400, "Data is required");
    }

    const clean = cleanRow(def, allowed, data, {
      strict: Boolean(admin),
      requireAll: true,
    });
    const blank = Object.fromEntries(
      Object.keys(def.columns).map((column) => [column, null]),
    );
    const row = {
      id: nextId(table),
      ...blank,
      ...(def.insertDefaults || {}),
      ...Object.fromEntries(
        Object.entries(clean).filter(([, value]) => value !== null),
      ),
      created_at: now(),
      updated_at: now(),
    };
    database[table].push(row);
    save();
    res.status(201).json({ success: true, id: row.id });
  }

  function updateRow(req, res) {
    requireAdmin(req, res);
    const table = req.body.table ?? req.query.table;
    const { id, data } = req.body;
    const def = tableDefinition(table);

    if (!def.adminUpdate) {
      throw new ApiError(405, "Records cannot be changed here");
    }
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      throw new ApiError(400, "ID and data are required");
    }
    const wanted = positiveId(id);

    const clean = cleanRow(def, def.adminUpdate, data, {
      strict: true,
      requireAll: false,
    });
    if (Object.keys(clean).length === 0) {
      throw new ApiError(400, "Nothing to update");
    }
    for (const [column, value] of Object.entries(clean)) {
      if (value === null && def.columns[column].required) {
        throw new ApiError(400, `${column} is required`);
      }
    }

    const row = database[table].find((item) => item.id === wanted);
    if (!row) throw new ApiError(404, "Record not found");

    Object.assign(row, clean, { updated_at: now() });
    if (table === "contacts" && clean.response_email != null) {
      row.response_sent_at = now();
    }
    save();
    res.json({ success: true });
  }

  function deleteRow(req, res) {
    requireAdmin(req, res);
    const { table, id } = req.query;
    const def = tableDefinition(table);

    if (!def.adminDelete) {
      throw new ApiError(405, "Records cannot be deleted here");
    }
    const wanted = positiveId(id);
    const index = database[table].findIndex((row) => row.id === wanted);
    if (index === -1) throw new ApiError(404, "Record not found");

    database[table].splice(index, 1);
    save();
    res.json({ success: true });
  }

  /* ---- wiring ---- */

  const app = express();
  app.disable("x-powered-by");

  app.use((req, res, next) => {
    res.set({
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "no-store",
      Vary: "Origin",
    });

    // Same rule as api.php: allow-listed origins, or the host being called.
    const origin = req.headers.origin;
    if (origin) {
      let sameHost = false;
      try {
        sameHost = new URL(origin).host === req.headers.host;
      } catch {
        sameHost = false;
      }
      if (!sameHost && !allowedOrigins.includes(origin.replace(/\/$/, ""))) {
        return res.status(403).json({ error: "Origin not allowed" });
      }
      res.set({
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "600",
      });
    }
    if (req.method === "OPTIONS") return res.sendStatus(204);

    const contentType = String(req.headers["content-type"] || "");
    if (
      (req.method === "POST" || req.method === "PUT") &&
      !contentType.trim().toLowerCase().startsWith("application/json")
    ) {
      return res
        .status(415)
        .json({ error: "Content-Type must be application/json" });
    }
    next();
  });

  app.use(express.json({ limit: "1mb" }));

  app.all("/api.php", (req, res) => {
    const method = req.method;
    if (!["GET", "POST", "PUT", "DELETE"].includes(method)) {
      throw new ApiError(405, "Method not allowed");
    }
    if (method === "POST" || method === "PUT") {
      if (
        !req.body ||
        typeof req.body !== "object" ||
        Array.isArray(req.body)
      ) {
        throw new ApiError(400, "Request body must be a JSON object");
      }
    } else {
      req.body = {};
    }

    const action = req.body.action ?? req.query.action ?? null;
    if (action !== null) {
      if (action === "session" && method === "GET") return session(req, res);
      if (method !== "POST") throw new ApiError(405, "Method not allowed");
      switch (action) {
        case "check_connection":
          return res.json({ success: true, message: "API is ready" });
        case "login":
          return login(req, res);
        case "logout":
          return logout(req, res);
        case "session":
          return session(req, res);
        case "create_user":
          return createUser(req, res);
        default:
          // register, create_table and init_*_table no longer exist.
          throw new ApiError(400, "Unknown action");
      }
    }

    if ((req.body.table ?? req.query.table) === undefined) {
      throw new ApiError(400, "Table name is required");
    }
    if (method === "GET") return readTable(req, res);
    if (method === "POST") return insertRow(req, res);
    if (method === "PUT") return updateRow(req, res);
    return deleteRow(req, res);
  });

  // Errors never include internals.
  app.use((error, req, res, next) => {
    if (error instanceof ApiError) {
      return res.status(error.status).json({ error: error.message });
    }
    if (error?.type === "entity.parse.failed") {
      return res
        .status(400)
        .json({ error: "Request body must be a JSON object" });
    }
    log(`[api-server] ${error?.stack || error}`);
    res.status(500).json({ error: "Server error. Please try again later." });
  });

  return app;
}

// Start only when run directly (`node api-server.js`), not when imported.
if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  const PORT = 8000;
  createApp().listen(PORT, "localhost", () => {
    console.log(`API server running on http://localhost:${PORT}`);
    console.log(`Database file: ${path.join(__dirname, "db.json")}`);
  });
}
