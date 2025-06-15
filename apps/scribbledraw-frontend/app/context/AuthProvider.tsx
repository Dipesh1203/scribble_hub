"use client";
import { SessionProvider, useSession } from "next-auth/react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // const { data: session, status } = useSession();
  return <SessionProvider>{children}</SessionProvider>;
}
