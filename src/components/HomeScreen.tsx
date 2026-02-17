import { useNavigate } from "react-router-dom";
import { useSpotifyAuth } from "../hooks/useSpotifyAuth";
import LogoutButton from "./LogoutButton";

type HomeScreenProps = {};

const HomeScreen = ({}: HomeScreenProps) => {
  const navigate = useNavigate();
  const { logout } = useSpotifyAuth();

  return (
    <div className="flex flex-col max-w-7xl gap-4 items-center">
      <div className="absolute top-4 right-4">
        <LogoutButton onLogout={logout} />
      </div>
      <div className="flex flex-col gap-4 items-center justify-center flex-1">
        <h1>Seb's Spotify Jukebox</h1>
        <div className="w-full flex justify-around">
          <button onClick={() => console.log("PTM")} className="w-1/3">
            Play the music
          </button>
          <button
            onClick={() => navigate("/pick-a-playlist")}
            className="w-1/3"
          >
            Pick a playlist
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
