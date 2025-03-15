import React from "react";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import ChatRoom from "../../../components/ChatRoom";

async function getRoom(slug: string) {
  console.log("slug ", slug);
  const response = await axios.get(`${BACKEND_URL}/room/${slug}`);
  console.log("id ", response.data);
  return response.data.room.id;
}

const ChatRoom1 = async ({ params }: { params: { slug: string } }) => {
  const parsedParams = await params;
  console.log(parsedParams);
  const roomId = await getRoom(parsedParams.slug);
  return <ChatRoom id={roomId} />;
};

export default ChatRoom1;
