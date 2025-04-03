import { initDraw } from "@/app/draw";
import { useWindowSize } from "@/app/hooks/useWindowSize";
import { useEffect, useRef, useState } from "react";

export function Canvas({
  roomId,
  socket,
}: {
  socket: WebSocket;
  roomId: string;
}) {
  const { width, height } = useWindowSize();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const handleZoom = (delta: number) => {
    setZoom((prevZoom) => {
      let newZoom = prevZoom + delta;
      return Math.min(Math.max(newZoom, 0.5), 3); // Limit zoom between 0.5x and 3x
    });
  };
  useEffect(() => {
    console.log("room joined");
    if (canvasRef.current) {
      initDraw(canvasRef.current, roomId, socket, zoom);
    }
  }, [canvasRef, zoom]);

  // Handle zooming with mouse scroll
  const handleWheel = (event: WheelEvent) => {
    event.preventDefault();
    if (event.deltaY < 0) {
      handleZoom(0.1); // Zoom in
    } else {
      handleZoom(-0.1); // Zoom out
    }
  };

  // useEffect(() => {
  //   const canvas = canvasRef.current as HTMLCanvasElement;
  //   if (canvas) {
  //     canvas.addEventListener("wheel", handleWheel);
  //   }
  //   return () => {
  //     if (canvas) {
  //       canvas.removeEventListener("wheel", handleWheel);
  //     }
  //   };
  // }, []);

  return (
    <div className="relative">
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-gray-300"
      ></canvas>

      {/* Zoom Controls */}
      <div className="mt-4 space-x-4">
        <button
          onClick={() => handleZoom(0.1)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Zoom In (+)
        </button>
        <button
          onClick={() => handleZoom(-0.1)}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Zoom Out (-)
        </button>
      </div>
    </div>
  );
}
