import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useSpotifyAuth } from "../hooks/useSpotifyAuth";
import { getPlaylist } from "../service/getPlaylist";
import { PlaylistItem } from "../service/getAllPlaylists";

type PlaylistModalProps = {
  playlist: PlaylistItem;
  onClose: () => void;
  onConfirm: () => void;
};

const PlaylistModal = ({
  playlist,
  onClose,
  onConfirm,
}: PlaylistModalProps) => {
  const { accessToken } = useSpotifyAuth();

  const {
    data: playlistData,
    fetchNextPage,
    isFetching,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["playlistTracks", playlist.id],
    queryFn: ({ pageParam = 1 }) => {
      if (accessToken) {
        return getPlaylist(playlist.id, accessToken, (pageParam - 1) * 100);
      }
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage?.items?.length === 100) {
        return allPages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!accessToken,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!playlistData || isFetching || !hasNextPage) return;
    fetchNextPage();
  }, [playlistData, isFetching, hasNextPage, fetchNextPage]);

  const allTracks =
    playlistData?.pages.flatMap((page) => page?.items ?? []) ?? [];

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-100 rounded-xl w-full max-w-2xl flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-4 p-6 border-b">
          {playlist.images[0] ? (
            <img
              src={playlist.images[0].url}
              alt={playlist.name}
              className="w-16 h-16 rounded object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🎵</span>
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold text-gray-900">{playlist.name}</h2>
            <p className="text-sm text-gray-600">
              {playlist.tracks.total} tracks
            </p>
          </div>
        </div>

        {/* Track list */}
        <div className="overflow-y-auto flex-1 p-4">
          {isFetching && allTracks.length === 0 ? (
            <p className="text-center text-gray-600 py-8">Loading tracks...</p>
          ) : (
            <ul className="divide-y">
              {allTracks.map((item, i) => (
                <li key={`${item.track.uri}-${i}`} className="py-3 px-2">
                  <p className="font-medium text-gray-900">{item.track.name}</p>
                  <p className="text-sm text-gray-600">
                    {item.track.artists.map((a) => a.name).join(", ")}
                  </p>
                </li>
              ))}
            </ul>
          )}
          {isFetching && allTracks.length > 0 && (
            <p className="text-center text-gray-400 text-sm py-2">
              Loading more...
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-400 text-gray-800 bg-white px-4 py-2 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            Select Playlist
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaylistModal;
