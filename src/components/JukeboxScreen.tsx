import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSpotifyAuth } from "../hooks/useSpotifyAuth";
import { getPlaylist } from "../service/getPlaylist";
import { getPlaybackState } from "../service/getPlaybackState";
import { addToPlaybackQueue } from "../service/addToPlaybackQueue";
import LogoutButton from "./LogoutButton";
import { getPlaybackQueue } from "../service/getPlaybackQueue";

const JukeboxScreen = () => {
  const { playlistId } = useParams<{ playlistId: string }>();
  const navigate = useNavigate();
  const { state } = useLocation();
  const playlistName: string = state?.playlistName ?? "Playlist";
  const { accessToken, logout } = useSpotifyAuth();

  const {
    data: playlistData,
    fetchNextPage,
    isFetching,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["jukeboxPlaylist", accessToken, playlistId],
    queryFn: ({ pageParam = 1 }) => {
      if (accessToken && playlistId) {
        return getPlaylist(playlistId, accessToken, (pageParam - 1) * 100);
      }
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage?.items?.length === 100) {
        return allPages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!accessToken && !!playlistId,
    refetchOnWindowFocus: false,
  });

  const { data: deviceData } = useQuery({
    queryKey: ["getPlaybackState", accessToken],
    queryFn: () => {
      if (accessToken) {
        return getPlaybackState(accessToken);
      }
    },
  });

  const { data: playbackQueueData } = useQuery({
    queryKey: ["getPlaybackQueue", accessToken],
    queryFn: () => {
      if (accessToken) {
        return getPlaybackQueue(accessToken);
      }
    },
  });

  const { mutate: addToQueue } = useMutation({
    mutationFn: (trackUri: string) => {
      console.log("accessToken", accessToken);
      console.log("deviceData", deviceData);

      if (accessToken && deviceData) {
        return addToPlaybackQueue(accessToken, deviceData.device.id, trackUri);
      }

      return Promise.resolve();
    },
  });

  useEffect(() => {
    if (!playlistData || isFetching || !hasNextPage) return;

    fetchNextPage();
  }, [playlistData, isFetching, hasNextPage, fetchNextPage]);

  const allTracks =
    playlistData?.pages.flatMap((page) => page?.items ?? []) ?? [];

  return (
    <div className="flex flex-col gap-4 items-center min-h-screen p-8 w-4xl">
      <div className="w-full">
        <div className="grid grid-cols-3 items-center mb-6">
          <button
            onClick={() => navigate("/pick-a-playlist")}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 justify-self-start"
          >
            ← Change Playlist
          </button>
          <h1 className="text-2xl font-bold text-center">{playlistName}</h1>
          <div className="justify-self-end">
            <LogoutButton onLogout={logout} />
          </div>
        </div>

        {isFetching && allTracks.length === 0 ? (
          <p className="text-gray-500">Loading tracks...</p>
        ) : (
          <ul className="divide-y border rounded-lg">
            {allTracks.map((item, i) => (
              <li
                key={`${item.track.uri}-${i}`}
                className="flex items-center justify-between p-2"
              >
                <div className="flex items-baseline gap-2 min-w-0 w-full">
                  <p className="font-medium truncate shrink-0 max-w-2/3">
                    {item.track.name}
                  </p>
                  <p className="text-sm text-gray-300 truncate min-w-0">
                    {item.track.artists[0].name}
                  </p>
                </div>
                <button
                  onClick={() => addToQueue(item.track.uri)}
                  className="bg-green-500 text-white px-3 py-1.5 rounded hover:bg-green-600 text-sm flex-shrink-0 ml-4"
                >
                  Add to queue
                </button>
              </li>
            ))}
          </ul>
        )}

        {isFetching && allTracks.length > 0 && (
          <p className="text-center text-gray-400 text-sm py-2">
            Loading more tracks...
          </p>
        )}
      </div>
    </div>
  );
};

export default JukeboxScreen;
