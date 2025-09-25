import axios from "axios";

export type GetPlaylistResponse = {
  items: {
    track: {
      name: string;
      album: {
        name: string;
      };
      artists: {
        name: string;
      }[];
      uri: string;
    };
  }[];
};

export const getPlaylist = async (
  playlistId: string,
  token: string,
  offset: number
) => {
  const searchParams = `fields=items(track.name,track.uri,track.album.name,track.artists(name))&offset=${offset}&limit=100`;

  const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?${searchParams}`;

  const response = await axios.get<GetPlaylistResponse>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
