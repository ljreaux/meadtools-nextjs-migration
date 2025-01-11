"use client";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { temperatureCorrection, toFahrenheit } from "@/lib/utils/temperature";
import { FormEvent, useState } from "react";
import { toBrix } from "@/lib/utils/unitConverter";
import { isValidNumber } from "@/lib/utils/validateInput";

function TempCorrection() {
  const { t } = useTranslation();
  const { tempObj, handleChange, setTempUnits, result, resultBrix } =
    useTempCorrection();
  return (
    <>
      <h1 className="sm:text-3xl text-xl text-center text-foreground">
        {t("tempCorrectionHeading")}
      </h1>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>{t("measuredSG")} </TableCell>
            <TableCell>
              <Input
                onFocus={(e) => e.target.select()}
                inputMode="numeric"
                id="measured"
                value={tempObj.measured}
                onChange={handleChange}
              />
            </TableCell>
            <TableCell>
              {toBrix(parseFloat(tempObj.measured)).toFixed(2)} {t("Brix")}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{t("curTemp")} </TableCell>
            <TableCell>
              <Input
                onFocus={(e) => e.target.select()}
                inputMode="numeric"
                id="curTemp"
                value={tempObj.curTemp}
                onChange={handleChange}
              />
            </TableCell>
            <TableCell>
              <Select
                name="deg"
                onValueChange={setTempUnits}
                value={tempObj.tempUnits}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="F">{t("FAR")}</SelectItem>
                  <SelectItem value="C">{t("CEL")}</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{t("calTemp")} </TableCell>
            <TableCell colSpan={2}>
              <Input
                onFocus={(e) => e.target.select()}
                inputMode="numeric"
                id="calTemp"
                value={tempObj.calTemp}
                onChange={handleChange}
              />
            </TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>
              <span className="flex items-center justify-center text-lg">
                {result.toFixed(3)}, {resultBrix.toFixed(2)} {t("Brix")}
              </span>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
}

export default TempCorrection;

const useTempCorrection = () => {
  const [tempObj, setTempObj] = useState({
    measured: "1.1",
    tempUnits: "F",
    curTemp: "90",
    calTemp: "68",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isValidNumber(e.target.value))
      setTempObj((prev) => ({
        ...prev,
        [e.target.id]: e.target.value,
      }));
  };

  const result =
    tempObj.tempUnits === "F"
      ? temperatureCorrection(
          parseFloat(tempObj.measured),
          parseFloat(tempObj.curTemp),
          parseFloat(tempObj.calTemp)
        )
      : temperatureCorrection(
          parseFloat(tempObj.measured),
          toFahrenheit(parseFloat(tempObj.curTemp)),
          toFahrenheit(parseFloat(tempObj.calTemp))
        );
  const resultBrix = toBrix(result);

  const setTempUnits = (str: string) => {
    setTempObj((prev) => ({ ...prev, tempUnits: str }));
  };

  return { tempObj, handleChange, result, resultBrix, setTempUnits };
};
