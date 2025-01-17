import React from "react";
import PrintableIframe from "./PrintableIframe";
import RecipeView from "./RecipeView";
import { useRecipe } from "../providers/RecipeProvider";
import { useNutrients } from "../providers/NutrientProvider";

function PDF() {
  const nutrientData = useNutrients();
  const recipeData = useRecipe();
  return (
    <PrintableIframe
      content={
        <RecipeView nutrientData={nutrientData} recipeData={recipeData} />
      }
    />
  );
}

export default PDF;
