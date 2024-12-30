import { toBrix, toSG } from "@/lib/utils/unitConverter";
import { FormEvent, useEffect, useState } from "react";

const useRefrac = () => {
  const [refrac, setRefrac] = useState({
    cf: 1,
    og: 1.1,
    units: "SG",
    fgInBrix: 8.5,
    fgInSg: Math.round(toSG(8.5) * 100) / 100,
    calcBrix: 0,
    calcSg: Math.round(toSG(0) * 100) / 100,
  });

  const og = refrac.units === "SG" ? refrac.og : toSG(refrac.og);
  useEffect(() => {
    const { cf: corFac, og, fgInBrix: fgBr, units } = refrac;

    let actualFg = refracCalc(og, fgBr, corFac);
    if (units == "SG") actualFg = refracCalc(toBrix(og), fgBr, corFac);

    setRefrac((prev) => ({
      ...prev,
      calcSg: actualFg,
      calcBrix: toBrix(actualFg),
    }));
  }, [refrac.cf, refrac.og, refrac.fgInBrix, refrac.units]);

  const handleChange = (e: FormEvent<EventTarget>) => {
    const target = e.target as HTMLInputElement;
    setRefrac((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));
  };
  const handleUnitChange = (val: string) => {
    setRefrac((prev) => ({ ...prev, units: val }));
  };

  return {
    refrac: { ...refrac, og, fg: refrac.calcSg },
    handleChange,
    handleUnitChange,
  };
};

export default useRefrac;

function refracCalc(ogBr: number, fgBr: number, corFac: number) {
  return -0.002349 * (ogBr / corFac) + 0.006276 * (fgBr / corFac) + 1;
}
