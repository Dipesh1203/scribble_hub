"use client";
import { useEffect, useRef, useState } from "react";
import { WS_BACKEND } from "@/config";
import { Canvas } from "./Canvas";

export function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>();

  useEffect(() => {
    const ws = new WebSocket(
      `${WS_BACKEND}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiOTY3YWZmNy0yNTY4LTQ5OTUtYjQ1Ny1kNTFiODQwYjlhMWQiLCJpYXQiOjE3NDI0MTA1OTZ9.MCxZ34-iMznxnfZC8c4uSqRM5FmJYMXOYcvuLVaWKcU`
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
