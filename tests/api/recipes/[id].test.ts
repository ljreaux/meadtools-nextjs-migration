import { GET, PATCH, DELETE } from "@/app/api/recipes/[id]/route";
import { verifyUser, requireAdmin } from "@/lib/middleware";
import { getRecipeInfo, updateRecipe, deleteRecipe } from "@/lib/db/recipes";
import { createRequest } from "node-mocks-http";

jest.mock("@/lib/middleware", () => ({
  verifyUser: jest.fn(),
  requireAdmin: jest.fn(),
}));

jest.mock("@/lib/db/recipes", () => ({
  getRecipeInfo: jest.fn(),
  updateRecipe: jest.fn(),
  deleteRecipe: jest.fn(),
}));

describe("/api/recipes/[id]", () => {
  const mockHeaders = {
    get: jest.fn(),
  };

  describe("GET", () => {
    it("should fetch a recipe successfully", async () => {
      (getRecipeInfo as jest.Mock).mockResolvedValue({
        id: 1,
        name: "Test Recipe",
        private: false,
      });

      const req = createRequest({ method: "GET" });
      req.headers = mockHeaders;
      const params = Promise.resolve({ id: "1" });

      const res = await GET(req as any, { params });

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({
        recipe: { id: 1, name: "Test Recipe", private: false },
      });
    });

    it("should return 500 if database fails", async () => {
      (getRecipeInfo as jest.Mock).mockRejectedValue(
        new Error("Database failure")
      );

      const req = createRequest({ method: "GET" });
      req.headers = mockHeaders;
      const params = Promise.resolve({ id: "1" });

      const res = await GET(req as any, { params });

      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({
        error: "An error occurred while fetching the recipe",
      });
    });

    it("should return 400 for invalid recipe ID", async () => {
      const invalidParams = Promise.resolve({ id: "invalid" });
      const req = createRequest({ method: "GET" });

      const res = await GET(req as any, { params: invalidParams });

      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({
        error: "Invalid recipe ID",
      });
    });
  });

  describe("PATCH", () => {
    it("should update a recipe successfully", async () => {
      (verifyUser as jest.Mock).mockResolvedValue("user-id");
      (requireAdmin as jest.Mock).mockResolvedValue(false);
      (getRecipeInfo as jest.Mock).mockResolvedValue({
        id: 1,
        user_id: "user-id",
        private: true,
      });
      (updateRecipe as jest.Mock).mockResolvedValue({
        id: 1,
        name: "Updated Recipe",
      });

      const req = createRequest({
        method: "PATCH",
        body: { name: "Updated Recipe" },
      });
      req.json = async () => ({ name: "Updated Recipe" });
      req.headers = mockHeaders;
      const params = Promise.resolve({ id: "1" });

      const res = await PATCH(req as any, { params });

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ id: 1, name: "Updated Recipe" });
    });

    it("should return 500 on database failure", async () => {
      (verifyUser as jest.Mock).mockResolvedValue("user-id");
      (requireAdmin as jest.Mock).mockResolvedValue(false);
      (getRecipeInfo as jest.Mock).mockResolvedValue({
        id: 1,
        user_id: "user-id",
        private: true,
      });
      (updateRecipe as jest.Mock).mockRejectedValue(
        new Error("Database failure")
      );

      const req = createRequest({
        method: "PATCH",
        body: { name: "Updated Recipe" },
      });
      req.json = async () => ({ name: "Updated Recipe" });
      req.headers = mockHeaders;
      const params = Promise.resolve({ id: "1" });

      const res = await PATCH(req as any, { params });

      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({
        error: "Failed to update recipe",
      });
    });

    it("should return 403 if the user is not authorized to update the recipe", async () => {
      const body = { name: "Updated Recipe" };
      const invalidParams = Promise.resolve({ id: "1" });

      (verifyUser as jest.Mock).mockResolvedValue("user-id");
      (requireAdmin as jest.Mock).mockResolvedValue(false);
      (getRecipeInfo as jest.Mock).mockResolvedValue({
        id: 1,
        user_id: "other-user-id", // Different user_id to trigger unauthorized access
        private: true,
      });

      const req = createRequest({ method: "PATCH", body });
      req.json = async () => body;

      const res = await PATCH(req as any, { params: invalidParams });

      expect(res.status).toBe(403);
      expect(await res.json()).toEqual({
        error: "You are not authorized to update this recipe",
      });
    });
  });

  describe("DELETE", () => {
    it("should delete a recipe successfully", async () => {
      (verifyUser as jest.Mock).mockResolvedValue("user-id");
      (requireAdmin as jest.Mock).mockResolvedValue(false);
      (getRecipeInfo as jest.Mock).mockResolvedValue({
        id: 1,
        user_id: "user-id",
        private: true,
      });
      (deleteRecipe as jest.Mock).mockResolvedValue({
        id: 1,
        name: "Deleted Recipe",
      });

      const req = createRequest({ method: "DELETE" });
      req.headers = mockHeaders;
      const params = Promise.resolve({ id: "1" });

      const res = await DELETE(req as any, { params });

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({
        message: "Deleted Recipe has been deleted.",
      });
    });

    it("should return 500 on database failure", async () => {
      (verifyUser as jest.Mock).mockResolvedValue("user-id");
      (requireAdmin as jest.Mock).mockResolvedValue(false);
      (getRecipeInfo as jest.Mock).mockResolvedValue({
        id: 1,
        user_id: "user-id",
        private: true,
      });
      (deleteRecipe as jest.Mock).mockRejectedValue(
        new Error("Database failure")
      );

      const req = createRequest({ method: "DELETE" });
      req.headers = mockHeaders;
      const params = Promise.resolve({ id: "1" });

      const res = await DELETE(req as any, { params });

      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({
        error: "Failed to delete recipe",
      });
    });

    it("should return 403 if the user is not authorized to delete the recipe", async () => {
      const invalidParams = Promise.resolve({ id: "1" });

      (verifyUser as jest.Mock).mockResolvedValue("user-id");
      (requireAdmin as jest.Mock).mockResolvedValue(false);
      (getRecipeInfo as jest.Mock).mockResolvedValue({
        id: 1,
        user_id: "other-user-id", // Different user_id to trigger unauthorized access
        private: true,
      });

      const req = createRequest({ method: "DELETE" });

      const res = await DELETE(req as any, { params: invalidParams });

      expect(res.status).toBe(403);
      expect(await res.json()).toEqual({
        error: "You are not authorized to delete this recipe",
      });
    });
  });
});
