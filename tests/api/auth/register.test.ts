import { POST } from "@/app/api/auth/register/route";
import { getUserByEmail, createUser } from "@/lib/db/users";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createRequest } from "node-mocks-http";

// Mock necessary functions
jest.mock("@/lib/db/users", () => ({
  getUserByEmail: jest.fn(),
  createUser: jest.fn(),
}));

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

describe("/api/auth/register", () => {
  const mockHeaders = {
    get: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  describe("POST", () => {
    it("should register a new user successfully", async () => {
      const req = createRequest({
        method: "POST",
        body: {
          email: "test@example.com",
          password: "password123",
        },
      });

      // Explicitly mock json method to return the request body
      req.json = async () => req.body;

      const hashedPassword = "hashedpassword123";
      const newUser = { id: 1, email: "test@example.com", role: "user" };

      (getUserByEmail as jest.Mock).mockResolvedValue(null); // No existing user
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword); // Mock bcrypt hash
      (createUser as jest.Mock).mockResolvedValue(newUser); // Mock createUser
      (jwt.sign as jest.Mock)
        .mockReturnValueOnce("access-token") // Mock access token
        .mockReturnValueOnce("refresh-token"); // Mock refresh token

      const res = await POST(req as any);

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({
        message: "Thank you for signing up!",
        accessToken: "access-token", // Corrected to match the mock value
        refreshToken: "refresh-token",
        role: "user",
        email: "test@example.com",
      });
    });

    it("should return 400 if the email is already taken", async () => {
      const req = createRequest({
        method: "POST",
        body: {
          email: "test@example.com",
          password: "password123",
        },
      });

      // Explicitly mock json method to return the request body
      req.json = async () => req.body;

      const existingUser = { id: 1, email: "test@example.com", role: "user" };
      (getUserByEmail as jest.Mock).mockResolvedValue(existingUser); // User already exists

      const res = await POST(req as any);

      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({
        error: "A user by that email already exists",
      });
    });

    it("should return 500 if there is an error creating the user", async () => {
      const req = createRequest({
        method: "POST",
        body: {
          email: "test@example.com",
          password: "password123",
        },
      });

      // Explicitly mock json method to return the request body
      req.json = async () => req.body;

      (getUserByEmail as jest.Mock).mockResolvedValue(null); // No existing user
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedpassword123"); // Mock bcrypt hash
      (createUser as jest.Mock).mockRejectedValue(new Error("Database error")); // Simulate database error

      const res = await POST(req as any);

      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({
        error: "Failed to register user",
      });
    });

    it("should return 400 if email or password is missing", async () => {
      const req = createRequest({
        method: "POST",
        body: {
          email: "test@example.com", // Missing password
        },
      });

      // Explicitly mock json method to return the request body
      req.json = async () => req.body;

      const res = await POST(req as any);

      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({
        error: "Email and password are required.",
      });
    });

    it("should return 500 if there is an error hashing the password", async () => {
      const req = createRequest({
        method: "POST",
        body: {
          email: "test@example.com",
          password: "password123",
        },
      });

      // Explicitly mock json method to return the request body
      req.json = async () => req.body;

      (getUserByEmail as jest.Mock).mockResolvedValue(null); // No existing user
      (bcrypt.hash as jest.Mock).mockRejectedValue(new Error("Hashing error")); // Simulate hashing error

      const res = await POST(req as any);

      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({
        error: "Failed to register user",
      });
    });
  });
});
