import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";

// Ensure the typing for the callbacks is clear
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
      console.log("signIn callback:", { user, account, profile });

      const existingUser = await prisma.users.findUnique({
        where: { email: user.email },
      });

      console.log("Existing user from DB:", existingUser); // Log the fetched user

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
          role: token.role || "user", // Default to "user" if role is not set
        };
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role || "user"; // Ensure role is set
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
