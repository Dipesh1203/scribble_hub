import { Request, Response } from "express";
import { CreateRoomSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";

export const createRoom = async (req: Request, res: Response) => {
  const parsedData = CreateRoomSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({ message: "Incorrect inputs" });
    return;
  }
  // @ts-ignore: TODO: Fix this
  const userId = req.userId;
  try {
    const room = await prismaClient.room.create({
      data: { slug: parsedData.data.name, adminId: userId },
    });
    res.json({ roomId: room.id });
  } catch (e) {
    res.status(411).json({ message: "Room already exists with this name" });
  }
};

export const getRoomBySlug = async (req: Request, res: Response) => {
  const slug = req.params.slug;
  const room = await prismaClient.room.findFirst({ where: { slug } });
  res.json({ room });
};
