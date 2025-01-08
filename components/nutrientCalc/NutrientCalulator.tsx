"use client";
import useCards from "@/hooks/useCards";
import VolumeInputs from "./VolumeInputs";
import YeastDetails from "./YeastDetails";
import NutrientSelector from "./NutrientSelector";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";
import AdditionalDetails from "./AdditionalDetails";
import Results from "./Results";

function NutrientCalculator() {
  const { card, currentStepIndex, back, next } = useCards(cards);
  const { t } = useTranslation();
  return (
    <div className="w-full flex flex-col justify-center items-center py-[6rem] relative">
      {card}
      <div className="flex py-12 gap-4 w-11/12 max-w-[1000px] items-center justify-center">
        <Button
          variant={"secondary"}
          onClick={back}
          className="w-full"
          disabled={currentStepIndex === 0}
        >
          {t("buttonLabels.back")}
        </Button>

        <Button
          className="w-full"
          variant={"secondary"}
          onClick={next}
          disabled={currentStepIndex === cards.length - 1}
        >
          {t("buttonLabels.next")}
        </Button>
      </div>
    </div>
  );
}

export default NutrientCalculator;

const CardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col p-12 py-8 rounded-xl bg-background gap-4 w-11/12 max-w-[1000px]">
      {children}
    </div>
  );
};

const Heading = ({ text }: { text: string }) => {
  const { t } = useTranslation();
  return <h1 className="text-3xl text-center">{t(text)}</h1>;
};

const cards = [
  <CardWrapper>
    <Heading text="nutesHeading" />
    <VolumeInputs />
    <YeastDetails />
    <AdditionalDetails />
  </CardWrapper>,
  <CardWrapper>
    <Heading text="nuteResults.label" />
    <NutrientSelector />
    <Results />
  </CardWrapper>,
];
