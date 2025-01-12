import ProviderWrapper from "@/components/recipeBuilder/ProviderWrapper";
import RecipeBuilder from "@/components/recipeBuilder/RecipeBuilder";
import initTranslations from "@/lib/i18n";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  await initTranslations(locale, ["default", "YeastTable"]);

  return (
    <ProviderWrapper>
      <RecipeBuilder />
    </ProviderWrapper>
  );
}
