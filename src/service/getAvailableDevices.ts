import axios from "axios";

type Device = {
  id: string;
  name: string;
  type: string;
  is_active: boolean;
  is_restricted: boolean;
  volume_percent: number;
};

type GetAvailableDevicesResponse = {
  devices: Device[];
};

export const getAvailableDevices = async (token: string): Promise<Device[]> => {
  const { data } = await axios.get<GetAvailableDevicesResponse>(
    "https://api.spotify.com/v1/me/player/devices",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return data.devices;
};
