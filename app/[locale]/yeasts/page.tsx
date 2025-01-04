import YeastTable from "@/components/yeastTable/YeastTable";

async function fetchYeasts() {
  const baseUrl =
    typeof window !== "undefined"
      ? ""
      : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/yeasts`);
  if (!res.ok) {
    throw new Error("Failed to fetch yeasts data");
  }
  return res.json();
}

export default async function YeastsPage() {
  const yeasts = await fetchYeasts();

  return (
    <div className="w-full flex justify-center items-center sm:py-24 py-[6rem] relative">
      <YeastTable data={yeasts} />
    </div>
  );
}
