import { GET, POST } from "@/app/api/auth/[...nextauth]/route";
import { createRequest, createResponse } from "node-mocks-http";

jest.mock("next-auth", () => ({
  __esModule: true,
  default: jest.fn(() => async (req: any, res: any) => {
    res.end();
  }),
}));

jest.mock("@/lib/prisma", () => ({
  users: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
}));

describe("/api/auth/[...nextauth]", () => {
  it("should handle GET requests", async () => {
    const req = createRequest({ method: "GET" });
    const res = createResponse();

    await GET(req as any, res as any);

    expect(res.statusCode).toBe(200);
  });

  it("should handle POST requests", async () => {
    const req = createRequest({ method: "POST" });
    const res = createResponse();

    await POST(req as any, res as any);

    expect(res.statusCode).toBe(200);
  });
});
