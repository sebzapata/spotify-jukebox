import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useSpotifyAuth } from "../hooks/useSpotifyAuth";
import {
  getAllPlaylists,
  GetAllPlaylistsResponse,
} from "../service/getAllPlaylists";

const PickPlaylistScreen = () => {
  const navigate = useNavigate();
  const { accessToken } = useSpotifyAuth();
  const [offset, setOffset] = useState(0);

  const {
    data: playlistsResponse,
    isLoading,
    error,
  } = useQuery<GetAllPlaylistsResponse>({
    queryKey: ["playlists", offset],
    queryFn: () => getAllPlaylists(accessToken!, offset),
    enabled: !!accessToken,
  });

  const handlePrevious = () => {
    if (playlistsResponse?.previous) {
      setOffset(Math.max(0, offset - 50));
    }
  };

  const handleNext = () => {
    if (playlistsResponse?.next) {
      setOffset(offset + 50);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 items-center min-h-screen justify-center">
        <h1 className="text-2xl font-bold">Pick a Playlist</h1>
        <p>Loading your playlists...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4 items-center min-h-screen justify-center">
        <h1 className="text-2xl font-bold">Pick a Playlist</h1>
        <p className="text-red-500">Error loading playlists: {String(error)}</p>
        <button
          onClick={() => navigate("/")}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 items-center min-h-screen p-8">
      <div className="w-full max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Pick a Playlist</h1>
          <button
            onClick={() => navigate("/")}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Back to Home
          </button>
        </div>

        {playlistsResponse && (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Showing {offset + 1} -{" "}
              {Math.min(offset + 50, playlistsResponse.total)} of{" "}
              {playlistsResponse.total} playlists
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
              {playlistsResponse.items.map((playlist) => (
                <div
                  key={playlist.id}
                  className="border rounded-lg p-4 hover:shadow-lg cursor-pointer transition-shadow"
                  onClick={() => console.log("Selected playlist:", playlist.id)}
                >
                  {playlist.images && playlist.images[0] ? (
                    <img
                      src={playlist.images[0].url}
                      alt={playlist.name}
                      className="w-full h-48 object-cover rounded mb-2"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 rounded mb-2 flex items-center justify-center">
                      <span
                        className="text-gray-500 w-3/4 text-center"
                        style={{ fontSize: "clamp(3rem, 12vw, 8rem)" }}
                      >
                        🎵
                      </span>
                    </div>
                  )}
                  <h3 className="font-semibold truncate">{playlist.name}</h3>
                  <p className="text-sm text-gray-600">
                    {playlist.tracks.total} tracks
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={handlePrevious}
                disabled={!playlistsResponse.previous}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <span className="text-sm text-gray-600">
                Page {Math.floor(offset / 50) + 1} of{" "}
                {Math.ceil(playlistsResponse.total / 50)}
              </span>

              <button
                onClick={handleNext}
                disabled={!playlistsResponse.next}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PickPlaylistScreen;
