import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";

// Extend Session and JWT types for TypeScript
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: string;
    };
    accessToken?: string; // Add accessToken to the session
  }

  interface User {
    id: string;
    email: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    role: string;
    accessToken?: string; // Add accessToken to the JWT
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("signIn callback:", { user, account, profile });

      const existingUser = await prisma.users.findUnique({
        where: { email: user.email },
      });

      console.log("Existing user from DB:", existingUser);

      if (existingUser) {
        if (account?.provider === "google" && !existingUser.google_id) {
          console.log("Updating google_id...");
          await prisma.users.update({
            where: { email: user.email },
            data: { google_id: profile?.sub },
          });
        }
        return true; // Allow sign-in
      }
      return false; // Reject sign-in if user does not exist
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          email: token.email,
          role: token.role || "user",
        };
        session.accessToken = token.accessToken; // Attach the accessToken
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role || "user";
      }

      if (account?.access_token) {
        token.accessToken = account.access_token; // Store access token from provider
      }

      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt", // Use JWTs for session management
  },
};
