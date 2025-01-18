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
  const adminPassword = process.env.ADMIN_PASSWORD
    ? await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)
    : null;
  const userPassword = process.env.USER_PASSWORD
    ? await bcrypt.hash(process.env.USER_PASSWORD, 10)
    : null;

  await prisma.users.createMany({
    data: [
      {
        email: "larryreaux@gmail.com",
        password: adminPassword,
        role: "admin",
      },
      {
        email: "contact@meadtools.com",
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

  // Seed recipes
  const recipes = [
    {
      user_id: 1,
      name: "Traditional Mead",
      recipeData: JSON.stringify({
        ingredients: [
          { name: "Water", amount: 8.3451 },
          { name: "Honey", amount: 3 },
        ],
      }),
      nutrientData: JSON.stringify({ nitrogen: "Low" }),
      advanced: false,
      yanContribution: JSON.stringify([40, 100, 210]),
    },
    // Add more recipes as needed
  ];

  await prisma.recipes.createMany({ data: recipes });
  console.log("Recipes seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
