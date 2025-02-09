import INGREDIENTS from "../lib/db/initialIngredientData";
import YEASTS, { Yeast } from "../lib/db/initialYeastData";
import prisma from "../lib/prisma";
import bcrypt from "bcrypt";

if (process.env.NODE_ENV === "production") {
  console.error("Seeding is disabled in production.");
  process.exit(1);
}
async function main() {
  // Drop and recreate tables is unnecessary; Prisma migrations handle this.

  // Seed users
  const adminEmail = process.env.ADMIN_EMAIL || "";
  const adminPassword = process.env.ADMIN_PASSWORD
    ? await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)
    : null;

  const userEmail = process.env.USER_EMAIL || "";
  const userPassword = process.env.USER_PASSWORD
    ? await bcrypt.hash(process.env.USER_PASSWORD, 10)
    : null;

  await prisma.users.createMany({
    data: [
      {
        email: adminEmail,
        password: adminPassword,
        role: "admin",
      },
      {
        email: userEmail,
        password: userPassword,
        role: "user",
      },
    ],
  });

  console.log("Users seeded");

  // Seed ingredients
  const ingredients = INGREDIENTS.map((ing) => ({
    name: ing.name,
    category: ing.category,
    sugar_content: ing.sugarContent,
    water_content: ing.waterContent,
  }));

  await prisma.ingredients.createMany({ data: ingredients });
  console.log("Ingredients seeded");

  // Seed yeasts
  const yeasts = Object.entries(YEASTS).flatMap(([brand, yeasts]) =>
    yeasts.map((yeast: Yeast) => ({
      brand,
      name: yeast.name,
      nitrogen_requirement: yeast.nitrogenRequirement,
      tolerance: parseFloat(String(yeast.tolerance)), // Ensure tolerance is a number
      low_temp: yeast.lowTemp,
      high_temp: yeast.highTemp,
    }))
  );

  await prisma.yeasts.createMany({ data: yeasts });
  console.log("Yeasts seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
