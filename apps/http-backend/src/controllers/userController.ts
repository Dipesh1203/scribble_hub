import { Response } from "express";
import { prismaClient } from "@repo/db/client";
import { UserRoomInfo, ErrorResponse } from "@repo/common/types";
import { AuthRequest } from "../types";

export const getUserRoomInfo = async (req: AuthRequest, res: Response<UserRoomInfo | ErrorResponse>) => {
  const userId = req.userId;
  
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    // Get user's current active room (if any)
    const userRooms = await prismaClient.room.findMany({
      where: { adminId: userId },
      orderBy: { updatedAt: "desc" },
      take: 5, // Get recent 5 rooms
    });

    // For now, consider the most recently updated room as current room
    const currentRoom = userRooms[0] || undefined;
    const lastJoinedRoom = userRooms[1] || undefined;

    res.json({
      currentRoom,
      lastJoinedRoom,
      recentRooms: userRooms,
    });
  } catch (error) {
    console.error("Error fetching user room info:", error);
    res.status(500).json({
      message: "Failed to fetch user room information",
    });
  }
};

export const joinRoom = async (req: AuthRequest, res: Response<{ success: boolean } | ErrorResponse>) => {
  const userId = req.userId;
  const { roomId } = req.body;
  
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  if (!roomId) {
    res.status(400).json({ message: "Room ID is required" });
    return;
  }

  try {
    // Check if room exists
    const room = await prismaClient.room.findUnique({
      where: { id: Number(roomId) },
    });

    if (!room) {
      res.status(404).json({ message: "Room not found" });
      return;
    }

    // Update the room's updatedAt to track last access
    await prismaClient.room.update({
      where: { id: Number(roomId) },
      data: { updatedAt: new Date() },
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Error joining room:", error);
    res.status(500).json({
      message: "Failed to join room",
    });
  }
};