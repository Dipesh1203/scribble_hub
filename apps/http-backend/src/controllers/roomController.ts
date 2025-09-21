import { Request, Response } from "express";
import { CreateRoomSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import { generateRoomID } from "../utils/helper";

export const createRoom = async (req: Request, res: Response) => {
  // @ts-ignore: TODO: Fix this
  const userId = req.userId;

  try {
    const newRoomId = generateRoomID();
    const room = await prismaClient.room.create({
      data: {
        slug: newRoomId,
        adminId: userId,
      },
    });

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

export const getUserRooms = async (req: Request, res: Response) => {
  try {
    // @ts-ignore: TODO: Fix this
    const userId = req.userId;

    const rooms = await prismaClient.room.findMany({
      where: {
        adminId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      rooms,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user rooms",
    });
  }
};
