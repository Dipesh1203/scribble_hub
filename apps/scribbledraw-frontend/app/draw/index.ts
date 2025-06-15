import { BACKEND_URL } from "@repo/common/server";
import axios from "axios";

type Shape =
  | { type: "rect"; x: number; y: number; width: number; height: number }
  | { type: "circle"; centerX: number; centerY: number; radius: number };

export async function initDraw(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket,
  zoom: number
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
        clearCanvas(existingShape, canvas, ctx, zoom);
      } catch (error) {
        console.error("Error parsing incoming shape data:", error);
      }
    }
  };

  clearCanvas(existingShape, canvas, ctx, zoom);

  let clicked = false;
  let startX = 0;
  let startY = 0;

  canvas.addEventListener("mousedown", (e) => {
    clicked = true;
    startX = e.clientX;
    startY = e.clientY;
    console.log(e.clientX);
    console.log(e.clientY);
  });

  canvas.addEventListener("mouseup", (e) => {
    clicked = false;
    const width = e.clientX - startX;
    const height = e.clientY - startY;
    const shape: Shape = {
      type: "rect",
      x: startX,
      y: startY,
      width,
      height,
    };
    existingShape.push(shape);
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
      const width = e.clientX - startX;
      const height = e.clientY - startY;
      clearCanvas(existingShape, canvas, ctx, zoom);
      ctx.strokeStyle = "rgba(255,255,255)";
      ctx.strokeRect(startX, startY, width, height);
    }
  });
}

function clearCanvas(
  existingShape: Shape[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  zoom: number
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.scale(zoom, zoom);
  ctx.fillStyle = "rgba(18,18,18)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  existingShape.map((shape) => {
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
