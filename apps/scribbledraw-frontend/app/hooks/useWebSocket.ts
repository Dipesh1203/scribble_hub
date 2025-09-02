import { useEffect, useState } from "react";
import { WS_URL } from "@repo/common/server";
import { Session } from "../main-canvas/[roomId]/page";

interface UseWebSocketProps {
  session: Session | null;
  roomId: string;
  onShapeReceived: (shape: any) => void;
}

export const useWebSocket = ({
  session,
  roomId,
  onShapeReceived,
}: UseWebSocketProps) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (!session?.token) return;

    const ws = new WebSocket(`${WS_URL}?token=${session.token}`);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "chat" && data.message?.shape) {
          onShapeReceived(data.message.shape);
        }
      } catch (err) {
        console.error("Invalid message from socket:", event.data);
      }
    };

    ws.onopen = () => {
      setSocket(ws);
      ws.send(
        JSON.stringify({
          type: "join_room",
          roomId,
        })
      );
    };

    return () => {
      ws.close();
    };
  }, [roomId, session, onShapeReceived]);

  const sendShape = (shape: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          type: "chat",
          roomId,
          message: { shape },
        })
      );
    }
  };

  return {
    socket,
    sendShape,
  };
};

export default useWebSocket;
