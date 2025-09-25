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
import LoginScreen from "./components/LoginScreen";

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginScreen loading={loading} login={login} />;
  }

  return (
    <div className="max-w-7xl mx-auto p-8 text-center min-h-screen">
      <div className="absolute top-4 right-4">
        <LogoutButton onLogout={logout} />
      </div>
      <PlaylistInfo />
    </div>
  );

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
