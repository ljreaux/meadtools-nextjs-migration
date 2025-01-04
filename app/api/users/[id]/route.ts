import { NextRequest, NextResponse } from "next/server";
import { deleteUser, getUserById, updateUser } from "@/lib/db/users";
import { requireAdmin, verifyUser } from "@/lib/middleware";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await verifyUser(req);
    if (userId instanceof NextResponse) return userId;

    const isAdmin = await requireAdmin(userId);
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 403 }
      );
    }
    const { id } = params;

    const user = await getUserById(parseInt(id, 10));
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await verifyUser(req);
    if (userId instanceof NextResponse) return userId;
    const isAdmin = await requireAdmin(userId);

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 403 }
      );
    }

    const { id } = params;
    const updates = await req.json();

    const updatedUser = await updateUser(Number(id), updates);
    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await verifyUser(req);
    if (userId instanceof NextResponse) return userId;
    const isAdmin = await requireAdmin(userId);

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 403 }
      );
    }

    await deleteUser(Number(params.id));
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
