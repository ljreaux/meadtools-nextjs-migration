import { verifyUser } from "@/lib/middleware";
import {
  calcGravity,
  createLog,
  getDevicesForUser,
  getHydrometerToken,
  registerDevice,
  updateBrewGravity,
  verifyToken,
} from "@/lib/db/iSpindel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Verify user authentication
  const userOrResponse = await verifyUser(req);
  if (userOrResponse instanceof NextResponse) {
    return userOrResponse; // Return error response if the user is not verified
  }
  const userId = userOrResponse;
  try {
    const hydro_token = await getHydrometerToken(userId);
    const devices = await getDevicesForUser(userId);

    return NextResponse.json({ ...hydro_token, devices }, { status: 200 });
  } catch (err) {
    console.error("Error fetching hydro_token:", err);
    return NextResponse.json(
      { error: "Failed to fetch hydro_token" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body || !body.token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }
  try {
    const userId = await verifyToken(body.token);
    if (userId instanceof NextResponse) {
      return userId; // Return error response if the token is invalid
    }

    const newDevice = { userId, device_name: body.name };
    const device = await registerDevice(newDevice);
    const { coefficients, brew_id } = device;

    let calculated_gravity = null;
    if (!!coefficients.length)
      calculated_gravity = calcGravity(coefficients, body.angle);
    const gravity = calculated_gravity ?? body.gravity;

    if (!!brew_id) await updateBrewGravity(brew_id, gravity);

    const data = { ...body, calculated_gravity, brew_id, device_id: device.id };

    const log = await createLog(data);
    return NextResponse.json(log, { status: 200 });
  } catch (error) {
    console.error("Error logging:", error);
    return NextResponse.json({ error: "Failed to log" }, { status: 500 });
  }
}
