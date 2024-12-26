import initTranslations from "@/lib/i18n";

export default async function Home({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const { t } = await initTranslations(locale, ["default"]);

  return <main></main>;
}
