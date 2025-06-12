"use client";
import { BACKEND_URL } from "@repo/common/server";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
      router.push(`/temp-canvas/${res.data.roomId}`);
    } catch (error) {
      console.error("Error creating room", error);
    }
  };

  return (
    <div className="flex w-screen h-screen bg-slate-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-6 hidden md:flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
          <ul className="space-y-2">
            <li className="hover:text-sky-400 cursor-pointer">Home</li>
            <li className="hover:text-sky-400 cursor-pointer">Rooms</li>
            <li className="hover:text-sky-400 cursor-pointer">Settings</li>
          </ul>
        </div>
        <div className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Scribble Hub
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex flex-1 flex-col justify-center items-center px-6">
        {/* Profile Section */}
        {session?.user && (
          <div className="absolute top-4 right-4 text-right">
            <p className="text-sm font-medium">{session.user.name}</p>
            <p className="text-xs text-gray-400">{session.user.email}</p>
          </div>
        )}

        <div className="bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-center">Create a Room</h1>

          <div className="space-y-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Room Name"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              className="w-full bg-sky-500 hover:bg-sky-600 transition-colors text-white font-semibold py-2 rounded-lg"
              onClick={createRoom}
            >
              Create Room
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
