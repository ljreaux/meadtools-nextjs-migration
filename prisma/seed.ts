import prisma from "@/lib/prisma";
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
  const ingredients = [
    { name: "Water", sugar_content: 0, water_content: 100, category: "water" },
    {
      name: "Honey",
      sugar_content: 79.6,
      water_content: 20.4,
      category: "sugar",
    },
    // Add more ingredients as needed
  ];

  await prisma.ingredients.createMany({ data: ingredients });
  console.log("Ingredients seeded");

  // Seed yeasts
  const yeasts = [
    {
      brand: "Lalvin",
      name: "D47",
      nitrogen_requirement: "Low",
      tolerance: 17,
      low_temp: 50,
      high_temp: 86,
    },
    // Add more yeasts as needed
  ];

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
