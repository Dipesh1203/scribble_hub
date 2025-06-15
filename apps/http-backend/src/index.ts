import express from "express";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware";
import { JWT_SECRET } from "@repo/backend-common/config";
import {
  CreateUserSchema,
  SigninSchema,
  CreateRoomSchema,
} from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import cors from "cors";
import bcrypt from "bcrypt";

const app = express();
app.listen(3000);

app.use(express.json());
app.use(cors());

const saltRounds = 10;

app.post("/api/signup", async (req, res) => {
  console.log("==============================");
  console.log(req.body);
  const parsedData = CreateUserSchema.safeParse(req.body);

  if (!parsedData.success) {
    console.log(parsedData.error);
    res.status(401).json({
      message: "Incorrect Input",
    });
    return;
  }
  const hashedPassWord = bcrypt.hashSync(parsedData.data.password, saltRounds);
  try {
    console.log(parsedData);
    const data = {
      email: parsedData.data?.username,
      password: hashedPassWord,
      name: parsedData.data.name,
    };
    const user = await prismaClient.user.create({
      data,
    });
    const { password, ...dataFinal } = data;
    res.json({
      data: {
        userId: user.id,
        name: dataFinal.name,
        email: dataFinal.email,
      },
    });
  } catch (e) {
    res.status(500).json({
      message: { e },
    });
  }
});

app.post("/api/signin", async (req, res) => {
  console.log("==============================");
  console.log(req.body);
  const { email, password } = req.body;
  const data = { username: email, password };
  const parsedData = SigninSchema.safeParse(data);

  if (!parsedData.success) {
    console.log(parsedData.error);
    res.status(401).json({
      message: "Incorrect Input",
    });
    return;
  }

  try {
    console.log(parsedData);
    const user = await prismaClient.user.findFirst({
      where: { email },
    });
    if (!user) {
      res.status(403).json({
        message: "Not authorized",
      });
      return;
    }
    const token = jwt.sign({ userId: user?.id }, JWT_SECRET);
    console.log("user ", user);
    res.json({
      data: {
        token,
        user,
      },
    });
  } catch (e) {
    res.status(500).json({
      message: { e },
    });
  }
});

app.post("/api/room", middleware, async (req, res) => {
  const parsedData = CreateRoomSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      message: "Incorrect inputs",
    });
    return;
  }
  // @ts-ignore: TODO: Fix this
  const userId = req.userId;

  try {
    const room = await prismaClient.room.create({
      data: {
        slug: parsedData.data.name,
        adminId: userId,
      },
    });

    res.json({
      roomId: room.id,
    });
  } catch (e) {
    res.status(411).json({
      message: "Room already exists with this name",
    });
  }
});

app.get("/api/chats/:roomId", async (req, res) => {
  try {
    console.log("hitt", req.params.roomId);
    const roomId = Number(req.params.roomId);
    console.log(req.params.roomId);
    const messages = await prismaClient.chat.findMany({
      where: {
        roomId: roomId,
      },
      orderBy: {
        id: "desc",
      },
      take: 1000,
    });

    res.json({
      messages,
    });
  } catch (e) {
    console.log(e);
    res.json({
      messages: [],
    });
  }
});

app.get("/api/room/:slug", async (req, res) => {
  const slug = req.params.slug;
  const room = await prismaClient.room.findFirst({
    where: {
      slug,
    },
  });

  res.json({
    room,
  });
});
