"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface Recipe {
  id: number;
  user_id: number;
  name: string;
  recipeData: string; // JSON string containing OG, FG, etc.
  yanFromSource: string | null;
  yanContribution: string;
  nutrientData: string;
  advanced: boolean;
  nuteInfo: string | null;
  primaryNotes: string[] | null;
  secondaryNotes: string[] | null;
  private: boolean;
  public_username: string | null;
}

function parseRecipeData(recipeData: string) {
  try {
    const parsedData = JSON.parse(recipeData);
    return {
      OG: parsedData.OG || "N/A",
      FG: parsedData.FG || "N/A",
    };
  } catch (error) {
    console.error("Error parsing recipeData:", error);
    return { OG: "N/A", FG: "N/A" };
  }
}

export default function RecipeList({ recipes }: { recipes: Recipe[] }) {
  const { t } = useTranslation();
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(recipes.length / itemsPerPage);

  const currentRecipes = recipes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <div className="space-y-6">
      <ul className="space-y-4">
        {currentRecipes.map((recipe) => {
          const { OG, FG } = parseRecipeData(recipe.recipeData);
          return (
            <li key={recipe.id}>
              <Link
                href={`/recipes/${recipe.id}`}
                className="block p-4 rounded-lg bg-card transition-colors border border-border shadow-sm hover:bg-muted-foreground group"
              >
                <h2 className="text-xl font-semibold text-card-foreground">
                  {recipe.name}
                </h2>
                {recipe.public_username && (
                  <p className="text-muted-foreground text-sm group-hover:text-foreground">
                    {t("byUser", { public_username: recipe.public_username })}
                  </p>
                )}
                <p className="text-muted-foreground text-sm group-hover:text-foreground">
                  {t("OG")}: {OG}, {t("FG")}: {FG}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="flex justify-between items-center">
        <Button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          variant="secondary"
        >
          {t("buttonLabels.back")}
        </Button>
        <span className="text-sm text-muted-foreground">
          {t("numOfPages", { start_page: currentPage, end_page: totalPages })}
        </span>
        <Button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          variant="secondary"
        >
          {t("buttonLabels.next")}
        </Button>
      </div>
    </div>
  );
}
