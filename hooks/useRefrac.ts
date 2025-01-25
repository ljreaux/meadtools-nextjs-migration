import { toBrix, toSG } from "@/lib/utils/unitConverter";
import { isValidNumber, parseNumber } from "@/lib/utils/validateInput";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const useRefrac = () => {
  const { i18n } = useTranslation();
  const currentLocale = i18n.resolvedLanguage;
  const [refrac, setRefrac] = useState({
    cf: (1).toLocaleString(currentLocale),
    og: (1.1).toLocaleString(currentLocale),
    units: "SG",
    fgInBrix: (8.5).toLocaleString(currentLocale),
    fgInSg: toSG(8.5).toLocaleString(currentLocale, {
      maximumFractionDigits: 2,
    }),
    calcBrix: "0",
    calcSg: toSG(0).toLocaleString(currentLocale, { maximumFractionDigits: 2 }),
  });

  const og =
    refrac.units === "SG"
      ? parseNumber(refrac.og)
      : toBrix(parseNumber(refrac.og));
  useEffect(() => {
    const { cf: corFac, fgInBrix: fgBr, units } = refrac;

    const FGBR = parseNumber(fgBr);
    const CORFAC = parseNumber(corFac);

    let actualFg = refracCalc(og, FGBR, CORFAC);
    if (units == "SG") actualFg = refracCalc(toBrix(og), FGBR, CORFAC);

    setRefrac((prev) => ({
      ...prev,
      calcSg: actualFg.toLocaleString(currentLocale, {
        maximumFractionDigits: 3,
      }),
      calcBrix: toBrix(actualFg).toLocaleString(currentLocale, {
        maximumFractionDigits: 2,
      }),
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
