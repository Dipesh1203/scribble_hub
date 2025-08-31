import { DefaultSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT_SECRET } from "@repo/backend-common/config";
import { BACKEND_URL } from "@repo/common/server";
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
      ): Promise<AuthResponse | null> {
        try {
          console.log(BACKEND_URL);
          console.log("credentials ", credentials);
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
        } catch (error: unknown) {
          console.log("Authentication error");
          throw new Error((error as Error).message || "Authentication failed");
        }
      },
    }),
  ],
  pages: {
    signIn: "/api/auth/signin", // Custom Sign In Page
  },
  callbacks: {
    async signIn({ user }) {
      console.log("sign 1");
      console.log(user);
      const authUser = user as AuthResponse;
      const userData = authUser.data.user;
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
        const authUser = user as AuthResponse;
        token.jwt = authUser?.data?.token;
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      console.log(" token ", token);
      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session as Session).token = token.jwt as string;
        (session as Session).iat = token.iat;
        (session as Session).exp = token.exp;
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
