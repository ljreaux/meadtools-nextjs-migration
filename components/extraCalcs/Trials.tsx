"use client";

import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { calculateAdjunctValues } from "../../lib/utils/benchTrials";
import { isValidNumber } from "@/lib/utils/validateInput";

interface TrialsProps {
  batchDetails: BatchDetails;
}

export type BatchDetails = {
  batchSize: string;
  sampleSize: string;
  stockSolutionConcentration: string;
  units: string;
};

export default function Trials({ batchDetails }: TrialsProps) {
  const { i18n } = useTranslation();
  const currentLocale = i18n.resolvedLanguage;

  const [stockVolume, setStockVolume] = useState<string[]>([
    (0.5).toLocaleString(currentLocale),
    (1).toLocaleString(currentLocale),
    (1.5).toLocaleString(currentLocale),
    (2).toLocaleString(currentLocale),
  ]);

  const handleStockVolumeChange = (index: number, value: string) => {
    setStockVolume((prev) => prev.map((vol, i) => (i === index ? value : vol)));
  };

  return (
    <Table className="my-10">
      <TableBody>
        {stockVolume.map((volume, index) => (
          <StockVolumeRow
            key={index}
            index={index}
            volume={volume}
            batchDetails={batchDetails}
            onVolumeChange={handleStockVolumeChange}
          />
        ))}
      </TableBody>
    </Table>
  );
}

interface StockVolumeRowProps {
  index: number;
  volume: string;
  batchDetails: BatchDetails;
  onVolumeChange: (index: number, value: string) => void;
}

function StockVolumeRow({
  index,
  volume,
  batchDetails,
  onVolumeChange,
}: StockVolumeRowProps) {
  const { adjunctAmount, adjunctConcentration, scaledAdjunct, scaledBatch } =
    calculateAdjunctValues(volume, batchDetails);

  const { i18n, t } = useTranslation();
  const currentLocale = i18n.resolvedLanguage;
  return (
    <>
      <TableRow className="border-none">
        <TableCell colSpan={4} className="font-bold text-center">
          <div className="flex flex-col items-center">
            <label htmlFor={`stockVolume-${index}`} className="mb-2">
              {t("solutionVolume")}
            </label>
            <Input
              id={`stockVolume-${index}`}
              inputMode="numeric"
              value={volume}
              onChange={(e) => {
                if (isValidNumber(e.target.value))
                  onVolumeChange(index, e.target.value);
              }}
              onFocus={(e) => e.target.select()}
              className="w-1/2"
            />
          </div>
        </TableCell>
      </TableRow>

      {/* Responsive Layout */}
      <TableRow className="sm:table-row grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <TableCell className="flex flex-col items-center sm:table-cell">
          <div className="grid">
            <label>{t("adjunctAmount")}</label>
            <span>{adjunctAmount.toLocaleString(currentLocale)}</span>
          </div>
        </TableCell>
        <TableCell className="flex flex-col items-center sm:table-cell">
          <div className="grid">
            <label>{t("adjunctConcentration")}</label>
          </div>{" "}
          <span>{adjunctConcentration}</span>
        </TableCell>
        <TableCell className="flex flex-col items-center sm:table-cell">
          <div className="grid">
            <label>{t(`${batchDetails.units}ScaledAdjunct`)}</label>
            <span>{scaledAdjunct.toLocaleString(currentLocale)}</span>
          </div>
        </TableCell>
        <TableCell className="flex flex-col items-center sm:table-cell">
          <div className="grid">
            <label>{t("scaledBatch")}</label>
            <span>{scaledBatch.toLocaleString(currentLocale)}</span>
          </div>{" "}
        </TableCell>
      </TableRow>
    </>
  );
}
