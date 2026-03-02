import axios from "axios";

type ExternalUrls = {
  spotify: string;
};

type Image = {
  url: string;
  height: number | null;
  width: number | null;
};

type Artist = {
  id: string;
  name: string;
  uri: string;
  href: string;
  type: string;
  external_urls: ExternalUrls;
};

type Album = {
  id: string;
  name: string;
  album_type: string;
  total_tracks: number;
  images: Image[];
  uri: string;
  href: string;
  release_date: string;
  release_date_precision: string;
  available_markets: string[];
  external_urls: ExternalUrls;
  artists: Artist[];
  type: string;
};

type Track = {
  type: "track";
  id: string;
  name: string;
  uri: string;
  href: string;
  duration_ms: number;
  explicit: boolean;
  popularity: number;
  preview_url: string | null;
  track_number: number;
  disc_number: number;
  is_local: boolean;
  available_markets: string[];
  album: Album;
  artists: Artist[];
  external_ids: { isrc: string };
  external_urls: ExternalUrls;
};

export type GetPlaybackQueueResponse = {
  currently_playing: Track | null;
  queue: Track[];
};

export const getPlaybackQueue = async (token: string) => {
  const response = await axios.get<GetPlaybackQueueResponse>(
    "https://api.spotify.com/v1/me/player/queue",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

// If track is in next 20 playing, disable add button. Track added to manual queue.
// Add 20 manual tracks. All API response manual queue. Add more tracks, not shown in API
//
