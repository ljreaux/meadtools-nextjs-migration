import prisma from "@/lib/prisma";

export async function getAllRecipesForUser(userId: number) {
  try {
    const recipes = await prisma.recipes.findMany({
      where: { user_id: userId },
    });
    return recipes;
  } catch (error) {
    console.error("Error fetching recipes for user:", error);
    throw new Error("Failed to fetch recipes.");
  }
}
