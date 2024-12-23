import prisma from "../prisma"; // Import Prisma client

// Fetch all ingredients
export async function getAllIngredients() {
  try {
    return await prisma.ingredients.findMany();
  } catch (error) {
    console.error("Error fetching all ingredients:", error);
    throw new Error("Could not fetch ingredients");
  }
}

// Fetch ingredients by category
export async function getIngredientsByCategory(category: string) {
  try {
    return await prisma.ingredients.findMany({
      where: {
        category: {
          equals: category,
          mode: "insensitive",
        },
      },
    });
  } catch (error) {
    console.error("Error fetching ingredients by category:", error);
    throw new Error("Could not fetch ingredients by category");
  }
}

// Fetch ingredient by name
export async function getIngredientByName(name: string) {
  try {
    return await prisma.ingredients.findMany({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });
  } catch (error) {
    console.error("Error fetching ingredient by name:", error);
    throw new Error("Could not fetch ingredient by name");
  }
}
