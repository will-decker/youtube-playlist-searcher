import { useState } from "react";

export default function Search() {
  const [playlistId, setPlaylistId] = useState("");
  const [videos, setVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [nextPageToken, setNextPageToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (event) => {
    event.preventDefault();
    setError(null); // Reset error state before a new search

    try {
      const response = await fetch(`/api/playlist?playlistId=${playlistId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch playlist items");
      }
      setIsLoading(true);
      const data = await response.json();
      setVideos(data.items);
      setNextPageToken(data.nextPageToken);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLoadMore = async () => {
    try {
      const response = await fetch(`/api/playlist?playlistId=${playlistId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch playlist items");
      }
      setIsLoading(true);
      const data = await response.json();
      setVideos(videos.concat(data.items));
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
          .filter((video) =>
            video.snippet.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((video) => (
            <div key={video.id} className="mb-2">
              <img
                src={video.snippet.thumbnails.default.url}
                alt={video.snippet.title}
              />
              <p>{video.snippet.title}</p>
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
