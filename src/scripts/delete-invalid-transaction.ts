import prisma from "../config/database.js";

async function deleteInvalidTransaction() {
  const transactionId = 4;

  const transaction = await prisma.transaction.findUnique({
    where: {
      id: transactionId,
    },
  });

  if (!transaction) {
    console.log("Transaction 4 not found.");
    return;
  }

  if (
    transaction.type === "TRANSFER" &&
    transaction.senderWalletId === null
  ) {
    await prisma.transaction.delete({
      where: {
        id: transactionId,
      },
    });

    console.log("Invalid transaction 4 deleted successfully.");
    return;
  }

  console.log("Transaction 4 does not match the expected invalid pattern.");
}

deleteInvalidTransaction()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });