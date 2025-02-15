"use client";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { calcSb, toBrix } from "@/lib/utils/unitConverter";
import { useTranslation } from "react-i18next";
import Tooltip from "../Tooltips";
import { NutrientType } from "@/types/nutrientTypes";
import { parseNumber } from "@/lib/utils/validateInput";

function VolumeInputs({
  useNutrients,
  disabled,
}: {
  useNutrients: () => NutrientType;
  disabled?: boolean;
}) {
  const { t, i18n } = useTranslation();
  const currentLocale = i18n.resolvedLanguage;
  const { inputs } = useNutrients();
  const sgNum = isNaN(parseNumber(inputs.sg.value))
    ? 1
    : parseNumber(inputs.sg.value);
  const brixString = toBrix(sgNum).toLocaleString(currentLocale, {
    maximumFractionDigits: 2,
  });
  const sugarBreak =
    t("nuteResults.sb") +
    ": " +
    calcSb(parseNumber(inputs.sg.value)).toLocaleString(currentLocale, {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    });
  return (
    <div className="joyride-nutrientInputs grid grid-cols-2 gap-2 border-b border-muted-foreground py-6">
      <div>
        <label>
          {t("nuteVolume")}
          <Input
            {...inputs.volume}
            disabled={disabled}
            inputMode="numeric"
            onFocus={(e) => e.target.select()}
          />
        </label>
      </div>
      <div>
        <label>
          {t("UNITS")}
          <Select
            value={inputs.volumeUnits.value}
            onValueChange={inputs.volumeUnits.onChange}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gal">Gallons</SelectItem>
              <SelectItem value="liter">Liters</SelectItem>
            </SelectContent>
          </Select>
        </label>
      </div>
      <div className="col-span-2 sm:col-span-1 grid gap-1">
        <label className="grid gap-1">
          <span className="flex sm:gap-1 items-center">
            {t("nuteSgLabel")} <Tooltip body={t("tipText.nutrientSg")} />
          </span>
          <Input
            {...inputs.sg}
            disabled={disabled}
            inputMode="numeric"
            onFocus={(e) => e.target.select()}
          />
        </label>
        <span className="sm:flex grid sm:gap-2 sm:justify-evenly w-full">
          <p>{brixString + " Brix"}</p> <p>{sugarBreak}</p>
        </span>
      </div>
      <div className="joyride-offset col-span-2 sm:col-span-1">
        <label className="grid gap-1">
          <span className="flex items-center sm:gap-1">
            {t("offset")}
            <Tooltip body={t("tipText.offsetPpm")} />
          </span>
          <Input
            {...inputs.offset}
            inputMode="numeric"
            onFocus={(e) => e.target.select()}
          />
        </label>
      </div>
    </div>
  );
}

export default VolumeInputs;
