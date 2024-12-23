import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getUserById } from "@/lib/db/users";

const { ACCESS_TOKEN_SECRET = "" } = process.env;

export async function requireAdmin(userId: number): Promise<boolean> {
  const user = await getUserById(userId);
  return user?.role === "admin";
}

export async function verifyUser(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Authorization header missing" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new Error("Token missing");
    }

    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as { id: number };
    return decoded.id;
  } catch (error) {
    console.error("Error verifying token:", error);
    throw new Error("Invalid token");
  }
}

export async function verifyAdmin(
  req: NextRequest
): Promise<number | NextResponse> {
  const userIdOrResponse = await verifyUser(req);

  if (userIdOrResponse instanceof NextResponse) {
    return userIdOrResponse;
  }

  try {
    const user = await getUserById(userIdOrResponse);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 403 }
      );
    }

    return user.id;
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to verify admin" },
      { status: 500 }
    );
  }
}
