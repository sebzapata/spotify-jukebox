import axios from "axios";

export type GetAllPlaylistsResponse = {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: PlaylistItem[];
};

export type PlaylistItem = {
  collaborative: boolean;
  description: string | null;
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  images: {
    height: number | null;
    url: string;
    width: number | null;
  }[];
  name: string;
  owner: {
    display_name: string;
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    type: string;
    uri: string;
  };
  primary_color: string | null;
  public: boolean;
  snapshot_id: string;
  tracks: {
    href: string;
    total: number;
  };
  items: {
    href: string;
    total: number;
  };
  type: string;
  uri: string;
};

export const getAllPlaylists = async (token: string, offset: number) => {
  const searchParams = `offset=${offset}&limit=50`;

  const url = `https://api.spotify.com/v1/me/playlists?${searchParams}`;

  const response = await axios.get<GetAllPlaylistsResponse>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
