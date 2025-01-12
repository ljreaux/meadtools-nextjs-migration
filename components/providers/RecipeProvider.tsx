"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { NutrientProvider } from "./NutrientProvider";
import {
  blankIngredient,
  Ingredient,
  IngredientDetails,
  initialData,
  Recipe,
} from "@/types/recipeDataTypes";
import { initialFullData } from "@/types/nutrientTypes";
import { toSG } from "@/lib/utils/unitConverter";
import { isValidNumber } from "@/lib/utils/validateInput";
import { blendValues } from "@/lib/utils/blendValues";
import lodash from "lodash";

const RecipeContext = createContext<Recipe | undefined>(undefined);

export default function RecipeProvider({ children }: { children: ReactNode }) {
  const [recipeData, setRecipeData] = useState(initialData);
  const [ingredientList, setIngredientList] = useState<Ingredient[]>([]);
  const [loadingIngredients, setLoadingIngredients] = useState(true);

  const addIngredient = () => {
    setRecipeData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, blankIngredient],
    }));
  };

  const removeIngredient = (index: number) => {
    setRecipeData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => {
        return i !== index;
      }),
    }));
  };

  const changeIngredient = (index: number, name: string) => {
    const foundIng = ingredientList.find((ing) => ing.name === name);

    if (foundIng) {
      const changed = {
        id: foundIng.id,
        name,
        brix: parseFloat(foundIng.sugar_content).toFixed(2) || "0",
        secondary: false,
        category: foundIng.category || "water",
      } as IngredientDetails;

      setRecipeData((prev) => ({
        ...prev,
        ingredients: prev.ingredients.map((ing, i) => {
          if (i === index) {
            return {
              ...changed,
              // updates the details with the brix of the new Ingredient. Uses old weight to determine new volume.
              details: [
                ing.details[0],
                weightToVolume(
                  parseFloat(ing.details[0]),
                  parseFloat(changed.brix)
                ).toFixed(3),
              ],
            };
          }
          return ing;
        }),
      }));
    } else {
      setRecipeData((prev) => ({
        ...prev,
        ingredients: prev.ingredients.map((ing, i) => {
          if (i === index) {
            return {
              ...ing,
              name,
            };
          }
          return ing;
        }),
      }));
    }
  };

  const { units } = recipeData;
  const converter =
    units.weight === "kg" && units.volume === "liter"
      ? (8.345 * 0.453592) / 3.78541
      : units.weight === "kg"
      ? 8.345 * 0.453592
      : units.volume === "liter"
      ? 8.345 / 3.78541
      : 8.345;

  const volumeToWeight = (value: number, brix: number) =>
    value * converter * toSG(brix);

  const weightToVolume = (value: number, brix: number) =>
    value / converter / toSG(brix);

  const updateIngredientWeight = (
    ing: IngredientDetails,
    index: number,
    weight: string
  ) => {
    if (isValidNumber(weight)) {
      const updatedIngredient = {
        ...ing,
        details: [
          weight,
          weightToVolume(parseFloat(weight), parseFloat(ing.brix)).toFixed(3),
        ] as [string, string],
      };
      setRecipeData((prev) => ({
        ...prev,
        ingredients: prev.ingredients.map((ing, i) =>
          i === index ? updatedIngredient : ing
        ),
      }));
    }
  };

  const updateIngredientVolume = (
    ing: IngredientDetails,
    index: number,
    volume: string
  ) => {
    if (isValidNumber(volume)) {
      const updatedIngredient = {
        ...ing,
        details: [
          volumeToWeight(parseFloat(volume), parseFloat(ing.brix)).toFixed(3),
          volume,
        ] as [string, string],
      };
      setRecipeData((prev) => ({
        ...prev,
        ingredients: prev.ingredients.map((ing, i) =>
          i === index ? updatedIngredient : ing
        ),
      }));
    }
  };

  const updateBrix = (brix: string, index: number) => {
    if (isValidNumber(brix)) {
      setRecipeData((prev) => {
        const ingredients = prev.ingredients.map((ing, i) =>
          i === index
            ? {
                ...ing,
                brix: brix,
                details: [
                  ing.details[0],
                  weightToVolume(
                    parseFloat(ing.details[0]),
                    parseFloat(brix)
                  ).toFixed(3),
                ] as [string, string],
              }
            : ing
        );
        return { ...prev, ingredients };
      });
    }
  };

  const toggleSecondaryChecked = (index: number, isChecked: boolean) => {
    setRecipeData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) =>
        i === index ? { ...ing, secondary: isChecked } : ing
      ),
    }));
  };

  // fetch initial ingredient data
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await fetch("/api/ingredients");
        const data = await response.json();
        const translated = data.map((item: Ingredient) => {
          const name = lodash.camelCase(item.name);
          return { ...item, translationKey: name };
        });
        setIngredientList(translated);
        setLoadingIngredients(false);
      } catch (error) {
        console.error("Error fetching ingredient list:", error);
        setLoadingIngredients(false);
      }
    };

    fetchIngredients();
  }, []);

  useEffect(() => {
    const secondaryBlendArr = recipeData.ingredients
      .filter((ing) => ing.secondary)
      .map((ing) => {
        return [toSG(parseFloat(ing.brix)).toPrecision(6), ing.details[1]] as [
          string,
          string
        ];
      });
    const primaryBlendArr = recipeData.ingredients
      .filter((ing) => !ing.secondary)
      .map((ing) => {
        return [toSG(parseFloat(ing.brix)).toPrecision(6), ing.details[1]] as [
          string,
          string
        ];
      });

    const { blendedValue: secondaryVal, totalVolume: secondaryVol } =
      blendValues(secondaryBlendArr);
    const { blendedValue: primaryVal, totalVolume: primaryVol } =
      blendValues(primaryBlendArr);
    const blend = blendValues([
      [(0.996).toFixed(4), primaryVol.toFixed(4)],
      [secondaryVal.toFixed(4), secondaryVol.toFixed(4)],
    ]);
    console.log(
      "Total Primary Volume: " + primaryVol,
      "Total Volume: " + blend.totalVolume,
      "Estimated OG: " + primaryVal,
      "Backsweetend FG: " + blend.blendedValue
    );
  }, [recipeData.ingredients]);

  return (
    <RecipeContext.Provider
      value={{
        ...recipeData,
        addIngredient,
        removeIngredient,
        changeIngredient,
        ingredientList,
        loadingIngredients,
        updateIngredientWeight,
        updateIngredientVolume,
        updateBrix,
        toggleSecondaryChecked,
      }}
    >
      <NutrientProvider
        initialData={{
          ...initialFullData,
          inputs: {
            volume: recipeData.volume,
            sg: (recipeData.OG - parseFloat(recipeData.FG)).toString(),
            offset: "0",
            numberOfAdditions: "1",
          },
        }}
      >
        {children}
      </NutrientProvider>
    </RecipeContext.Provider>
  );
}
export const useRecipe = () => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error("useRecipe must be used within an RecipeProvider");
  }
  return context;
};
