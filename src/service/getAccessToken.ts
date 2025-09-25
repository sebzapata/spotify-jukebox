import axios from "axios";

export type AccessTokenResponse = {
  access_token: string;
  expires_in: number;
  token_type: string;
};

export type AccessTokenRequest = {
  grant_type: string;
  client_id: string;
  client_secret: string;
};

export const getAccessToken = async () => {
  const requestBody = {
    grant_type: "client_credentials",
    client_id: "60ec6414275d4b47a01f60b02b6775b5",
    client_secret: "d0c66ec559ea4794914ce4f59eaa0f75",
  };

  const response = await axios.post<AccessTokenResponse>(
    "https://accounts.spotify.com/api/token",
    requestBody,
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );

  return response.data;
};
