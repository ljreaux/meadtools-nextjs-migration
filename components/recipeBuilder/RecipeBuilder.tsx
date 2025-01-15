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
import IngredientResults from "./Results";
import Units from "./Units";
import ScaleRecipeForm from "./ScaleRecipeForm";
import Stabilizers from "./Stabilizers";
import Tooltip from "../Tooltips";
import Additives from "./Additives";

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
const Heading = ({
  text,
  toolTipProps,
}: {
  text: string;
  toolTipProps?: { body: string; link: string };
}) => {
  const { t } = useTranslation();
  return (
    <h1 className="text-3xl text-center">
      {t(text)}{" "}
      {toolTipProps && (
        <Tooltip {...toolTipProps} body={t(toolTipProps.body)} />
      )}
    </h1>
  );
};

const cards = [
  <CardWrapper key="card 1">
    <Heading text="recipeBuilder.homeHeading" />
    <Units />
    <Ingredients />
    <IngredientResults />
    <ScaleRecipeForm />
  </CardWrapper>,
  <CardWrapper key="card 2">
    <Heading text="nutesHeading" />
    <VolumeInputs disabled />
    <YeastDetails />
    <AdditionalDetails />
  </CardWrapper>,
  <CardWrapper key="card 3">
    <Heading text="nuteResults.label" />
    <NutrientSelector />
    <Results />
  </CardWrapper>,
  <CardWrapper key="card 4">
    <Heading
      text="stabilizersHeading"
      toolTipProps={{
        body: "tipText.stabilizers",
        link: "https://meadmaking.wiki/en/process/stabilization",
      }}
    />
    <Stabilizers />
  </CardWrapper>,
  <CardWrapper key="card 5">
    <Additives />
  </CardWrapper>,
];
