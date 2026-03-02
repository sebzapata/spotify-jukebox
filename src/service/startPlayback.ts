import axios from "axios";

export const startPlayback = async (
  token: string,
  deviceId: string,
  contextUri: string,
) => {
  await axios.put(
    `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
    { context_uri: contextUri },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};
