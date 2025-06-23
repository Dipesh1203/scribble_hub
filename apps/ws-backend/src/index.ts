import jwt, { JwtPayload } from "jsonwebtoken";
import { WebSocket, WebSocketServer } from "ws";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";

const wss = new WebSocketServer({ port: 3002 });

interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
}

const users: User[] = [];

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded == "string") {
      return null;
    }
    if (!decoded || !(decoded as JwtPayload).userId) {
      return null;
    }
    return decoded.userId;
  } catch (error) {
    return null;
  }
}
wss.on("connection", function connection(ws, request) {
  const url = request.url;
  if (!url) {
    return;
  }
  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";
  const userId = checkUser(token);
  console.log("connected", userId);
  if (userId == null) {
    ws.close();
    return null;
  }

  users.push({ ws, rooms: [], userId });

  ws.on("message", async function message(data) {
    console.log(data);
    const parsedData = JSON.parse(data.toString());
    console.log(parsedData);
    console.log(" message ", parsedData);
    if (parsedData.type === "join_room") {
      const user = users.find((x) => x.ws === ws);
      if (user) {
        // console.log("user found", user);
        user.rooms.push(parsedData?.roomId); // Ensure correct field name
        // console.log("User joined room:", parsedData?.roomId, users);
      }
    }
    if (parsedData.type === "leave_room") {
      const user = users.find((x) => x.ws === ws);
      if (!user) {
        return;
      }
      user.rooms = user.rooms.filter((x) => x === parsedData.room);
      console.log("leave room");
    }
    if (parsedData.type === "chat") {
      console.log("reached", parsedData);
      const roomId = parsedData.roomId;
      // const id = parsedData.id;
      const message = parsedData.message;
      const id = message.charId;
      console.log("data ", roomId, message);
      let data = await prismaClient.chat.create({
        data: {
          roomId: Number(roomId),
          message,
          userId,
        },
      });
      console.log("data created", data);
      users.forEach((user) => {
        if (user.rooms.includes(roomId)) {
          console.log("ping");
          user.ws.send(
            JSON.stringify({
              type: "chat",
              ...data,
            })
          );
        }
      });
    }
    if (parsedData.type === "update-roomchat") {
      console.log("reached", parsedData);

      const { roomId, message, id } = parsedData;

      if (!roomId || !message || !id) {
        console.error("Missing data:", { roomId, message, id });
        return;
      }

      try {
        const chatExists = await prismaClient.chat.findUnique({
          where: { id },
        });

        if (!chatExists) {
          console.error("Chat with id", id, "not found");
          return;
        }

        await prismaClient.chat.update({
          data: { message },
          where: { id },
        });

        users.forEach((user) => {
          if (user.rooms.includes(roomId)) {
            console.log("ping");
            user.ws.send(
              JSON.stringify({
                type: "chat",
                message,
                roomId,
              })
            );
          }
        });
      } catch (error) {
        console.error("Update failed:", error);
      }
    }

    if (parsedData.type === "delete-roomchat") {
      console.log("reached", parsedData);

      const { roomId, id } = parsedData;
      console.log("data ", roomId, id);
      if (!roomId || !id) {
        console.error("Missing data:", { roomId, id });
        return;
      }

      try {
        const chatExists = await prismaClient.chat.findUnique({
          where: { id },
        });

        if (!chatExists) {
          console.error("Chat with id", id, "not found");
          return;
        }

        await prismaClient.chat.delete({
          where: { id },
        });

        users.forEach((user) => {
          if (user.rooms.includes(roomId)) {
            console.log("ping");
            user.ws.send(
              JSON.stringify({
                type: "chat",
                roomId,
              })
            );
          }
        });
      } catch (error) {
        console.error("delete failed:", error);
      }
    }
  });
});
