import { useState, useEffect } from "react";

// Your client id from your app in the spotify dashboard:
// https://developer.spotify.com/dashboard/applications
const CLIENT_ID = "60ec6414275d4b47a01f60b02b6775b5";
const REDIRECT_URI = "http://127.0.0.1:8080/";

export const useSpotifyAuth = () => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("access_token") || null
  );
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refresh_token") || null
  );
  const [expiresAt, setExpiresAt] = useState(
    localStorage.getItem("expires_at") || null
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Utility functions
  const generateRandomString = (length) => {
    let text = "";
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

  const generateCodeChallenge = async (codeVerifier) => {
    const digest = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(codeVerifier)
    );

    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  };

  const generateUrlWithSearchParams = (url, params) => {
    const urlObject = new URL(url);
    urlObject.search = new URLSearchParams(params).toString();
    return urlObject.toString();
  };

  const addThrowErrorToFetch = async (response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw { response, error: await response.json() };
    }
  };

  // Main authentication functions
  const redirectToSpotifyAuthorizeEndpoint = async () => {
    const codeVerifier = generateRandomString(64);
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    window.localStorage.setItem("code_verifier", codeVerifier);

    window.location = generateUrlWithSearchParams(
      "https://accounts.spotify.com/authorize",
      {
        response_type: "code",
        client_id: CLIENT_ID,
        scope:
          "user-read-private user-read-email user-read-currently-playing user-read-playback-state user-modify-playback-state",
        code_challenge_method: "S256",
        code_challenge: codeChallenge,
        redirect_uri: REDIRECT_URI,
      }
    );
  };

  const exchangeToken = async (code) => {
    const codeVerifier = localStorage.getItem("code_verifier");
    setLoading(true);

    try {
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: new URLSearchParams({
          client_id: CLIENT_ID,
          grant_type: "authorization_code",
          code,
          redirect_uri: REDIRECT_URI,
          code_verifier: codeVerifier,
        }),
      });

      const data = await addThrowErrorToFetch(response);
      processTokenResponse(data);

      // Clear search query params in the url
      window.history.replaceState({}, document.title, "/");
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const refreshAccessToken = async () => {
    if (!refreshToken) return;

    setLoading(true);

    try {
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: new URLSearchParams({
          client_id: CLIENT_ID,
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        }),
      });

      const data = await addThrowErrorToFetch(response);
      processTokenResponse(data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const processTokenResponse = (data) => {
    const newAccessToken = data.access_token;
    const newRefreshToken = data.refresh_token;

    const t = new Date();
    const newExpiresAt = t.setSeconds(t.getSeconds() + data.expires_in);

    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    setExpiresAt(newExpiresAt);

    localStorage.setItem("access_token", newAccessToken);
    localStorage.setItem("refresh_token", newRefreshToken);
    localStorage.setItem("expires_at", newExpiresAt);

    getUserData(newAccessToken);
  };

  const getUserData = async (token = accessToken) => {
    if (!token) return;

    setLoading(true);

    try {
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsLoggedIn(true);
        setError(null);
      } else {
        const errorData = await response.json();
        throw errorData;
      }
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    setExpiresAt(null);
    setIsLoggedIn(false);
    setError(null);
  };

  const handleError = (error) => {
    console.error(error);
    setError({
      status: error.response?.status || 500,
      message:
        error.error?.error_description || error.message || "An error occurred",
    });
  };

  // Effect to handle initial load and URL code parameter
  useEffect(() => {
    const args = new URLSearchParams(window.location.search);
    const code = args.get("code");

    if (code) {
      // We have received the code from spotify and will exchange it for a access_token
      exchangeToken(code);
    } else if (accessToken && refreshToken && expiresAt) {
      // We are already authorized and reload our tokens from localStorage
      getUserData();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    user,
    accessToken,
    refreshToken,
    expiresAt,
    isLoggedIn,
    error,
    loading,
    login: redirectToSpotifyAuthorizeEndpoint,
    refreshAccessToken,
    logout,
  };
};
