import { NextRequest, NextResponse } from "next/server";
import {
  getAllIngredients,
  getIngredientsByCategory,
  getIngredientByName,
  createIngredient,
} from "@/lib/db/ingredients";
import { verifyAdmin } from "@/lib/userAccessFunctions";

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

// POST /api/ingredients
export async function POST(req: NextRequest) {
  // Check for admin privileges
  const adminOrResponse = await verifyAdmin(req);
  if (adminOrResponse instanceof NextResponse) {
    return adminOrResponse;
  }

  try {
    const body = await req.json();
    const newIngredient = await createIngredient(body);

    return NextResponse.json(newIngredient, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create ingredient" },
      { status: 500 }
    );
  }
}
