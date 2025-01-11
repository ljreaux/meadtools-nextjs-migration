import { toBrix, toSG } from "@/lib/utils/unitConverter";
import { useEffect, useState } from "react";

const useBrix = (initialVal?: string) => {
  const [mount, setMount] = useState(true);
  const [brix, setBrix] = useState({
    gravity: initialVal || "1.1",
    units: "SG",
    brix: toBrix(parseFloat(initialVal || "1.1")).toString(),
    sg: parseFloat(initialVal || "1.1").toString(),
  });

  useEffect(() => {
    if (!mount) {
      if (brix.units === "Brix") {
        setBrix({ ...brix, gravity: parseFloat(brix.brix).toFixed(2) });
      } else {
        setBrix({ ...brix, gravity: parseFloat(brix.sg).toFixed(3) });
      }
    }
    setMount(false);
  }, [brix.units]);

  useEffect(() => {
    if (brix.units == "SG") {
      setBrix({
        ...brix,
        sg: brix.gravity,
        brix: toBrix(parseFloat(brix.gravity)).toString(),
      });
    } else {
      setBrix({
        ...brix,
        brix: brix.gravity,
        sg: toSG(parseFloat(brix.gravity)).toString(),
      });
    }
  }, [brix.gravity]);

  return {
    ...brix,
    setGravity: (val: string) => setBrix({ ...brix, gravity: val }),
    setUnits: (val: string) => setBrix({ ...brix, units: val }),
  };
};

export default useBrix;
