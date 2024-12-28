import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: string;
    };
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
      // Check if the user already exists in the database
      const existingUser = await prisma.users.findUnique({
        where: { email: user.email },
      });

      if (existingUser) {
        // If Google login, ensure google_id is updated
        if (account?.provider === "google" && !existingUser.google_id) {
          await prisma.users.update({
            where: { email: user.email },
            data: { google_id: profile?.sub },
          });
        }
        return true; // Allow sign-in
      }

      // Optionally: Reject users not in the database
      return false; // Prevent sign-in if the user doesn't exist
    },
    async session({ session, token }) {
      // Include additional user fields in the session
      if (token) {
        session.user = {
          id: token.id,
          email: token.email,
          role: token.role,
        };
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        // Add user details to the token
        token.id = user.id;
        token.email = user.email;
        token.role = user.role || "user";
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt", // Use JWTs for session management
  },
};

// Use the NextAuth function for both GET and POST
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
