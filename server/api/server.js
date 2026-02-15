const jsonServer = require("json-server");
const server = jsonServer.create();
const middlewares = jsonServer.defaults();

// For write operations (won't persist on Vercel, but works locally)
const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "../db.json");
const data = fs.readFileSync(filePath, "utf-8");
const db = JSON.parse(data);
const router = jsonServer.router(db);

server.use(middlewares);

// CORS for frontend
const allowedOrigins = [
  "https://students-affairs-system.vercel.app", // Your frontend
  "http://localhost:8080", // Local development
  "http://localhost:5173", // Vite default port
];

server.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  );
  res.header("Access-Control-Allow-Credentials", "true");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

server.use(
  jsonServer.rewriter({
    "/api/*": "/$1",
  }),
);

server.use(router);

server.use(router);

// REMOVE THIS for Vercel - keep only for local testing
if (process.env.NODE_ENV !== "production") {
  server.listen(3000, () => {
    console.log("JSON Server is running on http://localhost:3000");
  });
}

module.exports = server;
