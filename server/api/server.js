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
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

server.use(
  jsonServer.rewriter({
    "/api/*": "/$1",
  }),
);

server.use(router);

// REMOVE THIS for Vercel - keep only for local testing
if (process.env.NODE_ENV !== "production") {
  server.listen(3000, () => {
    console.log("JSON Server is running on http://localhost:3000");
  });
}

module.exports = server;
