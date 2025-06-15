"use client";
import { BACKEND_URL } from "@repo/common/server";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
// import styles from "./page.module.css";
import { useState } from "react";
import { Session } from "../api/auth/[...nextauth]/options";

export default function Home() {
  const [name, setName] = useState<string>("");
  const router = useRouter();
  const { data, status } = useSession();
  const session = data as Session;
  const createRoom = async () => {
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/room`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${session.token}`, // Include JWT
          },
        }
      );
      console.log("created");
      console.log(res);
      router.push(`/canvas/${res.data.roomId}`);
    } catch (error) {}
  };
  return (
    <div className="flex bg-slate-900 text-slate-50 w-screen h-screen justify-center items-center">
      <div>
        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          type="text"
          placeholder="Room Name"
        />
        <button
          className="bg-sky-400 rounded-sm p-1 px-3 mx-3 m-1"
          onClick={createRoom}
        >
          Create
        </button>
      </div>
    </div>
  );
}
