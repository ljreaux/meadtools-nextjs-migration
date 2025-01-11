import { toBrix, toSG } from "@/lib/utils/unitConverter";
import { isValidNumber } from "@/lib/utils/validateInput";
import { useEffect, useState } from "react";

const useRefrac = () => {
  const [refrac, setRefrac] = useState({
    cf: "1",
    og: "1.1",
    units: "SG",
    fgInBrix: "8.5",
    fgInSg: toSG(8.5).toFixed(2),
    calcBrix: "0",
    calcSg: toSG(0).toFixed(2),
  });

  const og =
    refrac.units === "SG"
      ? parseFloat(refrac.og)
      : toBrix(parseFloat(refrac.og));
  useEffect(() => {
    const { cf: corFac, fgInBrix: fgBr, units } = refrac;

    const FGBR = parseFloat(fgBr);
    const CORFAC = parseFloat(corFac);

    let actualFg = refracCalc(og, FGBR, CORFAC);
    if (units == "SG") actualFg = refracCalc(toBrix(og), FGBR, CORFAC);

    setRefrac((prev) => ({
      ...prev,
      calcSg: actualFg.toFixed(3),
      calcBrix: toBrix(actualFg).toFixed(2),
    }));
  }, [refrac.cf, refrac.og, refrac.fgInBrix, refrac.units]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isValidNumber(e.target.value))
      setRefrac((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
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
