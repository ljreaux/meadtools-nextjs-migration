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

export async function getAllRecipes() {
  try {
    const recipes = await prisma.recipes.findMany();
    return recipes;
  } catch (error) {
    console.error("Error fetching all recipes:", error);
    throw new Error("Could not fetch recipes");
  }
}

interface RecipeData {
  userId: number;
  name: string;
  recipeData: string;
  yanFromSource?: string | null;
  yanContribution: string;
  nutrientData: string;
  advanced: boolean;
  nuteInfo?: string | null;
  primaryNotes?: string[];
  secondaryNotes?: string[];
  private?: boolean;
}

export async function createRecipe(data: RecipeData) {
  return prisma.recipes.create({
    data: {
      user_id: data.userId,
      name: data.name,
      recipeData: data.recipeData,
      yanFromSource: data.yanFromSource,
      yanContribution: data.yanContribution,
      nutrientData: data.nutrientData,
      advanced: data.advanced,
      nuteInfo: data.nuteInfo,
      primaryNotes: data.primaryNotes || [],
      secondaryNotes: data.secondaryNotes || [],
      private: data.private || false,
    },
  });
}
export async function getRecipeInfo(recipeId: number) {
  try {
    return await prisma.recipes.findUnique({
      where: { id: recipeId },
    });
  } catch (error) {
    console.error("Error fetching recipe info:", error);
    throw new Error("Database error");
  }
}

export const verifyRecipeId = async (params: Promise<{ id: string }>) => {
  const { id } = await params;
  const recipeId = parseInt(id);
  return recipeId;
};

export async function updateRecipe(id: string, fields: Partial<RecipeData>) {
  return prisma.recipes.update({
    where: { id: parseInt(id, 10) }, // Ensure id is converted to an integer
    data: fields,
  });
}

export async function deleteRecipe(id: string) {
  return prisma.recipes.delete({
    where: { id: Number(id) },
  });
}
