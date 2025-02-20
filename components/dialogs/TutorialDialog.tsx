"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
import { useRouter } from "next/navigation";

function TutorialDialog() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isDialogOpen, setDialogOpen] = useState(false);

  // Check local storage and device type
  useEffect(() => {
    const hasSeenDialog = !!JSON.parse(
      localStorage.getItem("hasSeenTutorialDialog") || "false"
    );
    if (!hasSeenDialog) {
      setDialogOpen(true);
      localStorage.setItem("hasSeenTutorialDialog", "true");
    }
  }, []);

  const handleCancel = () => {
    setDialogOpen(false);
  };

  const handleNavigation = () => {
    setDialogOpen(false);
    router.push("/tutorial");
  };

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <AlertDialogContent className="z-[1010] max-h-screen">
        <AlertDialogHeader>
          <AlertDialogTitle>{t("tutorial.dialog.title")}</AlertDialogTitle>
          <AlertDialogDescription className="flex flex-col gap-2">
            {t("tutorial.dialog.description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>
            {t("donate.dialog.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleNavigation}>
            {t("tutorial.dialog.viewTutorial")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default TutorialDialog;
