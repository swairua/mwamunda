import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory database (with file persistence)
const dbPath = path.join(__dirname, "db.json");

let database = {
  users: [],
  products: [],
  applications: [],
};

// Load database from file if it exists
if (fs.existsSync(dbPath)) {
  try {
    database = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
  } catch (e) {
    console.log("Could not load db.json, starting fresh");
  }
}

// Save database to file
function saveDatabase() {
  fs.writeFileSync(dbPath, JSON.stringify(database, null, 2));
}

// Initialize tables
function initTable(tableName) {
  if (!database[tableName]) {
    database[tableName] = [];
  }
  return { success: true, message: `${tableName} table initialized` };
}

// Utility functions
function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function verifyPassword(password, hash) {
  return crypto.createHash("sha256").update(password).digest("hex") === hash;
}

// Routes

// Handle OPTIONS requests for CORS
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
    );
    res.header("Access-Control-Allow-Headers", "Content-Type");
    return res.sendStatus(200);
  }
  next();
});

// Handle initialization and POST requests
app.post("/api.php", (req, res) => {
  const { action, table, data, email, password, name } = req.body;

  if (action === "init_users_table") {
    const result = initTable("users");
    return res.json(result);
  }

  if (action === "init_products_table") {
    const result = initTable("products");
    return res.json(result);
  }

  if (action === "init_applications_table") {
    const result = initTable("applications");
    return res.json(result);
  }

  if (action === "register") {
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const existingUser = database.users.find((u) => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const user = {
      id: database.users.length + 1,
      email,
      password: hashPassword(password),
      name: name || email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    database.users.push(user);
    saveDatabase();

    res.json({
      success: true,
      message: "User registered successfully",
      userId: user.id,
    });
    return;
  }

  if (action === "login") {
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const user = database.users.find((u) => u.email === email);
    if (!user || !verifyPassword(password, user.password)) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        created_at: user.created_at,
      },
    });
    return;
  }

  if (table && data) {
    if (!database[table]) {
      return res.status(400).json({ error: `Table ${table} not found` });
    }

    const newItem = {
      id: Math.max(0, ...database[table].map((item) => item.id || 0)) + 1,
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    database[table].push(newItem);
    saveDatabase();

    res.json({
      success: true,
      id: newItem.id,
      data: newItem,
    });
    return;
  }

  res.status(400).json({ error: "Invalid request" });
});

// Handle GET requests
app.get("/api.php", (req, res) => {
  const { table, id, orderBy, order, limit } = req.query;

  if (!table || !database[table]) {
    return res.status(400).json({ error: "Invalid table" });
  }

  let results = [...database[table]];

  // Filter by ID if provided
  if (id) {
    results = results.filter((item) => item.id === parseInt(id));
  }

  // Sort by field if provided
  if (orderBy && results.length > 0 && orderBy in results[0]) {
    results.sort((a, b) => {
      const aVal = a[orderBy];
      const bVal = b[orderBy];

      if (typeof aVal === "string") {
        return order === "DESC"
          ? bVal.localeCompare(aVal)
          : aVal.localeCompare(bVal);
      }

      return order === "DESC" ? bVal - aVal : aVal - bVal;
    });
  }

  // Limit results
  if (limit) {
    results = results.slice(0, parseInt(limit));
  }

  res.json(results);
});

// Handle PUT requests (updates)
app.put("/api.php", (req, res) => {
  const { table, id, data } = req.body;

  if (!table || !database[table] || !id) {
    return res.status(400).json({ error: "Invalid table or ID" });
  }

  const itemIndex = database[table].findIndex((item) => item.id === id);
  if (itemIndex === -1) {
    return res.status(404).json({ error: "Item not found" });
  }

  database[table][itemIndex] = {
    ...database[table][itemIndex],
    ...data,
    updated_at: new Date().toISOString(),
  };

  saveDatabase();

  res.json({
    success: true,
    data: database[table][itemIndex],
  });
});

// Handle DELETE requests
app.delete("/api.php", (req, res) => {
  const { table, id } = req.query;

  if (!table || !database[table] || !id) {
    return res.status(400).json({ error: "Invalid table or ID" });
  }

  const itemIndex = database[table].findIndex(
    (item) => item.id === parseInt(id),
  );
  if (itemIndex === -1) {
    return res.status(404).json({ error: "Item not found" });
  }

  const deletedItem = database[table].splice(itemIndex, 1);
  saveDatabase();

  res.json({
    success: true,
    message: "Item deleted",
    data: deletedItem[0],
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
  console.log(`Database file: ${dbPath}`);
});
