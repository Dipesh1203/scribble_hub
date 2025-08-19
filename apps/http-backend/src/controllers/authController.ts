import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { JWT_SECRET } from "@repo/backend-common/config";
import { CreateUserSchema, SigninSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";

const saltRounds = 10;

export const signup = async (req: Request, res: Response) => {
  const parsed = CreateUserSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ message: "Invalid input", errors: parsed.error.errors });
    return;
  }
  const { email, password, name } = parsed.data;
  try {
    const existingUser = await prismaClient.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      res.status(409).json({ message: "Email already registered" });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await prismaClient.user.create({
      data: { email, password: hashedPassword, name },
    });
    res.status(201).json({
      data: { userId: user.id, name: user.name, email: user.email },
    });
  } catch (e: any) {
    if (e.code === "P2002" && e.meta?.target?.includes("email")) {
      res.status(409).json({ message: "Email already registered" });
      return;
    }
    res
      .status(500)
      .json({ message: typeof e === "string" ? e : (e as Error).message });
  }
};

export const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const data = { username: email, password };
  const parsedData = SigninSchema.safeParse(data);
  if (!parsedData.success) {
    res.status(401).json({ message: "Incorrect Input" });
    return;
  }
  try {
    const user = await prismaClient.user.findFirst({ where: { email } });
    if (!user) {
      res.status(403).json({ message: "Not authorized" });
      return;
    }
    const token = jwt.sign({ userId: user?.id }, JWT_SECRET);
    res.json({ data: { token, user } });
  } catch (e) {
    res.status(500).json({ message: { e } });
  }
};
