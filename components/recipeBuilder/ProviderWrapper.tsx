"use client";
import { ReactNode } from "react";
import RecipeProvider from "../providers/RecipeProvider";

function ProviderWrapper({ children }: { children: ReactNode }) {
  return <RecipeProvider>{children}</RecipeProvider>;
}

export default ProviderWrapper;
