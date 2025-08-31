import { Request, Response } from "express";
import { prismaClient } from "@repo/db/client";
import { GetChatsResponse } from "@repo/common/types";

export const getChatsByRoomId = async (req: Request, res: Response<GetChatsResponse>) => {
  try {
    const roomId = Number(req.params.roomId);
    const messages = await prismaClient.chat.findMany({
      where: { roomId },
      orderBy: { id: "desc" },
      take: 1000,
    });
    res.json({ messages });
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.json({ messages: [] });
  }
};
