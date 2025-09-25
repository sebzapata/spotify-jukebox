import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import "../App.css";
import { getAccessToken } from "../service/getAccessToken";
import { getPlaylist } from "../service/getPlaylist";
import { getPlaybackState } from "../service/getPlaybackState";
import { useSpotifyAuth } from "../hooks/useSpotifyAuth";
import { pausePlayback } from "../service/pausePlayback";
import { addToPlaybackQueue } from "../service/addToPlaybackQueue";

const PlaylistInfo = () => {
  const [currentPage, setCurrentPage] = useState(0);

  const playlistId = "3F35IFgftkY0qHVfCUZIks";

  const { accessToken } = useSpotifyAuth();

  const {
    data: playlistData,
    fetchNextPage,
    fetchPreviousPage,
    isFetching,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["getPlaylistData", accessToken, playlistId],
    queryFn: ({ pageParam = 1 }) => {
      console.log("calling again", pageParam);
      if (accessToken) {
        return getPlaylist(playlistId, accessToken, (pageParam - 1) * 100);
      }
    },
    getNextPageParam: (lastPage, allPages) => {
      // Only return next page if current page has 100 items (full page)
      if (lastPage?.items?.length === 100) {
        return allPages.length + 1;
      }
      return undefined; // No more pages
    },
    initialPageParam: 1,
    enabled: !!accessToken, // Only run when we have access token
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });

  const { data: deviceData } = useQuery({
    queryKey: ["getPlaybackState", accessToken],
    queryFn: () => {
      if (accessToken) {
        return getPlaybackState(accessToken);
      }
    },
  });

  // const { mutate: pausePlaybackFn } = useMutation({
  //   mutationFn: () => {
  //     if (accessToken && deviceData) {
  //       return pausePlayback(accessToken, deviceData?.device.id);
  //     }
  //     return Promise.resolve();
  //   },
  // });

  const { mutate: addToPlaybackQueueFn } = useMutation({
    mutationFn: (trackUri: string) => {
      if (accessToken && deviceData) {
        return addToPlaybackQueue(accessToken, deviceData?.device.id, trackUri);
      }
      return Promise.resolve();
    },
  });

  useEffect(() => {
    if (!playlistData || isFetching || !hasNextPage) return;

    // Auto-fetch next page if we have more data available
    fetchNextPage();
  }, [playlistData, isFetching, hasNextPage, fetchNextPage]);

  if (!playlistData) return null;

  return (
    <div>
      {/* <button onClick={() => pausePlaybackFn()}>Pause the music</button> */}
      {playlistData.pages[currentPage]?.items?.map((song) => (
        <li
          key={`${song.track.name} by ${song.track.artists
            .map((artist) => artist.name)
            .join(" & ")}`}
        >
          <div className="flex gap-4 items-center">
            <p>
              {`${song.track.name} by ${song.track.artists
                .map((artist) => artist.name)
                .join(" & ")} from the album ${song.track.album.name}`}
            </p>
            <button onClick={() => addToPlaybackQueueFn(song.track.uri)}>
              Add to queue
            </button>
          </div>
        </li>
      ))}

      <button
        onClick={() => {
          fetchPreviousPage();
          setCurrentPage(currentPage - 1);
        }}
      >
        Previous page
      </button>
      <button
        onClick={() => {
          fetchNextPage();
          setCurrentPage(currentPage + 1);
        }}
      >
        Next page
      </button>
    </div>
  );
};

export default PlaylistInfo;
