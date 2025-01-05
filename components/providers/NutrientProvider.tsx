"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

export type YeastBrand =
  | "Lalvin"
  | "Fermentis"
  | "Mangrove Jack"
  | "Red Star"
  | "Other";

type NitrogenRequirement = "Very Low" | "Low" | "Medium" | "High" | "Very High";
type VolumeUnits = "gal" | "liter";
type ScheduleType =
  | "tbe"
  | "tosna"
  | "justK"
  | "dap"
  | "oAndk"
  | "oAndDap"
  | "kAndDap"
  | "other";

// Yeast data model (for each yeast)
type Yeast = {
  id: number;
  brand: YeastBrand;
  name: string;
  nitrogen_requirement: NitrogenRequirement;
  tolerance: string;
  low_temp: string;
  high_temp: string;
};

type FullNutrientData = {
  inputs: {
    volume: string;
    sg: string;
    offset: string;
    numberOfAdditions: string;
  };
  selected: {
    yeastBrand: YeastBrand;
    yeastStrain: string;
    yeastDetails: Yeast;
    n2Requirement: NitrogenRequirement;
    volumeUnits: VolumeUnits;
    schedule: ScheduleType;
    selectedNutrients: string[];
  };
  yanContribution: number[];
  outputs: {
    targetYan: number;
    yeastAmount: number;
  };
};

type NutrientType = {
  inputs: {
    volume: {
      value: string;
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    };
    sg: {
      value: string;
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    };
    offset: {
      value: string;
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    };
    numberOfAdditions: {
      value: string;
      onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    };
  };
  selected: {
    yeastBrand: YeastBrand;
    yeastStrain: string;
    yeastDetails: Yeast;
    schedule: ScheduleType;
    selectedNutrients: string[];
  };
  setVolume: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setSG: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setOffset: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setNumberOfAdditions: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  setYeastBrand: (brand: YeastBrand) => void;
  setYeastName: (name: string) => void;
  setSelectedNutrients: (nutrients: string[]) => void;
  yeastList: Yeast[];
  loadingYeasts: boolean;
  maxGpl: number[];
};
type MaxGplEntry = {
  name: string;
  value: number[] | number[][];
};
const NutrientContext = createContext<NutrientType | undefined>(undefined);

export const NutrientProvider = ({ children }: { children: ReactNode }) => {
  const [yeastList, setYeastList] = useState<Yeast[]>([]);
  const [loadingYeasts, setLoadingYeasts] = useState(true);

  const maxGpl: Record<ScheduleType, MaxGplEntry> = {
    tbe: { name: "TBE (All Three)", value: [0.45, 0.5, 0.96] },
    tosna: { name: "TOSNA (Fermaid O Only)", value: [2.5, 0, 0] },
    justK: { name: "Fermaid K Only", value: [0, 3, 0] },
    dap: { name: "DAP Only", value: [0, 0, 1.5] },
    oAndk: {
      name: "Fermaid O & K",
      value: [
        [0.6, 0.81, 0],
        [0.9, 0.81, 0],
        [1.1, 1, 0],
      ],
    },
    oAndDap: { name: "Fermaid O & DAP", value: [1, 0, 0.96] },
    kAndDap: { name: "Fermaid K & DAP", value: [0, 1, 0.96] },
    other: { name: "Other", value: [] },
  };

  // Full data, which is not directly exposed to the UI
  const [fullData, setFullData] = useState<FullNutrientData>({
    inputs: {
      volume: "1",
      sg: "1",
      offset: "0",
      numberOfAdditions: "1",
    },
    selected: {
      yeastBrand: "Lalvin",
      yeastStrain: "18-2007",
      yeastDetails: {
        id: 1,
        brand: "Lalvin",
        name: "18-2007",
        nitrogen_requirement: "Low",
        tolerance: "17",
        low_temp: "55",
        high_temp: "95",
      },
      n2Requirement: "Low",
      volumeUnits: "gal",
      schedule: "tosna",
      selectedNutrients: ["Fermaid O"],
    },
    yanContribution: [40, 100, 210],
    outputs: {
      targetYan: 351,
      yeastAmount: 3.07,
    },
  });

  const [selectedGpl, setSelectedGpl] = useState(
    maxGpl.tosna.value as number[]
  );

  useEffect(() => {
    const { schedule } = fullData.selected;
    const value = maxGpl[schedule].value;
    const { sg } = fullData.inputs;
    const og = parseFloat(sg);

    if (typeof value[0] === "number") {
      setSelectedGpl(value as number[]);
    } else {
      if (og <= 1.08) {
        setSelectedGpl(value[0]);
      } else if (og <= 1.11) {
        setSelectedGpl(value[1] as number[]);
      } else {
        setSelectedGpl(value[2] as number[]);
      }
    }
  }, [fullData.selected.schedule, fullData.inputs.sg]);

  useEffect(() => {
    const fetchYeasts = async () => {
      try {
        const response = await fetch("/api/yeasts"); // Fetch yeast list from the API
        const data = await response.json();
        setYeastList(data);
        setLoadingYeasts(false);
      } catch (error) {
        console.error("Error fetching yeast list:", error);
        setLoadingYeasts(false);
      }
    };

    fetchYeasts();
  }, []);

  // Setters for handling input change
  const setVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^-?\d*\.?\d*$/.test(value)) {
      setFullData((prev) => ({
        ...prev,
        inputs: { ...prev.inputs, volume: value },
      }));
    }
  };

  const setSG = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^-?\d*\.?\d*$/.test(value)) {
      setFullData((prev) => ({
        ...prev,
        inputs: { ...prev.inputs, sg: value },
      }));
    }
  };

  const setOffset = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^-?\d*\.?\d*$/.test(value)) {
      setFullData((prev) => ({
        ...prev,
        inputs: { ...prev.inputs, offset: value },
      }));
    }
  };

  const setNumberOfAdditions = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (!isNaN(parseInt(value, 10))) {
      setFullData((prev) => ({
        ...prev,
        inputs: { ...prev.inputs, numberOfAdditions: value },
      }));
    }
  };

  const setYeastBrand = (brand: YeastBrand) => {
    // Find the first yeast of the selected brand
    const firstYeast = yeastList.find((yeast) => yeast.brand === brand);

    // Set yeastStrain to the first yeast's name if found, or leave as is
    setFullData((prev) => ({
      ...prev,
      selected: {
        ...prev.selected,
        yeastBrand: brand,
        yeastStrain: firstYeast ? firstYeast.name : prev.selected.yeastStrain,
        yeastDetails: firstYeast || prev.selected.yeastDetails,
      },
    }));
  };

  const setYeastName = (name: string) => {
    const yeast = yeastList.find((yeast) => yeast.name === name);
    if (yeast) {
      setFullData((prev) => ({
        ...prev,
        selected: {
          ...prev.selected,
          yeastStrain: name,
          yeastDetails: yeast,
        },
      }));
    }
  };

  const setSelectedNutrients = (nutrients: string[]) => {
    let schedule: ScheduleType = "other"; // Default to "other" if no predefined selection matches

    if (nutrients.includes("Other")) {
      schedule = "other";
    } else if (
      nutrients.includes("Fermaid O") &&
      nutrients.includes("Fermaid K") &&
      nutrients.includes("DAP")
    ) {
      schedule = "tbe"; // Fermaid O, Fermaid K, and DAP
    } else if (
      nutrients.includes("Fermaid O") &&
      nutrients.includes("Fermaid K")
    ) {
      schedule = "oAndk"; // Fermaid O & K
    } else if (nutrients.includes("Fermaid O") && nutrients.includes("DAP")) {
      schedule = "oAndDap"; // Fermaid O & DAP
    } else if (nutrients.includes("Fermaid K") && nutrients.includes("DAP")) {
      schedule = "kAndDap"; // Fermaid K & DAP
    } else if (nutrients.includes("Fermaid O")) {
      schedule = "tosna"; // Fermaid O Only
    } else if (nutrients.includes("Fermaid K")) {
      schedule = "justK"; // Fermaid K Only
    } else if (nutrients.includes("DAP")) {
      schedule = "dap"; // DAP Only
    }

    setFullData((prev) => ({
      ...prev,
      selected: {
        ...prev.selected,
        selectedNutrients: nutrients,
        schedule: schedule, // Set the schedule based on selected nutrients
      },
    }));
  };

  // Expose only the necessary state to the UI
  const uiState = {
    inputs: {
      volume: { value: fullData.inputs.volume, onChange: setVolume },
      sg: { value: fullData.inputs.sg, onChange: setSG },
      offset: { value: fullData.inputs.offset, onChange: setOffset },
      numberOfAdditions: {
        value: fullData.inputs.numberOfAdditions,
        onChange: setNumberOfAdditions,
      },
    },
    selected: {
      yeastBrand: fullData.selected.yeastBrand,
      yeastStrain: fullData.selected.yeastStrain,
      yeastDetails: fullData.selected.yeastDetails,
      schedule: fullData.selected.schedule,
      selectedNutrients: fullData.selected.selectedNutrients,
    },
    setVolume,
    setSG,
    setOffset,
    setNumberOfAdditions,
    setYeastBrand,
    setYeastName,
    setSelectedNutrients,
    yeastList,
    loadingYeasts,
    maxGpl: selectedGpl,
  };

  return (
    <NutrientContext.Provider value={uiState}>
      {children}
    </NutrientContext.Provider>
  );
};

export const useNutrients = () => {
  const context = useContext(NutrientContext);
  if (!context) {
    throw new Error("useNutrients must be used within a NutrientProvider");
  }
  return context;
};
