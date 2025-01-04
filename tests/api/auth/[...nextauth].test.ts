import { NextAuthOptions, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import prisma from "@/lib/prisma";

// Save the original environment variables
const originalEnv = process.env;

// Mock environment variables before importing the module that uses them
const mockEnv = {
  GOOGLE_CLIENT_ID: "mock-google-client-id",
  GOOGLE_CLIENT_SECRET: "mock-google-client-secret",
  NEXTAUTH_SECRET: "mock-nextauth-secret",
};

// Mock the prisma module at the top to ensure it's applied before any usage
jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    users: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

beforeAll(() => {
  // Set up the mock environment variables before importing the module that uses them
  process.env = { ...originalEnv, ...mockEnv };

  // Clear Jest's module cache to ensure the environment variables are picked up correctly
  jest.resetModules();
});

afterAll(() => {
  // Restore the original environment after the tests
  process.env = originalEnv;
});

describe("NextAuth Configuration", () => {
  let authOptions: NextAuthOptions;

  beforeAll(() => {
    // Import the NextAuth options after mocking the environment variables
    authOptions = require("@/app/api/auth/[...nextauth]/route").authOptions;

    // Log to confirm when Prisma is correctly imported
    console.log("Prisma Mock Applied:", prisma);

    // Mock `findUnique` and `update` methods of Prisma
    const findUniqueMock = prisma.users.findUnique as jest.Mock;
    const updateMock = prisma.users.update as jest.Mock;

    findUniqueMock.mockImplementation((args) => {
      if (args.where.email === "test@example.com") {
        return Promise.resolve({ email: "test@example.com", google_id: null });
      }
      return Promise.resolve(null); // Handle case for non-existing user
    });

    updateMock.mockImplementation((args) => {
      if (args.where.email === "test@example.com") {
        return Promise.resolve({
          email: "test@example.com",
          google_id: "google-123",
        });
      }
      return Promise.reject(new Error("User not found"));
    });
  });

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("should have correct basic configuration", () => {
    expect(authOptions.adapter).toBeDefined();
    expect(authOptions.providers).toHaveLength(1);
    expect(authOptions.secret).toBe("mock-nextauth-secret");
    expect(authOptions.session?.strategy).toBe("jwt");
  });

  it("should have Google provider configured correctly", () => {
    const googleProvider = authOptions.providers[0];
    expect(googleProvider.id).toBe("google");
    expect(googleProvider.name).toBe("Google");
    expect(googleProvider.options).toBeDefined();
    expect(googleProvider.options.clientId).toBe("mock-google-client-id");
    expect(googleProvider.options.clientSecret).toBe(
      "mock-google-client-secret"
    );
    expect(googleProvider.options.authorization.params.prompt).toBe(
      "select_account"
    );
  });

  // describe("signIn callback", () => {
  //   const mockUser = { email: "test@example.com" };
  //   const mockAccount = { provider: "google" };
  //   const mockProfile = { sub: "google-123" };

  //   it("should allow sign-in for existing user", async () => {
  //     // Call the signIn callback
  //     const result = await authOptions.callbacks!.signIn!({
  //       user: mockUser,
  //       account: mockAccount,
  //       profile: mockProfile,
  //     } as any);

  //     // Ensure result is true (user should be allowed to sign in)
  //     expect(result).toBe(true);

  //     // Ensure findUnique was called with the correct email
  //     expect(prisma.users.findUnique).toHaveBeenCalledWith({
  //       where: { email: "test@example.com" },
  //     });

  //     // Ensure update was called with the correct data
  //     expect(prisma.users.update).toHaveBeenCalledWith({
  //       where: { email: "test@example.com" },
  //       data: { google_id: "google-123" },
  //     });
  //   });

  //   it("should reject sign-in for non-existing user", async () => {
  //     // Mock findUnique to return null (user does not exist)
  //     const findUniqueMock = prisma.users.findUnique as jest.Mock;
  //     findUniqueMock.mockResolvedValueOnce(null);

  //     // Call the signIn callback
  //     const result = await authOptions.callbacks!.signIn!({
  //       user: mockUser,
  //       account: mockAccount,
  //       profile: mockProfile,
  //     } as any);

  //     // Ensure result is false (non-existing users should be rejected)
  //     expect(result).toBe(false);
  //   });
  // });

  describe("session callback", () => {
    it("should add user data to session from token", async () => {
      const mockToken = {
        id: "user-123",
        email: "test@example.com",
        role: "admin",
      };
      const mockSession: CustomSession = {
        user: { id: "", email: "", role: "" },
        expires: "",
      };

      const result = await authOptions.callbacks!.session!({
        session: mockSession,
        token: mockToken,
      } as any);

      expect(result.user).toEqual({
        id: "user-123",
        email: "test@example.com",
        role: "admin",
      });
    });

    it('should set default role as "user" if not provided', async () => {
      const mockToken = {
        id: "user-123",
        email: "test@example.com",
      };
      const mockSession: CustomSession = {
        user: { id: "", email: "", role: "" },
        expires: "",
      };

      const result = (await authOptions.callbacks!.session!({
        session: mockSession,
        token: mockToken,
      } as any)) as CustomSession;

      expect(result.user.role).toBe("user");
    });
  });

  describe("jwt callback", () => {
    it("should add user data to token", async () => {
      const mockUser = {
        id: "user-123",
        email: "test@example.com",
        role: "admin",
      };
      const mockToken = {} as JWT;

      const result = await authOptions.callbacks!.jwt!({
        token: mockToken,
        user: mockUser,
      } as any);

      expect(result).toEqual({
        id: "user-123",
        email: "test@example.com",
        role: "admin",
      });
    });

    it('should set default role as "user" if not provided', async () => {
      const mockUser = {
        id: "user-123",
        email: "test@example.com",
      };
      const mockToken = {} as JWT;

      const result = await authOptions.callbacks!.jwt!({
        token: mockToken,
        user: mockUser,
      } as any);

      expect(result.role).toBe("user");
    });

    it("should return unchanged token when no user is provided", async () => {
      const mockToken = {
        id: "existing-123",
        email: "existing@example.com",
        role: "existing-role",
      } as JWT;

      const result = await authOptions.callbacks!.jwt!({
        token: mockToken,
      } as any);

      expect(result).toEqual(mockToken);
    });
  });
});

// Define the custom session type to match your route.ts declarations
interface CustomSession extends Session {
  user: {
    id: string;
    email: string;
    role: string;
  };
}
