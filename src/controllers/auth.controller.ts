import type { Request, Response } from "express";

import {
  registerUser,
  loginUser,
} from "../services/auth.service.js";

export async function registerController(
  req: Request,
  res: Response
) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const user = await registerUser(
      name,
      email,
      password
    );

    return res.status(201).json({
      message: "Registration successful",
      user,
    });
  } catch (error) {
    console.error(error);

    if (!(error instanceof Error)) {
      return res.status(500).json({
        message: "Registration failed",
      });
    }

    if (error.message === "USER_ALREADY_EXISTS") {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    if (error.message === "JWT_SECRET_NOT_CONFIGURED") {
      return res.status(500).json({
        message: "Server configuration error",
      });
    }

    return res.status(500).json({
      message: "Registration failed",
    });
  }
}

export async function loginController(
  req: Request,
  res: Response
) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const result = await loginUser(
      email,
      password
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);

    if (!(error instanceof Error)) {
      return res.status(500).json({
        message: "Login failed",
      });
    }

    if (error.message === "INVALID_CREDENTIALS") {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (error.message === "JWT_SECRET_NOT_CONFIGURED") {
      return res.status(500).json({
        message: "Server configuration error",
      });
    }

    return res.status(500).json({
      message: "Login failed",
    });
  }
}