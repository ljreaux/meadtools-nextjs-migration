import ApiNav from "@/components/docs/ApiNav";
import EndpointCard from "@/components/docs/EndpointCard";
import { ThemeProvider } from "@/components/providers/theme-provider";
import TranslationsProvider from "@/components/providers/TranslationsProvider";
import initTranslations from "@/lib/i18n";
import fs from "fs";
import path from "path";

export default async function APIDocs({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const i18nNamespaces = ["default", "YeastTable"];
  const { resources } = await initTranslations(locale, i18nNamespaces);

  const filePath = path.join(process.cwd(), "public", "doc-info.json");
  const docData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  // Generate sidebar categories using API paths and methods
  const categories: Record<string, { path: string; method: string }[]> =
    Object.fromEntries(
      Object.entries(docData.endpoints).map(([category, endpoints]) => [
        category,
        (endpoints as any[]).map((endpoint: any) => ({
          path: endpoint.path,
          method: endpoint.method,
        })),
      ])
    );

  return (
    <TranslationsProvider
      namespaces={i18nNamespaces}
      locale={locale}
      resources={resources}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div className="flex">
          {/* Sidebar */}
          <ApiNav categories={categories} />

          {/* Main Content */}
          <main className="flex-1 sm:ml-64 p-10 bg-background max-w-screen-lg mx-auto overflow-x-hidden">
            <section id="overview">
              <h1 className="text-3xl font-bold text-foreground">
                {docData.name}
              </h1>
              <p className="text-muted-foreground mt-2">
                {docData.description}
              </p>
            </section>

            {/* API Categories & Endpoints */}
            {Object.entries(docData.endpoints).map(
              ([category, endpoints]: [string, any]) => (
                <section
                  key={category}
                  id={category.toLowerCase().replace(/\s+/g, "-")}
                  className="mt-10"
                >
                  <h2 className="text-2xl font-semibold text-foreground">
                    {category}
                  </h2>
                  <div className="space-y-6 mt-4">
                    {endpoints.map((endpoint: any) => {
                      const formattedId = `${
                        endpoint.method
                      }-${endpoint.path.replace(/\//g, "-")}`;
                      return (
                        <div key={formattedId} id={formattedId}>
                          <EndpointCard endpoint={endpoint} />
                        </div>
                      );
                    })}
                  </div>
                </section>
              )
            )}

            {/* Errors Section */}
            <section id="errors" className="mt-8">
              <h2 className="text-2xl font-semibold text-foreground">
                Errors & Status Codes
              </h2>
              <ul className="list-disc ml-6 mt-2 text-muted-foreground">
                {Object.entries(docData.errors).map(
                  ([code, message]: [string, any]) => (
                    <li key={code}>
                      <strong>{code}</strong> - {message}
                    </li>
                  )
                )}
              </ul>
            </section>
          </main>
        </div>
      </ThemeProvider>
    </TranslationsProvider>
  );
}
