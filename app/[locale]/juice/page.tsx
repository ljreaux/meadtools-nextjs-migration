"use client";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import useJuice from "@/hooks/useJuice";

function Juice() {
  const { t } = useTranslation();
  const {
    sugar,
    setSugar,
    sugarUnits,
    setSugarUnits,
    servingSize,
    setServingSize,
    servingSizeUnits,
    setServingSizeUnits,
    servings,
    setServings,
    brix,
    sg,
    totalSugar,
  } = useJuice();
  return (
    <div className="w-full flex justify-center items-center sm:pt-24 pt-[6rem] relative">
      <div className="flex flex-col md:p-12 p-8 rounded-xl bg-background gap-4 w-11/12 max-w-[1000px]">
        <h1 className="text-3xl font-bold mb-4 text-center">
          {" "}
          {t("juiceHeading")}
        </h1>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>{t("sugPerServe")}</TableCell>
              <TableCell>
                <Input
                  className="min-w-16"
                  type="number"
                  onFocus={(e) => e.target.select()}
                  value={sugar}
                  onChange={(e) => setSugar(e.target.value)}
                />
              </TableCell>
              <TableCell>
                <Select value={sugarUnits} onValueChange={setSugarUnits}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="g">{t("G")}</SelectItem>
                    <SelectItem value="mg">{t("MG")}</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{t("servingSize")}</TableCell>
              <TableCell>
                <Input
                  className="min-w-16"
                  type="number"
                  onFocus={(e) => e.target.select()}
                  value={servingSize}
                  onChange={(e) => setServingSize(e.target.value)}
                />
              </TableCell>
              <TableCell>
                <Select
                  value={servingSizeUnits}
                  onValueChange={setServingSizeUnits}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ml">{t("ML")}</SelectItem>
                    <SelectItem value="floz">{t("FLOZ")}</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{t("perContainer")}</TableCell>
              <TableCell colSpan={2}>
                <Input
                  type="number"
                  onFocus={(e) => e.target.select()}
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                colSpan={3}
                className="py-4 sm:text-2xl text-lg text-center"
              >
                <span className="grid sm:grid-cols-2 gap-2">
                  <p>
                    {brix} {t("BRIX")}, {sg.toFixed(3)}
                  </p>
                  <p>
                    {totalSugar}
                    {sugarUnits} {t("juiceUnits")}
                  </p>
                </span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default Juice;
