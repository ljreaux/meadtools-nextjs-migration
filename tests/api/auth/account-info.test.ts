import { GET, PATCH } from "@/app/api/auth/account-info/route";
import { verifyUser } from "@/lib/middleware";
import { getUserById, updateUser } from "@/lib/db/users";
import { getAllRecipesForUser } from "@/lib/db/recipes";
import bcrypt from "bcrypt";
import { createRequest } from "node-mocks-http";

// Mock necessary imports
jest.mock("@/lib/middleware", () => ({
  verifyUser: jest.fn(),
}));

jest.mock("@/lib/db/users", () => ({
  getUserById: jest.fn(),
  updateUser: jest.fn(),
}));

jest.mock("@/lib/db/recipes", () => ({
  getAllRecipesForUser: jest.fn(),
}));

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
}));

describe("/api/auth/account-info", () => {
  const mockHeaders = {
    get: jest.fn(),
  };

  describe("GET", () => {
    it("should return 401 if the user is unauthorized", async () => {
      (verifyUser as jest.Mock).mockResolvedValue(null); // Mock unauthorized user

      const req = createRequest({
        method: "GET",
      });
      req.headers = mockHeaders;

      const res = await GET(req as any);

      expect(res.status).toBe(401);
      expect(await res.json()).toEqual({
        error: "Unauthorized",
      });
    });

    it("should return 404 if the user is not found", async () => {
      const userId = "user-id";
      (verifyUser as jest.Mock).mockResolvedValue(userId); // Mock valid user ID
      (getUserById as jest.Mock).mockResolvedValue(null); // Mock no user found

      const req = createRequest({
        method: "GET",
      });
      req.headers = mockHeaders;

      const res = await GET(req as any);

      expect(res.status).toBe(404);
      expect(await res.json()).toEqual({
        error: "User not found",
      });
    });

    it("should return user info and recipes successfully", async () => {
      const userId = "user-id";
      const user = { id: userId, email: "test@example.com", role: "user" };
      const recipes = [
        { id: 1, name: "Recipe 1" },
        { id: 2, name: "Recipe 2" },
      ];

      (verifyUser as jest.Mock).mockResolvedValue(userId); // Mock valid user ID
      (getUserById as jest.Mock).mockResolvedValue(user); // Mock user data
      (getAllRecipesForUser as jest.Mock).mockResolvedValue(recipes); // Mock user recipes

      const req = createRequest({
        method: "GET",
      });
      req.headers = mockHeaders;

      const res = await GET(req as any);

      expect(res.status).toBe(200);
      const responseData = await res.json();
      expect(responseData.user).toEqual({
        ...user,
        password: undefined, // Password should not be included
      });
      expect(responseData.recipes).toEqual(recipes);
    });

    it("should return 500 if there is a server error", async () => {
      const userId = "user-id";
      (verifyUser as jest.Mock).mockResolvedValue(userId); // Mock valid user ID
      (getUserById as jest.Mock).mockRejectedValue(new Error("Database error"));

      const req = createRequest({
        method: "GET",
      });
      req.headers = mockHeaders;

      const res = await GET(req as any);

      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({
        error: "Failed to fetch account info",
      });
    });
  });

  describe("PATCH", () => {
    it("should return 401 if the user is unauthorized", async () => {
      (verifyUser as jest.Mock).mockResolvedValue(null); // Mock unauthorized user

      const req = createRequest({
        method: "PATCH",
        body: { email: "newemail@example.com" },
      });
      req.json = async () => req.body;
      req.headers = mockHeaders;

      const res = await PATCH(req as any);

      expect(res.status).toBe(401);
      expect(await res.json()).toEqual({
        error: "Unauthorized",
      });
    });

    it("should update user information successfully", async () => {
      const userId = "user-id";
      const updatedUser = {
        id: userId,
        email: "newemail@example.com",
        role: "user",
      };
      const body = {
        email: "newemail@example.com",
        password: "newpassword123",
      };

      (verifyUser as jest.Mock).mockResolvedValue(userId); // Mock valid user ID
      (getUserById as jest.Mock).mockResolvedValue(updatedUser); // Mock user data
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedpassword"); // Mock hashed password
      (updateUser as jest.Mock).mockResolvedValue(updatedUser); // Mock updated user

      const req = createRequest({
        method: "PATCH",
        body,
      });
      req.json = async () => req.body;
      req.headers = mockHeaders;

      const res = await PATCH(req as any);

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({
        ...updatedUser,
        password: undefined, // Password should not be included in the response
      });
    });

    it("should return 500 if there is an error updating user info", async () => {
      const userId = "user-id";
      const body = {
        email: "newemail@example.com",
        password: "newpassword123",
      };

      (verifyUser as jest.Mock).mockResolvedValue(userId); // Mock valid user ID
      (getUserById as jest.Mock).mockResolvedValue({
        id: userId,
        email: "oldemail@example.com",
        role: "user",
      });
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedpassword"); // Mock hashed password
      (updateUser as jest.Mock).mockRejectedValue(new Error("Database error"));

      const req = createRequest({
        method: "PATCH",
        body,
      });
      req.json = async () => req.body;
      req.headers = mockHeaders;

      const res = await PATCH(req as any);

      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({
        error: "Failed to update account info",
      });
    });
  });
});
