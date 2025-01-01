"use client";
import { blendingArr, blendValues } from "@/lib/utils/blendValues";
import { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableRow,
} from "@/components/ui/table";

function Blending() {
  const { t } = useTranslation();
  const [input, setInput] = useState<blendingArr>([
    [0, 0],
    [0, 0],
  ]);

  function handleChange(e: FormEvent<EventTarget>, row: number, col: number) {
    const target = e.target as HTMLInputElement;
    setInput((prev) =>
      prev.map((arr, i) =>
        i === row
          ? ([
              ...arr.slice(0, col),
              Number(target.value),
              ...arr.slice(col + 1),
            ] as [number, number])
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
                    type="number"
                    value={val}
                    onChange={(e) => handleChange(e, rowIndex, 0)}
                    onFocus={(e) => e.target.select()}
                    step={0.001}
                  />
                </span>
              </TableCell>
              <TableCell className="sm:p-4">
                <span className="grid gap-2">
                  {t(`vol${rowIndex + 1}`)}

                  <Input
                    type="number"
                    value={vol}
                    onChange={(e) => handleChange(e, rowIndex, 1)}
                    onFocus={(e) => e.target.select()}
                    step={0.001}
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
                <p>{t("totalVol")}</p>
                <p> {totalVolume}</p>
              </span>
            </TableCell>
            <TableCell className="sm:p-4">
              <span className="grid gap-1 sm:text-lg">
                <p>{t("blendedVal")}</p>
                <p>{blendedValue.toFixed(3)}</p>
              </span>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
}

export default Blending;
