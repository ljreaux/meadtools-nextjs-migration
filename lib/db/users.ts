import prisma from "@/lib/prisma";

// Get all users
export async function getAllUsers() {
  return await prisma.users.findMany({
    select: {
      id: true,
      email: true,
      role: true,
    },
  });
}

// Get a user by ID
export async function getUserById(id: number) {
  return await prisma.users.findUnique({
    where: { id },
  });
}

export async function getUserByEmail(email: string) {
  try {
    const user = await prisma.users.findUnique({
      where: { email },
    });

    return user;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw new Error("Failed to fetch user by email.");
  }
}

// Create a user
export async function createUser(data: {
  email: string;
  password: string;
  role?: string;
}) {
  return await prisma.users.create({
    data,
  });
}

// Update a user
export async function updateUser(
  id: number,
  fields: Partial<{ email: string; password: string; role: string }>
) {
  return await prisma.users.update({
    where: { id },
    data: fields,
  });
}

// Delete a user
export async function deleteUser(id: number) {
  return await prisma.users.delete({
    where: { id },
  });
}
