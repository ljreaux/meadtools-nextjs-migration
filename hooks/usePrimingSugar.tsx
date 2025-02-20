import { toCelsius, toFahrenheit } from "@/lib/utils/temperature";
import { isValidNumber, parseNumber } from "@/lib/utils/validateInput";
import { useEffect, useState } from "react";

type Sugar =
  | {
      label: string;
      amount: number;
    }[]
  | null;

const usePrimingSugar = () => {
  const [sugars, setSugars] = useState<Sugar>(null);

  const [temp, setTemp] = useState("68");
  const [tempUnits, setTempUnits] = useState<"C" | "F">("F");
  const [tempInvalid, setTempInvalid] = useState(false);

  const [vols, setVols] = useState("2.4");
  const [volsInvalid, setVolsInvalid] = useState(false);

  const [volume, setVolume] = useState("0");
  const [volumeUnits, setVolumeUnits] = useState<"gal" | "lit">("gal");

  const [primingSugar, setPrimingSugar] = useState(0);

  const calcPrimingSugar = (temp: string, vols: string, volume: string) => {
    const parsedVolume =
      volumeUnits === "gal"
        ? parseNumber(volume)
        : parseNumber(volume) / 3.78541;

    const parsedTemp =
      tempUnits === "F" ? parseNumber(temp) : toFahrenheit(parseNumber(temp));

    return (
      15.195 *
      parsedVolume *
      (parseNumber(vols) -
        3.0378 +
        5.0062 * 10 ** -2 * parsedTemp -
        2.6555 * 10 ** -4 * parsedTemp ** 2)
    );
  };

  const handleTempChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isValidNumber(e.target.value)) return;
    const validRangeStart = tempUnits === "F" ? 32 : 0;
    const validRangeEnd = tempUnits === "F" ? 110 : 44;
    const parsedTemp = parseNumber(e.target.value);

    if (parsedTemp < validRangeStart || parsedTemp > validRangeEnd) {
      setTempInvalid(true);
    } else {
      setTempInvalid(false);
    }

    setTemp(e.target.value);
  };

  const handleVolsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isValidNumber(e.target.value)) return;
    const parsedVols = parseNumber(e.target.value);
    if (parsedVols < 0 || parsedVols > 6) {
      setVolsInvalid(true);
    } else {
      setVolsInvalid(false);
    }
    setVols(e.target.value);
  };

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/ingredients?category=sugar");
      const data = await res.json();
      const sugars = data
        .map((sugar: { name: string; sugar_content: string }) => ({
          label: sugar.name,
          amount: 100 / parseFloat(sugar.sugar_content),
        }))
        .sort(
          (
            a: { label: string; amount: number },
            b: { label: string; amount: number }
          ) => {
            if (a.label === "Table Sugar" || a.label === "Corn Sugar") {
              return -1;
            }
            if (b.label === "Table Sugar" || b.label === "Corn Sugar") {
              return 1;
            }
          }
        );
      setSugars(sugars);
    })();
  }, []);

  useEffect(() => {
    setPrimingSugar(calcPrimingSugar(temp, vols, volume));
  }, [temp, vols, volume]);

  return {
    tempProps: {
      value: temp,
      onChange: handleTempChange,
    },
    tempInvalid,

    volsProps: {
      value: vols,
      onChange: handleVolsChange,
    },
    volsInvalid,

    volumeProps: {
      value: volume,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isValidNumber(e.target.value)) setVolume(e.target.value);
      },
    },
    volumeUnitProps: {
      onValueChange: (val: string) => {
        setVolumeUnits(val as "gal" | "lit");
        if (volumeUnits === "lit") {
          setVolume((parseNumber(volume) / 3.78541).toString());
        } else {
          setVolume((parseNumber(volume) * 3.78541).toString());
        }
      },
      value: volumeUnits,
    },
    tempUnitProps: {
      onValueChange: (val: string) => {
        setTempUnits(val as "C" | "F");
        if (tempUnits === "C") {
          setTemp(toFahrenheit(parseNumber(temp)).toString());
        } else {
          setTemp(toCelsius(parseNumber(temp)).toString());
        }
      },
      value: tempUnits,
    },
    primingSugarAmounts: sugars?.map((sugar) => ({
      ...sugar,
      amount: sugar.amount * primingSugar,
    })),
  };
};

export default usePrimingSugar;
