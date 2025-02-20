import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useTranslation } from "react-i18next";
import lodash from "lodash";
type PrimingSugar =
  | {
      amount: number;
      perBottle: {
        label: string;
        amount: number;
      }[];
      label: string;
    }[]
  | undefined;

function PrimingSugarTable({ primingSugar }: { primingSugar: PrimingSugar }) {
  const { t, i18n } = useTranslation();
  const currentLocale = i18n.resolvedLanguage;
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("primingTable.sugarHeading")}</TableHead>
          <TableHead>{t("primingTable.perBatchHeading")}</TableHead>
          <TableHead>
            {t("primingTable.perBottleHeading", {
              bottleSize: "12oz",
            })}
          </TableHead>
          <TableHead>
            {t("primingTable.perBottleHeading", {
              bottleSize: "22oz",
            })}
          </TableHead>
          <TableHead>
            {t("primingTable.perBottleHeading", {
              bottleSize: "330ml",
            })}
          </TableHead>
          <TableHead>
            {t("primingTable.perBottleHeading", {
              bottleSize: "500ml",
            })}
          </TableHead>
          <TableHead>
            {t("primingTable.perBottleHeading", {
              bottleSize: "750ml",
            })}
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {primingSugar?.map((sugar) => (
          <TableRow key={sugar.label}>
            <TableCell className="font-bold">
              {t(lodash.camelCase(sugar.label))}
            </TableCell>
            <TableCell>{`${sugar.amount.toLocaleString(currentLocale, {
              maximumFractionDigits: 3,
            })}g`}</TableCell>
            {sugar.perBottle.map((bottle) => (
              <TableCell key={bottle.label}>
                {`${bottle.amount.toLocaleString(currentLocale, {
                  maximumFractionDigits: 3,
                })}g`}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default PrimingSugarTable;
