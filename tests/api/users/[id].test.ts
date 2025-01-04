import { GET, PATCH, DELETE } from "@/app/api/users/[id]/route";
import { getUserById, updateUser, deleteUser } from "@/lib/db/users";
import { verifyUser, requireAdmin } from "@/lib/middleware";
import { createRequest } from "node-mocks-http";

jest.mock("@/lib/db/users", () => ({
  getUserById: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
}));

jest.mock("@/lib/middleware", () => ({
  verifyUser: jest.fn(),
  requireAdmin: jest.fn(),
}));

describe("/api/users/[id]", () => {
  describe("GET", () => {
    it("should return 500 on database error", async () => {
      (verifyUser as jest.Mock).mockResolvedValue("admin-id");
      (requireAdmin as jest.Mock).mockResolvedValue(true);
      (getUserById as jest.Mock).mockRejectedValue(
        new Error("Database failure")
      );

      const req = createRequest({ method: "GET" });
      const res = await GET(req as any, { params: { id: "1" } });

      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({ error: "Failed to fetch user" });
    });
  });

  describe("PATCH", () => {
    it("should return 500 on database error", async () => {
      (verifyUser as jest.Mock).mockResolvedValue("admin-id");
      (requireAdmin as jest.Mock).mockResolvedValue(true);
      (updateUser as jest.Mock).mockRejectedValue(
        new Error("Database failure")
      );

      const req = createRequest({
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      req.body = { name: "Updated User" };
      req.json = async () => req.body;

      const res = await PATCH(req as any, { params: { id: "1" } });

      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({ error: "Failed to update user" });
    });
  });

  describe("DELETE", () => {
    it("should return 500 on database error", async () => {
      (verifyUser as jest.Mock).mockResolvedValue("admin-id");
      (requireAdmin as jest.Mock).mockResolvedValue(true);
      (deleteUser as jest.Mock).mockRejectedValue(
        new Error("Database failure")
      );

      const req = createRequest({ method: "DELETE" });
      const res = await DELETE(req as any, { params: { id: "1" } });

      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({ error: "Failed to delete user" });
    });
  });
});
