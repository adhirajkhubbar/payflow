import { Router } from "express";

import {
  getWalletController,
  depositController,
} from "../controllers/wallet.controller.js";

import { authenticateToken } from "../middleware/auth.middleware.js";

const router = Router();

router.get(
  "/",
  authenticateToken,
  getWalletController
);

router.post(
  "/deposit",
  authenticateToken,
  depositController
);

export default router;