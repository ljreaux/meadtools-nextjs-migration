"use client";
import SavedRecipeProvider from "@/components/providers/SavedRecipeProvider";
import RecipeBuilderTutorial from "@/components/recipeBuilder/RecipeBuilderTutorial";
import { parseRecipeData } from "@/lib/utils/parseRecipeData";
import React, { useEffect, useState } from "react";

function RecipeTutorial() {
  const [recipe, setRecipe] = useState<any>(null);

  useEffect(() => {
    localStorage.setItem("hasSeenTutorialDialog", "true");
    async function getTutorialRecipe() {
      try {
        const res = await fetch("/tutorialRecipe.json");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const response = await res.json();

        setRecipe(response.recipe);
      } catch (error) {
        console.error("Error fetching recipe:", error);
      }
    }
    getTutorialRecipe();
  }, []);

  if (!recipe) return null;

  const { recipeData, nutrientData, getSelectedSchedule, yanContribution } =
    parseRecipeData(recipe);

  return (
    <SavedRecipeProvider
      recipe={{
        ...recipe,
        recipeData,
        nutrientData: {
          ...nutrientData,
          selected: {
            ...nutrientData.selected,
            selectedNutrients: getSelectedSchedule(
              nutrientData.selected.schedule
            ),
          },
        },
        yanContribution,
      }}
    >
      <RecipeBuilderTutorial />
    </SavedRecipeProvider>
  );
}

export default RecipeTutorial;
