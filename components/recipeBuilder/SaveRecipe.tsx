"use client";
import React, { useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { useRouter } from "next/navigation";
import { useRecipe } from "../providers/RecipeProvider";
import { useNutrients } from "../providers/NutrientProvider";
import { resetRecipe } from "@/lib/utils/resetRecipe";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "../ui/button";
import { Save } from "lucide-react";

function SaveRecipe() {
  const { t } = useTranslation();
  const router = useRouter();

  const {
    ingredients,
    OG,
    volume,
    ABV,
    FG,
    offset,
    units,
    additives,
    sorbate,
    sulfite,
    campden,
    notes,
    recipeNameProps,
  } = useRecipe();

  const { fullData, yanContributions } = useNutrients();

  const { isLoggedIn, fetchAuthenticatedPost } = useAuth();

  const [checked, setChecked] = useState(false);
  const { toast } = useToast();

  const createRecipe = async () => {
    const recipeData = JSON.stringify({
      ingredients,
      OG,
      volume,
      ABV,
      FG,
      offset,
      units,
      additives,
      sorbate,
      sulfite,
      campden,
    });
    const nutrientData = JSON.stringify(fullData);
    const yanContribution = JSON.stringify(yanContributions);

    const primaryNotes = notes.primary.flat();
    const secondaryNotes = notes.secondary.flat();
    const advanced = false;

    const body = {
      name: recipeNameProps.value,
      recipeData,
      yanFromSource: null,
      yanContribution,
      nutrientData,
      advanced,
      nuteInfo: null,
      primaryNotes,
      secondaryNotes,
      privateRecipe: checked,
    };

    try {
      const response = await fetchAuthenticatedPost("/api/recipes", body);
      console.log("Recipe created successfully:", response.recipe);
      resetRecipe();
      toast({
        description: "Recipe created successfully.",
      });
      router.push("/account");
    } catch (error: any) {
      console.error("Error creating recipe:", error.message);
      toast({
        title: "Error",
        description: "There was an error creating your recipe",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="relative group flex flex-col items-center">
          <button className="flex items-center justify-center sm:w-12 sm:h-12 w-8 h-8 bg-background text-foreground rounded-full border border-foreground hover:text-background hover:bg-foreground transition-colors">
            <Save />
          </button>
          <span className="absolute top-1/2 -translate-y-1/2 right-16 whitespace-nowrap px-2 py-1 bg-background text-foreground border border-foreground rounded opacity-0 group-hover:opacity-100 transition-opacity">
            {t("recipeForm.submit")}
          </span>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("recipeForm.title")}</DialogTitle>
          {isLoggedIn ? (
            <div className="space-y-4">
              <label>
                {t("recipeForm.subtitle")}
                <Input {...recipeNameProps} />
              </label>
              <label className="grid">
                {t("private")}
                <Switch checked={checked} onCheckedChange={setChecked} />
              </label>
            </div>
          ) : (
            <Link
              href={"/login"}
              className="flex items-center justify-center gap-4 px-8 py-2 my-4 text-lg border border-solid rounded-lg bg-background text-foreground hover:bg-foreground hover:border-background hover:text-background sm:gap-8 group"
            >
              {t("recipeForm.login")}
            </Link>
          )}
        </DialogHeader>
        {isLoggedIn && (
          <DialogFooter>
            <Button onClick={createRecipe}>{t("SUBMIT")}</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default SaveRecipe;
