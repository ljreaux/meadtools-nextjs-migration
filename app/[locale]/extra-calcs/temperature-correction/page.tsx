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
import { useState } from "react";
import { toBrix } from "@/lib/utils/unitConverter";
import { isValidNumber, parseNumber } from "@/lib/utils/validateInput";

function TempCorrection() {
  const { t, i18n } = useTranslation();
  const currentLocale = i18n.resolvedLanguage;
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
                inputMode="decimal"
                id="measured"
                value={tempObj.measured}
                onChange={handleChange}
              />
            </TableCell>
            <TableCell>
              {toBrix(parseNumber(tempObj.measured)).toLocaleString(
                currentLocale,
                { maximumFractionDigits: 2 }
              )}{" "}
              {t("Brix")}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{t("curTemp")} </TableCell>
            <TableCell>
              <Input
                onFocus={(e) => e.target.select()}
                inputMode="decimal"
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
                inputMode="decimal"
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
                {result.toLocaleString(currentLocale, {
                  maximumFractionDigits: 3,
                })}{" "}
                {resultBrix.toLocaleString(currentLocale, {
                  maximumFractionDigits: 2,
                })}{" "}
                {t("Brix")}
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
          parseNumber(tempObj.measured),
          parseNumber(tempObj.curTemp),
          parseNumber(tempObj.calTemp)
        )
      : temperatureCorrection(
          parseNumber(tempObj.measured),
          toFahrenheit(parseNumber(tempObj.curTemp)),
          toFahrenheit(parseNumber(tempObj.calTemp))
        );
  const resultBrix = toBrix(result);

  const setTempUnits = (str: string) => {
    setTempObj((prev) => ({ ...prev, tempUnits: str }));
  };

  return { tempObj, handleChange, result, resultBrix, setTempUnits };
};
