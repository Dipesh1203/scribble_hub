"use client";

import { useSession } from "next-auth/react";

export default function Page() {
  const { data: session, status } = useSession();

  return (
    <div>
      {session ? (
        <p>Welcome, {session?.user?.name}</p> // Displaying user's name
      ) : (
        <p>No user logged in</p>
      )}
    </div>
  );
}
