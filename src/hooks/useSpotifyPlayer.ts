import { useEffect, useRef, useState } from "react";
import { transferPlayback } from "../service/transferPlayback";
import { getAvailableDevices } from "../service/getAvailableDevices";

const PLAYER_NAME = "Spotify Jukebox";

/** Poll GET /v1/me/player/devices until "Spotify Jukebox" appears, then return its REST API id. */
const resolveRestDeviceId = async (
  token: string,
  retries = 8,
  delayMs = 500,
): Promise<string | null> => {
  for (let i = 0; i < retries; i++) {
    const devices = await getAvailableDevices(token);
    const match = devices.find((d) => d.name === PLAYER_NAME);

    if (match) {
      return match.id;
    }

    await new Promise((res) => setTimeout(res, delayMs));
  }
  return null;
};

declare global {
  interface Window {
    Spotify: typeof Spotify;
    __spotifySDKReady: boolean;
    __initSpotifyPlayer: () => void;
  }
}

export const useSpotifyPlayer = (accessToken: string | null) => {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const playerRef = useRef<Spotify.Player | null>(null);
  const tokenRef = useRef<string | null>(accessToken);

  // Keep tokenRef current so the SDK always gets a fresh token
  useEffect(() => {
    tokenRef.current = accessToken;
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return;

    const initPlayer = () => {
      if (playerRef.current) return;

      const player = new window.Spotify.Player({
        name: "Spotify Jukebox",
        getOAuthToken: (cb) => cb(tokenRef.current ?? ""),
        volume: 0.8,
      });

      player.addListener("ready", (res) => {
        console.log("res", res);
        console.log(
          "Spotify Jukebox SDK ready, resolving device ID from API...",
        );
        resolveRestDeviceId(tokenRef.current!)
          .then((restId) => {
            if (!restId) {
              console.error(
                "Could not find Spotify Jukebox in available devices",
              );
              return;
            }
            console.log("Spotify Jukebox device_id:", restId);
            return transferPlayback(tokenRef.current!, restId).then(() => {
              setDeviceId(restId);
              setIsReady(true);
            });
          })
          .catch((err) =>
            console.error("Failed to initialise Spotify Jukebox device:", err),
          );
      });

      player.addListener("not_ready", () => {
        console.warn("Spotify Jukebox SDK not ready");
        setIsReady(false);
        setDeviceId(null);
      });

      player.connect();
      playerRef.current = player;
    };

    if (window.__spotifySDKReady) {
      initPlayer();
    } else {
      window.__initSpotifyPlayer = initPlayer;
    }

    return () => {
      playerRef.current?.disconnect();
      playerRef.current = null;
    };
  }, [accessToken]);

  return { deviceId, isReady };
};
