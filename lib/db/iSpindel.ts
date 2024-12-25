import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import ShortUniqueId from "short-unique-id";

export type LogType = {
  id: string;
  brew_id: string | null;
  device_id: string;
  angle: number;
  temperature: number;
  temp_units: "C" | "F";
  battery: number;
  gravity: number;
  interval: number;
  dateTime: Date;
  calculated_gravity: number | null;
};

export async function getHydrometerToken(userId: number) {
  try {
    return await prisma.users.findUnique({
      where: { id: userId },
      select: { hydro_token: true },
    });
  } catch (error) {
    console.error("Error fetching recipes for user:", error);
    throw new Error("Failed to fetch recipes.");
  }
}

export async function getDevicesForUser(userId: number) {
  try {
    return await prisma.devices.findMany({
      where: { user_id: userId },
    });
  } catch (error) {
    console.error("Error fetching devices for user:", error);
    throw new Error("Failed to fetch devices.");
  }
}

export async function verifyToken(token: string | undefined) {
  if (!token) {
    return NextResponse.json({ error: "Invalid token" }, { status: 404 });
  }
  try {
    const userId = await prisma.users.findFirst({
      where: {
        hydro_token: token,
      },
      select: {
        id: true,
      },
    });
    if (!userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 404 });
    }
    return userId?.id;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Failed to find user for device.");
  }
}

export async function registerDevice({
  device_name,
  userId,
}: {
  device_name: string;
  userId: number;
}) {
  try {
    const found = await prisma.devices.findFirst({
      where: { device_name, user_id: userId },
    });

    const isRegistered = !!found;
    if (isRegistered) return found;

    return await prisma.devices.create({
      data: { device_name, user_id: userId },
    });
  } catch (error) {
    throw new Error("Failed to register device");
  }
}
export function calcGravity([a, b, c, d]: number[], angle: number) {
  return a * Math.pow(angle, 3) + b * Math.pow(angle, 2) + c * angle + d;
}

export async function updateBrewGravity(brewId: string, gravity: number) {
  try {
    return await prisma.brews.update({
      where: { id: brewId },
      data: { latest_gravity: gravity },
    });
  } catch (error) {
    throw new Error("Error updating gravity.");
  }
}

export async function createLog(log: LogType) {
  const data = {
    brew_id: log.brew_id,
    device_id: log.device_id,
    angle: log.angle,
    temperature: log.temperature,
    temp_units: log.temp_units,
    battery: log.battery,
    gravity: log.gravity,
    interval: log.interval,
    calculated_gravity: log.calculated_gravity,
  };

  try {
    return await prisma.logs.create({
      data,
    });
  } catch (error) {
    throw new Error("Error creating log.");
  }
}

export async function getLogs(
  deviceId: string,
  beginDate: Date,
  endDate: Date
) {
  try {
    return await prisma.logs.findMany({
      where: {
        device_id: deviceId,
        datetime: {
          gte: beginDate,
          lte: endDate,
        },
      },
    });
  } catch (error) {
    throw new Error("Error fetching logs.");
  }
}

export async function getLogsForBrew(brew_id: string, userId?: number) {
  try {
    // Fetch the brew and logs in one query
    const brewWithLogs = await prisma.brews.findUnique({
      where: { id: brew_id },
      include: {
        logs: {
          orderBy: { datetime: "asc" },
        },
      },
    });

    if (!brewWithLogs) {
      throw new Error("Brew not found");
    }

    if (brewWithLogs.user_id !== userId) {
      throw new Error("You are not authorized to view these logs");
    }

    return brewWithLogs.logs;
  } catch (error) {
    throw new Error("Error fetching logs for brew.");
  }
}

export async function updateLog(
  id: string,
  deviceId: string,
  data: Partial<LogType>
) {
  try {
    return await prisma.logs.update({
      where: { id },
      data,
    });
  } catch (error) {
    throw new Error("Error updating log.");
  }
}

export async function deleteLog(logId: string, device_id: string) {
  try {
    return await prisma.logs.delete({
      where: { id: logId, device_id },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Error deleting log.");
  }
}

export async function deleteLogsInRange(
  device_id: string,
  startDate: Date,
  endDate: Date
) {
  try {
    const logsToDelete = await prisma.logs.findMany({
      where: {
        device_id,
        datetime: { gte: startDate, lte: endDate },
      },
    });

    if (logsToDelete.length === 0) {
      throw new Error("No logs found to delete.");
    }

    const logIdsToDelete = logsToDelete.map((log) => log.id);

    return await prisma.logs.deleteMany({
      where: { id: { in: logIdsToDelete } },
    });
  } catch (error) {
    throw new Error("Error deleting logs.");
  }
}

export async function createHydrometerToken(userId: number) {
  const { randomUUID } = new ShortUniqueId();
  const token = randomUUID(10);
  try {
    await prisma.users.update({
      where: { id: userId },
      data: { hydro_token: token },
    });
    return token;
  } catch (err) {
    throw new Error("Failed to create hydrometer token.");
  }
}
