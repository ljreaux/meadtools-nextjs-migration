"use client";
import { useAuth } from "@/components/providers/AuthProvider";
import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import Loading from "@/components/loading";
import { Settings, LogOut } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ModeToggle } from "@/components/ui/mode-toggle";
import LanguageSwitcher from "@/components/ui/language-switcher";
import { LoadingButton } from "@/components/ui/LoadingButton";

type Recipe = {
  id: number;
  user_id: number;
  name: string;
  recipeData: string;
  yanFromSource: string | null;
  yanContribution: string;
  nutrientData: string;
  nuteInfo: string | null;
  primaryNotes: [string, string][];
  secondaryNotes: [string, string][];
};

type UserData = {
  user: {
    id: number;
    google_id: string | null;
    hydro_token: string | null;
    public_username: string | null;
    email: string;
  };
  recipes: Recipe[];
};

function Account() {
  const { t } = useTranslation();
  const { fetchAuthenticatedData, logout, deleteRecipe } = useAuth();
  const [data, setData] = useState<UserData | null>(null);
  const [isUsernameDialogOpen, setUsernameDialogOpen] = useState(false);

  const deleteIndividualRecipe = async (id: number) => {
    try {
      await deleteRecipe(id.toString());
      setData((prev) =>
        prev
          ? {
              ...prev,
              recipes: prev.recipes.filter((r) => r.id !== id),
            }
          : null
      );
    } catch (err) {
      console.error("Error deleting recipe:", err);
    }
  };

  useEffect(() => {
    fetchAuthenticatedData("/api/auth/account-info")
      .then((data) => {
        setData(data);
        setUsernameDialogOpen(data.user.public_username === null);
      })
      .catch((error) => console.error(error));
  }, []);

  if (!data) return <Loading />;

  const { user, recipes } = data;

  return (
    <div className="p-12 py-8 rounded-xl bg-background w-11/12 max-w-[1000px] relative">
      <div className="absolute right-4 top-4 flex flex-col sm:flex-row">
        <SettingsDialog username={user.public_username} />
        <Button onClick={logout} variant={"ghost"}>
          <p className="sr-only">Log Out</p>
          <LogOut />
        </Button>
      </div>
      <h1 className="text-3xl text-center">{t("accountPage.title")}</h1>
      <CreateUsernamePopup
        isDialogOpen={isUsernameDialogOpen}
        closeDialog={() => setUsernameDialogOpen(false)}
      />
      <p>
        {t("greeting")} {user.public_username || user.email}!
      </p>
      <div className="my-6">
        <h2 className="text-2xl">{t("accountPage.myRecipes")}</h2>
        <div className="flex flex-wrap gap-4 justify-center py-6">
          {recipes.length > 0 ? (
            recipes.map((rec) => (
              <RecipeCard
                recipe={rec}
                key={rec.id}
                deleteRecipe={() => deleteIndividualRecipe(rec.id)}
              />
            ))
          ) : (
            <p className="mr-auto">
              You currently do not have any saved recipes.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Account;

const RecipeCard = ({
  recipe,
  deleteRecipe,
}: {
  recipe: Recipe;
  deleteRecipe: () => Promise<void>;
}) => {
  const { t } = useTranslation();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    setIsDeleting(true); // Set loading state to true
    try {
      await deleteRecipe();
    } catch (err) {
      console.error("Error deleting recipe:", err);
    } finally {
      setIsDeleting(false); // Reset loading state
    }
  };

  return (
    <div className="grid text-center gap-1 p-4 rounded-xl border-secondary border">
      <h2 className="text-2xl">{recipe.name}</h2>
      <span className="w-full flex gap-1">
        <Link
          className={buttonVariants({ variant: "secondary" })}
          href={`recipes/${recipe.id}`}
        >
          {t("accountPage.viewRecipe")}
        </Link>
        <Link
          className={buttonVariants({ variant: "secondary" })}
          href={`recipes/${recipe.id}?pdf=true`}
        >
          {t("PDF.title")}
        </Link>
      </span>
      <LoadingButton
        variant="destructive"
        loading={isDeleting}
        onClick={handleDelete}
      >
        {t("accountPage.deleteRecipe")}
      </LoadingButton>
    </div>
  );
};

const CreateUsernamePopup = ({
  isDialogOpen,
  closeDialog,
}: {
  isDialogOpen: boolean;
  closeDialog: () => void;
}) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const { updatePublicUsername } = useAuth();
  return (
    <AlertDialog open={isDialogOpen} onOpenChange={closeDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("publicUsername.title")}</AlertDialogTitle>
          <AlertDialogDescription className="flex flex-col gap-2">
            {t("publicUsername.description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div>
          <Input
            type="text"
            placeholder={t("publicUsername.placeholder")}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={closeDialog}>
            {t("cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              updatePublicUsername(username);
              closeDialog();
            }}
          >
            {t("SUBMIT")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const SettingsDialog = ({
  username: public_username,
}: {
  username: string | null;
}) => {
  const [username, setUsername] = useState(public_username || "");
  const { updatePublicUsername } = useAuth();
  const [preferredUnits, setPreferredUnits] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    const units = localStorage.getItem("units");
    if (units) {
      setPreferredUnits(units);
    }
  }, []);

  useEffect(() => {
    if (preferredUnits) localStorage.setItem("units", preferredUnits);
  }, [preferredUnits]);

  const { t } = useTranslation();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Settings />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Account Settings</DialogTitle>
        </DialogHeader>
        <div className="w-full grid gap-4">
          <label className="w-full flex gap-4 items-center p-1">
            {t("accountPage.theme.title")}
            <ModeToggle />
          </label>
          <label className="w-full p-1">
            {t("accountPage.language.title")}
            <LanguageSwitcher />
          </label>
          <label className="w-full p-1">
            {t("accountPage.units.title")}
            <Select
              value={preferredUnits}
              onValueChange={(val) => setPreferredUnits(val)}
            >
              <SelectTrigger className="full">
                <SelectValue placeholder="Select a Default Unit Standard" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="US">{t("accountPage.units.us")}</SelectItem>
                <SelectItem value="METRIC">
                  {t("accountPage.units.metric")}
                </SelectItem>
              </SelectContent>
            </Select>
          </label>
          <div className="grid gap-2 border border-secondary p-3 rounded-md">
            <label>
              Update public username
              <Input
                type="text"
                placeholder="Enter a public username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>
            <Button
              variant="secondary"
              onClick={() => updatePublicUsername(username)}
            >
              {t("SUBMIT")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
