import RecipePage from "@/components/recipes/RecipeClient";
import React from "react";

async function Recipe({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RecipePage id={id} />;
}

export default Recipe;
