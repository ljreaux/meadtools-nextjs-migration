"use client";
import SavedRecipeProvider from "@/components/providers/SavedRecipeProvider";
import RecipeBuilderTutorial from "@/components/recipeBuilder/RecipeBuilderTutorial";
import React, { useEffect, useState } from "react";

function RecipeTutorial() {
  const [recipe, setRecipe] = useState<any>(null);

  useEffect(() => {
    async function getTutorialRecipe() {
      try {
        const res = await fetch("/tutorialRecipe.json");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const response = await res.json();

        console.log(response);
        setRecipe(response.recipe);
      } catch (error) {
        console.error("Error fetching recipe:", error);
      }
    }
    getTutorialRecipe();
  }, []);

  if (!recipe) return null;

  const recipeData = JSON.parse(recipe.recipeData);
  const nutrientData = JSON.parse(recipe.nutrientData);
  const yanContribution = JSON.parse(recipe.yanContribution);
  const getSelectedSchedule = (schedule: string) => {
    switch (schedule) {
      case "tbe":
        return ["Fermaid O", "Fermaid K", "DAP"]; // Fermaid O, K, and DAP
      case "oAndk":
        return ["Fermaid O", "Fermaid K"]; // Fermaid O & K
      case "oAndDap":
        return ["Fermaid O", "DAP"]; // Fermaid O & DAP
      case "kAndDap":
        return ["Fermaid K", "DAP"]; // Fermaid K & DAP
      case "tosna":
        return ["Fermaid O"]; // Fermaid O Only
      case "justK":
        return ["Fermaid K"]; // Fermaid K Only
      case "dap":
        return ["DAP"]; // DAP Only
      case "other":
      default:
        return ["Other"]; // Default case is "Other"
    }
  };

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
