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

app.post("/signup", async (req, res) => {
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
    const user = await prismaClient.user.create({
      data: {
        email: parsedData.data?.username,
        password: hashedPassWord,
        name: parsedData.data.name,
      },
    });
    res.json({
      userId: user.id,
    });
  } catch (e) {
    res.status(500).json({
      message: { e },
    });
  }
});
app.post("/signin", async (req, res) => {
  const parsedData = SigninSchema.safeParse(req.body);

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
      where: { email: parsedData?.data?.username },
    });
    const token = jwt.sign({ userId: user?.id }, JWT_SECRET);
    res.json({
      JWT: token,
    });
  } catch (e) {
    res.status(500).json({
      message: { e },
    });
  }
});
app.post("/room", middleware, () => {});
