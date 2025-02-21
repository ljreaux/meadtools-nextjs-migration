import { notFound } from "next/navigation";
import "@/app/atom-one-dark.css";

export default async function Page({
  params,
}: {
  params: Promise<{ pathName: string[]; locale: string }>;
}) {
  const { pathName, locale } = await params;
  const pathToFile = pathName.join("/");

  try {
    if (locale !== "de") throw new Error("This is a german only page.");
    const { default: Post } = await import(
      `@/germanOnlyPages/${pathToFile}.mdx`
    );

    return (
      <section className="w-full flex justify-center items-center sm:pt-24 pt-[6rem]">
        <div className="flex flex-col md:p-12 p-8 rounded-xl bg-background gap-4 w-11/12 max-w-[1000px] prose dark:prose-invert prose-a:text-blue-500">
          <Post />
        </div>
      </section>
    );
  } catch (err) {
    console.error(err);
    return notFound();
  }
}
