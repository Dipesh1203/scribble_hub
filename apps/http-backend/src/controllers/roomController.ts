import { Request, Response } from "express";
import { CreateRoomResponse, GetRoomResponse, ErrorResponse } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import { generateRoomID } from "../utils/helper";
import { AuthRequest } from "../types";

export const createRoom = async (req: AuthRequest, res: Response<CreateRoomResponse | ErrorResponse>) => {
  const userId = req.userId;
  
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

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
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(411).json({
      message: "Room already exists with this name",
    });
  }
};

export const getRoomBySlug = async (req: Request, res: Response<GetRoomResponse>) => {
  const slug = req.params.slug;
  const room = await prismaClient.room.findFirst({ where: { slug } });
  res.json({ room });
};
