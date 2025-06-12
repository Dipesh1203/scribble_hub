"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ChatRoom from "../../../components/ChatRoom";
import { BACKEND_URL } from "@repo/common/server";

const ChatRoom1 = ({ params }: { params: { slug: string } }) => {
  const [roomId, setRoomId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRoom() {
      try {
        console.log("Fetching room for slug:", params.slug);
        const response = await axios.get(
          `${BACKEND_URL}/api/room/${params.slug}`
        );
        setRoomId(response.data?.room?.id);
      } catch (error) {
        console.error("Error fetching room:", error);
      }
    }

    fetchRoom();
  }, [params.slug]);

  if (!roomId) return <div>Loading...</div>;

  return <> </>;
};

export default ChatRoom1;
