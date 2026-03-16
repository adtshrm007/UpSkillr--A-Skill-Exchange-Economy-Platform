import "dotenv/config";
import express from "express";
import { createServer } from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";
import { initIO } from "./src/utils/socket.js";

import { connectDB } from "./src/utils/connectDB.js";
import userRouter from "./src/routes/user.routes.js";
import matchesRouter from "./src/routes/matches.route.js";
import sessionRouter from "./src/routes/session.routes.js";
import swapRouter from "./src/routes/swap.routes.js";
import reviewRouter from "./src/routes/review.routes.js";
import notificationRouter from "./src/routes/notification.routes.js";
import creditsRouter from "./src/routes/credits.routes.js";
import adminRouter from "./src/routes/admin.routes.js";

const app = express();
const httpServer = createServer(app);

// ---------- Socket.io Setup ----------
export const io = initIO(httpServer);

// Socket auth middleware
io.use((socket, next) => {
  const cookie = socket.handshake.headers.cookie || "";
  const tokenMatch = cookie.match(/accessToken=([^;]+)/);
  if (!tokenMatch) return next(new Error("Unauthorized"));
  try {
    const decoded = jwt.verify(tokenMatch[1], process.env.ACCESS_TOKEN_SECRET);
    socket.userId = decoded._id.toString();
    next();
  } catch {
    next(new Error("Invalid token"));
  }
});

io.on("connection", (socket) => {
  socket.join(`user:${socket.userId}`);
  socket.on("disconnect", () => { });
});

// ---------- Core Middleware ----------
app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan("dev"));
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Global rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// ---------- Routes ----------
app.get("/", (_req, res) => res.json({ status: "ok", app: "UpSkillr API" }));
app.use("/user", userRouter);
app.use("/matches", matchesRouter);
app.use("/sessions", sessionRouter);
app.use("/swaps", swapRouter);
app.use("/reviews", reviewRouter);
app.use("/notifications", notificationRouter);
app.use("/credits", creditsRouter);
app.use("/admin", adminRouter);

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || "Server Error" });
});

// ---------- Boot ----------
const port = process.env.PORT || 6000;
connectDB()
  .then(() => {
    httpServer.listen(port, () => {
      console.log(`✅ Server running on port ${port} — MongoDB connected`);
    });
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err.message);
    process.exit(1);
  });
