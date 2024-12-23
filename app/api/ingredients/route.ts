import { NextRequest, NextResponse } from "next/server";
import {
  getAllIngredients,
  getIngredientsByCategory,
  getIngredientByName,
} from "@/lib/db/ingredients"; // Adjust path based on your project structure

// GET /api/ingredients
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  // Check if the request is for a category or a specific ingredient
  const categoryName = searchParams.get("category");
  const ingredientName = searchParams.get("name");

  try {
    if (categoryName) {
      const ingredients = await getIngredientsByCategory(categoryName);
      return NextResponse.json(ingredients);
    }

    if (ingredientName) {
      const ingredient = await getIngredientByName(ingredientName);
      return NextResponse.json(ingredient);
    }

    // Default to fetching all ingredients
    const ingredients = await getAllIngredients();
    return NextResponse.json(ingredients);
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    return NextResponse.json(
      { error: "Failed to fetch ingredients" },
      { status: 500 }
    );
  }
}

// TODO: POST /api/ingredients - Admin route
// TODO: PATCH /api/ingredients/:ingredientId - Admin route
// TODO: DELETE /api/ingredients/:ingredientId - Admin route
