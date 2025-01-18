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
  Additive,
  blankAdditive,
  blankIngredient,
  blankNote,
  Ingredient,
  IngredientDetails,
  initialData,
  Recipe,
  RecipeData,
  UnitType,
} from "@/types/recipeDataTypes";
import { calcABV, toBrix, toSG } from "@/lib/utils/unitConverter";
import { isValidNumber } from "@/lib/utils/validateInput";
import { blendValues } from "@/lib/utils/blendValues";
import lodash from "lodash";
import { useTranslation } from "react-i18next";

const RecipeContext = createContext<Recipe | undefined>(undefined);

export default function RecipeProvider({
  children,
  storeData,
  savedData,
  recipeName: providedName,
}: {
  children: ReactNode;
  // for main recipe builder local storage
  storeData?: boolean;
  // for saved user recipes
  savedData?: RecipeData;
  recipeName?: string;
}) {
  const { t } = useTranslation();
  const [firstMount, setFirstMount] = useState(true);
  const [preferredUnits, setPreferredUnits] = useState("US");

  const [recipeData, setRecipeData] = useState(savedData || initialData);
  const [ingredientList, setIngredientList] = useState<Ingredient[]>([]);
  const [loadingIngredients, setLoadingIngredients] = useState(true);
  const [additiveList, setAdditiveList] = useState<Additive[]>([]);
  const [loadingAdditives, setLoadingAdditives] = useState(true);
  const [primaryNotes, setPrimaryNotes] = useState([blankNote]);
  const [secondaryNotes, setSecondaryNotes] = useState([blankNote]);

  const [backsweetenedFG, setBacksweetenedFG] = useState(1);
  const [totalVolume, setTotalVolume] = useState(0);
  const [totalForAbv, setTotalForAbv] = useState(1);
  const [delle, setDelle] = useState(0);

  const [addingStabilizers, setAddingStabilizers] = useState(false);
  const [takingPh, setTakingPh] = useState(false);
  const [phReading, setPhReading] = useState("3.6");
  const [recipeName, setRecipeName] = useState(providedName || "");

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
    const translatedName = t(lodash.camelCase(name));

    const foundIng = ingredientList.find((ing) => ing.name === name);

    if (foundIng) {
      const changed = {
        id: foundIng.id,
        name: translatedName, // Use the translated name
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
              name, // Use the translated name
            };
          }
          return ing;
        }),
      }));
    }
  };

  const changeAdditive = (index: number, name: string) => {
    const multiplier = recipeData.units.volume === "liter" ? 0.264172 : 1;
    const translatedName = t(lodash.camelCase(name));

    const foundAdd = additiveList.find((add) => add.name === name);

    if (foundAdd) {
      const changed = {
        name: translatedName,
        amount: (
          parseFloat(foundAdd.dosage) *
          multiplier *
          totalVolume
        ).toFixed(3),
        unit: foundAdd.unit,
      };

      setRecipeData((prev) => ({
        ...prev,
        additives: prev.additives.map((add, i) =>
          i === index ? changed : add
        ),
      }));
    } else {
      setRecipeData((prev) => ({
        ...prev,
        additives: prev.additives.map((add, i) => {
          if (i === index) {
            return {
              ...add,
              name, // Use the translated name
            };
          }
          return add;
        }),
      }));
    }
  };

  const changeAdditiveUnits = (index: number, unit: string) => {
    setRecipeData((prev) => ({
      ...prev,
      additives: prev.additives.map((add, i) =>
        i === index ? { ...add, unit } : add
      ),
    }));
  };

  const changeAdditiveAmount = (index: number, amount: string) => {
    setRecipeData((prev) => ({
      ...prev,
      additives: prev.additives.map((add, i) =>
        i === index ? { ...add, amount } : add
      ),
    }));
  };

  const addAdditive = () => {
    setRecipeData((prev) => {
      return {
        ...prev,
        additives: [...prev.additives, blankAdditive],
      };
    });
  };

  const removeAdditive = (index: number) => {
    setRecipeData((prev) => ({
      ...prev,
      additives: prev.additives.filter((_, i) => i !== index),
    }));
  };

  const changeVolumeUnits = (unit: string) => {
    setRecipeData((prev) => ({
      ...prev,
      units: {
        ...prev.units,
        volume: unit as "gal" | "liter",
      },
    }));
  };

  const changeWeightUnits = (unit: string) => {
    setRecipeData((prev) => ({
      ...prev,
      units: {
        ...prev.units,
        weight: unit as "lbs" | "kg",
      },
    }));
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

  const updateFG = (FG: string) => {
    if (isValidNumber(FG)) {
      setRecipeData((prev) => ({ ...prev, FG }));
    }
  };

  const toggleStabilizers = (val: boolean) => {
    setAddingStabilizers(val);
  };

  const toggleTakingPh = (val: boolean) => {
    setTakingPh(val);
  };

  const updatePhReading = (ph: string) => {
    if (isValidNumber(ph)) {
      setPhReading(ph);
    }
  };

  const scaleRecipe = (curVol: number, targetVol: number) => {
    const scale = targetVol / curVol;

    const newIngredients = recipeData.ingredients.map((ing) => {
      const newDetails = ing.details.map((det) =>
        (parseFloat(det || "0") * scale).toFixed(3)
      ) as [string, string];
      return { ...ing, details: newDetails };
    });
    setRecipeData((prev) => {
      const newAdditives = prev.additives.map((add) => ({
        ...add,
        amount: (parseFloat(add.amount || "0") * scale * 1000).toFixed(3),
      }));

      return { ...prev, ingredients: newIngredients, additives: newAdditives };
    });
  };

  const editPrimaryNoteText = (index: number, text: string) => {
    setPrimaryNotes((prev) =>
      prev.map((note, i) => (i === index ? [text, note[1]] : note))
    );
  };

  const editPrimaryNoteDetails = (index: number, text: string) => {
    setPrimaryNotes((prev) =>
      prev.map((note, i) => (i === index ? [note[0], text] : note))
    );
  };

  const addPrimaryNote = () => {
    setPrimaryNotes((prev) => [...prev, blankNote]);
  };

  const removePrimaryNote = (index: number) => {
    setPrimaryNotes((prev) => prev.filter((_, i) => i !== index));
  };

  const editSecondaryNoteText = (index: number, text: string) => {
    setSecondaryNotes((prev) =>
      prev.map((note, i) => (i === index ? [text, note[1]] : note))
    );
  };

  const editSecondaryNoteDetails = (index: number, text: string) => {
    setSecondaryNotes((prev) =>
      prev.map((note, i) => (i === index ? [note[0], text] : note))
    );
  };

  const addSecondaryNote = () => {
    setSecondaryNotes((prev) => [...prev, blankNote]);
  };
  const removeSecondaryNote = (index: number) => {
    setSecondaryNotes((prev) => prev.filter((_, i) => i !== index));
  };

  const retrieveStoredData = () => {
    // get recipe Data
    const storedData = localStorage.getItem("recipeData") || "false";
    const parsed = JSON.parse(storedData) as RecipeData | false;
    if (parsed) setRecipeData(parsed);

    // get notes data
    const primaryNotes = localStorage.getItem("primaryNotes") || "false";
    const secondaryNotes = localStorage.getItem("secondaryNotes") || "false";
    const parsedPrimaryNotes = JSON.parse(primaryNotes) as
      | [string, string][]
      | false;
    if (parsedPrimaryNotes) {
      setPrimaryNotes(parsedPrimaryNotes);
    }
    const parsedSecondaryNotes = JSON.parse(secondaryNotes) as
      | [string, string][]
      | false;
    if (parsedSecondaryNotes) {
      setSecondaryNotes(parsedSecondaryNotes);
    }

    // get stabilizers data
    const storedStabilizers =
      localStorage.getItem("addingStabilizers") || "false";
    const parsedStabilizers = JSON.parse(storedStabilizers) as
      | { adding: boolean; pH: boolean; pHReading: string }
      | false;
    if (parsedStabilizers) {
      setAddingStabilizers(parsedStabilizers.adding);
      setTakingPh(parsedStabilizers.pH);
      setPhReading(parsedStabilizers.pHReading);
    }
    const storedName = localStorage.getItem("recipeName");
    if (storedName) {
      setRecipeName(storedName);
    }
  };

  // fetch initial ingredient data
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await fetch("/api/ingredients");
        const data = await response.json();
        setIngredientList(data);
        setLoadingIngredients(false);
      } catch (error) {
        console.error("Error fetching ingredient list:", error);
        setLoadingIngredients(false);
      }
    };
    const fetchAdditives = async () => {
      try {
        const response = await fetch("/api/additives");
        const data = await response.json();

        setAdditiveList(data);
        setLoadingAdditives(false);
      } catch (error) {
        console.error("Error fetching ingredient list:", error);
        setLoadingAdditives(false);
      }
    };

    fetchIngredients();
    fetchAdditives();

    if (storeData) retrieveStoredData();
    const units = localStorage.getItem("units");
    if (units) {
      setPreferredUnits(units);
    }

    setFirstMount(false);
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

    const total = blendValues([...secondaryBlendArr, ...primaryBlendArr]);
    setTotalForAbv(total.blendedValue);

    const { blendedValue: secondaryVal, totalVolume: secondaryVol } =
      blendValues(secondaryBlendArr);
    const { blendedValue: primaryVal, totalVolume: primaryVol } =
      blendValues(primaryBlendArr);
    const { blendedValue: backFG, totalVolume } = blendValues([
      [recipeData.FG, primaryVol.toFixed(3)],
      [secondaryVal.toFixed(3), secondaryVol.toFixed(3)],
    ]);

    setBacksweetenedFG(backFG);
    setTotalVolume(totalVolume);

    const offset = recipeData.ingredients
      .filter((ing) => !ing.secondary && ing.category === "fruit")
      .map((ing) => {
        return parseFloat(ing.details[0]) * 25;
      })
      .reduce((prev, curr) => {
        return curr / primaryVol + prev;
      }, 0)
      .toFixed();

    const volume = primaryVol.toFixed(3);
    const OG = Math.round(primaryVal * 1000) / 1000;

    setRecipeData((prev) => ({
      ...prev,
      volume,
      OG,
      offset,
    }));
  }, [recipeData.ingredients, recipeData.FG]);

  useEffect(() => {
    const ABV = calcABV(totalForAbv, backsweetenedFG);
    const delle = toBrix(backsweetenedFG) + 4.5 * ABV;
    setDelle(delle);
    setRecipeData((prev) => ({ ...prev, ABV }));
  }, [backsweetenedFG, recipeData.OG, totalForAbv]);

  useEffect(() => {
    if (!firstMount) {
      const { weight } = recipeData.units;

      let scaler = 2.20462;

      if (weight === "kg") {
        scaler = 0.453592;
      }
      const updatedIngredients = recipeData.ingredients.map((ing) => {
        const updatedWeight = parseFloat(ing.details[0]) * scaler;
        return {
          ...ing,
          details: [updatedWeight.toFixed(3), ing.details[1]] as [
            string,
            string
          ],
        };
      });
      setRecipeData({ ...recipeData, ingredients: updatedIngredients });
    }
  }, [recipeData.units.weight]);

  useEffect(() => {
    if (!firstMount) {
      const { volume } = recipeData.units;

      let scaler = 0.264172;

      if (volume === "liter") {
        scaler = 3.78541;
      }
      const updatedIngredients = recipeData.ingredients.map((ing) => {
        const updatedVolume = parseFloat(ing.details[1]) * scaler;
        return {
          ...ing,
          details: [ing.details[0], updatedVolume.toFixed(3)] as [
            string,
            string
          ],
        };
      });
      setRecipeData({ ...recipeData, ingredients: updatedIngredients });
    }
  }, [recipeData.units.volume]);

  useEffect(() => {
    if (!takingPh && !firstMount) {
      updatePhReading("3.6");
    }
  }, [takingPh]);

  useEffect(() => {
    if (addingStabilizers) {
      const volume = parseFloat(recipeData.volume);
      const { volume: volumeUnits } = recipeData.units;
      const ph = parseFloat(phReading);
      const vol =
        volumeUnits == "gal" ? volume * 0.003785411784 : volume / 1000;
      const sorbate = ((-recipeData.ABV * 25 + 400) / 0.75) * vol;

      let ppm = 50;
      if (ph <= 2.9) ppm = 11;
      if (ph == 3) ppm = 13;
      if (ph == 3.1) ppm = 16;
      if (ph == 3.2) ppm = 21;
      if (ph == 3.3) ppm = 26;
      if (ph == 3.4) ppm = 32;
      if (ph == 3.5) ppm = 39;
      if (ph == 3.6) ppm = 50;
      if (ph == 3.7) ppm = 63;
      if (ph == 3.8) ppm = 98;
      if (ph >= 3.9) ppm = 123;

      const sulfite =
        volumeUnits == "gal"
          ? (volume * 3.785 * ppm) / 570
          : (volume * ppm) / 570;

      const campden =
        volumeUnits !== "gal"
          ? (ppm / 75) * (volume / 3.785)
          : (ppm / 75) * volume;

      setRecipeData((prev) => ({
        ...prev,
        sulfite,
        sorbate,
        campden,
      }));
    } else {
      setRecipeData((prev) => ({
        ...prev,
        sulfite: 0,
        sorbate: 0,
        campden: 0,
      }));
    }
  }, [
    phReading,
    recipeData.units,
    recipeData.ABV,
    recipeData.volume,
    addingStabilizers,
  ]);

  // default to users preferred units when recipe is reset. The abv check is required to ensure it doesn't change the state of the recipe if there is data in local storage.
  useEffect(() => {
    if (recipeData.ABV < 1 && storeData) {
      const units: UnitType =
        preferredUnits === "US"
          ? {
              weight: "lbs",
              volume: "gal",
            }
          : {
              weight: "kg",
              volume: "liter",
            };
      setRecipeData((prev) => ({ ...prev, units }));
    }
  }, [preferredUnits]);

  useEffect(() => {
    if (storeData) {
      localStorage.setItem("recipeData", JSON.stringify(recipeData));
      localStorage.setItem("primaryNotes", JSON.stringify(primaryNotes));
      localStorage.setItem("secondaryNotes", JSON.stringify(secondaryNotes));
      localStorage.setItem("recipeName", recipeName);
      localStorage.setItem(
        "addingStabilizers",
        JSON.stringify({
          adding: addingStabilizers,
          pH: takingPh,
          pHReading: phReading,
        })
      );
    }
  }, [
    recipeData,
    primaryNotes,
    secondaryNotes,
    addingStabilizers,
    takingPh,
    phReading,
    recipeName,
  ]);

  return (
    <RecipeContext.Provider
      value={{
        ...recipeData,
        addIngredient,
        removeIngredient,
        changeIngredient,
        changeVolumeUnits,
        changeWeightUnits,
        ingredientList,
        loadingIngredients,
        updateIngredientWeight,
        updateIngredientVolume,
        updateBrix,
        toggleSecondaryChecked,
        updateFG,
        backsweetenedFG,
        totalVolume,
        delle,
        scaleRecipe,
        addingStabilizers,
        toggleStabilizers,
        takingPh,
        toggleTakingPh,
        phReading,
        updatePhReading,
        additiveList,
        loadingAdditives,
        changeAdditive,
        changeAdditiveUnits,
        changeAdditiveAmount,
        addAdditive,
        removeAdditive,
        notes: {
          primary: primaryNotes,
          secondary: secondaryNotes,
        },
        editPrimaryNote: {
          text: editPrimaryNoteText,
          details: editPrimaryNoteDetails,
        },
        addPrimaryNote,
        removePrimaryNote,
        editSecondaryNote: {
          text: editSecondaryNoteText,
          details: editSecondaryNoteDetails,
        },
        addSecondaryNote,
        removeSecondaryNote,
        recipeNameProps: {
          value: recipeName,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
            setRecipeName(e.target.value),
        },
      }}
    >
      <NutrientProvider
        recipeData={{
          volume: recipeData.volume,
          sg: (1 + recipeData.OG - parseFloat(recipeData.FG)).toFixed(3),
          offset: recipeData.offset,
          numberOfAdditions: "1",
        }}
        storeData
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
