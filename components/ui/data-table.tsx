"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectGroup, SelectSeparator } from "@radix-ui/react-select";
import { useTranslation } from "react-i18next";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const { t } = useTranslation("YeastTable");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [tempUnit, setTempUnit] = useState<"C" | "F">("F");

  const [brand, setBrand] = useState<string | undefined>(undefined);
  const [key, setKey] = useState(+new Date());

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    meta: {
      unit: tempUnit,
    },
  });

  useEffect(() => table.getColumn("brand")?.setFilterValue(brand), [brand]);

  return (
    <div className="flex flex-col md:p-12 p-8 rounded-xl bg-background gap-4 w-11/12 max-w-[1000px]">
      <h1 className="text-4xl text-center p-6">{t("title")}</h1>
      <div className="flex flex-col md:flex-row md:justify-between px-4 md:px-2 py-6 gap-4 md:items-end">
        <Input
          placeholder={t("searchPlaceholder")}
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-full"
        />
        <div className="flex flex-col sm:flex-row gap-6 sm:items-end ">
          <div className="flex flex-col gap-2">
            <h2>{t("units.title")}</h2>
            <Select
              value={tempUnit}
              onValueChange={(val: "C" | "F") => setTempUnit(val)}
            >
              <SelectTrigger className="lg:w-[180px] w-full">
                <SelectValue placeholder="°F" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="F">{t("units.fahrenheit")}</SelectItem>
                  <SelectItem value="C">{t("units.celsius")}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Select
            key={key}
            value={brand}
            onValueChange={(val) => setBrand(val)}
          >
            <SelectTrigger className="sm:w-[180px] w-full">
              <SelectValue placeholder={t("brandPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Lalvin">{t("brands.lalvin")}</SelectItem>
                <SelectItem value="Mangrove Jack">
                  {t("brands.mangrove")}
                </SelectItem>
                <SelectItem value="Red Star">{t("brands.redstar")}</SelectItem>
                <SelectItem value="Fermentis">
                  {t("brands.fermentis")}
                </SelectItem>
                <SelectItem value="Other">{t("brands.other")}</SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <Button
                className="w-full px-2"
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setBrand(undefined);
                  setKey(+new Date());
                }}
              >
                {t("brands.clear")}
              </Button>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className="text-foreground font-extrabold"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 py-4 mr-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
