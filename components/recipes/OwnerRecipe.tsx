"use client";

import useCards from "@/hooks/useCards";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { CardWrapper } from "../CardWrapper";

import VolumeInputs from "../nutrientCalc/VolumeInputs";
import YeastDetails from "../nutrientCalc/YeastDetails";
import AdditionalDetails from "../nutrientCalc/AdditionalDetails";
import NutrientSelector from "../nutrientCalc/NutrientSelector";
import Results from "../nutrientCalc/Results";
import RecipeCalculatorSideBar from "../recipeBuilder/Sidebar";
import Units from "../recipeBuilder/Units";
import Ingredients from "../recipeBuilder/Ingredients";
import ScaleRecipeForm from "../recipeBuilder/ScaleRecipeForm";
import Stabilizers from "../recipeBuilder/Stabilizers";
import Additives from "../recipeBuilder/Additives";
import Notes from "../recipeBuilder/Notes";
import PDF from "../recipeBuilder/PDF";
import IngredientResults from "../recipeBuilder/Results";
import Tooltip from "../Tooltips";
import { useRecipe } from "../providers/SavedRecipeProvider";
import { useNutrients } from "../providers/SavedNutrientProvider";
import SaveChanges from "./SaveChanges";
import SaveNew from "./SaveNew";
import DeleteRecipe from "./DeleteRecipe";
import { useEffect } from "react";

const cardConfig = [
  {
    key: "card 1",
    heading: "recipeBuilder.homeHeading",
    components: [
      <Units key="units" useRecipe={useRecipe} />,
      <Ingredients key="ingredients" useRecipe={useRecipe} />,
      <IngredientResults key="ingredientResults" useRecipe={useRecipe} />,
      <ScaleRecipeForm key="scaleRecipeForm" useRecipe={useRecipe} />,
    ],
  },
  {
    key: "card 2",
    heading: "nutesHeading",
    components: [
      <VolumeInputs key="volumeInputs" disabled useNutrients={useNutrients} />,
      <YeastDetails key="yeastDetails" useNutrients={useNutrients} />,
      <AdditionalDetails key="additionalDetails" useNutrients={useNutrients} />,
    ],
  },
  {
    key: "card 3",
    heading: "nuteResults.label",
    components: [
      <NutrientSelector key="nutrientSelector" useNutrients={useNutrients} />,
      <Results key="results" useNutrients={useNutrients} />,
    ],
  },
  {
    key: "card 4",
    heading: "stabilizersHeading",
    tooltip: {
      body: "tipText.stabilizers",
      link: "https://meadmaking.wiki/en/process/stabilization",
    },
    components: [<Stabilizers key="stabilizers" useRecipe={useRecipe} />],
  },
  {
    key: "card 5",
    heading: "additivesHeading",
    components: [<Additives key="additives" useRecipe={useRecipe} />],
  },
  {
    key: "card 6",
    heading: "notes.title",
    components: [<Notes key="notes" useRecipe={useRecipe} />],
  },
  {
    key: "card 7",
    heading: "PDF.title",
    components: [
      <PDF key="pdf" useRecipe={useRecipe} useNutrients={useNutrients} />,
    ],
  },
];

function OwnerRecipe({ pdfRedirect }: { pdfRedirect: boolean }) {
  const recipe = useRecipe();
  const cards = cardConfig.map(({ key, heading, components, tooltip }) => (
    <CardWrapper key={key}>
      <Heading text={heading} toolTipProps={tooltip} />
      <p className="text-xl text-center">{recipe.recipeNameProps.value}</p>
      {components}
    </CardWrapper>
  ));

  const { card, currentStepIndex, back, next, goTo } = useCards(cards);
  const { t } = useTranslation();

  useEffect(() => {
    if (pdfRedirect) {
      goTo(cards.length - 1);
    }
  }, [pdfRedirect]);

  return (
    <div className="w-full flex flex-col justify-center items-center py-[6rem] relative">
      <RecipeCalculatorSideBar goTo={goTo} cardNumber={currentStepIndex + 1}>
        <div className="py-2">
          <SaveChanges />
          <SaveNew />
          <DeleteRecipe />
        </div>
      </RecipeCalculatorSideBar>
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

export default OwnerRecipe;

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
