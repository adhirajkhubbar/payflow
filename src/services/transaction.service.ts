import prisma from "../config/database.js";

export async function transferMoney(
  senderUserId: number,
  receiverEmail: string,
  amount: number
) {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("INVALID_AMOUNT");
  }

  const receiver = await prisma.user.findUnique({
    where: {
      email: receiverEmail,
    },
  });

  if (!receiver) {
    throw new Error("RECEIVER_NOT_FOUND");
  }

  if (receiver.id === senderUserId) {
    throw new Error("CANNOT_TRANSFER_TO_SELF");
  }

  const senderWallet = await prisma.wallet.findUnique({
    where: {
      userId: senderUserId,
    },
  });

  const receiverWallet = await prisma.wallet.findUnique({
    where: {
      userId: receiver.id,
    },
  });

  if (!senderWallet || !receiverWallet) {
    throw new Error("WALLET_NOT_FOUND");
  }

  const reference = `TRF-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()}`;

  const result = await prisma.$transaction(async (tx) => {
    const updatedSenderWallet = await tx.wallet.updateMany({
      where: {
        id: senderWallet.id,
        balance: {
          gte: amount,
        },
      },
      data: {
        balance: {
          decrement: amount,
        },
      },
    });

    if (updatedSenderWallet.count === 0) {
      throw new Error("INSUFFICIENT_BALANCE");
    }

    const updatedReceiverWallet = await tx.wallet.update({
      where: {
        id: receiverWallet.id,
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
        type: "TRANSFER",
        status: "COMPLETED",
        reference,
        senderWalletId: senderWallet.id,
        receiverWalletId: receiverWallet.id,
      },
    });

    return {
      senderWallet: await tx.wallet.findUnique({
        where: {
          id: senderWallet.id,
        },
      }),
      receiverWallet: updatedReceiverWallet,
      transaction,
    };
  });

  return result;
}

export async function getUserTransactions(userId: number) {
  const wallet = await prisma.wallet.findUnique({
    where: {
      userId,
    },
  });

  if (!wallet) {
    throw new Error("WALLET_NOT_FOUND");
  }

  const transactions = await prisma.transaction.findMany({
    where: {
      OR: [
        {
          senderWalletId: wallet.id,
        },
        {
          receiverWalletId: wallet.id,
        },
      ],
    },
    include: {
      senderWallet: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      receiverWallet: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return transactions.map((transaction) => {
    const isOutgoing =
      transaction.senderWalletId === wallet.id;

    const counterparty = isOutgoing
      ? transaction.receiverWallet?.user
      : transaction.senderWallet?.user;

    return {
      id: transaction.id,
      amount: transaction.amount,
      type: transaction.type,
      status: transaction.status,
      direction: isOutgoing ? "OUTGOING" : "INCOMING",
      reference: transaction.reference,
      counterparty: counterparty
        ? {
            id: counterparty.id,
            name: counterparty.name,
            email: counterparty.email,
          }
        : null,
      createdAt: transaction.createdAt,
    };
  });
}