import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getUserById } from "@/lib/db/users";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import * as middlewareModule from "@/lib/middleware";
import { requireAdmin, verifyUser, verifyAdmin } from "@/lib/middleware";
import { authOptions } from "@/lib/auth";

// Mock the imports
jest.mock("jsonwebtoken");
jest.mock("@/lib/db/users");
jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    users: {
      findUnique: jest.fn(),
    },
  },
}));
jest.mock("next-auth");

describe("Auth Middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.ACCESS_TOKEN_SECRET = "test-secret";
  });

  describe("requireAdmin", () => {
    it("should return true when user is admin", async () => {
      (getUserById as jest.Mock).mockResolvedValue({ role: "admin" });

      const result = await requireAdmin(1);

      expect(result).toBe(true);
      expect(getUserById).toHaveBeenCalledWith(1);
    });

    it("should return false when user is not admin", async () => {
      (getUserById as jest.Mock).mockResolvedValue({ role: "user" });

      const result = await requireAdmin(1);

      expect(result).toBe(false);
      expect(getUserById).toHaveBeenCalledWith(1);
    });

    it("should return false when user is not found", async () => {
      (getUserById as jest.Mock).mockResolvedValue(null);

      const result = await requireAdmin(1);

      expect(result).toBe(false);
      expect(getUserById).toHaveBeenCalledWith(1);
    });
  });

  describe("verifyUser", () => {
    it("should return user ID when custom token is valid", async () => {
      const req = new NextRequest("http://example.com", {
        headers: {
          Authorization: "Bearer valid-token",
        },
      });

      (jwt.verify as jest.Mock).mockReturnValue({ id: 1 });
      (prisma.users.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        email: "user@example.com",
      });

      const result = await verifyUser(req);

      expect(result).toBe(1);
      expect(jwt.verify).toHaveBeenCalledWith("valid-token", "test-secret");
      expect(prisma.users.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("should return 401 when Authorization header is missing", async () => {
      const req = new NextRequest("http://example.com");

      const result = await verifyUser(req);

      expect(result).toBeInstanceOf(NextResponse);
      expect((result as NextResponse).status).toBe(401);
      const body = await (result as NextResponse).json();
      expect(body).toEqual({ error: "Authorization header missing" });
    });

    it("should return 401 when token is missing", async () => {
      const req = new NextRequest("http://example.com", {
        headers: {
          Authorization: "Bearer ",
        },
      });

      const result = await verifyUser(req);

      expect(result).toBeInstanceOf(NextResponse);
      expect((result as NextResponse).status).toBe(401);
      const body = await (result as NextResponse).json();
      expect(body).toEqual({ error: "Token missing" });
    });

    it("should return 404 when user not found for custom token", async () => {
      const req = new NextRequest("http://example.com", {
        headers: {
          Authorization: "Bearer valid-token",
        },
      });

      (jwt.verify as jest.Mock).mockReturnValue({ id: 1 });
      (prisma.users.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await verifyUser(req);

      expect(result).toBeInstanceOf(NextResponse);
      expect((result as NextResponse).status).toBe(404);
      const body = await (result as NextResponse).json();
      expect(body).toEqual({ error: "User not found" });
    });

    it("should try session when custom token fails", async () => {
      const req = new NextRequest("http://example.com", {
        headers: {
          Authorization: "Bearer invalid-token",
        },
      });

      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("Invalid token");
      });

      (getServerSession as jest.Mock).mockResolvedValue({
        user: { email: "user@example.com" },
      });

      (prisma.users.findUnique as jest.Mock).mockResolvedValue({
        id: 2,
        email: "user@example.com",
      });

      const result = await verifyUser(req);

      expect(result).toBe(2);
      expect(getServerSession).toHaveBeenCalledWith(authOptions);
      expect(prisma.users.findUnique).toHaveBeenCalledWith({
        where: { email: "user@example.com" },
      });
    });

    it("should try google_id when email lookup fails", async () => {
      const req = new NextRequest("http://example.com", {
        headers: {
          Authorization: "Bearer invalid-token",
        },
      });

      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("Invalid token");
      });

      (getServerSession as jest.Mock).mockResolvedValue({
        user: { email: "user@example.com", id: "google-123" },
      });

      // First call for email lookup returns null
      (prisma.users.findUnique as jest.Mock).mockResolvedValueOnce(null);
      // Second call for google_id lookup returns user
      (prisma.users.findUnique as jest.Mock).mockResolvedValueOnce({
        id: 3,
        google_id: "google-123",
      });

      const result = await verifyUser(req);

      expect(result).toBe(3);
      expect(prisma.users.findUnique).toHaveBeenNthCalledWith(1, {
        where: { email: "user@example.com" },
      });
      expect(prisma.users.findUnique).toHaveBeenNthCalledWith(2, {
        where: { google_id: "google-123" },
      });
    });

    it("should return 401 when no valid user found", async () => {
      const req = new NextRequest("http://example.com", {
        headers: {
          Authorization: "Bearer invalid-token",
        },
      });

      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("Invalid token");
      });

      (getServerSession as jest.Mock).mockResolvedValue({
        user: { email: "user@example.com", id: "google-123" },
      });

      // Both lookups return null
      (prisma.users.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await verifyUser(req);

      expect(result).toBeInstanceOf(NextResponse);
      expect((result as NextResponse).status).toBe(401);
      const body = await (result as NextResponse).json();
      expect(body).toEqual({ error: "Invalid token or unauthorized access" });
    });

    it("should return 401 on unexpected error", async () => {
      const req = new NextRequest("http://example.com", {
        headers: {
          Authorization: "Bearer valid-token",
        },
      });

      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("Unexpected error");
      });

      (getServerSession as jest.Mock).mockImplementation(() => {
        throw new Error("Session error");
      });

      const result = await verifyUser(req);

      expect(result).toBeInstanceOf(NextResponse);
      expect((result as NextResponse).status).toBe(401);
      const body = await (result as NextResponse).json();
      expect(body).toEqual({ error: "Invalid or expired token" });
    });
  });

  describe("verifyAdmin", () => {
    it("should return user ID when user is admin", async () => {
      const req = new NextRequest("http://example.com", {
        headers: {
          Authorization: "Bearer valid-token",
        },
      });

      // Mock verifyUser to return a valid user ID
      (jwt.verify as jest.Mock).mockReturnValue({ id: 1 });
      (prisma.users.findUnique as jest.Mock).mockResolvedValue({ id: 1 });

      // Mock getUserById to return an admin user
      (getUserById as jest.Mock).mockResolvedValue({ id: 1, role: "admin" });

      const result = await verifyAdmin(req);

      expect(result).toBe(1);
      expect(getUserById).toHaveBeenCalledWith(1);
    });

    it("should forward NextResponse when verifyUser returns a response", async () => {
      const req = new NextRequest("http://example.com");
      const mockResponse = NextResponse.json(
        { error: "Auth error" },
        { status: 401 }
      );

      // Correctly mock the verifyUser function in the module
      jest
        .spyOn(middlewareModule, "verifyUser")
        .mockResolvedValueOnce(mockResponse);

      const result = await verifyAdmin(req);

      expect(result).toBe(mockResponse);
    });

    it("should return 404 when user not found", async () => {
      const req = new NextRequest("http://example.com", {
        headers: {
          Authorization: "Bearer valid-token",
        },
      });

      // Mock verifyUser to return a valid user ID
      jest.spyOn(middlewareModule, "verifyUser").mockResolvedValueOnce(1);

      // Mock getUserById to return null (user not found)
      (getUserById as jest.Mock).mockResolvedValue(null);

      const result = await verifyAdmin(req);

      expect(result).toBeInstanceOf(NextResponse);
      expect((result as NextResponse).status).toBe(404);
      const body = await (result as NextResponse).json();
      expect(body).toEqual({ error: "User not found" });
    });

    it("should return 403 when user is not admin", async () => {
      const req = new NextRequest("http://example.com", {
        headers: {
          Authorization: "Bearer valid-token",
        },
      });

      // Mock verifyUser to return a valid user ID
      jest.spyOn(middlewareModule, "verifyUser").mockResolvedValueOnce(1);

      // Mock getUserById to return a non-admin user
      (getUserById as jest.Mock).mockResolvedValue({ id: 1, role: "user" });

      const result = await verifyAdmin(req);

      expect(result).toBeInstanceOf(NextResponse);
      expect((result as NextResponse).status).toBe(403);
      const body = await (result as NextResponse).json();
      expect(body).toEqual({ error: "Unauthorized access" });
    });

    it("should return 500 on unexpected error", async () => {
      const req = new NextRequest("http://example.com", {
        headers: {
          Authorization: "Bearer valid-token",
        },
      });

      // Mock verifyUser to return a valid user ID
      jest.spyOn(middlewareModule, "verifyUser").mockResolvedValueOnce(1);

      // Mock getUserById to throw an error
      (getUserById as jest.Mock).mockImplementation(() => {
        throw new Error("Database error");
      });

      const result = await verifyAdmin(req);

      expect(result).toBeInstanceOf(NextResponse);
      expect((result as NextResponse).status).toBe(500);
      const body = await (result as NextResponse).json();
      expect(body).toEqual({ error: "Failed to verify admin" });
    });
  });
});
