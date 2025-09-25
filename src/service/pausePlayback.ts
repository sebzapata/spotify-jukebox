import axios from "axios";

export const pausePlayback = async (token: string, deviceId: string) => {
  const url = `https://api.spotify.com/v1/me/player/pause?device_id=${deviceId}`;

  await axios.put(
    url,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
