import { BACKEND_URL } from "@repo/common/server";
import axios from "axios";

type Shape =
  | { type: "rect"; x: number; y: number; width: number; height: number }
  | { type: "circle"; centerX: number; centerY: number; radius: number };

export async function initDraw(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket,
  zoom: number = 1,
  offset: { x: number; y: number } = { x: 0, y: 0 }
) {
  let existingShape: Shape[] = await getExistingShapes(roomId);

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);

    if (message.type === "chat") {
      try {
        const parsedShape: Shape = JSON.parse(message.message).shape;
        existingShape.push(parsedShape);
        clearCanvas(existingShape, canvas, ctx, zoom, offset);
      } catch (error) {
        console.error("Error parsing incoming shape data:", error);
      }
    }
  };

  clearCanvas(existingShape, canvas, ctx, zoom, offset);

  let clicked = false;
  let startX = 0;
  let startY = 0;

  function getCanvasCoords(e: MouseEvent) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left - offset.x) / zoom,
      y: (e.clientY - rect.top - offset.y) / zoom,
    };
  }

  canvas.addEventListener("mousedown", (e) => {
    clicked = true;
    const coords = getCanvasCoords(e);
    // startX = coords.x;
    // startY = coords.y;
    startX = e.clientX;
    startY = e.clientY;
    console.log(coords.x, coords.y);
  });

  canvas.addEventListener("mouseup", (e) => {
    clicked = false;
    const coords = getCanvasCoords(e);
    // const width = coords.x - startX;
    // const height = coords.y - startY;
    const width = e.clientX - startX;
    const height = e.clientY - startY;
    const shape: Shape = {
      type: "rect",
      x: startX,
      y: startY,
      width,
      height,
    };
    // Don't push here, let socket handle it
    socket.send(
      JSON.stringify({
        type: "chat",
        roomId,
        message: JSON.stringify({ shape }),
      })
    );
  });

  canvas.addEventListener("mousemove", (e) => {
    if (clicked) {
      const coords = getCanvasCoords(e);
      const width = coords.x - startX;
      const height = coords.y - startY;
      clearCanvas(existingShape, canvas, ctx, zoom, offset);
      ctx.strokeStyle = "rgba(255,255,255)";
      ctx.strokeRect(startX, startY, width, height);
    }
  });
}

function clearCanvas(
  existingShape: Shape[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  zoom: number = 1,
  offset: { x: number; y: number } = { x: 0, y: 0 }
) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.setTransform(zoom, 0, 0, zoom, offset.x, offset.y); // Apply zoom and offset
  ctx.fillStyle = "rgba(18,18,18)";
  ctx.fillRect(0, 0, canvas.width / zoom, canvas.height / zoom);
  existingShape.forEach((shape) => {
    if (shape.type == "rect") {
      ctx.strokeStyle = "rgba(255,255,255)";
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    }
  });
}

async function getExistingShapes(roomId: string) {
  const res = await axios.get(`${BACKEND_URL}/api/chats/${roomId}`);

  const data = res.data.messages;
  const shapes = data
    .map((x: { message: string }) => {
      try {
        return JSON.parse(x.message).shape; // Correctly parsing shapes
      } catch (error) {
        console.error("Invalid shape data:", x.message);
        return null;
      }
    })
    .filter(Boolean); // Remove invalid entries
  return shapes;
}
