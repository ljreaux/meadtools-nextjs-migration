import { GET, POST } from "@/app/api/recipes/route";
import { getAllRecipes, createRecipe } from "@/lib/db/recipes";
import { verifyUser, requireAdmin } from "@/lib/middleware";
import { NextResponse } from "next/server";
import { createRequest } from "node-mocks-http";

jest.mock("@/lib/db/recipes", () => ({
  getAllRecipes: jest.fn(),
  createRecipe: jest.fn(),
}));

jest.mock("@/lib/middleware", () => ({
  verifyUser: jest.fn(),
  requireAdmin: jest.fn(),
}));

describe("/api/recipes", () => {
  describe("GET", () => {
    it("should return 500 on database error", async () => {
      (verifyUser as jest.Mock).mockResolvedValue(1);
      (requireAdmin as jest.Mock).mockResolvedValue(true);
      (getAllRecipes as jest.Mock).mockRejectedValue(
        new Error("Database failure")
      );

      const req = createRequest({ method: "GET" });
      const res = await GET(req as any);

      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({
        error: "Failed to fetch recipes",
      });
    });

    it("should return all recipes for an admin", async () => {
      (verifyUser as jest.Mock).mockResolvedValue(1); // Number type now
      (requireAdmin as jest.Mock).mockResolvedValue(true);
      (getAllRecipes as jest.Mock).mockResolvedValue([
        { id: 1, name: "Recipe 1", private: false },
        { id: 2, name: "Recipe 2", private: true },
      ]);

      const req = createRequest({ method: "GET" });
      const res = await GET(req as any);

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({
        recipes: [
          { id: 1, name: "Recipe 1", private: false },
          { id: 2, name: "Recipe 2", private: true },
        ],
      });
    });

    it("should return only public recipes for a regular user", async () => {
      (verifyUser as jest.Mock).mockResolvedValue(2); // Non-admin user
      (requireAdmin as jest.Mock).mockResolvedValue(false);
      (getAllRecipes as jest.Mock).mockResolvedValue([
        { id: 1, name: "Recipe 1", private: false },
        { id: 2, name: "Recipe 2", private: true },
      ]);

      const req = createRequest({ method: "GET" });
      const res = await GET(req as any);

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({
        recipes: [{ id: 1, name: "Recipe 1", private: false }], // Only public recipes should be returned
      });
    });
  });

  describe("POST", () => {
    it("should return 500 on database error", async () => {
      (verifyUser as jest.Mock).mockResolvedValue(2);
      (createRecipe as jest.Mock).mockRejectedValue(
        new Error("Database failure")
      );

      const req = createRequest({
        method: "POST",
        body: {
          name: "Test Recipe",
          recipeData: "Some data",
        },
      });
      req.json = async () => req.body;

      const res = await POST(req as any);

      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({
        error: "Failed to create recipe",
      });
    });

    it("should return 201 and created recipe on success", async () => {
      (verifyUser as jest.Mock).mockResolvedValue(2);
      (createRecipe as jest.Mock).mockResolvedValue({
        id: 1,
        name: "Test Recipe",
        recipeData: "Some data",
      });

      const req = createRequest({
        method: "POST",
        body: {
          name: "Test Recipe",
          recipeData: "Some data",
          privateRecipe: true, // Optional, ensures test aligns with API
        },
      });
      req.json = async () => req.body;

      const res = await POST(req as any);

      expect(res.status).toBe(201);
      expect(await res.json()).toEqual({
        recipe: {
          id: 1,
          name: "Test Recipe",
          recipeData: "Some data",
        },
      });
    });

    it("should return 400 if name or recipeData is missing", async () => {
      const req = createRequest({
        method: "POST",
        body: {
          name: "",
        },
      });
      req.json = async () => req.body;

      const res = await POST(req as any);

      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({
        error: "Name and recipe data are required.",
      });
    });

    it("should return 401 if the user is not authenticated", async () => {
      (verifyUser as jest.Mock).mockResolvedValue(
        NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      );

      const req = createRequest({
        method: "POST",
        body: {
          name: "Test Recipe",
          recipeData: "Some data",
        },
      });
      req.json = async () => req.body;

      const res = await POST(req as any);

      expect(res.status).toBe(401);
      expect(await res.json()).toEqual({
        error: "Unauthorized",
      });
    });
  });
});
