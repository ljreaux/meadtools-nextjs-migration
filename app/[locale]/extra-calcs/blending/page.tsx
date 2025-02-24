"use client";
import { blendingArr, blendValues } from "@/lib/utils/blendValues";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableRow,
} from "@/components/ui/table";
import { isValidNumber } from "@/lib/utils/validateInput";

function Blending() {
  const { t, i18n } = useTranslation();
  const currentLocale = i18n.resolvedLanguage;
  const [input, setInput] = useState<blendingArr>([
    ["0", "0"],
    ["0", "0"],
  ]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>,
    row: number,
    col: number
  ) {
    if (isValidNumber(e.target.value))
      setInput((prev) =>
        prev.map((arr, i) =>
          i === row
            ? ([
                ...arr.slice(0, col),
                e.target.value,
                ...arr.slice(col + 1),
              ] as [string, string])
            : arr
        )
      );
  }

  const { blendedValue, totalVolume } = blendValues(input);

  return (
    <>
      <h1 className="sm:text-3xl text-xl text-center text-foreground">
        {t("blendingHeading")}
      </h1>
      <Table>
        <TableBody>
          {input.map(([val, vol], rowIndex) => (
            <TableRow key={rowIndex} className="">
              <TableCell className="sm:p-4 ">
                <span className="grid gap-2">
                  {t(`val${rowIndex + 1}`)}

                  <Input
                    inputMode="decimal"
                    value={val}
                    onChange={(e) => handleChange(e, rowIndex, 0)}
                    onFocus={(e) => e.target.select()}
                  />
                </span>
              </TableCell>
              <TableCell className="sm:p-4">
                <span className="grid gap-2">
                  {t(`vol${rowIndex + 1}`)}

                  <Input
                    inputMode="decimal"
                    value={vol}
                    onChange={(e) => handleChange(e, rowIndex, 1)}
                    onFocus={(e) => e.target.select()}
                  />
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell className="sm:p-4">
              <span className="grid gap-1 sm:text-lg">
                <p>{t("blendedVal")}</p>
                <p>
                  {blendedValue.toLocaleString(currentLocale, {
                    maximumFractionDigits: 3,
                  })}
                </p>
              </span>
            </TableCell>
            <TableCell className="sm:p-4">
              <span className="grid gap-1 sm:text-lg">
                <p>{t("totalVol")}</p>
                <p> {totalVolume.toLocaleString(currentLocale)}</p>
              </span>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
}

export default Blending;
