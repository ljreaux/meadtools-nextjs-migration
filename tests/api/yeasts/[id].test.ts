import { GET, PATCH, DELETE } from "@/app/api/yeasts/[id]/route";
import { getYeastById, updateYeast, deleteYeast } from "@/lib/db/yeasts";
import { verifyAdmin } from "@/lib/userAccessFunctions";
import { NextRequest, NextResponse } from "next/server";

jest.mock("@/lib/db/yeasts");
jest.mock("@/lib/userAccessFunctions");

describe("/api/yeasts/:id", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET", () => {
    it("should fetch yeast by ID", async () => {
      const mockYeast = { id: 1, name: "EC-1118" };
      (getYeastById as jest.Mock).mockResolvedValue(mockYeast);

      const req = {} as NextRequest;
      const res = await GET(req, { params: { id: "1" } });

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual(mockYeast);
      expect(getYeastById).toHaveBeenCalledWith(1);
    });

    it("should return 500 on database error", async () => {
      (getYeastById as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      const req = {} as NextRequest;
      const res = await GET(req, { params: { id: "1" } });

      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({
        error: "Database error",
      });
    });
  });

  describe("PATCH", () => {
    it("should update yeast when admin is verified", async () => {
      (verifyAdmin as jest.Mock).mockResolvedValue(true);
      const mockUpdatedYeast = { id: 1, name: "Updated Yeast" };
      (updateYeast as jest.Mock).mockResolvedValue(mockUpdatedYeast);

      const req = {
        json: async () => ({ name: "Updated Yeast" }),
      } as NextRequest;

      const res = await PATCH(req, { params: { id: "1" } });

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual(mockUpdatedYeast);
      expect(updateYeast).toHaveBeenCalledWith("1", { name: "Updated Yeast" });
    });

    it("should return 401 if admin is not verified", async () => {
      (verifyAdmin as jest.Mock).mockResolvedValue(
        NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      );

      const req = {} as NextRequest;
      const res = await PATCH(req, { params: { id: "1" } });

      expect(res.status).toBe(401);
    });

    it("should return 500 on database error", async () => {
      (verifyAdmin as jest.Mock).mockResolvedValue(true);
      (updateYeast as jest.Mock).mockRejectedValue(new Error("Database error"));

      const req = {
        json: async () => ({ name: "Updated Yeast" }),
      } as NextRequest;

      const res = await PATCH(req, { params: { id: "1" } });

      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({
        error: "Database error",
      });
    });
  });

  describe("DELETE", () => {
    it("should delete yeast when admin is verified", async () => {
      (verifyAdmin as jest.Mock).mockResolvedValue(true);
      const mockDeletedYeast = { id: 1, name: "EC-1118" };
      (deleteYeast as jest.Mock).mockResolvedValue(mockDeletedYeast);

      const req = {} as NextRequest;
      const res = await DELETE(req, { params: { id: "1" } });

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({
        message: "EC-1118 has been deleted.",
      });
      expect(deleteYeast).toHaveBeenCalledWith("1");
    });

    it("should return 401 if admin is not verified", async () => {
      (verifyAdmin as jest.Mock).mockResolvedValue(
        NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      );

      const req = {} as NextRequest;
      const res = await DELETE(req, { params: { id: "1" } });

      expect(res.status).toBe(401);
    });

    it("should return 500 on database error", async () => {
      (verifyAdmin as jest.Mock).mockResolvedValue(true);
      (deleteYeast as jest.Mock).mockRejectedValue(new Error("Database error"));

      const req = {} as NextRequest;
      const res = await DELETE(req, { params: { id: "1" } });

      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({
        error: "Database error",
      });
    });
  });
});
