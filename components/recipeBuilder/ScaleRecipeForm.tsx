import { FormEvent, useState } from "react";
import { isValidNumber, parseNumber } from "@/lib/utils/validateInput";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import InputWithUnits from "../nutrientCalc/InputWithUnits";
import { Recipe } from "@/types/recipeDataTypes";

function ScaleRecipeForm({ useRecipe }: { useRecipe: () => Recipe }) {
  const { t, i18n } = useTranslation();
  const currentLocale = i18n.language;
  const {
    scaleRecipe,
    totalVolume,
    units: { volume },
  } = useRecipe();
  const [scaled, setScaled] = useState("0.000");

  const scale = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    scaleRecipe(totalVolume, parseNumber(scaled));
  };

  return (
    <form className="grid grid-cols-2 gap-2 py-6" onSubmit={scale}>
      <h3 className="col-span-full">{t("scale.title")}</h3>
      <label>
        {t("scale.current")}
        <InputWithUnits
          value={totalVolume.toLocaleString(currentLocale)}
          disabled
          text={volume}
        />
      </label>
      <label>
        {t("scale.target")}
        <InputWithUnits
          value={scaled}
          handleChange={(e) => {
            if (isValidNumber(e.target.value)) setScaled(e.target.value);
          }}
          text={volume}
        />
      </label>
      <Button className="col-span-full" variant="secondary" type="submit">
        {t("scale.title")}
      </Button>
    </form>
  );
}

export default ScaleRecipeForm;
