import { toSG } from "@/lib/utils/unitConverter";
import { useEffect, useState, useCallback, useMemo } from "react";

export default function useJuice() {
  const [sugar, setSugar] = useState("0");
  const [sugarUnits, setSugarUnits] = useState("g");
  const [servingSize, setServingSize] = useState("0");
  const [servingSizeUnits, setServingSizeUnits] = useState("ml");
  const [servings, setServings] = useState("0");

  // Helper to convert units
  const convertValue = useCallback(
    (value: string, multiplier: number) =>
      Math.round(Number(value) * multiplier * 10000) / 10000,
    []
  );

  // Derived Values
  const brix = useMemo(() => {
    const sugarMultiplier = sugarUnits === "mg" ? 0.1 : 1;
    const servingMultiplier = servingSizeUnits === "floz" ? 29.5735 : 1;

    const sugarMg = Number(sugar) * sugarMultiplier;
    const servingVolume = Number(servingSize) * servingMultiplier;

    const calculatedBrix = servingVolume
      ? Math.round((sugarMg / servingVolume) * 100 * 1000) / 1000
      : 0;

    return isNaN(calculatedBrix) || calculatedBrix > 1000 ? 0 : calculatedBrix;
  }, [sugar, sugarUnits, servingSize, servingSizeUnits]);

  const sg = useMemo(() => Math.round(toSG(brix) * 1000) / 1000, [brix]);

  const totalSugar = useMemo(() => {
    const calculatedTotalSugar =
      Math.round(Number(sugar) * Number(servings) * 1000) / 1000;

    return isNaN(calculatedTotalSugar) ? 0 : calculatedTotalSugar;
  }, [sugar, servings]);

  // Unit Conversions
  useEffect(() => {
    const multiplier = sugarUnits === "mg" ? 1000 : 0.001;
    setSugar((prev) => convertValue(prev, multiplier).toString());
  }, [sugarUnits, convertValue]);

  useEffect(() => {
    const multiplier = servingSizeUnits === "floz" ? 0.033814 : 29.5735;
    setServingSize((prev) => convertValue(prev, multiplier).toString());
  }, [servingSizeUnits, convertValue]);

  return {
    sugar,
    servingSize,
    setSugar,
    setServingSize,
    setServingSizeUnits,
    servingSizeUnits,
    sugarUnits,
    setSugarUnits,
    brix,
    sg,
    servings,
    setServings,
    totalSugar,
  };
}
