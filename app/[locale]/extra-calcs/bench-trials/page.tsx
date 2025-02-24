"use client";
import Tooltip from "@/components/Tooltips";
import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { ChangeEvent, useState } from "react";
import Trials from "../../../../components/extraCalcs/Trials";
import { isValidNumber } from "@/lib/utils/validateInput";

function BenchTrials() {
  const { t } = useTranslation();
  const { batchDetails, changeUnits, setInput } = useBenchTrials();
  const benchTrialLinks = [
    [
      "https://www.youtube.com/watch?v=AaibXsslBlE&ab_channel=Doin%27theMostBrewing",
      t("tipText.benchTrials.linkTexts.0"),
    ],
    [
      "https://scottlab.com/bench-trial-protocol",
      t("tipText.benchTrials.linkTexts.1"),
    ],
    [
      "https://www.reddit.com/r/mead/wiki/process/bench_trials/",
      t("tipText.benchTrials.linkTexts.2"),
    ],
  ];

  return (
    <>
      <span className="flex items-center justify-center gap-2">
        <h1 className="sm:text-3xl text-xl text-center text-foreground">
          {t("benchTrialsHeading")}
        </h1>
        <Tooltip body={t("tipText.benchTrials.body")} links={benchTrialLinks} />
      </span>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>{t("batchSize")}</TableCell>
            <TableCell>
              <Input
                id="batchSize"
                inputMode="decimal"
                value={batchDetails.batchSize}
                onFocus={(e) => e.target.select()}
                onChange={setInput}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{t("UNITS")}:</TableCell>
            <TableCell>
              <Select
                name="trialBatchUnits"
                value={batchDetails.units}
                onValueChange={changeUnits}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gallon">{t("GAL")}</SelectItem>
                  <SelectItem value="liter">{t("LIT")}</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{t("sampleSize")}</TableCell>
            <TableCell>
              <Input
                id="sampleSize"
                inputMode="decimal"
                value={batchDetails.sampleSize}
                onFocus={(e) => e.target.select()}
                onChange={setInput}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{t("stockSolutionConcentration")}</TableCell>
            <TableCell>
              <Input
                id="stockSolutionConcentration"
                inputMode="decimal"
                value={batchDetails.stockSolutionConcentration}
                onFocus={(e) => e.target.select()}
                onChange={setInput}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Trials batchDetails={batchDetails} />
    </>
  );
}

export default BenchTrials;

const useBenchTrials = () => {
  const [batchDetails, setBatchDetails] = useState({
    batchSize: "1",
    sampleSize: "50",
    stockSolutionConcentration: "10",
    units: "gallon",
  });

  const changeUnits = (unit: string) => {
    setBatchDetails((prev) => ({ ...prev, units: unit }));
  };

  const setInput = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (isValidNumber(e.target.value)) {
      const key = e.target.id;
      setBatchDetails((prev) => ({ ...prev, [key]: val }));
    }
  };

  return { batchDetails, changeUnits, setInput };
};
