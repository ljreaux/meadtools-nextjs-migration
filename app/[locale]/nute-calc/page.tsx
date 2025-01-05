"use client";
import {
  NutrientProvider,
  useNutrients,
} from "@/components/providers/NutrientProvider";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

function NuteCalc() {
  return (
    <NutrientProvider>
      <TestComponent />
    </NutrientProvider>
  );
}

export default NuteCalc;

const TestComponent = () => {
  const {
    inputs,
    selected,
    setYeastBrand,
    setYeastName,
    loadingYeasts,
    yeastList,
    setSelectedNutrients,
    maxGpl,
  } = useNutrients();

  const isOther = selected.schedule === "other";

  // Handle the change of selected nutrients
  const handleNutrientChange = (nutrient: string) => {
    const prevSelected = selected.selectedNutrients;

    if (prevSelected.includes(nutrient)) {
      // If the nutrient is already selected, remove it
      setSelectedNutrients(prevSelected.filter((item) => item !== nutrient));
    } else {
      // If the nutrient is not selected, add it
      setSelectedNutrients([...prevSelected, nutrient]);
    }
  };

  if (loadingYeasts) {
    return <div>Loading yeasts...</div>;
  }

  return (
    <div className="pt-24 bg-background">
      <div>
        <h3>Select Nutrients:</h3>
        <label>
          <Input
            type="checkbox"
            checked={selected.selectedNutrients.includes("Fermaid O")}
            onChange={() => handleNutrientChange("Fermaid O")}
          />
          Fermaid O
        </label>
        <br />
        <label>
          <Input
            type="checkbox"
            checked={selected.selectedNutrients.includes("Fermaid K")}
            onChange={() => handleNutrientChange("Fermaid K")}
          />
          Fermaid K
        </label>
        <br />
        <label>
          <Input
            type="checkbox"
            checked={selected.selectedNutrients.includes("DAP")}
            onChange={() => handleNutrientChange("DAP")}
          />
          DAP
        </label>
        <br />
        <label>
          <Input
            type="checkbox"
            checked={selected.selectedNutrients.includes("Other")}
            onChange={() => handleNutrientChange("Other")}
          />
          Other
        </label>
      </div>
      {isOther && <Input />}
      <div>
        <label>
          Volume:
          <Input {...inputs.volume} />
        </label>
      </div>
      <div>
        <label>
          SG:
          <Input {...inputs.sg} />
        </label>
      </div>
      <div>
        <label>
          Offset:
          <Input {...inputs.offset} />
        </label>
      </div>
      <div>
        <label>
          Number of Additions:
          <Select {...inputs.numberOfAdditions}>
            <SelectContent>
              {[1, 2, 3, 4].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
      </div>
      <div>
        <label>
          Yeast Brand:
          <Select value={selected.yeastBrand} onValueChange={setYeastBrand}>
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
          Yeast Name:
          <Select value={selected.yeastStrain} onValueChange={setYeastName}>
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
        </label>
      </div>

      <div>{maxGpl}</div>

      {/* Display selected yeast details */}
      {selected.yeastDetails && (
        <div className="mt-4">
          <h3>Selected Yeast Details:</h3>
          <p>Name: {selected.yeastDetails.name}</p>
          <p>Brand: {selected.yeastDetails.brand}</p>
          <p>
            Nitrogen Requirement: {selected.yeastDetails.nitrogen_requirement}
          </p>
          <p>Tolerance: {selected.yeastDetails.tolerance}</p>
          <p>Low Temp: {selected.yeastDetails.low_temp}</p>
          <p>High Temp: {selected.yeastDetails.high_temp}</p>
        </div>
      )}
    </div>
  );
};
