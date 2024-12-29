"use client";
import AbvLine from "@/components/AbvLine";
import Tooltip from "@/components/Tooltips";
import { Input } from "@/components/ui/input";
import useAbv from "@/hooks/useAbv";
import { toBrix } from "@/lib/utils/unitConverter";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

function EstimatedOG() {
  const { t } = useTranslation();
  const [gravity, setGravity] = useState({
    fgh: 1.0,
    fgr: 5,
  });
  const estOG =
    Math.round((-1.728 * gravity.fgh + 0.01085 * gravity.fgr + 2.728) * 1000) /
    1000;

  const abv = useAbv(estOG, gravity.fgh);

  return (
    <>
      <h1 className="sm:text-3xl text-xl text-center flex items-center justify-center gap-2">
        {t("ogHeading")}{" "}
        <Tooltip
          body={t("tipText.estOG")}
          link="http://www.woodlandbrew.com/2013/02/abv-without-og.html"
        />
      </h1>
      <label htmlFor="hydrometerFG">{t("hydrometerFG")} </label>
      <Input
        value={gravity.fgh}
        onChange={(e) =>
          setGravity((prev) => ({ ...prev, fgh: Number(e.target.value) }))
        }
        type="number"
        id="hydrometerFG"
        onFocus={(e) => e.target.select()}
      />
      <label htmlFor="refractometerFG">{t("refractometerFG")} </label>
      <Input
        value={gravity.fgr}
        onChange={(e) =>
          setGravity((prev) => ({ ...prev, fgr: Number(e.target.value) }))
        }
        type="number"
        id="refractometerFG"
        onFocus={(e) => e.target.select()}
      />{" "}
      <span className="grid grid-cols-2 text-center gap-2 text-lg">
        <h2 className="sm:text-2xl text-xl text-center">{t("estimatedOG")} </h2>
        <span className="flex gap-2 text-center justify-center items-center">
          <p>{estOG},</p>
          <p>
            {Math.round(toBrix(estOG) * 100) / 100} {t("BRIX")}
          </p>
        </span>
      </span>
      <AbvLine {...abv} textSize="text-lg" />
    </>
  );
}

export default EstimatedOG;
