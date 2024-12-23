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
