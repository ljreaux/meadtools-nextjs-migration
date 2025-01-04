import { POST } from "@/app/api/auth/refresh/route";
import { getUserByEmail } from "@/lib/db/users";
import jwt from "jsonwebtoken";
import { createRequest } from "node-mocks-http";

// Mock necessary imports
jest.mock("@/lib/db/users", () => ({
  getUserByEmail: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

describe("/api/auth/refresh", () => {
  const mockHeaders = {
    get: jest.fn(),
  };

  describe("POST", () => {
    it("should return 400 if email or refreshToken is missing", async () => {
      const req = createRequest({
        method: "POST",
        body: {},
      });
      req.json = async () => req.body;

      const res = await POST(req as any);

      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({
        error: "Email and refreshToken are required",
      });
    });

    it("should return 401 if the email is invalid", async () => {
      const email = "test@example.com";
      const refreshToken = "valid-refresh-token";

      (getUserByEmail as jest.Mock).mockResolvedValue(null); // Mocking invalid user

      const req = createRequest({
        method: "POST",
        body: { email, refreshToken },
      });
      req.json = async () => req.body;

      const res = await POST(req as any);

      expect(res.status).toBe(401);
      expect(await res.json()).toEqual({
        error: "Invalid email",
      });
    });

    it("should return 500 if the refresh token is invalid", async () => {
      const email = "test@example.com";
      const refreshToken = "invalid-refresh-token";

      (getUserByEmail as jest.Mock).mockResolvedValue({
        id: 1,
        email,
        password: "hashedPassword",
        role: "user",
      });

      // Mock the invalid token behavior
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("Invalid token");
      });

      const req = createRequest({
        method: "POST",
        body: { email, refreshToken },
      });
      req.json = async () => req.body;

      const res = await POST(req as any);

      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({
        error: "Invalid refresh token",
      });
    });

    it("should return a new access token if refresh token is valid", async () => {
      const email = "test@example.com";
      const refreshToken = "valid-refresh-token";

      (getUserByEmail as jest.Mock).mockResolvedValue({
        id: 1,
        email,
        password: "hashedPassword",
        role: "user",
      });

      // Mock valid token verification
      (jwt.verify as jest.Mock).mockImplementation(() => {}); // Simulate valid token
      (jwt.sign as jest.Mock).mockReturnValue("new-access-token");

      const req = createRequest({
        method: "POST",
        body: { email, refreshToken },
      });
      req.json = async () => req.body;

      const res = await POST(req as any);

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({
        accessToken: "new-access-token",
      });
    });

    it("should return 500 if there is a server error", async () => {
      const email = "test@example.com";
      const refreshToken = "valid-refresh-token";

      (getUserByEmail as jest.Mock).mockResolvedValue({
        id: 1,
        email,
        password: "hashedPassword",
        role: "user",
      });

      // Simulate error in token verification
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("Error verifying token");
      });

      const req = createRequest({
        method: "POST",
        body: { email, refreshToken },
      });
      req.json = async () => req.body;

      const res = await POST(req as any);

      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({
        error: "Invalid refresh token",
      });
    });
  });
});
