import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name"); // Get the `name` query parameter

  const additiveDosage = [
    { name: "FT Rouge", dosage: "1.3", unit: "g" },
    { name: "Opti-Red", dosage: "1", unit: "g" },
    { name: "FT Blanc Soft", dosage: "0.2", unit: "g" },
    { name: "Opti-White", dosage: "1.9", unit: "g" },
    { name: "Tannin Complex", dosage: "0.2", unit: "g" },
    { name: "Tannin Riche Extra", dosage: "0.2", unit: "g" },
    { name: "Bentonite", dosage: "6", unit: "g" },
    { name: "Chitosan", dosage: "6", unit: "ml" },
    { name: "Kieselsol", dosage: "1", unit: "ml" },
    { name: "Sparkolloid", dosage: "0.6", unit: "g" },
    { name: "Pectic Enzyme", dosage: "0.4", unit: "tsp" },
    { name: "Lallzyme EX-V", dosage: "0.075", unit: "g" },
    { name: "Lallzyme EX", dosage: "0.1", unit: "g" },
    { name: "Lallzyme C-Max", dosage: "0.06", unit: "g" },
    { name: "Oak Chips", dosage: "0.25", unit: "oz" },
    { name: "Oak Spirals", dosage: "1", unit: "units" },
    { name: "Oak Cubes", dosage: "0.5", unit: "oz" },
  ];

  let result;
  if (name) {
    // Filter additives by name (case-insensitive)
    result = additiveDosage.filter(
      (additive) => additive.name.toLowerCase() === name.toLowerCase()
    );
  } else {
    // Return all additives if no name is provided
    result = additiveDosage;
  }

  // Respond with JSON
  return NextResponse.json(result);
}
