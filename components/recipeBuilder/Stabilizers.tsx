import React from "react";
import { Switch } from "../ui/switch";
import { useRecipe } from "../providers/RecipeProvider";
import { useTranslation } from "react-i18next";
import { Input } from "../ui/input";
import InputWithUnits from "../nutrientCalc/InputWithUnits";
import Tooltip from "../Tooltips";

function Stabilizers() {
  const { t } = useTranslation();
  const {
    addingStabilizers,
    toggleStabilizers,
    takingPh,
    toggleTakingPh,
    phReading,
    updatePhReading,
    sorbate,
    sulfite,
    campden,
  } = useRecipe();
  return (
    <div className="grid py-6 gap-2">
      <label className="flex items-center gap-1">
        {t("adding")}
        <Switch
          checked={addingStabilizers}
          onCheckedChange={toggleStabilizers}
        />
      </label>
      {addingStabilizers && (
        <>
          <span className="flex justify-between border-b border-muted-foreground pb-6">
            <label className="flex items-center gap-1 py-6">
              {t("pH")}
              <Switch checked={takingPh} onCheckedChange={toggleTakingPh} />
            </label>
            {takingPh && (
              <label>
                Reading
                <Input
                  value={phReading}
                  onChange={(e) => updatePhReading(e.target.value)}
                  inputMode="numeric"
                  onFocus={(e) => e.target.select()}
                />
              </label>
            )}
          </span>
          <h3 className="pt-6">{t("results")} </h3>
          <label className="py-4 border-b border-dashed">
            {t("kSorbate")}
            {sorbate > 0 ? (
              <InputWithUnits value={sorbate.toFixed(3)} disabled text="g" />
            ) : (
              t("noSorb")
            )}
          </label>
          <span className="grid items-center space-y-2 py-2">
            <label>
              {t("kMeta")}
              <InputWithUnits
                value={sulfite.toFixed(3)}
                disabled
                text="g"
              />{" "}
            </label>
            <p className="text-center"> {t("accountPage.or")}</p>
            <label>
              <span className="items-center flex gap-1">
                {t("campden")}
                <Tooltip body={t("tipText.campden")} />
              </span>
              <InputWithUnits value={campden.toFixed(2)} disabled text="" />
            </label>
          </span>
        </>
      )}
    </div>
  );
}

export default Stabilizers;
