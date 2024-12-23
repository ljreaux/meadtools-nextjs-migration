import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getUserByEmail } from "@/lib/db/users";

const { REFRESH_TOKEN_SECRET = "", ACCESS_TOKEN_SECRET = "" } = process.env;

export async function POST(req: NextRequest) {
  const { email, refreshToken } = await req.json();

  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: "Invalid email" }, { status: 401 });
    }

    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

    const accessToken = jwt.sign({ id: user.id }, ACCESS_TOKEN_SECRET, {
      expiresIn: "1w",
    });

    return NextResponse.json({ accessToken });
  } catch (error) {
    console.error("Error refreshing token:", error);
    return NextResponse.json(
      { error: "Invalid refresh token" },
      { status: 401 }
    );
  }
}
