import { NextRequest, NextResponse } from "next/server";
import { createRecipe, getAllRecipes } from "@/lib/db/recipes";

import { requireAdmin, verifyUser } from "@/lib/middleware";

export async function GET(req: NextRequest) {
  // Verify user authentication
  const userOrResponse = await verifyUser(req);
  if (userOrResponse instanceof NextResponse) {
    return userOrResponse; // Return error response if the user is not verified
  }

  const userId = userOrResponse;

  try {
    // Check admin privileges using requireAdmin
    const isAdmin = await requireAdmin(userId);
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 403 }
      );
    }

    // Fetch all recipes
    const recipes = await getAllRecipes();
    return NextResponse.json({ recipes });
  } catch (error: any) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipes" }, // Override with consistent error message
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const userOrResponse = await verifyUser(req);
    if (userOrResponse instanceof NextResponse) {
      return userOrResponse;
    }

    const body = await req.json();
    const {
      name,
      recipeData,
      yanFromSource,
      yanContribution,
      nutrientData,
      advanced,
      nuteInfo,
      primaryNotes,
      secondaryNotes,
      privateRecipe,
    } = body;

    if (!name || !recipeData) {
      return NextResponse.json(
        { error: "Name and recipe data are required." },
        { status: 400 }
      );
    }

    const recipe = await createRecipe({
      userId: userOrResponse,
      name,
      recipeData,
      yanFromSource,
      yanContribution,
      nutrientData,
      advanced,
      nuteInfo,
      primaryNotes,
      secondaryNotes,
      private: privateRecipe || false,
    });

    return NextResponse.json({ recipe }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating recipe:", error.message);
    return NextResponse.json(
      { error: "Failed to create recipe" }, // Correct error message
      { status: 500 }
    );
  }
}
