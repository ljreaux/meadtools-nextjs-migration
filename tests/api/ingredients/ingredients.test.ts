import { GET, POST } from "@/app/api/ingredients/route";
import { createRequest, createResponse } from "node-mocks-http";
import {
  getAllIngredients,
  getIngredientsByCategory,
  getIngredientByName,
  createIngredient,
} from "@/lib/db/ingredients";
import { verifyAdmin } from "@/lib/middleware";
import { NextResponse } from "next/server";

jest.mock("@/lib/db/ingredients");
jest.mock("@/lib/middleware");

describe("/api/ingredients", () => {
  describe("GET", () => {
    it("should fetch all ingredients when no query params are provided", async () => {
      (getAllIngredients as jest.Mock).mockResolvedValue([
        { id: 1, name: "Honey" },
        { id: 2, name: "Water" },
      ]);

      const req = createRequest({
        method: "GET",
        url: "http://localhost/api/ingredients",
      });
      const res = await GET(req as any);

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual([
        { id: 1, name: "Honey" },
        { id: 2, name: "Water" },
      ]);
    });

    it("should fetch ingredients by category", async () => {
      (getIngredientsByCategory as jest.Mock).mockResolvedValue([
        { id: 3, name: "Orange Blossom Honey" },
      ]);

      const req = createRequest({
        method: "GET",
        url: "http://localhost/api/ingredients?category=honey",
      });
      const res = await GET(req as any);

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual([
        { id: 3, name: "Orange Blossom Honey" },
      ]);
    });

    it("should fetch an ingredient by name", async () => {
      (getIngredientByName as jest.Mock).mockResolvedValue({
        id: 4,
        name: "Yeast Nutrient",
      });

      const req = createRequest({
        method: "GET",
        url: "http://localhost/api/ingredients?name=Yeast%20Nutrient",
      });
      const res = await GET(req as any);

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ id: 4, name: "Yeast Nutrient" });
    });

    it("should return a 500 error on database failure", async () => {
      (getAllIngredients as jest.Mock).mockRejectedValue(
        new Error("Database failure")
      );

      const req = createRequest({
        method: "GET",
        url: "http://localhost/api/ingredients",
      });
      const res = await GET(req as any);

      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({
        error: "Failed to fetch ingredients",
      });
    });
  });

  describe("POST", () => {
    it("should create an ingredient when admin is verified", async () => {
      (verifyAdmin as jest.Mock).mockResolvedValue(true);
      (createIngredient as jest.Mock).mockResolvedValue({
        id: 5,
        name: "Raspberry",
      });

      const req = createRequest({
        method: "POST",
        url: "http://localhost/api/ingredients",
      });

      req.json = jest.fn().mockResolvedValue({ name: "Raspberry" });

      const res = await POST(req as any);

      expect(res.status).toBe(201);
      expect(await res.json()).toEqual({ id: 5, name: "Raspberry" });
    });

    it("should return a 401 error if admin verification fails", async () => {
      (verifyAdmin as jest.Mock).mockResolvedValue(
        NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      );

      const req = createRequest({
        method: "POST",
        url: "http://localhost/api/ingredients",
      });

      const res = await POST(req as any);

      expect(res.status).toBe(401);
    });

    it("should return a 500 error on database failure", async () => {
      (verifyAdmin as jest.Mock).mockResolvedValue(true);
      (createIngredient as jest.Mock).mockRejectedValue(
        new Error("Database failure")
      );

      const req = createRequest({
        method: "POST",
        url: "http://localhost/api/ingredients",
      });

      req.json = jest.fn().mockResolvedValue({ name: "Raspberry" });

      const res = await POST(req as any);

      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({
        error: "Database failure",
      });
    });
  });
});
