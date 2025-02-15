import { NextRequest, NextResponse } from "next/server";
import {
  getAllYeasts,
  getYeastByBrand,
  getYeastByName,
  getYeastById,
  createYeast,
} from "@/lib/db/yeasts";
import { verifyAdmin } from "@/lib/userAccessFunctions";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  // Extract query parameters
  const brand = searchParams.get("brand");
  const name = searchParams.get("name");
  const id = searchParams.get("id");

  try {
    if (brand) {
      const yeasts = await getYeastByBrand(brand);
      return NextResponse.json(yeasts);
    }

    if (name) {
      const yeast = await getYeastByName(name);
      if (!yeast) {
        return NextResponse.json(
          { error: `Yeast with name "${name}" not found` },
          { status: 404 }
        );
      }
      return NextResponse.json(yeast);
    }

    if (id) {
      const yeast = await getYeastById(parseInt(id, 10));
      if (!yeast) {
        return NextResponse.json(
          { error: `Yeast with ID "${id}" not found` },
          { status: 404 }
        );
      }
      return NextResponse.json(yeast);
    }

    const yeasts = await getAllYeasts();
    return NextResponse.json(yeasts);
  } catch (error) {
    console.error("Error in yeasts API (GET):", error);
    return NextResponse.json(
      { error: "Failed to fetch yeasts" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const adminOrResponse = await verifyAdmin(req);
  if (adminOrResponse instanceof NextResponse) {
    return adminOrResponse;
  }

  try {
    const yeastData = await req.json();

    // Validate the yeast data
    if (!yeastData.name) {
      return NextResponse.json(
        { error: "Yeast name is required" },
        { status: 400 }
      );
    }

    const newYeast = await createYeast(yeastData);
    return NextResponse.json(newYeast);
  } catch (error: any) {
    console.error("Error creating yeast (POST):", error);
    return NextResponse.json(
      { error: "Failed to create yeast" },
      { status: 500 }
    );
  }
}
