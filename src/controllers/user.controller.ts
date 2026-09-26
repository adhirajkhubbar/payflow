import type { Request, Response } from "express";

import {
  createUser,
  getUsers,
  deleteUser,
} from "../services/user.service.js";

export async function createUserController(
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

    const user = await createUser(
      name,
      email,
      password
    );

    return res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.error(error);

    if (
      error instanceof Error &&
      error.message === "USER_ALREADY_EXISTS"
    ) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    return res.status(500).json({
      message: "Failed to create user",
    });
  }
}

export async function getUsersController(
  req: Request,
  res: Response
) {
  try {
    const users = await getUsers();

    return res.status(200).json(users);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch users",
    });
  }
}

export async function deleteUserController(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    await deleteUser(id);

    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);

    if (
      error instanceof Error &&
      error.message === "USER_NOT_FOUND"
    ) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(500).json({
      message: "Failed to delete user",
    });
  }
}