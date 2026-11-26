// @vitest-environment node
/**
 * Access-control tests, run against the local mock (api-server.js), which
 * follows the same rules as api.php.
 */
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  LOGIN_LIMITS,
  createApp,
  createMemoryAttemptStore,
  hashPassword,
} from "./api-server.js";

const ADMIN_EMAIL = "admin@example.test";
const ADMIN_PASSWORD = "correct-horse-battery";
const LEGACY_EMAIL = "legacy@example.test";
const LEGACY_PASSWORD = "legacy-password-1";

const STAFF_EMAIL = "staff@example.test";
const STAFF_PASSWORD = "staff-password-1";
const WINDOW_MS = 15 * 60 * 1000;

let server;
let baseUrl;
let dbPath;
let tmpDir;
let logs = [];
const extraServers = [];

const readDb = () => JSON.parse(fs.readFileSync(dbPath, "utf-8"));

/** Minimal client that keeps the session cookie between calls, like a browser. */
function client(base = baseUrl) {
  let cookie = "";
  return {
    get cookie() {
      return cookie;
    },
    async request(method, query = "", body, headers = {}) {
      const response = await fetch(`${base}/api.php${query}`, {
        method,
        headers: {
          ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
          ...(cookie ? { Cookie: cookie } : {}),
          ...headers,
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
      for (const header of response.headers.getSetCookie()) {
        const [pair] = header.split(";");
        cookie = pair.endsWith("=") ? "" : pair;
      }
      const text = await response.text();
      return {
        status: response.status,
        headers: response.headers,
        body: text ? JSON.parse(text) : null,
      };
    },
    get(query) {
      return this.request("GET", query);
    },
    post(body, headers) {
      return this.request("POST", "", body, headers);
    },
    put(body) {
      return this.request("PUT", "", body);
    },
    delete(query) {
      return this.request("DELETE", query);
    },
  };
}

async function signedInAdmin() {
  const admin = client();
  const login = await admin.post({
    action: "login",
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });
  expect(login.status).toBe(200);
  return admin;
}

const seedUsers = () => [
  {
    id: 1,
    email: ADMIN_EMAIL,
    password: hashPassword(ADMIN_PASSWORD),
    name: "Admin",
    role: "admin",
  },
  {
    id: 2,
    email: STAFF_EMAIL,
    password: hashPassword(STAFF_PASSWORD),
    name: "Staff",
    role: "user",
  },
  // An account from before this change: an unsalted SHA-256 hash.
  {
    id: 3,
    email: LEGACY_EMAIL,
    password: crypto.createHash("sha256").update(LEGACY_PASSWORD).digest("hex"),
    name: "Legacy",
    role: "admin",
  },
];

/**
 * A separate server with its own database, for tests that need their own
 * clock, attempts store or proxy header.
 */
async function startApp(options = {}) {
  const file = path.join(tmpDir, `db-${extraServers.length}.json`);
  fs.writeFileSync(file, JSON.stringify({ users: seedUsers() }));

  const appLogs = [];
  let timeOffset = 0;
  const app = createApp({
    dbPath: file,
    log: (line) => appLogs.push(String(line)),
    clock: () => Date.now() + timeOffset,
    ...options,
  });
  const listener = await new Promise((resolve) => {
    const started = app.listen(0, "127.0.0.1", () => resolve(started));
  });
  extraServers.push(listener);

  const base = `http://127.0.0.1:${listener.address().port}`;
  return {
    base,
    logs: appLogs,
    advance(ms) {
      timeOffset += ms;
    },
    /** One login attempt, optionally as if from another address. */
    login(email, password, headers = {}) {
      return client(base).post({ action: "login", email, password }, headers);
    },
  };
}

beforeAll(async () => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "mwamunda-api-"));
  dbPath = path.join(tmpDir, "db.json");

  fs.writeFileSync(
    dbPath,
    JSON.stringify({
      users: seedUsers(),
      careers: [
        { id: 1, position_title: "Loan Officer", status: "active" },
        { id: 2, position_title: "Draft role", status: "draft" },
        {
          id: 3,
          position_title: "Closed role",
          status: "active",
          validity_end_date: "2020-01-01",
        },
      ],
      products: [
        { id: 1, name: "Chama Loan", status: "active" },
        { id: 2, name: "Unreleased", status: "inactive" },
      ],
    }),
  );

  const app = createApp({ dbPath, log: (line) => logs.push(String(line)) });
  await new Promise((resolve) => {
    server = app.listen(0, "127.0.0.1", resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

afterAll(async () => {
  for (const listener of [server, ...extraServers]) {
    await new Promise((resolve) => listener.close(resolve));
  }
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe("public access", () => {
  it("accepts a contact form submission without a login", async () => {
    const result = await client().post({
      table: "contacts",
      data: {
        name: "Amina",
        email: "amina@example.test",
        phone: "0700000000",
        subject: "Loan question",
        message: "How do I apply?",
        // Fields a visitor must not control are dropped, not stored.
        status: "responded",
        internal_notes: "injected",
        "name) VALUES (1); --": "x",
      },
    });
    expect(result.status).toBe(201);
    expect(result.body.success).toBe(true);

    const saved = readDb().contacts.find((c) => c.id === result.body.id);
    expect(saved.status).toBe("new");
    expect(saved.internal_notes).toBeNull();
    expect(Object.keys(saved)).not.toContain("name) VALUES (1); --");
  });

  it("validates public submissions", async () => {
    const missing = await client().post({
      table: "contacts",
      data: { name: "Amina", email: "amina@example.test" },
    });
    expect(missing.status).toBe(400);

    const badEmail = await client().post({
      table: "contacts",
      data: { name: "A", email: "not-an-email", subject: "s", message: "m" },
    });
    expect(badEmail.status).toBe(400);

    const badAmount = await client().post({
      table: "applications",
      data: {
        product_type: "chama-loans",
        full_name: "Amina",
        email: "amina@example.test",
        phone: "0700000000",
        requested_amount: "lots",
      },
    });
    expect(badAmount.status).toBe(400);
  });

  it("accepts a loan application and forces its status to pending", async () => {
    const result = await client().post({
      table: "applications",
      data: {
        product_type: "chama-loans",
        full_name: "Amina",
        email: "amina@example.test",
        phone: "0700000000",
        national_id: "12345678",
        requested_amount: 50000,
        status: "approved",
        approved_amount: 999999,
      },
    });
    expect(result.status).toBe(201);

    const saved = readDb().applications.find((a) => a.id === result.body.id);
    expect(saved.status).toBe("pending");
    expect(saved.approved_amount).toBeNull();
    expect(saved.requested_amount).toBe("50000.00");
  });

  it("shows only live careers and active products", async () => {
    const careers = await client().get("?table=careers");
    expect(careers.status).toBe(200);
    expect(careers.body.map((c) => c.position_title)).toEqual(["Loan Officer"]);

    const products = await client().get("?table=products");
    expect(products.status).toBe(200);
    expect(products.body.map((p) => p.name)).toEqual(["Chama Loan"]);

    const hidden = await client().get("?table=products&id=2");
    expect(hidden.body).toEqual([]);
  });
});

describe("protected access without a login", () => {
  it.each(["users", "applications", "contacts"])(
    "refuses to list %s",
    async (table) => {
      const result = await client().get(`?table=${table}`);
      expect(result.status).toBe(401);
      expect(result.body).toEqual({ error: "Authentication required" });
    },
  );

  it("refuses writes", async () => {
    const anonymous = client();
    expect(
      (await anonymous.post({ table: "products", data: { name: "x" } })).status,
    ).toBe(401);
    expect(
      (
        await anonymous.post({
          table: "users",
          data: { email: "evil@example.test", password: "x", role: "admin" },
        })
      ).status,
    ).toBe(401);
    expect(
      (
        await anonymous.put({
          table: "applications",
          id: 1,
          data: { status: "approved" },
        })
      ).status,
    ).toBe(401);
    expect((await anonymous.delete("?table=contacts&id=1")).status).toBe(401);
    expect((await anonymous.get("?action=session")).status).toBe(401);
  });

  it("no longer offers registration, table creation or table setup", async () => {
    const anonymous = client();
    for (const action of [
      "register",
      "create_table",
      "init_users_table",
      "init_contacts_table",
    ]) {
      const result = await anonymous.post({
        action,
        table: "users",
        email: "evil@example.test",
        password: "long-enough-password",
        columns: { x: "TEXT" },
      });
      expect(result.status).toBe(400);
    }
    expect(
      (
        await anonymous.post({
          action: "create_user",
          email: "evil@example.test",
          password: "long-enough-password",
        })
      ).status,
    ).toBe(401);
    expect(readDb().users.map((u) => u.email)).not.toContain(
      "evil@example.test",
    );
  });

  it("rejects tables that are not on the allow-list", async () => {
    const admin = await signedInAdmin();
    expect((await admin.get("?table=login_attempts")).status).toBe(404);
    expect((await admin.get("?table=users;DROP TABLE users")).status).toBe(404);
    expect((await client().get("?table=__proto__")).status).toBe(404);
  });
});

describe("login, session and logout", () => {
  it("rejects a wrong password with 401 and sets no cookie", async () => {
    const visitor = client();
    const result = await visitor.post({
      action: "login",
      email: ADMIN_EMAIL,
      password: "wrong-password",
    });
    expect(result.status).toBe(401);
    expect(result.body.error).toBe("Invalid email or password");
    expect(visitor.cookie).toBe("");
  });

  it("signs in with an HttpOnly, SameSite=Strict cookie and no token in the body", async () => {
    const response = await fetch(`${baseUrl}/api.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "login",
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      }),
    });
    expect(response.status).toBe(200);

    const [cookie] = response.headers.getSetCookie();
    expect(cookie).toMatch(/^mwamunda_admin=[a-f0-9]{64};/);
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("SameSite=Strict");

    const body = await response.json();
    expect(body.user.email).toBe(ADMIN_EMAIL);
    expect(body.user.password).toBeUndefined();
    expect(body.token).toBeUndefined();
  });

  it("lets a signed-in admin read protected data, never with password hashes", async () => {
    const admin = await signedInAdmin();

    const session = await admin.get("?action=session");
    expect(session.status).toBe(200);
    expect(session.body.user.email).toBe(ADMIN_EMAIL);

    const users = await admin.get("?table=users");
    expect(users.status).toBe(200);
    expect(users.body.length).toBeGreaterThan(0);
    for (const user of users.body) {
      expect(user.password).toBeUndefined();
    }

    expect((await admin.get("?table=applications")).status).toBe(200);
    // Admins see unpublished rows too.
    expect((await admin.get("?table=careers")).body).toHaveLength(3);
  });

  it("ends the session on logout", async () => {
    const admin = await signedInAdmin();
    const staleCookie = admin.cookie;
    expect((await admin.get("?table=contacts")).status).toBe(200);

    const logout = await admin.post({ action: "logout" });
    expect(logout.status).toBe(200);
    expect(admin.cookie).toBe("");
    expect((await admin.get("?table=contacts")).status).toBe(401);

    // The old cookie is dead on the server, not just forgotten by the browser.
    const replay = await fetch(`${baseUrl}/api.php?table=contacts`, {
      headers: { Cookie: staleCookie },
    });
    expect(replay.status).toBe(401);
  });

  it("does not accept a forged or guessed session cookie", async () => {
    const forged = Buffer.from(
      JSON.stringify({ id: 1, email: ADMIN_EMAIL, role: "admin" }),
    ).toString("base64");
    const result = await fetch(`${baseUrl}/api.php?table=users`, {
      headers: { Cookie: `mwamunda_admin=${forged}` },
    });
    expect(result.status).toBe(401);
  });

  it("refuses a legacy SHA-256 hash exactly like a wrong password", async () => {
    const before = readDb().users.find((u) => u.email === LEGACY_EMAIL);
    expect(before.password).toMatch(/^[a-f0-9]{64}$/);

    const visitor = client();
    const result = await visitor.post({
      action: "login",
      email: LEGACY_EMAIL,
      password: LEGACY_PASSWORD, // the right password for that old hash
    });
    const wrong = await client().post({
      action: "login",
      email: ADMIN_EMAIL,
      password: "wrong-password",
    });

    // Same status and body as any failed login: no hint the account is legacy.
    expect(result.status).toBe(401);
    expect(result.body).toEqual(wrong.body);
    expect(visitor.cookie).toBe("");

    // The hash is left alone (an admin must reset it), and the refusal is logged.
    const after = readDb().users.find((u) => u.email === LEGACY_EMAIL);
    expect(after.password).toBe(before.password);
    expect(logs.some((line) => line.includes("legacy password hash"))).toBe(
      true,
    );
  });

  it("lets an admin create another admin, with a 72-byte password limit", async () => {
    const admin = await signedInAdmin();

    const tooLong = await admin.post({
      action: "create_user",
      email: "second@example.test",
      password: "x".repeat(73),
    });
    expect(tooLong.status).toBe(400);
    expect(tooLong.body.error).toContain("72 bytes");

    // 30 characters, but 90 bytes: over the limit too.
    const multibyte = await admin.post({
      action: "create_user",
      email: "second@example.test",
      password: "\u20ac".repeat(30),
    });
    expect(multibyte.status).toBe(400);

    const created = await admin.post({
      action: "create_user",
      email: "second@example.test",
      password: "x".repeat(72),
      name: "Second",
    });
    expect(created.status).toBe(201);

    const login = await client().post({
      action: "login",
      email: "second@example.test",
      password: "x".repeat(72),
    });
    expect(login.status).toBe(200);

    // Longer than any stored password can be: refused without a lookup.
    const overLong = await client().post({
      action: "login",
      email: "second@example.test",
      password: "x".repeat(73),
    });
    expect(overLong.status).toBe(401);
  });

  it("refuses accounts that are not admins", async () => {
    const staff = client();
    const result = await staff.post({
      action: "login",
      email: STAFF_EMAIL,
      password: STAFF_PASSWORD,
    });
    expect(result.status).toBe(403);
    expect(staff.cookie).toBe("");
  });

  it("locks out repeated failed logins with 429", async () => {
    const attacker = client();
    const target = "victim@example.test";
    let last;
    for (let attempt = 0; attempt <= LOGIN_LIMITS.perPair; attempt++) {
      last = await attacker.post({
        action: "login",
        email: target,
        password: `guess-${attempt}`,
      });
    }
    expect(last.status).toBe(429);
    expect(last.headers.get("retry-after")).toBe("900");
  });
});

describe("login rate limiting", () => {
  const ATTACKER = { "X-Client-IP": "203.0.113.9" };
  const ADMIN_HOME = { "X-Client-IP": "198.51.100.7" };

  async function fail(app, email, times, headers) {
    const statuses = [];
    for (let attempt = 0; attempt < times; attempt++) {
      const result = await app.login(email, `guess-${attempt}`, headers);
      statuses.push(result.status);
    }
    return statuses;
  }

  it("does not let someone else lock an admin out of their own email", async () => {
    const app = await startApp({ trustedProxyIpHeader: "X-Client-IP" });

    const statuses = await fail(
      app,
      ADMIN_EMAIL,
      LOGIN_LIMITS.perPair + 5,
      ATTACKER,
    );
    expect(statuses.slice(0, LOGIN_LIMITS.perPair)).toEqual(
      Array(LOGIN_LIMITS.perPair).fill(401),
    );
    expect(statuses.slice(LOGIN_LIMITS.perPair)).toEqual(Array(5).fill(429));

    // The attacker is blocked; the admin, from their own address, is not.
    const admin = await app.login(ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_HOME);
    expect(admin.status).toBe(200);
    const attacker = await app.login(ADMIN_EMAIL, ADMIN_PASSWORD, ATTACKER);
    expect(attacker.status).toBe(429);
  });

  it("does not extend a block when blocked attempts keep coming", async () => {
    const app = await startApp();

    await fail(app, ADMIN_EMAIL, LOGIN_LIMITS.perPair);
    // One try a minute for the rest of the window: all refused...
    for (let minute = 1; minute <= 14; minute++) {
      app.advance(60 * 1000);
      expect((await app.login(ADMIN_EMAIL, "still-guessing")).status).toBe(429);
    }
    // ...and none of them counted, so the block ends with the window.
    app.advance(60 * 1000 + 1000);
    expect((await app.login(ADMIN_EMAIL, ADMIN_PASSWORD)).status).toBe(200);
  });

  it("keeps the attempts table bounded, without needing a successful login", async () => {
    const store = createMemoryAttemptStore();
    const app = await startApp({ attemptStore: store });

    await fail(app, ADMIN_EMAIL, LOGIN_LIMITS.perPair + 40);
    // Blocked attempts are not stored.
    expect(store.size()).toBe(LOGIN_LIMITS.perPair);

    // Once the window has passed, the next attempt of any kind clears them.
    app.advance(WINDOW_MS + 1000);
    await app.login("someone-else@example.test", "a-wrong-password");
    expect(store.size()).toBe(1);
  });

  it("still signs admins in when the attempts table is unavailable", async () => {
    const broken = () => {
      throw new Error("Table 'login_attempts' doesn't exist");
    };
    const app = await startApp({
      attemptStore: {
        prune: broken,
        counts: broken,
        add: broken,
        remove: broken,
        clearPair: broken,
        size: () => 0,
      },
    });

    expect((await app.login(ADMIN_EMAIL, "wrong-password")).status).toBe(401);
    expect((await app.login(ADMIN_EMAIL, ADMIN_PASSWORD)).status).toBe(200);
    expect(
      app.logs.some((line) => line.includes("rate limiting is unavailable")),
    ).toBe(true);
  });

  it("does not lock a shared address out after a handful of failures", async () => {
    const app = await startApp();

    // 30 failures from one address, spread over other emails.
    for (let n = 0; n < 30; n++) {
      const result = await app.login(`nobody-${n}@example.test`, "a-guess");
      expect(result.status).toBe(401);
    }
    expect((await app.login(ADMIN_EMAIL, ADMIN_PASSWORD)).status).toBe(200);
  });

  it("stops one address that keeps going across many emails", async () => {
    const store = createMemoryAttemptStore();
    const app = await startApp({ attemptStore: store });

    // Fill the per-address allowance directly, then try once more.
    for (let n = 0; n < LOGIN_LIMITS.perIp; n++) {
      store.add(`nobody-${n}@example.test`, "127.0.0.1", Date.now());
    }
    const result = await app.login(ADMIN_EMAIL, ADMIN_PASSWORD);
    expect(result.status).toBe(429);
    expect(store.size()).toBe(LOGIN_LIMITS.perIp);
  });

  it("ignores forwarded-address headers unless one is configured", async () => {
    // Not configured: a different X-Forwarded-For each time changes nothing.
    const plain = await startApp();
    let last;
    for (let n = 0; n <= LOGIN_LIMITS.perPair; n++) {
      last = await plain.login(ADMIN_EMAIL, `guess-${n}`, {
        "X-Forwarded-For": `198.51.100.${n}`,
        "X-Client-IP": `198.51.100.${n}`,
      });
    }
    expect(last.status).toBe(429);

    // Configured: the last entry (the one the proxy adds) is used, so a
    // client-supplied first entry cannot dodge the limit.
    const proxied = await startApp({ trustedProxyIpHeader: "X-Forwarded-For" });
    for (let n = 0; n <= LOGIN_LIMITS.perPair; n++) {
      last = await proxied.login(ADMIN_EMAIL, `guess-${n}`, {
        "X-Forwarded-For": `10.0.0.${n}, 203.0.113.9`,
      });
    }
    expect(last.status).toBe(429);

    // A value that is not an address falls back to the connection's own.
    const junk = await proxied.login(ADMIN_EMAIL, ADMIN_PASSWORD, {
      "X-Forwarded-For": "not-an-address",
    });
    expect(junk.status).toBe(200);
  });
});

describe("admin writes", () => {
  it("only changes allow-listed columns", async () => {
    const admin = await signedInAdmin();
    const created = await client().post({
      table: "applications",
      data: {
        product_type: "chama-loans",
        full_name: "Baraka",
        email: "baraka@example.test",
        phone: "0711111111",
      },
    });
    const id = created.body.id;

    const approve = await admin.put({
      table: "applications",
      id,
      data: { status: "approved", approved_amount: 25000 },
    });
    expect(approve.status).toBe(200);

    const tamper = await admin.put({
      table: "applications",
      id,
      data: { "status = 'x', national_id": "1" },
    });
    expect(tamper.status).toBe(400);

    const users = await admin.put({
      table: "users",
      id: 1,
      data: { role: "admin", password: "x" },
    });
    expect(users.status).toBe(405);

    expect((await admin.delete("?table=users&id=2")).status).toBe(405);
    expect((await admin.delete(`?table=applications&id=${id}`)).status).toBe(
      200,
    );
    expect((await admin.delete(`?table=applications&id=${id}`)).status).toBe(
      404,
    );
  });

  it("creates and edits careers, ignoring read-only fields sent back by the form", async () => {
    const admin = await signedInAdmin();
    const created = await admin.post({
      table: "careers",
      data: {
        position_title: "Branch Manager",
        description: "Run the branch",
        qualifications: "Experience",
        status: "active",
        image_url: "javascript:alert(1)",
      },
    });
    expect(created.status).toBe(400);

    // No status sent: it defaults to "active", as the database column does.
    const ok = await admin.post({
      table: "careers",
      data: {
        position_title: "Branch Manager",
        description: "Run the branch",
        qualifications: "Experience",
      },
    });
    expect(ok.status).toBe(201);
    expect(readDb().careers.find((c) => c.id === ok.body.id).status).toBe(
      "active",
    );

    const edit = await admin.put({
      table: "careers",
      id: ok.body.id,
      data: {
        id: ok.body.id,
        created_at: "2020-01-01",
        updated_at: "2020-01-01",
        position_title: "Senior Branch Manager",
      },
    });
    expect(edit.status).toBe(200);
  });
});

describe("cross-origin requests", () => {
  it("answers only the site's own origins", async () => {
    const foreign = await client().post(
      {
        table: "contacts",
        data: {
          name: "x",
          email: "x@example.test",
          subject: "s",
          message: "m",
        },
      },
      { Origin: "https://evil.example" },
    );
    expect(foreign.status).toBe(403);
    expect(foreign.headers.get("access-control-allow-origin")).toBeNull();

    const own = await client().request("GET", "?table=products", undefined, {
      Origin: "http://localhost:8080",
    });
    expect(own.status).toBe(200);
    expect(own.headers.get("access-control-allow-origin")).toBe(
      "http://localhost:8080",
    );
    expect(own.headers.get("access-control-allow-credentials")).toBe("true");
  });

  it("requires a JSON body for writes", async () => {
    const response = await fetch(`${baseUrl}/api.php`, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ action: "login", email: "a", password: "b" }),
    });
    expect(response.status).toBe(415);
  });
});
