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

import reviewRouter from "./src/routes/review.routes.js";
import notificationRouter from "./src/routes/notification.routes.js";
import creditsRouter from "./src/routes/credits.routes.js";
import adminRouter from "./src/routes/admin.routes.js";
import coursesRouter from "./src/routes/courses.routes.js";
import chatRouter from "./src/routes/chat.routes.js";

import ChatMessage from "./src/models/chatMessage.model.js";
import Session from "./src/models/session.model.js";

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
  
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
  });

  socket.on("send_message", async (data) => {
    // Persist message to DB
    try {
      await ChatMessage.create({
        session: data.roomId,
        sender: data.senderId,
        senderName: data.senderName,
        message: data.message,
        timestamp: data.timestamp || new Date(),
      });
    } catch (err) {
      console.error("[socket:send_message] Failed to save:", err.message);
    }
    io.to(data.roomId).emit("receive_message", data);
  });

  // --- Call readiness tracking ---
  // When a user clicks "Start Call", they signal readiness
  socket.on("call_ready", async (data) => {
    const { sessionId } = data;
    const room = `call:${sessionId}`;
    socket.join(room);

    // Count how many unique sockets are in the call room
    const sockets = await io.in(room).fetchSockets();
    const uniqueUsers = new Set(sockets.map((s) => s.userId));

    if (uniqueUsers.size >= 2) {
      // Both users are ready — start the call timer on the server
      try {
        const session = await Session.findById(sessionId);
        if (session && !session.callStartedAt) {
          session.callStartedAt = new Date();
          await session.save();
        }
      } catch (err) {
        console.error("[socket:call_ready]", err.message);
      }
      // Notify both users the call is active
      io.to(room).emit("call_active", { sessionId });
    } else {
      // Only one user ready, tell them to wait
      socket.emit("call_waiting", { sessionId });
    }
  });

  // When a user ends call or leaves
  socket.on("call_leave", async (data) => {
    const { sessionId } = data;
    const room = `call:${sessionId}`;
    socket.leave(room);

    // Finalize duration on server
    try {
      const session = await Session.findById(sessionId);
      if (session && session.callStartedAt) {
        const elapsed = Math.round(
          (Date.now() - session.callStartedAt.getTime()) / 60000
        );
        session.actualCallMinutes += elapsed;
        session.callStartedAt = null;
        await session.save();
        // Notify remaining user
        io.to(room).emit("call_paused", {
          sessionId,
          actualCallMinutes: session.actualCallMinutes,
        });
        io.to(sessionId).emit("call_duration_update", {
          actualCallMinutes: session.actualCallMinutes,
        });
      }
    } catch (err) {
      console.error("[socket:call_leave]", err.message);
    }
  });

  socket.on("webrtc_signal", (data) => {
    socket.to(data.roomId).emit("webrtc_signal", data);
  });

  socket.on("disconnect", async () => {
    // Auto-leave any call rooms on disconnect
    // Socket.io auto-removes from rooms on disconnect, but we need to handle the call timer
  });
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

app.use("/reviews", reviewRouter);
app.use("/notifications", notificationRouter);
app.use("/credits", creditsRouter);
app.use("/admin", adminRouter);
app.use("/courses", coursesRouter);
app.use("/chat", chatRouter);

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

