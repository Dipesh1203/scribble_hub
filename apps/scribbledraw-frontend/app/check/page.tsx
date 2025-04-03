"use client";

import { useSession } from "next-auth/react";
import { Session } from "../api/auth/[...nextauth]/options";

export default function Page() {
  const { data, status } = useSession();
  const session = data as Session;
  return (
    <div>
      {session ? (
        <p>Welcome, {session?.user?.name}</p> // Displaying user's name
      ) : (
        <p>No user logged in</p>
      )}
      {session && session?.token}
    </div>
  );
}
