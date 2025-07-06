// hooks/useShapeGenerator.js - Custom hook for shape generation
import { useSession } from "next-auth/react";
import { useState, useCallback } from "react";
import { uuid } from "uuidv4";
import { Session } from "../main-canvas/[roomId]/page";

export const generateShapes = async (
  setIsGenrating: any,
  socket: any,
  send: any,
  roomId: any,
  prompt: any,
  pointer: any
) => {
  setIsGenrating(true);

  try {
    const endpoint = `${process.env.NEXT_PUBLIC_LLM_URL}`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_LLM_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistralai/mistral-small-3.2-24b-instruct:free",
        messages: [
          {
            role: "user",
            content:
              prompt +
              ` in React-konva at position x=${pointer.x}, y=${pointer.y} shapes only and Return only valid JSON arrays. No markdown, no explanations, no additional text.`,
          },
        ],
      }),
    });

    const data = await response.json();

    console.log("data ai", data);

    if (!response.ok) {
      throw new Error(data.error || "Failed to generate shape");
    }
    const stringShape = data.choices[0].message.content;
    const cleanedStr = stringShape
      .replace(/```json\s*/g, "")
      .replace(/```\s*$/g, "")
      .trim();

    const newShapes = JSON.parse(cleanedStr);
    newShapes.map((shape: any) => (shape.id = uuid()));
    console.log("send");
    newShapes.map((shape: any) => send(socket, shape, roomId));
  } catch (err) {
    // setError(err.message);
  } finally {
    setIsGenrating(false);
  }
};
