import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";

import {
  transferMoney,
  getUserTransactions,
} from "../services/transaction.service.js";

export async function transferController(
  req: AuthRequest,
  res: Response
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const { receiverEmail, amount } = req.body;

    if (!receiverEmail || amount === undefined) {
      return res.status(400).json({
        message: "receiverEmail and amount are required",
      });
    }

    const result = await transferMoney(
      req.user.userId,
      receiverEmail,
      Number(amount)
    );

    return res.status(201).json({
      message: "Transfer successful",
      transaction: {
        id: result.transaction.id,
        amount: result.transaction.amount,
        type: result.transaction.type,
        status: result.transaction.status,
        reference: result.transaction.reference,
        createdAt: result.transaction.createdAt,
      },
      senderWallet: {
        balance: result.senderWallet?.balance,
      },
    });
  } catch (error) {
    console.error(error);

    if (!(error instanceof Error)) {
      return res.status(500).json({
        message: "Transfer failed",
      });
    }

    switch (error.message) {
      case "INVALID_AMOUNT":
        return res.status(400).json({
          message: "Amount must be greater than 0",
        });

      case "RECEIVER_NOT_FOUND":
        return res.status(404).json({
          message: "Receiver not found",
        });

      case "CANNOT_TRANSFER_TO_SELF":
        return res.status(400).json({
          message: "You cannot transfer money to yourself",
        });

      case "WALLET_NOT_FOUND":
        return res.status(404).json({
          message: "Wallet not found",
        });

      case "INSUFFICIENT_BALANCE":
        return res.status(400).json({
          message: "Insufficient balance",
        });

      default:
        return res.status(500).json({
          message: "Transfer failed",
        });
    }
  }
}

export async function transactionHistoryController(
  req: AuthRequest,
  res: Response
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const transactions = await getUserTransactions(req.user.userId);

    return res.status(200).json({
      transactions,
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
      message: "Failed to fetch transactions",
    });
  }
}