import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export default function AbvLine({
  ABV,
  delle,
  textSize,
}: {
  ABV: number;
  delle: number;
  textSize?: string;
}) {
  const { t, i18n } = useTranslation();
  const currentLocale = i18n.resolvedLanguage;
  return (
    <div className="grid grid-cols-2 text-center gap-2">
      <p className={cn(textSize || "text-2xl")}>
        {ABV.toLocaleString(currentLocale, { maximumFractionDigits: 2 })}%{" "}
        {t("ABV")}
      </p>
      <p className={cn(textSize || "text-2xl")}>
        {delle.toLocaleString(currentLocale, { maximumFractionDigits: 0 })}{" "}
        {t("DU")}
      </p>
    </div>
  );
}
