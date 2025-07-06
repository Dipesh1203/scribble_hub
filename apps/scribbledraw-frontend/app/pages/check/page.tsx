"use client";
import { useSession } from "next-auth/react";
import React from "react";

const page = () => {
  const { data: session, status } = useSession();

  if (status === "authenticated") {
    return <p>Signed in as {session.expires}</p>;
  }

  return <a href="/signin">Sign in</a>;
};

export default page;
