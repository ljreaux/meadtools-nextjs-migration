"use client";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import usePrimingSugar from "@/hooks/usePrimingSugar";
import { cn } from "@/lib/utils";

import React from "react";
import { useTranslation } from "react-i18next";
import PrimingSugarTable from "@/components/extraCalcs/PrimingSugarTable";

function PrimingSugar() {
  const { t } = useTranslation();
  const {
    tempProps,
    tempUnitProps,
    volsProps,
    volumeProps,
    volumeUnitProps,
    primingSugarAmounts,
    tempInvalid,
    volsInvalid,
  } = usePrimingSugar();

  return (
    <>
      <h1 className="sm:text-3xl text-xl text-center text-foreground">
        {t("primingSugarHeading")}
      </h1>
      <div className="grid sm:grid-cols-2 gap-1">
        <label className={cn("p-2", tempInvalid && "bg-destructive")}>
          {t("enterTemp")}
          <Input
            {...tempProps}
            type="number"
            onFocus={(e) => e.target.select()}
          />
          {tempInvalid && <p>{t("tempInvalid")}</p>}
        </label>
        <label className="p-2">
          {t("tempUnits")}
          <Select {...tempUnitProps}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="C">C</SelectItem>
              <SelectItem value="F">F</SelectItem>
            </SelectContent>
          </Select>
        </label>
        <label
          className={cn("col-span-full p-2", volsInvalid && "bg-destructive")}
        >
          {t("co2Vol")}
          <Input
            {...volsProps}
            type="number"
            onFocus={(e) => e.target.select()}
          />
          {volsInvalid && <p>{t("volInvalid")}</p>}
        </label>
        <label className="p-2">
          {t("brewVolume")}
          <Input
            {...volumeProps}
            type="number"
            onFocus={(e) => e.target.select()}
          />
        </label>
        <label className="p-2">
          {t("volumeUnits")}
          <Select {...volumeUnitProps}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gal">{t("GAL")}</SelectItem>
              <SelectItem value="lit">{t("LIT")}</SelectItem>
            </SelectContent>
          </Select>
        </label>
        <div className="border-b border-muted-foreground col-span-full" />
      </div>
      <PrimingSugarTable primingSugar={primingSugarAmounts}></PrimingSugarTable>
    </>
  );
}

export default PrimingSugar;
