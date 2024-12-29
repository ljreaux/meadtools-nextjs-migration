import { toBrix, toSG } from "@/lib/utils/unitConverter";
import { useEffect, useState } from "react";

const useBrix = (initialVal?: number) => {
  const [mount, setMount] = useState(true);
  const [brix, setBrix] = useState({
    gravity: initialVal || 1.1,
    units: "SG",
    brix: toBrix(initialVal || 1.1),
    sg: initialVal || 1.1,
  });

  useEffect(() => {
    if (!mount) {
      if (brix.units === "Brix") {
        setBrix({ ...brix, gravity: Math.round(brix.brix * 100) / 100 });
      } else {
        setBrix({ ...brix, gravity: Math.round(brix.sg * 1000) / 1000 });
      }
    }
    setMount(false);
  }, [brix.units]);

  useEffect(() => {
    if (brix.units == "SG") {
      setBrix({ ...brix, sg: brix.gravity, brix: toBrix(brix.gravity) });
    } else {
      setBrix({ ...brix, brix: brix.gravity, sg: toSG(brix.gravity) });
    }
  }, [brix.gravity]);

  return {
    ...brix,
    setGravity: (val: number) => setBrix({ ...brix, gravity: val }),
    setUnits: (val: string) => setBrix({ ...brix, units: val }),
  };
};

export default useBrix;
