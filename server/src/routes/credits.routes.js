import express from "express";
import { getBalance, getTransactionHistory } from "../controllers/credits.controller.js";
import { verifyAccessToken } from "../middleware/authVerify.js";

const router = express.Router();

router.use(verifyAccessToken);

router.get("/balance", getBalance);
router.get("/transactions", getTransactionHistory);

export default router;
