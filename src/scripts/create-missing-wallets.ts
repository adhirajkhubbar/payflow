import prisma from "../config/database.js";

async function createMissingWallets() {
  const users = await prisma.user.findMany({
    include: {
      wallet: true,
    },
  });

  let created = 0;

  for (const user of users) {
    if (!user.wallet) {
      await prisma.wallet.create({
        data: {
          userId: user.id,
          balance: 0,
        },
      });

      console.log(
        `Created wallet for ${user.name} (userId: ${user.id})`
      );

      created++;
    }
  }

  console.log(`Finished. Created ${created} wallet(s).`);
}

createMissingWallets()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });