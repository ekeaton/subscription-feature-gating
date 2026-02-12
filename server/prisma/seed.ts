import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../generated/prisma/client";
import "dotenv/config";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL as string,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.subscription.createMany({
    data: [
      { planType: "free", projectLimit: 2 },
      { planType: "pro", projectLimit: -1 },
    ],
  });
}

main()
  .then(() => console.log("Seeded successfully"))
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
