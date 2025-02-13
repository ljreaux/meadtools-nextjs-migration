import { Step } from "react-joyride";

export const cardOneSteps: Step[] = [
  {
    target: "body",
    content: "Welcome to the Recipe Builder! Let us show you around.",
    placement: "center",
    disableBeacon: true,
  },
  {
    target: ".joyride-sidebar",
    content:
      "This sidebar allows you to navigate through the different recipe builder steps with ease.",
    placement: "left",
  },
  {
    target: ".joyride-recipePdf",
    content: "This button will take you to the PDF of your.",
    placement: "left",
  },
  {
    target: ".joyride-saveRecipe",
    content:
      "This button will trigger a popup to save your recipe if you are logged in.",
    placement: "left",
  },
  {
    target: ".joyride-deleteRecipe",
    content: "This button will allow you to reset your recipe and start fresh.",
    placement: "left",
  },

  {
    target: ".joyride-units",
    content:
      "This section allows you to select the measurement units for weight and volume. You can switch between metric and US units in your account settings.",
    placement: "bottom",
  },
  {
    target: ".joyride-initialDetails",
    content:
      "This form is for getting an initial must with your desired Original Gravity and volume. Using this form after you have entered other ingredients WILL CLEAR out all ingredients beyond one honey row and one water row.",
    placement: "bottom",
  },
  {
    target: ".joyride-ingredient-1",
    content:
      "Here is the ingredient row. Search for any ingredient in the MeadTools database. If you don't find the one you need, you can add your own! Just input the name of the ingredient and fill in the brix (percent sugar) and you're good to go!",
    placement: "bottom",
  },
  {
    target: ".joyride-secondary-4",
    content:
      "Flip this switch for any ingredients that have sugar and won't be fermented on. If you're adding fruit to secondary, or backsweetening with honey, this switch is what you want.",
    placement: "right",
  },
  {
    target: ".joyride-fillToNext-4",
    content:
      "Press this button to fill this ingredient to the next gallon or liter.",
    placement: "bottom-end",
  },
  {
    target: ".joyride-recipeBuilderResults",
    content:
      "These are you recipe calculator results. It shows you things like your volume, OG, and ABV. Check the tooltips for more information about individual fields.",
    placement: "top",
  },
  {
    target: ".joyride-scaleRecipe",
    content:
      "The final thing for this page is the scale recipe form. This will scale all your ingredients to whatever batch size you input.",
    placement: "top",
  },
  {
    target: "toNextCard",
    content: "",
  },
];
export const cardTwoSteps: Step[] = [
  {
    target: "body",
    content: "Card 2",
    placement: "center",
    disableBeacon: true,
  },
  {
    target: "toNextCard",
    content: "Card 2",
    placement: "center",
    disableBeacon: true,
  },
];
