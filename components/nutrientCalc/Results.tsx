import React from "react";
import { useNutrients } from "../providers/NutrientProvider";
import InputWithUnits from "./InputWithUnits";
import { useTranslation } from "react-i18next";

const goFermKeys = {
  "Go-Ferm": "nuteResults.gfTypes.gf",
  protect: "nuteResults.gfTypes.gfProtect",
  "sterol-flash": "nuteResults.gfTypes.gfSterol",
  none: "nuteResults.gfTypes.none",
};

function Results() {
  const { t } = useTranslation();
  const { nutrientAdditions, goFerm, goFermType } = useNutrients();

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
              {t(labels[i])}
              <InputWithUnits
                value={Math.round(add * 1000) / 1000}
                text="g total"
                disabled
              />
              <InputWithUnits
                value={Math.round(perAdd * 1000) / 1000}
                text="g"
                disabled
              />
            </label>
          );
        })}
      </div>
      {goFermType.value !== "none" && (
        <div className="grid grid-cols-2 gap-2 py-6">
          <h3 className="col-span-2">{t("gfDetails")}</h3>
          <label className="col-start-1">
            {t("PDF.addAmount")}
            <p>{`${goFerm.amount}g ${goFermLabel}`}</p>
          </label>
          <label>
            {t("water")}{" "}
            <InputWithUnits value={goFerm.water} text="ml" disabled />
          </label>
        </div>
      )}
    </div>
  );
}

export default Results;
