import { GET, POST } from "@/app/api/yeasts/route";
import { NextRequest, NextResponse } from "next/server";
import { createRequest, createResponse } from "node-mocks-http";
import {
  getAllYeasts,
  getYeastByBrand,
  getYeastByName,
  getYeastById,
  createYeast,
} from "@/lib/db/yeasts";
import { verifyAdmin } from "@/lib/middleware";

jest.mock("@/lib/db/yeasts");
jest.mock("@/lib/middleware");

describe("/api/yeasts", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST", () => {
    it("should create a yeast when admin is verified", async () => {
      (verifyAdmin as jest.Mock).mockResolvedValue(true);
      (createYeast as jest.Mock).mockResolvedValue({
        id: 1,
        name: "Lalvin EC-1118",
      });

      const req = {
        json: async () => ({ name: "Lalvin EC-1118" }),
      } as unknown as NextRequest;

      const res = await POST(req);

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ id: 1, name: "Lalvin EC-1118" });
    });

    it("should return a 400 error when yeast name is missing", async () => {
      (verifyAdmin as jest.Mock).mockResolvedValue(true);

      const req = {
        json: async () => ({}),
      } as unknown as NextRequest;

      const res = await POST(req);

      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({
        error: "Yeast name is required",
      });
    });

    it("should return a 401 error when admin is not verified", async () => {
      (verifyAdmin as jest.Mock).mockResolvedValue(
        NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      );

      const req = {
        json: async () => ({ name: "Lalvin EC-1118" }),
      } as unknown as NextRequest;

      const res = await POST(req);

      expect(res.status).toBe(401);
      expect(await res.json()).toEqual({ error: "Unauthorized" });
    });

    it("should return a 500 error on database failure", async () => {
      (verifyAdmin as jest.Mock).mockResolvedValue(true);
      (createYeast as jest.Mock).mockRejectedValue(
        new Error("Database failure")
      );

      const req = {
        json: async () => ({ name: "Lalvin EC-1118" }),
      } as unknown as NextRequest;

      const res = await POST(req);

      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({
        error: "Failed to create yeast",
      });
    });
  });

  describe("GET", () => {
    it("should fetch all yeasts when no query params are provided", async () => {
      (getAllYeasts as jest.Mock).mockResolvedValue([
        { id: 1, name: "Lalvin" },
      ]);
      const req = new NextRequest("http://localhost/api/yeasts");
      const res = await GET(req);

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual([{ id: 1, name: "Lalvin" }]);
    });

    it("should fetch yeasts by brand when brand query param is provided", async () => {
      (getYeastByBrand as jest.Mock).mockResolvedValue([
        { id: 1, brand: "Lalvin" },
      ]);
      const req = new NextRequest("http://localhost/api/yeasts?brand=Lalvin");
      const res = await GET(req);

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual([{ id: 1, brand: "Lalvin" }]);
    });

    it("should return a 500 error on database failure", async () => {
      (getAllYeasts as jest.Mock).mockRejectedValue(
        new Error("Database failure")
      );
      const req = new NextRequest("http://localhost/api/yeasts");
      const res = await GET(req);

      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({
        error: "Failed to fetch yeasts",
      });
    });
  });
});
