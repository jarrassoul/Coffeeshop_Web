import { PrismaClient } from "@prisma/client";
import { products } from "../src/lib/products";

const prisma = new PrismaClient();

async function main() {
  for (const [index, product] of products.entries()) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: { ...product, position: index },
      create: { ...product, position: index },
    });
  }
  console.log(`Seeded ${products.length} products.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
