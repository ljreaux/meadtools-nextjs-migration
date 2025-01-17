"use client";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { buttonVariants } from "../ui/button";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@radix-ui/react-alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Trash } from "lucide-react";
import { resetRecipe } from "@/lib/utils/resetRecipe";
import { useTranslation } from "react-i18next";

export default function ResetButton() {
  const { toast } = useToast();
  const { t } = useTranslation();

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <div className="relative group flex flex-col items-center my-2">
            <button className="flex items-center justify-center sm:w-12 sm:h-12 w-8 h-8 bg-destructive text-foreground rounded-full border border-foreground hover:text-destructive hover:bg-foreground transition-colors">
              <Trash />
            </button>
            <span className="absolute top-1/2 -translate-y-1/2 right-16 whitespace-nowrap px-2 py-1 bg-background text-foreground border border-foreground rounded opacity-0 group-hover:opacity-100 transition-opacity">
              {t("recipeBuilder.reset")}
            </span>
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={buttonVariants({ variant: "destructive" })}
              onClick={() => {
                resetRecipe();
                toast({
                  title: "Recipe Reset",
                  description: `Recipe has been reset.`,
                });
                location.reload();
              }}
            >
              Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
