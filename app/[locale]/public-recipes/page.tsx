import React from "react";
import RecipeList from "./RecipeList";
import initTranslations from "@/lib/i18n";

async function fetchRecipes() {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
  const endpoint = `${baseUrl}/api/recipes`;

  const res = await fetch(endpoint, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch recipes");
  }
  const data = await res.json();
  return data.recipes;
}

export default async function PublicRecipes({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const i18nNamespaces = ["default", "YeastTable"];
  const { t } = await initTranslations(locale, i18nNamespaces);
  let recipes = [];

  try {
    recipes = await fetchRecipes();
  } catch (error) {
    console.error("Error loading recipes:", error);
    return (
      <div className="flex flex-col p-12 py-8 rounded-xl bg-background gap-4 w-11/12 max-w-[1000px]">
        <p className="text-destructive-foreground">{t("publicRecipes.fail")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-12 py-8 rounded-xl bg-background gap-4 w-11/12 max-w-[1000px]">
      <h1 className="text-2xl font-bold text-foreground mb-4">
        {t("publicRecipes.title")}
      </h1>
      <RecipeList recipes={recipes} />
    </div>
  );
}
