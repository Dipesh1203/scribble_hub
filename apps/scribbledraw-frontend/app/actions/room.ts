import { BACKEND_URL } from "@repo/common/server";
import axios from "axios";

export const getRoomid = async (token: string | undefined) => {
  try {
    const res = await axios.post(
      `${BACKEND_URL}/api/room`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error creating room", error);
  }
};

export const getRoomidFromSlug = async (
  slug: string,
  token: string | undefined
) => {
  try {
    const res = await axios.get(`${BACKEND_URL}/api/room/${slug}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error creating room", error);
  }
};
