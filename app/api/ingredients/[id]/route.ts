import { verifyAdmin } from "@/app/middleware";
import { deleteIngredient, updateIngredient } from "@/lib/db/ingredients";
import { NextRequest, NextResponse } from "next/server";

// PATCH /api/ingredients/:ingredientId
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // Check for admin privileges
  const adminOrResponse = await verifyAdmin(req);
  if (adminOrResponse instanceof NextResponse) {
    return adminOrResponse;
  }

  try {
    const body = await req.json();
    const updatedIngredient = await updateIngredient(params.id, body);

    return NextResponse.json(updatedIngredient);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update ingredient" },
      { status: 500 }
    );
  }
}

// DELETE /api/ingredients/:ingredientId
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // Check for admin privileges
  const adminOrResponse = await verifyAdmin(req);
  if (adminOrResponse instanceof NextResponse) {
    return adminOrResponse;
  }

  try {
    const deletedIngredient = await deleteIngredient(params.id);

    return NextResponse.json({
      message: `${deletedIngredient.name} has been deleted`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete ingredient" },
      { status: 500 }
    );
  }
}
