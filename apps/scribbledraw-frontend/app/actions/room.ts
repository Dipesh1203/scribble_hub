import { BACKEND_URL } from "@repo/common/server";
import axios from "axios";

export const getRoomid = async (token: string | undefined) => {
  try {
    console.log("token ", token);
    const res = await axios.post(
      `${BACKEND_URL}/api/room`,
      {}, // No body data needed (you had headers here mistakenly)
      {
        headers: {
          Authorization: `Bearer ${token}`, // Correct placement
        },
      }
    );
    console.log("created");
    console.log(res);
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
    console.log("token ", token);
    console.log("slug ", slug);
    const res = await axios.get(`${BACKEND_URL}/api/room/${slug}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("created");
    console.log(res);
    return res.data;
  } catch (error) {
    console.error("Error creating room", error);
  }
};
