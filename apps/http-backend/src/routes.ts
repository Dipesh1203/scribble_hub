import express, { Router } from "express";
import { signup, signin, updateProfile } from "./controllers/authController";
import {
  createRoom,
  getRoomBySlug,
  getUserRooms,
} from "./controllers/roomController";
import { getChatsByRoomId } from "./controllers/chatController";
import { middleware } from "./middleware";

const router: Router = express.Router();

router.post("/api/signup", signup);
router.post("/api/signin", signin);
router.put("/api/user", middleware, updateProfile);
router.post("/api/room", middleware, createRoom);
router.get("/api/chats/:roomId", getChatsByRoomId);
router.get("/api/room/:slug", getRoomBySlug);
router.get("/api/rooms", middleware, getUserRooms);

export default router;
