import { useSpotifyAuth } from "./hooks/useSpotifyAuth";
import LoginButton from "./components/LoginButton";
import RefreshButton from "./components/RefreshButton";
import LogoutButton from "./components/LogoutButton";
import UserProfile from "./components/UserProfile";
import OAuthInfo from "./components/OAuthInfo";
import ErrorDisplay from "./components/ErrorDisplay";
import "./App.css";
import { useQuery } from "@tanstack/react-query";
import { getPlaybackState } from "./service/getPlaybackState";
import PlaylistInfo from "./components/playlistInfo";

function App() {
  const {
    user,
    accessToken,
    refreshToken,
    expiresAt,
    isLoggedIn,
    error,
    loading,
    login,
    refreshAccessToken,
    logout,
  } = useSpotifyAuth();

  if (!isLoggedIn) {
    return (
      <div id="login">
        <h1>
          This is an example of the Authorization Code Flow with Proof Key for
          Code Exchange (PKCE)
        </h1>
        <LoginButton onLogin={login} loading={loading} />
        <ErrorDisplay error={error} />
      </div>
    );
  }

  return <PlaylistInfo />;

  return (
    <div id="loggedin">
      <UserProfile user={user} />
      <OAuthInfo
        accessToken={accessToken}
        refreshToken={refreshToken}
        expiresAt={expiresAt}
      />
      <RefreshButton onRefresh={refreshAccessToken} loading={loading} />
      <LogoutButton onLogout={logout} />
      <ErrorDisplay error={error} />
    </div>
  );
}

export default App;
