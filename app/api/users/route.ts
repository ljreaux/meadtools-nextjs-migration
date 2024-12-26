import { NextRequest, NextResponse } from "next/server";
import { getAllUsers } from "@/lib/db/users";
import { requireAdmin, verifyUser } from "@/lib/middleware";

export async function GET(req: NextRequest) {
  const userId = await verifyUser(req);
  if (userId instanceof NextResponse) return userId;
  const isAdmin = await requireAdmin(userId);

  if (!userId || !isAdmin) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
  }
  try {
    const users = await getAllUsers();
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
