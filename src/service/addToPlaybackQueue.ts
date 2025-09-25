import axios from "axios";

export const addToPlaybackQueue = async (
  token: string,
  deviceId: string,
  uri: string
) => {
  const queryParams = `?device_id=${deviceId}&uri=${uri}`;
  const url = `https://api.spotify.com/v1/me/player/queue${queryParams}`;

  await axios.post(
    url,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
