"use client";
import { useEffect, useRef, useState } from "react";
import { Canvas } from "./Canvas";
import { useSession } from "next-auth/react";
import { WS_URL } from "@repo/common/server";
import { DefaultSession } from "next-auth";

export interface Session extends DefaultSession {
  user: {
    id: string;
  } & DefaultSession["user"];
  token?: string;
  iat?: number;
  exp?: number;
}

export function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>();
  const { data, status } = useSession();
  const session = data as Session;
  useEffect(() => {
    const ws = new WebSocket(
      `${WS_URL}?token=${(session && session?.token) || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiOTY3YWZmNy0yNTY4LTQ5OTUtYjQ1Ny1kNTFiODQwYjlhMWQiLCJpYXQiOjE3NDI0MTA1OTZ9.MCxZ34-iMznxnfZC8c4uSqRM5FmJYMXOYcvuLVaWKcU"}`
    );

    ws.onopen = () => {
      console.log("connect ws ..............");
      setSocket(ws);
      console.log("connect ws ..............");
      ws.send(
        JSON.stringify({
          type: "join_room",
          roomId,
        })
      );
    };
  }, []);

  if (!socket) {
    return <div>Connecting to Servers............</div>;
  }
  return (
    <div>
      <Canvas roomId={roomId} socket={socket} />
    </div>
  );
}
