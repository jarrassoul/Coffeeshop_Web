import { PrismaClient } from "@prisma/client";
import { products } from "../src/lib/products";
import { initialUsers } from "../src/lib/admin";
import { hashPassword } from "../src/lib/passwords";

const prisma = new PrismaClient();

async function main() {
  // Products: the catalog keeps prices in dollars, the database stores integer
  // cents so order totals never drift on floating-point math.
  for (const [index, product] of products.entries()) {
    const priceCents = Math.round(product.price * 100);
    await prisma.product.upsert({
      where: { id: product.id },
      update: {
        name: product.name,
        description: product.description,
        priceCents,
        category: product.category,
        position: index,
      },
      create: {
        id: product.id,
        name: product.name,
        description: product.description,
        priceCents,
        category: product.category,
        position: index,
      },
    });
  }
  console.log(`Seeded ${products.length} products.`);

  // Staff users: passwords are hashed with scrypt before they touch the DB.
  for (const user of initialUsers) {
    const existing = await prisma.user.findUnique({
      where: { email: user.email },
    });
    const passwordHash = await hashPassword(user.password);
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        permissions: JSON.stringify(user.permissions),
        isAdmin: user.isAdmin,
        // Only set the password for a brand-new account so re-seeding never
        // clobbers a password an admin has since changed.
        ...(existing ? {} : { passwordHash }),
      },
      create: {
        name: user.name,
        email: user.email,
        passwordHash,
        permissions: JSON.stringify(user.permissions),
        isAdmin: user.isAdmin,
      },
    });
  }
  console.log(`Seeded ${initialUsers.length} staff users.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
