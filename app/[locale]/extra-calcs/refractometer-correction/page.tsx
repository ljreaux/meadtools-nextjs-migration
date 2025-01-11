"use client";
import AbvLine from "@/components/extraCalcs/AbvLine";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import useAbv from "@/hooks/useAbv";
import useRefrac from "@/hooks/useRefrac";
("react");
import { useTranslation } from "react-i18next";

function RefractometerCorrection() {
  const { t } = useTranslation();
  const { refrac, handleChange, handleUnitChange } = useRefrac();
  const abv = useAbv(refrac.og.toString(), refrac.fg.toString());

  return (
    <>
      <h1 className="sm:text-3xl text-xl text-center text-foreground">
        {t("refractometerHeading")}
      </h1>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="text-foreground">
              {t("correctionFactor")}{" "}
            </TableCell>
            <TableCell colSpan={2}>
              <Input
                inputMode="numeric"
                name="cf"
                id="cf"
                value={refrac.cf}
                onChange={handleChange}
                onFocus={(e) => e.target.select()}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{t("ogLabel")} </TableCell>
            <TableCell className="p-1 md:p-4">
              <Select
                name="units"
                value={refrac.units}
                onValueChange={handleUnitChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SG">{t("SG")}</SelectItem>
                  <SelectItem value="Brix">{t("BRIX")}</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell className="p-1 md:p-4">
              <Input
                inputMode="numeric"
                name="og"
                id="og"
                value={refrac.og}
                onChange={handleChange}
                onFocus={(e) => e.target.select()}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{t("fgInBrix")} </TableCell>
            <TableCell colSpan={2}>
              <span className="flex">
                <Input
                  inputMode="numeric"
                  name="fgInBrix"
                  id="fg"
                  value={refrac.fgInBrix}
                  onChange={handleChange}
                  onFocus={(e) => e.target.select()}
                />
                <span className=" sm:flex grid items-center gap-1 justify-center text-center min-w-fit mx-1">
                  <p>{refrac.calcSg}</p>
                  <p className="min-w-fit">{`${refrac.calcBrix} ${t(
                    "BRIX"
                  )}`}</p>
                </span>
              </span>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={3}>
              <span className="flex items-center justify-center text-center">
                <AbvLine {...abv} textSize="text-lg" />
              </span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
}

export default RefractometerCorrection;
