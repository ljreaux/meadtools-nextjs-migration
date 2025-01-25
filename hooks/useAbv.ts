import { useState, useEffect } from "react";

import { calcABV, toBrix } from "@/lib/utils/unitConverter";
import { parseNumber } from "@/lib/utils/validateInput";

export default function useAbv(OG: string, FG: string) {
  const [abv, setAbv] = useState<{ ABV: number; delle: number }>({
    ABV: 0,
    delle: 0,
  });

  useEffect(() => {
    const ABV = calcABV(parseNumber(OG), parseNumber(FG));
    const delle = toBrix(parseNumber(FG)) + 4.5 * ABV;
    setAbv({ ABV, delle });
  }, [OG, FG]);

  return abv;
}
