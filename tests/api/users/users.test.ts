import { GET } from "@/app/api/users/route";
import { getAllUsers } from "@/lib/db/users";
import { requireAdmin, verifyUser } from "@/lib/userAccessFunctions";
import { createRequest, createResponse } from "node-mocks-http";

jest.mock("@/lib/db/users", () => ({
  getAllUsers: jest.fn(),
}));

jest.mock("@/lib/userAccessFunctions", () => ({
  verifyUser: jest.fn(),
  requireAdmin: jest.fn(),
}));

describe("/api/users", () => {
  describe("GET", () => {
    it("should fetch all users when user is verified and admin", async () => {
      (verifyUser as jest.Mock).mockResolvedValue("123");
      (requireAdmin as jest.Mock).mockResolvedValue(true);
      (getAllUsers as jest.Mock).mockResolvedValue([
        { id: 1, name: "User One" },
        { id: 2, name: "User Two" },
      ]);

      const req = createRequest({ method: "GET" });
      const res = await GET(req as any);

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual([
        { id: 1, name: "User One" },
        { id: 2, name: "User Two" },
      ]);
    });

    it("should return 403 when user is not verified", async () => {
      (verifyUser as jest.Mock).mockResolvedValue(null);

      const req = createRequest({ method: "GET" });
      const res = await GET(req as any);

      expect(res.status).toBe(403);
      expect(await res.json()).toEqual({
        error: "Unauthorized access",
      });
    });

    it("should return 403 when user is not an admin", async () => {
      (verifyUser as jest.Mock).mockResolvedValue("123");
      (requireAdmin as jest.Mock).mockResolvedValue(false);

      const req = createRequest({ method: "GET" });
      const res = await GET(req as any);

      expect(res.status).toBe(403);
      expect(await res.json()).toEqual({
        error: "Unauthorized access",
      });
    });

    it("should return 500 when there is a database failure", async () => {
      (verifyUser as jest.Mock).mockResolvedValue("123");
      (requireAdmin as jest.Mock).mockResolvedValue(true);
      (getAllUsers as jest.Mock).mockRejectedValue(
        new Error("Database failure")
      );

      const req = createRequest({ method: "GET" });
      const res = await GET(req as any);

      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({
        error: "Failed to fetch users",
      });
    });
  });
});
