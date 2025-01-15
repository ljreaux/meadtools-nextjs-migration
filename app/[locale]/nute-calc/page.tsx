import NutrientCalculator from "@/components/nutrientCalc/NutrientCalulator";
import { NutrientProvider } from "@/components/providers/NutrientProvider";

function NuteCalc() {
  return (
    <NutrientProvider
      recipeData={{
        volume: "0",
        sg: "1.000",
        offset: "0",
        numberOfAdditions: "1",
      }}
    >
      <NutrientCalculator />
    </NutrientProvider>
  );
}

export default NuteCalc;
