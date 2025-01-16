import SearchableInput from "../ui/SearchableInput";
import { useRecipe } from "../providers/RecipeProvider";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";
import { Additive, AdditiveType } from "@/types/recipeDataTypes";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { isValidNumber } from "@/lib/utils/validateInput";

const units = [
  { value: "g", label: "G" },
  { value: "mg", label: "MG" },
  { value: "kg", label: "KG" },
  { value: "oz", label: "OZ" },
  { value: "lbs", label: "LBS" },
  { value: "ml", label: "ML" },
  { value: "liters", label: "LIT" },
  { value: "fl oz", label: "FLOZ" },
  { value: "quarts", label: "QUARTS" },
  { value: "gal", label: "GALS" },
  { value: "tsp", label: "TSP" },
  { value: "tbsp", label: "TBSP" },
  { value: "units", label: "UNITS" },
];

function Additives() {
  const {
    additives,
    changeAdditive,
    changeAdditiveUnits,
    changeAdditiveAmount,
    addAdditive,
    removeAdditive,
  } = useRecipe();
  const { t } = useTranslation();
  return (
    <div>
      <span>
        {additives.length === 0
          ? "Add Some Ingredients to Continue Building your Recipe."
          : additives.map((add, i) => {
              return (
                <div
                  className={`${
                    i !== additives.length - 1 ? "border-b border-dotted " : ""
                  }`}
                  key={i}
                >
                  <AdditiveLine
                    add={add}
                    changeAdditive={(add) => {
                      changeAdditive(i, add);
                    }}
                    changeUnit={(unit) => {
                      changeAdditiveUnits(i, unit);
                    }}
                    changeAmount={(amount) => {
                      changeAdditiveAmount(i, amount);
                    }}
                    remove={() => removeAdditive(i)}
                  />
                </div>
              );
            })}
      </span>
      <Button
        onClick={addAdditive}
        variant={"secondary"}
        disabled={additives.length >= 10}
        className="w-full"
      >
        {t("additives.addNew")}
      </Button>
    </div>
  );
}

export default Additives;

const AdditiveLine = ({
  add,
  changeAdditive,
  changeUnit,
  changeAmount,
  remove,
}: {
  add: AdditiveType;
  changeAdditive: (val: string) => void;
  changeUnit: (val: string) => void;
  changeAmount: (val: string) => void;
  remove: () => void;
}) => {
  const { t } = useTranslation();
  const { additiveList } = useRecipe();

  const handleAdditiveSelect = (selectedIngredient: Additive) => {
    changeAdditive(selectedIngredient.name);
  };
  return (
    <div className="grid sm:grid-cols-6 grid-cols-3 gap-2 py-6">
      <span className="col-span-2">
        <SearchableInput
          items={additiveList}
          query={add.name}
          setQuery={(val) => changeAdditive(val)}
          keyName="name"
          onSelect={handleAdditiveSelect}
        />
      </span>
      <Input
        value={add.amount}
        onChange={(e) => {
          if (isValidNumber(e.target.value)) changeAmount(e.target.value);
        }}
        inputMode="numeric"
        onFocus={(e) => e.target.select()}
        className="col-span-2"
      />
      <Select value={add.unit} onValueChange={changeUnit}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {units.map((unit) => (
            <SelectItem key={unit.value} value={unit.value}>
              {t(unit.label)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={remove} variant={"destructive"}>
        Remove
      </Button>
    </div>
  );
};
