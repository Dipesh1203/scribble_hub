import { WS_URL } from "@repo/common/server";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Session } from "../api/auth/[...nextauth]/options";

export function useSocket() {
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<WebSocket>();
  const { data, status } = useSession();
  const session = data as Session;
  useEffect(() => {
    if (!session?.token) return;
    const ws = new WebSocket(`${WS_URL}?token=${session?.token}`);
    ws.onopen = () => {
      setLoading(false);
      setSocket(ws);
    };
  }, []);
  return { socket, loading };
}
