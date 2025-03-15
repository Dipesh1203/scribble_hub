"use client";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { useState } from "react";

export default function Home() {
  const [roomId, setRoomId] = useState<string>("");
  const router = useRouter();
  return (
    <div className="flex bg-slate-900 text-slate-50 w-screen h-screen justify-center items-center">
      <div>
        <input
          value={roomId}
          onChange={(e) => {
            setRoomId(e.target.value);
          }}
          type="text"
          placeholder="room id"
        />
        <button
          className="bg-sky-400 rounded-sm p-1 px-3 mx-3 m-1"
          onClick={() => {
            router.push(`/room/${roomId}`);
          }}
        >
          Join room
        </button>
      </div>
    </div>
  );
}
