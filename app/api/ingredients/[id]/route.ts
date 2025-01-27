import { verifyAdmin } from "@/lib/middleware";
import { deleteIngredient, updateIngredient } from "@/lib/db/ingredients";
import { NextRequest, NextResponse } from "next/server";

// PATCH /api/ingredients/:ingredientId
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check for admin privileges
  const adminOrResponse = await verifyAdmin(req);
  if (adminOrResponse instanceof NextResponse) {
    return adminOrResponse;
  }

  try {
    const body = await req.json();
    const { id } = await params;
    const updatedIngredient = await updateIngredient(id, body);

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
  { params }: { params: Promise<{ id: string }> }
) {
  // Check for admin privileges
  const adminOrResponse = await verifyAdmin(req);
  if (adminOrResponse instanceof NextResponse) {
    return adminOrResponse;
  }

  try {
    const { id } = await params;
    const deletedIngredient = await deleteIngredient(id);

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
