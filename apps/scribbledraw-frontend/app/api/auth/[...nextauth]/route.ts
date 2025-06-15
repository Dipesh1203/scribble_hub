import { authOptions } from "./options";
import NextAuth from "next-auth/next";
// import bcrypt from "bcrypt";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
