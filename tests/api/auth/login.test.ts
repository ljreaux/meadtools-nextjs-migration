import { POST } from "@/app/api/auth/login/route";
import { getUserByEmail } from "@/lib/db/users";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

// Mock necessary imports
jest.mock("@/lib/db/users", () => ({
  getUserByEmail: jest.fn(),
}));

jest.mock("bcrypt", () => ({
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data, options) => ({ ...data, status: options?.status })),
  },
}));

// Ensure environment variables exist
process.env.ACCESS_TOKEN_SECRET = "test-secret";
process.env.REFRESH_TOKEN_SECRET = "test-secret";

describe("/api/auth/login", () => {
  describe("POST", () => {
    it("should return 400 if email or password is missing", async () => {
      const req = { json: async () => ({}) } as NextRequest;

      const res = await POST(req);

      expect(res.status).toBe(400);
      expect(res).toEqual({
        error: "Please provide email and password",
        status: 400,
      });
    });

    it("should return 401 for invalid credentials", async () => {
      const email = "test@example.com";
      const password = "incorrectPassword";

      (getUserByEmail as jest.Mock).mockResolvedValue({
        id: 1,
        email: email,
        password: "hashedPassword",
        role: "user",
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const req = { json: async () => ({ email, password }) } as NextRequest;

      const res = await POST(req);

      expect(res.status).toBe(401);
      expect(res).toEqual({
        error: "Invalid email or password",
        status: 401,
      });
    });

    it("should successfully log in a user and return tokens", async () => {
      const email = "test@example.com";
      const password = "correctPassword";

      (getUserByEmail as jest.Mock).mockResolvedValue({
        id: 1,
        email: email,
        password: "hashedPassword",
        role: "user",
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("mock-token");

      const req = { json: async () => ({ email, password }) } as NextRequest;

      const res = await POST(req);

      expect(res.status).toBe(200);
      expect(res).toEqual({
        message: "Successfully logged in!",
        accessToken: "mock-token",
        refreshToken: "mock-token",
        role: "user",
        email: "test@example.com",
        id: 1,
        status: 200,
      });
    });

    it("should return 500 if there is a server error", async () => {
      const email = "test@example.com";
      const password = "correctPassword";

      (getUserByEmail as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      const req = { json: async () => ({ email, password }) } as NextRequest;

      const res = await POST(req);

      expect(res.status).toBe(500);
      expect(res).toEqual({
        error: "Failed to log in user",
        status: 500,
      });
    });

    it("should return 500 if there is an error comparing the password", async () => {
      const email = "test@example.com";
      const password = "correctPassword";

      (getUserByEmail as jest.Mock).mockResolvedValue({
        id: 1,
        email: email,
        password: "hashedPassword",
        role: "user",
      });
      (bcrypt.compare as jest.Mock).mockRejectedValue(
        new Error("Bcrypt error")
      );

      const req = { json: async () => ({ email, password }) } as NextRequest;

      const res = await POST(req);

      expect(res.status).toBe(500);
      expect(res).toEqual({
        error: "Failed to log in user",
        status: 500,
      });
    });
  });
});
