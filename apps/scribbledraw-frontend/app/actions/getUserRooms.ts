// import { process.env.NEXT_PUBLIC_API_URL} from "@repo/common/server";
import axios from "axios";

export const getUserRooms = async (token: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rooms`, {
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

export const updateUser = async (
  token: string | undefined,
  nameToSend: string,
  emailToSend: string,
  photoToSend: string
) => {
  try {
    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user`,
      { name: nameToSend, email: emailToSend, photo: photoToSend },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    console.error("Error Updating users:", error);
    return { error: error };
  }
};
