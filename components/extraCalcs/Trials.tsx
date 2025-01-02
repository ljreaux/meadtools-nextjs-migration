"use client";

import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { calculateAdjunctValues } from "../../lib/utils/benchTrials";

interface TrialsProps {
  batchDetails: BatchDetails;
}

export type BatchDetails = {
  batchSize: number;
  sampleSize: number;
  stockSolutionConcentration: number;
  units: string;
};

export default function Trials({ batchDetails }: TrialsProps) {
  const { t } = useTranslation();

  const [stockVolume, setStockVolume] = useState<number[]>([0.5, 1, 1.5, 2]);

  const handleStockVolumeChange = (index: number, value: number) => {
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
  volume: number;
  batchDetails: BatchDetails;
  onVolumeChange: (index: number, value: number) => void;
}

function StockVolumeRow({
  index,
  volume,
  batchDetails,
  onVolumeChange,
}: StockVolumeRowProps) {
  const { adjunctAmount, adjunctConcentration, scaledAdjunct, scaledBatch } =
    calculateAdjunctValues(volume, batchDetails);

  const { t } = useTranslation();
  return (
    <>
      {/* Full-width row for Solution Volume */}
      <TableRow className="border-none">
        <TableCell colSpan={4} className="font-bold text-center">
          <div className="flex flex-col items-center">
            <label htmlFor={`stockVolume-${index}`} className="mb-2">
              {t("solutionVolume")}
            </label>
            <Input
              id={`stockVolume-${index}`}
              type="number"
              value={volume}
              onChange={(e) => onVolumeChange(index, Number(e.target.value))}
              onFocus={(e) => e.target.select()}
              step={0.01}
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
            <span>{adjunctAmount}</span>
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
            <span>{scaledAdjunct}</span>
          </div>
        </TableCell>
        <TableCell className="flex flex-col items-center sm:table-cell">
          <div className="grid">
            <label>{t("scaledBatch")}</label>
            <span>{scaledBatch}</span>
          </div>{" "}
        </TableCell>
      </TableRow>
    </>
  );
}
