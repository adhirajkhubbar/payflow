import { Router } from "express";

import {
  transferController,
  transactionHistoryController,
} from "../controllers/transaction.controller.js";

import { authenticateToken } from "../middleware/auth.middleware.js";

const router = Router();

router.post(
  "/transfer",
  authenticateToken,
  transferController
);

router.get(
  "/history",
  authenticateToken,
  transactionHistoryController
);

export default router;