import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {
  CreateUserSchema,
  SigninSchema,
  CreateRoomSchema,
} from "@repo/common/types";
import { JWT_SECRET } from "@repo/backend-common/config";
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
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials: { username: string; password: string } | undefined
      ): Promise<any> {
        try {
          console.log(BACKEND_URL);
          console.log("credentials ", credentials);
          const res = await fetch(`${BACKEND_URL}/api/signin`, {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" },
          });
          const user = await res.json();

          if (!res.ok || !user) {
            return null;
            // throw new Error("No user found Authentication failed");
          }
          return user;
        } catch (error: any) {
          console.log("eadsfasdfas");
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
      console.log("sign 1   ");
      console.log(user);
      console.log(credentials);
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
      console.log("jwt jwt 1");
      console.log(user);
      console.log("jwt jwt");
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      console.log("jwt jwt 2");
      console.log(token);
      console.log(session);
      console.log("jwt jwt");
      if (token) {
        session.token = token.jti;
        session.iat = token.iat;
        session.exp = token.exp;
      }
      console.log(session);
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: JWT_SECRET || "Dipesh",
};
