"use client";
import useCards from "@/hooks/useCards";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { CardWrapper } from "../CardWrapper";
import Ingredients from "./Ingredients";
import VolumeInputs from "../nutrientCalc/VolumeInputs";
import YeastDetails from "../nutrientCalc/YeastDetails";
import AdditionalDetails from "../nutrientCalc/AdditionalDetails";
import NutrientSelector from "../nutrientCalc/NutrientSelector";
import Results from "../nutrientCalc/Results";

function RecipeBuilder() {
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

export default RecipeBuilder;
const Heading = ({ text }: { text: string }) => {
  const { t } = useTranslation();
  return <h1 className="text-3xl text-center">{t(text)}</h1>;
};

const cards = [
  <CardWrapper>
    <Heading text="recipeBuilder.homeHeading" />
    <Ingredients />
  </CardWrapper>,
  <CardWrapper>
    <Heading text="nutesHeading" />
    <VolumeInputs disabled />
    <YeastDetails />
    <AdditionalDetails />
  </CardWrapper>,
  <CardWrapper>
    <Heading text="nuteResults.label" />
    <NutrientSelector />
    <Results />
  </CardWrapper>,
];
