import { Router } from "express";

import {
  createUserController,
  getUsersController,
  deleteUserController,
} from "../controllers/user.controller.js";

import { authenticateToken } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", createUserController);

router.get(
  "/",
  authenticateToken,
  getUsersController
);

router.delete(
  "/:id",
  authenticateToken,
  deleteUserController
);

export default router;