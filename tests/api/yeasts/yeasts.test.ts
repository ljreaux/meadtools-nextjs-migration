import { GET, POST } from "@/app/api/yeasts/route";
import { NextRequest, NextResponse } from "next/server";
import {
  getAllYeasts,
  getYeastByBrand,
  getYeastByName,
  getYeastById,
  createYeast,
} from "@/lib/db/yeasts";
import { verifyAdmin } from "@/lib/userAccessFunctions";

jest.mock("@/lib/db/yeasts");
jest.mock("@/lib/userAccessFunctions");

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

    it("should fetch yeast by name when name query param is provided", async () => {
      (getYeastByName as jest.Mock).mockResolvedValue({
        id: 1,
        name: "EC-1118",
        brand: "Lalvin",
      });
      const req = new NextRequest("http://localhost/api/yeasts?name=EC-1118");
      const res = await GET(req);

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({
        id: 1,
        name: "EC-1118",
        brand: "Lalvin",
      });
    });

    it("should return 404 when yeast with given name is not found", async () => {
      (getYeastByName as jest.Mock).mockResolvedValue(null);
      const req = new NextRequest(
        "http://localhost/api/yeasts?name=NonExistent"
      );
      const res = await GET(req);

      expect(res.status).toBe(404);
      expect(await res.json()).toEqual({
        error: 'Yeast with name "NonExistent" not found',
      });
    });

    it("should fetch yeast by id when id query param is provided", async () => {
      (getYeastById as jest.Mock).mockResolvedValue({
        id: 1,
        name: "EC-1118",
        brand: "Lalvin",
      });
      const req = new NextRequest("http://localhost/api/yeasts?id=1");
      const res = await GET(req);

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({
        id: 1,
        name: "EC-1118",
        brand: "Lalvin",
      });
    });

    it("should return 404 when yeast with given id is not found", async () => {
      (getYeastById as jest.Mock).mockResolvedValue(null);
      const req = new NextRequest("http://localhost/api/yeasts?id=999");
      const res = await GET(req);

      expect(res.status).toBe(404);
      expect(await res.json()).toEqual({
        error: 'Yeast with ID "999" not found',
      });
    });

    it("should handle invalid id parameter", async () => {
      const req = new NextRequest("http://localhost/api/yeasts?id=invalid");
      (getYeastById as jest.Mock).mockResolvedValue(null);

      const res = await GET(req);

      expect(res.status).toBe(404);
      expect(await res.json()).toEqual({
        error: 'Yeast with ID "invalid" not found',
      });
      // Verify that getYeastById was called with NaN due to parseInt on invalid string
      expect(getYeastById).toHaveBeenCalledWith(NaN);
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
