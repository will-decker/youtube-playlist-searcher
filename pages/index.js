import { useState } from "react";

export default function Search() {
  const [playlistId, setPlaylistId] = useState("");
  const [videos, setVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [nextPageToken, setNextPageToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (event) => {
    event.preventDefault();
    setError(null); // Reset error state before a new search

    try {
      const fetchURL = `/api/playlist?playlistId=${playlistId}`;
      console.log(fetchURL);
      const response = await fetch(fetchURL);
      console.log(response);
      if (!response.ok) {
        throw new Error("Failed to fetch playlist items");
      }
      setIsLoading(true);
      const data = await response.json();
      const videosWithUrl = data.items.map((item) => ({
        ...item,
        url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
      }));
      setVideos(videosWithUrl);
      setNextPageToken(data.nextPageToken);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLoadMore = async () => {
    try {
      const response = await fetch(
        `/api/playlist?playlistId=${playlistId}&pageToken=${nextPageToken}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch playlist items");
      }
      setIsLoading(true);
      const data = await response.json();
      const videosWithUrl = data.items.map((item) => ({
        ...item,
        url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
      }));
      setVideos(videos.concat(videosWithUrl));
      setNextPageToken(data.nextPageToken);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          value={playlistId}
          onChange={(e) => setPlaylistId(e.target.value)}
          placeholder="Playlist ID"
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2">
          Search
        </button>
      </form>

      {error && <div className="text-red-500">{error}</div>}

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search within playlist"
        className="border p-2 mb-4 w-full"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos
          .filter(
            (video) =>
              video.snippet.title
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) &&
              !video.snippet.title.toLowerCase().includes("deleted video") &&
              !video.snippet.title.toLowerCase().includes("private video")
          )
          .map((video, index) => (
            <div
              key={`${video.id}-${index}`}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={video.snippet.thumbnails?.medium?.url ?? ""}
                  alt={video.snippet.title}
                  className="w-full h-48 object-cover"
                />
              </a>
              <div className="p-4">
                <h2 className="text-lg font-medium text-gray-500">{video.snippet.title}</h2>
                {/* <p className="text-gray-500">{video.snippet.channelTitle}</p> */}
              </div>
            </div>
          ))}
      </div>

      <button
        onClick={handleLoadMore}
        disabled={isLoading || !nextPageToken}
        className={`bg-blue-500 text-white p-2 mt-4 ${
          isLoading || !nextPageToken ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isLoading ? "Loading..." : "Load more"}
      </button>
    </div>
  );
}
