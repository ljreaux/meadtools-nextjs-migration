export type IngredientDetails = {
  id: number;
  name: string;
  brix: string;
  details: [string, string];
  secondary: boolean;
  category: string;
};

export type Ingredient = {
  id: number;
  name: string;
  sugar_content: string;
  water_content: string;
  category: string;
  translationKey?: string;
};

export type UnitType = {
  weight: "lbs" | "kg";
  volume: "gal" | "liter";
};

export type AdditiveType = {
  name: string;
  amount: string;
  unit: string;
};

export type Additive = {
  name: string;
  dosage: string;
  unit: string;
};

export interface RecipeData {
  ingredients: IngredientDetails[];
  OG: number;
  volume: string;
  ABV: number;
  FG: string;
  offset: string;
  units: UnitType;
  additives: AdditiveType[];
  sorbate: number;
  sulfite: number;
  campden: number;
}

export type NotesType = [string, string][];

export const blankAdditive: AdditiveType = {
  name: "",
  amount: "",
  unit: "g",
};

export const initialData: RecipeData = {
  ingredients: [
    {
      id: 4,
      name: "Water",
      brix: "0.00",
      details: ["0", "0.000"],
      secondary: false,
      category: "water",
    },
    {
      id: 1,
      name: "Honey",
      brix: "79.60",
      details: ["0", "0.000"],
      secondary: false,
      category: "sugar",
    },
  ],
  OG: 1.0,
  volume: "0",
  ABV: 0,
  FG: "0.996",
  offset: "0",
  units: {
    weight: "lbs",
    volume: "gal",
  },
  additives: [blankAdditive],
  sorbate: 0,
  sulfite: 0,
  campden: 0,
};

export interface Recipe extends RecipeData {
  addIngredient: () => void;
  removeIngredient: (i: number) => void;
  ingredientList: Ingredient[];
  loadingIngredients: boolean;
  changeIngredient: (index: number, name: string) => void;
  changeVolumeUnits: (unit: string) => void;
  changeWeightUnits: (unit: string) => void;
  updateIngredientVolume: (
    ing: IngredientDetails,
    index: number,
    volume: string
  ) => void;
  updateIngredientWeight: (
    ing: IngredientDetails,
    index: number,
    weight: string
  ) => void;
  updateBrix: (brix: string, index: number) => void;
  toggleSecondaryChecked: (i: number, b: boolean) => void;
  updateFG: (FG: string) => void;
  backsweetenedFG: number;
  totalVolume: number;
  delle: number;
  scaleRecipe: (val: number, scaler: number) => void;
  addingStabilizers: boolean;
  toggleStabilizers: (val: boolean) => void;
  takingPh: boolean;
  toggleTakingPh: (val: boolean) => void;
  phReading: string;
  updatePhReading: (val: string) => void;
  additiveList: Additive[];
  loadingAdditives: boolean;
  changeAdditive: (index: number, name: string) => void;
  changeAdditiveUnits: (index: number, unit: string) => void;
  changeAdditiveAmount: (index: number, amount: string) => void;
  addAdditive: () => void;
  removeAdditive: (i: number) => void;
  notes: {
    primary: NotesType;
    secondary: NotesType;
  };
  editPrimaryNote: {
    text: (index: number, note: string) => void;
    details: (index: number, note: string) => void;
  };
  addPrimaryNote: () => void;
  removePrimaryNote: (i: number) => void;
  editSecondaryNote: {
    text: (index: number, note: string) => void;
    details: (index: number, note: string) => void;
  };
  addSecondaryNote: () => void;
  removeSecondaryNote: (i: number) => void;
  recipeNameProps: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
}

export const blankIngredient: IngredientDetails = {
  id: 1,
  name: "Honey",
  brix: "79.6",
  details: ["0", "0"],
  secondary: false,
  category: "sugar",
};

export const blankNote: [string, string] = ["", ""];
