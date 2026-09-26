import prisma from "../config/database.js";

export async function getWalletByUserId(userId: number) {
  const wallet = await prisma.wallet.findUnique({
    where: {
      userId,
    },
  });

  if (!wallet) {
    throw new Error("WALLET_NOT_FOUND");
  }

  return wallet;
}

export async function depositMoney(
  userId: number,
  amount: number
) {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("INVALID_AMOUNT");
  }

  const wallet = await prisma.wallet.findUnique({
    where: {
      userId,
    },
  });

  if (!wallet) {
    throw new Error("WALLET_NOT_FOUND");
  }

  const reference = `DEP-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()}`;

  const result = await prisma.$transaction(async (tx) => {
    const updatedWallet = await tx.wallet.update({
      where: {
        id: wallet.id,
      },
      data: {
        balance: {
          increment: amount,
        },
      },
    });

    const transaction = await tx.transaction.create({
      data: {
        amount,
        type: "CREDIT",
        status: "COMPLETED",
        reference,
        receiverWalletId: wallet.id,
      },
    });

    return {
      wallet: updatedWallet,
      transaction,
    };
  });

  return result;
}