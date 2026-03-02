import axios from "axios";

export const transferPlayback = async (
  token: string,
  deviceId: string,
): Promise<void> => {
  await axios.put(
    "https://api.spotify.com/v1/me/player",
    { device_ids: [deviceId] },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};
