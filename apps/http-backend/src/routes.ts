import express, { Router } from "express";
import { signup, signin } from "./controllers/authController";
import { createRoom, getRoomBySlug } from "./controllers/roomController";
import { getChatsByRoomId } from "./controllers/chatController";
import { middleware } from "./middleware";

const router: Router = express.Router();

router.post("/api/signup", signup);
router.post("/api/signin", signin);
router.post("/api/room", middleware, createRoom);
router.get("/api/chats/:roomId", getChatsByRoomId);
router.get("/api/room/:slug", getRoomBySlug);

export default router;
