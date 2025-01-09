"use client";
import { Input } from "../ui/input";
import { useNutrients } from "../providers/NutrientProvider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toBrix } from "@/lib/utils/unitConverter";
import { useTranslation } from "react-i18next";
import Tooltip from "../Tooltips";

function VolumeInputs({ disabled }: { disabled?: boolean }) {
  const { t } = useTranslation();
  const { inputs } = useNutrients();
  const sgNum = isNaN(parseFloat(inputs.sg.value))
    ? 1
    : parseFloat(inputs.sg.value);
  const brixString = toBrix(sgNum).toFixed(2);
  return (
    <div className="grid grid-cols-2 gap-2 border-b border-muted-foreground py-6">
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
        <p>{brixString + " Brix"}</p>
      </div>
      <div className="col-span-2 sm:col-span-1">
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
