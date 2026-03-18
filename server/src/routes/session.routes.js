import express from "express";
import {
  bookSession,
  listMySessions,
  getSessionById,
  cancelSession,
  completeSession,
} from "../controllers/session.controller.js";
import { verifyAccessToken } from "../middleware/authVerify.js";

const router = express.Router();

router.use(verifyAccessToken);

router.post("/book", bookSession);
router.get("/my", listMySessions);
router.get("/:id", getSessionById);
router.patch("/:id/cancel", cancelSession);
router.patch("/:id/complete", completeSession);

export default router;
