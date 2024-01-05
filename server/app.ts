import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";

import type { Request, Response, NextFunction } from "express";

const PORT = 8080;
const app = express();
const database = { data: "Hello World" };

// Secret stored here instead of in .env for demonstration
const ACCESS_TOKEN_SECRET =
  "56f7b247ebb63451cf3f75abbe94114c502517e87ff69a5862b93e739ee5abdd640d680b8d451a65ccd41c14c8f83b67845184a834055b77c645597c658e7f11";

app.use(cors());
app.use(express.json());

// Routes

app.get("/", authenticateToken, (_req, res) => {
  res.json(database);
});

app.post("/", authenticateToken, (req, res) => {
  const { data } = req.body;
  database.data = data;
  res.sendStatus(200);
});

// Sample route to simulate a successful login
app.post("/login", (req, res) => {
  const username = req.body.username;
  const user = { name: username };

  const accessToken = jwt.sign(user, ACCESS_TOKEN_SECRET);
  res.json({ accessToken: accessToken });
});

// Middleware to verify jwt
function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.body.user = user;
    next();
  });
}

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
