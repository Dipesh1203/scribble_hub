import { BACKEND_URL } from "@repo/common/server";

export const getUserRooms = async (token: string) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/rooms`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch rooms");
    }

    const data = await response.json();
    return data.rooms;
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return [];
  }
};
