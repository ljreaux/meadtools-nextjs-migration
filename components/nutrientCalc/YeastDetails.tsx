import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNutrients } from "../providers/NutrientProvider";
import InputWithUnits from "./InputWithUnits";
import { useTranslation } from "react-i18next";
import Tooltip from "../Tooltips";
import { Input } from "../ui/input";

function YeastDetails() {
  const { t } = useTranslation();
  const {
    selected,
    setYeastBrand,
    yeastList,
    setYeastName,
    setNitrogenRequirement,
    targetYAN,
  } = useNutrients();

  return (
    <div className="grid grid-cols-2 gap-2 border-b border-muted-foreground py-6">
      <div>
        <label>
          {t("yeastBrand")}
          <Select
            defaultValue={selected.yeastBrand}
            onValueChange={setYeastBrand}
          >
            <SelectTrigger>
              <span>{selected.yeastBrand}</span>
            </SelectTrigger>
            <SelectContent>
              {Array.from(new Set(yeastList.map((yeast) => yeast.brand))).map(
                (brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </label>
      </div>
      <div>
        <label>
          {t("yeastStrain")}

          {selected.yeastBrand !== "Other" ? (
            <Select
              defaultValue={selected.yeastStrain}
              onValueChange={setYeastName}
            >
              <SelectTrigger>
                <span>{selected.yeastStrain}</span>
              </SelectTrigger>
              <SelectContent>
                {yeastList
                  .filter((yeast) => yeast.brand === selected.yeastBrand)
                  .map((yeast) => (
                    <SelectItem key={yeast.id} value={yeast.name}>
                      {yeast.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              value={selected.yeastDetails.name}
              onChange={(e) => setYeastName(e.target.value)}
            />
          )}
        </label>
      </div>
      <div>
        <label className="grid gap-1">
          <span className="flex items-center  gap-1">
            {t("n2Requirement.label")}
            <Tooltip body={t("tipText.nitrogenRequirements")} />
          </span>
          <Select
            value={selected.yeastNitrogenRequirement}
            onValueChange={setNitrogenRequirement}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="Low" value="Low">
                {t("n2Requirement.low")}
              </SelectItem>
              <SelectItem key="Medium" value="Medium">
                {t("n2Requirement.medium")}
              </SelectItem>
              <SelectItem key="High" value="High">
                {t("n2Requirement.high")}
              </SelectItem>
              <SelectItem key="Very High" value="Very High">
                {t("n2Requirement.veryHigh")}
              </SelectItem>
            </SelectContent>
          </Select>
        </label>
      </div>
      <div>
        <span className="grid gap-1">
          <span className="flex items-center gap-1">
            {t("targetYan")}
            <Tooltip body={t("tipText.yan")} />
          </span>
          <InputWithUnits value={targetYAN} text={"PPM"} disabled />
        </span>
      </div>
    </div>
  );
}

export default YeastDetails;
