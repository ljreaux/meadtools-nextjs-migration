import { DELETE, PATCH } from "@/app/api/ingredients/[id]/route";
import { verifyAdmin } from "@/lib/userAccessFunctions";
import { deleteIngredient, updateIngredient } from "@/lib/db/ingredients";
import { createRequest, createResponse } from "node-mocks-http";
import { NextResponse } from "next/server";

jest.mock("@/lib/userAccessFunctions");
jest.mock("@/lib/db/ingredients");

describe("/api/ingredients/[id]", () => {
  describe("PATCH", () => {
    it("should update an ingredient when admin is verified", async () => {
      (verifyAdmin as jest.Mock).mockResolvedValue(true);
      (updateIngredient as jest.Mock).mockResolvedValue({
        id: 1,
        name: "Updated Ingredient",
      });

      const req = createRequest({
        method: "PATCH",
        url: "http://localhost/api/ingredients/1",
        params: { id: "1" },
        body: { name: "Updated Ingredient" },
      });

      req.json = jest.fn().mockResolvedValue({ name: "Updated Ingredient" });

      const res = await PATCH(req as any, { params: { id: "1" } });

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({
        id: 1,
        name: "Updated Ingredient",
      });
    });

    it("should return a 401 error when admin is not verified", async () => {
      (verifyAdmin as jest.Mock).mockResolvedValue(
        NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      );

      const req = createRequest({
        method: "PATCH",
        url: "http://localhost/api/ingredients/1",
        params: { id: "1" },
      });

      const res = await PATCH(req as any, { params: { id: "1" } });

      expect(res.status).toBe(401);
      expect(await res.json()).toEqual({ error: "Unauthorized" });
    });

    it("should return a 500 error on database failure", async () => {
      (verifyAdmin as jest.Mock).mockResolvedValue(true);
      (updateIngredient as jest.Mock).mockRejectedValue(
        new Error("Database failure")
      );

      const req = createRequest({
        method: "PATCH",
        url: "http://localhost/api/ingredients/1",
        params: { id: "1" },
        body: { name: "Updated Ingredient" },
      });

      req.json = jest.fn().mockResolvedValue({ name: "Updated Ingredient" });

      const res = await PATCH(req as any, { params: { id: "1" } });

      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({
        error: "Database failure",
      });
    });
  });

  describe("DELETE", () => {
    it("should delete an ingredient when admin is verified", async () => {
      (verifyAdmin as jest.Mock).mockResolvedValue(true);
      (deleteIngredient as jest.Mock).mockResolvedValue({
        id: 1,
        name: "Deleted Ingredient",
      });

      const req = createRequest({
        method: "DELETE",
        url: "http://localhost/api/ingredients/1",
        params: { id: "1" },
      });

      const res = await DELETE(req as any, { params: { id: "1" } });

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({
        message: "Deleted Ingredient has been deleted",
      });
    });

    it("should return a 401 error when admin is not verified", async () => {
      (verifyAdmin as jest.Mock).mockResolvedValue(
        NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      );

      const req = createRequest({
        method: "DELETE",
        url: "http://localhost/api/ingredients/1",
        params: { id: "1" },
      });

      const res = await DELETE(req as any, { params: { id: "1" } });

      expect(res.status).toBe(401);
      expect(await res.json()).toEqual({ error: "Unauthorized" });
    });

    it("should return a 500 error on database failure", async () => {
      (verifyAdmin as jest.Mock).mockResolvedValue(true);
      (deleteIngredient as jest.Mock).mockRejectedValue(
        new Error("Database failure")
      );

      const req = createRequest({
        method: "DELETE",
        url: "http://localhost/api/ingredients/1",
        params: { id: "1" },
      });

      const res = await DELETE(req as any, { params: { id: "1" } });

      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({
        error: "Database failure",
      });
    });
  });
});
