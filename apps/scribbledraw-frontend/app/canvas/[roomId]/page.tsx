"use client";
import { initDraw } from "@/app/draw";
import { useEffect, useRef } from "react";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      initDraw(canvasRef.current);
    }
  }, [canvasRef]);

  return <canvas ref={canvasRef} width={1080} height={720}></canvas>;
}
