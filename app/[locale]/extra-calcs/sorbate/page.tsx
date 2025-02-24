"use client";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { isValidNumber, parseNumber } from "@/lib/utils/validateInput";
import { useState } from "react";
import { useTranslation } from "react-i18next";

function Sorbate() {
  const { t, i18n } = useTranslation();
  const currentLocale = i18n.resolvedLanguage;
  const [sorbate, setSorbate] = useState({
    batchSize: (1).toLocaleString(currentLocale),
    units: "gallons",
    abv: (12).toLocaleString(currentLocale),
  });

  const sorbateAmount =
    sorbate.units === "gallons"
      ? ((-parseNumber(sorbate.abv) * 25 + 400) / 0.75) *
        parseNumber(sorbate.batchSize) *
        0.003785411784
      : (((-parseNumber(sorbate.abv) * 25 + 400) / 0.75) *
          parseNumber(sorbate.batchSize)) /
        1000;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isValidNumber(e.target.value))
      setSorbate((prev) => ({
        ...prev,
        [e.target.id]: e.target.value,
      }));
  };
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-none">
          <TableCell colSpan={3}>
            <h1 className="sm:text-3xl text-xl text-center text-foreground">
              {t("sorbateHeading")}
            </h1>
          </TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>{t("batchSize")} </TableCell>
          <TableCell>
            <Input
              inputMode="decimal"
              id="batchSize"
              onFocus={(e) => e.target.select()}
              onChange={handleChange}
              value={sorbate.batchSize}
            />
          </TableCell>
          <TableCell>
            <Select
              name="units"
              value={sorbate.units}
              onValueChange={(val) => {
                setSorbate((prev) => ({ ...prev, units: val }));
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gallons">{t("GAL")}</SelectItem>
                <SelectItem value="liters">{t("LIT")}</SelectItem>
              </SelectContent>
            </Select>
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>{t("ABV")}: </TableCell>
          <TableCell colSpan={2}>
            <Input
              id="abv"
              inputMode="decimal"
              onFocus={(e) => e.target.select()}
              onChange={handleChange}
              value={sorbate.abv}
            />
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell className="my-4 text-lg text-center" colSpan={3}>
            {sorbateAmount.toLocaleString(currentLocale, {
              maximumFractionDigits: 3,
            })}
            g {t("kSorb")}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

export default Sorbate;
