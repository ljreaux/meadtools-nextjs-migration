import { GET, PATCH, DELETE } from "@/app/api/users/[id]/route";
import { getUserById, updateUser, deleteUser } from "@/lib/db/users";
import { verifyUser, requireAdmin } from "@/lib/userAccessFunctions";
import { createRequest } from "node-mocks-http";

jest.mock("@/lib/db/users", () => ({
  getUserById: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
}));

jest.mock("@/lib/userAccessFunctions", () => ({
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
      const res = await GET(req as any, {
        params: Promise.resolve({ id: "1" }),
      });

      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({ error: "Failed to fetch user" });
    });

    it("should return 403 if user is not an admin", async () => {
      (verifyUser as jest.Mock).mockResolvedValue("user-id");
      (requireAdmin as jest.Mock).mockResolvedValue(false);

      const req = createRequest({ method: "GET" });
      const res = await GET(req as any, {
        params: Promise.resolve({ id: "1" }),
      });

      expect(res.status).toBe(403);
      expect(await res.json()).toEqual({ error: "Unauthorized access" });
    });

    it("should return 404 if user is not found", async () => {
      (verifyUser as jest.Mock).mockResolvedValue("admin-id");
      (requireAdmin as jest.Mock).mockResolvedValue(true);
      (getUserById as jest.Mock).mockResolvedValue(null);

      const req = createRequest({ method: "GET" });
      const res = await GET(req as any, {
        params: Promise.resolve({ id: "999" }),
      });

      expect(res.status).toBe(404);
      expect(await res.json()).toEqual({ error: "User not found" });
    });

    it("should return 200 and user data on success", async () => {
      const mockUser = { id: 1, name: "Test User" };
      (verifyUser as jest.Mock).mockResolvedValue("admin-id");
      (requireAdmin as jest.Mock).mockResolvedValue(true);
      (getUserById as jest.Mock).mockResolvedValue(mockUser);

      const req = createRequest({ method: "GET" });
      const res = await GET(req as any, {
        params: Promise.resolve({ id: "1" }),
      });

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual(mockUser);
    });
  });

  describe("PATCH", () => {
    it("should return 403 if user is not an admin", async () => {
      (verifyUser as jest.Mock).mockResolvedValue("user-id");
      (requireAdmin as jest.Mock).mockResolvedValue(false);

      const req = createRequest({
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      req.body = { name: "Updated Name" };
      req.json = async () => req.body;

      const res = await PATCH(req as any, {
        params: Promise.resolve({ id: "1" }),
      });

      expect(res.status).toBe(403);
      expect(await res.json()).toEqual({ error: "Unauthorized access" });
    });

    it("should return 200 and updated user data on success", async () => {
      const updatedUser = { id: 1, name: "Updated User" };
      (verifyUser as jest.Mock).mockResolvedValue("admin-id");
      (requireAdmin as jest.Mock).mockResolvedValue(true);
      (updateUser as jest.Mock).mockResolvedValue(updatedUser);

      const req = createRequest({
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      req.body = { name: "Updated User" };
      req.json = async () => req.body;

      const res = await PATCH(req as any, {
        params: Promise.resolve({ id: "1" }),
      });

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual(updatedUser);
    });
  });

  describe("DELETE", () => {
    it("should return 403 if user is not an admin", async () => {
      (verifyUser as jest.Mock).mockResolvedValue("user-id");
      (requireAdmin as jest.Mock).mockResolvedValue(false);

      const req = createRequest({ method: "DELETE" });
      const res = await DELETE(req as any, {
        params: Promise.resolve({ id: "1" }),
      });

      expect(res.status).toBe(403);
      expect(await res.json()).toEqual({ error: "Unauthorized access" });
    });

    it("should return 200 on successful deletion", async () => {
      (verifyUser as jest.Mock).mockResolvedValue("admin-id");
      (requireAdmin as jest.Mock).mockResolvedValue(true);
      (deleteUser as jest.Mock).mockResolvedValue(undefined);

      const req = createRequest({ method: "DELETE" });
      const res = await DELETE(req as any, {
        params: Promise.resolve({ id: "1" }),
      });

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({
        message: "User deleted successfully",
      });
    });
  });
});
