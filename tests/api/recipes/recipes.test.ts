import { GET, POST } from "@/app/api/recipes/route";
import { getAllRecipes, createRecipe } from "@/lib/db/recipes";
import { verifyUser, requireAdmin } from "@/lib/middleware";
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
      (verifyUser as jest.Mock).mockResolvedValue("admin-id");
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

    it("should return 200 and list of recipes on success", async () => {
      (verifyUser as jest.Mock).mockResolvedValue("admin-id");
      (requireAdmin as jest.Mock).mockResolvedValue(true);
      (getAllRecipes as jest.Mock).mockResolvedValue([
        { id: 1, name: "Recipe 1" },
        { id: 2, name: "Recipe 2" },
      ]);

      const req = createRequest({ method: "GET" });
      const res = await GET(req as any);

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({
        recipes: [
          { id: 1, name: "Recipe 1" },
          { id: 2, name: "Recipe 2" },
        ],
      });
    });

    it("should return 403 if user is not admin", async () => {
      (verifyUser as jest.Mock).mockResolvedValue("user-id");
      (requireAdmin as jest.Mock).mockResolvedValue(false);

      const req = createRequest({ method: "GET" });
      const res = await GET(req as any);

      expect(res.status).toBe(403);
      expect(await res.json()).toEqual({
        error: "Unauthorized access",
      });
    });
  });

  describe("POST", () => {
    it("should return 500 on database error", async () => {
      (verifyUser as jest.Mock).mockResolvedValue("user-id");
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
      (verifyUser as jest.Mock).mockResolvedValue("user-id");
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
  });
});
