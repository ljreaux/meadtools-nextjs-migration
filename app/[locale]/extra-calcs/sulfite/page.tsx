"use client";
import Tooltip from "@/components/Tooltips";
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
import { isValidNumber } from "@/lib/utils/validateInput";
import { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";

function Sulfite() {
  const { t } = useTranslation();

  const [sulfite, setSulfite] = useState({
    batchSize: "1",
    units: "gallons",
    ppm: "50",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isValidNumber(e.target.value))
      setSulfite((prev) => ({
        ...prev,
        [e.target.id]: e.target.value,
      }));
  };

  const sulfiteAmount =
    sulfite.units === "gallons"
      ? (parseFloat(sulfite.batchSize) * 3.785 * parseFloat(sulfite.ppm)) / 570
      : (parseFloat(sulfite.batchSize) * parseFloat(sulfite.ppm)) / 570;

  const campden =
    sulfite.units !== "gallons"
      ? (parseFloat(sulfite.ppm) / 75) * (parseFloat(sulfite.batchSize) / 3.785)
      : (parseFloat(sulfite.ppm) / 75) * parseFloat(sulfite.batchSize);
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-none">
          <TableCell colSpan={3}>
            <h1 className="sm:text-3xl text-xl text-center text-foreground">
              {t("sulfiteHeading")}
            </h1>
          </TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>{t("batchSize")} </TableCell>
          <TableCell>
            <Input
              inputMode="numeric"
              id="batchSize"
              onFocus={(e) => e.target.select()}
              onChange={handleChange}
              value={sulfite.batchSize}
            />
          </TableCell>
          <TableCell>
            <Select
              name="units"
              onValueChange={(val) => {
                setSulfite((prev) => ({ ...prev, units: val }));
              }}
              value={sulfite.units}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gallons">{t("GAL")}</SelectItem>
                <SelectItem value="liter">{t("LIT")}</SelectItem>
              </SelectContent>
            </Select>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{t("desiredPpm")} </TableCell>
          <TableCell colSpan={2}>
            <Input
              inputMode="numeric"
              name="ppm"
              id="ppm"
              onChange={handleChange}
              value={sulfite.ppm}
            />
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell colSpan={3}>
            <span className="grid items-center justify-center gap-2 sm:text-2xl text-center">
              <p>
                {sulfiteAmount.toFixed(3)}g {t("kMeta")}
              </p>
              <p>{t("accountPage.or")}</p>
              <p className="flex item-center justify-center gap-2">
                {campden.toFixed(1)} {t("list.campden")}
                <Tooltip body={t("tipText.campden")} />
              </p>
            </span>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

export default Sulfite;
