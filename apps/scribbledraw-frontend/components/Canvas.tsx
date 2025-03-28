import { initDraw } from "@/app/draw";
import { useEffect, useRef, useState } from "react";

export function Canvas({
  roomId,
  socket,
}: {
  socket: WebSocket;
  roomId: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    console.log("room joined");
    if (canvasRef.current) {
      initDraw(canvasRef.current, roomId, socket);
    }
  }, [canvasRef]);

  return <canvas ref={canvasRef} width={1080} height={720}></canvas>;
}
