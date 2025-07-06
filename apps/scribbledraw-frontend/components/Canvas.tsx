// import { initDraw } from "@/app/draw";
// import { useWindowSize } from "@/app/hooks/useWindowSize";
// import { useEffect, useRef, useState } from "react";

// export function Canvas({
//   roomId,
//   socket,
// }: {
//   socket: WebSocket;
//   roomId: string;
// }) {
//   const { width, height } = useWindowSize();
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [zoom, setZoom] = useState(1);
//   const [offset, setOffset] = useState({ x: 0, y: 0 });
//   const [canvasWidth, setCanvasWidth] = useState(width);
//   const [canvasHeight, setCanvasHeight] = useState(height);

//   const handleZoom = (delta: number) => {
//     setZoom((prevZoom) => {
//       console.log(prevZoom);
//       let newZoom = prevZoom + delta;
//       return Math.min(Math.max(newZoom, 0.5), 2); // Limit zoom between 0.5x and 3x
//     });
//   };

//   useEffect(() => {
//     console.log("room joined");
//     if (canvasRef.current) {
//       initDraw(canvasRef.current, roomId, socket, zoom, offset);
//     }
//   }, [canvasRef, zoom, canvasHeight, canvasWidth]);

//   useEffect(() => {
//     function handleResize() {
//       setCanvasWidth(window.innerWidth);
//       setCanvasHeight(window.innerHeight);
//       // Your resize logic here
//       console.log("Window resized:", window.innerWidth, window.innerHeight);
//     }

//     window.addEventListener("resize", handleResize);

//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);

//   const handleWheel = (event: WheelEvent) => {
//     event.preventDefault();
//     if (!canvasRef.current) return;

//     const rect = canvasRef.current.getBoundingClientRect();
//     const mouseX = event.clientX - rect.left;
//     const mouseY = event.clientY - rect.top;

//     const zoomFactor = event.deltaY < 0 ? 1.1 : 0.9;
//     const newZoom = Math.min(Math.max(zoom * zoomFactor, 0.5), 3);

//     // Calculate the world (unzoomed) coordinates under the mouse
//     const wx = (mouseX - offset.x) / zoom;
//     const wy = (mouseY - offset.y) / zoom;

//     // Calculate new offset so the world point under the mouse stays under the mouse
//     const newOffset = {
//       x: mouseX - wx * newZoom,
//       y: mouseY - wy * newZoom,
//     };

//     setZoom(newZoom);
//     setOffset(newOffset);
//   };

//   useEffect(() => {
//     const canvas = canvasRef.current as HTMLCanvasElement;
//     if (canvas) {
//       canvas.addEventListener("wheel", handleWheel);
//     }
//     return () => {
//       if (canvas) {
//         canvas.removeEventListener("wheel", handleWheel);
//       }
//     };
//   }, []);

//   return (
//     <div className="relative">
//       {/* Canvas */}
//       {/* <Stage></Stage> */}
//       <canvas
//         ref={canvasRef}
//         width={width}
//         height={height}
//         className="border border-gray-300"
//       ></canvas>

//       {/* Zoom Controls */}
//       <div className="mt-4 space-x-4">
//         <button
//           onClick={() => handleZoom(0.1)}
//           className="mx-30 px-4 py-2 bg-blue-500 text-white rounded"
//         >
//           Zoom In (+)
//         </button>
//         <button
//           onClick={() => handleZoom(-0.1)}
//           className="px-4 py-2 bg-red-500 text-white rounded"
//         >
//           Zoom Out (-)
//         </button>
//       </div>
//     </div>
//   );
// }
