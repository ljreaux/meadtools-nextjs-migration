import { POST } from "@/app/api/auth/login/route";
import { getUserByEmail } from "@/lib/db/users";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createRequest } from "node-mocks-http";

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

describe("/api/auth/login", () => {
  const mockHeaders = {
    get: jest.fn(),
  };

  describe("POST", () => {
    it("should return 400 if email or password is missing", async () => {
      const req = createRequest({
        method: "POST",
        body: {},
      });
      req.json = async () => req.body;

      const res = await POST(req as any);

      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({
        error: "Please provide email and password",
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

      const req = createRequest({
        method: "POST",
        body: { email, password },
      });
      req.json = async () => req.body;

      const res = await POST(req as any);

      expect(res.status).toBe(401);
      expect(await res.json()).toEqual({
        error: "Invalid email or password",
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
      (jwt.sign as jest.Mock).mockReturnValue("access-token");

      const req = createRequest({
        method: "POST",
        body: { email, password },
      });
      req.json = async () => req.body;

      const res = await POST(req as any);

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({
        message: "Successfully logged in!",
        accessToken: "access-token",
        refreshToken: "access-token", // Assuming refreshToken is also mocked as access-token
        role: "user",
        email: "test@example.com",
      });
    });

    it("should return 500 if there is a server error", async () => {
      const email = "test@example.com";
      const password = "correctPassword";

      (getUserByEmail as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      const req = createRequest({
        method: "POST",
        body: { email, password },
      });
      req.json = async () => req.body;

      const res = await POST(req as any);

      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({
        error: "Failed to log in user",
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

      const req = createRequest({
        method: "POST",
        body: { email, password },
      });
      req.json = async () => req.body;

      const res = await POST(req as any);

      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({
        error: "Failed to log in user",
      });
    });
  });
});
