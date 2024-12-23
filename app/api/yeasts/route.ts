import { NextRequest, NextResponse } from "next/server";
import {
  getAllYeasts,
  getYeastByBrand,
  getYeastByName,
  getYeastById,
} from "@/lib/db/yeasts";

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
      return NextResponse.json(yeast);
    }

    if (id) {
      const yeast = await getYeastById(parseInt(id, 10));
      return NextResponse.json(yeast);
    }

    const yeasts = await getAllYeasts();
    return NextResponse.json(yeasts);
  } catch (error) {
    console.error("Error in yeasts API:", error);
    return NextResponse.json(
      { error: "Failed to fetch yeasts" },
      { status: 500 }
    );
  }
}

// TODO: Implement POST, PATCH, and DELETE routes for admin actions.
