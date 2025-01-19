import React from "react";
import { Input } from "../ui/input";
import { useTranslation } from "react-i18next";
import Tooltip from "../Tooltips";
import InputWithUnits from "../nutrientCalc/InputWithUnits";
import { Recipe } from "@/types/recipeDataTypes";

function Results({ useRecipe }: { useRecipe: () => Recipe }) {
  const {
    OG,
    FG,
    updateFG,
    backsweetenedFG,
    totalVolume,
    volume,
    ABV,
    delle,
    units,
  } = useRecipe();
  const { t } = useTranslation();

  if (totalVolume <= 0 || OG <= 1) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-muted-foreground py-6">
      <h3 className="col-span-full">{t("results")}</h3>
      <label className="sm:col-span-2">
        {t("recipeBuilder.resultsLabels.estOG")}
        <Input value={OG.toFixed(3)} disabled />
      </label>
      <label>
        <span className="items-center flex">
          {t("recipeBuilder.resultsLabels.estFG")}
          <Tooltip body={t("tipText.estimatedFg")} />
        </span>
        <Input
          value={FG}
          onChange={(e) => updateFG(e.target.value)}
          inputMode="numeric"
          onFocus={(e) => e.target.select()}
        />
      </label>
      <label>
        {t("recipeBuilder.resultsLabels.backFG")}
        <Input disabled value={backsweetenedFG.toFixed(3)} />
      </label>
      <label>
        <span className="flex items-center gap-1">
          {t("recipeBuilder.resultsLabels.totalPrimary")}
          <Tooltip body={t("tipText.totalVolume")} />
        </span>
        <InputWithUnits disabled value={volume} text={units.volume} />
      </label>
      <label>
        <span className="flex items-center gap-1">
          {t("recipeBuilder.resultsLabels.totalSecondary")}
          <Tooltip body={t("tipText.totalSecondary")} />
        </span>
        <InputWithUnits
          disabled
          value={totalVolume.toFixed(3)}
          text={units.volume}
        />
      </label>
      <label>
        {t("recipeBuilder.resultsLabels.abv")}
        <InputWithUnits
          disabled
          value={ABV.toFixed(2)}
          text={t("recipeBuilder.percent")}
        />
      </label>
      <label>
        <span className="flex items-center gap-1">
          {t("recipeBuilder.resultsLabels.delle")}
          <Tooltip
            body={t("tipText.delleUnits")}
            link="https://meadmaking.wiki/en/process/stabilization#via-yeast-alcohol-tolerance"
          />
        </span>
        <InputWithUnits disabled value={delle.toFixed()} text={t("DU")} />
      </label>
    </div>
  );
}

export default Results;
