import { DefaultSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {
  CreateUserSchema,
  SigninSchema,
  CreateRoomSchema,
} from "@repo/common/types";
import { BACKEND_URL, JWT_SECRET } from "@repo/common/server";

interface userType {
  id: string;
  name: string;
  email: string;
}
export interface Session extends DefaultSession {
  user: {
    id: string;
  } & DefaultSession["user"];
  token?: string;
  iat?: number;
  exp?: number;
}

interface JWT {
  id: string;
  jwt?: string;
  iat?: number;
  exp?: number;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        username: { label: "Email", type: "email", placeholder: "Email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials: { username: string; password: string } | undefined
      ): Promise<any> {
        try {
          const res = await fetch(`${BACKEND_URL}/api/signin`, {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" },
          });
          const user = await res.json();

          if (!res.ok || !user?.data?.token) {
            return null;
          }
          return user;
        } catch (error: any) {
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),
  ],
  pages: {
    signIn: "/api/auth/signin", // Custom Sign In Page
  },
  callbacks: {
    async signIn({ user, credentials }) {
      // @ts-ignore
      const userData = user.data.user;
      if (user) {
        user.id = userData.id;
        user.name = userData.name;
        user.email = userData.email;
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        // @ts-ignore
        token.jwt = user?.data?.token;
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.token = token.jwt;
        session.iat = token.iat;
        session.exp = token.exp;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: JWT_SECRET || "Dipesh",
};
