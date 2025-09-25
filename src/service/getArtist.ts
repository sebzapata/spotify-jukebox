import axios from "axios";

export type GetArtistResponse = {
  external_urls: {
    spotify: string;
  };
  followers: {
    href: string | null;
    total: number;
  };
  genres: string[];
  href: string;
  id: string;
  images: {
    url: string;
    height: number;
    width: number;
  }[];
  name: string;
  popularity: number;
  type: string;
  uri: string;
};

export const getArtist = async (artistId: string, token: string) => {
  const url = `https://api.spotify.com/v1/artists/${artistId}`;

  const response = await axios.get<GetArtistResponse>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
