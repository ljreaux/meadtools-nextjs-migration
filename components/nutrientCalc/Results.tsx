import React from "react";
import InputWithUnits from "./InputWithUnits";
import { useTranslation } from "react-i18next";
import Tooltip from "../Tooltips";
import { NutrientType } from "@/types/nutrientTypes";

const goFermKeys = {
  "Go-Ferm": "nuteResults.gfTypes.gf",
  protect: "nuteResults.gfTypes.gfProtect",
  "sterol-flash": "nuteResults.gfTypes.gfSterol",
  none: "nuteResults.gfTypes.none",
};

function Results({ useNutrients }: { useNutrients: () => NutrientType }) {
  const { t } = useTranslation();
  const {
    nutrientAdditions,
    goFerm,
    goFermType,
    remainingYan,
    otherNutrientName,
  } = useNutrients();

  const labels = [
    "nutrients.fermO",
    "nutrients.fermK",
    "nutrients.dap",
    "other.label",
  ];

  const goFermLabel = t(goFermKeys[goFermType.value]) || t(goFermType.value);
  return (
    <div>
      <h2>{t("nuteAmounts")}</h2>
      <div className="grid grid-cols-2 gap-2 border-b border-muted-foreground py-6">
        {nutrientAdditions.totalGrams.map((add, i) => {
          const isInvalid = add <= 0 || isNaN(add);
          const perAdd = nutrientAdditions.perAddition[i];
          if (isInvalid) return null;
          return (
            <label key={labels[i]} className="space-y-2">
              {labels[i] !== "other.label"
                ? t(labels[i])
                : otherNutrientName.value}
              <InputWithUnits value={add.toFixed(3)} text="g total" disabled />
              <InputWithUnits value={perAdd.toFixed(3)} text="g" disabled />
            </label>
          );
        })}
        {Math.round(remainingYan) !== 0 && (
          <div className="col-span-2 bg-destructive p-2">
            <span className="flex gap-1 items-center">
              {t("nuteResults.sideLabels.remainingYan")}
              <Tooltip body={t("tipText.remainingYan")} />
            </span>{" "}
            <p>
              {remainingYan.toFixed(0)} {t("PPM")}
            </p>
          </div>
        )}
      </div>
      {goFermType.value !== "none" && (
        <div className="grid grid-cols-2 gap-2 py-6">
          <h3 className="col-span-2">{t("gfDetails")}</h3>
          <label className="col-start-1">
            {t("PDF.addAmount")}
            <p>{`${goFerm.amount}g ${goFermLabel}`}</p>
          </label>
          <label>
            {t("water")}
            <InputWithUnits value={goFerm.water} text="ml" disabled />
          </label>
        </div>
      )}
    </div>
  );
}

export default Results;
