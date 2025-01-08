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

function VolumeInputs() {
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
          <Input {...inputs.volume} />
        </label>
      </div>
      <div>
        <label>
          {t("UNITS")}
          <Select
            value={inputs.volumeUnits.value}
            onValueChange={inputs.volumeUnits.onChange}
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
      <div className="grid gap-1">
        <label className="grid gap-1">
          <span className="flex gap-1 items-center ">
            {t("nuteSgLabel")} <Tooltip body={t("tipText.nutrientSg")} />
          </span>
          <Input {...inputs.sg} />
        </label>
        <p>{brixString + " Brix"}</p>
      </div>
      <div>
        <label className="grid gap-1">
          <span className="flex items-center  gap-1">
            {t("offset")}
            <Tooltip body={t("tipText.offsetPpm")} />
          </span>
          <Input {...inputs.offset} />
        </label>
      </div>
    </div>
  );
}

export default VolumeInputs;
