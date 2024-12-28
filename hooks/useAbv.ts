import { useState, useEffect } from "react";

import { calcABV, toBrix } from "@/lib/utils/unitConverter";

interface TAbvObj {
  OG: number;
  FG: number;
  vol?: number;
  units?: string;
}

export default function useAbv(OG: number, FG: number) {
  const [abv, setAbv] = useState<{ ABV: number; delle: number }>({
    ABV: 0,
    delle: 0,
  });

  useEffect(() => {
    const ABV = calcABV(OG, FG);
    const delle = toBrix(FG) + 4.5 * ABV;
    setAbv({ ABV, delle });
  }, [OG, FG]);

  return abv;
}
