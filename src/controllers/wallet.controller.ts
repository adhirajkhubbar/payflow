import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";

import {
  getWalletByUserId,
  depositMoney,
} from "../services/wallet.service.js";

export async function getWalletController(
  req: AuthRequest,
  res: Response
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const wallet = await getWalletByUserId(
      req.user.userId
    );

    return res.json({
      wallet: {
        id: wallet.id,
        balance: wallet.balance,
      },
    });
  } catch (error) {
    console.error(error);

    if (
      error instanceof Error &&
      error.message === "WALLET_NOT_FOUND"
    ) {
      return res.status(404).json({
        message: "Wallet not found",
      });
    }

    return res.status(500).json({
      message: "Failed to fetch wallet",
    });
  }
}

export async function depositController(
  req: AuthRequest,
  res: Response
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const amount = Number(req.body.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({
        message: "Amount must be greater than 0",
      });
    }

    const result = await depositMoney(
      req.user.userId,
      amount
    );

    return res.status(201).json({
      message: "Money deposited successfully",
      wallet: {
        id: result.wallet.id,
        balance: result.wallet.balance,
      },
      transaction: {
        id: result.transaction.id,
        amount: result.transaction.amount,
        type: result.transaction.type,
        status: result.transaction.status,
        reference: result.transaction.reference,
        createdAt: result.transaction.createdAt,
      },
    });
  } catch (error) {
    console.error(error);

    if (
      error instanceof Error &&
      error.message === "WALLET_NOT_FOUND"
    ) {
      return res.status(404).json({
        message: "Wallet not found",
      });
    }

    return res.status(500).json({
      message: "Failed to deposit money",
    });
  }
}