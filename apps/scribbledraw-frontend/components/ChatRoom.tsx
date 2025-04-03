"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { ChatRoomClient } from "./ChatRoomClient";
import { BACKEND_URL } from "@repo/common/server";

const ChatRoom = ({ id }: { id: string }) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChats() {
      try {
        console.log("Fetching messages for room:", id);
        const response = await axios.get(`${BACKEND_URL}/api/chats/${id}`);
        setMessages(response.data.messages);
      } catch (error) {
        console.error("Error fetching chats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchChats();
  }, [id]);

  if (loading) return <div>Loading messages...</div>;

  return <ChatRoomClient id={id} messages={messages} />;
};

export default ChatRoom;
