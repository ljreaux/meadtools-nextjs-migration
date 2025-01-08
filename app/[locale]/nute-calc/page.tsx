import NutrientCalculator from "@/components/nutrientCalc/NutrientCalulator";
import { NutrientProvider } from "@/components/providers/NutrientProvider";

function NuteCalc() {
  return (
    <NutrientProvider>
      <NutrientCalculator />
    </NutrientProvider>
  );
}

export default NuteCalc;
