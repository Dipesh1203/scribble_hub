import { Request, Response } from "express";
import { prismaClient } from "@repo/db/client";

export const getChatsByRoomId = async (req: Request, res: Response) => {
  try {
    const roomId = Number(req.params.roomId);
    const messages = await prismaClient.chat.findMany({
      where: { roomId },
      orderBy: { id: "desc" },
      take: 1000,
    });
    res.json({ messages });
  } catch (e) {
    res.json({ messages: [] });
  }
};
