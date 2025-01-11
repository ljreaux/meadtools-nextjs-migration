"use client";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useBrix from "@/hooks/useBrix";
import { isValidNumber } from "@/lib/utils/validateInput";
import { useTranslation } from "react-i18next";

function Brix() {
  const { t } = useTranslation();
  const { gravity, sg, brix, units, setGravity, setUnits } = useBrix();

  const displayString =
    units === "SG"
      ? `${parseFloat(brix).toFixed(2)} ${t("BRIX")}`
      : parseFloat(sg).toFixed(3);
  return (
    <>
      <h1 className="sm:text-3xl text-xl text-center">{t("brixHeading")} </h1>
      <label htmlFor="gravity">{t("gravityLabel")}</label>

      <Input
        inputMode="numeric"
        id="gravity"
        onFocus={(e) => e.target.select()}
        value={gravity}
        onChange={(e) => {
          if (isValidNumber(e.target.value)) setGravity(e.target.value);
        }}
      />

      <Select name="units" onValueChange={setUnits}>
        <SelectTrigger>
          <SelectValue placeholder={t("SG")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="SG">{t("SG")}</SelectItem>
          <SelectItem value="Brix">{t("BRIX")}</SelectItem>
        </SelectContent>
      </Select>

      <p className="text-center text-lg">{displayString}</p>
    </>
  );
}

export default Brix;
