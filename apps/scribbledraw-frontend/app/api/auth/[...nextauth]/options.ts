import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {
  CreateUserSchema,
  SigninSchema,
  CreateRoomSchema,
} from "@repo/common/types";
import { BACKEND_URL } from "@repo/common/server";

interface userType {
  id: string;
  name: string;
  email: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        username: { label: "Email", type: "email", placeholder: "Email" },
        name: { label: "Name", type: "text", placeholder: "Name" },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials:
          | { name: string; username: string; password: string }
          | undefined
      ): Promise<any> {
        try {
          const res = await fetch(`${BACKEND_URL}/api/signup`, {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" },
          });
          const user = await res.json();

          if (!res.ok || !user) {
            throw new Error("No user found Authentication failed");
          }
          return user;
        } catch (error: any) {
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, credentials }) {
      const res = await fetch(`${BACKEND_URL}/api/signin`, {
        method: "GET",
        body: JSON.stringify(credentials),
        headers: { "Content-Type": "application/json" },
      });
      const userData = await res.json();
      if (userData) {
        user.id = userData.userId;
        user.name = userData.name;
        user.email = userData.username;
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.token.id = token.id;
        session.token.name = token.name;
        session.token.email = token.email;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
