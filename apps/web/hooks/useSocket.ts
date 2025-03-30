import { useEffect, useState } from "react";
import { WS_URL } from "../app/config";

export function useSocket() {
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<WebSocket>();
  useEffect(() => {
    const ws = new WebSocket(
      `${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZDFkYjRmNi1kN2Y4LTQxMmUtYmIyNi0zOWQ4ZDlhY2NkMjEiLCJpYXQiOjE3NDE5ODIyODd9.lkMszvZ9sDQwn6Fne4gUhU_OQL1QnP2Se7vP_MCfjqY`
    );
    ws.onopen = () => {
      setLoading(false);
      setSocket(ws);
    };
  }, []);
  return { socket, loading };
}
