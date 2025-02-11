import { Step } from "react-joyride-react-19";

export const tutorialSteps: Step[] = [
  {
    target: "body", // Target the entire page
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
    target: ".joyride-units",
    content:
      "This section allows you to select the measurement units for weight and volume. You can switch between default measurement types in your account settings.",
    placement: "bottom",
  },
];
