import { Request, Response } from "express";
import { CreateRoomSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import { generateRoomID } from "../utils/helper";

export const createRoom = async (req: Request, res: Response) => {
  // @ts-ignore: TODO: Fix this
  const userId = req.userId;
  console.log("===============");

  try {
    const newRoomId = generateRoomID();
    console.log(newRoomId + " ===========");
    const room = await prismaClient.room.create({
      data: {
        slug: newRoomId,
        adminId: userId,
      },
    });
    console.log(room);

    res.json({
      roomId: room.slug,
    });
  } catch (e) {
    res.status(411).json({
      message: "Room already exists with this name",
    });
  }
};

export const getRoomBySlug = async (req: Request, res: Response) => {
  const slug = req.params.slug;
  const room = await prismaClient.room.findFirst({ where: { slug } });
  res.json({ room });
};
